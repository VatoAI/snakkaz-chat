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
        handleSendMessage={handleSendMessage}
        uploadingMedia={uploadingMedia}
      />
    </ProtectedRoute>
  );
};

export default ChatPage;
