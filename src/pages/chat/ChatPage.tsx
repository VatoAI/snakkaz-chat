
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useFriends } from "@/hooks/useFriends";
import { usePresence } from "@/hooks/usePresence";
import { useWebRTCSetup } from "./hooks/useWebRTCSetup";
import { useMobilePinGuard } from "./hooks/useMobilePinGuard";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoadingScreen } from "./LoadingScreen";
import { ChatStateManager } from "./components/ChatStateManager";
import { ChatLayout } from "./components/ChatLayout";
import { useChatInitialization } from "./hooks/useChatInitialization";

const ChatPage = () => {
  const { user, loading } = useAuth();
  const { isAdmin } = useUserRole(user?.id);
  const [activeTab, setActiveTab] = useState("global");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [userProfiles, setUserProfiles] = useState({});
  const [hidden, setHidden] = useState(false);
  const isMobile = useIsMobile();

  const { currentStatus, handleStatusChange, userPresence } = usePresence(
    user?.id,
    'online',
    undefined,
    hidden
  );

  const {
    manager: webRTCManager,
    isReady,
    setupWebRTC,
    status
  } = useWebRTCSetup();

  const { isInitialized } = useChatInitialization({
    user,
    loading,
    isReady,
    setupWebRTC
  });

  const { friends, friendsList, handleSendFriendRequest, handleStartChat } = useFriends(
    user?.id,
    selectedFriend?.user_id || null,
    () => setSelectedFriend(null),
    setSelectedFriend
  );

  const pinGuard = useMobilePinGuard({ isMobile });

  if (loading || !user || !isReady) {
    return <LoadingScreen />;
  }

  if (pinGuard.showMobilePinModal) {
    return pinGuard.mobilePinModal;
  }

  if (pinGuard.showSetCodeModal) {
    return pinGuard.setPinModal;
  }

  return (
    <ChatStateManager userId={user.id} webRTCManager={webRTCManager}>
      {(chatState) => (
        <ChatLayout
          userPresence={userPresence}
          currentUserId={user.id}
          currentStatus={currentStatus}
          handleStatusChange={handleStatusChange}
          webRTCManager={webRTCManager}
          directMessages={chatState.directMessages}
          handleStartEditMessage={chatState.handleStartEditMessage}
          onStartChat={handleStartChat}
          userProfiles={userProfiles}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          chatState={chatState}
          selectedFriend={selectedFriend}
          setSelectedFriend={setSelectedFriend}
          friendsList={friendsList}
        />
      )}
    </ChatStateManager>
  );
};

export default ChatPage;
