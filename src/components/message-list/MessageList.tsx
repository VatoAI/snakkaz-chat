
import { useEffect, useCallback, useMemo } from "react";
import { DecryptedMessage } from "@/types/message";
import { groupMessages } from "@/utils/message-grouping";
import { useIsMobile } from "@/hooks/use-mobile";
import { playNotificationSound } from "@/utils/sound-manager";
import { MessageScrollArea } from "@/components/message/MessageScrollArea";
import { MessageListContent } from "@/components/message/MessageListContent";
import { useScrollHandler } from "./useScrollHandler";
import { useMobilePullToRefresh } from "./useMobilePullToRefresh";
import { useDeleteMessageHandler } from "./DeleteMessageHandler";
import { UserPresence } from "@/types/presence";

interface MessageListProps {
  messages: DecryptedMessage[];
  onMessageExpired?: (messageId: string) => void;
  currentUserId?: string | null;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
  userPresence?: Record<string, UserPresence>;
}

export const MessageList = ({
  messages: initialMessages,
  onMessageExpired,
  currentUserId,
  onEditMessage,
  onDeleteMessage,
  userPresence = {}
}: MessageListProps) => {
  const isMobile = useIsMobile();

  // Use memoized version of grouped messages to prevent unnecessary re-renders
  const validMessages = useMemo(() => 
    initialMessages.filter(msg => msg && msg.sender), 
    [initialMessages]
  );
  
  const messageGroups = useMemo(() => 
    groupMessages(validMessages),
    [validMessages]
  );

  // Scroll and unread logic
  const {
    messagesEndRef,
    scrollAreaRef,
    autoScroll,
    setAutoScroll,
    wasScrolledToBottom,
    setWasScrolledToBottom,
    newMessageCount,
    setNewMessageCount,
    lastMessageCountRef,
    handleScroll,
    handleScrollToBottom,
  } = useScrollHandler({ isMobile, initialMessagesCount: initialMessages.length });

  // Delete confirmation dialog state with optimistic updates
  const { confirmDelete, setConfirmDelete, DialogUI, isDeleting } = useDeleteMessageHandler({ 
    onDeleteMessage: async (messageId) => {
      if (onDeleteMessage) {
        // Return the promise to allow for proper error handling
        return onDeleteMessage(messageId);
      }
    }
  });

  // Mobile pull-to-refresh
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useMobilePullToRefresh({
    scrollAreaRef,
    onRefresh: () => {
      if (onMessageExpired) onMessageExpired('refresh');
    },
  });

  // New messages and scroll
  useEffect(() => {
    const messagesChanged = initialMessages.length !== lastMessageCountRef.current;
    const newMessages = initialMessages.length > lastMessageCountRef.current;
    if (messagesChanged) {
      lastMessageCountRef.current = initialMessages.length;
      if (newMessages) {
        if (autoScroll) {
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: isMobile ? 'auto' : 'smooth' });
          }, 100);
        } else {
          setNewMessageCount(
            (prev) => prev + (initialMessages.length - lastMessageCountRef.current)
          );
          if (!wasScrolledToBottom) {
            playNotificationSound();
          }
        }
      }
    }
  }, [initialMessages.length, autoScroll, wasScrolledToBottom, isMobile, lastMessageCountRef, messagesEndRef, setNewMessageCount]);

  const isUserMessage = useCallback(
    (message: DecryptedMessage) =>
      message?.sender && currentUserId ? message.sender.id === currentUserId : false,
    [currentUserId]
  );

  const handleMessageExpired = useCallback((messageId: string) => {
    if (onMessageExpired) onMessageExpired(messageId);
  }, [onMessageExpired]);
  
  const handleEdit = useCallback((message: DecryptedMessage) => {
    if (onEditMessage) onEditMessage(message);
  }, [onEditMessage]);

  return (
    <MessageScrollArea
      onScrollBottom={() => setNewMessageCount(0)}
      setAutoScroll={setAutoScroll}
      setWasScrolledToBottom={setWasScrolledToBottom}
      wasScrolledToBottom={wasScrolledToBottom}
      autoScroll={autoScroll}
      scrollAreaRef={scrollAreaRef}
    >
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ height: "100%", width: "100%" }}
      >
        <MessageListContent
          messageGroups={messageGroups}
          isUserMessage={isUserMessage}
          onMessageExpired={handleMessageExpired}
          onEdit={handleEdit}
          onDelete={setConfirmDelete}
          messagesEndRef={messagesEndRef}
          isMobile={isMobile}
          autoScroll={autoScroll}
          handleScrollToBottom={handleScrollToBottom}
          newMessageCount={newMessageCount}
          confirmDelete={confirmDelete}
          setConfirmDelete={setConfirmDelete}
          handleDelete={DialogUI.props.onConfirm}
          isDeleting={isDeleting}
          userPresence={userPresence}
        />
        {DialogUI}
      </div>
    </MessageScrollArea>
  );
};
