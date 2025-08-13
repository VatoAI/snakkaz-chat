
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DecryptedMessage } from "@/types/message";

export const useReadReceipts = (
  currentUserId: string | null, 
  friendId: string | null,
  messages: DecryptedMessage[] = []
) => {
  const [readMessageIds, setReadMessageIds] = useState<Set<string>>(new Set());

  // Setup real-time subscription to track when messages are read
  useEffect(() => {
    if (!currentUserId || !friendId) return;

    // Setup channel subscription for read receipt updates
    const channel = supabase
      .channel('read-receipts-channel')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'messages',
          filter: `sender_id=eq.${currentUserId}`
        }, 
        (payload) => {
          const updatedMessage = payload.new as any;
          if (updatedMessage.read_at) {
            setReadMessageIds(prev => new Set([...prev, updatedMessage.id]));
          }
        }
      )
      .subscribe();

    // Initialize with already read messages
    const initialReadIds = new Set(
      messages
        .filter(msg => 
          msg.sender.id === currentUserId && 
          msg.read_at !== null
        )
        .map(msg => msg.id)
    );
    setReadMessageIds(initialReadIds);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, friendId, messages]);

  // Function to check if a specific message has been read
  const isMessageRead = useCallback((messageId: string) => {
    return readMessageIds.has(messageId);
  }, [readMessageIds]);

  // Function to mark messages from the friend as read
  const markMessagesAsRead = useCallback(async () => {
    if (!currentUserId || !friendId) return;
    
    // Find unread messages from this friend
    const unreadMessages = messages.filter(msg => 
      msg.sender.id === friendId && 
      !msg.read_at && 
      !msg.is_deleted
    );
    
    if (unreadMessages.length === 0) return;
    
    // Mark messages as read in batches to avoid too many requests
    try {
      // Call the server function to mark messages as read
      await Promise.all(unreadMessages.map(async (msg) => {
        await supabase.rpc('mark_message_as_read', { message_id: msg.id });
      }));
      
      console.log(`Marked ${unreadMessages.length} messages as read`);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [currentUserId, friendId, messages]);
  
  return { isMessageRead, markMessagesAsRead };
};
