
export type SecurityLevel = 'p2p_e2ee' | 'server_e2ee' | 'standard';

export interface EncryptedData {
  iv: string;
  content: string;
  encryption_key?: string;
}

export interface E2EEConfiguration {
  enabled: boolean;
  publicKey?: string;
  privateKey?: string;
}

export type EncryptionScope = 'message' | 'group' | 'global';
