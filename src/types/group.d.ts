
export interface Group {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string; 
  creator_id?: string; // For backward compatibility
  avatarUrl?: string;
  avatar_url?: string; // For backward compatibility
  type: string;
  isPublic: boolean;
  is_public?: boolean; // For backward compatibility
  settings: any;
  members: GroupMember[];
  memberCount?: number;
  member_count?: number; // For backward compatibility
  description?: string;
  visibility: GroupVisibility; // Make this required
  securityLevel?: SecurityLevel;
  security_level?: SecurityLevel; // For backward compatibility
  is_premium: boolean; // Make this required
  isPremium?: boolean;
  updatedAt: string; // Make this required
  updated_at?: string; // For backward compatibility
  password?: string;
  write_permissions?: string;
  default_message_ttl?: number;
  replyToId?: string; // Add missing properties for messages
  reply_to_id?: string;
  text?: string;
  mediaUrl?: string;
  media_url?: string;
  mediaType?: string;
  media_type?: string;
  ttl?: number;
  readBy?: string[];
  read_by?: string[];
  isEncrypted?: boolean;
  is_encrypted?: boolean;
  sender_id?: string;
  created_at?: string | Date;
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
  isPremium?: boolean;
  is_premium?: boolean; // For backward compatibility
  isActive?: boolean;
  is_active?: boolean;
  lastActive?: string;
  last_active?: string;
  can_write?: boolean;
  permissions?: any; // Add missing field reported in error
}

export type GroupRole = 'owner' | 'admin' | 'moderator' | 'member' | 'guest' | 'premium';

export interface GroupMessage {
  id: string;
  content: string;
  text?: string; // For backward compatibility
  groupId: string;
  group_id?: string; // For backward compatibility
  senderId: string;
  sender_id?: string; // For backward compatibility
  createdAt: string;
  created_at?: string | Date; // For backward compatibility
  updatedAt: string;
  updated_at?: string; // For backward compatibility
  isEdited: boolean;
  is_edited?: boolean; // For backward compatibility
  isDeleted: boolean;
  is_deleted?: boolean; // For backward compatibility
  isPinned: boolean;
  is_pinned?: boolean; // For backward compatibility
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

export type GroupVisibility = 'private' | 'public' | 'hidden';
export type SecurityLevel = 'low' | 'standard' | 'high' | 'maximum' | 'premium';

export interface GroupInvite {
  id: string;
  groupId: string;
  group_id?: string; // For backward compatibility 
  invitedById: string;
  invited_by?: string; // For backward compatibility
  invitedUserId: string;
  invited_user_id?: string; // For backward compatibility
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  created_at?: string; // For backward compatibility
  expiresAt?: string;
  expires_at?: string; // For backward compatibility
  // Computed properties for display
  group_name?: string;
  sender_username?: string;
}

export type GroupWritePermission = "all" | "admin" | "selected";
export type MessageTTLOption = 300 | 1800 | 3600 | 86400 | 604800 | null;

export interface PremiumFeatures {
  enhanced_encryption?: boolean;
  unlimited_storage?: boolean;
  advanced_permissions?: boolean;
  file_sharing?: boolean;
  ai_moderation?: boolean;
  priority_bandwidth?: boolean;
  message_editing?: boolean;
  custom_branding?: boolean;
}

export interface CreateGroupData {
  name: string;
  description?: string;
  visibility: GroupVisibility;
  securityLevel?: SecurityLevel;
  is_premium?: boolean;
}

export interface GroupInvitation {
  id: string;
  group_id: string;
  code: string;
  email?: string;
  expires_at: string;
  created_by: string;
  createdAt: string;
}
