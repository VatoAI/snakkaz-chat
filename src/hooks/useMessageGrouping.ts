
import { useMemo } from "react";
import { DecryptedMessage } from "@/types/message";
import { UserStatus } from "@/types/presence";

interface UseMessageGroupingProps {
  messages: DecryptedMessage[];
  userPresence?: Record<string, { status: UserStatus }>;
}

export const useMessageGrouping = ({ 
  messages, 
  userPresence = {} 
}: UseMessageGroupingProps) => {
  // Filter out invalid messages
  const safeMessages = useMemo(() => 
    messages.filter(msg => msg && msg.sender), 
    [messages]
  );
  
  // Get user status from presence data
  const getUserStatus = (userId: string): UserStatus | undefined => {
    return userPresence[userId]?.status;
  };
  
  return {
    messages: safeMessages,
    getUserStatus
  };
};
