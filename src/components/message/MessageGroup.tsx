
import { DecryptedMessage } from "@/types/message";
import { MessageBubble } from "./MessageBubble";
import { UserPresence, UserStatus } from "@/types/presence";

interface MessageGroupProps {
  messages: DecryptedMessage[];
  isUserMessage: (message: DecryptedMessage) => boolean;
  onMessageExpired: (messageId: string) => void;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
  userPresence?: Record<string, UserPresence>; // Add userPresence prop
}

export const MessageGroup = ({
  messages,
  isUserMessage,
  onMessageExpired,
  onEditMessage,
  onDeleteMessage,
  userPresence = {} // Add default value
}: MessageGroupProps) => {
  if (!messages || messages.length === 0) return null;

  // Get the sender for the time display (header)
  const firstMessage = messages[0];
  const senderName = firstMessage.sender?.username || firstMessage.sender?.id?.substring(0, 8) || 'Unknown';
  const date = new Date(firstMessage.created_at);
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Get user status from presence data
  const getUserStatus = (userId: string): UserStatus | undefined => {
    return userPresence[userId]?.status;
  };

  return (
    <div className="relative group">
      <div className="text-xs text-center mb-2 text-cyberdark-400">
        <span className="px-2 py-0.5 rounded-full bg-cyberdark-800/50 backdrop-blur-sm">
          {senderName} • {timeString}
        </span>
      </div>
      <div className="space-y-2">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={isUserMessage(message)}
            onMessageExpired={onMessageExpired}
            onEditMessage={onEditMessage}
            onDeleteMessage={onDeleteMessage}
            userStatus={getUserStatus(message.sender.id)} // Pass user status
          />
        ))}
      </div>
    </div>
  );
};
