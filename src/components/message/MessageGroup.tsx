
import { DecryptedMessage } from "@/types/message";
import { MessageBubble } from "./MessageBubble";
import { UserPresence, UserStatus } from "@/types/presence";

interface MessageGroupProps {
  messages: DecryptedMessage[];
  isUserMessage: (message: DecryptedMessage) => boolean;
  onMessageExpired: (messageId: string) => void;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
  userPresence?: Record<string, UserPresence>;
}

export const MessageGroup = ({
  messages,
  isUserMessage,
  onMessageExpired,
  onEditMessage,
  onDeleteMessage,
  userPresence = {}
}: MessageGroupProps) => {
  if (!messages || messages.length === 0) return null;

  const getUserStatus = (userId: string): UserStatus | undefined => {
    return userPresence[userId]?.status;
  };

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
