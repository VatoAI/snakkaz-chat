
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DecryptedMessage } from "@/types/message";
import { useToast } from "@/hooks/use-toast";

export const useMessageExpiry = (
  setMessages: (updater: (prev: DecryptedMessage[]) => DecryptedMessage[]) => void
) => {
  const { toast } = useToast();
  
  const handleMessageExpired = useCallback(async (messageId: string) => {
    try {
      // Update the messages list optimistically
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      // Delete the message from the database
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) {
        console.error("Error deleting expired message:", error);
        toast({
          title: "Error",
          description: "Failed to delete expired message",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Message deleted successfully:", messageId);
    } catch (error) {
      console.error("Error handling message expiration:", error);
      toast({
        title: "Error",
        description: "Failed to process message expiration",
        variant: "destructive",
      });
    }
  }, [setMessages, toast]);

  return { handleMessageExpired };
};
