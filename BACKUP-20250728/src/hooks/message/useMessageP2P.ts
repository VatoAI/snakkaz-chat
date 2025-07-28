
import { useCallback } from "react";
import { DecryptedMessage } from "@/types/message.d";

export const useMessageP2P = (
  setMessages: (updater: (prev: DecryptedMessage[]) => DecryptedMessage[]) => void
) => {
  const addP2PMessage = useCallback((message?: any) => {
    if (message) {
      setMessages(prev => {
        // Check if message already exists to avoid duplicates
        const messageExists = prev.some(m => m.id === message.id);
        if (messageExists) {
          return prev;
        }
        return [...prev, message];
      });
    }
  }, [setMessages]);

  return { addP2PMessage };
};
