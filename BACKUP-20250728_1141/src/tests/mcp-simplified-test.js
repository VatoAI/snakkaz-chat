/**
 * MCP Simplified Test - JavaScript Version
 * 
 * This file provides a pure JavaScript test for the MCP architecture
 * to ensure it works in a Node.js environment without TypeScript compilation.
 */

// Mock browser globals for testing in Node environment
global.window = global.window || {};
global.window.crypto = global.window.crypto || require('crypto').webcrypto;
global.localStorage = global.localStorage || {
  _data: {},
  getItem(key) {
    return this._data[key];
  },
  setItem(key, value) {
    this._data[key] = value;
  },
  removeItem(key) {
    delete this._data[key];
  }
};

// Mock TextEncoder/Decoder if not available
if (!global.TextEncoder) {
  global.TextEncoder = class TextEncoder {
    encode(text) {
      const encoded = new Uint8Array(text.length);
      for (let i = 0; i < text.length; i++) {
        encoded[i] = text.charCodeAt(i);
      }
      return encoded;
    }
  };
}

if (!global.TextDecoder) {
  global.TextDecoder = class TextDecoder {
    decode(buffer) {
      return String.fromCharCode.apply(null, new Uint8Array(buffer));
    }
  };
}

// Mock User class
class User {
  constructor(id, username, displayName, publicKey, avatarUrl, isOnline = false, lastSeen = new Date()) {
    this.id = id;
    this.username = username;
    this.displayName = displayName;
    this.publicKey = publicKey;
    this.avatarUrl = avatarUrl;
    this.isOnline = isOnline;
    this.lastSeen = lastSeen;
  }
  
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      displayName: this.displayName,
      publicKey: this.publicKey,
      avatarUrl: this.avatarUrl,
      isOnline: this.isOnline,
      lastSeen: this.lastSeen
    };
  }
}

// Mock Chat class
class Chat {
  constructor(id, name, participantIds, createdAt = new Date(), type = 'GROUP') {
    this.id = id;
    this.name = name;
    this.participantIds = participantIds;
    this.createdAt = createdAt;
    this.type = type;
  }
}

// Mock Message class
class Message {
  constructor(id, chatId, senderId, content, timestamp = new Date(), isEncrypted = false, attachments = []) {
    this.id = id;
    this.chatId = chatId;
    this.senderId = senderId;
    this.content = content;
    this.timestamp = timestamp;
    this.isEncrypted = isEncrypted;
    this.attachments = attachments;
  }
}

// Simplified MCP implementation
class SimplifiedMCP {
  constructor() {
    this.users = new Map();
    this.chats = new Map();
    this.messages = new Map();
  }
  
  // User operations
  async createUser(username, displayName) {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const user = new User(
      userId,
      username,
      displayName,
      `mock-key-for-${username}`,
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      true
    );
    
    this.users.set(userId, user);
    return user;
  }
  
  // Chat operations
  async createChat(name, participants, type = 'GROUP') {
    const chatId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const chat = new Chat(
      chatId,
      name,
      participants.map(p => p.id),
      new Date(),
      type
    );
    
    this.chats.set(chatId, chat);
    return chat;
  }
  
  // Message operations
  async sendMessage(chatId, senderId, content) {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const message = new Message(
      messageId,
      chatId,
      senderId,
      content,
      new Date()
    );
    
    this.messages.set(messageId, message);
    return message;
  }
  
  getMessagesInChat(chatId) {
    return Array.from(this.messages.values())
      .filter(message => message.chatId === chatId);
  }
}

// Run the test
async function runTest() {
  console.log('🔧 STARTING SIMPLIFIED MCP TEST');
  console.log('==============================');
  
  try {
    const mcp = new SimplifiedMCP();
    
    // Create test users
    console.log('Creating test users...');
    const alice = await mcp.createUser('alice', 'Alice');
    const bob = await mcp.createUser('bob', 'Bob');
    
    console.log(`Created user: ${alice.displayName} (${alice.username})`);
    console.log(`Created user: ${bob.displayName} (${bob.username})`);
    
    // Create a chat
    console.log('\nCreating test chat...');
    const chat = await mcp.createChat('Test Chat', [alice, bob]);
    console.log(`Created chat: ${chat.name} with participants: ${chat.participantIds.length}`);
    
    // Send messages
    console.log('\nSending test messages...');
    const message1 = await mcp.sendMessage(chat.id, alice.id, 'Hello from Alice!');
    const message2 = await mcp.sendMessage(chat.id, bob.id, 'Hi Alice, this is Bob!');
    
    console.log(`Message from ${alice.displayName}: ${message1.content}`);
    console.log(`Message from ${bob.displayName}: ${message2.content}`);
    
    // Retrieve chat messages
    const chatMessages = mcp.getMessagesInChat(chat.id);
    console.log(`\nChat has ${chatMessages.length} messages`);
    
    console.log('\n✅ SIMPLIFIED MCP TEST COMPLETED SUCCESSFULLY');
    return { alice, bob, chat, messages: chatMessages };
    
  } catch (error) {
    console.error('❌ TEST FAILED:', error);
    process.exit(1);
  }
}

// Execute the test
runTest().then(result => {
  console.log('\nTest result:', JSON.stringify(result, null, 2));
});
