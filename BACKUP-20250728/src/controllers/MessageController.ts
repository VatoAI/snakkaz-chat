/**
 * Message Controller
 * 
 * Handles the logic for sending, receiving, encrypting and managing messages
 * in the Snakkaz chat application.
 */

import { Message, MessageAttachment } from "../models/Message";
import { Chat } from "../models/Chat";
import { User } from "../models/User";

export class MessageController {
  private chats: Map<string, Chat> = new Map();
  
  constructor(
    private currentUser: User,
    private encryptionService?: any // Will be connected to actual encryption service
  ) {}
  
  /**
   * Send a new message to a chat
   * 
   * @param chatId - ID of the chat to send the message to
   * @param content - Message content
   * @param attachments - Optional attachments
   * @returns The created message or null if chat doesn't exist
   */
  async sendMessage(chatId: string, content: string, attachments: MessageAttachment[] = []): Promise<Message | null> {
    const chat = this.chats.get(chatId);
    if (!chat) return null;
    
    let processedContent = content;
    let isEncrypted = false;
    let encryptionKeyId: string | undefined;
    
    // Encrypt message if the chat is encrypted and encryption service is available
    if (chat.isEncrypted && this.encryptionService) {
      try {
        const recipients = chat.participants.filter(id => id !== this.currentUser.id);
        const encryptionResult = await this.encryptionService.encryptForRecipients(
          content,
          recipients
        );
        
        processedContent = encryptionResult.encryptedContent;
        isEncrypted = true;
        encryptionKeyId = encryptionResult.keyId;
      } catch (error) {
        console.error("Failed to encrypt message:", error);
        return null;
      }
    }
    
    // Process attachments (encrypt if needed)
    const processedAttachments = attachments.map(attachment => {
      if (chat.isEncrypted && this.encryptionService) {
        // In a real implementation, we would encrypt attachment content here
        return new MessageAttachment(
          attachment.id,
          attachment.type,
          attachment.url,
          attachment.name,
          attachment.size,
          true,
          encryptionKeyId
        );
      }
      return attachment;
    });
    
    // Create and add the message
    const message = new Message(
      crypto.randomUUID ? crypto.randomUUID() : `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      processedContent,
      this.currentUser.id,
      this.currentUser.displayName,
      new Date(),
      isEncrypted,
      encryptionKeyId,
      chat.participants,
      processedAttachments
    );
    
    chat.addMessage(message);
    
    // In a real app, we'd persist the message here and notify other users
    
    return message;
  }
  
  /**
   * Get messages from a specified chat
   * 
   * @param chatId - ID of the chat to get messages from
   * @returns Array of messages or empty array if chat doesn't exist
   */
  getMessages(chatId: string): Message[] {
    const chat = this.chats.get(chatId);
    if (!chat) return [];
    
    const messages = chat.messages;
    
    // If the chat is encrypted, decrypt messages that this user can decrypt
    if (chat.isEncrypted && this.encryptionService) {
      return messages.map(message => {
        if (message.isEncrypted && message.sender !== this.currentUser.id) {
          try {
            const decryptedContent = this.encryptionService.decryptMessage(
              message.content,
              message.encryptionKeyId
            );
            
            return new Message(
              message.id,
              decryptedContent,
              message.sender,
              message.senderName,
              message.timestamp,
              false,
              undefined,
              message.recipients,
              message.attachments
            );
          } catch (error) {
            console.error(`Failed to decrypt message ${message.id}:`, error);
            // Return the original encrypted message but mark it as unreadable
            return new Message(
              message.id,
              "[Encrypted message - cannot decrypt]",
              message.sender,
              message.senderName,
              message.timestamp,
              true,
              message.encryptionKeyId,
              message.recipients,
              message.attachments
            );
          }
        }
        return message;
      });
    }
    
    return messages;
  }
  
  /**
   * Add a chat to the controller
   */
  addChat(chat: Chat): void {
    this.chats.set(chat.id, chat);
  }
  
  /**
   * Get all chats
   */
  getAllChats(): Chat[] {
    return Array.from(this.chats.values());
  }
  
  /**
   * Mark messages in a chat as read
   */
  markMessagesAsRead(chatId: string): void {
    // In a real implementation, this would update read receipts
    // and notify other users that messages have been seen
    console.log(`Marking messages as read in chat ${chatId}`);
  }
  
  /**
   * Delete a message
   */
  deleteMessage(chatId: string, messageId: string): boolean {
    // Implementation would remove the message and notify others
    console.log(`Deleting message ${messageId} from chat ${chatId}`);
    return true;
  }
}
