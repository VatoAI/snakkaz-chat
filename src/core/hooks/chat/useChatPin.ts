/**
 * useChatPin Hook
 * 
 * A custom hook to manage pinned messages in the Snakkaz Chat application
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import usePinMessage from './usePinMessage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { DecryptedMessage } from '@/types/message';

interface UseChatPinOptions {
  chatId: string | null;
  chatType: 'private' | 'group' | 'global';
  encryptionKey?: string;
}

export function useChatPin({ chatId, chatType, encryptionKey }: UseChatPinOptions) {
  const [pinnedMessages, setPinnedMessages] = useState<DecryptedMessage[]>([]);
  const [pinnedMessageIds, setPinnedMessageIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Initialize the usePinMessage hook
  const { pinMessage, unpinMessage, isPinning, error: pinError } = usePinMessage({
    chatType,
    chatId: chatId ?? undefined,
    currentUser: user,
    encryptionKey,
    onSuccess: (messageId, pinned) => {
      if (pinned) {
        toast({
          title: 'Message pinned',
          description: 'The message has been pinned to this chat',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Message unpinned',
          description: 'The message has been removed from pinned messages',
          variant: 'default',
        });
        
        // Remove from pinned messages state
        setPinnedMessages(prev => prev.filter(msg => msg.id !== messageId));
        setPinnedMessageIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(messageId);
          return newSet;
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to pin/unpin message: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Get table name based on chat type
  const getTableName = useCallback(() => {
    switch (chatType) {
      case 'private':
        return 'private_chat_messages';
      case 'group':
        return 'group_chat_messages';
      case 'global':
        return 'global_chat_messages';
      default:
        throw new Error(`Invalid chat type: ${chatType}`);
    }
  }, [chatType]);

  // Get ID field name based on chat type
  const getIdFieldName = useCallback(() => {
    switch (chatType) {
      case 'private':
        return 'chat_id';
      case 'group':
        return 'group_id';
      case 'global':
        return ''; // Global doesn't have a specific ID field
      default:
        throw new Error(`Invalid chat type: ${chatType}`);
    }
  }, [chatType]);

  // Fetch pinned messages
  const fetchPinnedMessages = useCallback(async () => {
    if (!chatId && chatType !== 'global') {
      setPinnedMessages([]);
      setPinnedMessageIds(new Set());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const tableName = getTableName();
      const idFieldName = getIdFieldName();
      
      // Build query based on chat type
      let query = supabase
        .from(tableName)
        .select('*')
        .eq('pinned', true);
      
      // Add chat/group ID condition if applicable
      if (idFieldName && chatId) {
        query = query.eq(idFieldName, chatId);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        // Process data if needed (decrypt, etc.)
        const processedPinnedMessages = data as DecryptedMessage[];
        setPinnedMessages(processedPinnedMessages);
        
        // Create a Set of pinned message IDs for easy reference
        const pinnedIds = new Set(processedPinnedMessages.map(msg => msg.id));
        setPinnedMessageIds(pinnedIds);
      }
    } catch (err) {
      console.error('Error fetching pinned messages:', err);
      toast({
        title: 'Error',
        description: 'Failed to load pinned messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [chatId, chatType, getIdFieldName, getTableName, toast]);

  // Listen for pinned message changes
  useEffect(() => {
    fetchPinnedMessages();

    // Set up subscription for real-time updates
    const tableName = getTableName();
    const idFieldName = getIdFieldName();
    
    let subscription: any;
    
    if (chatType !== 'global' && !chatId) {
      // Don't subscribe if not in a specific chat/group
      return;
    }

    // Create the subscription
    const setupSubscription = async () => {
      let subscriptionFilter = supabase
        .channel(`pinned-messages-${tableName}-${chatId || 'global'}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: tableName,
            filter: 'pinned=eq.true'
          },
          (payload) => {
            // Handle changes to pinned messages
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              const newMsg = payload.new as DecryptedMessage;
              
              // Only process if it matches our chat/group ID
              if (idFieldName && chatId && newMsg[idFieldName as keyof typeof newMsg] !== chatId) {
                return;
              }
              
              // Check if message exists in our state, update if yes, add if no
              setPinnedMessages(prev => {
                const exists = prev.some(msg => msg.id === newMsg.id);
                if (exists) {
                  return prev.map(msg => msg.id === newMsg.id ? newMsg : msg);
                } else {
                  return [...prev, newMsg];
                }
              });
              
              setPinnedMessageIds(prev => {
                const newSet = new Set(prev);
                newSet.add(newMsg.id);
                return newSet;
              });
            }
            else if (payload.eventType === 'DELETE') {
              const deletedMsg = payload.old as DecryptedMessage;
              
              // Remove from state
              setPinnedMessages(prev => prev.filter(msg => msg.id !== deletedMsg.id));
              setPinnedMessageIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(deletedMsg.id);
                return newSet;
              });
            }
          }
        );
        
      // Add filter for specific chat/group if applicable
      if (idFieldName && chatId) {
        subscriptionFilter = subscriptionFilter.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: tableName,
            filter: `${idFieldName}=eq.${chatId}`
          },
          () => {
            // Refresh pinned messages when any message in this chat changes
            // (in case the pin status changes)
            fetchPinnedMessages();
          }
        );
      }
      
      // Subscribe
      subscription = subscriptionFilter.subscribe();
    };
    
    setupSubscription();
    
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [chatId, chatType, fetchPinnedMessages, getIdFieldName, getTableName]);

  return {
    pinnedMessages,
    pinnedMessageIds,
    isPinning,
    isLoading,
    pinMessage,
    unpinMessage,
    error: pinError,
    refreshPinnedMessages: fetchPinnedMessages
  };
}

export default useChatPin;
