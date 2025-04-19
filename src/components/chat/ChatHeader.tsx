import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, MessageSquare, User, Users } from 'lucide-react';
import { OnlineUsers } from '@/components/OnlineUsers';
import { UserPresence, UserStatus } from '@/types/presence';
import { FriendsContainer } from './friends/FriendsContainer';
import { DecryptedMessage } from '@/types/message';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const navigate = useNavigate();
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
            <div className="hidden sm:flex w-12 h-12 rounded-full mr-2 border-2 border-cybergold-500/40 shadow-neon-gold overflow-hidden">
              <img 
                src="/snakkaz-logo.png" 
                alt="SnakkaZ" 
                className="w-full h-full object-cover p-0.5"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/')}
              className="bg-cyberdark-800/90 border-cyberblue-400/50 text-cyberblue-400 hover:bg-cyberdark-700 hover:border-cyberblue-400 hover:text-cyberblue-300 shadow-neon-blue transition-all duration-300"
            >
              <Home className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/chat')}
              className="bg-cyberdark-800/90 border-cyberred-400/50 text-cyberred-400 hover:bg-cyberdark-700 hover:border-cyberred-400 hover:text-cyberred-300 shadow-neon-red transition-all duration-300"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/profil')}
              className="bg-cyberdark-800/90 border-cybergold-400/50 text-cybergold-400 hover:bg-cyberdark-700 hover:border-cybergold-400 hover:text-cybergold-300 shadow-neon-gold transition-all duration-300"
            >
              <User className="h-4 w-4" />
            </Button>
            <Sheet open={isFriendsOpen} onOpenChange={setIsFriendsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-cyberdark-800/90 border-cyberblue-400/50 text-cyberblue-400 hover:bg-cyberdark-700 hover:border-cyberblue-400 hover:text-cyberblue-300 shadow-neon-blue transition-all duration-300"
                >
                  <Users className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] bg-cyberdark-950/95 border-cyberblue-500/30 backdrop-blur-xl">
                <SheetHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-cyberblue-400/50">
                      <img 
                        src="/snakkaz-logo.png" 
                        alt="SnakkaZ" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <SheetTitle className="cyber-text text-xl">Venner</SheetTitle>
                  </div>
                </SheetHeader>
                {currentUserId && 
                  <FriendsContainer 
                    currentUserId={currentUserId} 
                    webRTCManager={webRTCManager}
                    directMessages={directMessages}
                    onNewMessage={onNewMessage}
                    onStartChat={onStartChat}
                    userProfiles={userProfiles}
                  />
                }
              </SheetContent>
            </Sheet>
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
