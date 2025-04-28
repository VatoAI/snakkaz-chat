// Group Types
export type GroupRole = 'admin' | 'moderator' | 'member';

export type GroupVisibility = 'public' | 'private';

export interface GroupMember {
    id: string;
    userId: string;
    groupId: string;
    role: GroupRole;
    joinedAt: Date;
    invitedBy?: string;
}

export interface Group {
    id: string;
    name: string;
    description?: string;
    avatarUrl?: string;
    visibility: GroupVisibility;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    memberCount: number;
}

export interface GroupInvite {
    id: string;
    groupId: string;
    inviterId: string;
    inviteeEmail?: string;
    inviteeId?: string;
    code: string;
    status: 'pending' | 'accepted' | 'rejected' | 'expired';
    createdAt: Date;
    expiresAt?: Date;
}