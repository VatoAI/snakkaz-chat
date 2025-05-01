import { useMemo } from "react";
import { format, isToday, isYesterday, isSameDay, isSameWeek, isSameMonth, isSameYear } from "date-fns";
import { nb } from 'date-fns/locale';
import { GroupMessage } from "@/types/group";
import { DecryptedMessage } from "@/types/message";
import { UserPresence, UserStatus } from "@/types/presence";

type Message = DecryptedMessage | GroupMessage;

interface UseMessageGroupingProps<T extends Message> {
  messages: T[];
  userPresence?: Record<string, UserPresence>;
}

type GroupedMessages<T> = {
  [key: string]: T[];
};

export const useMessageGrouping = <T extends Message>(props: UseMessageGroupingProps<T>) => {
  const { messages = [], userPresence = {} } = props;
  
  // Filter out any invalid messages and ensure they're safe to use
  const safeMessages = useMemo(() => {
    return messages.filter(msg => !!msg);
  }, [messages]);
  
  // Group messages by date
  const groupedMessages = useMemo(() => {
    const grouped: GroupedMessages<T> = {};
    
    safeMessages.forEach(message => {
      // Determine the date from the message
      const messageDate = 'createdAt' in message
        ? message.createdAt // GroupMessage format
        : new Date(message.sent_at || message.created_at); // DecryptedMessage format
        
      const dateKey = format(messageDate, 'yyyy-MM-dd');
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      
      grouped[dateKey].push(message);
    });
    
    return grouped;
  }, [safeMessages]);
  
  // Format date separator text based on date
  const getDateSeparatorText = (dateKey: string) => {
    const date = new Date(dateKey);
    
    if (isToday(date)) {
      return 'I dag';
    } else if (isYesterday(date)) {
      return 'I går';
    } else if (isSameWeek(date, new Date())) {
      return format(date, 'EEEE', { locale: nb }); // Dag i uken
    } else if (isSameYear(date, new Date())) {
      return format(date, 'd. MMMM', { locale: nb });
    } else {
      return format(date, 'd. MMMM yyyy', { locale: nb });
    }
  };
  
  // Create a function to get user status from presence data
  const getUserStatus = (userId: string): UserStatus | undefined => {
    if (!userPresence || !userPresence[userId]) {
      return undefined;
    }
    return userPresence[userId].status;
  };
  
  // Check if two messages can be visually grouped (same sender, close in time)
  const shouldGroupWithPrevious = (current: T, previous: T | null) => {
    if (!previous) return false;
    
    // Get sender IDs
    const currentSenderId = 'senderId' in current 
      ? current.senderId 
      : current.sender;
      
    const previousSenderId = 'senderId' in previous 
      ? previous.senderId 
      : previous.sender;
    
    // Different senders means they can't be grouped
    if (currentSenderId !== previousSenderId) return false;
    
    // Get timestamps
    const currentDate = 'createdAt' in current 
      ? current.createdAt 
      : new Date(current.sent_at || current.created_at);
      
    const previousDate = 'createdAt' in previous
      ? previous.createdAt
      : new Date(previous.sent_at || previous.created_at);
    
    // If messages are more than 5 minutes apart, don't group them
    const FIVE_MINUTES_MS = 5 * 60 * 1000;
    return Math.abs(currentDate.getTime() - previousDate.getTime()) < FIVE_MINUTES_MS;
  };

  return {
    messages: safeMessages,
    groupedMessages,
    getDateSeparatorText,
    getUserStatus,
    shouldGroupWithPrevious
  };
};
