
export type UserStatus = 'online' | 'away' | 'busy' | 'offline' | 'brb' | 'invisible';

export const isValidStatus = (status: string): status is UserStatus => {
  return ['online', 'away', 'busy', 'offline', 'brb', 'invisible'].includes(status);
};

export const getDefaultStatus = (): UserStatus => 'online';

export interface UserPresence {
  userId: string;
  status: UserStatus;
  lastActive?: string;
  customStatus?: string;
  device?: 'mobile' | 'desktop' | 'tablet';
  typing?: boolean;
  typingInGroupId?: string | null;
  typingToUserId?: string | null;
  encryptionEnabled?: boolean;
}
