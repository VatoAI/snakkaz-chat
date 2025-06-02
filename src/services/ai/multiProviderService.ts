import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

// AI Provider Types
export type AIProvider = 'anthropic' | 'openai' | 'azure';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  provider: AIProvider;
  model: string;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  cost: {
    usd: number;
    nok: number;
  };
}

export interface AIConfig {
  provider: AIProvider;
  model: string;
  maxTokens: number;
  temperature: number;
}

// AI Service Factory
class AIServiceFactory {
  private anthropic: Anthropic | null = null;
  private openai: OpenAI | null = null;
  
  constructor() {
    this.initializeClients();
  }
  
  private initializeClients() {
    // Initialize Anthropic
    if (import.meta.env.VITE_ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
        dangerouslyAllowBrowser: true // Note: For production, use server-side proxy
      });
    }
    
    // Initialize OpenAI
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true // Note: For production, use server-side proxy
      });
    }
  }
  
  async generateResponse(
    messages: AIMessage[], 
    config: AIConfig
  ): Promise<AIResponse> {
    switch (config.provider) {
      case 'anthropic':
        return this.callAnthropic(messages, config);
      case 'openai':
        return this.callOpenAI(messages, config);
      default:
        throw new Error(`Unsupported AI provider: ${config.provider}`);
    }
  }
  
  private async callAnthropic(
    messages: AIMessage[], 
    config: AIConfig
  ): Promise<AIResponse> {
    if (!this.anthropic) {
      throw new Error('Anthropic client not initialized');
    }
    
    try {
      // Separate system message from conversation
      const systemMessage = messages.find(m => m.role === 'system');
      const conversationMessages = messages.filter(m => m.role !== 'system');
      
      const response = await this.anthropic.messages.create({
        model: config.model,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        system: systemMessage?.content || 'Du er en hjelpsom AI-assistent for Snakkaz Chat.',
        messages: conversationMessages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
      });
      
      const content = response.content[0]?.type === 'text' 
        ? response.content[0].text 
        : 'Kunne ikke generere svar.';
      
      const tokens = {
        prompt: response.usage?.input_tokens || 0,
        completion: response.usage?.output_tokens || 0,
        total: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)
      };
      
      return {
        content,
        provider: 'anthropic',
        model: config.model,
        tokens,
        cost: this.calculateAnthropicCost(tokens, config.model)
      };
      
    } catch (error) {
      console.error('Anthropic API Error:', error);
      throw new Error('Claude AI-tjenesten er midlertidig utilgjengelig.');
    }
  }
  
  private async callOpenAI(
    messages: AIMessage[], 
    config: AIConfig
  ): Promise<AIResponse> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }
    
    try {
      const response = await this.openai.chat.completions.create({
        model: config.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: config.maxTokens,
        temperature: config.temperature
      });
      
      const content = response.choices[0]?.message?.content || 'Kunne ikke generere svar.';
      
      const tokens = {
        prompt: response.usage?.prompt_tokens || 0,
        completion: response.usage?.completion_tokens || 0,
        total: response.usage?.total_tokens || 0
      };
      
      return {
        content,
        provider: 'openai',
        model: config.model,
        tokens,
        cost: this.calculateOpenAICost(tokens, config.model)
      };
      
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('OpenAI-tjenesten er midlertidig utilgjengelig.');
    }
  }
  
  private calculateAnthropicCost(tokens: any, model: string): { usd: number; nok: number } {
    const USD_TO_NOK = 10.8;
    let costUSD = 0;
    
    // Anthropic pricing (June 2025)
    switch (model) {
      case 'claude-3-5-sonnet-20241022':
        costUSD = (tokens.prompt * 0.000003) + (tokens.completion * 0.000015);
        break;
      case 'claude-3-haiku-20240307':
        costUSD = (tokens.prompt * 0.00000025) + (tokens.completion * 0.00000125);
        break;
      case 'claude-3-opus-20240229':
        costUSD = (tokens.prompt * 0.000015) + (tokens.completion * 0.000075);
        break;
      default:
        costUSD = (tokens.prompt * 0.000003) + (tokens.completion * 0.000015);
    }
    
    return {
      usd: costUSD,
      nok: costUSD * USD_TO_NOK
    };
  }
  
  private calculateOpenAICost(tokens: any, model: string): { usd: number; nok: number } {
    const USD_TO_NOK = 10.8;
    let costUSD = 0;
    
    // OpenAI pricing (June 2025)
    switch (model) {
      case 'gpt-4o':
        costUSD = (tokens.prompt * 0.000005) + (tokens.completion * 0.000015);
        break;
      case 'gpt-4o-mini':
        costUSD = (tokens.prompt * 0.00000015) + (tokens.completion * 0.0000006);
        break;
      case 'gpt-4-turbo':
        costUSD = (tokens.prompt * 0.00001) + (tokens.completion * 0.00003);
        break;
      default:
        costUSD = (tokens.prompt * 0.00000015) + (tokens.completion * 0.0000006);
    }
    
    return {
      usd: costUSD,
      nok: costUSD * USD_TO_NOK
    };
  }
  
  getAvailableModels(provider: AIProvider): Array<{
    id: string;
    name: string;
    description: string;
    costPerMessage: string;
    premium: boolean;
  }> {
    switch (provider) {
      case 'anthropic':
        return [
          {
            id: 'claude-3-haiku-20240307',
            name: 'Claude 3 Haiku',
            description: 'Rask og rimelig for enkle oppgaver',
            costPerMessage: '~0.01 NOK',
            premium: false
          },
          {
            id: 'claude-3-5-sonnet-20241022',
            name: 'Claude 3.5 Sonnet',
            description: 'Balansert ytelse og kvalitet',
            costPerMessage: '~0.15 NOK',
            premium: true
          },
          {
            id: 'claude-3-opus-20240229',
            name: 'Claude 3 Opus',
            description: 'Høyeste kvalitet for komplekse oppgaver',
            costPerMessage: '~0.40 NOK',
            premium: true
          }
        ];
      case 'openai':
        return [
          {
            id: 'gpt-4o-mini',
            name: 'GPT-4o Mini',
            description: 'Rask og rimelig',
            costPerMessage: '~0.02 NOK',
            premium: false
          },
          {
            id: 'gpt-4o',
            name: 'GPT-4o',
            description: 'Avansert multimodal AI',
            costPerMessage: '~0.15 NOK',
            premium: true
          },
          {
            id: 'gpt-4-turbo',
            name: 'GPT-4 Turbo',
            description: 'Kraftig for komplekse oppgaver',
            costPerMessage: '~0.30 NOK',
            premium: true
          }
        ];
      default:
        return [];
    }
  }
}

