
import { useToast } from "@/components/ui/use-toast";
import { DecryptedMessage } from "@/types/message";
import { useState, useCallback } from "react";
import { DeleteMessageDialog } from "../message/DeleteMessageDialog";

interface DeleteMessageHandlerProps {
  onDeleteMessage: (messageId: string) => Promise<void> | void;
}

export function useDeleteMessageHandler({ onDeleteMessage }: DeleteMessageHandlerProps) {
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!confirmDelete || isDeleting) return;
    
    setIsDeleting(true);
    try {
      // Optimistically update local state (will be handled by parent components)
      await onDeleteMessage(confirmDelete);
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
    } finally {
      setIsDeleting(false);
      setConfirmDelete(null);
    }
  }, [confirmDelete, onDeleteMessage, toast, isDeleting]);

  // Embed the dialog UI
  const DialogUI = (
    <DeleteMessageDialog
      isOpen={!!confirmDelete}
      onClose={() => {
        if (!isDeleting) setConfirmDelete(null);
      }}
      onConfirm={handleDelete}
      isDeleting={isDeleting}
    />
  );

  return { confirmDelete, setConfirmDelete, DialogUI, isDeleting };
}
