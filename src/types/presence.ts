
export enum UserStatus {
  ONLINE = 'online',
  AWAY = 'away',
  BUSY = 'busy',
  OFFLINE = 'offline',
  INVISIBLE = 'invisible'
}

export interface UserPresence {
  userId: string;
  status: UserStatus;
  lastActive?: string;
  customStatus?: string;
}