// Export singleton instance
export const aiService = new AIServiceFactory();

// Helper functions for common AI operations
export const createSystemMessage = (content: string): AIMessage => ({
  role: 'system',
  content
});

export const createUserMessage = (content: string): AIMessage => ({
  role: 'user',
  content
});

export const createAssistantMessage = (content: string): AIMessage => ({
  role: 'assistant',
  content
});

// Predefined system prompts for Snakkaz
export const SnakkazSystemPrompts = {
  general: `Du er en hjelpsom AI-assistent for Snakkaz Chat-appen. 
Du hjelper brukere med å bygge forbindelser, finne venner, og navigere sosiale funksjoner.
Svar alltid på norsk med mindre brukeren spesifikt ber om et annet språk.
Vær vennlig, inkluderende og fokusert på å bygge positive sosiale opplevelser.`,

  support: `Du er en kundeservice-assistent for Snakkaz Chat.
Du kan hjelpe med tekniske problemer, kontoadministrasjon, og funksjonsforklaringer.
Vær profesjonell, løsningsorientert og empatisk.
Hvis du ikke kan løse et problem, gi klare instruksjoner for hvordan brukeren kan få videre hjelp.`,

  translation: `Du er en oversettelsesassistent for Snakkaz Chat.
Du kan oversette meldinger mellom forskjellige språk og forklare kulturelle nyanser.
Gi nøyaktige oversettelser og forklar eventuelle kulturelle forskjeller eller idiomer.`,

  creative: `Du er en kreativ assistent for Snakkaz Chat.
Du kan hjelpe med å skrive meldinger, lage innhold, og gi kreative forslag.
Vær inspirerende, positiv og hjelpsom med språklig kreativitet.`
};
