/**
 * Offline-capable Full Page Encryption Service
 * 
 * This service provides functionality for encrypting and decrypting entire pages
 * with support for offline mode and P2P_E2EE security level.
 */

import { encryptWholePage, decryptWholePage, generateGroupPageKey } from '../../utils/encryption/whole-page-encryption';
import { getLocalStorage, setLocalStorage } from '../../utils/storage';

// Key used for storing encryption keys in local storage
const OFFLINE_KEYS_STORAGE = 'snakkaz_offline_encryption_keys';

interface OfflineEncryptionKey {
  keyId: string;
  key: string;
  pageId: string;
  timestamp: number;
  securityLevel: string;
}

interface EncryptedPageData {
  encryptedContent: string;
  keyId: string;
  securityLevel: string;
  isOfflineReady: boolean;
  timestamp: number;
  version: string;
}

/**
 * Store an encryption key for offline use
 */
export const storeOfflineKey = async (
  keyId: string,
  key: string,
  pageId: string,
  securityLevel: string = 'P2P_E2EE'
): Promise<void> => {
  try {
    // Get existing keys
    const existingKeys = await getLocalStorage<OfflineEncryptionKey[]>(OFFLINE_KEYS_STORAGE) || [];
    
    // Add the new key
    const offlineKey: OfflineEncryptionKey = {
      keyId,
      key,
      pageId,
      timestamp: Date.now(),
      securityLevel
    };
    
    // Remove any existing key for the same page
    const updatedKeys = existingKeys.filter(k => k.pageId !== pageId);
    updatedKeys.push(offlineKey);
    
    // Store back to local storage
    await setLocalStorage(OFFLINE_KEYS_STORAGE, updatedKeys);
  } catch (error) {
    console.error('Failed to store offline key:', error);
    throw new Error('Could not store encryption key for offline use');
  }
};

/**
 * Get an encryption key for a page from offline storage
 */
export const getOfflineKey = async (pageId: string): Promise<OfflineEncryptionKey | null> => {
  try {
    const keys = await getLocalStorage<OfflineEncryptionKey[]>(OFFLINE_KEYS_STORAGE) || [];
    return keys.find(k => k.pageId === pageId) || null;
  } catch (error) {
    console.error('Failed to retrieve offline key:', error);
    return null;
  }
};

/**
 * Interface for page data that can be encrypted
 */
interface PageDataToEncrypt {
  content: string;
  metadata?: Record<string, unknown>;
}

/**
 * Encrypt page content with P2P_E2EE security level and prepare for offline use
 */
export const encryptPageForOffline = async (
  pageId: string,
  pageData: PageDataToEncrypt
): Promise<EncryptedPageData> => {
  try {
    // Generate a new encryption key
    const { key, keyId } = await generateGroupPageKey();
    
    // Encrypt the page content
    const encryptedContent = await encryptWholePage(pageData, key);
    
    // Store the key for offline use
    await storeOfflineKey(keyId, key, pageId);
    
    // Return the encrypted page data
    return {
      encryptedContent,
      keyId,
      securityLevel: 'P2P_E2EE',
      isOfflineReady: true,
      timestamp: Date.now(),
      version: '1.0'
    };
  } catch (error) {
    console.error('Failed to encrypt page for offline use:', error);
    throw new Error('Could not encrypt the page for offline use');
  }
};

/**
 * Decrypt page content for offline use
 */
export const decryptOfflinePage = async (
  pageId: string,
  encryptedData: EncryptedPageData
): Promise<any> => {
  try {
    // Get the key from offline storage
    const offlineKey = await getOfflineKey(pageId);
    
    if (!offlineKey) {
      throw new Error('Encryption key not found for this page');
    }
    
    // Verify the key matches
    if (offlineKey.keyId !== encryptedData.keyId) {
      throw new Error('Encryption key mismatch');
    }
    
    // Decrypt the content
    const decryptedData = await decryptWholePage(encryptedData.encryptedContent, offlineKey.key);
    return decryptedData;
  } catch (error) {
    console.error('Failed to decrypt offline page:', error);
    throw new Error('Could not decrypt the page');
  }
};

/**
 * Check if a page is available for offline use
 */
export const isPageAvailableOffline = async (pageId: string): Promise<boolean> => {
  const key = await getOfflineKey(pageId);
  return key !== null;
};

/**
 * Remove offline encryption data for a page
 */
export const removeOfflinePageData = async (pageId: string): Promise<void> => {
  try {
    const existingKeys = await getLocalStorage<OfflineEncryptionKey[]>(OFFLINE_KEYS_STORAGE) || [];
    const updatedKeys = existingKeys.filter(k => k.pageId !== pageId);
    await setLocalStorage(OFFLINE_KEYS_STORAGE, updatedKeys);
  } catch (error) {
    console.error('Failed to remove offline page data:', error);
    throw new Error('Could not remove offline encryption data');
  }
};