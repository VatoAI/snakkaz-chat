// Group Types
export type GroupRole = "admin" | "moderator" | "member";

export type GroupVisibility = "private" | "public";

export interface GroupMember {
    id: string;
    group_id: string;
    user_id: string;
    role: GroupRole;
    createdAt: string;
}

export interface Group {
    id: string;
    name: string;
    description?: string;
    avatarUrl?: string;
    visibility: GroupVisibility;
    is_premium: boolean;
    memberCount: number;
    createdAt: string;
    updatedAt: string;
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
}