import { SecurityLevel } from './security';
import { User } from './message';

export interface Group {
  id: string;
  name: string;
  creator_id: string;
  description?: string;
  visibility?: string;
  security_level: SecurityLevel;
  password?: string;
  created_at: string;
  updated_at?: string;
  write_permissions?: string;
  members?: GroupMember[];
  avatar_url?: string;
  is_premium?: boolean;
}

export interface GroupMember {
  id: string;
  user_id: string;
  group_id: string;
  joined_at: string;
  role: string;
  can_write: boolean;
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
}

export type MessageTTLOption = {
  value: number;
  label: string;
};
