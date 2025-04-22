
import { useState, useCallback } from 'react';
import { SecurityLevel } from '@/types/security';
import { DecryptedMessage } from '@/types/message';

export const useDirectMessageState = (currentUserId: string, friendId: string | undefined) => {
  const [newMessage, setNewMessage] = useState('');
  const [connectionState, setConnectionState] = useState('disconnected');
  const [dataChannelState, setDataChannelState] = useState('closed');
  const [usingServerFallback, setUsingServerFallback] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>('server_e2ee');
  const [editingMessage, setEditingMessage] = useState<{id: string; content: string} | null>(null);

  const setNewMessageWithTyping = useCallback((text: string, startTypingCallback?: () => void) => {
    setNewMessage(text);
    if (startTypingCallback && text.length > 0) {
      startTypingCallback();
    }
  }, []);

  const handleStartEditMessage = useCallback((message: DecryptedMessage) => {
    setEditingMessage({
      id: message.id,
      content: message.content
    });
    setNewMessage(message.content);
  }, []);

  const handleCancelEditMessage = useCallback(() => {
    setEditingMessage(null);
    setNewMessage('');
  }, []);

  return {
    newMessage,
    setNewMessage: setNewMessageWithTyping,
    connectionState,
    setConnectionState,
    dataChannelState,
    setDataChannelState,
    usingServerFallback,
    setUsingServerFallback,
    connectionAttempts,
    setConnectionAttempts,
    isLoading,
    setIsLoading,
    securityLevel,
    setSecurityLevel,
    editingMessage,
    handleStartEditMessage,
    handleCancelEditMessage
  };
};
