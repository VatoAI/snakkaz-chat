// SnakkaZ Vector Memory System for Long-term Conversation Memory
import { createClient } from '@supabase/supabase-js';

interface MemoryEntry {
  id: string;
  user_id: string;
  conversation_id: string;
  content: string;
  embedding: number[];
  metadata: {
    timestamp: string;
    message_type: 'user' | 'assistant' | 'system';
    importance_score: number;
    context_tags: string[];
  };
  created_at: string;
}

interface ConversationContext {
  summary: string;
  key_topics: string[];
  user_preferences: Record<string, any>;
  conversation_style: string;
  last_interaction: string;
}

export class VectorMemorySystem {
  private supabase: any;
  private embeddingDimension = 1536; // OpenAI embedding dimension
  
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Add new memory entry to vector database
   */
  async addMemory(
    userId: string,
    conversationId: string,
    content: string,
    messageType: 'user' | 'assistant' | 'system',
    contextTags: string[] = []
  ): Promise<void> {
    try {
      // Generate embedding (placeholder - would use actual embedding service)
      const embedding = await this.generateEmbedding(content);
      
      // Calculate importance score based on content
      const importanceScore = this.calculateImportance(content, messageType);
      
      const memoryEntry: Omit<MemoryEntry, 'id' | 'created_at'> = {
        user_id: userId,
        conversation_id: conversationId,
        content,
        embedding,
        metadata: {
          timestamp: new Date().toISOString(),
          message_type: messageType,
          importance_score: importanceScore,
          context_tags: contextTags
        }
      };

      const { error } = await this.supabase
        .from('vector_memories')
        .insert(memoryEntry);

      if (error) throw error;

      // Update conversation context
      await this.updateConversationContext(userId, conversationId, content, messageType);
      
    } catch (error) {
      console.error('Failed to add memory:', error);
    }
  }

  /**
   * Search for relevant memories using vector similarity
   */
  async searchMemories(
    userId: string,
    query: string,
    limit: number = 10,
    similarityThreshold: number = 0.7
  ): Promise<MemoryEntry[]> {
    try {
      // Generate embedding for search query
      const queryEmbedding = await this.generateEmbedding(query);
      
      // Use Supabase vector similarity search (requires pgvector extension)
      const { data, error } = await this.supabase
        .rpc('search_memories', {
          query_embedding: queryEmbedding,
          user_id: userId,
          similarity_threshold: similarityThreshold,
          match_count: limit
        });

      if (error) throw error;
      return data || [];
      
    } catch (error) {
      console.error('Failed to search memories:', error);
      return [];
    }
  }

