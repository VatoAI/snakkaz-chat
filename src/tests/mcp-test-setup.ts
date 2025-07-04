/**
 * MCP Test Setup
 * 
 * This file demonstrates how to initialize and use the MCP architecture in the Snakkaz application.
 * It shows proper initialization, dependency injection, and usage patterns.
 */

import { MCPFactory, User, Message, Chat, ChatType } from '../services/encryption/mcp';

/**
 * Initialize the MCP system and connect it to the application
 */
export async function initializeMCP() {
  console.log('🚀 Initializing MCP (Model Context Protocol) architecture...');
  
  // Create the complete MCP stack using the factory
  const mcpStack = MCPFactory.createMCPStack();
  
  // Destructure components for easier access
  const { userController, messageController, chatController } = mcpStack.controllers;
  const { userPresenter, messagePresenter, chatPresenter } = mcpStack.presenters;
  
  // Log successful initialization
  console.log('✅ MCP architecture initialized successfully');
  console.log('Components available:', {
    controllers: Object.keys(mcpStack.controllers),
    presenters: Object.keys(mcpStack.presenters)
  });
  
  return {
    controllers: mcpStack.controllers,
    presenters: mcpStack.presenters,
    
    // Utility function to create a demo user
    async createDemoUser(username: string, displayName: string): Promise<User> {
      try {
        const user = await userController.registerUser(username, displayName);
        console.log(`✅ Created demo user: ${displayName} (${username})`);
        return user;
      } catch (error) {
        console.error('❌ Error creating demo user:', error);
        throw error;
      }
    },
    
    // Utility function to create a demo chat
    async createDemoChat(name: string, participants: User[]): Promise<Chat> {
      try {
        const chat = await chatController.createChat(name, participants, ChatType.GROUP);
        console.log(`✅ Created demo chat: ${name} with ${participants.length} participants`);
        return chat;
      } catch (error) {
        console.error('❌ Error creating demo chat:', error);
        throw error;
      }
    }
  };
}

/**
 * Run a test of the MCP system
 */
export async function testMCPSystem() {
  try {
    console.log('🧪 Testing MCP system...');
    
    // Initialize MCP
    const mcp = await initializeMCP();
    
    // Create test users
    const user1 = await mcp.createDemoUser('alice', 'Alice');
    const user2 = await mcp.createDemoUser('bob', 'Bob');
    
    // Create a chat between them
    const chat = await mcp.createDemoChat('Test Chat', [user1, user2]);
    
    // Send a message in the chat
    const message = await mcp.controllers.messageController.sendMessage(
      chat.id,
      user1.id,
      'Hello from MCP architecture!'
    );
    
    console.log('📝 Test message sent:', message);
    console.log('✅ MCP test completed successfully!');
    
    return { user1, user2, chat, message, mcp };
  } catch (error) {
    console.error('❌ MCP test failed:', error);
    throw error;
  }
}

// Example view implementation
export class TestChatView implements import('../services/encryption/presenters/ChatPresenter').ChatView {
  render(): void {
    console.log('🖼️ TestChatView: Rendering chat interface');
  }
  
  update(data: any): void {
    console.log('🔄 TestChatView: Updating with new data', data);
  }
  
  displayChats(chats: Chat[]): void {
    console.log('📋 TestChatView: Displaying chats', chats.map(c => c.name));
  }
}
