// SnakkaZ Remote AI Service - Kobler til VPS AI server
import {
  OllamaModelResponse,
  OllamaChatResponse,
  AIDiagnostics,
  AIContextType,
  NorvegianHelpers,
  ChatOptions,
} from "./types";

interface RemoteAIConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

class SnakkaZRemoteAIService {
  private config: RemoteAIConfig;
  private isOnline: boolean = false;

  constructor() {
    this.config = {
      baseUrl: import.meta.env.VITE_AI_SERVER_URL || "https://ai.snakkaz.com",
      timeout: 30000, // 30 seconds for AI responses
      retries: 3,
    };

    this.checkConnection();
  }

  /**
   * Check if remote AI server is available
   */
  async checkConnection(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.config.baseUrl}/api/health`, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      this.isOnline = response.ok;
      return this.isOnline;
    } catch (error) {
      console.warn("🤖 Remote AI server offline:", error);
      this.isOnline = false;
      return false;
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): { online: boolean; serverUrl: string } {
    return {
      online: this.isOnline,
      serverUrl: this.config.baseUrl,
    };
  }

  /**
   * Norwegian AI chat with retry logic
   */
  async chatNorwegian(
    message: string,
    options: {
      model?: string;
      temperature?: number;
      context?: string;
    } = {}
  ): Promise<OllamaChatResponse> {
    if (!this.isOnline) {
      await this.checkConnection();
      if (!this.isOnline) {
        throw new Error("AI server er ikke tilgjengelig. Prøv igjen senere.");
      }
    }

    const chatPayload = {
      message,
      model: options.model || "llama3.2:3b",
      context: options.context,
    };

    return this.makeRequest("/api/chat/norwegian", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chatPayload),
    });
  }

  /**
   * Generate code using remote AI
   */
  async generateCode(
    prompt: string,
    language: string = "typescript",
    model: string = "codellama:7b"
  ): Promise<{ code: string; language: string; timestamp: string }> {
    if (!this.isOnline) {
      await this.checkConnection();
      if (!this.isOnline) {
        throw new Error("AI code generation ikke tilgjengelig.");
      }
    }

    return this.makeRequest("/api/code/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        language,
        model,
      }),
    });
  }

  /**
   * Get available AI models from remote server
   */
  async getAvailableModels(): Promise<OllamaModelResponse> {
    if (!this.isOnline) {
      await this.checkConnection();
      if (!this.isOnline) {
        throw new Error("Kan ikke hente AI modeller.");
      }
    }

    return this.makeRequest("/api/models");
  }

  /**
   * Norwegian helpers - common phrases and responses
   */
  getNorimgeHelpers(): NorvegianHelpers {
    return {
      greetings: [
        "Hei! Hvordan kan jeg hjelpe deg?",
        "God morgen! Hva kan jeg gjøre for deg?",
        "Hallo! Hyggelig å høre fra deg!",
        "Hei der! Hvordan har du det?",
      ],

      confirmations: [
        "Jeg forstår!",
        "Det høres bra ut!",
        "Selvfølgelig!",
        "Absolutt!",
      ],

      helpOffers: [
        "Kan jeg hjelpe deg med noe mer?",
        "Er det noe annet du trenger hjelp til?",
        "Har du flere spørsmål?",
        "Trenger du mer informasjon om noe?",
      ],

      technical: [
        "La meg sjekke det for deg...",
        "Jeg analyserer problemet...",
        "Gir meg et øyeblikk til å finne løsningen...",
        "Jeg jobber med det nå...",
      ],
    };
  }

  /**
   * Smart response generation for Norwegian context
   */
  async generateSmartResponse(
    userMessage: string,
    context: AIContextType = "casual"
  ): Promise<string> {
    const helpers = this.getNorimgeHelpers();

    // Quick responses for common patterns
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("hei") || lowerMessage.includes("hallo")) {
      const greeting =
        helpers.greetings[Math.floor(Math.random() * helpers.greetings.length)];
      return greeting;
    }

    if (lowerMessage.includes("takk") || lowerMessage.includes("tusen takk")) {
      return "Bare hyggelig! Glad jeg kunne hjelpe! 😊";
    }

    // For complex queries, use remote AI
    try {
      const systemContext = this.buildSystemContext(context);
      const response = await this.chatNorwegian(userMessage, {
        context: systemContext,
      });

      return (
        response.response ||
        "Beklager, jeg kunne ikke forstå det. Kan du prøve å formulere spørsmålet ditt på en annen måte?"
      );
    } catch (error) {
      console.error("Smart response error:", error);
      return "Beklager, jeg har tekniske problemer akkurat nå. Prøv igjen om litt! 🤖";
    }
  }

  /**
   * Build system context for different conversation types
   */
  private buildSystemContext(context: string): string {
    const baseContext = `Du er SnakkaZ AI, en vennlig norsk chat-assistent som hjelper brukere med SnakkaZ chat-appen.`;

    switch (context) {
      case "greeting":
        return `${baseContext} Brukeren hilser på deg, vær varm og imøtekommende.`;

      case "help":
        return `${baseContext} Brukeren trenger hjelp. Vær tydelig og hjelpsom i forklaringene dine.`;

      case "technical":
        return `${baseContext} Dette er et teknisk spørsmål. Gi presise og nyttige svar.`;

      default:
        return `${baseContext} Ha en naturlig, vennlig samtale på norsk.`;
    }
  }

  /**
   * Generic HTTP request with retry logic
   */
  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          this.config.timeout
        );

        const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error as Error;
        console.warn(`🤖 AI request attempt ${attempt + 1} failed:`, error);

        if (attempt < this.config.retries - 1) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(
      `AI server utilgjengelig etter ${this.config.retries} forsøk: ${lastError?.message}`
    );
  }

  /**
   * Test connection and models
   */
  async runDiagnostics(): Promise<AIDiagnostics> {
    const startTime = Date.now();

    try {
      // Test connection
      const connected = await this.checkConnection();
      if (!connected) {
        return {
          connection: false,
          models: [],
          latency: Date.now() - startTime,
          error: "Kan ikke koble til AI server",
        };
      }

      // Test models
      const modelsResponse = await this.getAvailableModels();
      const modelNames = modelsResponse.models?.map((m) => m.name) || [];

      // Test chat
      await this.chatNorwegian("test", { model: "llama3.2:3b" });

      return {
        connection: true,
        models: modelNames,
        latency: Date.now() - startTime,
      };
    } catch (error) {
      return {
        connection: false,
        models: [],
        latency: Date.now() - startTime,
        error: (error as Error).message,
      };
    }
  }
}

// Export singleton instance
export const snakkaZRemoteAI = new SnakkaZRemoteAIService();
export default snakkaZRemoteAI;
