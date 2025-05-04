
export type GroupVisibility = 'public' | 'private' | 'hidden';

export interface Group {
  id: string;
  name: string;
  description?: string;
  visibility?: GroupVisibility;
  avatar_url?: string;
  created_at?: string;
  creator_id?: string;
  security_level?: string;
  members?: GroupMember[];
  is_premium?: boolean;
  memberCount?: number;
  createdBy?: string; // Adding this to fix conflict with another Group type
}

export interface GroupMember {
  id?: string;
  group_id?: string;
  user_id?: string;
  userId?: string;
  role?: string;
  joined_at?: string;
  joinedAt?: string;
  can_write?: boolean;
  canWrite?: boolean;
}

export interface GroupMessage {
  id: string;
  content?: string;
  text?: string;
  sender_id?: string;
  senderId?: string;
  group_id?: string;
  groupId?: string;
  created_at?: string;
  createdAt?: string | Date;
  updated_at?: string;
  updatedAt?: string | Date;
  is_edited?: boolean;
  isEdited?: boolean;
  is_deleted?: boolean;
  isDeleted?: boolean;
  media_url?: string;
  mediaUrl?: string;
  media_type?: string;
  mediaType?: string;
  read_by?: string[];
  readBy?: string[];
  reply_to_id?: string;
  replyToId?: string;
  isPending?: boolean; // Add missing property
  hasError?: boolean;  // Add missing property
}
