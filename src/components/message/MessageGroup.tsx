
import { DecryptedMessage } from "@/types/message";
import { UserPresence } from "@/types/presence";
import { useMessageGrouping } from "@/hooks/useMessageGrouping";
import { MessageGroupContent } from "./MessageGroupContent";

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
  const { messageGroups, getUserStatus } = useMessageGrouping({ 
    messages, 
    userPresence 
  });

  if (!messageGroups || messageGroups.length === 0) return null;

  return (
    <MessageGroupContent
      messages={messageGroups}
      isUserMessage={isUserMessage}
      onMessageExpired={onMessageExpired}
      onEditMessage={onEditMessage}
      onDeleteMessage={onDeleteMessage}
      getUserStatus={getUserStatus}
    />
  );
};
