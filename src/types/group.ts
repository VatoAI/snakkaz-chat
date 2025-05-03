export type GroupVisibility = 'public' | 'private' | 'hidden' | 'secret';
export type GroupRole = 'admin' | 'moderator' | 'member';
export type GroupWritePermission = 'all' | 'admins' | 'moderators';
export type MessageTTLOption = 0 | 5 | 10 | 30 | 60 | 300 | 3600 | 86400 | 604800;
export type SecurityLevel = 'standard' | 'high' | 'maximum' | 'p2p_e2ee' | 'server_e2ee' | 'low';

export interface Group {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  createdBy: string;
  creator_id?: string; // For backward compatibility
  avatarUrl?: string;
  avatar_url?: string; // For backward compatibility
  memberCount?: number;
  visibility: GroupVisibility;
  securityLevel: SecurityLevel;
  is_premium: boolean;
  premium?: boolean; // For backward compatibility
  password?: string;
  updatedAt?: string;
  updated_at?: string; // For backward compatibility
  members?: GroupMember[];
  write_permissions?: GroupWritePermission;
  default_message_ttl?: number;
  unreadCount?: number;
}

export interface GroupMember {
  id: string;
  userId: string;
  user_id?: string; // For backward compatibility
  groupId: string;
  group_id?: string; // For backward compatibility
  role: GroupRole;
  joinedAt: string;
  joined_at?: string; // For backward compatibility
  canWrite: boolean;
  can_write?: boolean; // For backward compatibility
  permissions?: string[]; // For additional permissions
}

export interface GroupMessage {
  id: string;
  content?: string;
  text?: string; // For backward compatibility
  senderId: string;
  sender_id?: string; // For backward compatibility
  groupId?: string;
  group_id?: string; // For backward compatibility
  createdAt: Date | string;
  created_at?: Date | string; // For backward compatibility
  isEdited?: boolean;
  is_edited?: boolean; // For backward compatibility
  mediaUrl?: string;
  media_url?: string; // For backward compatibility
  mediaType?: string;
  media_type?: string; // For backward compatibility
  ttl?: number;
  readBy?: string[];
  read_by?: string[]; // For backward compatibility
  replyToId?: string;
  reply_to_id?: string; // For backward compatibility
  isEncrypted?: boolean;
  is_encrypted?: boolean; // For backward compatibility
}

export interface GroupInvite {
  id: string;
  groupId: string;
  group_id?: string; // For backward compatibility
  invitedBy: string;
  invited_by?: string; // For backward compatibility
  invitedUserId?: string;
  invited_user_id?: string; // For backward compatibility
  email?: string;
  code: string;
  expiresAt: Date | string;
  expires_at?: Date | string; // For backward compatibility
  createdAt: Date | string;
  created_at?: Date | string; // For backward compatibility
}

export interface CreateGroupData {
  name: string;
  description?: string;
  visibility?: GroupVisibility;
  securityLevel?: SecurityLevel;
  password?: string;
  initialMembers?: string[];
}
