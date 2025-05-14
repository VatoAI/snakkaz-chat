/**
 * Encryption Service
 * 
 * Main encryption service that provides encryption and decryption functionality
 * for the Snakkaz Chat application. Supports different security levels and encryption types.
 */

import { 
  generateAesKey,
  generateRsaKeyPair,
  generateEcdhKeyPair,
  encryptAesGcm,
  decryptAesGcm,
  encryptRsaOaep,
  decryptRsaOaep,
  exportKeyToJwk,
  importKeyFromJwk,
  deriveKeyFromPassword,
  generateRandomString,
  generateSalt,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  stringToArrayBuffer,
  arrayBufferToString,
  KeyType,
  KeyUsage
} from './cryptoUtils';

// In-memory key cache for the current session
const keyCache = new Map<string, CryptoKey>();

/**
 * Generate an encryption key with the specified strength
 */
const generateEncryptionKey = async (
  strength: 'standard' | 'high' | 'ultra', 
  type: string
): Promise<string> => {
  // Key length based on strength
  const keyLength = strength === 'standard' ? 128 : (strength === 'high' ? 256 : 256);
  
  // Generate a cryptographic key
  const key = await generateAesKey(keyLength as 128 | 256, true);
  
  // Export the key as JWK
  const jwk = await exportKeyToJwk(key);
  
  // Store in key cache with a unique ID
  const keyId = generateRandomString(16);
  keyCache.set(keyId, key);
  
  // Return serialized key information
  return JSON.stringify({
    id: keyId,
    jwk,
    algorithm: KeyType.AES_GCM,
    length: keyLength,
    timestamp: Date.now()
  });
};

/**
 * Encrypt data using the Web Crypto API
 */
