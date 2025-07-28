import { useMemo } from 'react';
import { Message, DirectMessage, GroupMessage } from '@/types/message';

// Define interfaces for grouped messages
interface MessageGroupItem {
  id: string;
  senderId: string;
  content?: string;
  text?: string;
  createdAt: Date | string;
  created_at?: Date | string;
  isEdited?: boolean;
  is_edited?: boolean;
  mediaUrl?: string;
  media_url?: string;
  mediaType?: string;
  media_type?: string;
  replyToId?: string;
  reply_to_id?: string;
  reactions?: any[];
  sender?: {
    id: string;
    username?: string;
    displayName?: string;
    avatar?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface MessageGroup {
  senderId: string;
  sender?: {
    id: string;
    username?: string;
    displayName?: string;
    avatar?: string;
    [key: string]: any;
  };
  messages: MessageGroupItem[];
  timestamp: Date | string;
}

// Time window for grouping messages (in minutes)
const GROUP_TIME_WINDOW = 5;

/**
 * Hook to group messages by sender within a time window
 */
export function useMessageGrouping(
  messages: (Message | DirectMessage | GroupMessage | MessageGroupItem)[]
) {
  return useMemo(() => {
    if (!messages || messages.length === 0) {
      return [];
    }

    const result: MessageGroup[] = [];
    let currentGroup: MessageGroup | null = null;

    // Helper to get timestamp from a message (handling both formats)
    const getMessageTime = (message: MessageGroupItem): Date => {
      const timestamp = message.createdAt || message.created_at;
      return timestamp instanceof Date ? timestamp : new Date(timestamp || Date.now());
    };

    // Sort messages by creation time
    const sortedMessages = [...messages].sort((a, b) => {
      const timeA = getMessageTime(a as MessageGroupItem).getTime();
      const timeB = getMessageTime(b as MessageGroupItem).getTime();
      return timeA - timeB;
    });

    sortedMessages.forEach((msg) => {
      const message = msg as MessageGroupItem;
      const messageTime = getMessageTime(message);
      
      // Standardize sender ID (handle both camelCase and snake_case)
      const senderId = message.senderId || message.sender_id || '';
      
      // Check if we should create a new group
      const shouldCreateNewGroup = !currentGroup || 
        currentGroup.senderId !== senderId ||
        (messageTime.getTime() - getMessageTime(currentGroup.messages[currentGroup.messages.length - 1]).getTime()) > GROUP_TIME_WINDOW * 60 * 1000;
      
      if (shouldCreateNewGroup) {
        // Create a new group
        currentGroup = {
          senderId,
          sender: message.sender,
          messages: [message],
          timestamp: messageTime
        };
        result.push(currentGroup);
      } else if (currentGroup) {
        // Add to existing group
        currentGroup.messages.push(message);
      }
    });

    return result;
  }, [messages]);
}

export default useMessageGrouping;
