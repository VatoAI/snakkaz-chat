/**
 * Key Storage Service
 * 
 * Provides secure storage and retrieval of encryption keys
 */

import { 
  encryptAesGcm, 
  decryptAesGcm, 
  exportKeyToJwk, 
  importKeyFromJwk,
  KeyType,
  KeyUsage
} from '@/services/encryption/cryptoUtils';

// In-memory cache for keys
const keyCache = new Map<string, CryptoKey>();

/**
 * Store an encryption key securely
 * In a production app, this would use more secure storage mechanisms
 */
export async function storeKey(keyId: string, key: CryptoKey): Promise<void> {
  try {
    // Export key to JWK format
    const jwk = await exportKeyToJwk(key);
    const keyData = JSON.stringify(jwk);
    
    // Store in-memory
    keyCache.set(keyId, key);
    
    // In a real app, we might encrypt this key before storing in localStorage
    // This is a simplified version
    localStorage.setItem(`snakkaz_key_${keyId}`, keyData);
    
    console.log(`Key ${keyId} stored successfully`);
  } catch (error) {
    console.error(`Failed to store key ${keyId}:`, error);
    throw error;
  }
}

/**
 * Retrieve an encryption key
 */
export async function retrieveKey(keyId: string): Promise<CryptoKey | null> {
  try {
    // Check in-memory cache first
    if (keyCache.has(keyId)) {
      return keyCache.get(keyId) || null;
    }
    
    // Try to get from storage
    const keyData = localStorage.getItem(`snakkaz_key_${keyId}`);
    if (!keyData) {
      console.warn(`Key ${keyId} not found in storage`);
      return null;
    }
    
    // Parse JWK and import the key
    const jwk = JSON.parse(keyData);
    const key = await importKeyFromJwk(jwk, KeyType.AES_GCM, [KeyUsage.ENCRYPT, KeyUsage.DECRYPT]);
    
    // Update cache
    keyCache.set(keyId, key);
    
    return key;
  } catch (error) {
    console.error(`Failed to retrieve key ${keyId}:`, error);
    return null;
  }
}

/**
 * Delete a key from storage
 */
export function deleteKey(keyId: string): void {
  try {
    // Remove from cache
    keyCache.delete(keyId);
    
    // Remove from storage
    localStorage.removeItem(`snakkaz_key_${keyId}`);
    
    console.log(`Key ${keyId} deleted`);
  } catch (error) {
    console.error(`Failed to delete key ${keyId}:`, error);
  }
}

/**
 * Generate a device encryption key
 * This key can be used to encrypt other keys before storing them
 */
export async function getDeviceEncryptionKey(): Promise<CryptoKey> {
  const DEVICE_KEY_ID = 'snakkaz_device_key';
  
  try {
    // Try to get existing device key
    const existingKey = await retrieveKey(DEVICE_KEY_ID);
    if (existingKey) {
      return existingKey;
    }
    
    // Generate a new device key if none exists
    const keyAlgorithm = { name: 'AES-GCM', length: 256 };
    const key = await window.crypto.subtle.generateKey(
      keyAlgorithm,
      true,
      [KeyUsage.ENCRYPT, KeyUsage.DECRYPT]
    );
    
    // Store the device key
    await storeKey(DEVICE_KEY_ID, key);
    
    return key;
  } catch (error) {
    console.error('Failed to get device encryption key:', error);
    throw error;
  }
}
