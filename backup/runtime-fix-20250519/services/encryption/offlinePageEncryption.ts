/**
 * Offline-capable Full Page Encryption Service
 * 
 * This service provides functionality for encrypting and decrypting entire pages
 * with support for offline mode and P2P_E2EE security level.
 * 
 * Updated to support domain-specific encryption for www.snakkaz.com
 */

import { encryptWholePage, decryptWholePage, generateGroupPageKey } from '../../utils/encryption/whole-page-encryption';
import { getLocalStorage, setLocalStorage } from '../../utils/storage';

// Key used for storing encryption keys in local storage
const OFFLINE_KEYS_STORAGE = 'snakkaz_offline_encryption_keys';

// Import environment for domain-specific configurations
let environment: { supabase?: { customDomain?: string }; app?: { baseUrl?: string } } = {};
try {
  // Dynamic import to avoid circular dependencies
  import('../../config/environment').then(module => {
    environment = module.environment;
  }).catch(() => {
    console.warn('Could not load environment config, using defaults');
    environment = { 
      supabase: { customDomain: 'www.snakkaz.com' },
      app: { baseUrl: 'https://www.snakkaz.com' }
    };
  });
} catch (error) {
  console.warn('Error importing environment config:', error);
}

// Storage keys that include domain information for better separation
const getDomainSpecificKey = (baseKey: string): string => {
  const domain = window.location.hostname || 'localhost';
  return `${baseKey}_${domain.replace(/\./g, '_')}`;
};

interface OfflineEncryptionKey {
  keyId: string;
  key: string;
  pageId: string;
  timestamp: number;
  securityLevel: string;
  domain?: string; // Added domain tracking
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
 * Interface for full page data including messages and settings
 */
interface WholePageData {
  content: string;
  metadata: Record<string, unknown>;
  messages: unknown[];
  settings: unknown;
}

/**
 * Interface for page data that can be encrypted
 */
interface PageDataToEncrypt {
  content: string;
  metadata?: Record<string, unknown>;
}

/**
 * Convert PageDataToEncrypt to WholePageData
 */
const convertToWholePageData = (data: PageDataToEncrypt): WholePageData => {
  // Try to parse content as JSON if possible
  let messages = [];
  let settings = {};
  
  try {
    const parsed = JSON.parse(data.content);
    if (parsed && typeof parsed === 'object') {
      messages = parsed.messages || [];
      settings = parsed.settings || {};
    }
  } catch (error) {
    console.debug('Could not parse page data as JSON, using defaults');
  }
  
  return {
    content: data.content,
    metadata: data.metadata,
    messages,
    settings
  };
};

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
    const existingKeys = await getLocalStorage(OFFLINE_KEYS_STORAGE) as OfflineEncryptionKey[] || [];
    
    // Add the new key
    const offlineKey: OfflineEncryptionKey = {
      keyId,
      key,
      pageId,
      timestamp: Date.now(),
      securityLevel,
      domain: window.location.hostname // Add domain tracking
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
    const keys = await getLocalStorage(OFFLINE_KEYS_STORAGE) as OfflineEncryptionKey[] || [];
    return keys.find(k => k.pageId === pageId) || null;
  } catch (error) {
    console.error('Failed to retrieve offline key:', error);
    return null;
  }
};

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
    const wholePageData = convertToWholePageData(pageData);
    const encryptedContent = await encryptWholePage(wholePageData, key);
    
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
): Promise<unknown> => {
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
    console.error('Failed to decrypt offline page:', error instanceof Error ? error.message : 'Unknown error');
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
    const existingKeys = await getLocalStorage(OFFLINE_KEYS_STORAGE) as OfflineEncryptionKey[] || [];
    const updatedKeys = existingKeys.filter(k => k.pageId !== pageId);
    await setLocalStorage(OFFLINE_KEYS_STORAGE, updatedKeys);
  } catch (error) {
    console.error('Failed to remove offline page data:', error);
    throw new Error('Could not remove offline encryption data');
  }
};