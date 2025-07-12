
import { useState } from "react";
import { DecryptedMessage } from "@/types/message";
import { useToast } from "@/components/ui/use-toast";

export const useMessageActions = (
  userId: string | null, 
  handleEditMessage: (messageId: string, content: string) => Promise<void>,
  handleDeleteMessage: (messageId: string) => Promise<void>
) => {
  const [editingMessage, setEditingMessage] = useState<{ id: string; content: string } | null>(null);
  const { toast } = useToast();

  const handleStartEditMessage = (message: DecryptedMessage | { id: string; content: string }) => {
    // Allow editing for your own messages
    if ('sender' in message) {
      if (message.sender.id === userId) {
        if (editingMessage && editingMessage.id === message.id) {
          setEditingMessage(null);
        } else {
          setEditingMessage({ id: message.id, content: message.content });
        }
        return message.content;
      }
    } else {
      // Already in simplified format, just set it
      setEditingMessage(message);
      return message.content;
    }
    return "";
  };

  const handleCancelEditMessage = () => {
    setEditingMessage(null);
  };

  const handleSubmitEditMessage = async (newMessage: string) => {
    if (!editingMessage || !newMessage.trim()) {
      return;
    }
    
    try {
      console.log("Submitting edited message:", editingMessage.id, newMessage);
      await handleEditMessage(editingMessage.id, newMessage);
      toast({
        title: "Melding redigert",
        description: "Meldingen ble oppdatert",
      });
      setEditingMessage(null);
    } catch (error) {
      console.error("Error editing message:", error);
      toast({
        title: "Feil",
        description: "Kunne ikke redigere meldingen",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessageById = async (messageId: string) => {
    try {
      console.log("Deleting message with ID:", messageId);
      await handleDeleteMessage(messageId);
      toast({
        title: "Melding slettet",
        description: "Meldingen ble slettet",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Feil",
        description: "Kunne ikke slette meldingen",
        variant: "destructive",
      });
    }
  };

  return {
    editingMessage,
    handleStartEditMessage,
    handleCancelEditMessage,
    handleSubmitEditMessage,
    handleDeleteMessageById
  };
};
