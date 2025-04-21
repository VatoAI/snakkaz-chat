import { UserStatus } from "@/types/presence";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { copyToClipboard } from "@/utils/clipboard";
import { useNavigate } from "react-router-dom";
import { NotificationSettings } from "./notification/NotificationSettings";
import { HeaderNavLinks } from "./header/HeaderNavLinks";
import { ProfileDropdown } from "./header/ProfileDropdown";
import { UserAvatar } from "./header/UserAvatar";
import { HeaderLogo } from "./header/HeaderLogo";
import { AdminBadge } from "./header/AdminBadge";

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
    setIsOnline(currentStatus === "online");
    setIsBusy(currentStatus === "busy");
    setIsBrb(currentStatus === "brb");
    setIsOffline(currentStatus === "offline");
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

  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}/register`;
    copyToClipboard(inviteLink);
    toast({
      title: "Invitasjonslenke kopiert",
      description: "Invitasjonslenken er kopiert til utklippstavlen",
    });
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  const avatarUrl = currentUserId ? userProfiles[currentUserId]?.avatar_url : null;
  const username = currentUserId ? userProfiles[currentUserId]?.username : null;

  return (
    <header className="w-full backdrop-blur-sm bg-cyberdark-900/85 border-b border-cybergold-400/40 shadow-neon-blue sticky top-0 z-40 animate-fadeIn">
      <div className="max-w-full flex flex-row items-center justify-between h-[62px] px-2 sm:px-6 py-2 gap-2">
        <div className="flex items-center gap-2">
          <HeaderLogo />
          <UserAvatar avatarUrl={avatarUrl} username={username ?? ""} size={44} />
          {!isMobile && (
            <div className="flex flex-col justify-center ml-2">
              <span className="font-semibold text-base text-cybergold-200 tracking-wider leading-tight cyber-text flex items-center">
                SnakkaZ Chat
              </span>
              <span className="text-xs text-white font-mono select-all truncate max-w-[155px]">
                {username 
                  ? `Brukernavn: ${username}` 
                  : currentUserId 
                    ? `Bruker-ID: ${currentUserId.slice(0,8)}...` 
                    : ""
                }
              </span>
            </div>
          )}
        </div>
        {!isMobile ? (
          <div className="flex flex-row items-center gap-2 bg-cyberdark-950/60 border border-cybergold-400/20 rounded-xl px-2 py-1 shadow-neon-gold/30 glass-morphism">
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
        ) : (
          <span className="text-base font-semibold text-cybergold-100 flex items-center gap-1">
            <HeaderLogo />
            SnakkaZ
          </span>
        )}
        <div className="flex flex-row items-center gap-2">
          <HeaderNavLinks />
          {!isMobile && <NotificationSettings />}
          {currentUserId && (
            <ProfileDropdown
              currentUserId={currentUserId}
              userProfiles={userProfiles}
              currentStatus={currentStatus}
              onStatusChange={handleStatusChange}
              isOnline={isOnline}
              isBusy={isBusy}
              isBrb={isBrb}
              isOffline={isOffline}
              handleCopyUserId={handleCopyUserId}
              handleCopyInviteLink={handleCopyInviteLink}
            />
          )}
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
