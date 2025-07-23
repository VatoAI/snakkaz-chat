
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTypingIndicator = (currentUserId: string | null, friendId: string | null) => {
  const [peerIsTyping, setPeerIsTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (!currentUserId || !friendId) return;

    // Subscribe to the typing indicators channel
    const channel = supabase
      .channel(`typing:${currentUserId}-${friendId}`)
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload.senderId === friendId) {
          setPeerIsTyping(true);
          
          // Clear any existing timeout
          if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
          }
          
          // Set timeout to clear typing indicator after 3 seconds
          typingTimeout.current = setTimeout(() => {
            setPeerIsTyping(false);
          }, 3000);
        }
      })
      .subscribe();
    
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
      supabase.removeChannel(channel);
    };
  }, [currentUserId, friendId]);
  
  // Function to broadcast typing event to the other user
  const startTyping = useCallback(() => {
    if (!currentUserId || !friendId) return;
    
    supabase
      .channel(`typing:${friendId}-${currentUserId}`)
      .send({
        type: 'broadcast',
        event: 'typing',
        payload: { senderId: currentUserId }
      });
  }, [currentUserId, friendId]);
  
  return {
    peerIsTyping,
    startTyping
  };
};
