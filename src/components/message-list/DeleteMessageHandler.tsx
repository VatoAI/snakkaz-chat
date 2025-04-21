
import { useToast } from "@/components/ui/use-toast";
import { DecryptedMessage } from "@/types/message";
import { useState } from "react";
import { DeleteMessageDialog } from "../message/DeleteMessageDialog";

interface DeleteMessageHandlerProps {
  onDeleteMessage: (messageId: string) => Promise<void> | void;
}

export function useDeleteMessageHandler({ onDeleteMessage }: DeleteMessageHandlerProps) {
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (confirmDelete && onDeleteMessage) {
      try {
        await onDeleteMessage(confirmDelete);
        toast({
          title: "Melding slettet",
          description: "Meldingen ble slettet",
        });
      } catch {
        toast({
          title: "Feil",
          description: "Kunne ikke slette meldingen",
          variant: "destructive",
        });
      }
      setConfirmDelete(null);
    }
  };

  // Embed the dialog UI
  const DialogUI = (
    <DeleteMessageDialog
      isOpen={!!confirmDelete}
      onClose={() => setConfirmDelete(null)}
      onConfirm={handleDelete}
    />
  );

  return { confirmDelete, setConfirmDelete, DialogUI };
}
