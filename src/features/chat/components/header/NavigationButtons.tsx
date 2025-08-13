
import { useNavigate } from 'react-router-dom';
import { Home, MessageSquare, User } from 'lucide-react';
import { NavButton } from './buttons/NavButton';
import { FriendsSheet } from './buttons/FriendsSheet';
import { DecryptedMessage } from '@/types/message';
import { AIAssistantButton } from './AIAssistantButton';

interface NavigationButtonsProps {
  currentUserId: string | null;
  webRTCManager?: any;
  directMessages?: DecryptedMessage[];
  onNewMessage?: (message: DecryptedMessage) => void;
  onStartChat?: (userId: string) => void;
  isFriendsOpen: boolean;
  setIsFriendsOpen: (open: boolean) => void;
  userProfiles?: Record<string, {username: string | null, avatar_url: string | null}>;
}

export const NavigationButtons = ({
  currentUserId,
  webRTCManager,
  directMessages = [],
  onNewMessage = () => {},
  onStartChat = () => {},
  isFriendsOpen,
  setIsFriendsOpen,
  userProfiles = {}
}: NavigationButtonsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2 items-center">
      <NavButton
        icon={Home}
        onClick={() => navigate('/')}
        variant="blue"
      />
      <NavButton
        icon={MessageSquare}
        onClick={() => navigate('/chat')}
        variant="red"
      />
      <NavButton
        icon={User}
        onClick={() => navigate('/profil')}
        variant="gold"
      />
      <FriendsSheet
        currentUserId={currentUserId}
        webRTCManager={webRTCManager}
        directMessages={directMessages}
        onNewMessage={onNewMessage}
        onStartChat={onStartChat}
        isFriendsOpen={isFriendsOpen}
        setIsFriendsOpen={setIsFriendsOpen}
        userProfiles={userProfiles}
      />
      {currentUserId && (
        <AIAssistantButton currentUserId={currentUserId} />
      )}
    </div>
  );
};
