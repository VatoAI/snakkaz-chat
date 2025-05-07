/**
 * Main Encryption Service
 * 
 * This service coordinates all encryption-related operations including:
 * - Key management
 * - User authentication for encryption
 * - Integration with various encryption strategies
 */

import { encryptPageForOffline, decryptOfflinePage, isPageAvailableOffline } from './offlinePageEncryption';

// Supported security levels
export enum SecurityLevel {
  STANDARD = 'STANDARD',
  E2EE = 'E2EE',
  P2P_E2EE = 'P2P_E2EE'
}

// Encryption configuration
interface EncryptionConfig {
  defaultSecurityLevel: SecurityLevel;
  enableOfflineSupport: boolean;
  keyRotationIntervalDays: number;
}

// Default configuration values
const DEFAULT_CONFIG: EncryptionConfig = {
  defaultSecurityLevel: SecurityLevel.E2EE,
  enableOfflineSupport: true,
  keyRotationIntervalDays: 30,
};

/**
 * Main encryption service class
 */
export class EncryptionService {
  private config: EncryptionConfig;
  
  constructor(config: Partial<EncryptionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  
  /**
   * Initialize the encryption service
   */
  public async initialize(): Promise<void> {
    // Add initialization logic here (e.g., loading keys, checking for updates)
    console.log('Encryption service initialized with security level:', this.config.defaultSecurityLevel);
  }
  
  /**
   * Encrypt content with appropriate security level
   */
  public async encrypt(content: any, securityLevel?: SecurityLevel, enableOffline: boolean = this.config.enableOfflineSupport): Promise<any> {
    const effectiveSecurityLevel = securityLevel || this.config.defaultSecurityLevel;
    
    if (enableOffline && effectiveSecurityLevel === SecurityLevel.P2P_E2EE) {
      // Use offline encryption for P2P_E2EE mode
      const pageId = typeof content.id === 'string' ? content.id : `page-${Date.now()}`;
      return encryptPageForOffline(pageId, content);
    }
    
    // Add other encryption strategies here
    throw new Error(`Encryption with security level ${effectiveSecurityLevel} not yet implemented`);
  }
  
  /**
   * Decrypt content according to its security level
   */
  public async decrypt(encryptedData: any, pageId?: string): Promise<any> {
    // Check if this is offline encrypted data
    if (encryptedData.securityLevel === SecurityLevel.P2P_E2EE && encryptedData.isOfflineReady && pageId) {
      return decryptOfflinePage(pageId, encryptedData);
    }
    
    // Add other decryption strategies here
    throw new Error(`Decryption for security level ${encryptedData.securityLevel} not yet implemented`);
  }
  
  /**
   * Check if content is available offline
   */
  public async isAvailableOffline(pageId: string): Promise<boolean> {
    return isPageAvailableOffline(pageId);
  }
  
  /**
   * Update encryption configuration
   */
  public updateConfig(config: Partial<EncryptionConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Export a default instance
export const defaultEncryptionService = new EncryptionService();