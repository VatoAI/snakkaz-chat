
import { DecryptedMessage } from "@/types/message";

// Time threshold in milliseconds for grouping messages (5 minutes)
const TIME_THRESHOLD = 5 * 60 * 1000;

/**
 * Groups messages that are within the TIME_THRESHOLD of each other
 */
export const groupMessages = (messages: DecryptedMessage[]): DecryptedMessage[][] => {
  if (!messages.length) return [];

  const sortedMessages = [...messages].sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return timeA - timeB;
  });

  const groups: DecryptedMessage[][] = [];
  let currentGroup: DecryptedMessage[] = [sortedMessages[0]];

  for (let i = 1; i < sortedMessages.length; i++) {
    const currentMessage = sortedMessages[i];
    const previousMessage = sortedMessages[i - 1];
    
    const currentTime = currentMessage.created_at ? new Date(currentMessage.created_at).getTime() : 0;
    const previousTime = previousMessage.created_at ? new Date(previousMessage.created_at).getTime() : 0;
    
    // Check if messages have the same sender and are within time threshold
    if (
      currentMessage.sender_id === previousMessage.sender_id &&
      (currentTime - previousTime) < TIME_THRESHOLD
    ) {
      currentGroup.push(currentMessage);
    } else {
      groups.push(currentGroup);
      currentGroup = [currentMessage];
    }
  }
  
  // Add the last group if it's not empty
  if (currentGroup.length) {
    groups.push(currentGroup);
  }
  
  return groups;
};
