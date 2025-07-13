/**
 * usePinMessage Hook
 * 
 * A hook to handle pinning and unpinning messages in different chat contexts
 * (private, group, global). Supports encryption and security management.
 */

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { encryptMessage } from '@/utils/encryption/message-encryption';

interface UsePinMessageOptions {
  chatType: 'private' | 'group' | 'global';
  chatId?: string;
  currentUser: User | null;
  encryptionKey?: string;
  onSuccess?: (messageId: string, pinned: boolean) => void;
  onError?: (error: Error) => void;
}

interface PinMessageResult {
  pinMessage: (messageId: string) => Promise<boolean>;
  unpinMessage: (messageId: string) => Promise<boolean>;
  isPinning: boolean;
  error: Error | null;
}

export function usePinMessage({
  chatType,
  chatId,
  currentUser,
  encryptionKey,
  onSuccess,
  onError
}: UsePinMessageOptions): PinMessageResult {
  const [isPinning, setIsPinning] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get table name based on chat type
  const getTableName = () => {
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
  };

  // Get ID field name based on chat type
  const getIdFieldName = () => {
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
  };

  // Pin a message
  const pinMessage = async (messageId: string): Promise<boolean> => {
    if (!currentUser) {
      const err = new Error('You must be logged in to pin messages');
      setError(err);
      onError?.(err);
      return false;
    }

    if (chatType !== 'global' && !chatId) {
      const err = new Error('Chat ID is required for pinning messages in private or group chats');
      setError(err);
      onError?.(err);
      return false;
    }

    setIsPinning(true);
    setError(null);

    try {
      const tableName = getTableName();
      const idFieldName = getIdFieldName();

      // First check if message exists
      const { data: messageData, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', messageId)
        .single();

      if (fetchError || !messageData) {
        throw new Error('Message not found');
      }

      // Create pinning metadata
      const pinnedMetadata = {
        pinned_by: currentUser.id,
        pinned_at: new Date().toISOString(),
      };

      // Encrypt pinning metadata if needed
      let pinnedByData = pinnedMetadata.pinned_by;
      if (encryptionKey) {
        try {
          pinnedByData = await encryptMessage(
            pinnedMetadata.pinned_by, 
            encryptionKey
          );
        } catch (encryptError) {
          console.error('Failed to encrypt pinning metadata:', encryptError);
          // Continue with unencrypted data as a fallback
        }
      }

      // Build update query based on chat type
      let query = supabase
        .from(tableName)
        .update({
          pinned: true,
          pinned_by: pinnedByData,
          pinned_at: pinnedMetadata.pinned_at
        })
        .eq('id', messageId);

      // Add chat/group ID condition if applicable
      if (idFieldName && chatId) {
        query = query.eq(idFieldName, chatId);
      }

      const { error: updateError } = await query;

      if (updateError) {
        throw updateError;
      }

      onSuccess?.(messageId, true);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error while pinning message');
      console.error('Error pinning message:', error);
      setError(error);
      onError?.(error);
      return false;
    } finally {
      setIsPinning(false);
    }
  };

  // Unpin a message
  const unpinMessage = async (messageId: string): Promise<boolean> => {
    if (!currentUser) {
      const err = new Error('You must be logged in to unpin messages');
      setError(err);
      onError?.(err);
      return false;
    }

    if (chatType !== 'global' && !chatId) {
      const err = new Error('Chat ID is required for unpinning messages in private or group chats');
      setError(err);
      onError?.(err);
      return false;
    }

    setIsPinning(true);
    setError(null);

    try {
      const tableName = getTableName();
      const idFieldName = getIdFieldName();

      // Build update query based on chat type
      let query = supabase
        .from(tableName)
        .update({
          pinned: false,
          pinned_by: null,
          pinned_at: null
        })
        .eq('id', messageId);

      // Add chat/group ID condition if applicable
      if (idFieldName && chatId) {
        query = query.eq(idFieldName, chatId);
      }

      const { error: updateError } = await query;

      if (updateError) {
        throw updateError;
      }

      onSuccess?.(messageId, false);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error while unpinning message');
      console.error('Error unpinning message:', error);
      setError(error);
      onError?.(error);
      return false;
    } finally {
      setIsPinning(false);
    }
  };

  return {
    pinMessage,
    unpinMessage,
    isPinning,
    error,
  };
}

export default usePinMessage;
