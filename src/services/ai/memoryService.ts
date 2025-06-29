// Snakkaz Chat Memory System - TypeScript Integration
// Kobler Python FastAPI Memory Server med React frontend

import { AIMessage } from '../ai/multiProviderService';

// Memory server configuration
const MEMORY_SERVER_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.snakkaz.com' 
  : 'http://localhost:3001';

export interface MemoryEntry {
  id: number;
  user_id: string;
  memory_type: MemoryType;
  key: string;
  value: string;
  confidence: number;
  importance: number;
  access_count: number;
  created_at: string;
  updated_at: string;
  last_accessed: string;
  context?: string;
  source?: string;
  metadata?: Record<string, any>;
  similarity?: number;
}

export type MemoryType = 
  | 'user_preference'
  | 'conversation_context'
  | 'learned_fact'
  | 'emotional_state'
  | 'task_context'
  | 'user_relationship'
  | 'interaction_pattern';

export interface MemoryCollection {
  id: number;
  user_id: string;
  name: string;
  description: string;
  created_at: string;
  memories: MemoryEntry[];
}

export interface MemoryStats {
  total_memories: number;
  avg_confidence: number;
  avg_importance: number;
  max_access_count: number;
  unique_types: number;
  type_distribution: Array<{
    memory_type: string;
    count: number;
    avg_importance: number;
  }>;
  access_patterns: Array<{
    hour: string;
    access_count: number;
  }>;
}

export interface AdminMemoryOverview {
  total_statistics: {
    total_users: number;
    total_memories: number;
    total_size_bytes: number;
    avg_importance: number;
  };
  top_users: Array<{
    user_id: string;
    total_memories: number;
    total_size_bytes: number;
    last_updated: string;
  }>;
  type_distribution: Array<{
    memory_type: string;
    count: number;
    avg_importance: number;
  }>;
}

export class MemoryService {
  private apiEndpoint: string;

