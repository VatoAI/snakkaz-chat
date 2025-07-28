import { useState, useEffect, useCallback, useMemo } from 'react';
import { chatOptimizer } from '../optimization/chat-optimizer';

export interface UseChatOptimizationProps {
  chatId: string;
  messages: any[];
  enabled?: boolean;
}

export const useChatOptimization = ({ 
  chatId, 
  messages, 
  enabled = true 
}: UseChatOptimizationProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleMessages, setVisibleMessages] = useState<any[]>([]);

  // Optimized message rendering
  const optimizedMessages = useMemo(() => {
    if (!enabled) return messages;
    
    return chatOptimizer.measurePerformance('message-optimization', () => {
      // Add to buffer for quick access
      chatOptimizer.addToBuffer(chatId, messages);
      
      // Index messages for search
      messages.forEach(message => {
        chatOptimizer.indexMessage(message);
      });
      
      return messages;
    });
  }, [messages, chatId, enabled]);

  // Virtual scrolling for large message lists
  const virtualizedMessages = useMemo(() => {
    if (optimizedMessages.length < 50) return optimizedMessages;
    
    // Implement virtual scrolling logic here
    return optimizedMessages.slice(-50); // Show last 50 messages
  }, [optimizedMessages]);

  // Search functionality
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    
    return chatOptimizer.measurePerformance('message-search', () => {
      return chatOptimizer.searchMessages(searchQuery);
    });
  }, [searchQuery]);

  // Typing indicator management
  const startTyping = useCallback(() => {
    if (!enabled) return;
    
    setIsTyping(true);
    chatOptimizer.startTyping('current-user', chatId, () => {
      setIsTyping(false);
    });
  }, [chatId, enabled]);

  const stopTyping = useCallback(() => {
    setIsTyping(false);
    chatOptimizer.stopTyping('current-user', chatId);
  }, [chatId]);

  // Image compression for uploads
  const compressImage = useCallback(async (file: File): Promise<Blob> => {
    if (!enabled) return file;
    
    return chatOptimizer.measurePerformance('image-compression', () => {
      return chatOptimizer.compressImage(file);
    });
  }, [enabled]);

  return {
    messages: virtualizedMessages,
    searchResults,
    searchQuery,
    setSearchQuery,
    isTyping,
    startTyping,
    stopTyping,
    compressImage,
    clearBuffer: () => chatOptimizer.clearBuffer(chatId)
  };
};
