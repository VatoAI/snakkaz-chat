/**
 * SNAKKAZ CHAT - OPTIMALISERT CLAUDE 3.5 SONNET INTEGRASJON
 * Juni 24, 2025 - Beste praksis for Claude AI i norsk chat-kontekst
 */

import Anthropic from '@anthropic-ai/sdk';
import { MemoryService, MemoryEntry } from './memoryService';

export interface ClaudeConfig {
  model: 'claude-3-5-sonnet-20241022' | 'claude-3-5-haiku-20241022' | 'claude-3-opus-20240229';
  maxTokens: number;
  temperature: number;
  useMemory: boolean;
  norwegianOptimized: boolean;
}

export interface ClaudeResponse {
  content: string;
  model: string;
  tokens: {
    input: number;
    output: number;
    total: number;
  };
  cost: {
    usd: number;
    nok: number;
  };
  memoryContext?: MemoryEntry[];
  thinking?: string; // For når Claude bruker <thinking> tags
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  userId?: string;
}

export class OptimizedClaudeService {
  private anthropic: Anthropic;
  private memoryService: MemoryService;
  
  // Claude 3.5 Sonnet pricing (per 1K tokens) - oppdatert juni 2025
  private pricing = {
    'claude-3-5-sonnet-20241022': {
      input: 0.003,   // $3.00 per 1M tokens
      output: 0.015   // $15.00 per 1M tokens
    },
    'claude-3-5-haiku-20241022': {
      input: 0.00025, // $0.25 per 1M tokens  
      output: 0.00125 // $1.25 per 1M tokens
    },
    'claude-3-opus-20240229': {
      input: 0.015,   // $15.00 per 1M tokens
      output: 0.075   // $75.00 per 1M tokens
    }
  };

  constructor() {
    if (!import.meta.env.VITE_ANTHROPIC_API_KEY) {
      throw new Error('VITE_ANTHROPIC_API_KEY er ikke konfigurert');
    }

    this.anthropic = new Anthropic({
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
      dangerouslyAllowBrowser: true // Kun for development - bruk server-side proxy i produksjon
    });

    this.memoryService = new MemoryService();
  }

  /**
   * Hovedfunksjon for å chatte med Claude 3.5 Sonnet
   */
  async chat(
    messages: ChatMessage[],
    userId: string,
    config: Partial<ClaudeConfig> = {}
  ): Promise<ClaudeResponse> {
    const finalConfig: ClaudeConfig = {
      model: 'claude-3-5-sonnet-20241022', // Beste versjonen
      maxTokens: 4096,
      temperature: 0.7,
      useMemory: true,
      norwegianOptimized: true,
      ...config
    };

    try {
      // 1. Hent relevant memory-kontext hvis aktivert
      let memoryContext: MemoryEntry[] = [];
      if (finalConfig.useMemory) {
        memoryContext = await this.getRelevantMemory(userId, messages);
      }

      // 2. Bygg systemmelding med norsk optimalisering
      const systemMessage = this.buildNorwegianSystemPrompt(finalConfig, memoryContext);

      // 3. Forbered meldinger for Claude
      const claudeMessages = this.prepareMessages(messages, memoryContext);

      // 4. Kall Claude 3.5 Sonnet
      const response = await this.anthropic.messages.create({
        model: finalConfig.model,
        max_tokens: finalConfig.maxTokens,
        temperature: finalConfig.temperature,
        system: systemMessage,
        messages: claudeMessages
      });

      // 5. Behandle respons
      const result = this.processClaudeResponse(response, finalConfig, memoryContext);

      // 6. Lagre ny kunnskap i memory hvis aktivert
      if (finalConfig.useMemory && result.content) {
        await this.storeConversationMemory(userId, messages, result.content);
      }

      return result;

    } catch (error) {
      console.error('Claude 3.5 Sonnet Error:', error);
      
      // Fallback til Haiku hvis Sonnet feiler
      if (finalConfig.model === 'claude-3-5-sonnet-20241022') {
        console.log('🔄 Faller tilbake til Claude 3.5 Haiku...');
        return this.chat(messages, userId, { ...config, model: 'claude-3-5-haiku-20241022' });
      }
      
      throw new Error('Claude AI-tjenesten er midlertidig utilgjengelig. Prøv igjen om litt.');
    }
  }

