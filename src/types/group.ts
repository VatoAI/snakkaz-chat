
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
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  can_write: boolean;
  userId?: string; // For backward compatibility
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
