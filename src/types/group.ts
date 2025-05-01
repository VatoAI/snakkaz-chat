/**
 * Group chat types for Snakkaz
 * Inspired by the best features from Telegram, Signal and Wickr
 */

import { SecurityLevel } from './security';
// Fjerner import av User som ikke finnes
// import { User } from './user';

export type GroupWritePermission = 'all' | 'admin' | 'selected';
// Fjernet null som et alternativ siden alle meldinger skal slettes 
export type MessageTTLOption = 300 | 1800 | 3600 | 86400 | 604800; // 5min, 30min, 1h, 24h, 7d

// Legger til manglende typer
export type GroupVisibility = 'public' | 'private' | 'secret';

export enum GroupType {
  STANDARD = 'standard', // Vanlig gruppe
  SECRET = 'secret',    // E2E kryptert gruppe, à la Secret Chats i Telegram
  SELF_DESTRUCT = 'self_destruct', // Alle meldinger slettes automatisk etter gitt tid (Telegram + Signal)
  BROADCAST = 'broadcast' // Kringkastingsgruppe hvor kun admin kan sende meldinger (som Telegram-kanaler)
}

export enum GroupRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  MEMBER = 'member',
  RESTRICTED = 'restricted',
  BANNED = 'banned'
}

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

export interface GroupMember {
  userId: string;
  addedAt: Date | number;
  addedBy?: string;
  role: GroupRole;
  permissions: GroupPermission[];
  status: GroupMemberStatus;
  displayName?: string; // Tilpasset visningsnavn for denne brukeren i gruppen (som i Telegram)
  lastReadMessageId?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  createdAt: Date | number;
  createdBy: string;
  updatedAt: Date | number;
  type: GroupType;
  memberCount: number;
  members: GroupMember[];
  settings: GroupSettings;
  inviteLink?: string;
  pinnedMessageIds?: string[];
  isVerified?: boolean; // For kanaler/grupper fra verifiserte utgivere
  reactionAllowed?: boolean; // Tillate reaksjoner på meldinger
  lastActivity?: Date | number;
  isArchived?: boolean;
  parentGroupId?: string; // For grupper/underkanaler i større grupper (Telegram-folders)
  
  // Legger til manglende egenskaper som brukes i GroupChatPage
  securityLevel?: SecurityLevel;
  visibility?: GroupVisibility;
  is_premium?: boolean;
  thumbnailUrl?: string;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  text?: string;
  mediaUrl?: string;
  mediaType?: string;
  thumbnailUrl?: string; // Legger til støtte for miniatyrbilder
  replyToId?: string;
  forwardedFrom?: string;
  editedAt?: Date | number;
  createdAt: Date | number;
  readBy?: string[];
  reactions?: {
    [emoji: string]: string[]; // emoji -> array av bruker-IDs
  };
  isPinned?: boolean;
  isServiceMessage?: boolean; // Systemmelding ("User joined", etc.)
  ttl?: number; // Time to live (for selvdestruerende meldinger)
  pollData?: GroupPoll; // Meningsmåling (poll) data
  isEncrypted?: boolean; // Indikerer om meldingen er kryptert
  caption?: string; // Støtte for bildetekst
}

export interface GroupInvite {
  id: string;
  groupId: string;
  createdBy: string;
  createdAt: Date | number;
  expiresAt?: Date | number;
  maxUses?: number;
  useCount: number;
  inviteLink: string;
  isRevoked: boolean;
}

export interface GroupPoll {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    voters?: string[]; // Array av bruker-IDs som har stemt
    voteCount: number;
  }[];
  createdBy: string;
  createdAt: Date | number;
  closesAt?: Date | number;
  isAnonymous: boolean;
  isMultiSelect: boolean;
  isClosed: boolean;
}

