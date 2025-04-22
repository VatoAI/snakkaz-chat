
import { DecryptedMessage } from "@/types/message";
import { UserPresence, UserStatus } from "@/types/presence";
import { useMemo } from "react";

interface UseMessageGroupingProps {
  messages: DecryptedMessage[];
  userPresence?: Record<string, UserPresence>;
}

export const useMessageGrouping = ({ messages, userPresence = {} }: UseMessageGroupingProps) => {
  // This function is always called, regardless of whether messages is empty
  const getUserStatus = (userId: string): UserStatus | undefined => {
    return userPresence[userId]?.status;
  };

  // Always call useMemo to maintain hook consistency
  const safeMessages = useMemo(() => messages || [], [messages]);

  // Always return the same structure
  return {
    messages: safeMessages,
    getUserStatus
  };
};
