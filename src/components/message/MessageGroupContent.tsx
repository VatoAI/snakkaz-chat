
import { DecryptedMessage } from "@/types/message";
import { MessageBubble } from "./MessageBubble";
import { UserStatus } from "@/types/presence";

interface MessageGroupContentProps {
  messages: DecryptedMessage[];
  isUserMessage: (message: DecryptedMessage) => boolean;
  onMessageExpired: (messageId: string) => void;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
  getUserStatus: (userId: string) => UserStatus | undefined;
}

export const MessageGroupContent = ({
  messages,
  isUserMessage,
  onMessageExpired,
  onEditMessage,
  onDeleteMessage,
  getUserStatus
}: MessageGroupContentProps) => {
  return (
    <div className="relative group space-y-1">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isCurrentUser={isUserMessage(message)}
          onMessageExpired={onMessageExpired}
          onEditMessage={onEditMessage}
          onDeleteMessage={onDeleteMessage}
          userStatus={getUserStatus(message.sender.id)}
        />
      ))}
    </div>
  );
};
