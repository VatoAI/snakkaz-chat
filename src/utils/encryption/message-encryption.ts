
/**
 * Encryption utilities for messages
 */

import { 
  arrayBufferToBase64, 
  base64ToArrayBuffer, 
  hexToArrayBuffer, 
  arrayBufferToHex 
} from './data-conversion';

// Generate a unique encryption key for a message
export const generateMessageKey = (): string => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Encrypt a message with a new random key
export const encryptMessage = async (content: string): Promise<{
  encryptedContent: string;
  key: string;
  iv: string;
}> => {
  // Generate a random encryption key
  const key = generateMessageKey();
  
  // Generate initialization vector
  const ivArray = window.crypto.getRandomValues(new Uint8Array(12));
  const iv = arrayBufferToHex(ivArray.buffer);
  
  // Import the key for encryption
  const cryptoKey = await importEncryptionKey(key);
  
  // Encrypt the content
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: ivArray },
    cryptoKey,
    data
  );
  
  // Convert to base64 for storage/transmission
  const encryptedContent = arrayBufferToBase64(encryptedBuffer);
  
  return { encryptedContent, key, iv };
};

// Decrypt a message with the provided key and IV
export const decryptMessage = async (
  encryptedContent: string,
  key: string,
  iv: string
): Promise<string> => {
  try {
    // Import the key for decryption
    const cryptoKey = await importEncryptionKey(key);
    
    // Convert IV from hex to ArrayBuffer
    const ivArray = new Uint8Array(hexToArrayBuffer(iv));
    
    // Convert encrypted content from base64 to ArrayBuffer
    const encryptedBuffer = base64ToArrayBuffer(encryptedContent);
    
    // Decrypt the content
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivArray },
      cryptoKey,
      encryptedBuffer
    );
    
    // Convert decrypted content to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('Error decrypting message:', error);
    throw new Error('Failed to decrypt message');
  }
};

// Import a hex string key for crypto operations
export const importEncryptionKey = async (hexKey: string): Promise<CryptoKey> => {
  const keyBuffer = hexToArrayBuffer(hexKey);
  return window.crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};
