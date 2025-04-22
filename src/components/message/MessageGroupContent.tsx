
import { DecryptedMessage } from "@/types/message";
import { MessageBubble } from "./MessageBubble";
import { UserStatus } from "@/types/presence";
import { SecurityLevel } from "@/types/security";

interface MessageGroupContentProps {
  messages: DecryptedMessage[];
  isUserMessage: (message: DecryptedMessage) => boolean;
  onMessageExpired: (messageId: string) => void;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
  getUserStatus: (userId: string) => UserStatus | undefined;
  securityLevel?: SecurityLevel;
}

export const MessageGroupContent = ({
  messages,
  isUserMessage,
  onMessageExpired,
  onEditMessage,
  onDeleteMessage,
  getUserStatus,
  securityLevel = 'server_e2ee'
}: MessageGroupContentProps) => {
  // Always render a container, even if messages is empty
  return (
    <div className="relative group space-y-1">
      {Array.isArray(messages) && messages.length > 0 ? (
        messages.map((message, index) => (
          message && message.sender ? (
            <MessageBubble
              key={message.id || `message-${index}`}
              message={message}
              isCurrentUser={isUserMessage(message)}
              onMessageExpired={onMessageExpired}
              onEditMessage={onEditMessage}
              onDeleteMessage={onDeleteMessage}
              userStatus={message.sender ? getUserStatus(message.sender.id) : undefined}
              securityLevel={securityLevel}
            />
          ) : (
            <div key={`empty-message-${index}`} className="hidden"></div>
          )
        ))
      ) : (
        <div className="hidden"></div>
      )}
    </div>
  );
};
