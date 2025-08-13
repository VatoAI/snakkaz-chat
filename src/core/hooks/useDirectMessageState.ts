import { useState, useCallback } from "react";
import { DecryptedMessage } from "@/types/message";

/**
 * Hook for managing direct message state
 */
export const useDirectMessageState = (
  currentUserId: string,
  friendId: string | undefined
) => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [connectionState, setConnectionState] = useState<string>("new");
  const [dataChannelState, setDataChannelState] = useState<string>("closed");
  const [usingServerFallback, setUsingServerFallback] = useState<boolean>(false);
  const [connectionAttempts, setConnectionAttempts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [securityLevel, setSecurityLevel] = useState<'p2p_e2ee' | 'server_e2ee' | 'standard'>('p2p_e2ee');
  const [editingMessage, setEditingMessage] = useState<DecryptedMessage | null>(null);

  // Update security level based on connection state
  const updateSecurityLevel = useCallback(() => {
    if (usingServerFallback) {
      setSecurityLevel('server_e2ee');
    } else if (connectionState === 'connected' && dataChannelState === 'open') {
      setSecurityLevel('p2p_e2ee');
    } else {
      setSecurityLevel('server_e2ee');
    }
  }, [connectionState, dataChannelState, usingServerFallback]);

  // Handle edit message actions
  const handleStartEditMessage = useCallback((message: DecryptedMessage) => {
    setEditingMessage(message);
    setNewMessage(message.content);
  }, []);

  const handleCancelEditMessage = useCallback(() => {
    setEditingMessage(null);
    setNewMessage("");
  }, []);

  return {
    newMessage,
    setNewMessage,
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
    updateSecurityLevel,
    editingMessage,
    handleStartEditMessage,
    handleCancelEditMessage
  };
};