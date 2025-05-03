
import { useState, useMemo } from 'react';
import { formatDistanceToNow, format, isToday, isYesterday, isThisWeek, isThisYear, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';
import { UserPresence, UserStatus } from '@/types/presence';

interface UseMessageGroupingProps<T> {
// Definer en union-type som inkluderer alle meldingstyper
type MessageType = GroupMessage | DecryptedMessage;

// Definerer sender-typen for å gjøre typene kompatible
type SenderType = {
  id: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
};

// Utvidet grensesnitt som er kompatibelt med begge meldingstypene
interface ExtendedMessageBase {
  id: string;
  createdAt?: Date;
  created_at?: string | Date;
  sent_at?: string | Date;
  senderId?: string;
  sender?: SenderType | string; // Kan være enten et objekt eller en string
  text?: string;
  content?: string;
}

// Generisk props-type for useMessageGrouping
interface UseMessageGroupingProps<T extends MessageType> {
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

type GroupedMessages<T> = {
  [key: string]: T[];
};

export const useMessageGrouping = <T extends MessageType>(props: UseMessageGroupingProps<T>) => {
  const { messages = [], userPresence = {} } = props;
  
  // Filter out any invalid messages and ensure they're safe to use
  const safeMessages = useMemo(() => {
    return messages.filter(msg => !!msg);
  }, [messages]);
  
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
    safeMessages.forEach(message => {
      // Determine the date from the message and ensure it's a Date object
      let messageDate: Date;
      
      // Sjekk om den har en createdAt egenskap (GroupMessage format)
      if ('createdAt' in message && message.createdAt) {
        messageDate = message.createdAt instanceof Date 
          ? message.createdAt 
          : new Date(message.createdAt);
      } 
      // Sjekk for sent_at og created_at (DecryptedMessage format)
      else if ('sent_at' in message && message.sent_at) {
        messageDate = typeof message.sent_at === 'string' || message.sent_at instanceof Date
          ? new Date(message.sent_at)
          : new Date();
      } 
      else if ('created_at' in message && message.created_at) {
        messageDate = typeof message.created_at === 'string' 
            ? new Date(message.created_at)
            : message.created_at instanceof Date
              ? message.created_at
              : new Date();
      } 
      // Fallback til nåværende tid
      else {
        messageDate = new Date();
      }
        
      const dateKey = format(messageDate, 'yyyy-MM-dd');
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      
      grouped[dateKey].push(message);
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
    }
  };
  
  // Create a function to get user status from presence data
  const getUserStatus = (userId: string): UserStatus | undefined => {
    if (!userPresence || !userPresence[userId]) {
      return undefined;
    }
    return userPresence[userId].status;
  };
  
  // Hjelpefunksjon for å hente sender-ID uavhengig av meldingstype
  const getSenderId = (message: T): string | undefined => {
    if ('senderId' in message) {
      return message.senderId;
    } else if ('sender' in message) {
      // Håndter både streng og objekt-sender
      if (typeof message.sender === 'string') {
        return message.sender;
      } else if (message.sender && typeof message.sender === 'object') {
        return message.sender.id;
      }
    }
    return undefined;
  };
  
  // Check if two messages can be visually grouped (same sender, close in time)
  const shouldGroupWithPrevious = (current: T, previous: T | null) => {
    if (!previous) return false;
    
    // Get sender IDs using hjelpefunksjonen
    const currentSenderId = getSenderId(current);
    const previousSenderId = getSenderId(previous);
    
    // Different senders means they can't be grouped
    if (currentSenderId !== previousSenderId) return false;
    
    // Get timestamps and ensure they're Date objects
    let currentDate: Date;
    let previousDate: Date;
    
    // Hent dato for den nåværende meldingen
    if ('createdAt' in current && current.createdAt) {
      currentDate = current.createdAt instanceof Date 
        ? current.createdAt 
        : new Date(current.createdAt);
    } 
    else if ('sent_at' in current && current.sent_at) {
      currentDate = typeof current.sent_at === 'string' || current.sent_at instanceof Date
        ? new Date(current.sent_at)
        : new Date();
    } 
    else if ('created_at' in current && current.created_at) {
      currentDate = typeof current.created_at === 'string' 
        ? new Date(current.created_at)
        : current.created_at instanceof Date
          ? current.created_at
          : new Date();
    }
    else {
      currentDate = new Date();
    }
    
    // Hent dato for den forrige meldingen
    if ('createdAt' in previous && previous.createdAt) {
      previousDate = previous.createdAt instanceof Date 
        ? previous.createdAt
        : new Date(previous.createdAt);
    } 
    else if ('sent_at' in previous && previous.sent_at) {
      previousDate = typeof previous.sent_at === 'string' || previous.sent_at instanceof Date
        ? new Date(previous.sent_at)
        : new Date();
    } 
    else if ('created_at' in previous && previous.created_at) {
      previousDate = typeof previous.created_at === 'string'
        ? new Date(previous.created_at)
        : previous.created_at instanceof Date
          ? previous.created_at
          : new Date();
    }
    else {
      previousDate = new Date();
    }
    
    // If messages are more than 5 minutes apart, don't group them
    const FIVE_MINUTES_MS = 5 * 60 * 1000;
    return Math.abs(currentDate.getTime() - previousDate.getTime()) < FIVE_MINUTES_MS;
  };
  
  return { 
    groupedMessages, 
    getDateSeparatorText,
    getUserStatus
  };
}
