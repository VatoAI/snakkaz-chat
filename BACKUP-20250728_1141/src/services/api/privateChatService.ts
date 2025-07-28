/**
 * Private Chat Service
 * 
 * Service for handling private chat operations with encryption support
 */

import { supabase } from '@/integrations/supabase/client';
import { encryptMessage, decryptMessage } from '@/utils/encryption/message-encryption';
import { User } from '@supabase/supabase-js';
import { generateChatEncryptionKey } from '@/utils/encryption/key-management';

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_edited?: boolean;
  is_deleted?: boolean;
  pinned?: boolean;
  pinned_by?: string | null;
  pinned_at?: string | null;
  message_type?: 'text' | 'image' | 'file' | 'link';
  metadata?: Record<string, any>;
}

export interface DecryptedMessage extends Message {
  decrypted_content?: string;
}

export interface ChatParticipant {
  id: string;
  username?: string;
  avatar_url?: string;
}

export interface PrivateChat {
  id: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  last_message_at?: string;
  participant_ids: string[];
  encryption_enabled: boolean;
  encryption_key_id?: string;
}

class PrivateChatService {
  /**
   * Create a new private chat between two users
   */
  async createPrivateChat(currentUser: User, recipientId: string): Promise<{ chatId: string, encryptionKey?: string }> {
    if (!currentUser) {
      throw new Error('User must be logged in to create a private chat');
    }

    try {
      // Check if chat already exists between these users
      const { data: existingChats } = await supabase
        .from('private_chats')
        .select('id')
        .contains('participant_ids', [currentUser.id, recipientId]);

      if (existingChats && existingChats.length > 0) {
        // Chat already exists, return its ID
        return { chatId: existingChats[0].id };
      }

      // Generate encryption key for the chat
      const encryptionKey = await generateChatEncryptionKey();
      
      // Create new chat
      const { data: newChat, error } = await supabase
        .from('private_chats')
        .insert({
          participant_ids: [currentUser.id, recipientId],
          encryption_enabled: true,
        })
        .select('id')
        .single();

      if (error) throw error;

      if (!newChat) {
        throw new Error('Failed to create private chat');
      }

      return { 
        chatId: newChat.id,
        encryptionKey
      };
    } catch (error) {
      console.error('Error creating private chat:', error);
      throw error;
    }
  }

  /**
   * Fetch messages from a private chat with decryption support
   */
  async fetchMessages(chatId: string, encryptionKey?: string, limit = 50, before?: string): Promise<DecryptedMessage[]> {
    try {
      let query = supabase
        .from('private_chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: false })
        .limit(limit);

      // If we have a 'before' timestamp, use it to paginate
      if (before) {
        query = query.lt('created_at', before);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (!data) return [];

      // Process messages (decrypt if needed)
      const processedMessages = await Promise.all(
        data.map(async (message) => {
          let processedMessage: DecryptedMessage = {
            ...message
          };

          // Decrypt content if encryption is enabled and key provided
          if (message.encrypted && encryptionKey) {
            try {
              processedMessage.decrypted_content = await decryptMessage(message.content, encryptionKey);
            } catch (err) {
              console.error('Failed to decrypt message:', err);
              processedMessage.decrypted_content = '[Encrypted message]';
            }
          }

          return processedMessage;
        })
      );

      return processedMessages;
    } catch (error) {
      console.error('Error fetching private chat messages:', error);
      throw error;
    }
  }

  /**
   * Send a message in a private chat with encryption support
   */
  async sendMessage(
    chatId: string, 
    senderId: string, 
    content: string, 
    encryptionKey?: string,
    messageType: 'text' | 'image' | 'file' | 'link' = 'text',
    metadata?: Record<string, any>,
    ttl?: number
  ): Promise<Message> {
    try {
      let encryptedContent = content;
      let isEncrypted = false;

      // Encrypt message if encryption key is provided
      if (encryptionKey) {
        encryptedContent = await encryptMessage(content, encryptionKey);
        isEncrypted = true;
      }

      const message = {
        chat_id: chatId,
        sender_id: senderId,
        content: encryptedContent,
        encrypted: isEncrypted,
        message_type: messageType,
        metadata: metadata || {},
        ttl: ttl
      };

      const { data, error } = await supabase
        .from('private_chat_messages')
        .insert(message)
        .select('*')
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error('Failed to send message');
      }

      // Also update the last message in the chat
      await supabase
        .from('private_chats')
        .update({
          last_message: messageType === 'text' ? (isEncrypted ? '[Encrypted message]' : content) : `[${messageType.toUpperCase()}]`,
          last_message_at: new Date().toISOString()
        })
        .eq('id', chatId);

      return data;
    } catch (error) {
      console.error('Error sending private message:', error);
      throw error;
    }
  }

  /**
   * Edit a message in a private chat
   */
  async editMessage(
    messageId: string,
    chatId: string,
    senderId: string,
    newContent: string,
    encryptionKey?: string
  ): Promise<Message> {
    try {
      // First check if the message exists and belongs to the sender
      const { data: existingMessage, error: fetchError } = await supabase
        .from('private_chat_messages')
        .select('*')
        .eq('id', messageId)
        .eq('chat_id', chatId)
        .eq('sender_id', senderId)
        .single();

      if (fetchError || !existingMessage) {
        throw new Error('Message not found or you do not have permission to edit it');
      }

      let encryptedContent = newContent;
      
      // Encrypt the new content if the message was encrypted
      if (existingMessage.encrypted && encryptionKey) {
        encryptedContent = await encryptMessage(newContent, encryptionKey);
      }

      const { data, error } = await supabase
        .from('private_chat_messages')
        .update({
          content: encryptedContent,
          is_edited: true
        })
        .eq('id', messageId)
        .select('*')
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error('Failed to edit message');
      }

      return data;
    } catch (error) {
      console.error('Error editing private message:', error);
      throw error;
    }
  }

  /**
   * Delete a message from a private chat
   */
  async deleteMessage(messageId: string, chatId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('private_chat_messages')
        .update({
          content: '',
          is_deleted: true,
          pinned: false,
          pinned_by: null,
          pinned_at: null
        })
        .eq('id', messageId)
        .eq('chat_id', chatId)
        .eq('sender_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting private message:', error);
      throw error;
    }
  }

  /**
   * Get chat participants information
   */
  async getChatParticipants(participantIds: string[]): Promise<ChatParticipant[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', participantIds);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching chat participants:', error);
      throw error;
    }
  }

  /**
   * Get all private chats for a user
   */
  async getUserPrivateChats(userId: string): Promise<PrivateChat[]> {
    try {
      const { data, error } = await supabase
        .from('private_chats')
        .select('*')
        .contains('participant_ids', [userId])
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching user private chats:', error);
      throw error;
    }
  }

  /**
   * Setup a subscription for real-time updates to a private chat
   */
  subscribeToPrivateChat(chatId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`private-chat-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'private_chat_messages',
          filter: `chat_id=eq.${chatId}`
        },
        callback
      )
      .subscribe();
  }
}

export const privateChatService = new PrivateChatService();
export default privateChatService;