
import { DecryptedMessage } from "@/types/message";
import { useRef, useEffect, useState } from "react";
import { DeleteMessageDialog } from "@/components/message/DeleteMessageDialog";
import { MessageSecurityBanner } from "./message/MessageSecurityBanner";
import { MessageItem } from "./message/MessageItem";
import { TypingIndicator } from "./message/TypingIndicator";

interface DirectMessageListProps {
  messages: DecryptedMessage[];
  currentUserId: string;
  peerIsTyping?: boolean;
  isMessageRead?: (messageId: string) => boolean;
  connectionState: string;
  dataChannelState: string;
  usingServerFallback: boolean;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
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
  onDeleteMessage
}: DirectMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isSecureConnection = (connectionState === 'connected' && dataChannelState === 'open') || usingServerFallback;
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Always call useEffect regardless of messages validity
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, peerIsTyping]);

  // Always define handlers
  const handleConfirmDelete = () => {
    if (confirmDelete && onDeleteMessage) {
      onDeleteMessage(confirmDelete);
      setConfirmDelete(null);
    }
  };

  // Safe check for messages - render placeholder if invalid
  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <MessageSecurityBanner 
        isSecureConnection={isSecureConnection} 
        messagesExist={safeMessages.length > 0} 
      />

      {safeMessages.map((message) => {
        // Skip invalid messages
        if (!message || !message.sender) {
          return null;
        }
        
        return (
          <MessageItem
            key={message.id}
            message={message}
            isCurrentUser={message.sender.id === currentUserId}
            isMessageRead={isMessageRead}
            usingServerFallback={usingServerFallback}
            onEditMessage={onEditMessage}
            onDeleteMessage={setConfirmDelete}
          />
        );
      })}
      
      <TypingIndicator isTyping={peerIsTyping} />
      
      <div ref={messagesEndRef} />
      
      <DeleteMessageDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
