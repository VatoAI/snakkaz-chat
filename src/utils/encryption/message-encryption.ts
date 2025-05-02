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
    console.debug(`Attempting to decrypt message with key format: ${key.substring(0, 10)}... (${key.length} chars) and IV format: ${iv.substring(0, 10)}... (${iv.length} chars)`);
    
    // Import the key for decryption
    const cryptoKey = await importEncryptionKey(key);
    
    let ivArray: Uint8Array;
    
    try {
      // First try to handle IV as a Base64 string
      if (iv.match(/^[A-Za-z0-9+/=]+$/) && iv.length % 4 === 0) {
        try {
          const binaryString = atob(iv);
          ivArray = new Uint8Array(binaryString.split('').map(c => c.charCodeAt(0)));
          console.debug(`IV parsed as Base64, length: ${ivArray.length}`);
        } catch (e) {
          // Not valid Base64, try as hex string
          ivArray = new Uint8Array(hexToArrayBuffer(iv));
          console.debug(`IV parsed as hex string, length: ${ivArray.length}`);
        }
      } else {
        // Try as hex string by default
        ivArray = new Uint8Array(hexToArrayBuffer(iv));
        console.debug(`IV parsed as hex string, length: ${ivArray.length}`);
      }
    } catch (e) {
      console.warn('IV format conversion failed, trying direct use:', e);
      // Last resort: try direct string conversion
      ivArray = new Uint8Array(Array.from(iv).map(c => c.charCodeAt(0)));
      console.debug(`IV parsed using direct string conversion, length: ${ivArray.length}`);
    }
    
    // Validate IV length
    if (ivArray.length !== 12 && ivArray.length !== 16) {
      console.warn(`IV length is ${ivArray.length}, expected 12 or 16 bytes. This might cause decryption to fail.`);
    }
    
    // Convert encrypted content from base64 to ArrayBuffer
    const encryptedBuffer = base64ToArrayBuffer(encryptedContent);
    console.debug(`Encrypted content buffer length: ${encryptedBuffer.byteLength}`);
    
    // Decrypt the content
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivArray },
      cryptoKey,
      encryptedBuffer
    );
    
    // Convert decrypted content to string
    const decoder = new TextDecoder();
    const decryptedText = decoder.decode(decryptedBuffer);
    console.debug('Message decryption successful');
    return decryptedText;
  } catch (error) {
    console.error('Error decrypting message:', error);
    throw new Error('Failed to decrypt message');
  }
};

// Import a hex string key for crypto operations
export const importEncryptionKey = async (keyString: string): Promise<CryptoKey> => {
  try {
    // Check if key is in JWK format (JSON string)
    if (keyString.includes('{') && keyString.includes('}')) {
      try {
        const jwk = JSON.parse(keyString);
        return window.crypto.subtle.importKey(
          'jwk',
          jwk,
          { name: 'AES-GCM' },
          false,
          ['encrypt', 'decrypt']
        );
      } catch (e) {
        console.log('Not valid JWK, trying other formats');
      }
    }
    
    // Check if the key is a Base64 string
    if (keyString.match(/^[A-Za-z0-9+/=]+$/) && keyString.length % 4 === 0) {
      try {
        // Try Base64 decode
        const binaryString = atob(keyString);
        const keyBuffer = new Uint8Array(binaryString.split('').map(c => c.charCodeAt(0))).buffer;
        
        return window.crypto.subtle.importKey(
          'raw',
          keyBuffer,
          { name: 'AES-GCM' },
          false,
          ['encrypt', 'decrypt']
        );
      } catch (e) {
        console.log('Not valid Base64, trying hex format');
      }
    }
    
    // Default: Try as hex string
    const keyBuffer = hexToArrayBuffer(keyString);
    return window.crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  } catch (error) {
    console.error('Failed to import encryption key:', error);
    throw new Error(`Key import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
