/**
 * Battery-Efficient Crypto Operations for Mobile
 * 
 * This utility provides optimized cryptographic operations for mobile devices,
 * reducing battery consumption and improving performance on resource-constrained devices.
 * 
 * Inspired by Wickr's mobile-optimized crypto implementations.
 */

import { getRandomBytes } from '../../security/crypto-utils';

// Constants
const CHUNK_SIZE = 512 * 1024; // 512KB chunks for better memory management
const KEY_CACHE_TTL = 5 * 60 * 1000; // 5 minute TTL for cached keys
const DEFAULT_ENCRYPTION_ALGORITHM = 'AES-GCM';

// Cache for encryption keys to prevent excessive derivation operations
interface KeyCacheEntry {
  key: CryptoKey;
  timestamp: number;
  context: string;
  uses: number;
}

// Task scheduling state
interface TaskScheduleState {
  isLowPowerMode: boolean;
  isCharging: boolean;
  isOnline: boolean;
  batteryLevel: number | null;
  lastUpdate: number;
}

// Configuration for battery efficiency
export interface BatteryEfficientConfig {
  enableLowPowerMode: boolean;
  deferNonEssentialOperations: boolean;
  chunkLargeOperations: boolean;
  cacheKeys: boolean;
  cacheTTL: number; // milliseconds
  maxKeysInCache: number;
}

/**
 * Battery-efficient cryptographic operations manager
 * Optimizes encryption/decryption for mobile devices
 */
export class BatteryEfficientCrypto {
  private static instance: BatteryEfficientCrypto;
  private keyCache: Map<string, KeyCacheEntry> = new Map();
  private taskState: TaskScheduleState = {
    isLowPowerMode: false,
    isCharging: true,
    isOnline: true,
    batteryLevel: null,
    lastUpdate: Date.now()
  };
  private config: BatteryEfficientConfig = {
    enableLowPowerMode: true,
    deferNonEssentialOperations: true,
    chunkLargeOperations: true,
    cacheKeys: true,
    cacheTTL: KEY_CACHE_TTL,
    maxKeysInCache: 10
  };

  // Singleton pattern
  private constructor() {
    this.initBatteryMonitoring();
    this.startPeriodicCleanup();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): BatteryEfficientCrypto {
    if (!BatteryEfficientCrypto.instance) {
      BatteryEfficientCrypto.instance = new BatteryEfficientCrypto();
    }
    return BatteryEfficientCrypto.instance;
  }

