/**
 * MCP Simplified Integration Module
 *
 * This module provides simplified interfaces to MCP components
 * for testing and integration purposes.
 */

import { User } from './models/User';
import { Message } from './models/Message';
import { Chat, ChatType } from './models/Chat';

// Mock controllers for testing
class MockUserController {
  private users = new Map<string, User>();
  
  async registerUser(username: string, displayName: string): Promise<User> {
    // Generate a unique ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create a simple user object with mock data
    const user = new User(
      userId,
      username,
      displayName,
      'mock-public-key-base64',  // Mock public key
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`, // Avatar URL
      true, // isOnline
      new Date() // lastSeen
    );
    
    // Store the user
    this.users.set(userId, user);
    
    return user;
  }
  
  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }
  
  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }
}

class MockMessageController {
  private messages = new Map<string, Message>();
  
  async sendMessage(chatId: string, senderId: string, content: string): Promise<Message> {
    // Create a message ID
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create the message
    const message = new Message(
      messageId,
      chatId,
      senderId,
      content,
      new Date(),
      false, // isEncrypted (mock)
      [] // attachments
    );
    
    // Store the message
    this.messages.set(messageId, message);
    
    return message;
  }
  
  getMessagesForChat(chatId: string): Message[] {
    return Array.from(this.messages.values())
      .filter(message => message.chatId === chatId);
  }
}

class MockChatController {
  private chats = new Map<string, Chat>();
  private messageController: MockMessageController;
  
  constructor(messageController: MockMessageController) {
    this.messageController = messageController;
  }
  
  async createChat(name: string, participants: User[], type: ChatType): Promise<Chat> {
    // Create a chat ID
    const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create the chat
    const chat = new Chat(
      chatId,
      name,
      participants.map(p => p.id),
      new Date(),
      type
    );
    
    // Store the chat
    this.chats.set(chatId, chat);
    
    return chat;
  }
  
  getChat(chatId: string): Chat | undefined {
    return this.chats.get(chatId);
  }
  
  getAllChats(): Chat[] {
    return Array.from(this.chats.values());
  }
}

// Mock presenters
class MockUserPresenter {
  private controller: MockUserController;
  private view: any | null = null;
  
  constructor(controller: MockUserController) {
    this.controller = controller;
  }
  
  attachView(view: any): void {
    this.view = view;
  }
  
  detachView(): void {
    this.view = null;
  }
}

class MockMessagePresenter {
  private controller: MockMessageController;
  private view: any | null = null;
  
  constructor(controller: MockMessageController) {
    this.controller = controller;
  }
  
  attachView(view: any): void {
    this.view = view;
  }
  
  detachView(): void {
    this.view = null;
  }
}

class MockChatPresenter {
  private controller: MockChatController;
  private messagePresenter: MockMessagePresenter;
  private view: any | null = null;
  
  constructor(controller: MockChatController, messagePresenter: MockMessagePresenter) {
    this.controller = controller;
    this.messagePresenter = messagePresenter;
  }
  
  attachView(view: any): void {
    this.view = view;
  }
  
  detachView(): void {
    this.view = null;
  }
}

// Factory for creating the MCP stack with mocks
export class SimplifiedMCPFactory {
  /**
   * Create the complete MCP stack with mock implementations
   * @returns Object containing all MCP components
   */
  static createMCPStack() {
    // Create controllers
    const userController = new MockUserController();
    const messageController = new MockMessageController();
    const chatController = new MockChatController(messageController);
    
    // Create presenters
    const userPresenter = new MockUserPresenter(userController);
    const messagePresenter = new MockMessagePresenter(messageController);
    const chatPresenter = new MockChatPresenter(chatController, messagePresenter);
    
    return {
      controllers: {
        userController,
        messageController,
        chatController
      },
      presenters: {
        userPresenter,
        messagePresenter,
        chatPresenter
      }
    };
  }
}

// Export all the necessary types and interfaces
export { User, Message, Chat, ChatType };
export type { MockUserController, MockMessageController, MockChatController };
export type { MockUserPresenter, MockMessagePresenter, MockChatPresenter };
