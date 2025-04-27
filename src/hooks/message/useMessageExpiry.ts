
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DecryptedMessage } from "@/types/message";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useMessageExpiry = (
  setMessages: (updater: (prev: DecryptedMessage[]) => DecryptedMessage[]) => void
) => {
  const { toast } = useToast();
  const auth = useAuth();
  
  const handleMessageExpired = useCallback(async (messageId: string) => {
    try {
      console.log("Handling message expiration for:", messageId);
      
      // Check authentication before proceeding
      if (!auth.session?.user?.id) {
        console.warn("Cannot delete expired message: No authenticated user");
        // Still remove from UI even if we can't delete from database
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        return;
      }
      
      // Update the messages list optimistically (remove from UI first)
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      // First try to get info about any media that needs to be cleaned up
      const { data: messageData, error: fetchError } = await supabase
        .from('messages')
        .select('media_url')
        .eq('id', messageId)
        .single();

      if (fetchError) {
        console.warn("Could not fetch message data for cleanup:", fetchError);
      } else if (messageData?.media_url) {
        // Try to clean up the media file
        try {
          console.log("Attempting to delete media file:", messageData.media_url);
          await supabase.storage
            .from('chat-media')
            .remove([messageData.media_url]);
        } catch (storageError) {
          console.warn("Failed to delete media file:", storageError);
          // Continue with message deletion anyway
        }
      }

      // Try to mark as deleted instead of actual deletion
      const { error: markError } = await supabase
        .rpc('mark_message_as_deleted', { 
          message_id: messageId, 
          user_id: auth.session.user.id 
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
  }, [setMessages, toast, auth.session]);

  return { handleMessageExpired };
};
