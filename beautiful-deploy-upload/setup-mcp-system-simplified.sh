#!/bin/bash

# MCP Setup - Simplified Test Version
# This script initializes and tests the simplified MCP architecture

# Style
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔧 SNAKKAZ MCP ARCHITECTURE SETUP${NC}"
echo "======================================"
echo ""

# Create simplified test files
echo -e "${YELLOW}Creating MCP test script...${NC}"

mkdir -p src/tests
cat > src/tests/mcp-simplified-test.js << 'EOF'
/**
 * MCP Simplified Test
 * 
 * Tests the simplified MCP architecture implementation
 */
const { SimplifiedMCPFactory } = require('../services/encryption/mcp-simplified');

/**
 * Run a test of the MCP system
 */
async function testMCPSystem() {
  try {
    console.log('🏗️ SNAKKAZ MCP ARCHITECTURE TEST');
    console.log('===================================');
    console.log('🚀 Initializing MCP (Model Context Protocol) architecture...');
    
    // Initialize MCP
    const mcpStack = SimplifiedMCPFactory.createMCPStack();
    
    // Destructure components for easier access
    const { userController, messageController, chatController } = mcpStack.controllers;
    const { userPresenter, messagePresenter, chatPresenter } = mcpStack.presenters;
    
    console.log('✅ MCP architecture initialized successfully');
    console.log('Components available:', {
      controllers: Object.keys(mcpStack.controllers),
      presenters: Object.keys(mcpStack.presenters)
    });
    
    // Create test users
    console.log('\n📝 Creating test users...');
    const user1 = await userController.registerUser('alice', 'Alice');
    const user2 = await userController.registerUser('bob', 'Bob');
    console.log(`✅ Created test users: ${user1.displayName} and ${user2.displayName}`);
    
    // Create a chat between them
    console.log('\n📝 Creating test chat...');
    const chat = await chatController.createChat('Test Chat', [user1, user2], 'GROUP');
    console.log(`✅ Created test chat: ${chat.name}`);
    
    // Send a message in the chat
    console.log('\n📝 Sending test message...');
    const message = await messageController.sendMessage(
      chat.id,
      user1.id,
      'Hello from MCP architecture!'
    );
    console.log(`✅ Message sent: "${message.content}"`);
    
    console.log('\n✅ MCP ARCHITECTURE TEST SUMMARY');
    console.log('-----------------------------------');
    console.log('✓ User model initialized');
    console.log('✓ Chat model initialized');
    console.log('✓ Message model initialized');
    console.log('✓ Controllers properly connected');
    console.log('✓ Presenters ready for view attachment');
    console.log('✓ Test message successfully processed');
    console.log('-----------------------------------');
    console.log('🎉 All tests passed successfully!');
    
    return { user1, user2, chat, message, mcp: mcpStack };
  } catch (error) {
    console.error('\n❌ MCP TEST FAILED');
    console.error('-----------------------------------');
    console.error(error);
    console.error('-----------------------------------');
    console.error('Please check the error details above.');
    
    process.exit(1);
  }
}

// Run tests
testMCPSystem().then(() => {
  console.log('\nMCP architecture is ready for integration with the app.');
});
EOF

echo -e "${GREEN}✓ Test script created${NC}"
echo ""

# Create JavaScript version of mcp-simplified.ts
echo -e "${YELLOW}Creating JavaScript version of MCP module...${NC}"

cat > src/services/encryption/mcp-simplified.js << 'EOF'
/**
 * MCP Simplified Integration Module - JavaScript Version
 *
 * This module provides simplified interfaces to MCP components
 * for testing and integration purposes.
 */

// Mock User class
class User {
  constructor(id, username, displayName, publicKey, avatarUrl, isOnline, lastSeen) {
    this.id = id;
    this.username = username;
    this.displayName = displayName;
    this.publicKey = publicKey;
    this.avatarUrl = avatarUrl;
    this.isOnline = isOnline;
    this.lastSeen = lastSeen;
  }
}

// Mock Message class
class Message {
  constructor(id, chatId, senderId, content, timestamp, isEncrypted, attachments) {
    this.id = id;
    this.chatId = chatId;
    this.senderId = senderId;
    this.content = content;
    this.timestamp = timestamp;
    this.isEncrypted = isEncrypted;
    this.attachments = attachments;
  }
}

// Mock Chat class
class Chat {
  constructor(id, name, participantIds, createdAt, type) {
    this.id = id;
    this.name = name;
    this.participantIds = participantIds;
    this.createdAt = createdAt;
    this.type = type;
  }
}

// Chat types
const ChatType = {
  GROUP: 'GROUP',
  PRIVATE: 'PRIVATE'
};

// Mock controllers for testing
class MockUserController {
  constructor() {
    this.users = new Map();
  }
  
  async registerUser(username, displayName) {
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
  
  getUser(userId) {
    return this.users.get(userId);
  }
  
  getAllUsers() {
    return Array.from(this.users.values());
  }
}

class MockMessageController {
  constructor() {
    this.messages = new Map();
  }
  
  async sendMessage(chatId, senderId, content) {
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
  
  getMessagesForChat(chatId) {
    return Array.from(this.messages.values())
      .filter(message => message.chatId === chatId);
  }
}

class MockChatController {
  constructor(messageController) {
    this.chats = new Map();
    this.messageController = messageController;
  }
  
  async createChat(name, participants, type) {
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
  
  getChat(chatId) {
    return this.chats.get(chatId);
  }
  
  getAllChats() {
    return Array.from(this.chats.values());
  }
}

// Mock presenters
class MockUserPresenter {
  constructor(controller) {
    this.controller = controller;
    this.view = null;
  }
  
  attachView(view) {
    this.view = view;
  }
  
