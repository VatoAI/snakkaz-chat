/**
 * Chat Controller
 * 
 * Handles the logic for creating, joining, and managing chats in the Snakkaz application.
 */

import { Chat, ChatType } from "../models/Chat";
import { User } from "../models/User";
import { Message } from "../models/Message";

export class ChatController {
  private chats: Map<string, Chat> = new Map();
  private users: Map<string, User> = new Map();
  
  constructor(
    private currentUser: User,
    private encryptionService?: any // Will be connected to actual encryption service
  ) {
    // Add current user to users map
    this.users.set(currentUser.id, currentUser);
  }
  
  /**
   * Create a new private chat with a user
   */
  createPrivateChat(otherUserId: string): Chat | null {
    const otherUser = this.users.get(otherUserId);
    if (!otherUser) {
      console.error(`Cannot create chat with unknown user: ${otherUserId}`);
      return null;
    }
    
    // Check if chat already exists
    const existingChat = this.findPrivateChatWithUser(otherUserId);
    if (existingChat) return existingChat;
    
    const participants = [this.currentUser.id, otherUserId];
    const chatName = otherUser.displayName; // For private chats, use the other user's name
    
    // Decide whether to use encryption based on user preferences and capabilities
    const canUseEncryption = this.canEstablishEncryptedChat([otherUserId]);
    const useEncryption = canUseEncryption; // Could also check user preferences here
    
    let encryptionKeyId: string | undefined;
    
    // If using encryption, generate or retrieve encryption key
    if (useEncryption && this.encryptionService) {
      try {
        const keyInfo = this.encryptionService.generateKeyForParticipants(participants);
        encryptionKeyId = keyInfo.keyId;
      } catch (error) {
        console.error("Failed to set up encryption for chat:", error);
        return null;
      }
    }
    
    const chatId = `private_${this.currentUser.id}_${otherUserId}_${Date.now()}`;
    
    const chat = new Chat(
      chatId,
      chatName,
      participants,
      ChatType.PRIVATE,
      useEncryption,
      encryptionKeyId
    );
    
    this.chats.set(chat.id, chat);
    
    // In a real app, we'd persist this chat to storage here
    
    return chat;
  }
  
