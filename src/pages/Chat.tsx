import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatTabs } from "@/components/chat/ChatTabs";
import { useAuthState } from "@/hooks/useAuthState";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useToast } from "@/components/ui/use-toast";
import { UserStatus } from "@/types/presence";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useMessageSubmission } from "@/hooks/message/useMessageSubmission";

const Chat = () => {
  const { userId, checkAuth } = useAuthState();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { manager: webRTCManager, setupWebRTC, status } = useWebRTC();
  const [isReady, setIsReady] = useState(false);
  const [activeTab, setActiveTab] = useState("global");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ttl, setTtl] = useState(86400); // Set default TTL to 24 hours
  const [directMessages, setDirectMessages] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);
  const [userProfiles, setUserProfiles] = useState({});
  const [userPresence, setUserPresence] = useState({});
  const [currentStatus, setCurrentStatus] = useState<UserStatus>('online');
  const { isSubmitting, handleSubmit: submitMessage } = useMessageSubmission(userId);

  useEffect(() => {
    const verifyAuth = async () => {
      const currentUserId = await checkAuth();
      if (!currentUserId) {
        toast({
          title: "Ikke innlogget",
          description: "Du må logge inn for å bruke chatten",
          variant: "destructive",
        });
        navigate('/login', { replace: true });
        return;
      }

      if (currentUserId && !isReady) {
        setupWebRTC(currentUserId, () => {
          console.log("WebRTC setup complete");
          setIsReady(true);
        });
      }
    };
    
    verifyAuth();
  }, [checkAuth, navigate, setupWebRTC, isReady, toast]);

  const handleCloseDirectChat = () => {
    setSelectedFriend(null);
    setActiveTab("global");
  };

  const onStartChat = (friendId) => {
    setSelectedFriend({ user_id: friendId });
    setActiveTab("direct");
  };

  const handleMessageExpired = (messageId) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
  };

  const handleNewMessage = (message) => {
    setDirectMessages(prev => [...prev, message]);
  };

  const handleMessageEdit = (message) => {
    setEditingMessage(message);
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
  };

  const handleDeleteMessage = (messageId) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      await submitMessage(newMessage, ttl);
      setNewMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not send message",
        variant: "destructive",
      });
    }
  };

  if (!userId || !isReady) {
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
          currentUserId={userId}
          currentStatus={currentStatus}
          onStatusChange={setCurrentStatus}
          webRTCManager={webRTCManager}
          directMessages={directMessages}
          onNewMessage={handleNewMessage}
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
            currentUserId={userId}
            editingMessage={editingMessage}
            onEditMessage={handleMessageEdit}
            onCancelEdit={handleCancelEdit}
            onDeleteMessage={handleDeleteMessage}
            directMessages={directMessages}
            onNewMessage={handleNewMessage}
            webRTCManager={webRTCManager}
            userProfiles={userProfiles}
            handleCloseDirectChat={handleCloseDirectChat}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Chat;
