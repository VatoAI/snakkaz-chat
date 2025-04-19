
import { useState, useEffect } from 'react';
import { OnlineUsers } from '@/components/OnlineUsers';
import { UserPresence, UserStatus } from '@/types/presence';
import { DecryptedMessage } from '@/types/message';
import { HeaderLogo } from './header/HeaderLogo';
import { NavigationButtons } from './header/NavigationButtons';

interface ChatHeaderProps {
  userPresence: Record<string, UserPresence>;
  currentUserId: string | null;
  currentStatus: UserStatus;
  onStatusChange: (status: UserStatus) => void;
  webRTCManager?: any;
  directMessages?: DecryptedMessage[];
  onNewMessage?: (message: DecryptedMessage) => void;
  friends?: string[];
  onSendFriendRequest?: (userId: string) => void;
  onStartChat?: (userId: string) => void;
  hidden?: boolean;
  onToggleHidden?: () => void;
  userProfiles?: Record<string, {username: string | null, avatar_url: string | null}>;
}

export const ChatHeader = ({
  userPresence,
  currentUserId,
  currentStatus,
  onStatusChange,
  webRTCManager = null,
  directMessages = [],
  onNewMessage = () => {},
  friends = [],
  onSendFriendRequest = () => {},
  onStartChat = () => {},
  hidden = false,
  onToggleHidden = () => {},
  userProfiles = {}
}: ChatHeaderProps) => {
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);

  useEffect(() => {
    const handleStartChatEvent = (e: Event) => {
      const event = e as CustomEvent;
      if (event.detail && event.detail.friendId) {
        setIsFriendsOpen(true);
      }
    };
    
    document.addEventListener('start-chat-with-friend', handleStartChatEvent);
    
    return () => {
      document.removeEventListener('start-chat-with-friend', handleStartChatEvent);
    };
  }, []);

  return (
    <div className="p-2 sm:p-4 border-b border-cybergold-500/30 bg-cyberdark-950/80 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-2 items-center">
            <HeaderLogo />
            <NavigationButtons 
              currentUserId={currentUserId}
              webRTCManager={webRTCManager}
              directMessages={directMessages}
              onNewMessage={onNewMessage}
              onStartChat={onStartChat}
              isFriendsOpen={isFriendsOpen}
              setIsFriendsOpen={setIsFriendsOpen}
              userProfiles={userProfiles}
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold cyber-text">SnakkaZ</h1>
        </div>
        <div className="w-full sm:w-auto">
          <OnlineUsers
            userPresence={userPresence}
            currentUserId={currentUserId}
            onStatusChange={onStatusChange}
            currentStatus={currentStatus}
            onSendFriendRequest={onSendFriendRequest}
            onStartChat={onStartChat}
            friends={friends}
            hidden={hidden}
            onToggleHidden={onToggleHidden}
            userProfiles={userProfiles}
          />
        </div>
      </div>
    </div>
  );
};
