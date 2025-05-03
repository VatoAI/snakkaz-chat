// Define security levels for encryption
export type SecurityLevel = 'standard' | 'server_e2ee' | 'p2p_e2ee' | 'high' | 'maximum';

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
