
import { DecryptedMessage } from "@/types/message";
import { UserPresence, UserStatus } from "@/types/presence";
import { useMemo } from "react";

interface UseMessageGroupingProps {
  messages: DecryptedMessage[];
  userPresence?: Record<string, UserPresence>;
}

export const useMessageGrouping = ({ 
  messages, 
  userPresence = {} 
}: UseMessageGroupingProps) => {
  // Filter out any invalid messages and ensure they're safe to use
  const safeMessages = useMemo(() => {
    return messages.filter(msg => !!msg && !!msg.sender);
  }, [messages]);
  
  // Create a function to get user status from presence data
  const getUserStatus = (userId: string): UserStatus | undefined => {
    if (!userPresence || !userPresence[userId]) {
      return undefined;
    }
    return userPresence[userId].status;
  };

  return {
    messages: safeMessages,
    getUserStatus
  };
};
