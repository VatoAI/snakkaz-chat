
import { useState, useMemo } from 'react';
import { formatDistanceToNow, format, isToday, isYesterday, isThisWeek, isThisYear, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';
import { UserPresence, UserStatus } from '@/types/presence';

interface UseMessageGroupingProps<T> {
  messages: T[];
  userPresence?: Record<string, UserPresence>;
}

export function useMessageGrouping<T extends { createdAt?: string | Date; created_at?: string | Date; senderId?: string; sender_id?: string }>({ 
  messages,
  userPresence = {}
}: UseMessageGroupingProps<T>) {
  // Safely determine the created time from different field formats
  const getCreatedTime = (message: T): Date => {
    if (message.createdAt) {
      return message.createdAt instanceof Date 
        ? message.createdAt 
        : parseISO(message.createdAt as string);
    }
    if (message.created_at) {
      return message.created_at instanceof Date 
        ? message.created_at 
        : parseISO(message.created_at as string);
    }
    return new Date();
  };

  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups: Record<string, T[]> = {};
    
    if (!Array.isArray(messages)) {
      console.error('Expected messages to be an array, but got:', messages);
      return {};
    }
    
    messages.forEach(message => {
      try {
        const date = getCreatedTime(message);
        const dateKey = format(date, 'yyyy-MM-dd');
        
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(message);
      } catch (error) {
        console.error('Error processing message for grouping:', error);
      }
    });
    
    return groups;
  }, [messages]);
  
  // Get user status from presence data
  const getUserStatus = (userId: string): UserStatus | undefined => {
    const presence = userPresence[userId];
    return presence?.status;
  };
  
  // Format date separator text
  const getDateSeparatorText = (dateKey: string) => {
    try {
      const date = parseISO(dateKey);
      
      if (isToday(date)) {
        return 'I dag';
      }
      
      if (isYesterday(date)) {
        return 'I går';
      }
      
      if (isThisWeek(date)) {
        return format(date, 'EEEE', { locale: nb });
      }
      
      if (isThisYear(date)) {
        return format(date, 'd. MMMM', { locale: nb });
      }
      
      return format(date, 'd. MMMM yyyy', { locale: nb });
    } catch (error) {
      console.error('Error formatting date separator:', error);
      return dateKey;
    }
  };
  
  return { 
    groupedMessages, 
    getDateSeparatorText,
    getUserStatus
  };
}
