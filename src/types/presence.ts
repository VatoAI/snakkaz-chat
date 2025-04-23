
export type UserStatus = 'online' | 'busy' | 'brb' | 'offline';

export interface UserPresence {
  user_id: string;
  status: UserStatus;
  last_seen: string;
}
