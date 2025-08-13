
import { FriendsContainer } from '../friends/FriendsContainer';
import { WebRTCManager } from '@/utils/webrtc';
import { DecryptedMessage } from '@/types/message';

interface FriendsTabProps {
  currentUserId: string;
  webRTCManager: WebRTCManager | null;
  directMessages: DecryptedMessage[];
  onNewMessage: (message: { id: string; content: string }) => void;
  onStartChat: (userId: string) => void;
  userProfiles: Record<string, {username: string | null, avatar_url: string | null}>;
}

export const FriendsTab = ({
  currentUserId,
  webRTCManager,
  directMessages,
  onNewMessage,
  onStartChat,
  userProfiles
}: FriendsTabProps) => {
  return (
    <div className="h-full p-4 overflow-y-auto">
      <FriendsContainer
        currentUserId={currentUserId}
        webRTCManager={webRTCManager}
        directMessages={directMessages}
        onNewMessage={onNewMessage}
        onStartChat={onStartChat}
        userProfiles={userProfiles}
      />
    </div>
  );
};
