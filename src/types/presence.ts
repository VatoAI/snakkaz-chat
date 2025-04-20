
export type UserStatus = 'online' | 'busy' | 'brb' | 'offline';

export interface UserPresence {
  id: string;
  user_id: string;
  status: UserStatus;
  last_seen: string;
}
