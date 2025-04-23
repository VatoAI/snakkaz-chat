
import { DecryptedMessage } from "@/types/message";

/**
 * Groups messages by time blocks, combining messages that are within 
 * a certain timeframe (e.g., 5 minutes) from each other
 */
export const groupMessagesByTime = (messages: DecryptedMessage[]): DecryptedMessage[][] => {
  if (!Array.isArray(messages)) {
    console.error("Expected messages to be an array, but got:", messages);
    return [];
  }
  
  return groupMessages(messages);
};

// Import the existing grouping function
import { groupMessages } from "./message-grouping";

