/**
 * Encryption Service
 * 
 * Main encryption service that provides encryption and decryption functionality
 * for the Snakkaz Chat application. Supports different security levels and encryption types.
 */

import { generateEncryptionKey, encryptData, decryptData } from '../../utils/encryption/encryption-utils';

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
   * Encrypt data with the specified security level and encryption type
   */
  public async encrypt(
    data: string | object,
    securityLevel: SecurityLevel = SecurityLevel.E2EE,
    encryptionType: EncryptionType = EncryptionType.MESSAGE,
    customKey?: string
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
          version: '1.1'
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
  public async decrypt<T = any>(
    encryptedData: string,
    key: string,
    options?: DecryptionOptions
  ): Promise<T> {
    try {
      const decryptedData = await decryptData(encryptedData, key);
      
      // Try to parse as JSON if possible
      try {
        return JSON.parse(decryptedData) as T;
      } catch {
        // Return as is if not valid JSON
        return decryptedData as unknown as T;
      }
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error(`Failed to decrypt data: ${(error as Error).message}`);
    }
  }

  /**
   * Generate a new encryption key based on security level and type
   */
  private async generateKey(
    securityLevel: SecurityLevel,
    encryptionType: EncryptionType
  ): Promise<{ key: string, keyId: string }> {
    // Determine key strength based on security level
    const keyStrength = securityLevel === SecurityLevel.STANDARD ? 'standard' :
                       securityLevel === SecurityLevel.E2EE ? 'high' : 'ultra';
                       
    // Generate the encryption key
    const key = await generateEncryptionKey(keyStrength, encryptionType);
    
    // Generate a unique identifier for this key
    const keyId = this.generateKeyId();
    
    return { key, keyId };
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
    // First decrypt with current key
    const decryptedData = await this.decrypt(encryptedData, currentKey);
    
    // Get metadata from original encryption if available
    let metadata: any = {};
    try {
      const originalData = JSON.parse(decryptedData as string);
      if (originalData.metadata) {
        metadata = originalData.metadata;
      }
    } catch {}
    
    // Now re-encrypt with new parameters
    return this.encrypt(
      decryptedData,
      newSecurityLevel || SecurityLevel.E2EE,
      newEncryptionType || EncryptionType.MESSAGE,
      customNewKey
    );
  }
  
  /**
   * Derive an encryption key from a user passphrase
   * Useful for user-provided passwords
   */
  public async deriveKeyFromPassphrase(
    passphrase: string, 
    salt?: string
  ): Promise<{ key: string; salt: string }> {
    // Generate salt if not provided
    const useSalt = salt || this.generateRandomString(16);
    
    // Use Web Crypto API for key derivation
    const encoder = new TextEncoder();
    const passphraseData = encoder.encode(passphrase);
    const saltData = encoder.encode(useSalt);
    
    // Import the passphrase as a key
    const importedKey = await window.crypto.subtle.importKey(
      'raw',
      passphraseData,
      { name: 'PBKDF2' },
      false,
      ['deriveKey', 'deriveBits']
    );
    
    // Derive bits using PBKDF2
    const derivedBits = await window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltData,
        iterations: 100000,
        hash: 'SHA-256',
      },
      importedKey,
      256
    );
    
    // Convert to Base64 string for use with our encryption functions
    const derivedKey = btoa(String.fromCharCode(...new Uint8Array(derivedBits)));
    
    return { key: derivedKey, salt: useSalt };
  }
  
  /**
   * Manage key rotation based on policy
   */
  public async rotateKeys(): Promise<Map<string, { key: string; keyId: string }>> {
    const rotatedKeys = new Map<string, { key: string; keyId: string }>();
    
    // Check which keys need rotation based on policy
    const cutoffTime = Date.now() - this.keyRotationPolicy.intervalDays * 24 * 60 * 60 * 1000;
    
    for (const [keyId, { key, createdAt }] of this.keyHistory.entries()) {
      if (createdAt < cutoffTime) {
        // Generate a new key for each security level
        for (const securityLevel of Object.values(SecurityLevel)) {
          for (const encryptionType of Object.values(EncryptionType)) {
            const { key: newKey, keyId: newKeyId } = await this.generateKey(
              securityLevel as SecurityLevel,
              encryptionType as EncryptionType
            );
            
            rotatedKeys.set(`${securityLevel}_${encryptionType}`, { key: newKey, keyId: newKeyId });
            
            // Store new key in history
            this.keyHistory.set(newKeyId, { key: newKey, createdAt: Date.now() });
          }
        }
        
        // Remove old key if we've exceeded retention policy
        if (this.keyHistory.size > this.keyRotationPolicy.retainPreviousKeys) {
          // Find oldest key
          let oldestKeyId = '';
          let oldestTime = Date.now();
          
          for (const [keyId, { createdAt }] of this.keyHistory.entries()) {
            if (createdAt < oldestTime) {
              oldestTime = createdAt;
              oldestKeyId = keyId;
            }
          }
          
          // Remove oldest key
          if (oldestKeyId) {
            this.keyHistory.delete(oldestKeyId);
          }
        }
      }
    }
    
    return rotatedKeys;
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
}

// Export singleton instance
export const encryptionService = new EncryptionService();