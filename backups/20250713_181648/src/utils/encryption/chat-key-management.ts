/**
 * Chat Encryption Key Management
 * 
 * Utilities for managing encryption keys in the Snakkaz Chat application
 */

import { generateEncryptionKey, arrayBufferToBase64, base64ToArrayBuffer } from './key-management';

// Generate a new encryption key for a chat
export const generateChatEncryptionKey = async (chatId: string): Promise<string> => {
  try {
    // Check if we already have a key for this chat in secure storage
    const existingKey = await getChatEncryptionKey(chatId);
    if (existingKey) {
      return existingKey;
    }
    
    // Generate new key using existing key generator
    const key = await generateEncryptionKey();
    
    // Store key securely
    await storeChatEncryptionKey(chatId, key);
    
    return key;
  } catch (error) {
    console.error('Error generating chat encryption key:', error);
    throw new Error('Failed to generate encryption key');
  }
};

// Store a chat encryption key securely
export const storeChatEncryptionKey = async (chatId: string, key: string): Promise<void> => {
  try {
    // In a production environment, we would use a more secure storage method
    // For now, we'll use localStorage with a prefix
    const storageKey = `snakkaz_chat_key_${chatId}`;
    localStorage.setItem(storageKey, key);
  } catch (error) {
    console.error('Error storing chat encryption key:', error);
    throw new Error('Failed to store encryption key');
  }
};

// Retrieve a chat encryption key from secure storage
export const getChatEncryptionKey = async (chatId: string): Promise<string | null> => {
  try {
    // In a production environment, we would use a more secure storage method
    const storageKey = `snakkaz_chat_key_${chatId}`;
    const key = localStorage.getItem(storageKey);
    return key;
  } catch (error) {
    console.error('Error retrieving chat encryption key:', error);
    return null;
  }
};

// Remove a chat encryption key from secure storage
export const removeChatEncryptionKey = async (chatId: string): Promise<void> => {
  try {
    const storageKey = `snakkaz_chat_key_${chatId}`;
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error('Error removing chat encryption key:', error);
  }
};

// Export a key in a format that can be shared with other users
export const exportChatEncryptionKey = (key: string): string => {
  // In a real app, we might add more protection or formatting here
  return key;
};

// Import a key that has been shared by another user
export const importChatEncryptionKey = (exportedKey: string): string => {
  // In a real app, we would validate and process the key here
  return exportedKey;
};

// Share a key with another user safely
export const shareChatEncryptionKey = async (
  chatId: string, 
  recipientPublicKey: JsonWebKey
): Promise<string> => {
  try {
    // Get the chat key
    const chatKey = await getChatEncryptionKey(chatId);
    if (!chatKey) {
      throw new Error('Chat key not found');
    }
    
    // In a real implementation, we would:
    // 1. Encrypt the chat key with the recipient's public key
    // 2. Sign the encrypted key with our private key
    // 3. Return the encrypted, signed key
    
    // For now, just return the key as is (insecure placeholder)
    return chatKey;
  } catch (error) {
    console.error('Error sharing chat key:', error);
    throw new Error('Failed to share chat encryption key');
  }
};