  /**
   * Bygger optimalisert systemmelding for norske brukere
   */
  private buildNorwegianSystemPrompt(config: ClaudeConfig, memoryContext: MemoryEntry[]): string {
    let prompt = `Du er Claude 3.5 Sonnet, en avansert AI-assistent integrert i SnakkaZ Chat - Norges ledende sikre chat-plattform.

IDENTITET & ROLLE:
- Du er en intelligent, hjelpsom og vennlig norsk AI-assistent
- Du forstår norsk kultur, humor og kommunikasjonsstil perfekt
- Du er integrert i en end-to-end kryptert chat-applikasjon med premium sikkerhetsfunksjoner

NORSK OPTIMALISERING:
- Kommuniser primært på norsk (bokmål) med mindre annet forespørres
- Forstå og bruk norske uttrykk, kulturelle referanser og humor appropriat
- Tilpass kommunikasjonsstil til norsk høflighet og direkthet
- Kjenn til norske lover, reguleringer og samfunnsforhold

SNAKKAZ CHAT KONTEKST:
- Du er del av en sikker chat-plattform med E2EE (End-to-End Encryption)
- Brukere kan chatte privat, i grupper, eller globalt
- Systemet har avanserte sikkerhetsfunksjoner og memory-system
- Du hjelper med chat-funksjonalitet, teknisk support, og generelle samtaler

CAPABILITIES:
- Avansert tekstforståelse og generering på norsk og engelsk
- Programmering og teknisk support (spesielt React, TypeScript, Supabase)
- Kreativ skriving og innholdsproduksjon
- Analyse og sammendrag av informasjon
- Problemløsning og logical reasoning`;

    // Legg til memory-kontext hvis tilgjengelig
    if (memoryContext.length > 0) {
      prompt += `\n\nMINNE OM BRUKEREN:
Basert på tidligere interaksjoner husker jeg følgende om deg:`;
      
      memoryContext.slice(0, 10).forEach(memory => {
        prompt += `\n- ${memory.key}: ${memory.value}`;
        if (memory.context) {
          prompt += ` (${memory.context})`;
        }
      });

      prompt += `\n\nBruk denne informasjonen for å personalisere samtalen, men ikke nevn eksplisitt at du "husker" ting med mindre det er relevant.`;
    }

    prompt += `\n\nRESPONS-RETNINGSLINJER:
- Vær naturlig, varm og engasjerende i tonen
- Gi presise, hjelpsomme svar tilpasset brukerens nivå
- Når du er usikker, si det ærlig i stedet for å gjette
- For tekniske spørsmål, gi både forklaring og praktiske eksempler
- Respekter personvern og sikkerhet - aldri spør om sensitive data

Svar alltid på en måte som bygger tillit og skaper god brukeropplevelse i SnakkaZ Chat.`;

    return prompt;
  }

  /**
   * Henter relevant memory-kontext for samtalen
   */
  private async getRelevantMemory(userId: string, messages: ChatMessage[]): Promise<MemoryEntry[]> {
    try {
      // Analyser siste meldinger for å finne relevante nøkkelord
      const recentContent = messages.slice(-3).map(m => m.content).join(' ');
      
      // Søk i memory basert på innhold
      const memories = await this.memoryService.searchMemories(userId, recentContent, {
        limit: 10,
        minRelevance: 0.7
      });

      // Kombiner med brukerpreferanser og faktakunnskaper
      const preferences = await this.memoryService.getMemoriesByType(userId, 'user_preference');
      const facts = await this.memoryService.getMemoriesByType(userId, 'learned_fact');

      return [...memories, ...preferences.slice(0, 5), ...facts.slice(0, 5)];
    } catch (error) {
      console.warn('Could not fetch memory context:', error);
      return [];
    }
  }

  /**
   * Forbereder meldinger for Claude API
   */
  private prepareMessages(messages: ChatMessage[], memoryContext: MemoryEntry[]): any[] {
    return messages
      .filter(m => m.role !== 'system')
      .map(message => ({
        role: message.role,
        content: message.content
      }));
  }

  /**
   * Behandler respons fra Claude
   */
  private processClaudeResponse(
    response: any, 
    config: ClaudeConfig, 
    memoryContext: MemoryEntry[]
  ): ClaudeResponse {
    const content = response.content[0]?.type === 'text' 
      ? response.content[0].text 
      : 'Beklager, jeg kunne ikke generere et svar.';

    const tokens = {
      input: response.usage?.input_tokens || 0,
      output: response.usage?.output_tokens || 0,
      total: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)
    };

