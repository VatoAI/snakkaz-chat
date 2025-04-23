
import { MessageList } from "@/components/message-list/MessageList";
import { DecryptedMessage } from "@/types/message";
import { UserPresence } from "@/types/presence";

interface ChatMessagesProps {
  messages: DecryptedMessage[];
  onMessageExpired: (messageId: string) => void;
  currentUserId: string | null;
  onEditMessage: (message: { id: string; content: string }) => void;
  onDeleteMessage: (messageId: string) => void;
  userPresence: Record<string, UserPresence>;
}

export const ChatMessages = ({
  messages,
  onMessageExpired,
  currentUserId,
  onEditMessage,
  onDeleteMessage,
  userPresence
}: ChatMessagesProps) => {
  return (
    <div className="flex-1 overflow-hidden">
      <MessageList 
        messages={messages} 
        onMessageExpired={onMessageExpired}
        currentUserId={currentUserId}
        onEditMessage={onEditMessage}
        onDeleteMessage={onDeleteMessage}
        userPresence={userPresence}
      />
    </div>
  );
};
