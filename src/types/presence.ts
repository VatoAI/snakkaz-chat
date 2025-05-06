
export enum UserStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
  BUSY = 'busy',
  BRB = 'brb'
}

// Også eksporter som string literal type for bedre kompatibilitet
export type UserStatusType = 'online' | 'offline' | 'away' | 'busy' | 'brb';

export interface UserPresence {
  user_id: string;
  status: UserStatus;
  last_seen: string;
  online?: boolean;
}

// Helper functions for working with user status
export const isValidStatus = (status: string): status is UserStatus => {
  return ['online', 'offline', 'away', 'busy', 'brb'].includes(status);
};

export const getDefaultStatus = (): UserStatus => UserStatus.ONLINE;
