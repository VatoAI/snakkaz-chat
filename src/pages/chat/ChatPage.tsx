import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import { useProfiles } from "@/hooks/useProfiles";
import { usePresence } from "@/hooks/usePresence";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useFriendships } from "@/hooks/useFriendships";
import { Friend } from "@/components/chat/friends/types";
import { DecryptedMessage } from "@/types/message";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
// Importer vår nye ChatInterface-komponent
import { ChatInterface } from "../components/ChatInterface";

// Ny type for opplastingsstatus
interface UploadingMedia {
  file: File;
  progress: number;
  status: 'uploading' | 'error' | 'success';
}

const ChatPage = () => {
  const { user } = useAuth();
  const { manager: webRTCManager, setupWebRTC: initializeWebRTC } = useWebRTC();
  const { friends, friendships, friendsMap } = useFriendships();
  const { userProfiles, fetchProfiles } = useProfiles();
  const { userPresence, currentStatus, handleStatusChange } = usePresence(user?.id || null);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [activeTab, setActiveTab] = useState("global");
  const [directMessages, setDirectMessages] = useState<Array<DecryptedMessage>>([]);
  
  // State for media handling
  const [uploadingMedia, setUploadingMedia] = useState<UploadingMedia | null>(null);
  
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

  // Handle media uploads
  const handleMediaUpload = async (file: File): Promise<string> => {
    try {
      // Update upload state
      setUploadingMedia({
        file,
        progress: 0,
        status: 'uploading'
      });
      
      // Simulate upload progress (i en ekte app ville dette bruke en faktisk filoverføring)
      await new Promise<void>((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadingMedia(prev => prev ? {
            ...prev,
            progress
          } : null);
          
          if (progress >= 100) {
            clearInterval(interval);
            resolve();
          }
        }, 200);
      });
      
      // I en ekte app ville vi ha en server-URL som returneres etter opplasting
      const mockMediaUrl = `https://snakkaz-media.example.com/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      
      // Oppdater state til success
      setUploadingMedia(prev => prev ? {
        ...prev,
        status: 'success'
      } : null);
      
      // Gi brukeren litt tid til å se at opplastingen er ferdig før vi fjerner tilstanden
      setTimeout(() => {
        setUploadingMedia(null);
      }, 1000);
      
      return mockMediaUrl;
    } catch (error) {
      console.error('Error uploading media:', error);
      setUploadingMedia(prev => prev ? {
        ...prev,
        status: 'error'
      } : null);
      
      // Gi brukeren litt tid til å se feilen før vi fjerner tilstanden
      setTimeout(() => {
        setUploadingMedia(null);
      }, 3000);
      
      throw new Error('Failed to upload media');
    }
  };

  // Utvidet funksjon for å sende meldinger med medieopplasting
  const handleSendMessage = async (text: string, mediaFile?: File) => {
    try {
      let mediaUrl;
      
      if (mediaFile) {
        // Last opp filen først hvis den finnes
        mediaUrl = await handleMediaUpload(mediaFile);
      }
      
      // Send meldingen med media-URL hvis tilgjengelig
      if (activeTab === "directMessage" && selectedFriend) {
        // Send direktemelding
        await chatState.handleSendDirectMessage(selectedFriend.user_id, text, {
          mediaUrl,
          mediaType: mediaFile?.type
        });
      } else {
        // Send global melding
        await chatState.handleSendMessage(text, {
          mediaUrl,
          mediaType: mediaFile?.type
        });
      }
    } catch (error) {
      console.error('Failed to send message with media:', error);
      throw error;
    }
  };

  // Bestem hvilken bruker vi skal vise meldinger for i ChatInterface
  const recipientInfo = selectedFriend 
    ? {
        name: userProfiles[selectedFriend.user_id]?.display_name || 'Ukjent bruker',
        avatar: userProfiles[selectedFriend.user_id]?.avatar_url,
        isOnline: userPresence[selectedFriend.user_id]?.online
      }
    : undefined;

  return (
    <ProtectedRoute>
      <div className="h-screen w-full flex flex-col">
        {/* Header kan legges til her hvis ønskelig */}
        
        {/* Chat Interface - vår nye komponent */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            messages={activeTab === "directMessage" ? directMessages : chatState.messages || []}
            currentUserId={user?.id || ""}
            userProfiles={userProfiles}
            newMessage={chatState.newMessage || ""}
            onNewMessageChange={chatState.setNewMessage}
            onSendMessage={handleSendMessage}
            onEditMessage={handleStartEditMessage}
            onDeleteMessage={chatState.handleDeleteMessage}
            isLoading={chatState.isLoading}
            recipientInfo={recipientInfo}
            isDirectMessage={activeTab === "directMessage"}
            onBackToList={activeTab === "directMessage" ? () => {
              setActiveTab("global");
              setSelectedFriend(null);
            } : undefined}
            ttl={chatState.ttl}
            onTtlChange={chatState.setTtl}
            editingMessage={chatState.editingMessage}
            onCancelEdit={chatState.handleCancelEditMessage}
            uploadingMedia={uploadingMedia}
            hasMoreMessages={chatState.hasMoreMessages}
            isLoadingMoreMessages={chatState.isLoadingMore}
            onLoadMoreMessages={chatState.loadMoreMessages}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ChatPage;
