
import { MessageInput } from "@/components/message-input";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  ttl: number | null;
  setTtl: (ttl: number | null) => void;
  editingMessage: { id: string; content: string } | null;
  onCancelEdit: () => void;
}

export const ChatInput = ({
  newMessage,
  setNewMessage,
  onSubmit,
  isLoading,
  ttl,
  setTtl,
  editingMessage,
  onCancelEdit
}: ChatInputProps) => {
  const handleSendMessage = async (message: string) => {
    // Update the newMessage state through the parent component
    setNewMessage(message);
    // Create a synthetic form event to maintain compatibility with onSubmit
    const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
    await onSubmit(syntheticEvent);
    return;
  };

  return (
    <div className="p-2 sm:p-4 border-t border-cybergold-500/30">
      <MessageInput
        onSendMessage={handleSendMessage}
        placeholder="Skriv en melding..."
        disabled={isLoading}
        editingMessageId={editingMessage?.id}
        editingContent={editingMessage?.content}
        onCancelEdit={onCancelEdit}
        autoFocus={true}
      />
    </div>
  );
};
