
import { DecryptedMessage } from "@/types/message";
import { MessageGroup } from "./MessageGroup";
import { memo } from 'react';

interface MessageGroupsProps {
  messageGroups: DecryptedMessage[][];
  isUserMessage: (message: DecryptedMessage) => boolean;
  onMessageExpired: (messageId: string) => void;
  onEdit: (message: DecryptedMessage) => void;
  onDelete: (messageId: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isMobile?: boolean;
}

// Use React.memo to prevent unnecessary re-renders
export const MessageGroups = memo(({ 
  messageGroups, 
  isUserMessage, 
  onMessageExpired, 
  onEdit, 
  onDelete, 
  messagesEndRef,
  isMobile = false
}: MessageGroupsProps) => {
  return (
    <div className={`space-y-2 ${isMobile ? 'pb-16' : 'sm:space-y-4'}`}>
      {messageGroups.map((group, groupIndex) => (
        group.length > 0 && (
          <MessageGroup
            key={`group-${groupIndex}-${group[0]?.id || groupIndex}`}
            messages={group}
            isCurrentUser={isUserMessage(group[0])}
            onMessageExpired={onMessageExpired}
            onEdit={onEdit}
            onDelete={onDelete}
            isMobile={isMobile}
          />
        )
      ))}
      <div ref={messagesEndRef} className="h-1" />
    </div>
  );
});

MessageGroups.displayName = 'MessageGroups';
