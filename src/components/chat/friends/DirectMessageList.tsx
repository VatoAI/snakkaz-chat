import { useRef, useEffect } from "react";
import { DecryptedMessage } from "@/types/message";
import { MessageGroup } from "@/components/message/MessageGroup";
import { SecurityLevel } from "@/types/security";

interface DirectMessageListProps {
  messages: DecryptedMessage[];
  currentUserId: string;
  peerIsTyping?: boolean;
  isMessageRead?: (messageId: string) => boolean;
  connectionState?: string;
  dataChannelState?: string;
  usingServerFallback?: boolean;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
  securityLevel?: SecurityLevel;
  isPageEncrypted?: boolean; // Add the missing prop
}

export const DirectMessageList = ({
  messages,
  currentUserId,
  peerIsTyping,
  isMessageRead,
  connectionState,
  dataChannelState,
  usingServerFallback,
  onEditMessage,
  onDeleteMessage,
  securityLevel = 'server_e2ee',
  isPageEncrypted = false // Add default value
}: DirectMessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, peerIsTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={bottomRef}>
      {isPageEncrypted && (
        <div className="text-center p-2 mb-2 text-xs text-cybergold-300 bg-cybergold-900/10 rounded-md border border-cybergold-500/20">
          Denne samtalen er beskyttet med helside-kryptering
        </div>
      )}
      
      {messages.map((message) => (
        <MessageGroup
          key={message.id}
          messages={[message]}
          isUserMessage={(msg) => msg.sender.id === currentUserId}
          onMessageExpired={(messageId) => {
            console.log('Message expired:', messageId);
          }}
          onEditMessage={onEditMessage}
          onDeleteMessage={onDeleteMessage}
          securityLevel={securityLevel}
        />
      ))}
      
      {peerIsTyping && (
        <div className="flex items-center space-x-2 text-sm text-cybergold-400 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-cyberdark-800 border border-cybergold-500/20"></div>
          <div className="px-4 py-2 rounded-lg bg-cyberdark-800 border border-cybergold-500/20">
            <span className="inline-flex gap-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
            </span>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
