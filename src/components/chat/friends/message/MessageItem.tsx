
import { DecryptedMessage } from "@/types/message";
import { UserStatus } from "@/types/presence";
import { MessageContainer } from "./MessageContainer";
import { MessageBodyContent } from "./MessageBodyContent";
import { MessageActionsMenu } from "@/components/message/message-item/MessageActionsMenu";

interface MessageItemProps {
  message: DecryptedMessage;
  isCurrentUser: boolean;
  isMessageRead?: (messageId: string) => boolean;
  usingServerFallback: boolean;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
  userStatus?: UserStatus;
  onMessageExpired?: (messageId: string) => void;
}

export const MessageItem = ({
  message,
  isCurrentUser,
  isMessageRead,
  usingServerFallback,
  onEditMessage,
  onDeleteMessage,
  userStatus,
  onMessageExpired
}: MessageItemProps) => {
  // Handle invalid message with a placeholder
  if (!message || !message.id || !message.sender) {
    return <div className="hidden"></div>;
  }

  return (
    <MessageContainer 
      isCurrentUser={isCurrentUser}
      isDeleted={message.is_deleted}
      message={message}
      onMessageExpired={onMessageExpired}
    >
      <MessageBodyContent
        message={message}
        isCurrentUser={isCurrentUser}
        isMessageRead={isMessageRead}
        usingServerFallback={usingServerFallback}
        userStatus={userStatus}
        onMessageExpired={onMessageExpired}
      />
      
      {isCurrentUser && !message.is_deleted && (
        <MessageActionsMenu 
          message={message}
          onEditMessage={onEditMessage}
          onDeleteMessage={onDeleteMessage}
        />
      )}
    </MessageContainer>
  );
};
