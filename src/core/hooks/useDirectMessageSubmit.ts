import { useCallback } from 'react';
import { useAppEncryption } from '@/contexts/AppEncryptionContext';
import { nanoid } from 'nanoid';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

/**
 * Hook for handling message form submission in direct messages
 */
export const useDirectMessageSubmit = () => {
  const { user } = useAuth();
  const { encryptMessage, setMessageExpiration } = useAppEncryption();

  return useCallback(async (
    content: string, 
    receiverId: string, 
    options: {
      mediaUrl?: string, 
      mediaType?: string,
      ttl?: number | null  // Time-to-live in seconds (null = permanent)
    } = {}
  ) => {
    if (!user || !content.trim()) return null;

    try {
      const messageId = nanoid();
      const conversationId = [user.id, receiverId].sort().join('_');

      // Always encrypt messages with E2EE (Signal-inspired approach)
      const encryptedContent = await encryptMessage(content, conversationId);

      const message = {
        id: messageId,
        sender_id: user.id,
        receiver_id: receiverId,
        encrypted_content: encryptedContent.ciphertext,
        encryption_key: encryptedContent.encryption_key,
        iv: encryptedContent.iv,
        media_url: options.mediaUrl || null,
        media_type: options.mediaType || null,
        created_at: new Date().toISOString(),
        read: false,
        conversation_id: conversationId
      };

      const { error } = await supabase
        .from('messages')
        .insert([message]);

      if (error) throw error;

      // Set message expiration if TTL is provided (Wickr/Signal-inspired ephemerality)
      if (options.ttl && options.ttl > 0) {
        await setMessageExpiration(messageId, options.ttl);
      }

      return messageId;
    } catch (error) {
      console.error('Error submitting message:', error);
      return null;
    }
  }, [user, encryptMessage, setMessageExpiration]);
};