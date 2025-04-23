
import { useEffect, useRef, useState } from "react";
import { groupMessagesByTime } from "@/utils/messageUtils";
import { MessageListContent } from "@/components/message/MessageListContent";
import { UnreadCounter } from "./UnreadCounter";
import { DecryptedMessage } from "@/types/message";
import { UserPresence } from "@/types/presence"; 
import { useDeleteMessageHandler } from "./DeleteMessageHandler";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Use the delete message handler hook
  const { confirmDelete, setConfirmDelete, DialogUI, isDeleting } = useDeleteMessageHandler({
    onDeleteMessage
  });

  // Handle scrolling behavior
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const scrolledToBottom = scrollHeight - scrollTop - clientHeight < 50;
    setIsAtBottom(scrolledToBottom);
    if (scrolledToBottom) {
      setAutoScroll(true);
      setNewMessageCount(0);
    } else {
      setAutoScroll(false);
    }
  };

  const scrollDownIfNeeded = () => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isMobile = window.innerWidth < 768;

  // Pull-to-refresh hook for mobile - fix argument count
  const pullToRefreshProps = {
    scrollAreaRef: containerRef,
    onRefresh: () => console.log("Refresh triggered")
  };

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
  }, [messages.length, isAtBottom, currentUserId, messages]);

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