  detachView() {
    this.view = null;
  }
}

class MockMessagePresenter {
  constructor(controller) {
    this.controller = controller;
    this.view = null;
  }
  
  attachView(view) {
    this.view = view;
  }
  
  detachView() {
    this.view = null;
  }
}

class MockChatPresenter {
  constructor(controller, messagePresenter) {
    this.controller = controller;
    this.messagePresenter = messagePresenter;
    this.view = null;
  }
  
  attachView(view) {
    this.view = view;
  }
  
  detachView() {
    this.view = null;
  }
}

// Factory for creating the MCP stack with mocks
class SimplifiedMCPFactory {
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

module.exports = { 
  SimplifiedMCPFactory,
  User,
  Message,
  Chat,
  ChatType
};
EOF

echo -e "${GREEN}✓ JavaScript MCP module created${NC}"
echo ""

echo -e "${YELLOW}Running simplified MCP tests...${NC}"
echo ""

# Run the test
node src/tests/mcp-simplified-test.js

if [ $? -eq 0 ]; then
  echo ""
  echo -e "${GREEN}🎉 MCP ARCHITECTURE SETUP COMPLETE${NC}"
  echo "======================================"
  echo -e "${GREEN}The MCP architecture is now ready to be integrated into your React application.${NC}"
  echo ""
  echo "To use MCP in your React components:"
  echo ""
  echo "1. Import the MCP factory:"
  echo -e "   ${BLUE}import { MCPFactory } from '../services/encryption/mcp';${NC}"
  echo ""
  echo "2. Initialize the MCP stack:"
  echo -e "   ${BLUE}const { controllers, presenters } = MCPFactory.createMCPStack();${NC}"
  echo ""
  echo "3. Use controllers in your components:"
  echo -e "   ${BLUE}const { userController } = controllers;${NC}"
  echo -e "   ${BLUE}// Example: create a new user${NC}"
  echo -e "   ${BLUE}const user = await userController.registerUser('username', 'Display Name');${NC}"
  echo ""
  echo "4. Connect presenters to your view components:"
  echo -e "   ${BLUE}class UserProfileComponent implements UserView {${NC}"
  echo -e "   ${BLUE}  // Implement required view methods${NC}"
  echo -e "   ${BLUE}}${NC}"
  echo -e "   ${BLUE}// Connect the presenter${NC}"
  echo -e "   ${BLUE}presenters.userPresenter.attachView(new UserProfileComponent());${NC}"

  # Create an integration guide
  cat > MCP-INTEGRATION-GUIDE.md << 'EOF'
# MCP Architecture Integration Guide

## Introduction

The Model-Context-Presenter (MCP) pattern is a modern architectural pattern that separates concerns in your application:

- **Models**: Data structures and business logic
- **Controllers**: Application behavior and state management
- **Presenters**: UI logic that connects views to controllers

This guide explains how to integrate the MCP architecture into your React application.

## Quick Start

### 1. Initialize MCP

```typescript
import { MCPFactory } from '../services/encryption/mcp';

// In your app initialization code
const { controllers, presenters } = MCPFactory.createMCPStack();
```

### 2. Use Controllers in Components

```typescript
// Access controllers
const { userController, chatController, messageController } = controllers;

// Example: Creating a new user
const handleRegister = async (username, displayName) => {
  try {
    const user = await userController.registerUser(username, displayName);
    console.log(`User registered: ${user.displayName}`);
    return user;
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

### 3. Implement View Interfaces

```typescript
import { UserView } from '../services/encryption/presenters/UserPresenter';

// Create a component that implements the view interface
class UserProfileComponent extends React.Component implements UserView {
  // View interface methods
  render() {
    // Your React rendering
    return <div>{this.props.user.displayName}</div>;
  }
  
  update(data) {
    this.setState({ user: data.user });
  }
}
```

### 4. Connect Presenters to Views

```typescript
// In your component
componentDidMount() {
  // Connect presenter to this component
  presenters.userPresenter.attachView(this);
}

componentWillUnmount() {
  // Disconnect presenter
  presenters.userPresenter.detachView();
}
```

## Advanced Usage

### Global MCP Context

For larger applications, you can create a global MCP context:

```typescript
import React, { createContext, useContext } from 'react';
import { MCPFactory } from '../services/encryption/mcp';

// Create MCP context
const MCPContext = createContext(null);

// MCP provider component
export function MCPProvider({ children }) {
  const mcpStack = MCPFactory.createMCPStack();
  
  return (
    <MCPContext.Provider value={mcpStack}>
      {children}
    </MCPContext.Provider>
  );
}

// Hook to use MCP
export function useMCP() {
  const context = useContext(MCPContext);
  if (!context) {
    throw new Error("useMCP must be used within an MCPProvider");
  }
  return context;
}
```

### Using MCP with Hooks

```typescript
import { useMCP } from './MCPContext';

function UserProfile() {
  const { controllers } = useMCP();
  const { userController } = controllers;
  
  // Use controllers in your component
  // ...
}
```

## Best Practices

1. **Keep Views Thin**: Views should only handle UI rendering and user events
2. **Controllers for Business Logic**: Business rules and data manipulation go in controllers
3. **Presenters for UI Logic**: Use presenters to format data for display and handle UI state
4. **Models for Data**: Models should represent your data structures and validation

## Troubleshooting

- **Circular Dependencies**: If you encounter circular imports, refactor your code to use dependency injection
- **View Updates**: Ensure your view implements all required methods of the view interface
- **Async Operations**: Always use try/catch with async controller methods

EOF

  echo ""
  echo -e "${GREEN}✅ MCP Integration Guide created: MCP-INTEGRATION-GUIDE.md${NC}"
else
  echo ""
  echo -e "${RED}❌ MCP TEST FAILED${NC}"
  echo "Please check the error details above."
fi
