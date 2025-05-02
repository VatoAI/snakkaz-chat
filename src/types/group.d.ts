
import { UserID } from './user';

export type GroupID = string;
export type GroupRole = 'owner' | 'admin' | 'moderator' | 'member' | 'premium' | 'guest';
export type GroupVisibility = 'public' | 'private' | 'hidden';
export type SecurityLevel = 'standard' | 'high' | 'premium' | 'low' | 'maximum';

// Define GroupInvite interface
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

// Group member interface
export interface GroupMember {
  id: string;
  userId: string;
  user_id?: string; // For backward compatibility
  groupId: string;
  group_id?: string; // For backward compatibility
  role: GroupRole;
  joinedAt: string;
  joined_at?: string; // For backward compatibility
  isActive: boolean;
  is_active?: boolean; // For backward compatibility
  lastActive?: string;
  last_active?: string; // For backward compatibility
  isPremium?: boolean;
  can_write?: boolean; // From groups.ts
}

// For dropdown selection in group creation
export interface GroupWritePermission {
  value: string;
  label: string;
}

// For dropdown selection in disappearing messages
export interface MessageTTLOption {
  value: number;
  label: string;
}

// Group message interface
export interface GroupMessage {
  id: string;
  senderId: string;
  sender_id?: string; // For backward compatibility
  groupId: string;
  group_id?: string; // For backward compatibility
  createdAt: string | Date;
  created_at?: string | Date; // For backward compatibility
  text?: string;
  content?: string; // Added for compatibility with DecryptedMessage
  mediaUrl?: string;
  media_url?: string; // For backward compatibility
  mediaType?: 'image' | 'video' | 'audio';
  media_type?: string; // For backward compatibility
  ttl?: number;
  readBy?: string[];
  read_by?: string[]; // For backward compatibility
  replyToId?: string;
  reply_to_id?: string; // For backward compatibility
  isEncrypted?: boolean;
  is_encrypted?: boolean; // For backward compatibility
  updatedAt?: string;
  updated_at?: string; // For backward compatibility
  isEdited?: boolean;
  is_edited?: boolean; // For backward compatibility
  isDeleted?: boolean;
  is_deleted?: boolean; // For backward compatibility
  isPinned?: boolean;
  is_pinned?: boolean; // For backward compatibility
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  created_at?: string; // For backward compatibility
  updatedAt?: string;
  updated_at?: string; // For backward compatibility
  createdBy: string;
  creator_id?: string; // For backward compatibility
  visibility: GroupVisibility;
  securityLevel: SecurityLevel;
  security_level?: SecurityLevel; // For backward compatibility
  avatarUrl?: string;
  avatar_url?: string; // For backward compatibility
  memberCount?: number;
  member_count?: number; // For backward compatibility
  members?: GroupMember[];
  is_premium?: boolean;
  isPremium?: boolean; // For newer code compatibility
  isPublic?: boolean;
  is_public?: boolean; // For backward compatibility
  type?: string;
  settings?: any;
  password?: string;
  write_permissions?: string; // From groups.ts
  default_message_ttl?: number; // From groups.ts
}

// Add extra type for backward compatibility with groups.ts
export interface GroupInvitation {
  id: string;
  group_id: string;
  code: string;
  email?: string;
  expires_at: string;
  created_by: string;
  createdAt: string;
}

// For premium features
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

// For backward compatibility with CreateGroupData
export interface CreateGroupData {
  name: string;
  description?: string;
  visibility: GroupVisibility;
  securityLevel?: SecurityLevel;
  is_premium?: boolean;
}
