import { DecryptedMessage } from "@/types/message";
import { WebRTCManager } from "@/utils/webrtc";
import { useDirectMessageState } from "./useDirectMessageState";
import { useDirectMessageConnection } from "./useDirectMessageConnection"; 
import { useDirectMessageSender } from "./useDirectMessageSender";

// Define a Friend interface type
interface Friend {
  user_id: string;
  friend_id?: string;
  status?: string;
}

/**
 * Main hook for direct message functionality
 */
export const useDirectMessage = (
  friend: Friend,
  currentUserId: string,
  webRTCManager: WebRTCManager | null,
  onNewMessage: (message: DecryptedMessage) => void,
  messages: DecryptedMessage[] = []
) => {
  const friendId = friend.user_id === currentUserId ? friend.friend_id : friend.user_id;

  // Initialize base state
  const {
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
    handleCancelEditMessage,
  } = useDirectMessageState(currentUserId, friendId);

  // Set up connection management
  const { handleReconnect } = useDirectMessageConnection(
    webRTCManager,
    friendId,
    connectionState,
    setConnectionState,
    dataChannelState,
    setDataChannelState,
    usingServerFallback,
    setUsingServerFallback,
    connectionAttempts,
    setConnectionAttempts
  );

  // Set up message sending functionality
  const { 
    sendError, 
    handleSendMessage,
    clearSendError
  } = useDirectMessageSender(
    currentUserId, 
    friendId, 
    onNewMessage
  );

  // Combine and return all functionality
  return {
    // Message state
    newMessage,
    setNewMessage,
    
    // Connection state
    connectionState,
    dataChannelState,
    usingServerFallback,
    connectionAttempts,
    
    // Loading and errors
    isLoading,
    setIsLoading,
    sendError,
    
    // Security
    securityLevel,
    setSecurityLevel,
    
    // Actions
    handleReconnect,
    handleSendMessage,
    clearSendError,
    
    // Message editing
    editingMessage,
    handleStartEditMessage,
    handleCancelEditMessage,
  };
};