  /**
   * Initialize battery monitoring for adaptive optimization
   */
  private initBatteryMonitoring(): void {
    // Use Battery API if available
    if (typeof navigator !== 'undefined' && navigator.getBattery) {
      navigator.getBattery().then((battery) => {
        // Initial state
        this.taskState.isCharging = battery.charging;
        this.taskState.batteryLevel = battery.level;
        
        // Update state on changes
        battery.addEventListener('chargingchange', () => {
          this.taskState.isCharging = battery.charging;
          this.updatePowerMode();
        });
        
        battery.addEventListener('levelchange', () => {
          this.taskState.batteryLevel = battery.level;
          this.updatePowerMode();
        });
      }).catch(err => {
        console.warn('Battery status monitoring not available:', err);
      });
    }
    
    // Monitor online status
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.taskState.isOnline = true;
      });
      
      window.addEventListener('offline', () => {
        this.taskState.isOnline = false;
      });
      
      // Monitor visibility to pause non-essential tasks when app is in background
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.protectKeys();
        }
      });
    }
  }

  /**
   * Update power mode based on battery status
   */
  private updatePowerMode(): void {
    // Enable low power mode if battery level is below 20% and not charging
    if (this.taskState.batteryLevel !== null &&
        this.taskState.batteryLevel < 0.2 &&
        !this.taskState.isCharging) {
      this.taskState.isLowPowerMode = true;
    } else {
      this.taskState.isLowPowerMode = false;
    }
  }

  /**
   * Start periodic cleanup of cached keys
   */
  private startPeriodicCleanup(): void {
    setInterval(() => {
      this.cleanupKeyCache();
    }, 60000); // Check every minute
  }

  /**
   * Remove expired keys from cache
   */
  private cleanupKeyCache(): void {
    if (!this.config.cacheKeys) return;
    
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    // Find expired keys
    this.keyCache.forEach((entry, cacheKey) => {
      if (now - entry.timestamp > this.config.cacheTTL) {
        expiredKeys.push(cacheKey);
      }
    });
    
    // Remove expired keys
    expiredKeys.forEach(key => {
      this.keyCache.delete(key);
    });
    
    // If still too many keys, remove least used keys
    if (this.keyCache.size > this.config.maxKeysInCache) {
      const keyEntries = Array.from(this.keyCache.entries())
        .sort((a, b) => a[1].uses - b[1].uses);
      
      // Remove least used keys
      while (keyEntries.length > this.config.maxKeysInCache) {
        const [keyToRemove] = keyEntries.shift()!;
        this.keyCache.delete(keyToRemove);
      }
    }
  }

  /**
   * Protect keys when app goes to background
   */
  private protectKeys(): void {
    // In a real implementation, this would apply additional protections
    // For now, we just mark keys as unused to expedite their removal
    this.keyCache.forEach(entry => {
      entry.uses = 0;
    });
  }

  /**
   * Encrypt data in a battery-efficient way
   * @param data Data to encrypt
   * @param key Encryption key
   * @param context Encryption context for cache management
   * @returns Encrypted data with IV
   */
  public async encrypt(
    data: ArrayBuffer | string, 
    key: CryptoKey,
    context: string = 'default'
  ): Promise<{ ciphertext: ArrayBuffer; iv: Uint8Array }> {
    // Convert string data to ArrayBuffer if needed
    let dataBuffer: ArrayBuffer;
    if (typeof data === 'string') {
      dataBuffer = new TextEncoder().encode(data);
    } else {
      dataBuffer = data;
    }
    
    // Cache key with context if enabled
    if (this.config.cacheKeys) {
      const cacheKey = await this.getCacheKeyIdentifier(key, context);
      const cachedEntry = this.keyCache.get(cacheKey);
      
      if (cachedEntry) {
        cachedEntry.timestamp = Date.now();
        cachedEntry.uses++;
        key = cachedEntry.key;
      } else if (this.keyCache.size < this.config.maxKeysInCache) {
        this.keyCache.set(cacheKey, {
          key,
          timestamp: Date.now(),
          context,
          uses: 1
        });
      }
    }
    
    // Generate a random initialization vector
    const iv = getRandomBytes(12); // 12 bytes is standard for GCM
    
    // Check if we need to process in chunks
    if (this.config.chunkLargeOperations && dataBuffer.byteLength > CHUNK_SIZE) {
      return await this.encryptLargeData(dataBuffer, key, iv);
    } else {
      // Encrypt directly for small data
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: DEFAULT_ENCRYPTION_ALGORITHM,
          iv
        },
        key,
        dataBuffer
      );
      
      return {
        ciphertext: encryptedBuffer,
        iv
      };
    }
  }

  /**
   * Decrypt data in a battery-efficient way
   * @param ciphertext Encrypted data
   * @param iv Initialization vector
   * @param key Decryption key
   * @param context Decryption context for cache management
   * @returns Decrypted data
   */
  public async decrypt(
    ciphertext: ArrayBuffer,
    iv: Uint8Array,
    key: CryptoKey,
    context: string = 'default'
  ): Promise<ArrayBuffer> {
    // Cache key with context if enabled
    if (this.config.cacheKeys) {
      const cacheKey = await this.getCacheKeyIdentifier(key, context);
      const cachedEntry = this.keyCache.get(cacheKey);
      
      if (cachedEntry) {
        cachedEntry.timestamp = Date.now();
        cachedEntry.uses++;
        key = cachedEntry.key;
      } else if (this.keyCache.size < this.config.maxKeysInCache) {
        this.keyCache.set(cacheKey, {
          key,
          timestamp: Date.now(),
          context,
          uses: 1
        });
      }
    }
    
    // Check if we need to process in chunks
    if (this.config.chunkLargeOperations && ciphertext.byteLength > CHUNK_SIZE) {
      return await this.decryptLargeData(ciphertext, key, iv);
    } else {
      // Decrypt directly for small data
      return await window.crypto.subtle.decrypt(
        {
          name: DEFAULT_ENCRYPTION_ALGORITHM,
          iv
        },
        key,
        ciphertext
      );
    }
  }

  /**
   * Encrypt large data in chunks to avoid memory pressure
   */
  private async encryptLargeData(
    data: ArrayBuffer, 
    key: CryptoKey, 
    iv: Uint8Array
  ): Promise<{ ciphertext: ArrayBuffer; iv: Uint8Array }> {
    // For demo purposes, we'll still use the WebCrypto API directly
    // In a real implementation, this would chunk the data and process incrementally
    // with requestIdleCallback or scheduling around battery/CPU conditions
    
    // For now we'll just use the standard encrypt method but with lower priority
    return {
      ciphertext: await this.scheduleLowPriorityTask(() => 
        window.crypto.subtle.encrypt(
          {
            name: DEFAULT_ENCRYPTION_ALGORITHM,
            iv
          },
          key,
          data
        )
      ),
      iv
    };
  }

  /**
   * Decrypt large data in chunks to avoid memory pressure
   */
  private async decryptLargeData(
    ciphertext: ArrayBuffer, 
    key: CryptoKey, 
    iv: Uint8Array
  ): Promise<ArrayBuffer> {
    // For demo purposes, we'll still use the WebCrypto API directly
    // In a real implementation, this would chunk the data and process incrementally
    
    return await this.scheduleLowPriorityTask(() => 
      window.crypto.subtle.decrypt(
        {
          name: DEFAULT_ENCRYPTION_ALGORITHM,
          iv
        },
        key,
        ciphertext
      )
    );
  }

  /**
   * Schedule a task with low priority based on battery state
   */
  private async scheduleLowPriorityTask<T>(task: () => Promise<T>): Promise<T> {
    if (this.taskState.isLowPowerMode && this.config.deferNonEssentialOperations) {
      // If in low power mode, wait until the device is charging or has sufficient power
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        return new Promise((resolve, reject) => {
          (window as any).requestIdleCallback(async () => {
            try {
              resolve(await task());
            } catch (err) {
              reject(err);
            }
          });
        });
      }
    }
    
    // Fall back to immediate execution if no scheduling is possible
    return task();
  }

  /**
   * Generate a cache key identifier for a cryptographic key and context
   */
  private async getCacheKeyIdentifier(key: CryptoKey, context: string): Promise<string> {
    // In a real implementation, we would use a more sophisticated approach
    // For now, we'll just use the context string and a counter
    return `${context}-${Date.now()}`;
  }

  /**
   * Configure battery efficiency settings
   */
  public configure(config: Partial<BatteryEfficientConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };
  }

  /**
   * Clear all cached keys and reset state
   */
  public clearCache(): void {
    this.keyCache.clear();
  }
}

// Export singleton instance
export const batteryEfficientCrypto = BatteryEfficientCrypto.getInstance();

// Helper functions
export const encryptWithBatteryEfficiency = async (
  data: ArrayBuffer | string,
  key: CryptoKey,
  context?: string
): Promise<{ ciphertext: ArrayBuffer; iv: Uint8Array }> => {
  return batteryEfficientCrypto.encrypt(data, key, context);
};

export const decryptWithBatteryEfficiency = async (
  ciphertext: ArrayBuffer,
  iv: Uint8Array,
  key: CryptoKey,
  context?: string
): Promise<ArrayBuffer> => {
  return batteryEfficientCrypto.decrypt(ciphertext, iv, key, context);
};