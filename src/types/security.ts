export enum SecurityLevel {
  STANDARD = 'standard',
  SERVER_E2EE = 'server_e2ee',
  P2P_E2EE = 'p2p_e2ee'
}

// Keep the type alias for backward compatibility
export type SecurityLevelType = 'standard' | 'server_e2ee' | 'p2p_e2ee';

// Helper function to convert string to SecurityLevel
export const toSecurityLevel = (level: string): SecurityLevel => {
  switch (level) {
    case 'standard':
      return SecurityLevel.STANDARD;
    case 'server_e2ee':
      return SecurityLevel.SERVER_E2EE;
    case 'p2p_e2ee':
      return SecurityLevel.P2P_E2EE;
    default:
      return SecurityLevel.STANDARD;
  }
};

export enum SecurityLevel {
  STANDARD = 'standard',
  SERVER_E2EE = 'server_e2ee',
  P2P_E2EE = 'p2p_e2ee',
  PREMIUM = 'premium',
  HIGH = 'high',
  MAXIMUM = 'maximum'
}
