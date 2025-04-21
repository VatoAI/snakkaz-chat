import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatTabs } from "@/components/chat/ChatTabs";
import { useToast } from "@/components/ui/use-toast";
import { UserStatus } from "@/types/presence";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/contexts/AuthContext";
import { MigrationHelper } from "@/components/chat/MigrationHelper";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChatCode } from "@/hooks/useChatCode";
import { LoadingScreen } from "./LoadingScreen";
import { useMobilePinGuard } from "./hooks/useMobilePinGuard";
import { useWebRTCSetup } from "./hooks/useWebRTCSetup";
import { Friend } from "@/components/chat/friends/types";

const ChatPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    manager: webRTCManager,
    isReady,
    setupWebRTC,
    status
  } = useWebRTCSetup();

  const [activeTab, setActiveTab] = useState("global");
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [userProfiles, setUserProfiles] = useState({});
  const [userPresence, setUserPresence] = useState({});
  const [currentStatus, setCurrentStatus] = useState<UserStatus>('online');
  const isMobile = useIsMobile();

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
  } = useMessages(user?.id);

  const pinGuard = useMobilePinGuard({ isMobile });
  const { showSetCodeModal, setShowSetCodeModal, pinUnlocked, chatCodeHook } = pinGuard;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isReady && user) {
      setupWebRTC(user.id, () => {
        // Intentionally empty, handled in isReady flag in hook
      });
    }
  }, [user, loading, navigate, setupWebRTC, isReady]);

  useEffect(() => {
    if (user?.id) {
      fetchMessages();
      const cleanup = setupRealtimeSubscription();
      return () => {
        cleanup();
      };
    }
  }, [user?.id, fetchMessages, setupRealtimeSubscription]);

  const handleCloseDirectChat = () => {
    setSelectedFriend(null);
    setActiveTab("global");
  };

  const onStartChat = (friendId: string) => {
    setSelectedFriend({ 
      id: '', 
      user_id: friendId, 
      friend_id: user?.id || '', 
      status: 'accepted',
      created_at: '',
      profile: userProfiles[friendId] ? {
        id: friendId,
        username: userProfiles[friendId].username || null,
        avatar_url: userProfiles[friendId].avatar_url || null
      } : undefined
    });
    setActiveTab("direct");
  };

  const handleSubmit = async (e: React.FormEvent, mediaFile?: File) => {
    e.preventDefault();
    if (!newMessage.trim() && !mediaFile) return;
    try {
      await handleSendMessage(newMessage, {
        ttl,
        mediaFile: mediaFile,
        webRTCManager,
        onlineUsers: new Set()
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not send message",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'direct') {
      setSelectedFriend(null);
    }
  };

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
    <TooltipProvider>
      <div className="h-[100dvh] w-full bg-cyberdark-950 text-white flex flex-col overflow-hidden">
        <ChatHeader
          userPresence={userPresence}
          currentUserId={user.id}
          currentStatus={currentStatus}
          onStatusChange={setCurrentStatus}
          webRTCManager={webRTCManager}
          directMessages={directMessages}
          onNewMessage={handleStartEditMessage}
          onStartChat={onStartChat}
          userProfiles={userProfiles}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <div className="flex-1 overflow-hidden relative">
          <ChatTabs
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            selectedFriend={selectedFriend}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            isLoading={isLoading}
            ttl={ttl}
            setTtl={setTtl}
            onMessageExpired={handleMessageExpired}
            onSubmit={handleSubmit}
            currentUserId={user.id}
            editingMessage={editingMessage}
            onEditMessage={handleStartEditMessage}
            onCancelEdit={handleCancelEditMessage}
            onDeleteMessage={handleDeleteMessage}
            directMessages={directMessages}
            onNewMessage={handleStartEditMessage}
            webRTCManager={webRTCManager}
            userProfiles={userProfiles}
            handleCloseDirectChat={() => setSelectedFriend(null)}
          />
        </div>
        <MigrationHelper />
      </div>
    </TooltipProvider>
  );
};

export default ChatPage;
