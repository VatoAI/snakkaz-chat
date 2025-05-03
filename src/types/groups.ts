
// Group Types
export type GroupRole = "admin" | "moderator" | "member" | "premium" | "owner" | "guest";

export type GroupVisibility = "private" | "public" | "hidden";

export type SecurityLevel = "low" | "standard" | "high" | "maximum";

export interface GroupMember {
    id: string;
    group_id: string;
    user_id: string;
    role: GroupRole;
    createdAt: string;
    can_write: boolean;
    storage_quota?: number; // Premium-medlemmer kan ha høyere quota
    premium_features?: string[]; // Liste over aktive premium-funksjoner
    // Add compatibility with newer type
    userId?: string;
    groupId?: string;
    joinedAt?: string;
    isActive?: boolean;
    lastActive?: string;
}

export interface Group {
    id: string;
    name: string;
    description?: string;
    avatarUrl?: string;
    avatar_url?: string; // For backward compatibility
    visibility: GroupVisibility;
    securityLevel?: SecurityLevel;
    is_premium: boolean;
    memberCount: number;
    unreadCount?: number;
    createdAt: string;
    updatedAt: string;
    max_members?: number; // Premium-grupper kan ha flere medlemmer
    storage_limit?: number; // Premium-grupper kan ha mer lagringsplass
    max_message_retention?: number; // Antall dager meldinger beholdes (premium kan ha ubegrenset)
    members?: GroupMember[]; // Medlemsliste med roller
    premium_features?: PremiumFeatures; // Aktive premium-funksjoner
    // Add compatibility with newer type
    createdBy?: string; 
    creator_id?: string;
    type?: string;
    isPublic?: boolean;
    settings?: any;
    password?: string;
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

export interface CreateGroupData {
    name: string;
    description?: string;
    visibility: GroupVisibility;
    securityLevel?: SecurityLevel;
    is_premium?: boolean;
}

export type GroupWritePermission = "all" | "admin" | "selected";

export type MessageTTLOption = 300 | 1800 | 3600 | 86400 | 604800 | null;

export interface PremiumFeatures {
    enhanced_encryption?: boolean; // 256-bit kryptering (versus standard 128-bit)
    unlimited_storage?: boolean; // Ubegrenset lagringsplass for meldinger
    advanced_permissions?: boolean; // Detaljerte tilgangskontroller
    file_sharing?: boolean; // Støtte for sikker fildeling
    ai_moderation?: boolean; // AI-drevet moderering av innhold
    priority_bandwidth?: boolean; // Prioritert båndbredde for bedre ytelse
    message_editing?: boolean; // Mulighet til å redigere sendte meldinger
    custom_branding?: boolean; // Tilpasset merking for bedriftskunder
}
