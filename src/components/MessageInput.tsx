
import React from 'react';
import { ChatInputField } from '@/components/chat/ChatInputField';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading?: boolean;
  ttl: number | null;
  setTtl: (ttl: number) => void;
  editingMessage: any | null;
  onCancelEdit: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  onSubmit,
  isLoading = false,
  ttl,
  setTtl,
  editingMessage,
  onCancelEdit
}) => {
  const handleSubmitWrapped = async (text: string) => {
    const event = new Event('submit') as any;
    await onSubmit(event);
  };

  return (
    <ChatInputField
      value={newMessage}
      onChange={setNewMessage}
      onSubmit={handleSubmitWrapped}
      disabled={isLoading}
      ttl={ttl || 0}
      onTtlChange={setTtl}
      isEditing={!!editingMessage}
      onCancelEdit={onCancelEdit}
    />
  );
};
