
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

  const firstMessage = messages[0];
  const senderName = firstMessage.sender?.username || firstMessage.sender?.id?.substring(0, 8) || 'Unknown';
  const date = new Date(firstMessage.created_at);
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getUserStatus = (userId: string): UserStatus | undefined => {
    return userPresence[userId]?.status;
  };

  return (
    <div className="relative group py-2">
      <div className="flex items-center justify-center mb-3">
        <div className="px-3 py-1 rounded-full bg-cyberdark-800/80 backdrop-blur-sm border border-cybergold-500/20 shadow-neon-gold/10">
          <span className="text-xs font-medium text-cybergold-300">
            {senderName} • {timeString}
          </span>
        </div>
      </div>
      
      <div className="space-y-1">
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
    </div>
  );
};
