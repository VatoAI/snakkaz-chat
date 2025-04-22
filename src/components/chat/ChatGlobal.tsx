
import { MessageList } from "@/components/message-list/MessageList";
import { MessageInput } from "@/components/MessageInput";
import { DecryptedMessage } from "@/types/message";
import { UserPresence } from "@/types/presence";

interface ChatGlobalProps {
  messages: DecryptedMessage[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  isLoading: boolean;
  ttl: number | null;
  setTtl: (ttl: number | null) => void;
  onMessageExpired: (messageId: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  currentUserId: string | null;
  editingMessage: { id: string; content: string } | null;
  onEditMessage: (message: { id: string; content: string }) => void;
  onCancelEdit: () => void;
  onDeleteMessage: (messageId: string) => void;
  userPresence: Record<string, UserPresence>;  // Ensure this prop is required
}

export const ChatGlobal = ({
  messages,
  newMessage,
  setNewMessage,
  isLoading,
  ttl,
  setTtl,
  onMessageExpired,
  onSubmit,
  currentUserId,
  editingMessage,
  onEditMessage,
  onCancelEdit,
  onDeleteMessage,
  userPresence
}: ChatGlobalProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <MessageList 
          messages={messages} 
          onMessageExpired={onMessageExpired}
          currentUserId={currentUserId}
          onEditMessage={onEditMessage}
          onDeleteMessage={onDeleteMessage}
          userPresence={userPresence}  // Pass user presence data
        />
      </div>

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
    </div>
  );
};
