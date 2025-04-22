
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
  // Remove the early return that's causing the React hooks error
  // Instead, handle empty messages within the render
  
  return (
    <div className="relative group space-y-1">
      {messages && messages.length > 0 ? (
        messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={isUserMessage(message)}
            onMessageExpired={onMessageExpired}
            onEditMessage={onEditMessage}
            onDeleteMessage={onDeleteMessage}
            userStatus={getUserStatus(message.sender.id)}
          />
        ))
      ) : null}
    </div>
  );
};
