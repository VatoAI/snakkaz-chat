/**
 * Unified Chat Service
 * 
 * This service provides a unified interface for chat operations,
 * wrapping the specialized services like GroupMessageService and PrivateChatService
 */

import { supabase } from '@/integrations/supabase/client';
import { GroupMessageService } from './chat/GroupMessageService';
import { privateChatService } from './encryption/privateChatService';

export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  recipient_id?: string;
  chat_id: string;
  message_type: 'text' | 'image' | 'file' | 'link';
  file_url?: string;
  is_encrypted: boolean;
  created_at: string;
}

export interface ChatCreateOptions {
  name: string;
  participantIds: string[];
  isGroup: boolean;
}

export interface ChatResponse<T = any> {
  data: T | null;
  error: any;
}

export class ChatService {
  /**
   * Send a message to a chat
   */
  async sendMessage(
    content: string,
    recipientId?: string,
    chatId?: string,
    messageType: 'text' | 'image' | 'file' | 'link' = 'text',
    fileUrl?: string,
    isEncrypted: boolean = false
  ): Promise<ChatResponse<ChatMessage>> {
    try {
      const messageData: any = {
        content,
        message_type: messageType,
        is_encrypted: isEncrypted,
        created_at: new Date().toISOString(),
      };

      if (recipientId) {
        messageData.recipient_id = recipientId;
      }
      
      if (chatId) {
        messageData.chat_id = chatId;
      }

      if (fileUrl) {
        messageData.file_url = fileUrl;
      }

      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select('*')
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get messages for a chat
   */
  async getMessages(
    chatId: string,
    limit: number = 50,
    before?: string
  ): Promise<ChatResponse<ChatMessage[]>> {
    try {
      let query = supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (before) {
        query = query.lt('created_at', before);
      }

      const { data, error } = await query;

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Create a new chat
   */
  async createChat(options: ChatCreateOptions): Promise<ChatResponse<{ id: string; name: string }>> {
    try {
      const { data, error } = await supabase
        .from('chats')
        .insert({
          name: options.name,
          is_group: options.isGroup,
          created_by: undefined, // This would normally be the current user ID
        })
        .select('id, name')
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Delete a message
   */
  async deleteMessage(messageId: string): Promise<ChatResponse<null>> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get group message service for a specific group
   */
  getGroupMessageService(groupId: string, userId: string, memberIds: string[]): GroupMessageService {
    return new GroupMessageService(groupId, userId, memberIds);
  }

  /**
   * Get private chat service
   */
  getPrivateChatService() {
    return privateChatService;
  }
}

// Export a singleton instance
export const chatService = new ChatService();

// Export the class as both default and named export for better Jest compatibility
export { ChatService };
export default ChatService;
