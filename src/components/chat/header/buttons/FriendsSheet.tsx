import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FriendsContainer } from '../../friends/FriendsContainer';
import { DecryptedMessage } from '@/types/message';

interface FriendsSheetProps {
  currentUserId: string | null;
  webRTCManager?: any;
  directMessages?: DecryptedMessage[];
  onNewMessage?: (message: DecryptedMessage) => void;
  onStartChat?: (userId: string) => void;
  isFriendsOpen: boolean;
  setIsFriendsOpen: (open: boolean) => void;
  userProfiles?: Record<string, {username: string | null, avatar_url: string | null}>;
}

interface FriendsContainerProps {
  currentUserId: string;
  webRTCManager: any;
  directMessages: DecryptedMessage[];
  onNewMessage: (message: DecryptedMessage) => void;
  onStartChat?: (userId: string) => void;
  userProfiles: Record<string, any>;
}

export const FriendsSheet = ({
  currentUserId,
  webRTCManager,
  directMessages,
  onNewMessage,
  onStartChat,
  isFriendsOpen,
  setIsFriendsOpen,
  userProfiles
}: FriendsSheetProps) => {
  return (
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
  );
};
