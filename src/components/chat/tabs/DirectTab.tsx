
import { DirectMessage } from '../friends/DirectMessage';
import { Friend } from '../friends/types';
import { WebRTCManager } from '@/utils/webrtc';
import { DecryptedMessage } from '@/types/message';

interface DirectTabProps {
  friend: Friend;
  currentUserId: string;
  webRTCManager: WebRTCManager | null;
  onBack: () => void;
  messages: DecryptedMessage[];
  onNewMessage: (message: DecryptedMessage) => void;
  userProfiles: Record<string, {username: string | null, avatar_url: string | null}>;
}

export const DirectTab = ({
  friend,
  currentUserId,
  webRTCManager,
  onBack,
  messages,
  onNewMessage,
  userProfiles
}: DirectTabProps) => {
  return (
    <DirectMessage 
      friend={friend}
      currentUserId={currentUserId}
      webRTCManager={webRTCManager}
      onBack={onBack}
      messages={messages}
      onNewMessage={onNewMessage}
      userProfiles={userProfiles}
    />
  );
};
