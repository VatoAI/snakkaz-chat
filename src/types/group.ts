/**
 * Group chat types for Snakkaz
 * Inspired by the best features from Telegram, Signal and Wickr
 */

import { SecurityLevel } from './security';

export type GroupWritePermission = 'all' | 'admin' | 'selected';
export type MessageTTLOption = 300 | 1800 | 3600 | 86400 | 604800; // 5min, 30min, 1h, 24h, 7d

// Visibility types
export type GroupVisibility = 'public' | 'private' | 'hidden' | 'secret';

// Group type enum
export enum GroupTypeEnum {
  STANDARD = 'standard', // Vanlig gruppe
  SECRET = 'secret',    // E2E kryptert gruppe, à la Secret Chats i Telegram
  SELF_DESTRUCT = 'self_destruct', // Alle meldinger slettes automatisk etter gitt tid (Telegram + Signal)
  BROADCAST = 'broadcast' // Kringkastingsgruppe hvor kun admin kan sende meldinger (som Telegram-kanaler)
}

// Group role enum
export enum GroupRoleEnum {
  OWNER = 'owner',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  MEMBER = 'member',
  RESTRICTED = 'restricted',
  BANNED = 'banned',
  GUEST = 'guest'
}

// Group role type for compatibility
export type GroupRole = 'owner' | 'admin' | 'moderator' | 'member' | 'guest' | 'restricted' | 'banned';

export enum GroupPermission {
  SEND_MESSAGES = 'send_messages',
  SEND_MEDIA = 'send_media',
  INVITE_USERS = 'invite_users',
  PIN_MESSAGES = 'pin_messages',
  CHANGE_INFO = 'change_info',
  DELETE_MESSAGES = 'delete_messages',
  BAN_USERS = 'ban_users',
  ADD_ADMINS = 'add_admins'
}

export enum GroupMemberStatus {
  ACTIVE = 'active',
  LEFT = 'left',
  KICKED = 'kicked',
  BANNED = 'banned'
}

export interface GroupSettings {
  autoDeleteMessagesAfter?: number; // Tid i sekunder, 0 = aldri
  allowInviteLinks: boolean;
  joinApprovalRequired: boolean; // Krever admin-godkjenning for å bli med (som Request to Join i Telegram)
  disappearingMessagesEnabled: boolean;
  screenshotNotificationsEnabled: boolean; // Signal-lignende varsel når noen tar skjermbilde
  isEncrypted: boolean;
  encryptionAlgorithm?: string;
  maxMembers?: number;
  isDiscoverable: boolean; // Kan finnes i søk
  slowMode?: number; // Antall sekunder mellom meldinger per bruker (Telegram-funksjon)
}

export interface Group {
  id: string;
  name: string;
  createdAt?: string | Date;
  created_at?: string | Date;
  createdBy?: string;
  created_by?: string;
  avatarUrl?: string;
  avatar_url?: string;
  type?: string;
  isPublic?: boolean;
  members?: GroupMember[];
  settings?: GroupSettings | any;
  inviteLink?: string;
  pinnedMessageIds?: string[];
  isVerified?: boolean; // For kanaler/grupper fra verifiserte utgivere
  reactionAllowed?: boolean; // Tillate reaksjoner på meldinger
  lastActivity?: Date | number | string;
  last_activity?: Date | number | string;
  isArchived?: boolean;
  parentGroupId?: string; // For grupper/underkanaler i større grupper (Telegram-folders)
  updatedAt?: string | Date;
  
  // Properties from both branches
  securityLevel?: SecurityLevel;
  visibility?: GroupVisibility;
  is_premium?: boolean;
  memberCount?: number;
  description?: string;
  thumbnailUrl?: string;
  thumbnail_url?: string;
}

export interface GroupMember {
  id?: string;
  userId?: string;
  user_id?: string;
  groupId?: string;
  group_id?: string;
  role?: GroupRole | string;
  joinedAt?: string;
  joined_at?: string;
  addedAt?: Date | number | string;
  addedBy?: string;
  permissions?: GroupPermission[] | string[];
  status?: GroupMemberStatus | string;
  displayName?: string;
  last_read_message_id?: string;
  lastReadMessageId?: string;
  isPremium?: boolean;
}

export interface GroupMessage {
  id: string;
  content?: string;
  text?: string;
  groupId?: string;
  group_id?: string;
  senderId?: string;
  sender_id?: string;
  mediaUrl?: string;
  media_url?: string;
  mediaType?: string;
  media_type?: string;
  thumbnailUrl?: string;
  thumbnail_url?: string;
  replyToId?: string;
  reply_to_id?: string;
  forwardedFrom?: string;
  forwarded_from?: string;
  editedAt?: Date | number | string;
  edited_at?: Date | number | string;
  createdAt?: Date | number | string;
  created_at?: Date | number | string;
  updatedAt?: string | Date;
  updated_at?: string | Date;
  readBy?: string[];
  read_by?: string[];
  reactions?: {
    [emoji: string]: string[]; // emoji -> array av bruker-IDs
  };
  isPinned?: boolean;
  is_pinned?: boolean;
  isEdited?: boolean;
  is_edited?: boolean;
  isDeleted?: boolean;
  is_deleted?: boolean;
  isServiceMessage?: boolean;
  is_service_message?: boolean;
  ttl?: number;
  pollData?: any; // Meningsmåling (poll) data
  isEncrypted?: boolean;
  is_encrypted?: boolean;
  caption?: string;
  sender?: {
    id: string;
    displayName?: string;
    username?: string;
    avatar_url?: string;
    [key: string]: any;
  };
}
