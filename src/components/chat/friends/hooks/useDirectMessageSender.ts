import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DecryptedMessage } from '@/types/message';
import { v4 as uuidv4 } from 'uuid';

export const useDirectMessageSender = (
  currentUserId: string,
  receiverId: string,
  onNewMessage: (message: DecryptedMessage) => void
) => {
  const [sendError, setSendError] = useState<string | null>(null);

  const handleSendMessage = useCallback(
    async (content: string, encryptionKey?: string, iv?: string) => {
      setSendError(null);

      if (!currentUserId || !receiverId) {
        setSendError('Missing sender or receiver ID');
        return false;
      }

      const localMessage = createLocalMessage(content, encryptionKey, iv);
      onNewMessage(localMessage);

      try {
        const newMessage = {
          id: uuidv4(),
          content: content,
          sender_id: currentUserId,
          receiver_id: receiverId,
          created_at: new Date().toISOString(),
          encryption_key: encryptionKey,
          iv: iv,
          is_encrypted: !!encryptionKey,
        };

        const { error } = await supabase.from('direct_messages').insert([newMessage]);

        if (error) {
          console.error('Error sending direct message:', error);
          setSendError('Failed to send message');
          return false;
        }

        return true;
      } catch (error) {
        console.error('Error sending direct message:', error);
        setSendError('Failed to send message');
        return false;
      }
    },
    [currentUserId, receiverId, onNewMessage]
  );

  const createLocalMessage = useCallback((content: string, encryptionKey?: string, iv?: string): DecryptedMessage => {
    return {
      id: `local-${Date.now()}`,
      content,
      sender: {
        id: currentUserId,
        username: null,
        full_name: null,
        avatar_url: '/images/default-avatar.png'
      },
      created_at: new Date().toISOString(),
      receiver_id: receiverId,
      encryption_key: encryptionKey,
      iv: iv,
      is_encrypted: !!encryptionKey,
    };
  }, [currentUserId, receiverId]);

  return { sendError, handleSendMessage };
};
