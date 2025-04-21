
import { useState } from "react";
import { FriendsContainer } from "@/components/chat/friends/FriendsContainer";
import { Friend } from "@/components/chat/friends/types";
import { DecryptedMessage } from "@/types/message";
import { WebRTCManager } from "@/utils/webrtc";

interface PrivateChatsProps {
  currentUserId: string;
  webRTCManager: WebRTCManager | null;
  directMessages: DecryptedMessage[];
  onNewMessage: (message: DecryptedMessage) => void;
  onStartChat: (userId: string) => void;
  userProfiles: Record<string, {username: string | null, avatar_url: string | null}>;
}

export const PrivateChats = ({
  currentUserId,
  webRTCManager,
  directMessages,
  onNewMessage,
  onStartChat,
  userProfiles
}: PrivateChatsProps) => {
  const [isFriendsOpen, setIsFriendsOpen] = useState(true);
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto p-4">
        <FriendsContainer
          currentUserId={currentUserId}
          webRTCManager={webRTCManager}
          directMessages={directMessages}
          onNewMessage={onNewMessage}
          onStartChat={onStartChat}
          userProfiles={userProfiles}
        />
      </div>
    </div>
  );
};