const encryptData = async (
  data: string,
  keyData: string,
  type: string
): Promise<string> => {
  try {
    // Parse key data
    const keyInfo = JSON.parse(keyData);
    
    // Get or import the key
    let key: CryptoKey;
    if (keyCache.has(keyInfo.id)) {
      key = keyCache.get(keyInfo.id)!;
    } else {
      // Import the key from JWK
      key = await importKeyFromJwk(
        keyInfo.jwk,
        KeyType.AES_GCM,
        [KeyUsage.ENCRYPT, KeyUsage.DECRYPT],
        true
      );
      keyCache.set(keyInfo.id, key);
    }
    
    // Encrypt the data
    const { encryptedData, iv } = await encryptAesGcm(data, key);
    
    // Return serialized encrypted data with IV
    return JSON.stringify({
      ciphertext: arrayBufferToBase64(encryptedData),
      iv: arrayBufferToBase64(iv),
      keyId: keyInfo.id,
      algorithm: KeyType.AES_GCM,
      type
    });
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Decrypt data using the Web Crypto API
 */
const decryptData = async (
  encryptedData: string,
  keyData: string
): Promise<string> => {
  try {
    // Parse encrypted data
    const encryptedInfo = JSON.parse(encryptedData);
    const keyInfo = JSON.parse(keyData);
    
    // Get or import the key
    let key: CryptoKey;
    if (keyCache.has(keyInfo.id)) {
      key = keyCache.get(keyInfo.id)!;
    } else {
      // Import the key from JWK
      key = await importKeyFromJwk(
        keyInfo.jwk,
        KeyType.AES_GCM,
        [KeyUsage.ENCRYPT, KeyUsage.DECRYPT],
        true
      );
      keyCache.set(keyInfo.id, key);
    }
    
    // Check if key IDs match
    if (encryptedInfo.keyId && encryptedInfo.keyId !== keyInfo.id) {
      throw new Error('Key ID mismatch');
    }
    
    // Convert base64 to array buffers
    const ciphertext = base64ToArrayBuffer(encryptedInfo.ciphertext);
    const iv = base64ToArrayBuffer(encryptedInfo.iv);
    
    // Decrypt the data
    const decryptedData = await decryptAesGcm(ciphertext, key, iv);
    
    // Convert back to string
    return arrayBufferToString(decryptedData);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Security levels supported by the application
export enum SecurityLevel {
  STANDARD = 'STANDARD',        // Standard encryption
  E2EE = 'E2EE',                // End-to-end encryption
  P2P_E2EE = 'P2P_E2EE',        // Peer-to-peer end-to-end encryption
}

// Types of encryption available
export enum EncryptionType {
  MESSAGE = 'MESSAGE',          // For individual messages
  WHOLE_PAGE = 'WHOLE_PAGE',    // For entire pages
  FILE = 'FILE',                // For files and attachments
  USER_DATA = 'USER_DATA',      // For user profile data
}

// Import environment settings for domain-specific configurations
import { environment } from '../../config/environment';

interface EncryptionResult {
  encryptedData: string;
  keyId: string;
  securityLevel: SecurityLevel;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

interface DecryptionOptions {
  securityLevel?: SecurityLevel;
  keyId?: string;
  key?: string;
}

// Key rotation policy options
export interface KeyRotationPolicy {
  intervalDays: number;       // How often keys should be rotated
  autoRotate: boolean;        // Whether to automatically rotate keys
  retainPreviousKeys: number; // How many previous keys to retain
}

// Default key rotation policy
const DEFAULT_KEY_ROTATION_POLICY: KeyRotationPolicy = {
  intervalDays: 30,
  autoRotate: true,
  retainPreviousKeys: 3
};

export class EncryptionService {
  private keyRotationPolicy: KeyRotationPolicy;
  private keyHistory: Map<string, { key: string, createdAt: number }> = new Map();
  
  constructor(keyRotationPolicy: Partial<KeyRotationPolicy> = {}) {
    this.keyRotationPolicy = { ...DEFAULT_KEY_ROTATION_POLICY, ...keyRotationPolicy };
  }

  /**
   * Check if we're running on the custom domain and adjust security settings accordingly
   */
  public isOnCustomDomain(): boolean {
    const currentDomain = window.location.hostname;
    const customDomain = environment?.supabase?.customDomain || 'www.snakkaz.com';
    return currentDomain === customDomain || currentDomain === customDomain.replace('www.', '');
  }

  /**
   * Get recommended security level based on current domain and encryption type
   */
  public getRecommendedSecurityLevel(encryptionType: EncryptionType): SecurityLevel {
    // If on custom domain, automatically enhance security
    if (this.isOnCustomDomain()) {
      switch (encryptionType) {
        case EncryptionType.MESSAGE:
        case EncryptionType.USER_DATA:
          return SecurityLevel.E2EE;
        case EncryptionType.FILE:
        case EncryptionType.WHOLE_PAGE:
          return SecurityLevel.P2P_E2EE;
        default:
          return SecurityLevel.E2EE;
      }
    }
    
    // Default security levels for other domains
    switch (encryptionType) {
      case EncryptionType.MESSAGE:
        return SecurityLevel.E2EE;
      case EncryptionType.USER_DATA:
        return SecurityLevel.STANDARD;
      case EncryptionType.FILE:
      case EncryptionType.WHOLE_PAGE:
        return SecurityLevel.E2EE;
      default:
        return SecurityLevel.STANDARD;
    }
  }

  /**
   * Encrypt data with the specified security level and encryption type
   */
  public async encrypt(
    data: string | object,
    securityLevel: SecurityLevel = SecurityLevel.E2EE,
    encryptionType: EncryptionType = EncryptionType.MESSAGE,
    customKey?: string,
    additionalMetadata?: Record<string, unknown>
  ): Promise<EncryptionResult> {
    try {
      // Convert object to string if needed
      const dataString = typeof data === 'object' ? JSON.stringify(data) : data;
      
      // Generate or use provided encryption key
      const { key, keyId } = customKey 
        ? { key: customKey, keyId: this.generateKeyId() } 
        : await this.generateKey(securityLevel, encryptionType);
      
      // Store key in history if not a custom key
      if (!customKey) {
        this.keyHistory.set(keyId, { key, createdAt: Date.now() });
      }
      
      // Encrypt the data
      const encryptedData = await encryptData(dataString, key, encryptionType);
      
      return {
        encryptedData,
        keyId,
        securityLevel,
        timestamp: Date.now(),
        metadata: {
          encryptionType,
          version: '1.2',
          ...additionalMetadata
        }
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error(`Failed to encrypt data: ${(error as Error).message}`);
    }
  }

  /**
   * Decrypt previously encrypted data
   */
  public async decrypt<T = unknown>(
    encryptedData: string,
    key: string,
    options?: DecryptionOptions
  ): Promise<T> {
    try {
      const decryptedData = await decryptData(encryptedData, key);
      
      // Try to parse as JSON if possible
      try {
        return JSON.parse(decryptedData) as T;
      } catch (error) {
        // Log parsing error in debug mode
        console.debug('JSON parsing failed during decryption, returning raw data');
        // Return as is if not valid JSON
        return decryptedData as unknown as T;
      }
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error(`Failed to decrypt data: ${(error as Error).message}`);
    }
  }

  /**
   * Encrypt text with a password
   * @param text Text to encrypt
   * @param password Password to use for encryption
   * @returns Encrypted data object
   */
  public async encryptWithPassword(text: string, password: string): Promise<{ encryptedData: string }> {
    try {
      // Generate a random salt
      const salt = generateSalt();
      
      // Derive a key from the password
      const key = await deriveKeyFromPassword(password, salt);
      
      // Convert text to ArrayBuffer
      const data = stringToArrayBuffer(text);
      
      // Generate a random IV
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt the data
      const { encryptedData } = await encryptAesGcm(data, key, iv.buffer);
      
      // Combine salt + iv + encrypted data and encode as base64
      const resultBuffer = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
      resultBuffer.set(salt, 0);
      resultBuffer.set(iv, salt.length);
      resultBuffer.set(new Uint8Array(encryptedData), salt.length + iv.length);
      
      return {
        encryptedData: arrayBufferToBase64(resultBuffer)
      };
    } catch (error) {
      console.error('Password encryption failed:', error);
      throw new Error('Failed to encrypt with password');
    }
  }

  /**
   * Decrypt text with a password
   * @param encryptedData Encrypted data string (base64)
   * @param password Password to use for decryption
   * @returns Decrypted text
   */
  public async decryptWithPassword(encryptedData: string, password: string): Promise<string> {
    try {
      // Decode the base64 encrypted data
      const encryptedBuffer = base64ToArrayBuffer(encryptedData);
      const encryptedArray = new Uint8Array(encryptedBuffer);
      
      // Extract salt, iv, and encrypted data
      const salt = encryptedArray.slice(0, 16);
      const iv = encryptedArray.slice(16, 28);
      const data = encryptedArray.slice(28);
      
      // Derive the key from the password
      const key = await deriveKeyFromPassword(password, salt);
      
      // Decrypt the data
      const decryptedBuffer = await decryptAesGcm(data.buffer, key, iv.buffer);
      
      // Convert the decrypted data back to string
      return arrayBufferToString(decryptedBuffer);
    } catch (error) {
      console.error('Password decryption failed:', error);
      throw new Error('Failed to decrypt with password');
    }
  }

  /**
   * Generate a new encryption key based on security level and type
   */
  private async generateKey(
    securityLevel: SecurityLevel,
    encryptionType: EncryptionType,
    keyLength?: number
  ): Promise<{ key: string, keyId: string }> {
    // Determine key strength based on security level
    const keyStrength = securityLevel === SecurityLevel.STANDARD ? 'standard' :
                       securityLevel === SecurityLevel.E2EE ? 'high' : 'ultra';
                       
    // Generate the encryption key
    const key = await generateEncryptionKey(keyStrength, encryptionType);
    
    // Update JSON with encryption type
    try {
      const keyObj = JSON.parse(key);
      keyObj.encryptionType = encryptionType;
      
      // If key length is specified, update it
      if (keyLength) {
        keyObj.length = keyLength;
      }
      
      const updatedKey = JSON.stringify(keyObj);
      
      // Generate a unique identifier for this key
      const keyId = this.generateKeyId();
      
      return { key: updatedKey, keyId };
    } catch (error) {
      // If parsing fails, use the original key
      const keyId = this.generateKeyId();
      return { key, keyId };
    }
  }
  
  /**
   * Generate a unique key identifier
   */
  private generateKeyId(): string {
    // Create a timestamp-based ID with a random component
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 10);
    return `key_${timestamp}_${randomPart}`;
  }
  
  /**
   * Verify if the key can decrypt the data
   */
  public async verifyKey(encryptedData: string, key: string): Promise<boolean> {
    try {
      await this.decrypt(encryptedData, key);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Generate a random password-safe string with specified length
   */
  public generateRandomString(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_!@#$%^&*()';
    let result = '';
    const randomValues = new Uint8Array(length);
    window.crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(randomValues[i] % chars.length);
    }
    
    return result;
  }
  
  /**
   * Re-encrypt data with a new key
   * Useful for key rotation or changing security levels
   */
  public async reEncrypt(
    encryptedData: string,
    currentKey: string,
    newSecurityLevel?: SecurityLevel,
    newEncryptionType?: EncryptionType,
    customNewKey?: string
  ): Promise<EncryptionResult> {
    try {
      // First decrypt with current key
      const decryptedData = await this.decrypt<string>(encryptedData, currentKey);
      
      // Get metadata from original encryption if available
      let metadata: Record<string, unknown> = {};
      try {
        const originalData = JSON.parse(decryptedData);
        if (originalData && typeof originalData === 'object' && originalData.metadata) {
          metadata = originalData.metadata as Record<string, unknown>;
        }
      } catch (error) {
        console.debug('Could not extract metadata from decrypted data');
      }
      
      // Add audit trail to metadata
      const rotationMetadata = {
        ...metadata,
        keyRotation: {
          timestamp: Date.now(),
          fromSecurityLevel: this.getSecurityLevelFromKey(currentKey),
          toSecurityLevel: newSecurityLevel || SecurityLevel.E2EE
        }
      };
      
      // Now re-encrypt with new parameters
      return this.encrypt(
        decryptedData,
        newSecurityLevel || SecurityLevel.E2EE,
        newEncryptionType || EncryptionType.MESSAGE,
        customNewKey,
        rotationMetadata
      );
    } catch (error) {
      console.error('Re-encryption failed:', error);
      throw new Error(`Failed to re-encrypt data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Get the security level from a key
   */
  private getSecurityLevelFromKey(key: string): SecurityLevel {
    try {
      // Parse key data
      const keyInfo = JSON.parse(key);
      
      // Determine security level based on key properties
      if (keyInfo.length >= 256) {
        return SecurityLevel.P2P_E2EE;
      } else if (keyInfo.length >= 192) {
        return SecurityLevel.E2EE;
      } else {
        return SecurityLevel.STANDARD;
      }
    } catch (error) {
      // Default to standard if can't determine
      return SecurityLevel.STANDARD;
    }
  }
  
  /**
   * Derive an encryption key from a user passphrase
   * Useful for user-provided passwords
   */
  public async deriveKeyFromPassphrase(
    passphrase: string, 
    salt?: string
  ): Promise<{ key: string; salt: string; keyObject?: CryptoKey }> {
    try {
      // Generate salt if not provided
      const saltValue = salt || generateRandomString(16);
      const saltBuffer = stringToArrayBuffer(saltValue);
      
      // Derive a key using PBKDF2
      const key = await deriveKeyFromPassword(
        passphrase,
        saltBuffer,
        100000,
        [KeyUsage.ENCRYPT, KeyUsage.DECRYPT],
        true
      );
      
      // Export key to JWK
      const jwk = await exportKeyToJwk(key);
      
      // Store in cache
      const keyId = this.generateKeyId();
      keyCache.set(keyId, key);
      
      // Create serialized key data
      const keyData = JSON.stringify({
        id: keyId,
        jwk,
        algorithm: KeyType.AES_GCM,
        length: 256,
        derivedFromPassphrase: true,
        salt: saltValue,
        timestamp: Date.now()
      });
      
      return { 
        key: keyData, 
        salt: saltValue,
        keyObject: key 
      };
    } catch (error) {
      console.error('Key derivation failed:', error);
      throw new Error(`Failed to derive key from passphrase: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Manage key rotation based on policy
   */
  public async rotateKeys(): Promise<Map<string, { key: string; keyId: string }>> {
    const rotatedKeys = new Map<string, { key: string; keyId: string }>();
    
    // Check which keys need rotation based on policy
    const cutoffTime = Date.now() - this.keyRotationPolicy.intervalDays * 24 * 60 * 60 * 1000;
    let keysRotated = 0;
    
    // Get keys that need rotation
    const keysToRotate = new Map<string, { key: string; createdAt: number }>();
    for (const [keyId, keyData] of this.keyHistory.entries()) {
      if (keyData.createdAt < cutoffTime) {
        keysToRotate.set(keyId, keyData);
      }
    }
    
    // Rotate keys
    for (const [oldKeyId, { key: oldKey }] of keysToRotate.entries()) {
      try {
        // Parse key data to determine its properties
        const keyInfo = JSON.parse(oldKey);
        const securityLevel = this.getSecurityLevelFromKey(oldKey);
        let encryptionType: EncryptionType;
        
        // Determine encryption type from key metadata or default to MESSAGE
        if (keyInfo.encryptionType) {
          encryptionType = keyInfo.encryptionType as EncryptionType;
        } else {
          // Guess based on key length and algorithm
          if (keyInfo.algorithm === KeyType.AES_GCM) {
            if (keyInfo.derivedFromPassphrase) {
              encryptionType = EncryptionType.USER_DATA;
            } else if (keyInfo.length >= 256) {
              encryptionType = EncryptionType.FILE;
            } else {
              encryptionType = EncryptionType.MESSAGE;
            }
          } else {
            encryptionType = EncryptionType.MESSAGE;
          }
        }
        
        // Generate new key with same properties but enhanced security if needed
        const { key: newKey, keyId: newKeyId } = await this.generateKey(
          securityLevel,
          encryptionType,
          keyInfo.length || undefined
        );
        
        // Add to rotated keys map
        rotatedKeys.set(`${securityLevel}_${encryptionType}_${oldKeyId}`, { 
          key: newKey, 
          keyId: newKeyId 
        });
        
        // Store in key history
        this.keyHistory.set(newKeyId, { key: newKey, createdAt: Date.now() });
        
        // Add rotation metadata to the key
        const metadataKey = `${newKeyId}_rotation_info`;
        this.keyHistory.set(metadataKey, {
          key: JSON.stringify({
            rotatedFrom: oldKeyId,
            rotatedAt: Date.now(),
            previousKeyCreatedAt: keyInfo.timestamp || 0,
            securityLevel,
            encryptionType
          }),
          createdAt: Date.now()
        });
        
        keysRotated++;
        
        // Log the rotation for audit purposes
        console.info(`Key rotated: ${oldKeyId} → ${newKeyId} (${encryptionType}, ${securityLevel})`);
      } catch (error) {
        console.error(`Failed to rotate key ${oldKeyId}:`, error);
      }
    }
    
    // Prune excess keys if retention policy exceeded
    if (this.keyHistory.size > this.keyRotationPolicy.retainPreviousKeys * 2) {
      this.pruneOldKeys();
    }
    
    console.info(`Key rotation completed. ${keysRotated} keys rotated.`);
    return rotatedKeys;
  }
  
  /**
   * Prune old keys that exceed retention policy
   */
  private pruneOldKeys(): void {
    // Find oldest keys
    const keyEntries = Array.from(this.keyHistory.entries())
      .filter(([keyId]) => !keyId.includes('_rotation_info')) // Skip metadata
      .sort(([, a], [, b]) => a.createdAt - b.createdAt);
    
    // Calculate how many keys to remove
    const excessKeys = Math.max(0, keyEntries.length - this.keyRotationPolicy.retainPreviousKeys);
    
    if (excessKeys > 0) {
      // Remove oldest keys
      for (let i = 0; i < excessKeys; i++) {
        const [keyId] = keyEntries[i];
        this.keyHistory.delete(keyId);
        
        // Also remove any associated metadata
        this.keyHistory.delete(`${keyId}_rotation_info`);
      }
      
      console.info(`Pruned ${excessKeys} old keys from history.`);
    }
  }
  
  /**
   * Set or update the key rotation policy
   */
  public setKeyRotationPolicy(policy: Partial<KeyRotationPolicy>): void {
    this.keyRotationPolicy = { ...this.keyRotationPolicy, ...policy };
  }
  
  /**
   * Get the current key rotation policy
   */
  public getKeyRotationPolicy(): KeyRotationPolicy {
    return { ...this.keyRotationPolicy };
  }
  
  /**
   * Retrieve a specific key by ID if available in history
   */
  public getKeyById(keyId: string): string | undefined {
    const keyEntry = this.keyHistory.get(keyId);
    return keyEntry?.key;
  }

  /**
   * Integrate with offline page encryption functionality
   * This helps ensure a seamless experience when using the custom domain
   */
  public async integrateWithOfflineEncryption(pageId: string, pageData: object): Promise<void> {
    try {
      // Import the offlinePageEncryption module dynamically to avoid circular dependencies
      const { encryptPageForOffline } = await import('./offlinePageEncryption');
      
      // Only encrypt for offline use if on the custom domain
      if (this.isOnCustomDomain()) {
        await encryptPageForOffline(pageId, { 
          content: JSON.stringify(pageData),
          metadata: {
            timestamp: Date.now(),
            domain: window.location.hostname,
            version: '2.0'
          }
        });
        
        console.debug(`Page ${pageId} encrypted for offline use on custom domain`);
      }
    } catch (error) {
      console.error('Failed to integrate with offline encryption:', error);
      // Non-critical failure, so we don't throw
    }
  }
  
  /**
   * Decrypt an offline page, useful when transitioning between domains
   */
  public async decryptOfflinePage(
    pageId: string, 
    encryptedData: { 
      encryptedContent: string; 
      keyId: string; 
      securityLevel: string;
      isOfflineReady: boolean;
      timestamp: number;
      version: string;
    }
  ): Promise<unknown> {
    try {
      // Import the offlinePageEncryption module dynamically
      const { decryptOfflinePage } = await import('./offlinePageEncryption');
      return await decryptOfflinePage(pageId, encryptedData);
    } catch (error) {
      console.error('Failed to decrypt offline page:', error);
      throw new Error(`Offline page decryption failed: ${(error as Error).message}`);
    }
  }
  
  /**
   * Check domain-specific security status
   * Returns information about current domain and security configuration
   */
  public getDomainSecurityInfo(): { 
    isCustomDomain: boolean; 
    domain: string;
    recommendedSecurityLevel: SecurityLevel;
    isOfflineCapable: boolean;
  } {
    const isCustomDomain = this.isOnCustomDomain();
    const domain = window.location.hostname;
    
    return {
      isCustomDomain,
      domain,
      recommendedSecurityLevel: isCustomDomain ? SecurityLevel.P2P_E2EE : SecurityLevel.E2EE,
      isOfflineCapable: isCustomDomain // Only custom domain supports offline capability
    };
  }
}

// Export singleton instance
export const encryptionService = new EncryptionService();