/**
 * Group Message Encryption Service
 * 
 * Provides end-to-end encryption for group messages in Snakkaz Chat
 * using the Web Cryptography API
 */

import { nanoid } from 'nanoid';
import secureKeyStorage from '@/utils/security/secure-key-storage';

// Define the encryption algorithm and parameters
const ENCRYPTION_ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256; // bits
const IV_LENGTH = 12; // bytes
const KEY_USAGE = ['encrypt', 'decrypt'] as const;
const KEY_FORMAT = 'raw';
const KEY_EXTRACTABLE = false;

interface EncryptedMessage {
  ciphertext: string;  // Base64-encoded encrypted message
  iv: string;         // Base64-encoded initialization vector
  keyId: string;      // ID of the key used for encryption
}

interface GroupKeyMetadata {
  groupId: string;
  keyId: string;
  version: number;
  createdAt: number;
}

/**
 * Generate a new encryption key for a group
 */
export async function generateGroupKey(groupId: string): Promise<string> {
  try {
    const keyId = `group-${groupId}-${nanoid(8)}`;
    const keyData = crypto.getRandomValues(new Uint8Array(KEY_LENGTH / 8));
    
    // Import the key data into a CryptoKey object
    const key = await crypto.subtle.importKey(
      KEY_FORMAT,
      keyData,
      {
        name: ENCRYPTION_ALGORITHM,
        length: KEY_LENGTH
      },
      KEY_EXTRACTABLE,
      KEY_USAGE
    );
    
    // Store the key in secure storage
    await secureKeyStorage.storeKey(keyId, keyData);
    
    // Store metadata for the key
    const metadata: GroupKeyMetadata = {
      groupId,
      keyId,
      version: 1,
      createdAt: Date.now()
    };
    
    // Store metadata in localStorage (not sensitive)
    const groupKeys = getGroupKeysMetadata();
    groupKeys[keyId] = metadata;
    localStorage.setItem('group_encryption_keys', JSON.stringify(groupKeys));
    
    return keyId;
  } catch (error) {
    console.error('Failed to generate group key:', error);
    throw new Error('Failed to set up secure group communication');
  }
}

/**
 * Get the current active key for a group
 */
export async function getGroupKey(groupId: string): Promise<string> {
  const groupKeys = getGroupKeysMetadata();
  
  // Find the latest key for this group
  const keysForGroup = Object.values(groupKeys)
    .filter((meta: GroupKeyMetadata) => meta.groupId === groupId)
    .sort((a: GroupKeyMetadata, b: GroupKeyMetadata) => b.createdAt - a.createdAt);
  
  if (keysForGroup.length > 0) {
    return keysForGroup[0].keyId;
  }
  
  // No key found, generate a new one
  return generateGroupKey(groupId);
}

/**
 * Get metadata for all group keys
 */
function getGroupKeysMetadata(): Record<string, GroupKeyMetadata> {
  try {
    const data = localStorage.getItem('group_encryption_keys');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Failed to parse group keys metadata:', error);
    return {};
  }
}

/**
 * Encrypt a message for a group
 */
export async function encryptGroupMessage(
  groupId: string,
  message: string
): Promise<EncryptedMessage> {
  try {
    // Get the current key for this group
    const keyId = await getGroupKey(groupId);
    const keyData = await secureKeyStorage.getKey(keyId);
    
    if (!keyData) {
      throw new Error(`Encryption key not found for group ${groupId}`);
    }
    
    // Import the raw key data into a CryptoKey
    const key = await crypto.subtle.importKey(
      KEY_FORMAT,
      keyData,
      {
        name: ENCRYPTION_ALGORITHM,
        length: KEY_LENGTH
      },
      KEY_EXTRACTABLE,
      KEY_USAGE
    );
    
    // Generate a random initialization vector
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    
    // Convert message to ArrayBuffer
    const encoder = new TextEncoder();
    const messageData = encoder.encode(message);
    
    // Encrypt the message
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv
      },
      key,
      messageData
    );
    
    // Convert binary data to Base64 strings
    return {
      ciphertext: arrayBufferToBase64(ciphertext),
      iv: arrayBufferToBase64(iv),
      keyId
    };
  } catch (error) {
    console.error('Failed to encrypt group message:', error);
    throw new Error('Failed to encrypt message for secure group communication');
  }
}

/**
 * Decrypt a message from a group
 */
export async function decryptGroupMessage(
  encryptedMessage: EncryptedMessage
): Promise<string> {
  try {
    const { ciphertext, iv, keyId } = encryptedMessage;
    
    // Get the key from secure storage
    const keyData = await secureKeyStorage.getKey(keyId);
    
    if (!keyData) {
      throw new Error(`Decryption key not found: ${keyId}`);
    }
    
    // Import the raw key data into a CryptoKey
    const key = await crypto.subtle.importKey(
      KEY_FORMAT,
      keyData,
      {
        name: ENCRYPTION_ALGORITHM,
        length: KEY_LENGTH
      },
      KEY_EXTRACTABLE,
      KEY_USAGE
    );
    
    // Convert Base64 strings back to ArrayBuffer
    const ciphertextData = base64ToArrayBuffer(ciphertext);
    const ivData = base64ToArrayBuffer(iv);
    
    // Decrypt the message
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv: ivData
      },
      key,
      ciphertextData
    );
    
    // Convert ArrayBuffer back to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Failed to decrypt group message:', error);
    throw new Error('Failed to decrypt message from secure group communication');
  }
}

/**
 * Rotate the group key (for security or when members change)
 */
export async function rotateGroupKey(groupId: string): Promise<string> {
  try {
    // Generate a new key
    const newKeyId = await generateGroupKey(groupId);
    
    // Update metadata to indicate this is a rotated key
    const groupKeys = getGroupKeysMetadata();
    const previousKeys = Object.values(groupKeys)
      .filter((meta: GroupKeyMetadata) => meta.groupId === groupId)
      .sort((a: GroupKeyMetadata, b: GroupKeyMetadata) => b.version - a.version);
    
    if (previousKeys.length > 0) {
      const latestVersion = previousKeys[0].version;
      groupKeys[newKeyId].version = latestVersion + 1;
      localStorage.setItem('group_encryption_keys', JSON.stringify(groupKeys));
    }
    
    return newKeyId;
  } catch (error) {
    console.error('Failed to rotate group key:', error);
    throw new Error('Failed to update secure group communication');
  }
}

/**
 * Utility to convert ArrayBuffer to Base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Utility to convert Base64 string to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
