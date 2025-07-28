
import { DecryptedMessage } from "@/types/message";
import { SecurityLevel } from "@/types/security";
import { ChatGlassPanel } from "./ChatGlassPanel";
import { DirectMessageList } from "./DirectMessageList";
import { EnhancedChatEmptyState } from "@/components/chat/EnhancedChatEmptyState";

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
  onStartNewChat?: () => void;
  onViewDirectory?: () => void;
  userName?: string;
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
  securityLevel,
  onStartNewChat,
  onViewDirectory,
  userName
}: DirectMessageContentProps) => {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <ChatGlassPanel className="flex-1 flex flex-col min-h-0">
        {messages.length === 0 ? (
          <EnhancedChatEmptyState 
            onStartNewChat={onStartNewChat || (() => {})}
            onViewDirectory={onViewDirectory || (() => {})}
            isNewUser={false}
            userName={userName}
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
