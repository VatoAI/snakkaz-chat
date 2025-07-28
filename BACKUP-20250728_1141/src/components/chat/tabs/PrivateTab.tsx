
import { PrivateChats } from '@/components/chat/PrivateChats';
import { WebRTCManager } from '@/utils/webrtc';
import { DecryptedMessage } from '@/types/message';

interface PrivateTabProps {
  currentUserId: string;
  webRTCManager: WebRTCManager | null;
  directMessages: DecryptedMessage[];
  onNewMessage: (message: { id: string; content: string }) => void;
  onStartChat: (userId: string) => void;
  userProfiles: Record<string, {username: string | null, avatar_url: string | null}>;
  friendsList: string[];
}

export const PrivateTab = ({
  currentUserId,
  webRTCManager,
  directMessages,
  onNewMessage,
  onStartChat,
  userProfiles,
  friendsList
}: PrivateTabProps) => {
  return (
    <PrivateChats 
      currentUserId={currentUserId}
      webRTCManager={webRTCManager}
      directMessages={directMessages}
      onNewMessage={onNewMessage}
      onStartChat={onStartChat}
      userProfiles={userProfiles}
      friendsList={friendsList}
    />
  );
};
