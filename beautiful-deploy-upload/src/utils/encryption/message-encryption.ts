
/**
 * Functions for handling message encryption/decryption
 */

import { str2ab, ab2str, arrayBufferToBase64, base64ToArrayBuffer } from './data-conversion';
import { EncryptedContent } from './types';

// Generate a new encryption key for messages
export const generateMessageEncryptionKey = (): string => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Encrypt a message
export const encryptMessage = async (content: string): Promise<EncryptedContent> => {
  try {
    // Generate random key and iv
    const key = generateMessageEncryptionKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const ivHex = Array.from(iv, byte => byte.toString(16).padStart(2, '0')).join('');
    
    // Import the key
    const cryptoKey = await importEncryptionKey(key);
    
    // Convert content to ArrayBuffer and encrypt
    const encoder = new TextEncoder();
    const contentBuffer = encoder.encode(content);
    
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      contentBuffer
    );
    
    // Convert to base64 string
    const encryptedContent = arrayBufferToBase64(encryptedBuffer);
    
    return { encryptedContent, key, iv: ivHex };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt message content');
  }
};

// Decrypt a message
export const decryptMessage = async (
  encryptedContent: string,
  key: string,
  iv: string
): Promise<string> => {
  try {
    // Convert hex IV to Uint8Array
    const ivArray = new Uint8Array(iv.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    
    // Import the key
    const cryptoKey = await importEncryptionKey(key);
    
    // Convert base64 encrypted content to ArrayBuffer
    const encryptedBuffer = base64ToArrayBuffer(encryptedContent);
    
    // Decrypt
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivArray },
      cryptoKey,
      encryptedBuffer
    );
    
    // Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt message content');
  }
};

// Import an encryption key for use with Web Crypto API
export const importEncryptionKey = async (keyHex: string): Promise<CryptoKey> => {
  // Convert hex key to ArrayBuffer
  const keyBytes = new Uint8Array(keyHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  
  return window.crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};
