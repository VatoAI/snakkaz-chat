import { useState, useCallback } from 'react';
import { DecryptedMessage } from '@/types/message';

export const useAIChat = () => {
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessageToAI = useCallback(async (message: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate AI response delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate AI response
      const aiResponse = `AI: I received your message: "${message}". Thank you!`;
      const aiMessage = createAIMessage(aiResponse);

      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (e) {
      setError('Failed to get response from AI.');
      console.error("AI Chat Error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createAIMessage = (content: string): DecryptedMessage => {
    return {
      id: `ai-${Date.now()}`,
      content: content,
      sender: {
        id: 'ai-assistant',
        username: null,
        full_name: null,
        avatar_url: '/images/ai-assistant.png' // Add default avatar URL
      },
      created_at: new Date().toISOString(),
    };
  };

  const createUserMessage = (content: string): DecryptedMessage => {
    return {
      id: `user-${Date.now()}`,
      content: content,
      sender: {
        id: 'user',
        username: 'You',
        full_name: null,
        avatar_url: '/images/default-avatar.png' // Add default avatar URL
      },
      created_at: new Date().toISOString(),
    };
  };

  const addMessage = useCallback((message: string) => {
    const userMessage = createUserMessage(message);
    setMessages(prevMessages => [...prevMessages, userMessage]);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessageToAI,
    addMessage,
  };
};
