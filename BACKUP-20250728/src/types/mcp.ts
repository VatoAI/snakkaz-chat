/**
 * MCP Types - Type definisjoner for MCP integrasjon
 */

// MCP Client Configuration Type
export interface MCPClientConfig {
  baseUrl: string;
  endpoints: Record<string, string>;
  features: {
    [key: string]: any;
    groups?: {
      enabled: boolean;
      maxGroupsPerUser?: number;
      maxMembersPerGroup?: number;
      allowPublicGroups?: boolean;
      allowPrivateGroups?: boolean;
      securityLevels?: string[];
      encryptedMessages?: boolean;
      fileSharing?: boolean;
      maxFileSize?: number;
    };
    notifications?: {
      enabled: boolean;
      push?: {
        enabled: boolean;
        platforms?: string[];
        vapidPublicKey?: string;
      };
      inApp?: {
        enabled: boolean;
        maxNotifications?: number;
        retentionDays?: number;
      };
      sound?: {
        enabled: boolean;
        defaultSound?: string;
        customSounds?: Array<{
          id: string;
          url: string;
        }>;
      }
    };
    social?: {
      enabled: boolean;
      platforms?: string[];
      inviteTracking?: boolean;
      linkShortener?: boolean;
      qrCodes?: boolean;
      dynamicPreview?: boolean;
    }
  };
}

// MCP Response Type
export interface MCPResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: Record<string, any>;
}

// MCP Group Types
export interface MCPGroup {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  created_at: string;
  created_by: string;
  is_private: boolean;
  member_count: number;
  members?: MCPGroupMember[];
}

export interface MCPGroupMember {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'member';
  joined_at: string;
  user: {
    username: string;
    avatar_url?: string;
    online?: boolean;
  };
}

// MCP Message Types
export interface MCPMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: {
    username: string;
    avatar_url?: string;
  };
  attachments?: MCPAttachment[];
}

export interface MCPAttachment {
  type: 'image' | 'file' | 'audio' | 'video';
  url: string;
  name?: string;
  size?: number;
  mime_type?: string;
}

// MCP Notification Types
export interface MCPNotification {
  id: string;
  type: 'invite' | 'message' | 'group_join' | 'mention' | 'system';
  title: string;
  description: string;
  created_at: string;
  read: boolean;
  image_url?: string;
  action_url?: string;
  sender_id?: string;
  sender?: {
    username: string;
    avatar_url?: string;
  }
}

export interface MCPNotificationSettings {
  push_enabled: boolean;
  sound_enabled: boolean;
  selected_sound: string;
  group_notifications: boolean;
  mention_notifications: boolean;
  message_notifications: boolean;
  system_notifications: boolean;
}

// MCP Social Types
export interface MCPSocialPlatform {
  id: string;
  name: string;
  color: string;
  endpoint: string;
  shareUrlTemplate: string | null;
}

export interface MCPInvite {
  id: string;
  group_id: string;
  created_by: string;
  invite_code: string;
  created_at: string;
  expires_at: string;
  uses: number;
  max_uses?: number;
  platform?: string;
}
