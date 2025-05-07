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

export class EncryptionService {
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
      
      // Encrypt the data
      const encryptedData = await encryptData(dataString, key, encryptionType);
      
      return {
        encryptedData,
        keyId,
        securityLevel,
        timestamp: Date.now(),
        metadata: {
          encryptionType,
          version: '1.0'
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
  ): Promise<{ key: string; keyId: string }> {
    const key = await generateEncryptionKey(securityLevel);
    const keyId = this.generateKeyId();
    return { key, keyId };
  }

  /**
   * Generate a unique key identifier
   */
  private generateKeyId(): string {
    return `key_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
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
}

// Export singleton instance
export const encryptionService = new EncryptionService();