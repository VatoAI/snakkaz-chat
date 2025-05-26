import { useEffect, useRef, useState } from "react";
import { groupMessagesByTime } from "@/utils/messageUtils";
import { MessageListContent } from "@/components/message/MessageListContent";
import { UnreadCounter } from "./UnreadCounter";
import { DecryptedMessage } from "@/types/message";
import { UserPresence } from "@/types/presence";
import { useDeleteMessageHandler } from "./DeleteMessageHandler";
import { ScrollStabilizer } from "@/components/chat/ScrollStabilizer";
import { LoadMoreMessages } from "@/components/message/LoadMoreMessages";

interface MessageListProps {
  messages: DecryptedMessage[];
  onMessageExpired: (messageId: string) => void;
  currentUserId: string | null;
  onEditMessage: (message: DecryptedMessage) => void;
  onDeleteMessage: (messageId: string) => void;
  userPresence?: Record<string, UserPresence>;

  // Pagination props
  loadMoreMessages?: () => Promise<void>;
  hasMoreMessages?: boolean;
  isLoadingMoreMessages?: boolean;
}

export const MessageList = ({
  messages,
  onMessageExpired,
  currentUserId,
  onEditMessage,
  onDeleteMessage,
  userPresence = {},

  // Pagination props with defaults
  loadMoreMessages = async () => { },
  hasMoreMessages = false,
  isLoadingMoreMessages = false
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [scrollToBottom, setScrollToBottom] = useState(false);

  // Use the delete message handler hook
  const { confirmDelete, setConfirmDelete, handleDelete, isDeleting } = useDeleteMessageHandler({
    onDeleteMessage
  });

  const isMobile = window.innerWidth < 768;

  // Handle new messages - calculate if we need to show unread counter
  useEffect(() => {
    if (isAtBottom) {
      setNewMessageCount(0);
    } else if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (
        currentUserId &&
        lastMessage.sender.id !== currentUserId &&
        new Date().getTime() - new Date(lastMessage.created_at).getTime() <
        60000
      ) {
        setNewMessageCount((prev) => prev + 1);
      }
    }
  }, [messages.length, isAtBottom, currentUserId, messages]);

  // Group messages by time blocks (e.g., messages within 5 minutes)
  const messageGroups = groupMessagesByTime(messages);

  const isUserMessage = (message: DecryptedMessage) =>
    message.sender.id === currentUserId;

  const handleScrollToBottom = () => {
    setScrollToBottom(true);
    setNewMessageCount(0);
    setAutoScroll(true);

    // Reset the scrollToBottom flag after it's been consumed
    setTimeout(() => {
      setScrollToBottom(false);
    }, 100);
  };

  // Handle scroll events from the ScrollStabilizer
  const handleScrollStateChange = (atBottom: boolean) => {
    setIsAtBottom(atBottom);
    setAutoScroll(atBottom);
    if (atBottom) {
      setNewMessageCount(0);
    }
  };

  // Handler for loading more messages
  const handleLoadMore = async () => {
    if (loadMoreMessages && typeof loadMoreMessages === 'function') {
      await loadMoreMessages();
    }
  };

  // Render the message list UI with the ScrollStabilizer
  return (
    <ScrollStabilizer
      className="h-full scrollbar-thin scrollbar-thumb-cyberblue-500/40 scrollbar-track-transparent relative"
      scrollToBottom={scrollToBottom || autoScroll}
      recomputeKey={messages.length}
      threshold={100}
      debug={false}
      onScrollStateChange={handleScrollStateChange}
    >
      {/* Load More Messages button at the top */}
      {hasMoreMessages && (
        <LoadMoreMessages
          onClick={handleLoadMore}
          isLoading={isLoadingMoreMessages}
          hasMore={hasMoreMessages}
          className="sticky top-0 z-10"
        />
      )}

      <MessageListContent
        messageGroups={messageGroups}
        isUserMessage={isUserMessage}
        onMessageExpired={onMessageExpired}
        onEdit={onEditMessage}
        onDelete={(id) => setConfirmDelete(id)}
        messagesEndRef={messagesEndRef}
        isMobile={isMobile}
        autoScroll={autoScroll}
        handleScrollToBottom={handleScrollToBottom}
        newMessageCount={newMessageCount}
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        handleDelete={handleDelete}
        isDeleting={isDeleting}
        userPresence={userPresence}
      />

      {!autoScroll && newMessageCount > 0 && (
        <UnreadCounter
          count={newMessageCount}
          onClick={handleScrollToBottom}
          show={true}
        />
      )}
    </ScrollStabilizer>
  );
};
