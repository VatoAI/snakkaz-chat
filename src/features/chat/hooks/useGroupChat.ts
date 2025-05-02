import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';
import { useMessageReadStatus } from './message/useMessageReadStatus';
import { Group } from '@/types/groups';

export interface MessageContent {
  text?: string;
  mediaUrl?: string;
  mediaType?: string;
  thumbnailUrl?: string;
  ttl?: number;
  isEncrypted?: boolean;
}

export interface ChatMessage {
  id: string;
  content?: string;
  sender_id: string;
  senderId?: string;
  group_id?: string;
  groupId?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  is_edited?: boolean;
  isEdited?: boolean;
  is_deleted?: boolean;
  isDeleted?: boolean;
  is_pinned?: boolean;
  isPinned?: boolean;
  media_url?: string;
  mediaUrl?: string;
  media_type?: string;
  mediaType?: string;
  thumbnail_url?: string;
  thumbnailUrl?: string;
  ttl?: number;
  read_by?: string[];
  readBy?: string[];
  reply_to_id?: string;
  replyToId?: string;
  is_encrypted?: boolean;
  isEncrypted?: boolean;
}

export const useGroupChat = (groupId: string | undefined) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [group, setGroup] = useState<Group | null>(null);
  const { user } = useAuth();
  const { markMessageAsRead, markMessagesAsRead } = useMessageReadStatus();

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
      
      setMessages(data || []);
      
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
        const newMessages = [...data].reverse();
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
    
    // Convert the content object to a format compatible with the database
    const newMessage: Omit<ChatMessage, 'id'> = {
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
        return;
      }
      
      if (data?.[0]) {
        // Mark your own message as read
        await markMessageAsRead(data[0].id);
      }
    } catch (error) {
      console.error('Failed to send group message:', error);
    }
  }, [groupId, user, markMessageAsRead]);

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
      
      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: newContent, updated_at: new Date().toISOString(), is_edited: true }
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
            const newMessage = payload.new as ChatMessage;
            setMessages(prev => [...prev, newMessage]);
            
            // Mark new messages from others as read
            if (newMessage.sender_id !== user?.id) {
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
    loadMessages
  };
};

export default useGroupChat;
