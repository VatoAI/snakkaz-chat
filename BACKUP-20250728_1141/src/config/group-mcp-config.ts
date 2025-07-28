
/**
 * MCP Configuration for Groups and Social Features
 * 
 * Dette er en konfigurasjonsmodul for å aktivere MCP-integrasjon
 * med gruppefunksjonalitet og sosiale plattformer.
 */

import { MCPClientConfig } from '@/types/mcp';

// MCP Endepunkter for gruppefunksjonalitet
const GROUP_MCP_ENDPOINTS = {
  // Gruppe CRUD operasjoner
  CREATE_GROUP: '/api/mcp/groups/create',
  GET_GROUP: '/api/mcp/groups/:id',
  UPDATE_GROUP: '/api/mcp/groups/:id/update',
  DELETE_GROUP: '/api/mcp/groups/:id/delete',
  
  // Gruppemeldinger
  SEND_GROUP_MESSAGE: '/api/mcp/groups/:id/messages/send',
  GET_GROUP_MESSAGES: '/api/mcp/groups/:id/messages',
  DELETE_GROUP_MESSAGE: '/api/mcp/groups/:id/messages/:messageId/delete',
  
  // Gruppemedlemskap
  ADD_MEMBER: '/api/mcp/groups/:id/members/add',
  REMOVE_MEMBER: '/api/mcp/groups/:id/members/remove',
  UPDATE_MEMBER_ROLE: '/api/mcp/groups/:id/members/:userId/update-role',
  
  // Invitasjon
  CREATE_INVITE: '/api/mcp/groups/:id/invites/create',
  GET_INVITES: '/api/mcp/groups/:id/invites',
  ACCEPT_INVITE: '/api/mcp/groups/invites/:token/accept',
  REJECT_INVITE: '/api/mcp/groups/invites/:token/reject',
  
  // Sosiale plattformer integrasjon
  SHARE_TO_TELEGRAM: '/api/mcp/social/telegram/share',
  SHARE_TO_FACEBOOK: '/api/mcp/social/facebook/share',
  SHARE_TO_INSTAGRAM: '/api/mcp/social/instagram/share',
  SHARE_TO_SNAPCHAT: '/api/mcp/social/snapchat/share',
  SHARE_TO_TIKTOK: '/api/mcp/social/tiktok/share',
  
  // Notifikasjoner
  REGISTER_PUSH: '/api/mcp/notifications/register',
  UNREGISTER_PUSH: '/api/mcp/notifications/unregister',
  GET_NOTIFICATION_SETTINGS: '/api/mcp/notifications/settings',
  UPDATE_NOTIFICATION_SETTINGS: '/api/mcp/notifications/settings/update'
};

// Sosiale plattformer støttet av MCP
export const SUPPORTED_SOCIAL_PLATFORMS = [
  { 
    id: 'telegram', 
    name: 'Telegram',
    color: '#0088cc',
    endpoint: GROUP_MCP_ENDPOINTS.SHARE_TO_TELEGRAM,
    shareUrlTemplate: 'https://t.me/share/url?url={url}&text={text}'
  },
  { 
    id: 'facebook', 
    name: 'Facebook',
    color: '#1877F2',
    endpoint: GROUP_MCP_ENDPOINTS.SHARE_TO_FACEBOOK,
    shareUrlTemplate: 'https://www.facebook.com/sharer/sharer.php?u={url}&quote={text}'
  },
  { 
    id: 'instagram', 
    name: 'Instagram',
    color: '#C13584',
    endpoint: GROUP_MCP_ENDPOINTS.SHARE_TO_INSTAGRAM,
    shareUrlTemplate: null // Instagram støtter ikke direkte deling via URL
  },
  { 
    id: 'snapchat', 
    name: 'Snapchat',
    color: '#FFFC00',
    endpoint: GROUP_MCP_ENDPOINTS.SHARE_TO_SNAPCHAT,
    shareUrlTemplate: 'https://www.snapchat.com/scan?attachmentUrl={url}'
  },
  { 
    id: 'tiktok', 
    name: 'TikTok',
    color: '#000000',
    endpoint: GROUP_MCP_ENDPOINTS.SHARE_TO_TIKTOK,
    shareUrlTemplate: null // TikTok støtter ikke direkte deling via URL
  }
];

// MCP Konfigurasjon for gruppefunksjonalitet
export const GROUP_MCP_CONFIG: MCPClientConfig = {
  baseUrl: import.meta.env.VITE_MCP_SERVER_URL || 'https://group-mcp-premium.snakkaz.no',
  endpoints: GROUP_MCP_ENDPOINTS,
  features: {
    groups: {
      enabled: true,
      maxGroupsPerUser: 100,
      maxMembersPerGroup: 250,
      allowPublicGroups: true,
      allowPrivateGroups: true,
      securityLevels: ['standard', 'enhanced', 'premium'],
      encryptedMessages: true,
      fileSharing: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB
    },
    notifications: {
      enabled: true,
      push: {
        enabled: true,
        platforms: ['web', 'android', 'ios'],
        vapidPublicKey: process.env.VAPID_PUBLIC_KEY || '',
      },
      inApp: {
        enabled: true,
        maxNotifications: 100,
        retentionDays: 30
      },
      sound: {
        enabled: true,
        defaultSound: '/sounds/notification.mp3',
        customSounds: [
          { id: 'message', url: '/sounds/message.mp3' },
          { id: 'invite', url: '/sounds/invite.mp3' },
          { id: 'mention', url: '/sounds/mention.mp3' }
        ]
      }
    },
    social: {
      enabled: true,
      platforms: SUPPORTED_SOCIAL_PLATFORMS.map(p => p.id),
      inviteTracking: true,
      linkShortener: true,
      qrCodes: true,
      dynamicPreview: true
    }
  }
};

// Helper funksjon for å generere delingskoblinger
export const generateSocialShareUrl = (
  platform: string, 
  url: string, 
  text: string
): string | null => {
  const platformConfig = SUPPORTED_SOCIAL_PLATFORMS.find(p => p.id === platform);
  
  if (!platformConfig || !platformConfig.shareUrlTemplate) {
    return null;
  }
  
  return platformConfig.shareUrlTemplate
    .replace('{url}', encodeURIComponent(url))
    .replace('{text}', encodeURIComponent(text));
};

// Helper funksjon for å sjekke om MCP-gruppefunksjonalitet er aktivert
export const isGroupMCPEnabled = (): boolean => {
  return GROUP_MCP_CONFIG.features.groups.enabled;
};

// Helper funksjon for å sjekke om MCP-notifikasjonsfunksjonalitet er aktivert
export const isNotificationMCPEnabled = (): boolean => {
  return GROUP_MCP_CONFIG.features.notifications.enabled;
};

// Helper funksjon for å sjekke om MCP-sosiale plattformer integrasjon er aktivert
export const isSocialMCPEnabled = (): boolean => {
  return GROUP_MCP_CONFIG.features.social.enabled;
};

export default GROUP_MCP_CONFIG;
