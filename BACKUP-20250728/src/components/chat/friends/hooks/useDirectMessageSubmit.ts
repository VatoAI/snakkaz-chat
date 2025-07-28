
import { useCallback } from "react";
import { DecryptedMessage } from "@/types/message.d";
import { useMessageEditor } from "@/hooks/message/useMessageEditor";
import { useMessageDeleter } from "@/hooks/message/useMessageDeleter";
import { useToast } from "@/components/ui/use-toast";

// Modified to match the expected function signatures
export const useDirectMessageSubmit = (
  currentUserId: string,
  newMessage: string,
  setNewMessage: (message: string) => void,
  setIsLoading: (loading: boolean) => void,
  editingMessage: { id: string; content: string } | null,
  setEditingMessage: (message: { id: string; content: string } | null) => void,
  handleSendDirectMessage: (text: string, encryptionKey?: string, iv?: string) => Promise<boolean>
) => {
  const { toast } = useToast();
  
  // Initialize the message editor and deleter hooks
  const { handleEditMessage } = useMessageEditor(
    currentUserId,
    newMessage,
    setNewMessage,
    setIsLoading,
    toast
  );
  
  const { handleDeleteMessage } = useMessageDeleter(
    currentUserId,
    setIsLoading,
    toast
  );
  
  // Modified to match the expected function signature
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMessage) {
      // Handle edit submission
      await handleEditMessage(editingMessage.id, newMessage);
      setEditingMessage(null);
      setNewMessage("");
    } else {
      // Modified to call handleSendDirectMessage with the text directly
      const success = await handleSendDirectMessage(newMessage);
      if (success) {
        setNewMessage("");
      }
    }
  };

  const handleDeleteMessageById = useCallback(async (messageId: string) => {
    await handleDeleteMessage(messageId);
  }, [handleDeleteMessage]);

  return {
    handleSubmit,
    handleDeleteMessage: handleDeleteMessageById
  };
};
