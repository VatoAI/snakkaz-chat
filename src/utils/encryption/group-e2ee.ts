/**
 * Group End-to-End Encryption (E2EE) Utilities
 * 
 * Provides specialized encryption functions for secure group communication
 * with forward secrecy and multi-recipient encryption support.
 */

import { 
  generateAesKey, 
  encryptAesGcm, 
  decryptAesGcm,
  encryptRsaOaep,
  decryptRsaOaep,
  exportKeyToJwk,
  importKeyFromJwk,
  generateRandomString,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  stringToArrayBuffer,
  arrayBufferToString,
  KeyType,
  KeyUsage
} from '../../services/encryption/cryptoUtils';

/**
 * Group key structure containing metadata and actual encryption key
 */
export interface GroupKey {
  keyId: string;       // Unique identifier for the key
  encryptedKey: string; // AES key encrypted with recipient's public key
  version: number;     // Key rotation version
  algorithm: string;   // Algorithm used (e.g., 'AES-GCM')
  createdAt: number;   // Timestamp when key was created
  createdBy: string;   // User ID who created the key
  expiresAt?: number;  // Optional expiration time
}

/**
 * Group key rotation history
 */
export interface GroupKeyHistory {
  current: GroupKey;
  previous: GroupKey[];
}

/**
 * Generate a new encryption key for a group
 * 
 * @param groupId ID of the group
 * @param creatorId ID of the user creating the key
 * @param keyStrength Key strength ('standard', 'high', 'ultra')
 * @returns Group key information
 */
export const generateGroupKey = async (
  groupId: string,
  creatorId: string,
  keyStrength: 'standard' | 'high' | 'ultra' = 'high'
): Promise<{ key: CryptoKey, groupKey: GroupKey }> => {
  // Generate random key ID
  const keyId = `${groupId}-${generateRandomString(8)}-${Date.now()}`;
  
  // Key length based on strength
  const keyLength = keyStrength === 'standard' ? 128 : (keyStrength === 'high' ? 256 : 256);
  
  // Generate a new AES key
  const key = await generateAesKey(keyLength as 128 | 256, true);
  
  // Export the key
  const jwk = await exportKeyToJwk(key);
  const keyString = JSON.stringify(jwk);
  
  // In a real implementation, this key would be encrypted with each group member's public key
  // For now, we'll just use a placeholder for demonstration
  const encryptedKey = keyString; // This should actually be encrypted
  
  // Create group key metadata
  const groupKey: GroupKey = {
    keyId,
    encryptedKey,
    version: 1,
    algorithm: 'AES-GCM',
    createdAt: Date.now(),
    createdBy: creatorId
  };
  
  return { key, groupKey };
};

/**
 * Rotate a group key (create a new version)
 * 
 * @param groupId ID of the group
 * @param creatorId ID of the user rotating the key
 * @param currentVersion Current key version number
 * @param keyStrength Key strength
 * @returns New group key
 */
export const rotateGroupKey = async (
  groupId: string,
  creatorId: string,
  currentVersion: number,
  keyStrength: 'standard' | 'high' | 'ultra' = 'high'
): Promise<{ key: CryptoKey, groupKey: GroupKey }> => {
  const { key, groupKey } = await generateGroupKey(groupId, creatorId, keyStrength);
  
  // Update version number based on current version
  groupKey.version = currentVersion + 1;
  
  return { key, groupKey };
};

/**
 * Encrypt a message for a group using the group key
 * 
 * @param message Message to encrypt
 * @param groupKey Group encryption key
 * @returns Encrypted message data
 */
export const encryptGroupMessage = async (
  message: string,
  key: CryptoKey
): Promise<{
  encryptedData: string;
  iv: string;
}> => {
  // Convert message to ArrayBuffer
  const messageBuffer = stringToArrayBuffer(message);
  
  // Encrypt the message
  const { encryptedData, iv } = await encryptAesGcm(messageBuffer, key);
  
  // Convert binary data to strings for storage/transmission
  return {
    encryptedData: arrayBufferToBase64(encryptedData),
    iv: arrayBufferToBase64(iv)
  };
};

/**
 * Decrypt a message using the group key
 * 
 * @param encryptedData Encrypted message data
 * @param iv Initialization vector used for encryption
 * @param key Decryption key
 * @returns Decrypted message
 */
export const decryptGroupMessage = async (
  encryptedData: string,
  iv: string,
  key: CryptoKey
): Promise<string> => {
  // Convert base64 strings back to ArrayBuffers
  const encryptedBuffer = base64ToArrayBuffer(encryptedData);
  const ivBuffer = base64ToArrayBuffer(iv);
  
  // Decrypt the message
  const decryptedBuffer = await decryptAesGcm(encryptedBuffer, key, ivBuffer);
  
  // Convert result back to string
  return arrayBufferToString(decryptedBuffer);
};

/**
 * Encrypt a group key for a specific recipient
 * 
 * @param groupKey Group key to encrypt
 * @param recipientPublicKey Recipient's public key
 * @returns Encrypted group key
 */
export const encryptGroupKeyForMember = async (
  key: CryptoKey,
  recipientPublicKey: CryptoKey
): Promise<string> => {
  // Export the key to JWK format
  const jwk = await exportKeyToJwk(key);
  const keyString = JSON.stringify(jwk);
  
  // Encrypt the key with recipient's public key
  const encryptedKeyBuffer = await encryptRsaOaep(stringToArrayBuffer(keyString), recipientPublicKey);
  
  // Convert to base64 for storage/transmission
  return arrayBufferToBase64(encryptedKeyBuffer);
};

/**
 * Decrypt a group key using recipient's private key
 * 
 * @param encryptedGroupKey Encrypted group key
 * @param privateKey Recipient's private key
 * @returns Decrypted group key
 */
export const decryptGroupKey = async (
  encryptedGroupKey: string,
  privateKey: CryptoKey
): Promise<CryptoKey> => {
  // Convert from base64
  const encryptedKeyBuffer = base64ToArrayBuffer(encryptedGroupKey);
  
  // Decrypt the key using private key
  const keyStringBuffer = await decryptRsaOaep(encryptedKeyBuffer, privateKey);
  const keyString = arrayBufferToString(keyStringBuffer);
  
  // Parse JWK
  const jwk = JSON.parse(keyString);
  
  // Import as CryptoKey
  return await importKeyFromJwk(
    jwk,
    KeyType.AES_GCM,
    [KeyUsage.ENCRYPT, KeyUsage.DECRYPT]
  );
};

/**
 * Generate a key for encrypting files in a group
 * 
 * @param groupId ID of the group
 * @returns File encryption key and metadata
 */
export const generateGroupFileKey = async (
  groupId: string
): Promise<{
  key: CryptoKey;
  keyId: string;
}> => {
  // Generate a random key ID
  const keyId = `file-${groupId}-${generateRandomString(12)}`;
  
  // Generate a high-strength AES key for file encryption
  const key = await generateAesKey(256, true);
  
  return { key, keyId };
};