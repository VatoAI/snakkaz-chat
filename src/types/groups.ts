// Consolidated Group Types for SnakkaZ Chat

// Group role with all possible values from both definitions
export type GroupRole = "admin" | "moderator" | "member" | "premium" | "owner" | "guest";

// Group visibility with all possible values from both definitions
export type GroupVisibility = "public" | "private" | "hidden" | "secret";

// Security levels with all possible values from both definitions
export type SecurityLevel = "low" | "standard" | "high" | "maximum" | "p2p_e2ee" | "server_e2ee";

// Write permission types
export type GroupWritePermission = "all" | "admin" | "admins" | "moderators" | "selected";

// Message TTL options with all values
export type MessageTTLOption = 0 | 5 | 10 | 30 | 60 | 300 | 1800 | 3600 | 86400 | 604800 | null;

// Premium features for groups
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

// Group member with all properties from both definitions, using camelCase as primary
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
    permissions?: string[];
    isActive?: boolean;
    lastActive?: string;
    createdAt?: string;
    storage_quota?: number;
    premium_features?: string[];
}

// Group interface with all properties from both definitions, using camelCase as primary
export interface Group {
    id: string;
    name: string;
    description?: string;
    avatarUrl?: string;
    avatar_url?: string; // For backward compatibility
    createdAt: string;
    createdBy: string;
    creator_id?: string; // For backward compatibility
    updatedAt?: string;
    updated_at?: string; // For backward compatibility
    visibility: GroupVisibility;
    securityLevel: SecurityLevel;
    isPremium: boolean;
    is_premium?: boolean; // For backward compatibility
    premium?: boolean; // For backward compatibility
    memberCount?: number;
    unreadCount?: number;
    password?: string;
    members?: GroupMember[];
    writePermissions?: GroupWritePermission;
    write_permissions?: GroupWritePermission; // For backward compatibility
    defaultMessageTtl?: number;
    default_message_ttl?: number; // For backward compatibility
    maxMembers?: number;
    max_members?: number; // For backward compatibility
    storageLimit?: number;
    storage_limit?: number; // For backward compatibility
    maxMessageRetention?: number;
    max_message_retention?: number; // For backward compatibility
    premiumFeatures?: PremiumFeatures;
    premium_features?: PremiumFeatures; // For backward compatibility
    type?: string;
    isPublic?: boolean;
    settings?: any;
}

// Group message interface with all properties, using camelCase as primary
export interface GroupMessage {
    id: string;
    content: string;
    text?: string; // For backward compatibility
    senderId: string;
    sender_id?: string; // For backward compatibility
    groupId: string;
    group_id?: string; // For backward compatibility
    createdAt: string;
    created_at?: string; // For backward compatibility
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

// Group invitation with all properties, using camelCase as primary
export interface GroupInvite {
    id: string;
    groupId: string;
    group_id?: string; // For backward compatibility
    invitedBy: string;
    invited_by?: string; // For backward compatibility
    createdBy?: string;
    created_by?: string; // For backward compatibility
    invitedUserId?: string;
    invited_user_id?: string; // For backward compatibility
    email?: string;
    code: string;
    expiresAt: string;
    expires_at?: string; // For backward compatibility
    createdAt: string;
    created_at?: string; // For backward compatibility
}

// Data for creating a new group
export interface CreateGroupData {
    name: string;
    description?: string;
    visibility?: GroupVisibility;
    securityLevel?: SecurityLevel;
    isPremium?: boolean;
    is_premium?: boolean; // For backward compatibility
    password?: string;
    initialMembers?: string[];
}

// For backward compatibility, export the old types as well
export {
    Group as GroupData,
    GroupInvite as GroupInvitation
}
