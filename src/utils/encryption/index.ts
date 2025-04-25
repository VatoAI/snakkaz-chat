
/**
 * Entry point for encryption utilities
 */

// Re-export all encryption functionality except for generateEncryptionKey which is re-exported via group
export * from './secure-connection';
export * from './message-encryption';
export * from './data-conversion';
export * from './types';

// Export key-management functions excluding generateEncryptionKey to avoid ambiguity
import { 
  encryptSessionKey, 
  decryptSessionKey,
  deriveKey,
  generateSalt,
  hashPassword
} from './key-management';

export {
  encryptSessionKey, 
  decryptSessionKey,
  deriveKey,
  generateSalt,
  hashPassword
};

// Export group functions
import { createGroupEncryptionKey, getGroupEncryptionKey } from './group';
export { createGroupEncryptionKey, getGroupEncryptionKey };

// Re-export generateEncryptionKey from key-management after other exports to ensure it's the canonical source
import { generateEncryptionKey } from './key-management';
export { generateEncryptionKey };
