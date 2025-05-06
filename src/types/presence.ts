
export enum UserStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
  BUSY = 'busy',
  BRB = 'brb'
}

export interface UserPresence {
  user_id: string;
  status: UserStatus;
  last_seen: string;
  online?: boolean;
}

// Utility functions for UserStatus
export function isValidStatus(status: string): status is UserStatus {
  return Object.values(UserStatus).includes(status as UserStatus);
}

export function getDefaultStatus(): UserStatus {
  return UserStatus.ONLINE;
}
