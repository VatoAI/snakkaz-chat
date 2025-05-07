import { Group } from "@/types/group";
import { DecryptedMessage } from "@/types/message.d";
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

  const { handleReconnect } = useDirectMessageConnection(
    webRTCManager,
    group.members.find(m => {
      const memberId = m.user_id;
      return memberId !== currentUserId;
    })?.user_id || "",
    connectionState,
    setConnectionState,
    dataChannelState,
    setDataChannelState,
    usingServerFallback,
    setUsingServerFallback,
    connectionAttempts,
    setConnectionAttempts
  );

  const { peerIsTyping, startTyping } = useTypingIndicator(
    currentUserId,
    group.id
  );
  
  const { isMessageRead, markMessagesAsRead } = useReadReceipts(
    currentUserId,
    group.id,
    messages
  );

  const { 
    sendError, 
    handleSendMessage: handleSendGroupMessage
  } = useGroupMessageSender(
    currentUserId, 
    group.id,
    group.members.map(m => m.userId || m.user_id || ""),
    onNewMessage
  );

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
