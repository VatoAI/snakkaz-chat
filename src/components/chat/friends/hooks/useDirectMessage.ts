
import { Friend } from "../types";
import { DecryptedMessage } from "@/types/message";
import { WebRTCManager } from "@/utils/webrtc";
import { useDirectMessageState } from "./useDirectMessageState";
import { useDirectMessageConnection } from "./useDirectMessageConnection";
import { useTypingIndicator } from "@/hooks/message/useTypingIndicator";
import { useReadReceipts } from "@/hooks/message/useReadReceipts";
import { useDirectMessageSubmit } from "./useDirectMessageSubmit";
import { useDirectMessageSender } from "./useDirectMessageSender";
import { SecurityLevel } from "@/types/security";

export const useDirectMessage = (
  friend: Friend,
  currentUserId: string,
  webRTCManager: WebRTCManager | null,
  onNewMessage: (message: DecryptedMessage) => void,
  messages: DecryptedMessage[] = []
) => {
  const friendId = friend.user_id === currentUserId ? friend.friend_id : friend.user_id;

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

  // Add typing indicator
  const { peerIsTyping, startTyping } = useTypingIndicator(currentUserId, friendId);
  
  // Add read receipts
  const { isMessageRead, markMessagesAsRead } = useReadReceipts(currentUserId, friendId, messages);

  // Message sending functionality
  const { 
    sendError, 
    handleSendMessage: handleSendDirectMessage
  } = useDirectMessageSender(
    currentUserId, 
    friendId, 
    onNewMessage
  );

  // Handle form submission (edit/send)
  const { handleSubmit, handleDeleteMessage } = useDirectMessageSubmit(
    currentUserId,
    newMessage,
    setNewMessage,
    setIsLoading,
    editingMessage,
    (msg) => {
      if (msg === null) {
        handleCancelEditMessage();
      }
    },
    handleSendDirectMessage
  );

  return {
    newMessage,
    setNewMessage: (text: string) => setNewMessage(text, startTyping),
    isLoading,
    connectionState,
    dataChannelState,
    usingServerFallback,
    connectionAttempts,
    sendError,
    handleSendMessage: handleSubmit,
    handleReconnect,
    peerIsTyping,
    isMessageRead,
    editingMessage,
    handleStartEditMessage,
    handleCancelEditMessage,
    handleDeleteMessage,
    securityLevel,
    setSecurityLevel
  };
};
