
import { DecryptedMessage } from "@/types/message";
import { SecurityLevel } from "@/types/security";
import { ChatGlassPanel } from "../ChatGlassPanel";
import { DirectMessageList } from "../friends/DirectMessageList";
import { DirectMessageEmptyState } from "../friends/DirectMessageEmptyState";

interface DirectMessageContentProps {
  messages: DecryptedMessage[];
  currentUserId: string;
  peerIsTyping?: boolean;
  isMessageRead?: (messageId: string) => boolean;
  connectionState: string;
  dataChannelState: string;
  usingServerFallback: boolean;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
  securityLevel: SecurityLevel;
}

export const DirectMessageContent = ({
  messages,
  currentUserId,
  peerIsTyping,
  isMessageRead,
  connectionState,
  dataChannelState,
  usingServerFallback,
  onEditMessage,
  onDeleteMessage,
  securityLevel
}: DirectMessageContentProps) => {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <ChatGlassPanel className="flex-1 flex flex-col min-h-0">
        {messages.length === 0 ? (
          <DirectMessageEmptyState 
            usingServerFallback={usingServerFallback}
            securityLevel={securityLevel}
          />
        ) : (
          <DirectMessageList
            messages={messages}
            currentUserId={currentUserId}
            peerIsTyping={peerIsTyping}
            isMessageRead={isMessageRead}
            connectionState={connectionState}
            dataChannelState={dataChannelState}
            usingServerFallback={usingServerFallback}
            onEditMessage={onEditMessage}
            onDeleteMessage={onDeleteMessage}
            securityLevel={securityLevel}
          />
        )}
      </ChatGlassPanel>
    </div>
  );
};
