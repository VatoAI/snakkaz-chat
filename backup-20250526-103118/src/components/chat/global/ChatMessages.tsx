import { MessageList } from "@/components/message-list/MessageList";
import { DecryptedMessage } from "@/types/message";
import { UserPresence } from "@/types/presence";

interface ChatMessagesProps {
  messages: DecryptedMessage[];
  onMessageExpired: (messageId: string) => void;
  currentUserId: string | null;
  onEditMessage: (message: DecryptedMessage) => void;
  onDeleteMessage: (messageId: string) => void;
  userPresence: Record<string, UserPresence>;

  // Pagination props
  loadMoreMessages?: () => Promise<void>;
  hasMoreMessages?: boolean;
  isLoadingMoreMessages?: boolean;
}

export const ChatMessages = ({
  messages,
  onMessageExpired,
  currentUserId,
  onEditMessage,
  onDeleteMessage,
  userPresence,
  loadMoreMessages,
  hasMoreMessages,
  isLoadingMoreMessages
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
        loadMoreMessages={loadMoreMessages}
        hasMoreMessages={hasMoreMessages}
        isLoadingMoreMessages={isLoadingMoreMessages}
      />
    </div>
  );
};
