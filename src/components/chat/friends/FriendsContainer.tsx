import { useState } from "react";
import { FriendsList } from "./list/FriendsList";
import { FriendRequests } from "./FriendRequests";
import { FriendsSearchSection } from "./FriendsSearchSection";
import { QrCodeSection } from "./QrCodeSection";
import { DecryptedMessage } from "@/types/message";
import { WebRTCManager } from "@/utils/webrtc";
import { useOptimizedFriends } from "@/hooks/useOptimizedFriends";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface FriendsContainerProps {
  currentUserId: string;
  webRTCManager?: WebRTCManager | null;
  directMessages?: DecryptedMessage[];
  onNewMessage?: (message: DecryptedMessage) => void;
  onStartChat?: (userId: string) => void;
  userProfiles?: Record<string, {username: string | null, avatar_url: string | null}>;
}

export const FriendsContainer = ({
  currentUserId,
  webRTCManager = null,
  directMessages = [],
  onNewMessage = () => {},
  onStartChat,
  userProfiles = {}
}: FriendsContainerProps) => {
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");
  
  const {
    friends,
    pendingRequests,
    friendsList,
    loading,
    handleSendFriendRequest,
    handleAcceptFriendRequest,
    handleRejectFriendRequest,
    handleRefresh
  } = useOptimizedFriends(currentUserId);

  const handleStartChat = (userId: string) => {
    if (onStartChat) {
      onStartChat(userId);
    }
  };

  return (
    <div className="space-y-6 mt-4">
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 text-cybergold-400 animate-spin" />
          <span className="ml-2 text-cybergold-400">Laster inn venner...</span>
        </div>
      )}
      
      {!loading && (
        <>
          <div className="bg-cyberdark-900 border border-cybergold-500/30 rounded-md overflow-hidden">
            <div className="flex border-b border-cybergold-500/30">
              <button
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === "friends"
                    ? "bg-cybergold-500/10 text-cybergold-400"
                    : "text-cybergold-500/60 hover:bg-cyberdark-800 hover:text-cybergold-400"
                }`}
                onClick={() => setActiveTab("friends")}
              >
                <div className="flex items-center justify-center">
                  Venner
                  <Badge className="ml-2 bg-cyberdark-700 text-xs" variant="outline">
                    {friends.length}
                  </Badge>
                </div>
              </button>
              <button
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === "requests"
                    ? "bg-cybergold-500/10 text-cybergold-400"
                    : "text-cybergold-500/60 hover:bg-cyberdark-800 hover:text-cybergold-400"
                } relative`}
                onClick={() => setActiveTab("requests")}
              >
                <div className="flex items-center justify-center">
                  Forespørsler
                  {pendingRequests.length > 0 && (
                    <Badge className="ml-2 bg-cyberred-800 text-xs text-white" variant="destructive">
                      {pendingRequests.length}
                    </Badge>
                  )}
                </div>
              </button>
            </div>
            <div className="p-4">
              {activeTab === "friends" ? (
                <FriendsList 
                  friends={friends}
                  friendsList={friendsList}
                  currentUserId={currentUserId}
                  webRTCManager={webRTCManager}
                  directMessages={directMessages}
                  onNewMessage={onNewMessage}
                  onStartChat={handleStartChat}
                  userProfiles={userProfiles}
                  onRefresh={handleRefresh}
                />
              ) : (
                <FriendRequests 
                  friendRequests={pendingRequests}
                  onAccept={handleAcceptFriendRequest}
                  onReject={handleRejectFriendRequest}
                />
              )}
            </div>
          </div>

          <div className="mt-6">
            <QrCodeSection />
          </div>

          <div className="mt-6">
            <FriendsSearchSection 
              currentUserId={currentUserId}
              onSendFriendRequest={handleSendFriendRequest}
              friendsList={friendsList}
            />
          </div>
        </>
      )}
    </div>
  );
};
