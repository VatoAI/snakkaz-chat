
export type UserStatus = 'online' | 'away' | 'busy' | 'offline';

export interface UserPresence {
  status: UserStatus;
  lastActive: Date | string;
  currentGroupId?: string | null;
  typing?: boolean;
  typingInGroupId?: string | null;
  typingToUserId?: string | null;
  device?: 'mobile' | 'desktop' | 'tablet';
  encryptionEnabled?: boolean;
}
