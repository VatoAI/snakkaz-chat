/**
 * SNAKKAZ CHAT - REACT HOOK FOR CLAUDE 3.5 SONNET
 * Juni 24, 2025 - React hook for optimal Claude AI integrasjon
 */

import { useState, useCallback, useRef } from 'react';
import { OptimizedClaudeService, ClaudeResponse, ClaudeConfig, ChatMessage } from '../services/ai/optimizedClaudeService';
import { useAuth } from '../contexts/AuthContext';

export interface UseClaude {
  // State
  isLoading: boolean;
  error: string | null;
  lastResponse: ClaudeResponse | null;
  conversationHistory: ChatMessage[];
  totalCost: { usd: number; nok: number };
  
  // Actions
  chat: (message: string, config?: Partial<ClaudeConfig>) => Promise<ClaudeResponse>;
  quickChat: (message: string) => Promise<string>;
  analyzeText: (text: string, type: 'sentiment' | 'summary' | 'keywords' | 'translate') => Promise<string>;
  clearHistory: () => void;
  clearError: () => void;
  
  // Utilities
  retryLastMessage: () => Promise<ClaudeResponse | null>;
  exportConversation: () => string;
}

export const useClaude = (defaultConfig: Partial<ClaudeConfig> = {}): UseClaude => {
  const { user } = useAuth();
  const claudeService = useRef<OptimizedClaudeService | null>(null);
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<ClaudeResponse | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [totalCost, setTotalCost] = useState({ usd: 0, nok: 0 });
  const [lastUserMessage, setLastUserMessage] = useState<string>('');

  // Initialize Claude service
  const getClaudeService = useCallback(() => {
    if (!claudeService.current) {
      try {
        claudeService.current = new OptimizedClaudeService();
      } catch (err) {
        setError('Claude AI er ikke konfigurert. Kontakt administratoren.');
        return null;
      }
    }
    return claudeService.current;
  }, []);

  // Main chat function
  const chat = useCallback(async (
    message: string, 
    config: Partial<ClaudeConfig> = {}
  ): Promise<ClaudeResponse> => {
    const service = getClaudeService();
    if (!service) throw new Error('Claude service ikke tilgjengelig');

    setIsLoading(true);
    setError(null);
    setLastUserMessage(message);

    try {
      // Add user message to history
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date(),
        userId: user?.id
      };

      const updatedHistory = [...conversationHistory, userMessage];
      setConversationHistory(updatedHistory);

      // Call Claude with full conversation history
      const response = await service.chat(
        updatedHistory,
        user?.id || 'anonymous',
        { ...defaultConfig, ...config }
      );

      // Add assistant response to history
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.content,
        timestamp: new Date()
      };

      setConversationHistory(prev => [...prev, assistantMessage]);
      setLastResponse(response);

      // Update total cost
      setTotalCost(prev => ({
        usd: prev.usd + response.cost.usd,
        nok: prev.nok + response.cost.nok
      }));

      return response;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ukjent feil oppstod';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [conversationHistory, user?.id, defaultConfig, getClaudeService]);

  // Quick chat without history
  const quickChat = useCallback(async (message: string): Promise<string> => {
    const service = getClaudeService();
    if (!service) throw new Error('Claude service ikke tilgjengelig');

    setIsLoading(true);
    setError(null);

    try {
      const response = await service.quickChat(message, defaultConfig);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ukjent feil oppstod';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [defaultConfig, getClaudeService]);

  // Text analysis
  const analyzeText = useCallback(async (
    text: string, 
    type: 'sentiment' | 'summary' | 'keywords' | 'translate'
  ): Promise<string> => {
    const service = getClaudeService();
    if (!service) throw new Error('Claude service ikke tilgjengelig');

    setIsLoading(true);
    setError(null);

    try {
      const result = await service.analyzeText(text, type);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Tekstanalyse feilet';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getClaudeService]);

  // Clear conversation history
  const clearHistory = useCallback(() => {
    setConversationHistory([]);
    setLastResponse(null);
    setTotalCost({ usd: 0, nok: 0 });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Retry last message
  const retryLastMessage = useCallback(async (): Promise<ClaudeResponse | null> => {
    if (!lastUserMessage) {
      setError('Ingen melding å prøve på nytt');
      return null;
    }

    try {
      // Remove last assistant response if exists
      const historyWithoutLastResponse = conversationHistory.filter(
        (msg, index) => index < conversationHistory.length - 1 || msg.role === 'user'
      );
      setConversationHistory(historyWithoutLastResponse);

      return await chat(lastUserMessage);
    } catch (err) {
      console.error('Retry failed:', err);
      return null;
    }
  }, [lastUserMessage, conversationHistory, chat]);

  // Export conversation as formatted text
  const exportConversation = useCallback((): string => {
    const header = `SnakkaZ Chat - Claude 3.5 Sonnet Samtale
Eksportert: ${new Date().toLocaleString('no-NO')}
Total kostnad: $${totalCost.usd.toFixed(4)} (${totalCost.nok} NOK)
Antall meldinger: ${conversationHistory.length}

---

`;

    const conversation = conversationHistory
      .map(msg => {
        const timestamp = msg.timestamp?.toLocaleTimeString('no-NO') || '';
        const role = msg.role === 'user' ? 'Du' : 'Claude';
        return `[${timestamp}] ${role}:\n${msg.content}\n`;
      })
      .join('\n');

    return header + conversation;
  }, [conversationHistory, totalCost]);

  return {
    // State
    isLoading,
    error,
    lastResponse,
    conversationHistory,
    totalCost,
    
    // Actions
    chat,
    quickChat,
    analyzeText,
    clearHistory,
    clearError,
    
    // Utilities
    retryLastMessage,
    exportConversation
  };
};

export default useClaude;
