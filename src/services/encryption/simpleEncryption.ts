/**
 * Simplified Cryptographic Utilities for Secure Credential Storage
 * 
 * This module provides basic encryption/decryption functions for credential storage.
 */

/**
 * Convert a string to an ArrayBuffer
 */
function str2ab(str: string): ArrayBuffer {
  return new TextEncoder().encode(str);
}

/**
 * Convert an ArrayBuffer to a string
 */
function ab2str(buffer: ArrayBuffer): string {
  return new TextDecoder().decode(buffer);
}

/**
 * Convert an ArrayBuffer to a base64 string
 */
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert a base64 string to an ArrayBuffer
 */
function base64ToBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Derive a key from a password and salt using PBKDF2
 */
async function deriveKey(password: string, salt: string): Promise<CryptoKey> {
  const passwordBuffer = str2ab(password);
  const saltBuffer = str2ab(salt);
  
  // Import the password as a key
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  // Derive an AES-GCM key from the password
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt data using AES-GCM
 * @param data Data to encrypt
 * @param password Password for encryption
 * @param salt Salt for key derivation
 * @returns Encrypted data as a base64 string with IV prefixed
 */
export async function encrypt(data: string, password: string, salt: string): Promise<string> {
  try {
    // Convert data to ArrayBuffer
    const dataBuffer = str2ab(data);
    
    // Derive the key from the password
    const key = await deriveKey(password, salt);
    
    // Generate a random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the data
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      dataBuffer
    );
    
    // Combine the IV and encrypted data
    const result = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    result.set(iv, 0);
    result.set(new Uint8Array(encryptedBuffer), iv.length);
    
    // Convert to base64
    return bufferToBase64(result.buffer);
  } catch (e) {
    console.error('Encryption failed:', e);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt data using AES-GCM
 * @param encryptedData Encrypted data as a base64 string with IV prefixed
 * @param password Password for decryption
 * @param salt Salt for key derivation
 * @returns Decrypted data as string
 */
export async function decrypt(encryptedData: string, password: string, salt: string): Promise<string> {
  try {
    // Convert base64 to ArrayBuffer
    const encryptedBuffer = base64ToBuffer(encryptedData);
    
    // Extract the IV from the beginning of the data
    const iv = encryptedBuffer.slice(0, 12);
    const data = encryptedBuffer.slice(12);
    
    // Derive the key from the password
    const key = await deriveKey(password, salt);
    
    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      data
    );
    
    // Convert the decrypted ArrayBuffer back to a string
    return ab2str(decryptedBuffer);
  } catch (e) {
    console.error('Decryption failed:', e);
    throw new Error('Failed to decrypt data - invalid password or corrupted data');
  }
}
