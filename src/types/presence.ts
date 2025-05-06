
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
<<<<<<< HEAD
  status: UserStatus;
  online: boolean;
  lastActive?: string;
  customStatus?: string;
}

// Helper functions for working with user status
export const isValidStatus = (status: string): status is UserStatus => {
  return ['online', 'offline', 'away', 'busy', 'brb'].includes(status);
};

export const getDefaultStatus = (): UserStatus => 'online';
=======

// Utility functions for UserStatus
export function isValidStatus(status: string): status is UserStatus {
  return Object.values(UserStatus).includes(status as UserStatus);
}

export function getDefaultStatus(): UserStatus {
  return UserStatus.ONLINE;
}
>>>>>>> 09bc5ce1a428b3836c8087ae88ab127e98605ff6
