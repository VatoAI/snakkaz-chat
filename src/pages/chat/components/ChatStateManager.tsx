
import { useEffect } from "react";
import { useMessages } from "@/hooks/useMessages";
import { useToast } from "@/components/ui/use-toast";
import { WebRTCManager } from "@/utils/webrtc";

interface ChatStateManagerProps {
  userId: string | null;
  webRTCManager: WebRTCManager | null;
  children: React.ReactNode;
}

export const ChatStateManager = ({ userId, webRTCManager, children }: ChatStateManagerProps) => {
  const {
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    ttl,
    setTtl,
    fetchMessages,
    setupRealtimeSubscription,
    handleSendMessage,
    handleMessageExpired,
    editingMessage,
    handleStartEditMessage,
    handleCancelEditMessage,
    handleDeleteMessage,
    directMessages,
    setDirectMessages
  } = useMessages(userId);

  useEffect(() => {
    if (userId) {
      fetchMessages();
      const cleanup = setupRealtimeSubscription();
      return () => {
        cleanup();
      };
    }
  }, [userId, fetchMessages, setupRealtimeSubscription]);

  const chatState = {
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    ttl,
    setTtl,
    handleSendMessage,
    handleMessageExpired,
    editingMessage,
    handleStartEditMessage,
    handleCancelEditMessage,
    handleDeleteMessage,
    directMessages,
    setDirectMessages
  };

  return (
    <>
      {children(chatState)}
    </>
  );
};
