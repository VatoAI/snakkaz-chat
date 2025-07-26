/**
 * EMERGENCY API FALLBACK UTILITY
 * Graceful fallback when MCP API is not available due to CORS
 */

export class APIFallbackManager {
  private static instance: APIFallbackManager;
  private mcpAvailable: boolean = false;
  private fallbackMode: boolean = false;
  private retryCount: number = 0;
  private maxRetries: number = 3;

  constructor() {
    this.checkMCPAvailability();
  }

  static getInstance(): APIFallbackManager {
    if (!APIFallbackManager.instance) {
      APIFallbackManager.instance = new APIFallbackManager();
    }
    return APIFallbackManager.instance;
  }

  async checkMCPAvailability(): Promise<boolean> {
    try {
      const response = await fetch('https://mcp.snakkaz.com/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        cache: 'no-cache',
      });

      if (response.ok) {
        this.mcpAvailable = true;
        this.fallbackMode = false;
        this.retryCount = 0;
        console.log('✅ MCP API available');
        return true;
      }
    } catch (error) {
      console.log('⚠️ MCP API not available, using fallback:', error);
      this.mcpAvailable = false;
      this.fallbackMode = true;
    }

    return false;
  }

  async fetchWithFallback(endpoint: string, options?: RequestInit): Promise<any> {
    // If we know MCP is not available, return fallback immediately
    if (this.fallbackMode && this.retryCount >= this.maxRetries) {
      return this.getFallbackData(endpoint);
    }

    try {
      const response = await fetch(`https://mcp.snakkaz.com${endpoint}`, {
        ...options,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (response.ok) {
        this.mcpAvailable = true;
        this.fallbackMode = false;
        this.retryCount = 0;
        return await response.json();
      }

      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      console.log(`⚠️ MCP API call failed for ${endpoint}:`, error);
      
      this.retryCount++;
      if (this.retryCount >= this.maxRetries) {
        this.fallbackMode = true;
      }

      return this.getFallbackData(endpoint);
    }
  }

  private getFallbackData(endpoint: string): any {
    console.log(`🔄 Using fallback data for ${endpoint}`);

    switch (endpoint) {
      case '/api/health':
        return {
          status: 'fallback',
          service: 'SnakkaZ Local',
          message: 'MCP connecting...',
          timestamp: new Date().toISOString(),
          fallback: true,
        };

      case '/api/chat':
        return {
          response: 'SnakkaZ Chat is running in local mode. MCP services are connecting...',
          timestamp: new Date().toISOString(),
          fallback: true,
          local: true,
        };

      case '/api/mcp/status':
        return {
          mcp: 'connecting',
          features: ['chat', 'local'],
          health: 'fallback',
          message: 'Establishing connection to MCP services...',
          fallback: true,
        };

      default:
        return {
          error: false,
          message: 'Service temporarily unavailable',
          fallback: true,
          endpoint,
        };
    }
  }

  // Utility method to check if we're in fallback mode
  isFallbackMode(): boolean {
    return this.fallbackMode;
  }

  // Utility method to get MCP availability status
  isMCPAvailable(): boolean {
    return this.mcpAvailable;
  }

  // Method to manually retry MCP connection
  async retryMCPConnection(): Promise<boolean> {
    this.retryCount = 0;
    this.fallbackMode = false;
    return await this.checkMCPAvailability();
  }

  // Get user-friendly status message
  getStatusMessage(): string {
    if (this.mcpAvailable) {
      return '✅ Alle tjenester tilgjengelige';
    } else if (this.fallbackMode) {
      return '🔄 Kobler til MCP-tjenester...';
    } else {
      return '⚡ Starter opp...';
    }
  }
}

// Export singleton instance
export const apiFallback = APIFallbackManager.getInstance();
