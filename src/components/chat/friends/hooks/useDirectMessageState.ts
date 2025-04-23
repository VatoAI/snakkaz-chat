
import { useState, useCallback } from "react";
import { SecurityLevel } from "@/types/security";

export const useDirectMessageState = (currentUserId: string, friendId: string | undefined) => {
  // Basic state management
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessage, setEditingMessage] = useState<{ id: string; content: string } | null>(null);
  
  // Connection state
  const [connectionState, setConnectionState] = useState("disconnected");
  const [dataChannelState, setDataChannelState] = useState("closed");
  const [usingServerFallback, setUsingServerFallback] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  // Security level
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>("server_e2ee");
  
  // Editing actions
  const handleStartEditMessage = useCallback((message: { id: string; content: string }) => {
    setEditingMessage(message);
    return message.content;
  }, []);
  
  const handleCancelEditMessage = useCallback(() => {
    setEditingMessage(null);
    setNewMessage("");
  }, []);
  
  // Enhanced message setter with typing indicator
  const setNewMessageWithTyping = useCallback((text: string, startTyping?: () => void) => {
    setNewMessage(text);
    if (text && startTyping) {
      startTyping();
    }
  }, []);
  
  return {
    newMessage,
    setNewMessage: setNewMessageWithTyping,
    isLoading,
    setIsLoading,
    editingMessage,
    setEditingMessage,
    connectionState,
    setConnectionState,
    dataChannelState,
    setDataChannelState,
    usingServerFallback,
    setUsingServerFallback,
    connectionAttempts,
    setConnectionAttempts,
    securityLevel,
    setSecurityLevel,
    handleStartEditMessage,
    handleCancelEditMessage
  };
};
