
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ensureMessageColumnsExist } from "./utils/message-db-utils";
import { useToast } from "@/hooks/use-toast";
import { DecryptedMessage } from "@/types/message";

export const useMessageDeleter = (
  userId: string | null,
  setIsLoading: (loading: boolean) => void,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  // Function to verify message ownership
  const canDeleteMessage = useCallback((message: DecryptedMessage): boolean => {
    if (!userId || !message.sender) return false;
    return message.sender.id === userId;
  }, [userId]);

  const handleDeleteMessage = useCallback(async (messageId: string): Promise<void> => {
    if (!userId) {
      console.log("User not authenticated");
      return Promise.reject(new Error("User not authenticated"));
    }

    // We don't set loading state immediately to prevent UI flickering for quick operations
    const timeoutId = setTimeout(() => {
      setIsLoading(true);
    }, 300); // Only show loading if operation takes longer than 300ms

    try {
      // Ensure necessary columns exist
      await ensureMessageColumnsExist();
      
      console.log(`Attempting to delete message ${messageId} for user ${userId}`);
      
      // Call Supabase RPC function to mark message as deleted
      const { error } = await supabase
        .rpc('mark_message_as_deleted', { 
          message_id: messageId, 
          user_id: userId 
        });

      if (error) {
        console.error('Delete message error:', error);
        toast({
          title: "Feil ved sletting",
          description: "Kunne ikke slette meldingen: " + error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log('Message successfully marked as deleted');
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke slette meldingen",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }, [userId, setIsLoading, toast]);

  return { handleDeleteMessage, canDeleteMessage };
};
