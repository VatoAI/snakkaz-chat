
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
  const { getUserStatus } = useMessageGrouping({ 
    messages, 
    userPresence 
  });

  // Move the conditional return after all hooks have been called
  if (!messages || messages.length === 0) return null;

  return (
    <MessageGroupContent
      messages={messages}
      isUserMessage={isUserMessage}
      onMessageExpired={onMessageExpired}
      onEditMessage={onEditMessage}
      onDeleteMessage={onDeleteMessage}
      getUserStatus={getUserStatus}
    />
  );
};
