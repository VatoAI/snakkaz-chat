// MCP API integration for SnakkaZ
interface MCPResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Chat functionality
export class MCPChatService {
  private baseUrl =
    import.meta.env.VITE_MCP_API_URL || "https://api.mcp.snakkaz.com";
  private apiKey = import.meta.env.VITE_MCP_API_KEY;

  async sendMessage(
    message: string,
    roomId: string,
    userId: string
  ): Promise<MCPResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ message, roomId, userId }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  }

  async getMessages(roomId: string, limit = 50): Promise<MCPResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/chat/messages/${roomId}?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );
      return await response.json();
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  }

  async createRoom(
    name: string,
    userId: string,
    isPrivate = false
  ): Promise<MCPResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ name, userId, isPrivate }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  }
}

// Analytics tracking for revenue optimization
export class MCPAnalyticsService {
  private baseUrl =
    import.meta.env.VITE_MCP_API_URL || "https://api.mcp.snakkaz.com";
  private apiKey = import.meta.env.VITE_MCP_API_KEY;

  async trackEvent(
    event: string,
    properties: Record<string, any>
  ): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/analytics/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ event, properties, timestamp: Date.now() }),
      });
    } catch (error) {
      console.error("Analytics tracking failed:", error);
    }
  }

  async trackConversion(
    type: "signup" | "subscription" | "upgrade",
    value: number,
    userId: string
  ): Promise<void> {
    await this.trackEvent("conversion", { type, value, userId });
  }

  async trackRevenue(
    amount: number,
    currency: string,
    userId: string,
    plan: string
  ): Promise<void> {
    await this.trackEvent("revenue", { amount, currency, userId, plan });
  }
}

// File upload service
export class MCPFileService {
  private baseUrl =
    import.meta.env.VITE_MCP_API_URL || "https://api.mcp.snakkaz.com";
  private apiKey = import.meta.env.VITE_MCP_API_KEY;

  async uploadFile(
    file: File,
    userId: string
  ): Promise<MCPResponse<{ url: string }>> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);

      const response = await fetch(`${this.baseUrl}/files/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: "Upload failed" };
    }
  }
}

// Translation service for Norwegian localization
export class MCPTranslationService {
  private baseUrl =
    import.meta.env.VITE_MCP_API_URL || "https://api.mcp.snakkaz.com";
  private apiKey = import.meta.env.VITE_MCP_API_KEY;

  async translateText(
    text: string,
    targetLang: string
  ): Promise<MCPResponse<{ translatedText: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ text, targetLang }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: "Translation failed" };
    }
  }
}

// AI assistant integration
export class MCPAssistantService {
  private baseUrl =
    import.meta.env.VITE_MCP_API_URL || "https://api.mcp.snakkaz.com";
  private apiKey = import.meta.env.VITE_MCP_API_KEY;

  async askAssistant(
    question: string,
    context?: string
  ): Promise<MCPResponse<{ answer: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/assistant/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ question, context }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: "Assistant unavailable" };
    }
  }
}

// Export service instances
export const mcpChat = new MCPChatService();
export const mcpAnalytics = new MCPAnalyticsService();
export const mcpFiles = new MCPFileService();
export const mcpTranslation = new MCPTranslationService();
export const mcpAssistant = new MCPAssistantService();