  constructor() {
    this.apiEndpoint = MEMORY_SERVER_URL;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<unknown> {
    try {
      const response = await fetch(`${this.apiEndpoint}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`Memory API error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Memory service error:', error);
      throw error;
    }
  }

  /**
   * Lagre et minne for en bruker
   */
  async storeMemory(
    userId: string,
    memoryType: MemoryType,
    key: string,
    value: string,
    options: {
      confidence?: number;
      metadata?: Record<string, unknown>;
      context?: string;
      source?: string;
      ttlSeconds?: number;
    } = {}
  ): Promise<{ status: string; message: string; id?: number; error?: string }> {
    try {
      const result = await this.makeRequest('/memories', {
        method: 'POST',
        body: JSON.stringify({
          user_id: userId,
          memory_type: memoryType,
          key,
          value,
          confidence: options.confidence || 1.0,
          metadata: options.metadata || {},
          context: options.context,
          source: options.source || 'web-app',
        }),
      });

      return result as { status: string; message: string; id?: number };
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Hent minner for en bruker med semantisk søk
   */
  async retrieveMemories(
    userId: string,
    query?: string,
    options: {
      memoryTypes?: MemoryType[];
      limit?: number;
      similarityThreshold?: number;
    } = {}
  ): Promise<MemoryEntry[]> {
    try {
      const params = new URLSearchParams({
        limit: (options.limit || 10).toString(),
      });
      
      if (options.memoryTypes && options.memoryTypes.length > 0) {
        params.set('memory_type', options.memoryTypes[0]); // Use first type for now
      }

      const result = await this.makeRequest(`/memories/${userId}?${params.toString()}`);
      return result as MemoryEntry[];
    } catch (error) {
      console.error('Error retrieving memories:', error);
      return [];
    }
  }

  /**
   * Slett minner basert på kriterier
   */
  async forgetMemories(
    userId: string,
    criteria: {
      key?: string;
      memoryType?: MemoryType;
      olderThanDays?: number;
    } = {}
  ): Promise<{ status: string; message: string; deleted_count?: number; error?: string }> {
    try {
      if (criteria.key) {
        const result = await this.makeRequest(`/memories/${userId}/${criteria.key}`, {
          method: 'DELETE',
        });
        return {
          status: 'success',
          message: 'Memory deleted',
          deleted_count: 1,
        };
      }
      
      // For now, only single memory deletion is supported
      return {
        status: 'error',
        message: 'Bulk deletion not yet implemented',
        error: 'Only single memory deletion by key is supported'
      };
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Analyser brukerens minnemønstre
   */
  async analyzeMemoryPatterns(
    userId: string,
    timeRangeDays: number = 30
  ): Promise<MemoryStats> {
    try {
      const result = await this.makeRequest(`/stats/${userId}`);
      const stats = result as {
        total_memories: number;
        memory_types: Record<string, number>;
        average_importance: number;
        last_updated: string;
      };
      
      return {
        total_memories: stats.total_memories,
        avg_confidence: 0.8, // Default since we don't have this in simple API
        avg_importance: stats.average_importance,
        max_access_count: 1, // Default since we don't have this in simple API
        unique_types: Object.keys(stats.memory_types).length,
        type_distribution: Object.entries(stats.memory_types).map(([memory_type, count]) => ({
          memory_type,
          count,
          avg_importance: stats.average_importance
        })),
        access_patterns: [] // Default empty array for now
      };
    } catch (error) {
      console.error('Error analyzing memory patterns:', error);
      return {
        total_memories: 0,
        avg_confidence: 0,
        avg_importance: 0,
        max_access_count: 0,
        unique_types: 0,
        type_distribution: [],
        access_patterns: []
      };
    }
  }

  /**
   * Opprett en samling av relaterte minner
   */
  async createMemoryCollection(
    userId: string,
    name: string,
    description: string,
    memoryIds: number[]
  ): Promise<{ status: string; message: string; collection_id?: number; error?: string }> {
    // Collections not implemented in simple server yet
    return {
      status: 'error',
      message: 'Memory collections not yet implemented',
      error: 'Feature not available in current version'
    };
  }

  /**
   * Admin: Få oversikt over alle brukeres minnebruk
   */
  async getAdminOverview(): Promise<AdminMemoryOverview> {
    // Admin overview not implemented in simple server yet
    return {
      total_statistics: {
        total_users: 0,
        total_memories: 0,
        total_size_bytes: 0,
        avg_importance: 0
      },
      top_users: [],
      type_distribution: []
    };
  }

  /**
   * Automatisk lagring av samtale-kontekst
   */
  async saveConversationContext(
    userId: string,
    messages: AIMessage[],
    conversationId: string
  ): Promise<void> {
    if (messages.length === 0) return;

    // Lagre siste brukermelding som kontekst
    const lastUserMessage = messages
      .filter(m => m.role === 'user')
      .pop();

    if (lastUserMessage) {
      await this.storeMemory(
        userId,
        'conversation_context',
        `conversation_${conversationId}_last_intent`,
        lastUserMessage.content,
        {
          confidence: 0.8,
          context: `Conversation ${conversationId}`,
          source: 'auto_save',
          ttlSeconds: 24 * 60 * 60, // 24 timer
          metadata: {
            conversation_id: conversationId,
            message_count: messages.length,
            timestamp: new Date().toISOString()
          }
        }
      );
    }

    // Lagre AI-responser som lærte fakta
    const lastAssistantMessage = messages
      .filter(m => m.role === 'assistant')
      .pop();

    if (lastAssistantMessage) {
      await this.storeMemory(
        userId,
        'learned_fact',
        `ai_response_${conversationId}_${Date.now()}`,
        lastAssistantMessage.content,
        {
          confidence: 0.9,
          context: `AI response in conversation ${conversationId}`,
          source: 'ai_assistant',
          metadata: {
            conversation_id: conversationId,
            response_type: 'assistant_message'
          }
        }
      );
    }
  }

  /**
   * Lag minnebasert personalisering for AI-samtaler
   */
  async getPersonalizationContext(userId: string): Promise<string> {
    try {
      // Hent brukerpreferanser
      const preferences = await this.retrieveMemories(
        userId,
        'user preferences settings likes dislikes',
        { memoryTypes: ['user_preference'], limit: 5 }
      );

      // Hent forhold og følelsestilstand
      const relationships = await this.retrieveMemories(
        userId,
        'relationship friends family emotional state',
        { memoryTypes: ['user_relationship', 'emotional_state'], limit: 3 }
      );

      // Hent lærte fakta
      const facts = await this.retrieveMemories(
        userId,
        'learned facts knowledge interests',
        { memoryTypes: ['learned_fact'], limit: 3 }
      );

      // Generer personaliserings-prompt
      let context = "Bruker-kontekst for personalisering:\n\n";

      if (preferences.length > 0) {
        context += "Brukerpreferanser:\n";
        preferences.forEach(p => {
          context += `- ${p.key}: ${p.value}\n`;
        });
        context += "\n";
      }

      if (relationships.length > 0) {
        context += "Relasjoner og følelser:\n";
        relationships.forEach(r => {
          context += `- ${r.key}: ${r.value}\n`;
        });
        context += "\n";
      }

      if (facts.length > 0) {
        context += "Tidligere lærte fakta:\n";
        facts.forEach(f => {
          context += `- ${f.value}\n`;
        });
        context += "\n";
      }

      return context.trim() || "Ingen lagret brukerinformasjon tilgjengelig.";

    } catch (error) {
      console.error('Feil ved henting av personaliseringsdata:', error);
      return "Feil ved henting av brukerinformasjon.";
    }
  }

  /**
   * Automatisk læring fra brukerinteraksjoner
   */
  async learnFromInteraction(
    userId: string,
    interaction: {
      userInput: string;
      aiResponse: string;
      userFeedback?: 'positive' | 'negative' | 'neutral';
      topic?: string;
    }
  ): Promise<void> {
    try {
      // Lagre interaksjonsmønster
      await this.storeMemory(
        userId,
        'interaction_pattern',
        `interaction_${Date.now()}`,
        `User said: "${interaction.userInput}" | AI responded: "${interaction.aiResponse}"`,
        {
          confidence: interaction.userFeedback === 'positive' ? 0.9 : 0.6,
          metadata: {
            feedback: interaction.userFeedback,
            topic: interaction.topic,
            interaction_type: 'chat'
          },
          source: 'auto_learn',
          ttlSeconds: 30 * 24 * 60 * 60 // 30 dager
        }
      );

      // Hvis positiv feedback, lagre som lært faktum
      if (interaction.userFeedback === 'positive' && interaction.topic) {
        await this.storeMemory(
          userId,
          'learned_fact',
          `successful_${interaction.topic}_${Date.now()}`,
          interaction.aiResponse,
          {
            confidence: 0.95,
            metadata: {
              topic: interaction.topic,
              user_approved: true
            },
            source: 'positive_feedback'
          }
        );
      }

    } catch (error) {
      console.error('Feil ved læring fra interaksjon:', error);
    }
  }

  /**
   * Få minnesammendrag for debugging/admin
   */
  async getMemorySummary(userId: string): Promise<{
    total: number;
    byType: Record<MemoryType, number>;
    recentActivity: MemoryEntry[];
    topImportant: MemoryEntry[];
  }> {
    try {
      const allMemories = await this.retrieveMemories(userId, undefined, { limit: 100 });
      
      const byType = allMemories.reduce((acc, memory) => {
        acc[memory.memory_type] = (acc[memory.memory_type] || 0) + 1;
        return acc;
      }, {} as Record<MemoryType, number>);

      const recentActivity = allMemories
        .sort((a, b) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime())
        .slice(0, 5);

      const topImportant = allMemories
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 5);

      return {
        total: allMemories.length,
        byType,
        recentActivity,
        topImportant
      };

    } catch (error) {
      console.error('Feil ved henting av minnesammendrag:', error);
      throw error;
    }
  }
}

// Singleton instance
export const memoryService = new MemoryService();

// Hook for React components
export function useMemoryService() {
  return memoryService;
}
