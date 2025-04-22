
import { DecryptedMessage } from "@/types/message";
import { UserPresence, UserStatus } from "@/types/presence";
import { useMemo } from "react";

interface UseMessageGroupingProps {
  messages: DecryptedMessage[];
  userPresence?: Record<string, UserPresence>;
}

export const useMessageGrouping = ({ messages, userPresence = {} }: UseMessageGroupingProps) => {
  const getUserStatus = (userId: string): UserStatus | undefined => {
    return userPresence[userId]?.status;
  };

  // Since we're no longer grouping, just return the messages directly
  const messageGroups = useMemo(() => {
    if (!messages || messages.length === 0) return [];
    return messages;
  }, [messages]);

  return {
    messageGroups,
    getUserStatus
  };
};
