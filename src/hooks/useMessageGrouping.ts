import { useMemo } from 'react';
import { formatDistanceToNow, isSameDay, parseISO, format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { GroupMessage } from '@/types/group';

// Define a generic message type that can handle both formats
interface BaseMessage {
  id: string;
  createdAt?: Date | number | string;
  created_at?: Date | number | string;
  sender?: {
    id: string;
    [key: string]: any;
  };
  sender_id?: string;
  senderId?: string;
}

// Return type for the hook
interface MessageGroupingResult<T extends BaseMessage> {
  groupedMessages: Record<string, T[]>;
  getDateSeparatorText: (date: string) => string;
  shouldGroupWithPrevious: (current: T, previous?: T) => boolean;
}

// Helper function to safely parse dates from various formats
const parseDate = (dateValue: Date | string | number | undefined): Date => {
  if (!dateValue) return new Date();
  
  if (dateValue instanceof Date) return dateValue;
  
  if (typeof dateValue === 'string') {
    try {
      // Try to parse ISO format first
      return parseISO(dateValue);
    } catch (e) {
      console.error("Error parsing date string:", e);
      return new Date(dateValue);
    }
  }
  
  if (typeof dateValue === 'number') {
    // Assume timestamp in milliseconds
    return new Date(dateValue);
  }
  
  return new Date();
};

// Get the created date from any message format
const getMessageDate = (message: BaseMessage): Date => {
  return parseDate(message.createdAt || message.created_at);
};

// Format date key for grouping
const formatDateKey = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export function useMessageGrouping<T extends BaseMessage>(messages: T[]): MessageGroupingResult<T> {
  const groupedMessages = useMemo(() => {
    // Group messages by date
    const grouped: Record<string, T[]> = {};
    
    messages.forEach((message) => {
      try {
        const date = getMessageDate(message);
        const dateKey = formatDateKey(date);
        
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        
        grouped[dateKey].push(message);
      } catch (error) {
        console.error('Error processing message for grouping:', message, error);
      }
    });
    
    return grouped;
  }, [messages]);
  
  // Format date for display in the chat
  const getDateSeparatorText = (dateKey: string): string => {
    try {
      const date = parseISO(dateKey);
      
      // Check if date is today
      if (isSameDay(date, new Date())) {
        return 'I dag';
      }
      
      // Check if date is yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (isSameDay(date, yesterday)) {
        return 'I går';
      }
      
      // Format as relative for recent dates (within 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      if (date >= sevenDaysAgo) {
        return formatDistanceToNow(date, { addSuffix: true, locale: nb });
      }
      
      // Format as date for older dates
      return format(date, 'd. MMMM yyyy', { locale: nb });
    } catch (error) {
      console.error('Error formatting date separator:', dateKey, error);
      return dateKey;
    }
  };
  
  // Determine if a message should be grouped with the previous message
  const shouldGroupWithPrevious = (current: T, previous?: T): boolean => {
    if (!previous) return false;
    
    // Get sender IDs considering both formats
    const currentSenderId = current.senderId || current.sender_id || current.sender?.id;
    const previousSenderId = previous.senderId || previous.sender_id || previous.sender?.id;
    
    // If sender IDs are different, don't group
    if (!currentSenderId || !previousSenderId || currentSenderId !== previousSenderId) {
      return false;
    }
    
    // Check if messages were sent within 5 minutes of each other
    const currentDate = getMessageDate(current);
    const previousDate = getMessageDate(previous);
    const diffMinutes = (currentDate.getTime() - previousDate.getTime()) / (1000 * 60);
    
    return diffMinutes < 5;
  };
  
  return {
    groupedMessages,
    getDateSeparatorText,
    shouldGroupWithPrevious
  };
}
