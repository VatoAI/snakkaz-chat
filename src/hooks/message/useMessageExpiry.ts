import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DecryptedMessage } from "@/types/message";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useMessageExpiry = (
  setMessages: (updater: (prev: DecryptedMessage[]) => DecryptedMessage[]) => void
) => {
  const { toast } = useToast();
  const { session } = useAuth();
  
  const handleMessageExpired = useCallback(async (messageId: string) => {
    try {
      // Check authentication before proceeding
      if (!session?.user?.id) {
        console.warn("Cannot delete expired message: No authenticated user");
        // Still remove from UI even if we can't delete from database
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        return;
      }
      
      // Update the messages list optimistically (remove from UI first)
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      // First try to mark as deleted instead of actual deletion
      // This has better chance of succeeding with RLS policies
      const { error: markError } = await supabase
        .rpc('mark_message_as_deleted', { 
          message_id: messageId, 
          user_id: session.user.id 
        });

      // If marking as deleted succeeds, we're done
      if (!markError) {
        console.log("Expired message marked as deleted:", messageId);
        return;
      }
      
      console.warn("Could not mark message as deleted, trying direct deletion:", markError);
      
      // Fall back to direct deletion as a second attempt
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) {
        // If both methods fail, log the error but don't show to user
        // since we already removed from UI and the error is expected
        console.error("Error deleting expired message:", error);
        return;
      }
      
      console.log("Expired message deleted successfully:", messageId);
    } catch (error) {
      console.error("Error handling message expiration:", error);
      // Don't show toast to user for expired messages
      // It's confusing since the message is already gone from their view
    }
  }, [setMessages, toast, session]);

  return { handleMessageExpired };
};
