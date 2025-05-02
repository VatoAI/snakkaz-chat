
import { UserID } from './user';

export type GroupID = string;
export type GroupRole = 'owner' | 'admin' | 'moderator' | 'member';
export type GroupVisibility = 'public' | 'private' | 'hidden';
export type SecurityLevel = 'standard' | 'high' | 'premium';

// Define missing types for GroupInvite
export interface GroupInvite {
  id: string;
  groupId: string; 
  invitedById: string;
  invitedUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  expiresAt?: string;
  // Computed properties for display
  group_name?: string; // For backward compatibility 
  sender_username?: string; // For backward compatibility
  group_id?: string; // For backward compatibility
  invited_by?: string; // For backward compatibility
  expires_at?: string; // For backward compatibility
}

// Group member interface
export interface GroupMember {
  id: string;
  userId: string; // New property
  user_id?: string; // For backward compatibility
  groupId: string;
  role: GroupRole;
  joinedAt: string;
  isActive: boolean;
  lastActive?: string;
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
  groupId: string;
  createdAt: string | Date;
  text?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  ttl?: number;
  readBy?: string[];
  replyToId?: string;
  isEncrypted?: boolean;
  content?: string; // Added for compatibility with DecryptedMessage
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  creator_id?: string; // For backward compatibility
  visibility: GroupVisibility;
  securityLevel: SecurityLevel;
  avatarUrl?: string;
  avatar_url?: string; // For backward compatibility
  memberCount?: number;
  members?: GroupMember[];
  is_premium?: boolean;
  isPublic?: boolean;
  type?: string;
  settings?: any;
  password?: string; // For backward compatibility
}
