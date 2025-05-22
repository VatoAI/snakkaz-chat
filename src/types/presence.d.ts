export type UserStatus = 'online' | 'away' | 'busy' | 'offline' | 'brb' | 'invisible';

export interface UserPresence {
  userId: string;
  status: UserStatus;
  lastActive: Date | string;
  customStatus?: string;
  currentGroupId?: string | null;
  typing?: boolean;
  typingInGroupId?: string | null;
  typingToUserId?: string | null;
  device?: 'mobile' | 'desktop' | 'tablet';
  encryptionEnabled?: boolean;
}
