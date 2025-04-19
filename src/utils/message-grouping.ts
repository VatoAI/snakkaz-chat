
import { DecryptedMessage } from "@/types/message";

export const groupMessages = (messages: DecryptedMessage[]) => {
  if (!Array.isArray(messages)) {
    console.error("Expected messages to be an array, but got:", messages);
    return [];
  }
  
  const groups: DecryptedMessage[][] = [];
  let currentGroup: DecryptedMessage[] = [];

  messages.forEach((message, index) => {
    // Skip undefined or null messages or those without sender
    if (!message || !message.sender) {
      console.warn("Skipping invalid message:", message);
      return;
    }
    
    if (index === 0 || currentGroup.length === 0) {
      currentGroup.push(message);
    } else {
      const prevMessage = currentGroup[currentGroup.length - 1];
      
      // Make sure we have valid data for comparison
      if (!prevMessage || !prevMessage.sender || !message.sender) {
        // Start a new group if we can't compare
        if (currentGroup.length > 0) {
          groups.push([...currentGroup]);
        }
        currentGroup = [message];
        return;
      }
      
      const timeDiff = new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime();
      const sameUser = message.sender.id === prevMessage.sender.id;
      
      // Group messages if they are from same user and not more than 5 minutes apart
      if (sameUser && timeDiff < 5 * 60 * 1000) {
        currentGroup.push(message);
      } else {
        groups.push([...currentGroup]);
        currentGroup = [message];
      }
    }
  });

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
};
