import { SecurityLevel } from './security';
import { User } from './message';

// Group member role type
export type GroupRole = 'admin' | 'moderator' | 'member' | 'premium';

export interface Group {
  id: string;
  name: string;
  creator_id: string;
  avatar_url?: string | null;
  created_at: string;
  default_message_ttl?: number;
  members: GroupMember[];
  security_level: string;
  write_permissions: string;
  password?: string | null;
  description?: string;
  allow_media_sharing?: boolean;
  allow_link_previews?: boolean;
  allow_member_invites?: boolean;
  is_private?: boolean;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: GroupRole;
  joined_at: string;
  can_write: boolean;
  userId?: string; // For backward compatibility
  user?: User;
}

export interface GroupMessage {
  id: string;
  group_id: string;
  sender_id: string;
  content?: string;
  created_at: string;
  updated_at?: string;
  is_edited?: boolean;
  is_deleted?: boolean;
  media_url?: string;
  media_type?: string;
  sender?: User;
}

export interface GroupInvite {
  id: string;
  group_id: string;
  invited_user_id: string;
  invited_by: string;
  created_at: string;
  expires_at: string;
  group_name?: string; // For displaying group name in invites
}

export type GroupVisibility = 'public' | 'private' | 'invite_only' | 'hidden';
export type GroupWritePermission = 'all' | 'admin' | 'moderator';