  /**
   * Create a group chat with multiple users
   */
  createGroupChat(name: string, participantIds: string[], useEncryption: boolean = false): Chat | null {
    // Ensure all participants exist
    const invalidUsers = participantIds.filter(id => !this.users.has(id));
    if (invalidUsers.length > 0) {
      console.error(`Cannot create group with unknown users: ${invalidUsers.join(', ')}`);
      return null;
    }
    
    // Always include current user
    if (!participantIds.includes(this.currentUser.id)) {
      participantIds.push(this.currentUser.id);
    }
    
    // Check if encryption is possible with these participants
    if (useEncryption && !this.canEstablishEncryptedChat(participantIds)) {
      console.error("Cannot establish encrypted chat with the selected participants");
      return null;
    }
    
    let encryptionKeyId: string | undefined;
    
    // If using encryption, generate or retrieve encryption key
    if (useEncryption && this.encryptionService) {
      try {
        const keyInfo = this.encryptionService.generateKeyForParticipants(participantIds);
        encryptionKeyId = keyInfo.keyId;
      } catch (error) {
        console.error("Failed to set up encryption for group chat:", error);
        return null;
      }
    }
    
    const chatId = `group_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const chat = new Chat(
      chatId,
      name,
      participantIds,
      ChatType.GROUP,
      useEncryption,
      encryptionKeyId
    );
    
    this.chats.set(chat.id, chat);
    
    // In a real app, we'd persist this chat and notify participants
    
    return chat;
  }
  
  /**
   * Add a user to a chat
   */
  addUserToChat(chatId: string, userId: string): boolean {
    const chat = this.chats.get(chatId);
    if (!chat) {
      console.error(`Chat not found: ${chatId}`);
      return false;
    }
    
    // Cannot add users to private chats
    if (chat.type === ChatType.PRIVATE) {
      console.error("Cannot add users to private chats");
      return false;
    }
    
    const user = this.users.get(userId);
    if (!user) {
      console.error(`User not found: ${userId}`);
      return false;
    }
    
    // Check if user is already in the chat
    if (chat.hasParticipant(userId)) {
      console.log(`User ${userId} is already in chat ${chatId}`);
      return true;
    }
    
    // If chat is encrypted, check if we can establish secure communication
    if (chat.isEncrypted) {
      const canEstablishEncryption = this.canEstablishEncryptedChat([...chat.participants, userId]);
      if (!canEstablishEncryption) {
        console.error(`Cannot add user ${userId} to encrypted chat ${chatId} due to missing encryption keys`);
        return false;
      }
      
      // Would need to re-encrypt chat history for new participant
      // or just give access to new messages going forward
    }
    
    // Add user to chat
    chat.participants.push(userId);
    
    // Add system message
    const systemMessage = new Message(
      `system_${Date.now()}`,
      `${user.displayName} has joined the chat.`,
      "system",
      "System",
      new Date()
    );
    
    chat.addMessage(systemMessage);
    
    // In a real app, we'd persist changes and notify other participants
    
    return true;
  }
  
  /**
   * Remove a user from a chat
   */
  removeUserFromChat(chatId: string, userId: string): boolean {
    const chat = this.chats.get(chatId);
    if (!chat) {
      console.error(`Chat not found: ${chatId}`);
      return false;
    }
    
    // Cannot remove users from private chats
    if (chat.type === ChatType.PRIVATE) {
      console.error("Cannot remove users from private chats");
      return false;
    }
    
    // Check if user is in the chat
    if (!chat.hasParticipant(userId)) {
      console.error(`User ${userId} is not in chat ${chatId}`);
      return false;
    }
    
    // Get user info for system message before removal
    const user = this.users.get(userId);
    const displayName = user ? user.displayName : `User ${userId}`;
    
    // Remove user from chat
    const index = chat.participants.indexOf(userId);
    chat.participants.splice(index, 1);
    
    // Add system message
    const systemMessage = new Message(
      `system_${Date.now()}`,
      `${displayName} has left the chat.`,
      "system",
      "System",
      new Date()
    );
    
    chat.addMessage(systemMessage);
    
    // In a real app, we'd persist changes and notify other participants
    
    return true;
  }
  
  /**
   * Get a chat by ID
   */
  getChat(chatId: string): Chat | undefined {
    return this.chats.get(chatId);
  }
  
  /**
   * Get all chats for the current user
   */
  getUserChats(): Chat[] {
    return Array.from(this.chats.values())
      .filter(chat => chat.hasParticipant(this.currentUser.id));
  }
  
  /**
   * Find a private chat with a specific user
   */
  findPrivateChatWithUser(userId: string): Chat | undefined {
    return Array.from(this.chats.values()).find(chat => 
      chat.type === ChatType.PRIVATE &&
      chat.hasParticipant(this.currentUser.id) &&
      chat.hasParticipant(userId) &&
      chat.participants.length === 2
    );
  }
  
  /**
   * Check if encrypted chat can be established with participants
   */
  private canEstablishEncryptedChat(participantIds: string[]): boolean {
    // If no encryption service, cannot establish encrypted chat
    if (!this.encryptionService) return false;
    
    // Check that all participants have public keys
    for (const participantId of participantIds) {
      const user = this.users.get(participantId);
      if (!user) return false;
      
      const activeKey = user.getActivePublicKey();
      if (!activeKey) return false;
    }
    
    return true;
  }
  
  /**
   * Add a user to the known users list
   */
  addUser(user: User): void {
    this.users.set(user.id, user);
  }
  
  /**
   * Get all known users
   */
  getUsers(): User[] {
    return Array.from(this.users.values());
  }
}
