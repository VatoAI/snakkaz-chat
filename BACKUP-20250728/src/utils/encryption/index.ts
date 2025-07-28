
/**
 * Entry point for encryption utilities
 * 
 * This file consolidates all encryption-related exports from various modules
 * to provide a single import point for the application.
 */

// Re-export functions from message-encryption module
export { encryptMessage, decryptMessage, importEncryptionKey, generateMessageEncryptionKey } from './message-encryption';

// Re-export from media encryption module
export { encryptMedia, decryptMedia, encryptFile } from './media';

// Re-export from data-conversion module
export { 
  str2ab, 
  ab2str, 
  arrayBufferToBase64, 
  base64ToArrayBuffer, 
  hexToArrayBuffer, 
  arrayBufferToHex 
} from './data-conversion';

// Re-export types
export * from './types';

// Re-export blob encryption as an alias for encryptMedia
export { encryptMedia as encryptBlob } from './media';

// Export group encryption functions
export { createGroupEncryptionKey, getGroupEncryptionKey } from './group';

// Re-export from the main encryption utility
export { generateEncryptionKey, encryptWithKey, decryptWithKey } from '../encryption';
