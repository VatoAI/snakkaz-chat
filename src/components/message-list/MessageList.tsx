
import { useEffect, useRef, useState } from "react";
import { groupMessagesByTime } from "@/utils/messageUtils";
import { useMobilePullToRefresh } from "@/components/message-list/useMobilePullToRefresh";
import { useScrollHandler } from "@/components/message-list/useScrollHandler";
import { DeleteMessageHandler } from "@/components/message-list/DeleteMessageHandler";
import { MessageListContent } from "@/components/message/MessageListContent";
import { UnreadCounter } from "./UnreadCounter";
import { DecryptedMessage } from "@/types/message";
import { UserPresence } from "@/types/presence"; 

interface MessageListProps {
  messages: DecryptedMessage[];
  onMessageExpired: (messageId: string) => void;
  currentUserId: string | null;
  onEditMessage: (message: DecryptedMessage) => void;
  onDeleteMessage: (messageId: string) => void;
  userPresence?: Record<string, UserPresence>;
}

export const MessageList = ({
  messages,
  onMessageExpired,
  currentUserId,
  onEditMessage,
  onDeleteMessage,
  userPresence = {}
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const {
    containerRef,
    isAtBottom,
    scrollDownIfNeeded,
    handleScroll,
    autoScroll,
    setAutoScroll,
  } = useScrollHandler(messages, messagesEndRef);

  const isMobile = window.innerWidth < 768;

  // Pull-to-refresh hook for mobile
  useMobilePullToRefresh(containerRef);

  // Handle auto-scrolling when new messages arrive
  useEffect(() => {
    if (isAtBottom) {
      scrollDownIfNeeded();
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
  }, [messages.length, isAtBottom, scrollDownIfNeeded, messages, currentUserId]);

  // Group messages by time blocks (e.g., messages within 5 minutes)
  const messageGroups = groupMessagesByTime(messages);

  const isUserMessage = (message: DecryptedMessage) =>
    message.sender.id === currentUserId;

  const handleScrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setNewMessageCount(0);
      setAutoScroll(true);
    }
  };

  const handleDelete = async () => {
    if (confirmDelete) {
      await onDeleteMessage(confirmDelete);
      setConfirmDelete(null);
    }
  };

  // Render the message list UI
  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-cyberblue-500/40 scrollbar-track-transparent relative"
      onScroll={handleScroll}
    >
      <MessageListContent
        messageGroups={messageGroups}
        isUserMessage={isUserMessage}
        onMessageExpired={onMessageExpired}
        onEdit={onEditMessage}
        onDelete={setConfirmDelete}
        messagesEndRef={messagesEndRef}
        isMobile={isMobile}
        autoScroll={autoScroll}
        handleScrollToBottom={handleScrollToBottom}
        newMessageCount={newMessageCount}
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        handleDelete={handleDelete}
        userPresence={userPresence}
      />

      <UnreadCounter count={newMessageCount} show={!autoScroll} />
    </div>
  );
};
