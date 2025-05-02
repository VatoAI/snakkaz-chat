
/**
 * Encryption utilities for group communications
 */

import { generateMessageKey } from './message-encryption';

// Create a new encryption key for a group
export const createGroupEncryptionKey = async (): Promise<string> => {
  return generateMessageKey();
};

// Get or retrieve an encryption key for a group
export const getGroupEncryptionKey = async (groupId: string): Promise<string | null> => {
  // Try to retrieve from local storage
  const storedKey = localStorage.getItem(`group_key_${groupId}`);
  if (storedKey) {
    return storedKey;
  }
  
  // If no stored key, return null (key will need to be requested or shared)
  return null;
};

// Store a group encryption key securely
export const storeGroupEncryptionKey = (groupId: string, key: string): void => {
  localStorage.setItem(`group_key_${groupId}`, key);
};
