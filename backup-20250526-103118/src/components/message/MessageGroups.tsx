
import { DecryptedMessage } from "@/types/message";
import { MessageGroup } from "./MessageGroup";
import { UserPresence } from "@/types/presence";

interface MessageGroupsProps {
  messageGroups: DecryptedMessage[][];
  isUserMessage: (message: DecryptedMessage) => boolean;
  onMessageExpired: (messageId: string) => void;
  onEdit: (message: DecryptedMessage) => void;
  onDelete: (messageId: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isMobile: boolean;
  userPresence?: Record<string, UserPresence>; // Add userPresence prop
}

export const MessageGroups = ({
  messageGroups,
  isUserMessage,
  onMessageExpired,
  onEdit,
  onDelete,
  messagesEndRef,
  isMobile,
  userPresence = {} // Add default value
}: MessageGroupsProps) => {
  return (
    <div className="p-2 sm:p-4 space-y-6">
      {messageGroups.map((messages, groupIndex) => (
        <MessageGroup
          key={groupIndex}
          messages={messages}
          isUserMessage={isUserMessage}
          onMessageExpired={onMessageExpired}
          onEditMessage={onEdit}
          onDeleteMessage={onDelete}
          userPresence={userPresence} // Pass userPresence to MessageGroup
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
