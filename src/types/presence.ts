
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
