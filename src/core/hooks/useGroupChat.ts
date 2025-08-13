
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';
import { useMessageReadStatus } from './message/useMessageReadStatus';
import { Group } from '@/types/groups';
import type { ChatMessage, MessageContent } from '@/types/messages';
import { normalizeMessage } from '@/types/messages';
import { messageQueue, QueuedMessage } from '@/services/messageQueue';
import { useToast } from '@/hooks/use-toast';

// Re-export the imported types for backward compatibility
export type { ChatMessage, MessageContent };

export const useGroupChat = (groupId: string | undefined) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [group, setGroup] = useState<Group | null>(null);
  const [offlineIndicator, setOfflineIndicator] = useState<boolean>(false);
  const { user } = useAuth();
  const { markMessageAsRead, markMessagesAsRead } = useMessageReadStatus();
  const { toast } = useToast();

  // Register message queue callback for group messages
  useEffect(() => {
    messageQueue.registerSendCallback('group', async (message: QueuedMessage) => {
      if (!message.groupId || message.groupId !== groupId) return false;

      try {
        // Use the internal sendToSupabase function to send the queued message
        const result = await sendToSupabase(message.content);
        return !!result;
      } catch (error) {
        console.error('Failed to send queued message:', error);
        return false;
      }
    });

    // Network status monitoring
    const handleOnline = () => {
      setOfflineIndicator(false);
      toast({
        title: "Tilkoblet igjen",
        description: "Du er nå tilkoblet og meldinger vil bli sendt.",
      });
    };

    const handleOffline = () => {
      setOfflineIndicator(true);
      toast({
        title: "Frakoblet",
        description: "Du er nå frakoblet. Meldinger vil bli lagret og sendt når du er tilkoblet igjen.",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [groupId, toast]);

  // Load group details
  const loadGroup = useCallback(async () => {
    if (!groupId) return;
    
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();
      
      if (error) {
        console.error('Error fetching group details:', error);
        return;
      }
      
      setGroup(data as Group);
    } catch (error) {
      console.error('Failed to fetch group details:', error);
    }
  }, [groupId]);

  const fetchMessages = useCallback(async () => {
    if (!groupId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching group messages:', error);
        return;
      }
      
      // Normalize messages using our utility function to ensure consistent property access
      const normalizedMessages = (data || []).map(normalizeMessage);
      
      // Add any pending offline messages from the queue
      const queuedMessages = messageQueue.getQueuedMessagesForGroup(groupId);
      
      // Convert queued messages to the same format as server messages
      const pendingMessages: ChatMessage[] = queuedMessages.map(qMsg => ({
        id: qMsg.id,
        content: qMsg.content.text,
        senderId: user?.id || '',
        groupId: qMsg.groupId,
        createdAt: new Date(qMsg.timestamp),
        isEdited: false,
        isPending: true, // Mark as pending for UI indication
        mediaUrl: qMsg.content.mediaUrl,
        mediaType: qMsg.content.mediaType,
      }));
      
      // Combine and sort all messages by timestamp
      setMessages([...normalizedMessages, ...pendingMessages].sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateA.getTime() - dateB.getTime();
      }));
      
      // Mark all fetched messages as read
      if (data?.length && user?.id) {
        const messageIds = data.map(msg => msg.id);
        await markMessagesAsRead(messageIds);
      }
    } catch (error) {
      console.error('Failed to fetch group messages:', error);
    } finally {
      setLoading(false);
    }
  }, [groupId, user?.id, markMessagesAsRead]);

  // Internal function to send message to Supabase
  const sendToSupabase = async (content: MessageContent) => {
    if (!groupId || !user) return null;
    
    // Use snake_case for the database but camelCase for our application
    const newMessage: Record<string, any> = {
      sender_id: user.id,
      group_id: groupId,
      created_at: new Date().toISOString(),
    };
    
    // Add content based on the type of message
    if (content.text) {
      newMessage.content = content.text;
    }
    
    if (content.mediaUrl) {
      newMessage.media_url = content.mediaUrl;
      newMessage.media_type = content.mediaType || 'image';
    }
    
    if (content.thumbnailUrl) {
      newMessage.thumbnail_url = content.thumbnailUrl;
    }
    
    if (content.ttl) {
      newMessage.ttl = content.ttl;
    }
    
    if (content.isEncrypted) {
      newMessage.is_encrypted = content.isEncrypted;
    }
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([newMessage])
        .select();
      
      if (error) {
        console.error('Error sending group message:', error);
        return null;
      }
      
      if (data?.[0]) {
        // Mark your own message as read
        await markMessageAsRead(data[0].id);
        return data[0];
      }
      return null;
    } catch (error) {
      console.error('Failed to send group message:', error);
      throw error;
    }
  };

  // Load more messages with pagination
  const loadMessages = useCallback(async (limit: number = 20) => {
    if (!groupId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error loading more messages:', error);
        return;
      }
      
      if (data) {
        // Reverse to get chronological order and append to existing messages
        // Use normalizeMessage to ensure consistent property access
        const newMessages = [...data].reverse().map(normalizeMessage);
        setMessages(prev => [...prev, ...newMessages]);
      }
    } catch (error) {
      console.error('Failed to load more messages:', error);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  const sendMessage = useCallback(async (content: MessageContent) => {
    if (!groupId || !user) return;
    
    // For immediate UI feedback, create a temporary message
    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      content: content.text,
      senderId: user.id,
      groupId: groupId,
      createdAt: new Date(),
      isPending: true,
      mediaUrl: content.mediaUrl,
      mediaType: content.mediaType,
    };
    
    // Add to UI immediately
    setMessages(prev => [...prev, tempMessage]);
    
    // Check if we're offline
    if (!navigator.onLine) {
      // Queue the message for later sending
      messageQueue.addToQueue('group', groupId, undefined, content);
      
      toast({
        title: "Melding lagret",
        description: "Du er offline. Meldingen vil bli sendt når du er tilkoblet igjen.",
      });
      
      return;
    }
    
    try {
      const sentMessage = await sendToSupabase(content);
      
      if (sentMessage) {
        // Replace the temporary message with the real one
        setMessages(prev => 
          prev.filter(m => m.id !== tempMessage.id).concat(normalizeMessage(sentMessage))
        );
      } else {
        // If send failed but we're online, try to queue
        messageQueue.addToQueue('group', groupId, undefined, content);
        
        toast({
          title: "Kunne ikke sende melding",
          description: "Meldingen er lagret og vil bli forsøkt sendt på nytt.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // If there was an error, queue the message
      messageQueue.addToQueue('group', groupId, undefined, content);
      
      toast({
        title: "Feil ved sending",
        description: "Meldingen er lagret og vil bli forsøkt sendt på nytt.",
        variant: "destructive"
      });
    }
  }, [groupId, user, toast]);

  // Edit a message
  const editMessage = useCallback(async (messageId: string, newContent: string) => {
    if (!groupId || !user) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .update({ 
          content: newContent,
          updated_at: new Date().toISOString(),
          is_edited: true
        })
        .eq('id', messageId)
        .eq('sender_id', user.id); // Only allow editing own messages
      
      if (error) {
        console.error('Error editing message:', error);
        return;
      }
      
      // Update local state with normalized message
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? normalizeMessage({
              ...msg,
              content: newContent,
              updated_at: new Date().toISOString(),
              is_edited: true
            })
          : msg
      ));
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  }, [groupId, user]);

  // Delete a message
  const deleteMessage = useCallback(async (messageId: string) => {
    if (!groupId || !user) return;
    
    try {
      // We do a soft delete by setting is_deleted flag
      const { error } = await supabase
        .from('messages')
        .update({ 
          is_deleted: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('sender_id', user.id); // Only allow deleting own messages
      
      if (error) {
        console.error('Error deleting message:', error);
        return;
      }
      
      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, is_deleted: true, updated_at: new Date().toISOString() }
          : msg
      ));
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  }, [groupId, user]);

  // React to a message
  const reactToMessage = useCallback(async (messageId: string, emoji: string) => {
    if (!groupId || !user) return;
    
    try {
      // First check if user already reacted with this emoji
      const { data: existingReaction, error: fetchError } = await supabase
        .from('message_reactions')
        .select('*')
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('emoji', emoji)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error('Error fetching reactions:', fetchError);
        return;
      }
      
      if (existingReaction) {
        // Remove the reaction
        const { error } = await supabase
          .from('message_reactions')
          .delete()
          .eq('id', existingReaction.id);
          
        if (error) {
          console.error('Error removing reaction:', error);
        }
      } else {
        // Add the reaction
        const { error } = await supabase
          .from('message_reactions')
          .insert([{
            message_id: messageId,
            user_id: user.id,
            emoji,
            created_at: new Date().toISOString()
          }]);
          
        if (error) {
          console.error('Error adding reaction:', error);
        }
      }
      
      // We would update local state here, but since reactions are complex,
      // we'll rely on the realtime subscription to update the UI
    } catch (error) {
      console.error('Failed to react to message:', error);
    }
  }, [groupId, user]);

  // Reply to a message
  const replyToMessage = useCallback(async (replyToId: string, content: string) => {
    if (!groupId || !user) return;
    
    const newMessage = {
      content,
      sender_id: user.id,
      group_id: groupId,
      created_at: new Date().toISOString(),
      reply_to_id: replyToId
    };
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([newMessage])
        .select();
      
      if (error) {
        console.error('Error sending reply:', error);
        return;
      }
      
      if (data?.[0]) {
        // Mark your own message as read
        await markMessageAsRead(data[0].id);
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  }, [groupId, user, markMessageAsRead]);

  useEffect(() => {
    fetchMessages();
    loadGroup();
    
    // Subscribe to new messages
    if (groupId) {
      const subscription = supabase
        .channel('group_messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `group_id=eq.${groupId}`,
          },
          async (payload) => {
            // Normalize message from realtime subscription
            const newMessage = normalizeMessage(payload.new);
            setMessages(prev => [...prev, newMessage]);
            
            // Mark new messages from others as read
            if (newMessage.senderId !== user?.id && newMessage.sender_id !== user?.id) {
              await markMessageAsRead(newMessage.id);
            }
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [groupId, fetchMessages, loadGroup, user?.id, markMessageAsRead]);
  
  return { 
    group, 
    messages, 
    loading, 
    sendMessage, 
    loadGroup,
    editMessage,
    deleteMessage,
    reactToMessage,
    replyToMessage,
    loadMessages,
    offlineIndicator
  };
};

export default useGroupChat;
