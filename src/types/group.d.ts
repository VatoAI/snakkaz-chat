
import { SecurityLevel } from "./security";

export type GroupWritePermission = 'all' | 'admin' | 'selected';
export type MessageTTLOption = 300 | 1800 | 3600 | 86400 | 604800 | null;

export interface Group {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  creator_id: string;
  security_level: SecurityLevel;
  write_permissions: GroupWritePermission;
  default_message_ttl: MessageTTLOption;
  password?: string | null;
  avatar_url?: string | null;
  members: GroupMember[];
  is_premium: boolean;
}

export interface GroupMember {
  id: string;
  user_id: string;
  group_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  can_write: boolean;
  username?: string;
  avatar_url?: string;
}

export interface GroupInvite {
  id: string;
  group_id: string;
  invited_user_id: string;
  invited_by: string;
  created_at: string;
  expires_at: string;
}
