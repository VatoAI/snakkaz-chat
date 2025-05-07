import React, { useState, useEffect, useRef } from "react";
import { DecryptedMessage } from "@/types/message";
import { UserStatus } from "@/types/presence";
import { SecurityLevel } from "@/types/security";
import { ChatMessage } from "../ChatMessage";
import { ChatTypingIndicator } from "../ChatTypingIndicator";
import { ChatConnectionStatus } from "../ChatConnectionStatus";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCcw, ShieldAlert } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  // Group messages by date
  const messagesByDate: Record<string, DecryptedMessage[]> = {};
  messages.forEach((message) => {
    const date = new Date(message.created_at || message.timestamp || "").toLocaleDateString();
    if (!messagesByDate[date]) {
      messagesByDate[date] = [];
    }
    messagesByDate[date].push(message);
  });

  const sortedDates = Object.keys(messagesByDate).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setShowScrollToBottom(false);
    setAutoScroll(true);
  };

  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, autoScroll]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollAreaRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      const atBottom = scrollHeight - scrollTop - clientHeight < 50;

      setAutoScroll(atBottom);
      setShowScrollToBottom(!atBottom);
    };

    const currentRef = scrollAreaRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      return () => {
        currentRef.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const isConnected = connectionState === "connected";
  const isChannelOpen = dataChannelState === "open";

  return (
    <div className="flex flex-col h-full relative">
      <ScrollArea
        className="flex-1 px-4 py-4 overflow-y-auto"
      >
        <div ref={scrollAreaRef} className="h-full">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-cybergold-400/60 p-4">
              <p className="text-center">Ingen meldinger i denne gruppen enda.</p>
              <p className="text-center text-sm mt-2">Send en melding for å starte samtalen!</p>
            </div>
          ) : (
            <>
              {(!isConnected || !isChannelOpen) && securityLevel === SecurityLevel.P2P_E2EE && (
                <ChatConnectionStatus
                  connectionState={connectionState}
                  dataChannelState={dataChannelState}
                  usingServerFallback={usingServerFallback}
                />
              )}

              {sortedDates.map((date) => (
                <div key={date} className="mb-6">
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-cyberdark-800/60 text-cybergold-400/70 text-xs px-3 py-1 rounded-full">
                      {date === new Date().toLocaleDateString()
                        ? "I dag"
                        : date === new Date(Date.now() - 86400000).toLocaleDateString()
                        ? "I går"
                        : formatDistanceToNow(new Date(date), { addSuffix: true, locale: nb })}
                    </div>
                  </div>

                  {messagesByDate[date].map((message, index) => {
                    const prevMessage = index > 0 ? messagesByDate[date][index - 1] : null;
                    const nextMessage = index < messagesByDate[date].length - 1 ? messagesByDate[date][index + 1] : null;
                    
                    const isSameSender = prevMessage?.sender?.id === message.sender?.id;
                    const isNextSameSender = nextMessage?.sender?.id === message.sender?.id;
                    
                    // Calculate time between messages
                    const timeDiff = prevMessage
                      ? new Date((message.created_at || message.timestamp || "")).getTime() -
                        new Date((prevMessage.created_at || prevMessage.timestamp || "")).getTime()
                      : 0;
                    
                    // Group messages from the same sender if they're within 2 minutes
                    const shouldGroup = isSameSender && timeDiff < 120000;
                    
                    // Convert message to the right format for the ChatMessage component
                    const messageToPass = {
                      ...message,
                      is_edited: message.is_edited || false,
                    };

                    return (
                      <ChatMessage
                        key={message.id}
                        message={messageToPass}
                        currentUserId={currentUserId}
                        isRead={isMessageRead(message.id)}
                        onEdit={() => onEditMessage(message)}
                        onDelete={() => onDeleteMessage(message.id)}
                        showAvatar={!shouldGroup || index === 0}
                        showTimeAndStatus={!isNextSameSender || index === messagesByDate[date].length - 1}
                        isPageEncrypted={isPageEncrypted}
                        isPremiumContent={isPremiumMember}
                        securityLevel={securityLevel}
                        isMobile={isMobile}
                      />
                    );
                  })}
                </div>
              ))}

              {peerIsTyping && <ChatTypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </ScrollArea>

      {showScrollToBottom && (
        <Button
          variant="secondary"
          size="sm"
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 bg-cybergold-900/80 text-cybergold-300 border border-cybergold-600/30 hover:bg-cybergold-800"
        >
          <RefreshCcw className="h-4 w-4 mr-1 rotate-90" />
          <span className="text-xs">Ny{messages.length > 0 ? "e" : ""} melding{messages.length !== 1 ? "er" : ""}</span>
        </Button>
      )}
    </div>
  );
};
