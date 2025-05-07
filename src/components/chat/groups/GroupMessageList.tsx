
import { useRef, useEffect } from "react";
import { DecryptedMessage } from "@/types/message.d";
import { MessageItem } from "../friends/message/MessageItem";
import { Loader2 } from "lucide-react";
import { SecurityLevel } from "@/types/security";
import { UserStatus } from "@/types/presence";

interface GroupMessageListProps {
  messages: DecryptedMessage[];
  currentUserId: string;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
  isMessageRead?: (messageId: string) => boolean;
  usingServerFallback?: boolean;
  securityLevel?: SecurityLevel;
  userStatus?: Record<string, UserStatus>;
  hasMoreMessages?: boolean;
  isLoadingMoreMessages?: boolean;
  loadMoreMessages?: () => Promise<void>;
}

export const GroupMessageList = ({
  messages,
  currentUserId,
  onEditMessage,
  onDeleteMessage,
  isMessageRead = () => false,
  usingServerFallback = false,
  securityLevel = SecurityLevel.SERVER_E2EE,
  userStatus = {},
  hasMoreMessages = false,
  isLoadingMoreMessages = false,
  loadMoreMessages,
}: GroupMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  // Setup scroll handler for loading more messages
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !loadMoreMessages || !hasMoreMessages) return;

    const handleScroll = () => {
      if (isLoadingMoreMessages || !hasMoreMessages) return;
      if (container.scrollTop < 50) {
        // Save current scroll position
        const scrollHeight = container.scrollHeight;
        
        // Load more messages
        loadMoreMessages();
        
        // Adjust scroll position after loading
        setTimeout(() => {
          const newScrollHeight = container.scrollHeight;
          const heightDifference = newScrollHeight - scrollHeight;
          container.scrollTop = heightDifference;
        }, 100);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [loadMoreMessages, hasMoreMessages, isLoadingMoreMessages]);

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-y-auto p-4 space-y-4"
    >
      {/* Loading indicator for more messages */}
      {isLoadingMoreMessages && (
        <div className="flex justify-center py-2">
          <Loader2 className="h-5 w-5 animate-spin text-cyberblue-400" />
        </div>
      )}

      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-cyberdark-300">
          <p>Ingen meldinger ennå.</p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              isCurrentUser={message.sender?.id === currentUserId}
              isMessageRead={isMessageRead}
              usingServerFallback={usingServerFallback}
              onEditMessage={onEditMessage}
              onDeleteMessage={onDeleteMessage}
              userStatus={userStatus[message.sender?.id || ''] || UserStatus.OFFLINE}
              securityLevel={securityLevel}
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};
