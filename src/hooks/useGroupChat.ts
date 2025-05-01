
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';
import { useMessageReadStatus } from './message/useMessageReadStatus';

export const useGroupChat = (groupId: string | undefined) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { markMessageAsRead, markMessagesAsRead } = useMessageReadStatus();

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

  const sendMessage = useCallback(async (content: string) => {
    if (!groupId || !user) return;
    
    const newMessage = {
      content,
      sender_id: user.id,
      group_id: groupId,
      created_at: new Date().toISOString(),
    };
    
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

  useEffect(() => {
    fetchMessages();
    
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
            const newMessage = payload.new;
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
  }, [groupId, fetchMessages, user?.id, markMessageAsRead]);
  
  return { messages, loading, sendMessage };
};

export default useGroupChat;
