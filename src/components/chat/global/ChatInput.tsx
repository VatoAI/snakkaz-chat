
import { MessageInput } from "@/components/MessageInput";
import { FormEvent } from "react";

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
  return (
    <div className="p-2 sm:p-4 border-t border-cybergold-500/30">
      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSubmit={onSubmit}
        isLoading={isLoading}
        ttl={ttl}
        setTtl={setTtl}
        editingMessage={editingMessage}
        onCancelEdit={onCancelEdit}
      />
    </div>
  );
};
