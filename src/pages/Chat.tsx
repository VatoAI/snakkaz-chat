import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatTabs } from "@/components/chat/ChatTabs";
import { useToast } from "@/components/ui/use-toast";
import { UserStatus } from "@/types/presence";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/contexts/AuthContext";
import { useWebRTC } from "@/hooks/useWebRTC";
import { MigrationHelper } from "@/components/chat/MigrationHelper";

const Chat = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { manager: webRTCManager, setupWebRTC, status } = useWebRTC();
  const [isReady, setIsReady] = useState(false);
  const [activeTab, setActiveTab] = useState("global");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [userProfiles, setUserProfiles] = useState({});
  const [userPresence, setUserPresence] = useState({});
  const [currentStatus, setCurrentStatus] = useState<UserStatus>('online');

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

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (!isReady) {
      setupWebRTC(user.id, () => {
        console.log("WebRTC setup complete");
        setIsReady(true);
      });
    }
  }, [user, loading, navigate, setupWebRTC, isReady]);

  useEffect(() => {
    if (user?.id) {
      console.log("Fetching initial messages");
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

  const onStartChat = (friendId) => {
    setSelectedFriend({ user_id: friendId });
    setActiveTab("direct");
  };

  const handleSubmit = async (e: React.FormEvent, mediaFile?: File) => {
    e.preventDefault();
    if (!newMessage.trim() && !mediaFile) return;
    
    try {
      console.log("Handling message submission with media file:", mediaFile?.name);
      await handleSendMessage(newMessage, { 
        ttl, 
        mediaFile: mediaFile, 
        webRTCManager: webRTCManager, 
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

  if (loading || !user || !isReady) {
    return (
      <div className="min-h-screen bg-cyberdark-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-cyberblue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyberblue-400">Laster inn SnakkaZ Chat...</p>
        </div>
      </div>
    );
  }
  
  return (
    <TooltipProvider>
      <div className="h-screen bg-cyberdark-950 text-white flex flex-col">
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
        />
        <div className="flex-1 overflow-hidden">
          <ChatTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
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
            handleCloseDirectChat={handleCloseDirectChat}
          />
        </div>
        <MigrationHelper />
      </div>
    </TooltipProvider>
  );
};

export default Chat;
