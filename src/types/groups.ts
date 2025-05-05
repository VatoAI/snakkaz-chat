
export type GroupVisibility = 'public' | 'private' | 'secret';
export type GroupRole = 'admin' | 'member' | 'premium';
export type SecurityLevel = 'standard' | 'p2p_e2ee' | 'server_e2ee';

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
}

export interface GroupMember {
  id?: string;
  group_id: string;
  user_id: string;
  role: GroupRole;
  joined_at?: string;
  invited_by?: string;
}

export interface GroupInvite {
  id: string;
  group_id: string;
  invited_by: string;
  invited_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at?: string;
  updated_at?: string;
}
