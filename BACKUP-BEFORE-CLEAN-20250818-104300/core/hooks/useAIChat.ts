import { useState, useEffect } from 'react';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens?: number;
    responseTime?: number;
  };
}

interface AIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
}

class AIService {
  private config: AIConfig;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(config: AIConfig) {
    this.config = config;
  }

  async sendMessage(
    messages: ChatMessage[],
    options?: Partial<AIConfig>
  ): Promise<ChatMessage> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: options?.model || this.config.model,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          max_tokens: options?.maxTokens || this.config.maxTokens,
          temperature: options?.temperature || this.config.temperature,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const responseTime = Date.now() - startTime;

      return {
        id: `ai-${Date.now()}`,
        content: data.choices[0].message.content,
        role: 'assistant',
        timestamp: new Date(),
        metadata: {
          model: data.model,
          tokens: data.usage?.total_tokens,
          responseTime,
        },
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  async sendStreamMessage(
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
    options?: Partial<AIConfig>
  ): Promise<ChatMessage> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: options?.model || this.config.model,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          max_tokens: options?.maxTokens || this.config.maxTokens,
          temperature: options?.temperature || this.config.temperature,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to read response stream');
      }

      let fullContent = '';
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                fullContent += content;
                onChunk(content);
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }

      const responseTime = Date.now() - startTime;

      return {
        id: `ai-${Date.now()}`,
        content: fullContent,
        role: 'assistant',
        timestamp: new Date(),
        metadata: {
          model: options?.model || this.config.model,
          responseTime,
        },
      };
    } catch (error) {
      console.error('AI Stream Error:', error);
      throw new Error('Failed to get streaming AI response');
    }
  }
}

export const useAIChat = (initialConfig?: Partial<AIConfig>) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiService, setAiService] = useState<AIService | null>(null);

  const defaultConfig: AIConfig = {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    model: 'gpt-3.5-turbo',
    maxTokens: 1000,
    temperature: 0.7,
    systemPrompt: 'Du er en hjelpsom AI-assistent for Snakkaz Chat, en norsk teknologi-community platform.',
  };

  useEffect(() => {
    const config = { ...defaultConfig, ...initialConfig };
    if (config.apiKey) {
      setAiService(new AIService(config));
      
      // Add system message if provided
      if (config.systemPrompt) {
        setMessages([{
          id: 'system-1',
          content: config.systemPrompt,
          role: 'system',
          timestamp: new Date(),
        }]);
      }
    }
  }, [initialConfig]);

  const sendMessage = async (content: string, useStreaming = false) => {
    if (!aiService) {
      setError('AI service not configured');
      return;
    }

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      let assistantMessage: ChatMessage;

      if (useStreaming) {
        // Create placeholder message for streaming
        const placeholderId = `ai-streaming-${Date.now()}`;
        setMessages(prev => [...prev, {
          id: placeholderId,
          content: '',
          role: 'assistant',
          timestamp: new Date(),
        }]);

        assistantMessage = await aiService.sendStreamMessage(
          [...messages, userMessage],
          (chunk) => {
            setMessages(prev => prev.map(msg => 
              msg.id === placeholderId 
                ? { ...msg, content: msg.content + chunk }
                : msg
            ));
          }
        );

        // Replace placeholder with final message
        setMessages(prev => prev.map(msg => 
          msg.id === placeholderId ? assistantMessage : msg
        ));
      } else {
        assistantMessage = await aiService.sendMessage([...messages, userMessage]);
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages(messages.filter(msg => msg.role === 'system'));
  };

  const regenerateLastMessage = async () => {
    if (messages.length < 2) return;
    
    const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
    if (!lastUserMessage) return;

    // Remove the last assistant message
    setMessages(prev => {
      const lastAssistantIndex = prev.map(msg => msg.role).lastIndexOf('assistant');
      if (lastAssistantIndex === -1) return prev;
      return prev.slice(0, lastAssistantIndex);
    });

    await sendMessage(lastUserMessage.content);
  };

  return {
    messages: messages.filter(msg => msg.role !== 'system'),
    isLoading,
    error,
    sendMessage,
    clearMessages,
    regenerateLastMessage,
    isConfigured: !!aiService,
  };
};

export { AIService, type ChatMessage, type AIConfig };
