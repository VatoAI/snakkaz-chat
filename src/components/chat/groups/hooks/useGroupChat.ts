
import { Group } from "@/types/group";
import { DecryptedMessage } from "@/types/message";
import { WebRTCManager } from "@/utils/webrtc";
import { useDirectMessageState } from "../../friends/hooks/useDirectMessageState";
import { useDirectMessageConnection } from "../../friends/hooks/useDirectMessageConnection";
import { useTypingIndicator } from "@/hooks/message/useTypingIndicator";
import { useReadReceipts } from "@/hooks/message/useReadReceipts";
import { useGroupMessageSubmit } from "./useGroupMessageSubmit";
import { useGroupMessageSender } from "./useGroupMessageSender";

export const useGroupChat = (
  group: Group,
  currentUserId: string,
  webRTCManager: WebRTCManager | null,
  onNewMessage: (message: DecryptedMessage) => void,
  messages: DecryptedMessage[] = []
) => {
  // Use the base state management hook
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
  } = useDirectMessageState(currentUserId, group.id);

  // Set up connection management for P2P connections
  const { handleReconnect } = useDirectMessageConnection(
    webRTCManager,
    // For groups, we connect to all members
    group.members.find(m => m.userId || m.user_id !== currentUserId)?.userId || 
    group.members.find(m => m.userId || m.user_id !== currentUserId)?.user_id,
    connectionState,
    setConnectionState,
    dataChannelState,
    setDataChannelState,
    usingServerFallback,
    setUsingServerFallback,
    connectionAttempts,
    setConnectionAttempts
  );

  // Typing indicator for group chat
  const { peerIsTyping, startTyping } = useTypingIndicator(
    currentUserId,
    group.id
  );
  
  // Read receipts for group messages
  const { isMessageRead, markMessagesAsRead } = useReadReceipts(
    currentUserId,
    group.id,
    messages
  );

  // Message sending functionality for group
  const { 
    sendError, 
    handleSendMessage: handleSendGroupMessage
  } = useGroupMessageSender(
    currentUserId, 
    group.id,
    group.members.map(m => m.userId || m.user_id),
    onNewMessage
  );

  // Handle form submission (edit/send)
  const { handleSubmit, handleDeleteMessage } = useGroupMessageSubmit(
    currentUserId,
    newMessage,
    (text: string) => setNewMessage(text, startTyping),
    setIsLoading,
    editingMessage,
    (msg) => {
      if (msg === null) {
        handleCancelEditMessage();
      }
    },
    handleSendGroupMessage,
    group.id
  );

  return {
    newMessage,
    setNewMessage: (text: string) => setNewMessage(text, startTyping),
    isLoading,
    securityLevel,
    setSecurityLevel,
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
    handleDeleteMessage
  };
};
