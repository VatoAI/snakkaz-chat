
/**
 * Functions for handling media encryption/decryption
 */

import { arrayBufferToBase64, base64ToArrayBuffer } from './data-conversion';

// Encrypt file (image, video, document)
export const encryptFile = async (
  file: File
): Promise<{ encryptedData: string; key: string; iv: string }> => {
  try {
    // Generate random key and IV
    const keyArray = window.crypto.getRandomValues(new Uint8Array(32));
    const key = Array.from(keyArray, byte => byte.toString(16).padStart(2, '0')).join('');
    
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const ivHex = Array.from(iv, byte => byte.toString(16).padStart(2, '0')).join('');
    
    // Import the key
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyArray,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
    
    // Read file as ArrayBuffer
    const fileContent = await file.arrayBuffer();
    
    // Encrypt the file
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      fileContent
    );
    
    // Convert to base64 for storage/transmission
    const encryptedData = arrayBufferToBase64(encryptedBuffer);
    
    return {
      encryptedData,
      key,
      iv: ivHex
    };
  } catch (error) {
    console.error('File encryption error:', error);
    throw new Error('Failed to encrypt file');
  }
};

// Encrypt media blob (image, video)
export const encryptMedia = async (
  mediaBlob: Blob
): Promise<{ encryptedData: string; key: string; iv: string }> => {
  try {
    // Generate random key and IV
    const keyArray = window.crypto.getRandomValues(new Uint8Array(32));
    const key = Array.from(keyArray, byte => byte.toString(16).padStart(2, '0')).join('');
    
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const ivHex = Array.from(iv, byte => byte.toString(16).padStart(2, '0')).join('');
    
    // Import the key
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyArray,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
    
    // Read blob as ArrayBuffer
    const mediaContent = await mediaBlob.arrayBuffer();
    
    // Encrypt the media
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      mediaContent
    );
    
    // Convert to base64 for storage/transmission
    const encryptedData = arrayBufferToBase64(encryptedBuffer);
    
    return {
      encryptedData,
      key,
      iv: ivHex
    };
  } catch (error) {
    console.error('Media encryption error:', error);
    throw new Error('Failed to encrypt media');
  }
};

// Decrypt media data
export const decryptMedia = async (
  encryptedData: string,
  key: string,
  iv: string,
  mimeType: string = 'image/jpeg'
): Promise<Blob> => {
  try {
    // Convert hex key to Uint8Array
    const keyArray = new Uint8Array(
      key.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );
    
    // Import the key
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyArray,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    
    // Convert hex IV to Uint8Array
    const ivArray = new Uint8Array(
      iv.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );
    
    // Convert base64 encrypted data to ArrayBuffer
    const encryptedBuffer = base64ToArrayBuffer(encryptedData);
    
    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivArray },
      cryptoKey,
      encryptedBuffer
    );
    
    // Convert to Blob with specified MIME type
    return new Blob([decryptedBuffer], { type: mimeType });
  } catch (error) {
    console.error('Media decryption error:', error);
    throw new Error('Failed to decrypt media');
  }
};
