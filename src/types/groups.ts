export type GroupVisibility = 'public' | 'private' | 'secret' | 'hidden';
export type GroupRole = 'admin' | 'member' | 'premium';
// Importing SecurityLevel from security.ts to ensure consistency
import { SecurityLevel } from './security';

export interface Group {
  id: string;
  name: string;
  description?: string;
  creator_id: string;
  visibility: GroupVisibility;
  security_level: SecurityLevel;
  password?: string;
  is_premium?: boolean;
  avatar_url?: string | null;
  members?: GroupMember[];
  created_at?: string;
  updated_at?: string;
  
  // Aliases for compatibility
  securityLevel?: SecurityLevel;
  avatarUrl?: string | null;
  unreadCount?: number;
}

export interface GroupMember {
  id?: string;
  group_id: string;
  user_id: string;
  role: GroupRole;
  joined_at?: string;
  invited_by?: string;
  
  // Aliases for compatibility
  groupId?: string;
  userId?: string;
  joinedAt?: string;
  canWrite?: boolean;
  can_write?: boolean;
  permissions?: any;
}

export interface GroupInvite {
  id: string;
  group_id: string;
  invited_by: string;
  invited_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at?: string;
  updated_at?: string;
  
  // Aliases for compatibility
  groupId?: string;
  invitedById?: string;
  invitedUserId?: string;
  createdAt?: string;
  updatedAt?: string;
}
