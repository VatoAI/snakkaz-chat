// src/config/mcp.ts - SnakkaZ MCP Integration Config
export const MCP_CONFIG = {
  SERVER_URL: 'https://mcp.snakkaz.com',
  ENDPOINTS: {
    HEALTH: '/health',
    TOOLS: '/api/tools',
    CHAT: '/api/chat',
    RELAY: '/api/relay',
    STATS: '/api/stats',
    DASHBOARD: '/dashboard'
  },
  TIMEOUT: 8000,
  RETRY_ATTEMPTS: 3,
  FALLBACK_DELAY: 2000 // Wait 2s before MCP fallback
};

export class MCPClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = MCP_CONFIG.SERVER_URL;
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
