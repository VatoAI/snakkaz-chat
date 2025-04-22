
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatTabs } from "@/components/chat/ChatTabs";
import { useToast } from "@/components/ui/use-toast";
import { UserStatus, UserPresence } from "@/types/presence";
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
import { useUserRole } from "@/hooks/useUserRole";
import { useFriends } from "@/components/chat/hooks/useFriends";
import { usePresence } from "@/components/chat/hooks/usePresence";

const ChatPage = () => {
  const { user, loading } = useAuth();
  const { isAdmin } = useUserRole(user?.id);
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
  const [hidden, setHidden] = useState(false);
  const isMobile = useIsMobile();

  // Use the centralized usePresence hook
  const { currentStatus, handleStatusChange, userPresence } = usePresence(
    user?.id,
    'online',
    undefined,
    hidden
  );

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

  const { friends, friendsList, handleSendFriendRequest, handleStartChat } = useFriends(
    user?.id,
    selectedFriend?.user_id || null,
    (id) => setSelectedFriend(null),
    setSelectedFriend
  );

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

  const onStartChat = useCallback((userId: string) => {
    if (isAdmin || friendsList.includes(userId)) {
      setSelectedFriend({ 
        id: '', 
        user_id: userId, 
        friend_id: user?.id || '', 
        status: 'accepted',
        created_at: '',
        profile: userProfiles[userId] ? {
          id: userId,
          username: userProfiles[userId].username || null,
          avatar_url: userProfiles[userId].avatar_url || null
        } : undefined
      });
      setActiveTab("direct");
    } else {
      toast({
        title: "Ikke venn",
        description: "Du må være venn med denne brukeren for å sende meldinger",
        variant: "destructive",
      });
    }
  }, [isAdmin, friendsList, userProfiles, user?.id, toast]);

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

  const handleToggleHidden = () => {
    setHidden(!hidden);
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
          onStatusChange={handleStatusChange}
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
            setSelectedFriend={setSelectedFriend}
            userPresence={userPresence}
          />
        </div>
        <MigrationHelper />
      </div>
    </TooltipProvider>
  );
};

export default ChatPage;
