
import { useMessageState } from "./message/useMessageState";
import { useMessageFetch } from "./message/useMessageFetch";
import { useMessageRealtime } from "./message/useMessageRealtime";
import { useMessageSend } from "./message/useMessageSend";
import { useMessageP2P } from "./message/useMessageP2P";
import { useMessageExpiry } from "./message/useMessageExpiry";
import { useMessageActions } from "./message/useMessageActions";
import { DecryptedMessage } from "@/types/message";

export const useMessages = (userId: string | null, receiverId?: string, groupId?: string) => {
  const {
    messages,
    setMessages,
    newMessage,
    setNewMessage,
    isLoading,
    setIsLoading,
    ttl,
    setTtl,
    toast
  } = useMessageState();

  // Set default TTL to 24 hours (86400 seconds)
  useEffect(() => {
    if (ttl === null) {
      setTtl(86400);
    }
  }, [ttl, setTtl]);

  // Fetch messages from the server
  const { fetchMessages } = useMessageFetch(userId, setMessages, toast, receiverId, groupId);
  
  // Setup realtime subscription
  const { setupRealtimeSubscription } = useMessageRealtime(userId, setMessages, receiverId, groupId);
  
  // Message sending, editing, and deleting
  const { handleSendMessage, handleEditMessage, handleDeleteMessage } = useMessageSend(
    userId, newMessage, setNewMessage, ttl, setIsLoading, toast
  );
  
  // P2P message handling
  const { addP2PMessage } = useMessageP2P(setMessages);
  
  // Message expiry handling
  const { handleMessageExpired } = useMessageExpiry(setMessages);
  
  // Message editing and deletion actions
  const { 
    editingMessage, 
    handleStartEditMessage, 
    handleCancelEditMessage,
    handleSubmitEditMessage,
    handleDeleteMessageById
  } = useMessageActions(userId, handleEditMessage, handleDeleteMessage);

  // Handle message submission (new or edit)
  const handleSubmitMessage = async (webRTCManager: any, onlineUsers: Set<string>, mediaFile?: File) => {
    if (editingMessage) {
      await handleSubmitEditMessage(newMessage);
    } else {
      await handleSendMessage(webRTCManager, onlineUsers, mediaFile, receiverId, groupId);
    }
  };

  return {
    // Message state
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    ttl,
    setTtl,
    
    // Message operations
    fetchMessages,
    setupRealtimeSubscription,
    addP2PMessage,
    handleSendMessage: handleSubmitMessage,
    handleMessageExpired,
    
    // Editing and deletion
    editingMessage,
    handleStartEditMessage: (message: DecryptedMessage | { id: string; content: string }) => {
      setNewMessage(handleStartEditMessage(message));
    },
    handleCancelEditMessage,
    handleDeleteMessage: handleDeleteMessageById
  };
};

// Need to import useEffect
import { useEffect } from 'react';
