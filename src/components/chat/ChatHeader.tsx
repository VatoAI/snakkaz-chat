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
import { useIsMobile } from "@/hooks/use-mobile";
import { AIAssistantButton } from "./header/AIAssistantButton";
import { TooltipProvider } from "@/components/ui/tooltip";

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
  activeTab: string;
  onTabChange: (tab: string) => void;
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
  userProfiles,
  activeTab,
  onTabChange
}: ChatHeaderProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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

  const avatarUrl = currentUserId ? userProfiles[currentUserId]?.avatar_url : null;
  const username = currentUserId ? userProfiles[currentUserId]?.username : null;

  return (
    <TooltipProvider>
      <header className="w-full backdrop-blur-sm bg-cyberdark-900/85 border-b border-cybergold-400/40 shadow-neon-blue sticky top-0 z-40 animate-fadeIn">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <img
              src="/snakkaz-logo.png"
              alt="Background Logo"
              className="w-16 h-16 object-contain"
            />
          </div>

          <div className="max-w-full flex flex-row items-center justify-between h-[50px] px-2 sm:px-6 py-1 gap-2 relative z-10">
            <div className="flex items-center gap-2">
              {!isMobile && (
                <div className="text-base font-semibold text-cybergold-100">
                  SnakkaZ
                </div>
              )}
            </div>

            <div className="flex-1 flex justify-center">
              <HeaderNavLinks activeTab={activeTab} onTabChange={onTabChange} />
            </div>

            <div className="flex flex-row items-center gap-2">
              {!isMobile && <NotificationSettings />}
              <AIAssistantButton currentUserId={currentUserId || ''} />
              {currentUserId && (
                <ProfileDropdown
                  currentUserId={currentUserId}
                  userProfiles={userProfiles}
                  currentStatus={currentStatus}
                  onStatusChange={onStatusChange}
                  isOnline={currentStatus === 'online'}
                  isBusy={currentStatus === 'busy'}
                  isBrb={currentStatus === 'brb'}
                  isOffline={currentStatus === 'offline'}
                  handleCopyUserId={() => {
                    if (currentUserId) {
                      copyToClipboard(currentUserId);
                      toast({
                        title: "Bruker ID kopiert",
                        description: "Bruker ID er kopiert til utklippstavlen",
                      });
                    }
                  }}
                  handleCopyInviteLink={() => {
                    const inviteLink = `${window.location.origin}/register`;
                    copyToClipboard(inviteLink);
                    toast({
                      title: "Invitasjonslenke kopiert",
                      description: "Invitasjonslenken er kopiert til utklippstavlen",
                    });
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
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
