
export enum UserStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
  BUSY = 'busy'
}

export interface UserPresence {
  status: UserStatus;
  online: boolean;
  lastActive?: string;
  customStatus?: string;
}
