
export enum UserStatus {
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
