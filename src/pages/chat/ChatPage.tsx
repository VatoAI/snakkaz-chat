
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import { useProfiles } from "@/hooks/useProfiles";
import { usePresence } from "@/hooks/usePresence";
import { ChatLayout } from "./components/ChatLayout";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useFriendships } from "@/hooks/useFriendships";
import { Friend } from "@/components/chat/friends/types";
import { DecryptedMessage } from "@/types/message";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const ChatPage = () => {
  const { user } = useAuth();
  const { manager: webRTCManager, setupWebRTC: initializeWebRTC } = useWebRTC();
  const { friends, friendships, friendsMap } = useFriendships();
  const { userProfiles, fetchProfiles } = useProfiles();
  const { userPresence, currentStatus, handleStatusChange } = usePresence(user?.id || null);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [activeTab, setActiveTab] = useState("global");
  const [directMessages, setDirectMessages] = useState<Array<DecryptedMessage>>([]);
  
  // Initialize chat state
  const chatState = useMessages(user?.id || null);

  // Init WebRTC connections
  useEffect(() => {
    if (user && !webRTCManager) {
      initializeWebRTC(user.id);
    }
  }, [user, webRTCManager, initializeWebRTC]);

  // Load initial data
  useEffect(() => {
    if (user?.id) {
      chatState.fetchMessages();
      chatState.setupRealtimeSubscription();
      fetchProfiles();
    }
  }, [user?.id, chatState, fetchProfiles]);

  // Get available friend IDs for WebRTC connections
  const friendsList = friends.map(friend => friend.user_id);

  // Handle starting a direct chat
  const handleStartChat = useCallback((userId: string) => {
    const friend = friendsMap[userId];
    if (friend) {
      setSelectedFriend(friend);
      setActiveTab("directMessage");
    }
  }, [friendsMap]);

  // Handle edit message action
  const handleStartEditMessage = useCallback((message: DecryptedMessage) => {
    chatState.handleStartEditMessage(message);
  }, [chatState]);

  return (
    <ProtectedRoute>
      <ChatLayout
        userPresence={userPresence}
        currentUserId={user?.id || ""}
        currentStatus={currentStatus}
        handleStatusChange={handleStatusChange}
        webRTCManager={webRTCManager}
        directMessages={directMessages}
        handleStartEditMessage={handleStartEditMessage}
        onStartChat={handleStartChat}
        userProfiles={userProfiles}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        chatState={chatState}
        selectedFriend={selectedFriend}
        setSelectedFriend={setSelectedFriend}
        friendsList={friendsList}
      />
    </ProtectedRoute>
  );
};

export default ChatPage;
