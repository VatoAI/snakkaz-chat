/**
 * Entry point for encryption utilities
 */

// Re-export all non-conflicting encryption functionality
export * from './secure-connection';
export * from './data-conversion';
export * from './types';
export * from './key-management';

// Handle potential conflicts with named imports/exports
// Import media module functions and rename the conflicting importEncryptionKey
import { 
  encryptMedia, 
  encryptFile, 
  decryptMedia,
  importEncryptionKey as importMediaEncryptionKey 
} from './media';

// Import message encryption module functions
import { 
  encryptMessage, 
  decryptMessage,
  importEncryptionKey
} from './message-encryption';

// Re-export with renamed function to avoid conflicts
export { 
  encryptMedia,
  encryptFile, 
  decryptMedia,
  encryptMessage, 
  decryptMessage,
  importEncryptionKey,
  importMediaEncryptionKey
};

// Export blob encryption as alias
export const encryptBlob = encryptMedia;

// Export group functions
import { createGroupEncryptionKey, getGroupEncryptionKey } from './group';
export { createGroupEncryptionKey, getGroupEncryptionKey };

// Export group-keys with renamed function to avoid conflict
import { generateEncryptionKey as generateGroupEncryptionKey, importGroupEncryptionKey } from './group-keys';
export { generateGroupEncryptionKey, importGroupEncryptionKey };

// Export whole page encryption
export * from './whole-page-encryption';
