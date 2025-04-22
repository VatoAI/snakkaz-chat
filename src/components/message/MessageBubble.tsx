
import { memo } from "react";
import { DecryptedMessage } from "@/types/message";
import { MessageContent } from "./MessageContent";
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
  userStatus?: UserStatus; // Add userStatus prop
}

export const MessageBubble = memo(({
  message,
  isCurrentUser,
  onMessageExpired,
  isMessageRead,
  onEditMessage,
  onDeleteMessage,
  userStatus // Add userStatus prop
}: MessageBubbleProps) => {
  const handleDeleteMessageWithConfirmation = (messageId: string) => {
    if (onDeleteMessage) {
      onDeleteMessage(messageId);
    }
  };

  const usingServerFallback = false; // This could be derived from the message or passed as a prop

  if (message.ephemeral_ttl) {
    return (
      <div className="relative group">
        <MessageItem
          message={message}
          isCurrentUser={isCurrentUser}
          isMessageRead={isMessageRead}
          usingServerFallback={usingServerFallback}
          onEditMessage={onEditMessage}
          onDeleteMessage={handleDeleteMessageWithConfirmation}
          userStatus={userStatus} // Pass userStatus to MessageItem
        />
        <MessageTimer 
          message={message} 
          onExpired={onMessageExpired} 
        />
      </div>
    );
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
        userStatus={userStatus} // Pass userStatus to MessageItem
      />
    </div>
  );
});

MessageBubble.displayName = "MessageBubble";
