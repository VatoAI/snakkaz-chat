
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { encryptMessage } from "@/utils/encryption";
import { DecryptedMessage } from "@/types/message";

export const useGroupMessageSender = (
  currentUserId: string,
  groupId: string,
  memberIds: string[],
  onNewMessage: (message: DecryptedMessage) => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const handleSendGroupMessage = useCallback(async (
    e: React.FormEvent,
    message: string,
    mediaFile?: File
  ) => {
    e.preventDefault();
    
    if (!message.trim() && !mediaFile) {
      setSendError("Please enter a message or select a file");
      return false;
    }

    setIsLoading(true);
    try {
      // Get the group's encryption key
      const { data: groupEncryption } = await supabase
        .from('group_encryption')
        .select('session_key')
        .eq('group_id', groupId)
        .single();

      if (!groupEncryption?.session_key) {
        throw new Error("Group encryption key not found");
      }

      // Encrypt the message with the group's session key
      const { encryptedContent, key, iv } = await encryptMessage(
        message.trim(), 
        groupEncryption.session_key
      );

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUserId,
          group_id: groupId,
          encrypted_content: encryptedContent,
          encryption_key: key,
          iv: iv,
          is_encrypted: true
        });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error sending group message:', error);
      setSendError("Failed to send message");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, groupId]);

  return {
    isLoading,
    sendError,
    handleSendGroupMessage,
    clearError: () => setSendError(null)
  };
};
