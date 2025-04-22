
export type SecurityLevel = 'p2p_e2ee' | 'server_e2ee' | 'standard';

export interface SecuritySettings {
  defaultSecurityLevel: SecurityLevel;
  autoAcceptP2P: boolean;
  enableReadReceipts: boolean;
  enableTypingIndicators: boolean;
}

export interface ConnectionStatus {
  type: 'p2p' | 'server' | 'disconnected';
  encryptionEnabled: boolean;
  securityLevel: SecurityLevel;
  connectionQuality?: 'excellent' | 'good' | 'fair' | 'poor';
}
