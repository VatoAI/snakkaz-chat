
export interface Group {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
  avatarUrl?: string;
  type: string;
  isPublic: boolean;
  settings: any;
  members: GroupMember[];
  memberCount?: number;
  description?: string;
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: GroupRole;
  joinedAt: string;
  isPremium?: boolean;
}

export type GroupRole = 'owner' | 'admin' | 'moderator' | 'member' | 'guest';

export interface GroupMessage {
  id: string;
  content: string;
  groupId: string;
  senderId: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  isDeleted: boolean;
  isPinned: boolean;
}
