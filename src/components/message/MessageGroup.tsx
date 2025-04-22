
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
  // Always call hooks unconditionally - don't return early before calling hooks
  const { messages: safeMessages, getUserStatus } = useMessageGrouping({ 
    messages, 
    userPresence 
  });
  
  // No early returns - render conditionally instead
  return (
    <>
      {safeMessages && safeMessages.length > 0 ? (
        <MessageGroupContent
          messages={safeMessages}
          isUserMessage={isUserMessage}
          onMessageExpired={onMessageExpired}
          onEditMessage={onEditMessage}
          onDeleteMessage={onDeleteMessage}
          getUserStatus={getUserStatus}
        />
      ) : null}
    </>
  );
};
