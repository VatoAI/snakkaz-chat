// src/config/mcp.ts - SnakkaZ MCP Integration Config
export const MCP_CONFIG = {
  SERVER_URL: 'https://mcp.snakkaz.com',
  PRODUCTION_URL: 'https://api.snakkaz.com/mcp',
  ENABLED: true,
  ENDPOINTS: {
    HEALTH: '/health',
    TOOLS: '/api/tools',
    CHAT: '/api/chat',
    RELAY: '/api/relay',
    STATS: '/api/stats',
    DASHBOARD: '/dashboard',
    NOTIFICATIONS: '/api/notifications',
    INVITE: '/api/invite',
    SOCIAL: {
      TELEGRAM: '/api/social/telegram',
      WHATSAPP: '/api/social/whatsapp',
      FACEBOOK: '/api/social/facebook',
      INSTAGRAM: '/api/social/instagram',
      TIKTOK: '/api/social/tiktok',
      SNAPCHAT: '/api/social/snapchat',
      EMAIL: '/api/social/email'
    }
  },
  FEATURES: {
    CHAT_ASSISTANT: true,
    IMAGE_GENERATION: true,
    VOICE_CHAT: true,
    CONTENT_MODERATION: true,
    LANGUAGE_TRANSLATION: true,
    SOCIAL_INTEGRATION: true,
    MOBILE_NOTIFICATIONS: true,
    PUSH_NOTIFICATIONS: true,
    SOCIAL_SHARING: true
  },
  UI: {
    SHOW_MCP_STATUS: true,
    MOBILE_OPTIMIZED: true,
    GLASS_LIQUID_THEME: true,
    NOTIFICATION_SOUNDS: true
  },
  TIMEOUT: 8000,
  RETRY_ATTEMPTS: 3,
  FALLBACK_DELAY: 2000 // Wait 2s before MCP fallback
};

/**
 * Check if MCP is available on this system
 */
export function isMCPAvailable(): boolean {
  return MCP_CONFIG.ENABLED;
}

/**
 * Gets the appropriate MCP server URL based on environment
 */
export function getMCPServerUrl(): string {
  // Use production URL if we're on production domain
  if (window.location.hostname === 'snakkaz.com' || 
      window.location.hostname === 'www.snakkaz.com') {
    return MCP_CONFIG.PRODUCTION_URL;
  }
  
  // Default to development/test URL
  return MCP_CONFIG.SERVER_URL;
}

export class MCPClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getMCPServerUrl();
  }

  /**
   * Test MCP server connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}${MCP_CONFIG.ENDPOINTS.HEALTH}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(MCP_CONFIG.TIMEOUT)
      });
      
      const data = await response.json();
      console.log('✅ MCP Server Health:', data);
      return data.status === 'healthy';
    } catch (error) {
      console.log('❌ MCP Connection Failed:', error);
      return false;
    }
  }

  /**
   * Send message via MCP fallback
   */
  async sendMessage(message: string, userId: string, encrypted?: boolean): Promise<any> {
    try {
      const payload = {
        message: encrypted ? message : message, // Already encrypted or plain
        userId,
        timestamp: Date.now(),
        via: 'mcp_fallback',
        encrypted: !!encrypted
      };

      const response = await fetch(`${this.baseUrl}${MCP_CONFIG.ENDPOINTS.CHAT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(MCP_CONFIG.TIMEOUT)
      });

      const result = await response.json();
      console.log('✅ Message sent via MCP:', result);
      return result;
    } catch (error) {
      console.error('❌ MCP send failed:', error);
      throw error;
    }
  }
  
  /**
   * Send notification via MCP
   */
  async sendNotification(userId: string, title: string, message: string, type: string): Promise<any> {
    try {
      const payload = {
        userId,
        title,
        message,
        type,
        timestamp: Date.now()
      };

      const response = await fetch(`${this.baseUrl}${MCP_CONFIG.ENDPOINTS.NOTIFICATIONS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(MCP_CONFIG.TIMEOUT)
      });

      return await response.json();
    } catch (error) {
      console.error('Failed to send notification via MCP:', error);
      return null;
    }
  }
  
  /**
   * Share invite via social media
   */
  async shareInvite(platform: string, inviteData: any): Promise<any> {
    try {
      const endpoint = (MCP_CONFIG.ENDPOINTS.SOCIAL as any)[platform.toUpperCase()];
      
      if (!endpoint) {
        throw new Error(`Unsupported platform: ${platform}`);
      }
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteData),
        signal: AbortSignal.timeout(MCP_CONFIG.TIMEOUT)
      });

      return await response.json();
    } catch (error) {
      console.error(`Failed to share invite via ${platform}:`, error);
      return null;
    }
  }

  /**
   * Get server statistics
   */
  async getStats(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}${MCP_CONFIG.ENDPOINTS.STATS}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get MCP stats:', error);
      return null;
    }
  }

  /**
   * Get available MCP tools
   */
  async getTools(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}${MCP_CONFIG.ENDPOINTS.TOOLS}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get MCP tools:', error);
      return null;
    }
  }
}
