export type UserStatus = 'online' | 'offline' | 'away' | 'busy' | 'brb';

// For bakoverkompatibilitet, støtt også enum-formatet
export enum UserStatusEnum {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
  BUSY = 'busy',
  BRB = 'brb'
}

export interface UserPresence {
  status: UserStatus | string;
  online: boolean;
  lastActive?: string;
  last_seen?: string;
  customStatus?: string;
}

// Helper functions for working with user status
export const isValidStatus = (status: string): status is UserStatus => {
  return ['online', 'offline', 'away', 'busy', 'brb'].includes(status);
};

export const getDefaultStatus = (): UserStatus => 'online';
