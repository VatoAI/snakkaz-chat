
import { memo } from "react";
import { DecryptedMessage } from "@/types/message";
import { MessageTimer } from "./MessageTimer";
import { MessageActions } from "@/components/message/MessageActions";
import { UserStatus } from "@/types/presence";
import { MessageItem } from "@/components/chat/friends/message/MessageItem";

interface MessageBubbleProps {
  message: DecryptedMessage;
  isCurrentUser: boolean;
  onMessageExpired?: (messageId: string) => void;
  isMessageRead?: (messageId: string) => boolean;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
  userStatus?: UserStatus;
}

export const MessageBubble = memo(({
  message,
  isCurrentUser,
  onMessageExpired,
  isMessageRead,
  onEditMessage,
  onDeleteMessage,
  userStatus
}: MessageBubbleProps) => {
  // Ensure the component is safe even if message is invalid
  if (!message || !message.id) {
    return null;
  }

  const handleDeleteMessageWithConfirmation = (messageId: string) => {
    if (onDeleteMessage) {
      onDeleteMessage(messageId);
    }
  };

  const usingServerFallback = false;

  return (
    <div className="relative group">
      <MessageItem
        message={message}
        isCurrentUser={isCurrentUser}
        isMessageRead={isMessageRead}
        usingServerFallback={usingServerFallback}
        onEditMessage={onEditMessage}
        onDeleteMessage={handleDeleteMessageWithConfirmation}
        userStatus={userStatus}
        onMessageExpired={onMessageExpired}
      />
    </div>
  );
});

MessageBubble.displayName = "MessageBubble";
