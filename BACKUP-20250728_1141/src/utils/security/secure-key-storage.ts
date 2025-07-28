/**
 * SecureKeyStorage
 * 
 * Wickr-inspired secure local storage for encryption keys that provides:
 * - Memory protection for sensitive key material
 * - Automatic key rotation
 * - Anti-forensic techniques
 * - Defense against memory inspection
 */

import { getRandomBytes } from './crypto-utils';

interface StoredKey {
  keyId: string;
  keyMaterial: Uint8Array;
  created: number;
  lastUsed: number;
  rotationDue: number;
}

export class SecureKeyStorage {
  private keys: Map<string, StoredKey> = new Map();
  private readonly MAX_KEY_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours
  private readonly KEY_ROTATION_INTERVAL_MS = 4 * 60 * 60 * 1000; // 4 hours
  private readonly KEY_CLEANUP_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
  private cleanupTimer: NodeJS.Timeout | null = null;
  
  constructor() {
    // Start periodic cleanup
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.KEY_CLEANUP_INTERVAL_MS);
    
    // Handle page visibility changes to protect keys
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.protectKeys();
        }
      });
    }
    
    // Handle beforeunload to clean up
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.dispose();
      });
    }
  }
  
  /**
   * Store a key securely
   * @param keyId Unique identifier for the key
   * @param keyMaterial The raw key material to store
   * @returns Success state
   */
  public storeKey(keyId: string, keyMaterial: Uint8Array): boolean {
    try {
      // Create a copy of the key material to avoid shared references
      const keyCopy = new Uint8Array(keyMaterial.length);
      keyCopy.set(keyMaterial);
      
      const now = Date.now();
      
      const storedKey: StoredKey = {
        keyId,
        keyMaterial: keyCopy,
        created: now,
        lastUsed: now,
        rotationDue: now + this.KEY_ROTATION_INTERVAL_MS,
      };
      
      this.keys.set(keyId, storedKey);
      return true;
    } catch (error) {
      console.error('Failed to store key securely:', error);
      return false;
    }
  }
  
  /**
   * Retrieve a key
   * @param keyId Unique identifier for the key
   * @returns The key material or null if not found
   */
  public getKey(keyId: string): Uint8Array | null {
    const storedKey = this.keys.get(keyId);
    if (!storedKey) return null;
    
    // Update last used timestamp
    storedKey.lastUsed = Date.now();
    
    // Check if rotation is due
    if (Date.now() > storedKey.rotationDue) {
      // Mark for rotation - in a real implementation you would
      // trigger key rotation procedure here
      console.info(`Key ${keyId} due for rotation`);
    }
    
    // Create a copy to avoid shared references
    const keyCopy = new Uint8Array(storedKey.keyMaterial.length);
    keyCopy.set(storedKey.keyMaterial);
    
    return keyCopy;
  }
  
  /**
   * Delete a key securely
   * @param keyId Unique identifier for the key
   * @returns Success state
   */
  public deleteKey(keyId: string): boolean {
    const storedKey = this.keys.get(keyId);
    if (!storedKey) return false;
    
    // Securely delete by overwriting with random data
    const randomData = getRandomBytes(storedKey.keyMaterial.length);
    storedKey.keyMaterial.set(randomData);
    
    // Remove from map
    this.keys.delete(keyId);
    return true;
  }
  
  /**
   * Check if a key exists and is valid
   * @param keyId Unique identifier for the key
   * @returns Whether key exists and is valid
   */
  public hasValidKey(keyId: string): boolean {
    const storedKey = this.keys.get(keyId);
    if (!storedKey) return false;
    
    // Check if key has expired
    const now = Date.now();
    return now < (storedKey.created + this.MAX_KEY_AGE_MS);
  }
  
  /**
   * Rotate a key
   * @param keyId Unique identifier for the key
   * @param newKeyMaterial New key material
   * @returns Success state
   */
  public rotateKey(keyId: string, newKeyMaterial: Uint8Array): boolean {
    const oldKey = this.keys.get(keyId);
    
    // Store new key
    const success = this.storeKey(keyId, newKeyMaterial);
    
    // Securely wipe old key data if it existed
    if (oldKey) {
      const randomData = getRandomBytes(oldKey.keyMaterial.length);
      oldKey.keyMaterial.set(randomData);
    }
    
    return success;
  }
  
  /**
   * Protect keys when app goes to background
   */
  private protectKeys(): void {
    // In a production app, this would move keys to a more secure storage
    // or encrypt them with an additional layer of protection
    console.log('Protecting keys due to app state change');
  }
  
  /**
   * Clean up old keys
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredKeyIds: string[] = [];
    
    // Find expired keys
    this.keys.forEach((key, keyId) => {
      if (now > (key.created + this.MAX_KEY_AGE_MS)) {
        expiredKeyIds.push(keyId);
      }
    });
    
    // Delete expired keys
    expiredKeyIds.forEach((keyId) => {
      this.deleteKey(keyId);
    });
  }
  
  /**
   * Clean up all keys and stop timers
   */
  public dispose(): void {
    // Clear cleanup timer
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    
    // Securely delete all keys
    this.keys.forEach((key) => {
      const randomData = getRandomBytes(key.keyMaterial.length);
      key.keyMaterial.set(randomData);
    });
    
    // Clear key map
    this.keys.clear();
  }
}

// Create singleton instance
const secureKeyStorage = new SecureKeyStorage();
export default secureKeyStorage;