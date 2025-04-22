
import { DecryptedMessage } from "@/types/message";
import { UserPresence, UserStatus } from "@/types/presence";
import { useMemo } from "react";

interface UseMessageGroupingProps {
  messages: DecryptedMessage[];
  userPresence?: Record<string, UserPresence>;
}

export const useMessageGrouping = ({ messages, userPresence = {} }: UseMessageGroupingProps) => {
  // This function is always called, never inside a conditional
  const getUserStatus = (userId: string): UserStatus | undefined => {
    return userPresence[userId]?.status;
  };

  // Always call useMemo regardless of messages validity
  const safeMessages = useMemo(() => {
    if (!Array.isArray(messages)) {
      console.warn("messages is not an array:", messages);
      return [];
    }
    
    // Filter out invalid messages to prevent rendering issues
    return messages.filter(message => message && message.sender);
  }, [messages]);

  // Return consistent structure
  return {
    messages: safeMessages,
    getUserStatus
  };
};
