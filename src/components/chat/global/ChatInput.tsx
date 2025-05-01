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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(e);
    return true;
  };

  return (
    <div className="p-2 sm:p-4 border-t border-cybergold-500/30">
      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        ttl={ttl}
        setTtl={setTtl}
        editingMessage={editingMessage}
        onCancelEdit={onCancelEdit}
      />
    </div>
  );
};
