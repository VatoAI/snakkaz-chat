
import { memo } from "react";
import { DecryptedMessage } from "@/types/message";
import { MessageContent } from "./MessageContent";
import { MessageBubble } from "./MessageBubble";
import { MessageActions } from "./MessageActions";

interface MessageGroupProps {
  messages: DecryptedMessage[];
  isCurrentUser: boolean;
  onMessageExpired: (messageId: string) => void;
  onEdit: (message: DecryptedMessage) => void;
  onDelete: (messageId: string) => void;
  isMobile?: boolean;
}

// Use memo to prevent unnecessary rerenders
export const MessageGroup = memo(({
  messages,
  isCurrentUser,
  onMessageExpired,
  onEdit,
  onDelete,
  isMobile = false,
}: MessageGroupProps) => {
  if (!messages || messages.length === 0) return null;

  // First message in group
  const firstMessage = messages[0];

  // Get username for this group
  const username = firstMessage.sender?.username || firstMessage.sender?.full_name || "Unknown";

  // Avatar URL for this message group
  const avatarUrl = firstMessage.sender?.avatar_url || "/placeholder.svg";

  return (
    <div className="message-group flex flex-col transition-opacity">
      {/* Sender info */}
      <div className={`flex items-center gap-2 mb-1 px-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
        {!isCurrentUser && (
          <div className="flex-shrink-0 w-6 h-6 overflow-hidden rounded-full bg-cyberdark-700">
            <img
              src={avatarUrl}
              alt={username}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>
        )}
        <span className={`text-xs ${isCurrentUser ? "text-cyberblue-300" : "text-cyberred-300"}`}>
          {username}
        </span>
      </div>

      {/* Messages */}
      <div className={`flex flex-col gap-1 ${isCurrentUser ? "items-end" : "items-start"}`}>
        {messages.map((message, messageIndex) => (
          <div
            key={message.id}
            className={`group relative max-w-[85%] ${isMobile ? "max-w-[90%]" : ""}`}
          >
            <MessageBubble 
              message={message}
              isCurrentUser={isCurrentUser}
              messageIndex={messageIndex}
              onMessageExpired={onMessageExpired}
              onEdit={onEdit}
              onDelete={onDelete}
            />

            {isCurrentUser && !message.is_deleted && (
              <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MessageActions 
                  message={message} 
                  onEdit={onEdit} 
                  onDelete={onDelete}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

MessageGroup.displayName = 'MessageGroup';
