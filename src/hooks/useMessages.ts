import { useMessageState } from "./message/useMessageState";
import { useMessageFetch } from "./message/useMessageFetch";
import { useMessageRealtime } from "./message/useMessageRealtime";
import { useMessageSend } from "./message/useMessageSend";
import { useMessageP2P } from "./message/useMessageP2P";
import { useMessageExpiry } from "./message/useMessageExpiry";
import { useMessageActions } from "./message/useMessageActions";
import { DecryptedMessage } from "@/types/message";
import { useEffect, useState, useCallback } from 'react';

export const useMessages = (userId: string | null, receiverId?: string, groupId?: string) => {
  const {
    messages,
    setMessages,
    optimisticallyDeleteMessage,
    newMessage,
    setNewMessage,
    isLoading,
    setIsLoading,
    ttl,
    setTtl,
    toast
  } = useMessageState();

  // Add directMessages state
  const [directMessages, setDirectMessages] = useState<DecryptedMessage[]>([]);

  // Set default TTL to 24 hours (86400 seconds)
  useEffect(() => {
    if (ttl === null) {
      setTtl(86400);
    }
  }, [ttl, setTtl]);

  // Fetch messages from the server with pagination
  const {
    fetchMessages,
    loadMoreMessages,
    hasMoreMessages,
    isLoadingMore
  } = useMessageFetch(userId, setMessages, toast, receiverId, groupId);

  // Setup realtime subscription
  const { setupRealtimeSubscription } = useMessageRealtime(userId, setMessages, receiverId, groupId);

  // Message sending
  const { handleSendMessage: internalSendMessage } = useMessageSend(
    userId, newMessage, setNewMessage, ttl, setIsLoading, toast
  );

  // P2P message handling
  const { addP2PMessage } = useMessageP2P(setMessages);

  // Message expiry handling
  const { handleMessageExpired } = useMessageExpiry(setMessages);

  // Create simple edit and delete handlers
  const handleEditMessage = useCallback(async (messageId: string, content: string) => {
    // Implementation to be added later if needed
    console.log('Edit message functionality not implemented yet', messageId, content);
    return Promise.resolve();
  }, []);

  const handleDeleteMessageById = useCallback(async (messageId: string) => {
    // Implementation to be added later if needed
    console.log('Delete message functionality not implemented yet', messageId);
    return Promise.resolve();
  }, []);

  // Message editing and deletion actions
  const {
    editingMessage,
    handleStartEditMessage,
    handleCancelEditMessage,
    handleSubmitEditMessage,
    handleDeleteMessageById: messageActionsDeleteById
  } = useMessageActions(userId, handleEditMessage, handleDeleteMessageById);

  // Handle message submission (new or edit)
  const handleSubmitMessage = async (content: string, options?: { ttl?: number, mediaFile?: File, webRTCManager?: any, onlineUsers?: Set<string> }) => {
    if (editingMessage) {
      await handleSubmitEditMessage(content);
    } else {
      // Extract options
      const messageTtl = options?.ttl !== undefined ? options.ttl : ttl;
      const mediaFile = options?.mediaFile;
      const webRTCManager = options?.webRTCManager;
      const onlineUsers = options?.onlineUsers || new Set<string>();

      await internalSendMessage(webRTCManager, onlineUsers, mediaFile, receiverId, groupId);
    }
  };

  // Enhanced delete message handler with optimistic updates
  const handleDeleteMessage = useCallback(async (messageId: string) => {
    try {
      // Apply optimistic update first
      optimisticallyDeleteMessage(messageId);

      // Then perform actual deletion
      await messageActionsDeleteById(messageId);
      return Promise.resolve();
    } catch (error) {
      // If deletion fails, we should refresh the messages
      console.error("Error deleting message, refreshing data:", error);
      await fetchMessages();
      return Promise.reject(error);
    }
  }, [messageActionsDeleteById, optimisticallyDeleteMessage, fetchMessages]);

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

    // Pagination
    loadMoreMessages,
    hasMoreMessages,
    isLoadingMore,

    // Editing and deletion
    editingMessage,
    handleStartEditMessage,
    handleCancelEditMessage,
    handleDeleteMessage,

    // Direct messages
    directMessages,
    setDirectMessages
  };
};
