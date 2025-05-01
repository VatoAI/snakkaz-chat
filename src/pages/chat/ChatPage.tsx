import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ChatInterface } from "../components/ChatInterface";
import { useMessages } from "@/hooks/useMessages";
import { useProfiles } from "@/hooks/useProfiles";
import { usePresence } from "@/hooks/usePresence";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useFriendships } from "@/hooks/useFriendships";
import { useToast } from "@/components/ui/use-toast";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DecryptedMessage } from "@/types/message";
import { FriendsList } from "@/components/chat/friends/FriendsList";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Users } from "lucide-react";

// Type definition for Friend
interface Friend {
  user_id: string;
  status: string;
}

// Media upload status type
interface UploadingMedia {
  file: File;
  progress: number;
  status: 'uploading' | 'error' | 'success';
}

const ChatPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { webRTCManager, setupWebRTC } = useWebRTC();
  const { friends, friendships, friendsMap } = useFriendships();
  const { userProfiles, fetchProfiles } = useProfiles();
  const { userPresence, currentStatus, handleStatusChange } = usePresence(user?.id || null);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [activeTab, setActiveTab] = useState("global");
  
  // State for direct messages
  const [directMessages, setDirectMessages] = useState<DecryptedMessage[]>([]);
  
  // State for media handling
  const [uploadingMedia, setUploadingMedia] = useState<UploadingMedia | null>(null);
  
  // Initialize chat state with the real useMessages hook
  const chatState = useMessages(user?.id || null, selectedFriend?.user_id);
  
  // Init WebRTC connections
  useEffect(() => {
    if (user && user.id) {
      setupWebRTC(user.id);
    }
  }, [user, setupWebRTC]);

  // Load initial data
  useEffect(() => {
    if (user?.id) {
      chatState.fetchMessages();
      const cleanup = chatState.setupRealtimeSubscription();
      fetchProfiles();
      
      // Cleanup function
      return () => {
        if (cleanup) cleanup();
      };
    }
  }, [user?.id, chatState, fetchProfiles]);
  
  // Effect to load direct messages when a friend is selected
  useEffect(() => {
    const fetchDirectMessages = async () => {
      if (user?.id && selectedFriend?.user_id) {
        try {
          const messages = await chatState.fetchDirectMessages(selectedFriend.user_id);
          setDirectMessages(messages || []);
        } catch (error) {
          console.error("Failed to fetch direct messages:", error);
          toast({
            variant: "destructive",
            title: "Feil ved lasting",
            description: "Kunne ikke laste meldingene. Vennligst prøv igjen."
          });
        }
      }
    };

    if (selectedFriend) {
      fetchDirectMessages();
    }
  }, [selectedFriend, user?.id, chatState, toast]);

  // Subscribe to direct messages for the selected friend
  useEffect(() => {
    if (user?.id && selectedFriend?.user_id) {
      const cleanup = chatState.setupDirectMessageSubscription(selectedFriend.user_id, (newMessage) => {
        setDirectMessages(prev => [...prev, newMessage]);
      });
      
      return cleanup;
    }
  }, [user?.id, selectedFriend?.user_id, chatState]);

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

  // Handle switching back to friends list
  const handleBackToFriendsList = useCallback(() => {
    setSelectedFriend(null);
    setActiveTab("friends");
  }, []);

  // Handle when a new direct message is received
  const handleNewDirectMessage = useCallback((message: DecryptedMessage) => {
    setDirectMessages(prev => [...prev, message]);
  }, []);

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
      
      // Simulate upload progress updates
      const updateProgress = (progress: number) => {
        setUploadingMedia(prev => prev ? {
          ...prev,
          progress
        } : null);
      };
      
      // In a real app, this would use the actual file upload mechanism
      // For now, we'll use the useMediaUpload hook from chatState
      const mediaUrl = await chatState.handleSendMessage("", {
        mediaFile: file,
        onProgress: updateProgress,
        receiverId: selectedFriend?.user_id
      });
      
      // Update state to success
      setUploadingMedia(prev => prev ? {
        ...prev,
        status: 'success'
      } : null);
      
      // Give user time to see upload completed
      setTimeout(() => {
        setUploadingMedia(null);
      }, 1000);
      
      return mediaUrl || "";
    } catch (error) {
      console.error('Error uploading media:', error);
      setUploadingMedia(prev => prev ? {
        ...prev,
        status: 'error'
      } : null);
      
      // Give user time to see the error
      setTimeout(() => {
        setUploadingMedia(null);
      }, 3000);
      
      toast({
        variant: "destructive",
        title: "Opplastingsfeil",
        description: "Kunne ikke laste opp filen. Vennligst prøv igjen."
      });
      
      throw new Error('Failed to upload media');
    }
  };

  // Enhanced function to send messages with media upload
  const handleSendMessage = async (text: string, mediaFile?: File) => {
    try {
      if (activeTab === "directMessage" && selectedFriend) {
        // Send direct message
        await chatState.handleSendMessage(text, {
          mediaFile,
          receiverId: selectedFriend.user_id,
          webRTCManager,
          onlineUsers: new Set(Object.keys(userPresence).filter(id => userPresence[id]?.online))
        });
        
        // Add the message to our local state for immediate feedback
        const newMessage: DecryptedMessage = {
          id: Date.now().toString(),
          content: text,
          sender: {
            id: user?.id || "",
            username: user?.user_metadata?.name || "You",
            full_name: user?.user_metadata?.full_name || user?.user_metadata?.name || "You",
            avatar_url: userProfiles[user?.id || ""]?.avatar_url
          },
          receiver_id: selectedFriend.user_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          room_id: null,
          ttl: null,
          media_url: null,
          media_type: null
        };
        
        setDirectMessages(prev => [...prev, newMessage]);
      } else {
        // Send global message
        await chatState.handleSendMessage(text, {
          mediaFile,
          webRTCManager,
          onlineUsers: new Set(Object.keys(userPresence).filter(id => userPresence[id]?.online))
        });
      }
    } catch (error) {
      console.error('Failed to send message with media:', error);
      toast({
        variant: "destructive",
        title: "Sendingsfeil",
        description: "Kunne ikke sende meldingen. Vennligst prøv igjen."
      });
      throw error;
    }
  };

  // Determine which user to show messages for in ChatInterface
  const recipientInfo = selectedFriend 
    ? {
        name: userProfiles[selectedFriend.user_id]?.username || 'Ukjent bruker',
        avatar: userProfiles[selectedFriend.user_id]?.avatar_url,
        isOnline: userPresence[selectedFriend.user_id]?.online
      }
    : undefined;

  return (
    <ProtectedRoute>
      <div className="h-screen w-full flex flex-col">
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="global" value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="global" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Global Chat
              </TabsTrigger>
              <TabsTrigger value="friends" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Friends
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="global" className="flex-1 overflow-hidden">
              <ChatInterface
                messages={chatState.messages || []}
                currentUserId={user?.id || ""}
                userProfiles={userProfiles}
                newMessage={chatState.newMessage || ""}
                onNewMessageChange={chatState.setNewMessage}
                onSendMessage={handleSendMessage}
                onEditMessage={handleStartEditMessage}
                onDeleteMessage={chatState.handleDeleteMessage}
                isLoading={chatState.isLoading}
                ttl={chatState.ttl}
                onTtlChange={chatState.setTtl}
                editingMessage={chatState.editingMessage}
                onCancelEdit={chatState.handleCancelEditMessage}
                uploadingMedia={uploadingMedia}
                hasMoreMessages={chatState.hasMoreMessages}
                isLoadingMoreMessages={chatState.isLoadingMore}
                onLoadMoreMessages={chatState.loadMoreMessages}
              />
            </TabsContent>
            
            <TabsContent value="friends" className="flex-1 p-4 overflow-auto">
              <FriendsList
                friends={friends}
                currentUserId={user?.id || ""}
                webRTCManager={webRTCManager}
                directMessages={directMessages}
                onNewMessage={handleNewDirectMessage}
                onStartChat={handleStartChat}
                userProfiles={userProfiles}
              />
            </TabsContent>
            
            <TabsContent value="directMessage" className="flex-1 overflow-hidden">
              <ChatInterface
                messages={directMessages}
                currentUserId={user?.id || ""}
                userProfiles={userProfiles}
                newMessage={chatState.newMessage || ""}
                onNewMessageChange={chatState.setNewMessage}
                onSendMessage={handleSendMessage}
                onEditMessage={handleStartEditMessage}
                onDeleteMessage={chatState.handleDeleteMessage}
                isLoading={chatState.isLoading}
                recipientInfo={recipientInfo}
                isDirectMessage={true}
                onBackToList={handleBackToFriendsList}
                ttl={chatState.ttl}
                onTtlChange={chatState.setTtl}
                editingMessage={chatState.editingMessage}
                onCancelEdit={chatState.handleCancelEditMessage}
                uploadingMedia={uploadingMedia}
                hasMoreMessages={chatState.hasMoreMessages}
                isLoadingMoreMessages={chatState.isLoadingMore}
                onLoadMoreMessages={chatState.loadMoreMessages}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ChatPage;
