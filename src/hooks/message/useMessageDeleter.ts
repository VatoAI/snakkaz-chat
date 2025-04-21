
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ensureMessageColumnsExist } from "./utils/message-db-utils";
import { useToast } from "@/components/ui/use-toast";

export const useMessageDeleter = (
  userId: string | null,
  setIsLoading: (loading: boolean) => void,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  const handleDeleteMessage = useCallback(async (messageId: string): Promise<void> => {
    if (!userId) {
      console.log("Bruker ikke pålogget");
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
      
      // Optimistically update local state first (handled in the message list component)
      
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

  return { handleDeleteMessage };
};
