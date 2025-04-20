import { UserStatus } from "@/types/presence";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Copy, User, Users, MessageSquarePlus, MessagesSquare, UserPlus, LogOut, Link, Check, ChevronsUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { copyToClipboard } from "@/utils/clipboard";
import { useNavigate } from "react-router-dom";
import { useWebRTC } from "@/hooks/useWebRTC";
import { NotificationSettings } from "./notification/NotificationSettings";

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
  const [isIdle, setIsIdle] = useState(false);
  const [isBrb, setIsBrb] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOnline(currentStatus === 'online');
    setIsIdle(currentStatus === 'idle');
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
    <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userProfiles[currentUserId!]?.avatar_url || `https://avatar.vercel.sh/${currentUserId}.png`} alt={userProfiles[currentUserId!]?.username || "SnakkaZ Bruker"} />
                <AvatarFallback>
                  {userProfiles[currentUserId!]?.username?.slice(0, 2).toUpperCase() || "SZ"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
              <Check className={`mr-2 h-4 w-4 ${isOnline ? '' : 'hidden'}`} />
              <span>Online</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('idle')}>
              <Check className={`mr-2 h-4 w-4 ${isIdle ? '' : 'hidden'}`} />
              <span>Idle</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('brb')}>
              <Check className={`mr-2 h-4 w-4 ${isBrb ? '' : 'hidden'}`} />
              <span>Be Right Back</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('offline')}>
              <Check className={`mr-2 h-4 w-4 ${isOffline ? '' : 'hidden'}`} />
              <span>Offline</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logg ut</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <NotificationSettings />
      </div>
    </header>
  );
};
