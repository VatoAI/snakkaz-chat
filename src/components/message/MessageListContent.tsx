
import { DecryptedMessage } from "@/types/message";
import { MessageListHeader } from "./MessageListHeader";
import { MessageGroups } from "./MessageGroups";
import { ScrollToBottomButton } from "./ScrollToBottomButton";
import { DeleteMessageDialog } from "./DeleteMessageDialog";
import { memo } from 'react';
import { UserPresence } from "@/types/presence";

interface MessageListContentProps {
  messageGroups: DecryptedMessage[][];
  isUserMessage: (message: DecryptedMessage) => boolean;
  onMessageExpired: (messageId: string) => void;
  onEdit: (message: DecryptedMessage) => void;
  onDelete: (id: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isMobile: boolean;
  autoScroll: boolean;
  handleScrollToBottom: () => void;
  newMessageCount: number;
  confirmDelete: string | null;
  setConfirmDelete: (id: string | null) => void;
  handleDelete: () => Promise<void>;
  isDeleting?: boolean;
  userPresence?: Record<string, UserPresence>; // Add userPresence as optional prop
}

// Use React.memo to prevent unnecessary re-renders
export const MessageListContent = memo(({
  messageGroups,
  isUserMessage,
  onMessageExpired,
  onEdit,
  onDelete,
  messagesEndRef,
  isMobile,
  autoScroll,
  handleScrollToBottom,
  newMessageCount,
  confirmDelete,
  setConfirmDelete,
  handleDelete,
  isDeleting = false,
  userPresence = {} // Add default value
}: MessageListContentProps) => {
  return (
    <>
      <MessageListHeader />

      <MessageGroups
        messageGroups={messageGroups}
        isUserMessage={isUserMessage}
        onMessageExpired={onMessageExpired}
        onEdit={onEdit}
        onDelete={onDelete}
        messagesEndRef={messagesEndRef}
        isMobile={isMobile}
        userPresence={userPresence} // Pass userPresence to MessageGroups
      />

      <ScrollToBottomButton
        show={!autoScroll}
        onClick={handleScrollToBottom}
        unreadCount={newMessageCount}
      />

      <DeleteMessageDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
});

MessageListContent.displayName = 'MessageListContent';
