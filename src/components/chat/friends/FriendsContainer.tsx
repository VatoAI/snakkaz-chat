
import { useState } from "react";
import { FriendsList } from "./list/FriendsList";
import { FriendRequests } from "./FriendRequests";
import { FriendsSearchSection } from "./FriendsSearchSection";
import { QrCodeSection } from "./QrCodeSection";
import { DecryptedMessage } from "@/types/message";
import { WebRTCManager } from "@/utils/webrtc";
import { useFriendRequests } from "./hooks/useFriendRequests";
import { useFriendRequestHandler } from "./hooks/useFriendRequestHandler";

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
  const { friends, pendingRequests } = useFriendRequests(currentUserId);
  const { handleSendFriendRequest } = useFriendRequestHandler(currentUserId);

  const handleStartChat = (userId: string) => {
    if (onStartChat) {
      onStartChat(userId);
    }
  };

  return (
    <div className="space-y-6 mt-4">
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
            Venner ({friends.length})
          </button>
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === "requests"
                ? "bg-cybergold-500/10 text-cybergold-400"
                : "text-cybergold-500/60 hover:bg-cyberdark-800 hover:text-cybergold-400"
            } relative`}
            onClick={() => setActiveTab("requests")}
          >
            Forespørsler
            {pendingRequests.length > 0 && (
              <span className="absolute top-2 right-2 bg-cybergold-500 text-cyberdark-900 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>
        <div className="p-4">
          {activeTab === "friends" ? (
            friends.length > 0 ? (
              <FriendsList 
                friends={friends} 
                currentUserId={currentUserId}
                webRTCManager={webRTCManager}
                directMessages={directMessages}
                onNewMessage={onNewMessage}
                onStartChat={handleStartChat}
                userProfiles={userProfiles}
              />
            ) : (
              <div className="text-center text-cybergold-500 py-4">
                <p>Du har ingen venner ennå.</p>
                <p className="text-sm mt-1">Søk etter brukere for å sende venneforespørsler.</p>
              </div>
            )
          ) : (
            <FriendRequests 
              friendRequests={pendingRequests}
              onAccept={handleSendFriendRequest}
              onReject={handleSendFriendRequest}
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
        />
      </div>
    </div>
  );
};
