import React from 'react';
import { ChatInputField } from '@/components/chat/ChatInputField';
import { DecryptedMessage } from '@/types/message';
import { SecurityLevel } from '@/types/security';

interface MessageInputProps {
  // Original props
  newMessage?: string;
  setNewMessage?: (message: string) => void;
  onSubmit?: (e: React.FormEvent) => Promise<void>;
  isLoading?: boolean;
  ttl?: number | null;
  setTtl?: (ttl: number) => void;
  editingMessage?: any | null;
  onCancelEdit?: () => void;
  
  // New props for AppChatInterface
  onSendMessage?: (message: string, attachments?: File[]) => void;
  placeholder?: string;
  replyToMessage?: DecryptedMessage | null;
  onCancelReply?: () => void;
  enableAttachments?: boolean;
  enableEphemeralMessages?: boolean;
  ephemeralTTL?: number;
  securityLevel?: SecurityLevel;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  // Original props with defaults
  newMessage = '',
  setNewMessage = () => {},
  onSubmit,
  isLoading = false,
  ttl = null,
  setTtl = () => {},
  editingMessage = null,
  onCancelEdit = () => {},
  
  // New props with defaults
  onSendMessage,
  placeholder = 'Skriv en melding...',
  replyToMessage,
  onCancelReply = () => {},
  enableAttachments = true,
  enableEphemeralMessages = false,
  ephemeralTTL = 300,
  securityLevel
}) => {
  const handleSubmitWrapped = async (text: string, mediaFile?: File) => {
    if (onSendMessage) {
      onSendMessage(text, mediaFile ? [mediaFile] : undefined);
      return;
    }
    
    if (onSubmit) {
      const event = {} as React.FormEvent;
      await onSubmit(event);
    }
  };

  return (
    <ChatInputField
      value={newMessage}
      onChange={setNewMessage}
      onSubmit={handleSubmitWrapped}
      disabled={isLoading}
      ttl={ttl !== null ? ttl : 0}
      onTtlChange={setTtl}
      isEditing={!!editingMessage}
      onCancelEdit={onCancelEdit}
      placeholder={placeholder}
      replyToMessage={replyToMessage}
      onCancelReply={onCancelReply}
    />
  );
};
