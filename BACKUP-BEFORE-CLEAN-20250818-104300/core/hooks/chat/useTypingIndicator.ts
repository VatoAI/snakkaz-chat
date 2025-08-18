/**
 * useTypingIndicator Hook
 * 
 * A custom hook to manage and track typing indicators in chats
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseTypingIndicatorOptions {
  chatId: string;
  userId: string | null;
  chatType: 'private' | 'group' | 'global';
  recipientId?: string;
}

export function useTypingIndicator({
  chatId,
  userId,
  chatType,
  recipientId
}: UseTypingIndicatorOptions) {
  const [isTyping, setIsTyping] = useState(false);
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingUpdateRef = useRef<number>(0);

  // Clear typing timeout
  const clearTypingTimeout = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);

  // Set up typing indicator in database
  const setTypingStatus = useCallback(async (typing: boolean) => {
    if (!userId || !chatId) return;
    
    // Prevent too frequent updates (throttle to once per second)
    const now = Date.now();
    if (typing && now - lastTypingUpdateRef.current < 1000) {
      return;
    }
    
    lastTypingUpdateRef.current = now;
    
    try {
      const typingData: Record<string, any> = {
        user_id: userId,
        is_typing: typing,
        updated_at: new Date().toISOString(),
      };
      
      // Add appropriate fields based on chat type
      if (chatType === 'private' && recipientId) {
        typingData.chat_id = chatId;
        typingData.recipient_id = recipientId;
      } else if (chatType === 'group') {
        typingData.group_id = chatId;
      }
      
      const { error } = await supabase
        .from('typing_indicators')
        .upsert(typingData)
        .select();
      
      if (error) {
        console.error('Error updating typing indicator:', error);
      }
      
      setIsTyping(typing);
      
      // Auto-clear typing status after 5 seconds of inactivity
      if (typing) {
        clearTypingTimeout();
        typingTimeoutRef.current = setTimeout(() => {
          setTypingStatus(false);
        }, 5000);
      }
    } catch (err) {
      console.error('Error in setTypingStatus:', err);
    }
  }, [userId, chatId, chatType, recipientId, clearTypingTimeout]);
  
  // Set up subscription to recipient's typing status
  useEffect(() => {
    if (!chatId || !recipientId || chatType !== 'private') return;
    
    // Subscribe to changes in recipient's typing status
    const typingSubscription = supabase
      .channel(`typing-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_indicators',
          filter: `recipient_id=eq.${userId} AND user_id=eq.${recipientId}`
        },
        (payload) => {
          setIsRecipientTyping(payload.new.is_typing);
        }
      )
      .subscribe();
    
    return () => {
      typingSubscription.unsubscribe();
      clearTypingTimeout();
    };
  }, [chatId, userId, recipientId, chatType, clearTypingTimeout]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Ensure typing status is set to false when component unmounts
      if (isTyping) {
        setTypingStatus(false);
      }
      clearTypingTimeout();
    };
  }, [isTyping, setTypingStatus, clearTypingTimeout]);
  
  return {
    isTyping,
    isRecipientTyping,
    setTypingStatus
  };
}

export default useTypingIndicator;
