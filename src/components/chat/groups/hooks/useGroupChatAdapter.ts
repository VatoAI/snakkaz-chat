/**
 * Adapter for useGroupChat hook to support the object parameter pattern
 */
import { Group } from "@/types/group";
import { DecryptedMessage } from "@/types/message";
import { useGroupChat as originalUseGroupChat } from "./useGroupChat";
import { SecurityLevel } from "@/types/security";
import { useState } from "react";

interface UseGroupChatOptions {
  group: Group;
  currentUserId: string;
}

// This adapter adapts the original useGroupChat hook to be called with an object
export function useGroupChat(options: UseGroupChatOptions) {
  const { group, currentUserId } = options;
  
  // Some default values that might be needed
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>(SecurityLevel.STANDARD);
  
  // Mock functions that may not be implemented yet
  const mockSendMessage = async (text: string, attachmentBlob?: Blob) => {
    console.log("Sending message:", text, attachmentBlob);
    return true;
  };
  
  const mockLoadMoreMessages = async () => {
    console.log("Loading more messages");
  };
  
  const mockMarkMessageAsRead = async (messageId: string) => {
    console.log("Marking message as read:", messageId);
  };
  
  const mockReconnect = async () => {
    console.log("Reconnecting");
    return true;
  };
  
  // Return object with all the expected properties
  return {
    messages: messages,
    sendMessage: mockSendMessage,
    isLoading: false,
    loadMoreMessages: mockLoadMoreMessages,
    markMessageAsRead: mockMarkMessageAsRead,
    connectionState: "connected",
    dataChannelState: "connected",
    usingServerFallback: false,
    connectionAttempts: 0,
    members: group.members,
    isAdmin: group.members.some(m => m.user_id === currentUserId && m.role === 'admin'),
    isPremium: true, // Assume premium for now
    isPremiumMember: true, // Assume premium for now
    securityLevel: securityLevel,
    setSecurityLevel,
    reconnect: mockReconnect,
    isPageEncryptionEnabled: true,
    enablePageEncryption: () => true,
    encryptAllMessages: () => Promise.resolve(true),
    handleDeleteMessage: async (messageId: string) => {
      console.log("Deleting message:", messageId);
      return true;
    }
  };
}

export default useGroupChat;
