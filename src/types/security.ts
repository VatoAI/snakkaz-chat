
/**
 * Security levels for messages and groups
 */
export type SecurityLevel = 
  | 'standard'       // Standard security with server-side encryption at rest
  | 'server_e2ee'    // End-to-end encryption with keys stored on server
  | 'p2p_e2ee'       // Peer-to-peer end-to-end encryption
  | 'private'        // Private messaging with enhanced security
  | 'ultra_secure';  // Ultra secure with zero knowledge encryption

<<<<<<< HEAD
// For backwards compatibility
export type SecurityLevelAlias = SecurityLevel;
// Define security levels for encryption
export type SecurityLevel = 'low' | 'standard' | 'server_e2ee' | 'p2p_e2ee' | 'high' | 'maximum' | 'premium';

// Define security-related interfaces
export interface SecuritySettings {
  securityLevel: SecurityLevel;
  requireAuthentication: boolean;
  passwordProtected?: boolean;
  passwordHash?: string;
  twoFactorEnabled?: boolean;
  allowScreenshots?: boolean;
  allowForwarding?: boolean;
  selfDestructMessages?: boolean;
  selfDestructTime?: number; // in seconds
}

// Define user security preferences
export interface UserSecurityPreferences {
  preferredSecurityLevel: SecurityLevel;
  autoLockTime: number; // in seconds, 0 means disabled
  biometricEnabled: boolean;
  notificationContent: 'full' | 'sender-only' | 'none';
  showLastSeen: boolean;
  readReceipts: boolean;
}

// Security utility functions
export const mapSecurityLevelDisplayName = (level: SecurityLevel): string => {
  switch (level) {
    case 'standard':
      return 'Standard';
    case 'server_e2ee':
    case 'high':
      return 'Høy (Server E2EE)';
    case 'p2p_e2ee':
    case 'maximum':
      return 'Maksimal (P2P E2EE)';
    default:
      return 'Ukjent';
  }
};

export const isE2EESecurityLevel = (level?: SecurityLevel): boolean => {
  return level === 'p2p_e2ee' || level === 'server_e2ee' || level === 'high' || level === 'maximum';
};
=======
/**
 * Check if a security level is end-to-end encrypted
 */
export function isE2EE(level: SecurityLevel): boolean {
  return level === 'server_e2ee' || level === 'p2p_e2ee' || level === 'ultra_secure';
}

/**
 * Checks if a security level is peer-to-peer
 */
export function isP2P(level: SecurityLevel): boolean {
  return level === 'p2p_e2ee';
}

/**
 * Gets the display name for a security level
 */
export function getSecurityLevelName(level: SecurityLevel): string {
  switch (level) {
    case 'standard': 
      return 'Standard Security';
    case 'server_e2ee':
      return 'End-to-End Encrypted';
    case 'p2p_e2ee':
      return 'Peer-to-Peer Encrypted';
    case 'private':
      return 'Private';
    case 'ultra_secure':
      return 'Ultra Secure';
    default:
      return 'Unknown Security Level';
  }
}
>>>>>>> 09bc5ce1a428b3836c8087ae88ab127e98605ff6
