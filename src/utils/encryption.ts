/**
 * Utility functions for encryption and decryption
 */

// Generate a random encryption key
export const generateEncryptionKey = (): string => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Encrypt content with a key
export const encryptWithKey = async (content: string, key: string): Promise<{ encryptedContent: string; iv: string }> => {
  try {
    // Generate initialization vector
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const ivHex = Array.from(iv, byte => byte.toString(16).padStart(2, '0')).join('');
    
    // Convert data to ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    
    // Derive key from string
    const keyData = encoder.encode(key);
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw', 
      keyData, 
      { name: 'AES-GCM' }, 
      false, 
      ['encrypt']
    );
    
    // Encrypt data
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv }, 
      cryptoKey, 
      data
    );
    
    // Convert to base64 string
    const encryptedContent = btoa(
      String.fromCharCode.apply(null, Array.from(new Uint8Array(encryptedData)))
    );
    
    return { encryptedContent, iv: ivHex };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt content');
  }
};

// Decrypt content with a key
export const decryptWithKey = async (encryptedContent: string, key: string, ivHex: string): Promise<string> => {
  try {
    // Convert IV from hex to Uint8Array
    const iv = new Uint8Array(ivHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    
    // Convert encrypted data from base64 to ArrayBuffer
    const encryptedData = Uint8Array.from(atob(encryptedContent), c => c.charCodeAt(0));
    
    // Derive key from string
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw', 
      keyData, 
      { name: 'AES-GCM' }, 
      false, 
      ['decrypt']
    );
    
    // Decrypt data
    const decryptedData = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv }, 
      cryptoKey, 
      encryptedData
    );
    
    // Convert to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt content');
  }
};

// Re-export all necessary functions from the encryption directory
export { encryptMessage, decryptMessage, importEncryptionKey } from './encryption/message-encryption';
export { encryptMedia, decryptMedia, encryptFile } from './encryption/media';
export { 
  str2ab, 
  ab2str, 
  arrayBufferToBase64, 
  base64ToArrayBuffer, 
  hexToArrayBuffer, 
  arrayBufferToHex 
} from './encryption/data-conversion';
export { createGroupEncryptionKey, getGroupEncryptionKey } from './encryption/group';
export { establishSecureConnection } from './encryption/secure-connection';
export { generateKeyPair } from './encryption/key-management';
