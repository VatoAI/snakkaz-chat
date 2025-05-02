
/**
 * Encryption utilities for media files and blobs
 */

import { 
  arrayBufferToBase64, 
  base64ToArrayBuffer, 
  hexToArrayBuffer 
} from './data-conversion';
import { generateMessageKey } from './message-encryption';

// Encrypt media file/blob
export const encryptMedia = async (media: Blob): Promise<{
  encryptedData: Blob;
  key: string;
  iv: string;
}> => {
  // Generate a random encryption key
  const key = generateMessageKey();
  
  // Generate initialization vector
  const ivArray = window.crypto.getRandomValues(new Uint8Array(12));
  const iv = Array.from(ivArray, byte => byte.toString(16).padStart(2, '0')).join('');
  
  // Import the key for encryption
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    hexToArrayBuffer(key),
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  
  // Convert blob to ArrayBuffer
  const arrayBuffer = await media.arrayBuffer();
  
  // Encrypt the data
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: ivArray },
    cryptoKey,
    arrayBuffer
  );
  
  // Convert encrypted data back to Blob
  const encryptedData = new Blob([encryptedBuffer], { type: 'application/octet-stream' });
  
  return { encryptedData, key, iv };
};

// Decrypt media
export const decryptMedia = async (
  encryptedData: Blob,
  key: string,
  iv: string
): Promise<Blob> => {
  try {
    // Import the key for decryption
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      hexToArrayBuffer(key),
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    
    // Convert IV from hex to ArrayBuffer
    const ivArray = new Uint8Array(hexToArrayBuffer(iv));
    
    // Convert encrypted data to ArrayBuffer
    const encryptedBuffer = await encryptedData.arrayBuffer();
    
    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivArray },
      cryptoKey,
      encryptedBuffer
    );
    
    // Convert decrypted data back to Blob
    return new Blob([decryptedBuffer]);
  } catch (error) {
    console.error('Error decrypting media:', error);
    throw new Error('Failed to decrypt media');
  }
};

// Encrypt file (wrapper around encryptMedia)
export const encryptFile = async (file: File): Promise<{
  encryptedFile: Blob;
  metadata: string;
  key: string;
  iv: string;
}> => {
  // Store file metadata
  const metadata = JSON.stringify({
    name: file.name,
    type: file.type,
    lastModified: file.lastModified
  });
  
  // Encrypt the file
  const { encryptedData, key, iv } = await encryptMedia(file);
  
  return { encryptedFile: encryptedData, metadata, key, iv };
};
