
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

  // Use a consistent hook pattern - make sure useMemo is always called
  const safeMessages = useMemo(() => messages || [], [messages]);

  // No need for complex logic here since we're no longer grouping messages
  // Just make sure this hook is consistent and always returns the same structure
  return {
    messages: safeMessages,
    getUserStatus
  };
};
