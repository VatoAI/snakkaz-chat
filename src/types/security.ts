
export type SecurityLevel = 'p2p_e2ee' | 'server_e2ee' | 'standard';

export interface SecurityOptions {
  requirePinForSensitive: boolean;
  allowScreenshots: boolean;
  autoDeleteMessages: boolean | number; // false or time in seconds
}
