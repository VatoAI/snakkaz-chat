export type GroupRole = 'owner' | 'admin' | 'moderator' | 'member' | 'guest' | 'premium';
export type GroupVisibility = 'private' | 'public' | 'hidden' | 'secret';
export type SecurityLevel = 'low' | 'standard' | 'high' | 'maximum' | 'premium' | 'server_e2ee' | 'p2p_e2ee';
export type GroupWritePermission = "all" | "admin" | "selected";
export type MessageTTLOption = 300 | 1800 | 3600 | 86400 | 604800 | null;

export interface Group {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string; 
  creator_id?: string; // For backward compatibility
  avatarUrl?: string;
  avatar_url?: string; // For backward compatibility
  type?: string;
  isPublic?: boolean;
  is_public?: boolean; // For backward compatibility
  settings?: any;
  members?: GroupMember[];
  memberCount?: number;
  member_count?: number; // For backward compatibility
  description?: string;
  visibility: GroupVisibility; // Make this required
  securityLevel?: SecurityLevel;
  security_level?: SecurityLevel; // For backward compatibility
  is_premium: boolean; // Make this required
  isPremium?: boolean; // For backward compatibility
  password?: string;
  write_permissions?: string;
  default_message_ttl?: number;
  unreadCount?: number; // For ChatList component
}

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
