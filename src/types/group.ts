
import { SecurityLevel } from './security';

export interface Group {
  id: string;
  name: string;
  created_at: string;
  creator_id: string;
  members: GroupMember[];
  security_level: SecurityLevel;
}

export interface GroupMember {
  id: string;
  user_id: string;
  group_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  profile?: {
    id: string;
    username: string | null;
    avatar_url: string | null;
    full_name: string | null;
  };
}

export interface GroupInvite {
  id: string;
  group_id: string;
  invited_by: string;
  invited_user_id: string;
  created_at: string;
  expires_at: string;
  group_name?: string;
  sender_username?: string;
}
