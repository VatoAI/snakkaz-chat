
import { memo } from "react";
import { DecryptedMessage } from "@/types/message";
import { UserStatus } from "@/types/presence";
import { SecurityLevel } from "@/types/security";
import { MessageItem } from "@/components/chat/friends/message/MessageItem";

interface MessageBubbleProps {
  message: DecryptedMessage;
  isCurrentUser: boolean;
  onMessageExpired?: (messageId: string) => void;
  isMessageRead?: (messageId: string) => boolean;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
  userStatus?: UserStatus;
  securityLevel?: SecurityLevel;
}

export const MessageBubble = memo(({
  message,
  isCurrentUser,
  onMessageExpired,
  isMessageRead,
  onEditMessage,
  onDeleteMessage,
  userStatus,
  securityLevel = 'server_e2ee'
}: MessageBubbleProps) => {
  // Always define handler functions regardless of if message is valid
  const handleDeleteMessageWithConfirmation = (messageId: string) => {
    if (onDeleteMessage) {
      onDeleteMessage(messageId);
    }
  };

  const usingServerFallback = false;

  // Do not return null even if message is invalid - render a placeholder instead
  if (!message || !message.id) {
    return <div className="hidden"></div>;
  }

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
        securityLevel={securityLevel}
      />
    </div>
  );
});

MessageBubble.displayName = "MessageBubble";