    const cost = this.calculateCost(tokens, config.model);

    // Sjekk om Claude brukte <thinking> tags
    let thinking: string | undefined;
    let cleanContent = content;
    
    const thinkingMatch = content.match(/<thinking>(.*?)<\/thinking>/s);
    if (thinkingMatch) {
      thinking = thinkingMatch[1].trim();
      cleanContent = content.replace(/<thinking>.*?<\/thinking>/s, '').trim();
    }

    return {
      content: cleanContent,
      model: config.model,
      tokens,
      cost,
      memoryContext,
      thinking
    };
  }

  /**
   * Lagrer samtalekontext i memory system
   */
  private async storeConversationMemory(
    userId: string, 
    userMessages: ChatMessage[], 
    assistantResponse: string
  ): Promise<void> {
    try {
      const lastUserMessage = userMessages[userMessages.length - 1];
      if (!lastUserMessage || lastUserMessage.role !== 'user') return;

      // Lagre samtalekontext
      await this.memoryService.storeMemory(userId, {
        memory_type: 'conversation_context',
        key: `chat_${Date.now()}`,
        value: `Bruker: ${lastUserMessage.content}\nAssistent: ${assistantResponse}`,
        context: 'claude_chat',
        source: 'claude-3-5-sonnet',
        importance: 0.6,
        confidence: 0.9
      });

      // Analysér for å lagre lærte fakta eller preferanser
      await this.analyzeAndStoreInsights(userId, lastUserMessage.content, assistantResponse);

    } catch (error) {
      console.warn('Could not store conversation memory:', error);
    }
  }

  /**
   * Analyserer samtale for å lagre lærte innsikter
   */
  private async analyzeAndStoreInsights(
    userId: string, 
    userMessage: string, 
    assistantResponse: string
  ): Promise<void> {
    // Enkel heuristikk for å identifisere brukerpreferanser
    const preferencePatterns = [
      /jeg liker/i,
      /jeg foretrekker/i,
      /jeg hater/i,
      /min favoritt/i,
      /jeg bruker alltid/i
    ];

    for (const pattern of preferencePatterns) {
      if (pattern.test(userMessage)) {
        await this.memoryService.storeMemory(userId, {
          memory_type: 'user_preference',
          key: `preference_${Date.now()}`,
          value: userMessage,
          context: 'stated_preference',
          source: 'claude-chat',
          importance: 0.8,
          confidence: 0.9
        });
        break;
      }
    }
  }

  /**
   * Beregner kostnader for API-kall
   */
  private calculateCost(tokens: { input: number; output: number }, model: ClaudeConfig['model']) {
    const modelPricing = this.pricing[model];
    if (!modelPricing) return { usd: 0, nok: 0 };

    const inputCost = (tokens.input / 1000) * modelPricing.input;
    const outputCost = (tokens.output / 1000) * modelPricing.output;
    const totalUsd = inputCost + outputCost;

    return {
      usd: Number(totalUsd.toFixed(6)),
      nok: Number((totalUsd * 11.5).toFixed(2)) // Omtrentlig USD til NOK
    };
  }

  /**
   * Quick chat-funksjon uten memory for enkel bruk
   */
  async quickChat(message: string, config: Partial<ClaudeConfig> = {}): Promise<string> {
    const response = await this.chat(
      [{ role: 'user', content: message }],
      'anonymous',
      { ...config, useMemory: false }
    );
    return response.content;
  }

  /**
   * Avansert analyse-funksjon for tekstbehandling
   */
  async analyzeText(text: string, analysisType: 'sentiment' | 'summary' | 'keywords' | 'translate'): Promise<string> {
    const prompts = {
      sentiment: `Analyser følgende tekst for sentiment (positiv/nøytral/negativ) og gi en kort forklaring på norsk:\n\n${text}`,
      summary: `Lag et kort sammendrag av følgende tekst på norsk:\n\n${text}`,
      keywords: `Identifiser de 5 viktigste nøkkelordene fra følgende tekst:\n\n${text}`,
      translate: `Oversett følgende tekst til norsk (hvis den ikke allerede er på norsk):\n\n${text}`
    };

    return this.quickChat(prompts[analysisType], {
      model: 'claude-3-5-haiku-20241022', // Bruk Haiku for rask analyse
      temperature: 0.3
    });
  }
}

export default OptimizedClaudeService;