  /**
   * Get conversation context and summary
   */
  async getConversationContext(userId: string, conversationId: string): Promise<ConversationContext | null> {
    try {
      const { data, error } = await this.supabase
        .from('conversation_contexts')
        .select('*')
        .eq('user_id', userId)
        .eq('conversation_id', conversationId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
      
    } catch (error) {
      console.error('Failed to get conversation context:', error);
      return null;
    }
  }

  /**
   * Get user's long-term memory profile
   */
  async getUserMemoryProfile(userId: string): Promise<{
    preferences: Record<string, any>;
    topics_of_interest: string[];
    communication_style: string;
    memory_highlights: string[];
  }> {
    try {
      // Get high-importance memories
      const { data: importantMemories } = await this.supabase
        .from('vector_memories')
        .select('content, metadata')
        .eq('user_id', userId)
        .gte('metadata->importance_score', 0.8)
        .order('created_at', { ascending: false })
        .limit(50);

      // Analyze patterns in user's conversations
      const preferences = this.analyzeUserPreferences(importantMemories || []);
      const topics = this.extractTopics(importantMemories || []);
      const style = this.inferCommunicationStyle(importantMemories || []);
      
      return {
        preferences,
        topics_of_interest: topics,
        communication_style: style,
        memory_highlights: (importantMemories || []).slice(0, 10).map(m => m.content)
      };
      
    } catch (error) {
      console.error('Failed to get user memory profile:', error);
      return {
        preferences: {},
        topics_of_interest: [],
        communication_style: 'standard',
        memory_highlights: []
      };
    }
  }

  /**
   * Clean up old, low-importance memories
   */
  async cleanupMemories(userId: string, daysToKeep: number = 90): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      // Delete old, low-importance memories
      const { error } = await this.supabase
        .from('vector_memories')
        .delete()
        .eq('user_id', userId)
        .lt('created_at', cutoffDate.toISOString())
        .lt('metadata->importance_score', 0.3);

      if (error) throw error;
      
    } catch (error) {
      console.error('Failed to cleanup memories:', error);
    }
  }

  /**
   * Generate text embedding (placeholder implementation)
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    // This would use OpenAI embeddings API or local model
    // For now, return dummy embedding
    return new Array(this.embeddingDimension).fill(0).map(() => Math.random());
  }

  /**
   * Calculate importance score for content
   */
  private calculateImportance(content: string, messageType: 'user' | 'assistant' | 'system'): number {
    let score = 0.5; // Base score
    
    // User messages generally more important than system
    if (messageType === 'user') score += 0.2;
    if (messageType === 'system') score -= 0.2;
    
    // Length indicates depth
    if (content.length > 100) score += 0.1;
    if (content.length > 300) score += 0.1;
    
    // Keywords that indicate importance
    const importantKeywords = [
      'important', 'remember', 'never forget', 'always',
      'prefer', 'like', 'dislike', 'love', 'hate',
      'goal', 'objective', 'plan', 'project',
      'personal', 'family', 'work', 'career'
    ];
    
    const lowerContent = content.toLowerCase();
    importantKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) score += 0.1;
    });
    
    // Questions often indicate important information seeking
    if (content.includes('?')) score += 0.1;
    
    return Math.min(1.0, Math.max(0.0, score));
  }

  /**
   * Update conversation context with new information
   */
  private async updateConversationContext(
    userId: string,
    conversationId: string,
    content: string,
    messageType: 'user' | 'assistant' | 'system'
  ): Promise<void> {
    try {
      // Get existing context or create new
      let context = await this.getConversationContext(userId, conversationId);
      
      if (!context) {
        context = {
          summary: '',
          key_topics: [],
          user_preferences: {},
          conversation_style: 'standard',
          last_interaction: new Date().toISOString()
        };
      }
      
      // Update summary and topics
      const newTopics = this.extractTopicsFromText(content);
      context.key_topics = [...new Set([...context.key_topics, ...newTopics])].slice(0, 20);
      context.last_interaction = new Date().toISOString();
      
      // Update conversation style based on user messages
      if (messageType === 'user') {
        context.conversation_style = this.inferStyleFromMessage(content);
      }
      
      // Upsert context
      const { error } = await this.supabase
        .from('conversation_contexts')
        .upsert({
          user_id: userId,
          conversation_id: conversationId,
          ...context
        });

      if (error) throw error;
      
    } catch (error) {
      console.error('Failed to update conversation context:', error);
    }
  }

  private analyzeUserPreferences(memories: any[]): Record<string, any> {
    // Analyze patterns in user's messages to infer preferences
    return {
      language: 'norwegian',
      formality: 'casual',
      topics_discussed: [],
      time_patterns: {}
    };
  }

  private extractTopics(memories: any[]): string[] {
    // Extract common topics from conversation history
    return ['programming', 'ai', 'norwegian', 'chat'];
  }

  private inferCommunicationStyle(memories: any[]): string {
    // Analyze communication patterns
    return 'friendly';
  }

  private extractTopicsFromText(text: string): string[] {
    // Simple topic extraction - would use NLP in production
    const words = text.toLowerCase().split(/\s+/);
    return words.filter(word => word.length > 5).slice(0, 3);
  }

  private inferStyleFromMessage(message: string): string {
    if (message.includes('!') || message.includes('😊')) return 'enthusiastic';
    if (message.length < 50) return 'concise';
    return 'detailed';
  }
}

// Export singleton instance
export const vectorMemory = new VectorMemorySystem(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);