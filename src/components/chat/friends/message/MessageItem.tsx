
import { DecryptedMessage } from "@/types/message";
import { UserStatus } from "@/types/presence";
import { SecurityLevel } from "@/types/security";
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
  securityLevel?: SecurityLevel;
}

export const MessageItem = ({
  message,
  isCurrentUser,
  isMessageRead,
  usingServerFallback,
  onEditMessage,
  onDeleteMessage,
  userStatus,
  onMessageExpired,
  securityLevel = 'server_e2ee'
}: MessageItemProps) => {
  // Handle invalid message with a placeholder
  if (!message || !message.id || !message.sender) {
    return <div className="hidden"></div>;
  }

  return (
    <MessageContainer 
      isCurrentUser={isCurrentUser}
      isDeleted={message.is_deleted || false}
      message={message}
      onMessageExpired={onMessageExpired}
      securityLevel={securityLevel}
    >
      <MessageBodyContent
        message={message}
        isCurrentUser={isCurrentUser}
        isMessageRead={isMessageRead}
        usingServerFallback={usingServerFallback}
        userStatus={userStatus}
        onMessageExpired={onMessageExpired}
        securityLevel={securityLevel}
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
