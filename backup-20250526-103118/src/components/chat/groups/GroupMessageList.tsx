import React, { useRef } from "react";
import { DecryptedMessage } from "@/types/message";
import { MessageItem } from "@/components/chat/MessageItem";
import { User } from "@/types/user";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatTypingIndicator } from "@/components/chat/ChatTypingIndicator";
import { ChatConnectionStatus } from "@/components/chat/ChatConnectionStatus";

interface GroupMessageListProps {
  messages: DecryptedMessage[];
  currentUserId: string;
  peerIsTyping: boolean;
  isMessageRead: (messageId: string) => boolean;
  connectionState: string;
  dataChannelState: string;
  usingServerFallback: boolean;
  onEditMessage: (message: DecryptedMessage) => void;
  onDeleteMessage: (messageId: string) => void;
  securityLevel: string;
  isPageEncrypted: boolean;
  isPremiumMember: boolean;
  isMobile?: boolean;
}

export const GroupMessageList: React.FC<GroupMessageListProps> = ({
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
  isPageEncrypted,
  isPremiumMember,
  isMobile = false,
}) => {
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({
        top: scrollViewportRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce<
    Record<string, DecryptedMessage[]>
  >((groups, message) => {
    const date = new Date(message.timestamp || Date.now());
    const dateStr = date.toLocaleDateString("nb-NO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(message);
    return groups;
  }, {});

  // Sort date strings
  const sortedDates = Object.keys(groupedMessages).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // Format timestamp
  const formatTime = (timestamp: number | string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("nb-NO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle message update
  React.useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  return (
    <ScrollArea className="h-full pb-2 relative">
      <div className="flex flex-col space-y-1 p-3">
        {sortedDates.map((dateStr) => (
          <React.Fragment key={dateStr}>
            <div className="flex justify-center my-2">
              <div className="px-3 py-1 bg-cyberdark-800/70 rounded-full border border-cybergold-900/30">
                <span className="text-xs text-cybergold-500">{dateStr}</span>
              </div>
            </div>

            {groupedMessages[dateStr].map((message, index) => {
              // Skip rendering if the message doesn't have a sender
              if (!message.sender) return null;

              const prevMessage = index > 0 ? groupedMessages[dateStr][index - 1] : null;
              const nextMessage =
                index < groupedMessages[dateStr].length - 1
                  ? groupedMessages[dateStr][index + 1]
                  : null;

              const showAvatar =
                !nextMessage ||
                nextMessage.sender.id !== message.sender.id ||
                new Date(nextMessage.timestamp).getTime() -
                  new Date(message.timestamp).getTime() >
                  5 * 60 * 1000;

              const isFirstInSequence =
                !prevMessage ||
                prevMessage.sender.id !== message.sender.id ||
                new Date(message.timestamp).getTime() -
                  new Date(prevMessage.timestamp).getTime() >
                  5 * 60 * 1000;

              const isLastInSequence =
                !nextMessage ||
                nextMessage.sender.id !== message.sender.id ||
                new Date(nextMessage.timestamp).getTime() -
                  new Date(message.timestamp).getTime() >
                  5 * 60 * 1000;

              return (
                <MessageItem
                  key={message.id}
                  message={message}
                  isCurrentUser={message.sender.id === currentUserId}
                  isFirstInSequence={isFirstInSequence}
                  isLastInSequence={isLastInSequence}
                  showAvatar={showAvatar}
                  timestamp={formatTime(message.timestamp)}
                  isRead={isMessageRead(message.id)}
                  onEdit={() => onEditMessage(message)}
                  onDelete={() => onDeleteMessage(message.id)}
                  isPremium={isPremiumMember}
                  securityLevel={securityLevel}
                  isPageEncrypted={isPageEncrypted}
                  isMobile={isMobile}
                />
              );
            })}
          </React.Fragment>
        ))}

        {peerIsTyping && (
          <div className="flex items-center mt-2">
            <ChatTypingIndicator />
          </div>
        )}
      </div>
      
      <div className="sticky bottom-0 right-0 left-0 px-3 py-1">
        <ChatConnectionStatus
          connectionState={connectionState}
          dataChannelState={dataChannelState}
          usingServerFallback={usingServerFallback}
          securityLevel={securityLevel}
        />
      </div>
    </ScrollArea>
  );
};
