
import { useState, useCallback } from "react";
import { DecryptedMessage } from "@/types/message";
import { useToast } from "@/components/ui/use-toast";

export const useMessageState = () => {
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ttl, setTtl] = useState<number | null>(null);
  const { toast } = useToast();

  // Optimized message setter for better performance with large message lists
  const updateMessages = useCallback((updater: React.SetStateAction<DecryptedMessage[]>) => {
    setMessages(prevMessages => {
      // If updater is a function, call it with previous messages
      const newMessages = typeof updater === 'function' 
        ? updater(prevMessages) 
        : updater;
      
      // Only update state if messages have actually changed
      if (
        newMessages.length !== prevMessages.length || 
        JSON.stringify(newMessages) !== JSON.stringify(prevMessages)
      ) {
        return newMessages;
      }
      
      // Return previous messages if no change to prevent unnecessary re-render
      return prevMessages;
    });
  }, []);

  // Optimistic update for message deletion
  const optimisticallyDeleteMessage = useCallback((messageId: string) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              is_deleted: true,
              deleted_at: new Date().toISOString()
            } 
          : msg
      )
    );
  }, []);

  return {
    messages,
    setMessages: updateMessages,
    optimisticallyDeleteMessage,
    newMessage,
    setNewMessage,
    isLoading,
    setIsLoading,
    ttl,
    setTtl,
    toast
  };
};
