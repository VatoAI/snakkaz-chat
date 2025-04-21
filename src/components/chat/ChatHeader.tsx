import { UserStatus } from "@/types/presence";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Copy, User, Link, Check, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { copyToClipboard } from "@/utils/clipboard";
import { useNavigate } from "react-router-dom";
import { NotificationSettings } from "./notification/NotificationSettings";
import { HeaderNavLinks } from "./header/HeaderNavLinks";

interface ChatHeaderProps {
  userPresence: Record<string, any>;
  currentUserId: string | null;
  currentStatus: UserStatus;
  onStatusChange: (status: UserStatus) => void;
  webRTCManager: any;
  directMessages: any[];
  onNewMessage: (message: { id: string; content: string }) => void;
  onStartChat: (friendId: string) => void;
  userProfiles: Record<string, { username: string | null; avatar_url: string | null }>;
}

export const ChatHeader = ({
  userPresence,
  currentUserId,
  currentStatus,
  onStatusChange,
  webRTCManager,
  directMessages,
  onNewMessage,
  onStartChat,
  userProfiles
}: ChatHeaderProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [isBrb, setIsBrb] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOnline(currentStatus === 'online');
    setIsBusy(currentStatus === 'busy');
    setIsBrb(currentStatus === 'brb');
    setIsOffline(currentStatus === 'offline');
  }, [currentStatus]);

  const handleStatusChange = (status: UserStatus) => {
    onStatusChange(status);
  };

  const handleCopyUserId = () => {
    if (currentUserId) {
      copyToClipboard(currentUserId);
      toast({
        title: "Bruker ID kopiert",
        description: "Bruker ID er kopiert til utklippstavlen",
      });
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Kunne ikke logge ut",
        description: "Prøv igjen senere",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logget ut",
        description: "Du er nå logget ut",
      });
      navigate('/login', { replace: true });
    }
  };

  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}/register`;
    copyToClipboard(inviteLink);
    toast({
      title: "Invitasjonslenke kopiert",
      description: "Invitasjonslenken er kopiert til utklippstavlen",
    });
  };

  return (
    <header className="w-full backdrop-blur-sm bg-cyberdark-900/80 border-b border-cybergold-400/40 shadow-neon-blue sticky top-0 z-40 animate-fadeIn">
      <div className="max-w-full flex flex-row items-center justify-between h-[72px] px-4 sm:px-8 py-2 gap-2">
        {/* Left: Logo/Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyberblue-800 via-cyberdark-800 to-cyberred-600 border-2 border-cybergold-500 shadow-neon-gold flex items-center justify-center relative overflow-hidden">
            <Avatar className="h-11 w-11">
              <AvatarImage
                src={userProfiles[currentUserId!]?.avatar_url || "/snakkaz-logo.png"}
                alt={userProfiles[currentUserId!]?.username || "SnakkaZ Bruker"}
                className="object-cover"
              />
              <AvatarFallback>
                {userProfiles[currentUserId!]?.username?.slice(0, 2).toUpperCase() || "SZ"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-semibold text-lg text-cybergold-200 tracking-wider leading-tight cyber-text">
              SnakkaZ Chat
            </span>
            <span className="text-sm text-white font-mono select-all truncate max-w-[140px]">
              {userProfiles[currentUserId!]?.username || (
                <span className="text-cyberblue-300 text-xs">{currentUserId}</span>
              )}
            </span>
          </div>
        </div>

        {/* Center: Status Selector */}
        <div className="hidden md:flex flex-row items-center gap-2 bg-cyberdark-950/60 border border-cybergold-400/20 rounded-xl px-4 py-2 shadow-neon-gold/30 glass-morphism">
          <StatusButton
            label="Online"
            isActive={isOnline}
            color="text-green-400"
            onClick={() => handleStatusChange('online')}
          />
          <StatusButton
            label="Busy"
            isActive={isBusy}
            color="text-cyberred-400"
            onClick={() => handleStatusChange('busy')}
          />
          <StatusButton
            label="BRB"
            isActive={isBrb}
            color="text-cybergold-400"
            onClick={() => handleStatusChange('brb')}
          />
          <StatusButton
            label="Offline"
            isActive={isOffline}
            color="text-gray-400"
            onClick={() => handleStatusChange('offline')}
          />
        </div>

        {/* Right: Actions + Navigation */}
        <div className="flex flex-row items-center gap-4">
          <HeaderNavLinks />
          <NotificationSettings />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-cyberblue-500/10 hover:scale-110 transition-all">
                <span className="sr-only">Åpne profil meny</span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userProfiles[currentUserId!]?.avatar_url || "/snakkaz-logo.png"} alt={userProfiles[currentUserId!]?.username || "SZ"} />
                  <AvatarFallback>
                    {userProfiles[currentUserId!]?.username?.slice(0, 2).toUpperCase() || "SZ"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-cyberdark-900/90 backdrop-blur-md border border-cybergold-400/20 shadow-lg">
              <DropdownMenuLabel>Min Konto</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate('/profil')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyUserId}>
                <Copy className="mr-2 h-4 w-4" />
                <span>Kopier Bruker ID</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyInviteLink}>
                <Link className="mr-2 h-4 w-4" />
                <span>Kopier Invitasjonslenke</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleStatusChange('online')}>
                <Check className={`mr-2 h-4 w-4 ${isOnline ? "" : "opacity-0"}`} />
                <span>Online</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('busy')}>
                <Check className={`mr-2 h-4 w-4 ${isBusy ? "" : "opacity-0"}`} />
                <span>Busy</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('brb')}>
                <Check className={`mr-2 h-4 w-4 ${isBrb ? "" : "opacity-0"}`} />
                <span>Be Right Back</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('offline')}>
                <Check className={`mr-2 h-4 w-4 ${isOffline ? "" : "opacity-0"}`} />
                <span>Offline</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logg ut</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

function StatusButton({ label, isActive, color, onClick }: { label: string; isActive: boolean; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2 py-1 rounded-lg font-mono border transition-all duration-150
        ${isActive
          ? `${color} bg-cyberdark-700 border-cybergold-400 shadow-neon-gold font-bold scale-105`
          : "text-cybergold-300 hover:text-white border-transparent hover:bg-cybergold-400/10 hover:scale-105"
        }
      `}
      style={{ minWidth: 50 }}
    >
      {label}
    </button>
  );
}
