import { useEffect, useRef, useState } from "react";
import { groupMessagesByTime } from "@/utils/messageUtils";
import { MessageListContent } from "@/components/message/MessageListContent";
import { UnreadCounter } from "./UnreadCounter";
import { DecryptedMessage } from "@/types/message";
import { UserPresence } from "@/types/presence"; 
import { useDeleteMessageHandler } from "./DeleteMessageHandler";
import { ScrollStabilizer } from "@/components/chat/ScrollStabilizer";

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
  const [autoScroll, setAutoScroll] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [scrollToBottom, setScrollToBottom] = useState(false);

  // Use the delete message handler hook
  const { confirmDelete, setConfirmDelete, DialogUI, isDeleting } = useDeleteMessageHandler({
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

  const handleDelete = async () => {
    if (confirmDelete) {
      await onDeleteMessage(confirmDelete);
      setConfirmDelete(null);
    }
  };
  
  // Handle scroll events from the ScrollStabilizer
  const handleScrollStateChange = (atBottom: boolean) => {
    setIsAtBottom(atBottom);
    setAutoScroll(atBottom);
    if (atBottom) {
      setNewMessageCount(0);
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

      <UnreadCounter count={newMessageCount} show={!autoScroll} onClick={handleScrollToBottom} />
      <div ref={messagesEndRef} />
    </ScrollStabilizer>
  );
};
