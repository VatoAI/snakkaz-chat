/**
 * Encryption Service
 * 
 * Provides encryption and decryption functionality for the Secure Message Viewer
 */

// Import crypto utilities for Web Crypto API operations
import { 
  deriveKeyFromPassword,
  generateSalt,
  base64ToArrayBuffer,
  arrayBufferToString
} from '../../services/encryption/cryptoUtils';

/**
 * EncryptionService class - provides methods for encrypting and decrypting data
 */
export class EncryptionService {
  
  /**
   * Decrypt data with a default key
   */
  public async decrypt<T = unknown>(
    encryptedData: string, 
    defaultKey: string
  ): Promise<T | string> {
    try {
      // Parse the encrypted data
      const parts = encryptedData.split('.');
      
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }
      
      const [salt, iv, data] = parts;
      
      // Convert salt and IV to ArrayBuffer
      const saltBuffer = base64ToArrayBuffer(salt);
      const ivBuffer = base64ToArrayBuffer(iv);
      
      // Derive a key from the defaultKey
      const key = await deriveKeyFromPassword(defaultKey, saltBuffer);
      
      // Create the decryption params
      const algo = {
        name: 'AES-GCM',
        iv: ivBuffer
      };
      
      // Decrypt the data
      const encryptedBuffer = base64ToArrayBuffer(data);
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        algo,
        key,
        encryptedBuffer
      );
      
      // Convert the decrypted buffer to string
      const decryptedString = arrayBufferToString(decryptedBuffer);
      
      // Try to parse as JSON, otherwise return as string
      try {
        return JSON.parse(decryptedString) as T;
      } catch (e) {
        return decryptedString;
      }
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }
  
  /**
   * Decrypt data with a password
   */
  public async decryptWithPassword(encryptedData: string, password: string): Promise<string> {
    try {
      // Parse the encrypted data
      const parts = encryptedData.split('.');
      
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }
      
      const [salt, iv, data] = parts;
      
      // Convert salt and IV to ArrayBuffer
      const saltBuffer = base64ToArrayBuffer(salt);
      const ivBuffer = base64ToArrayBuffer(iv);
      
      // Derive a key from the password
      const key = await deriveKeyFromPassword(password, saltBuffer);
      
      // Create the decryption params
      const algo = {
        name: 'AES-GCM',
        iv: ivBuffer
      };
      
      // Decrypt the data
      const encryptedBuffer = base64ToArrayBuffer(data);
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        algo,
        key,
        encryptedBuffer
      );
      
      // Convert the decrypted buffer to string
      return arrayBufferToString(decryptedBuffer);
    } catch (error) {
      console.error('Decryption with password error:', error);
      throw new Error('Failed to decrypt data with password');
    }
  }
}
