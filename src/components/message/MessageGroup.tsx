
import { DecryptedMessage } from "@/types/message";
import { UserPresence } from "@/types/presence";
import { SecurityLevel } from "@/types/security";
import { useMessageGrouping } from "@/hooks/useMessageGrouping";
import { MessageGroupContent } from "./MessageGroupContent";

interface MessageGroupProps {
  messages: DecryptedMessage[];
  isUserMessage: (message: DecryptedMessage) => boolean;
  onMessageExpired: (messageId: string) => void;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
  userPresence?: Record<string, UserPresence>;
  securityLevel?: SecurityLevel;
}

export const MessageGroup = ({
  messages,
  isUserMessage,
  onMessageExpired,
  onEditMessage,
  onDeleteMessage,
  userPresence = {},
  securityLevel = 'server_e2ee'
}: MessageGroupProps) => {
  // Always call hooks unconditionally and at the top level
  const { messages: safeMessages, getUserStatus } = useMessageGrouping({ 
    messages, 
    userPresence 
  });
  
  // Render MessageGroupContent unconditionally
  return (
    <MessageGroupContent
      messages={safeMessages}
      isUserMessage={isUserMessage}
      onMessageExpired={onMessageExpired}
      onEditMessage={onEditMessage}
      onDeleteMessage={onDeleteMessage}
      getUserStatus={getUserStatus}
      securityLevel={securityLevel}
    />
  );
};
