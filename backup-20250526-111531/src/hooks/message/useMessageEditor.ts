
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { encryptMessage } from "@/utils/encryption";
import { ensureMessageColumnsExist } from "./utils/message-db-utils";
import { useToast } from "@/components/ui/use-toast";

export const useMessageEditor = (
  userId: string | null,
  newMessage: string,
  setNewMessage: (message: string) => void,
  setIsLoading: (loading: boolean) => void,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  const handleEditMessage = useCallback(async (
    messageId: string,
    content: string,
  ): Promise<void> => {
    if (!content.trim() || !userId) {
      console.log("Ingen melding å redigere, eller bruker ikke pålogget");
      return;
    }

    setIsLoading(true);
    try {
      console.log(`Attempting to edit message ${messageId} for user ${userId} with content: ${content}`);
      
      // Ensure necessary columns exist
      await ensureMessageColumnsExist();

      const { encryptedContent, key, iv } = await encryptMessage(content.trim());
      
      // Use an RPC call to ensure proper validation on the server
      const { error } = await supabase
        .from('messages')
        .update({
          encrypted_content: encryptedContent,
          encryption_key: key,
          iv: iv,
          is_edited: true,
          edited_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('sender_id', userId); // Ensure only sender can edit

      if (error) {
        console.error('Edit message error:', error);
        toast({
          title: "Feil",
          description: "Kunne ikke redigere melding: " + error.message,
          variant: "destructive",
        });
        throw error;
      } else {
        console.log("Melding redigert");
        setNewMessage("");
      }
    } catch (error) {
      console.error('Error editing message:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke redigere melding",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, setNewMessage, setIsLoading, toast]);

  return { handleEditMessage };
};
