
// Define UserStatus as an enum (not just a type)
export enum UserStatus {
  ONLINE = 'online',
  AWAY = 'away',
  BUSY = 'busy',
  OFFLINE = 'offline',
  BRB = 'brb'
}

export interface UserPresence {
  user_id: string;
  status: UserStatus;
  last_seen?: string;
  online?: boolean;
}
