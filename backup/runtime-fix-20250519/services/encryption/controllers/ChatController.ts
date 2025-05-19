/**
 * Chat Controller
 * 
 * Handles business logic for chat operations in the Snakkaz chat application.
 * Manages chat creation, participant management, and message handling.
 */

import { Chat, ChatType } from '../models/Chat';
import { Message } from '../models/Message';
import { User } from '../models/User';
import { MessageController } from './MessageController';
import { keyStorageService } from '../keyStorageService';
import { generateAesKey, exportKeyToJwk } from '../cryptoUtils';

export class ChatController {
  private chats: Map<string, Chat> = new Map();
  private messageController: MessageController;
  
  constructor(messageController: MessageController) {
    this.messageController = messageController;
  }
  
  /**
   * Create a new chat
   * 
   * @param name - Name/title of the chat
   * @param participants - Users in the chat
   * @param creator - User creating the chat
   * @param type - Chat type (private, group, channel)
   * @param isEncrypted - Whether to enable encryption for this chat
   * @returns The newly created chat
   */
  async createChat(
    name: string,
    participants: string[],
    creator: User,
    type: ChatType = ChatType.PRIVATE,
    isEncrypted: boolean = true
  ): Promise<Chat> {
    // Generate a unique ID
    const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Add creator to participants and admin if not already included
    if (!participants.includes(creator.id)) {
      participants.push(creator.id);
    }
    
    // Set up admins (creator is initial admin)
    const adminIds = [creator.id];
    
    // Set up encryption if enabled
    let encryptionKeyId: string | undefined = undefined;
    
    if (isEncrypted) {
      // Generate a chat encryption key
      encryptionKeyId = `chat_key_${chatId}`;
      
      // Generate and store a symmetric key for this chat
      const chatKey = await generateAesKey();
      const exportedKey = await exportKeyToJwk(chatKey);
      
      // Store the chat key securely
      await keyStorageService.storeKey(
        encryptionKeyId,
        JSON.stringify(exportedKey),
        true
      );
    }
    
    // Create the chat
    const chat = new Chat(
      chatId,
      name,
      participants,
      type,
      isEncrypted,
      encryptionKeyId,
      new Date(),
      new Date(),
      adminIds
    );
    
    // Save the chat
    this.chats.set(chatId, chat);
    
    return chat;
  }
  
  /**
   * Send a message to a chat
   * 
   * @param chatId - ID of the chat
   * @param content - Message content
   * @param sender - User sending the message
   * @param attachments - Optional attachments
   * @returns The sent message
   */
  async sendMessage(
    chatId: string,
    content: string,
    sender: User,
    attachments: File[] = []
  ): Promise<Message> {
    // Find the chat
    const chat = this.chats.get(chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }
    
    // Check if user is a participant
    if (!chat.hasParticipant(sender.id)) {
      throw new Error("User is not a participant in this chat");
    }
    
    // Process attachments if any
    const messageAttachments = [];
    if (attachments.length > 0) {
      for (const file of attachments) {
        const attachment = await this.messageController.createAttachment(file, chat.isEncrypted);
        messageAttachments.push(attachment);
      }
    }
    
    // Create and encrypt the message using recipients from the chat
    const message = await this.messageController.createMessage(
      content,
      sender,
      chat.isEncrypted,
      chat.participants,
      messageAttachments
    );
    
    // Add the message to the chat
    chat.addMessage(message);
    
    return message;
  }
  
  /**
   * Get a chat by ID
   * 
   * @param chatId - ID of the chat to retrieve
   * @returns The requested chat
   */
  getChat(chatId: string): Chat | undefined {
    return this.chats.get(chatId);
  }
  
  /**
   * Get all chats for a user
   * 
   * @param userId - ID of the user
   * @returns Array of chats
   */
  getUserChats(userId: string): Chat[] {
    const userChats: Chat[] = [];
    
    for (const chat of this.chats.values()) {
      if (chat.hasParticipant(userId)) {
        userChats.push(chat);
      }
    }
    
    return userChats;
  }
  
  /**
   * Add a user to a chat
   * 
   * @param chatId - ID of the chat
   * @param userId - ID of the user to add
   * @param addedBy - User adding the new participant
   * @param asAdmin - Whether to add as admin
   * @returns True if user was added
   */
  async addUserToChat(
    chatId: string,
    userId: string,
    addedBy: User,
    asAdmin: boolean = false
  ): Promise<boolean> {
    const chat = this.chats.get(chatId);
    
    if (!chat) {
      throw new Error("Chat not found");
    }
    
    // Only admins can add participants to group chats
    if (chat.type !== ChatType.PRIVATE && !chat.isUserAdmin(addedBy.id)) {
      throw new Error("Only admins can add users to this chat");
    }
    
    // Add the user
    const wasAdded = chat.addParticipant(userId, asAdmin);
    
    if (wasAdded && chat.isEncrypted && chat.encryptionKeyId) {
      // TODO: Re-encrypt chat keys for the new participant
      // This would require retrieving the chat key and re-encrypting it
      // with the new participant's public key
    }
    
    return wasAdded;
  }
  
  /**
   * Remove a user from a chat
   * 
   * @param chatId - ID of the chat
   * @param userId - ID of the user to remove
   * @param removedBy - User performing the removal
   * @returns True if user was removed
   */
  removeUserFromChat(
    chatId: string,
    userId: string,
    removedBy: User
  ): boolean {
    const chat = this.chats.get(chatId);
    
    if (!chat) {
      throw new Error("Chat not found");
    }
    
    // Check permissions
    if (userId !== removedBy.id && !chat.isUserAdmin(removedBy.id)) {
      throw new Error("Only admins can remove other users");
    }
    
    // Cannot remove the last admin
    if (
      chat.isUserAdmin(userId) &&
      chat.adminIds.length === 1 &&
      chat.adminIds[0] === userId
    ) {
      throw new Error("Cannot remove the last admin from the chat");
    }
    
    return chat.removeParticipant(userId);
  }
  
  /**
   * Load chats from storage
   * 
   * @returns Map of loaded chats
   */
  async loadChats(): Promise<Map<string, Chat>> {
    // In a real app, this would load from a database or storage
    // For now, we're just using the in-memory map
    return this.chats;
  }
  
  /**
   * Save chats to persistent storage
   */
  async saveChats(): Promise<void> {
    // In a real app, this would save to a database
    console.log("Saving chats to storage:", this.chats.size);
  }
}
