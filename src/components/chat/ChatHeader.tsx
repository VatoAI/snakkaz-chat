import React, { useState } from 'react';
import { UserStatus } from "@/types/presence";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HeaderNavLinks } from "./header/HeaderNavLinks";
import { ProfileDropdown } from "./header/ProfileDropdown";
import { AIAssistantButton } from "./header/AIAssistantButton";
import { AdminButton } from "./AdminButton";
import { copyToClipboard } from "@/utils/clipboard";
import { useToast } from "@/hooks/use-toast";

interface ChatHeaderProps {
  userPresence: Record<string, any>;
  currentUserId: string | null;
  currentStatus: UserStatus;
  onStatusChange: (status: UserStatus) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ChatHeader = ({
  userPresence,
  currentUserId,
  currentStatus,
  onStatusChange,
  activeTab,
  onTabChange
}: ChatHeaderProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin(user?.id);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Use effect for window resize listener
  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Determine a more precise mobile value
  const isVeryNarrowScreen = windowWidth < 360;
  
  const userProfiles = {}; // This would be populated from props

  // Fix the comparison between UserStatus and "brb"
  const renderStatusText = (status: UserStatus) => {
    if (status === UserStatus.AWAY) {
      return "Borte en liten stund";
    } else if (status === UserStatus.ONLINE) {
      return "Pålogget";
    } else if (status === UserStatus.OFFLINE) {
      return "Frakoblet";
    } else if (status === UserStatus.BUSY) {
      return "Opptatt";
    } else {
      return "Ukjent status";
    }
  };

  return (
    <TooltipProvider>
      <header className={`
        w-full backdrop-blur-sm bg-cyberdark-900/90 border-b border-cybergold-400/40 
        shadow-lg sticky top-0 z-40 animate-fadeIn
        ${isMobile ? 'mobile-top-safe pt-safe pb-1' : ''}
      `}
        style={{
          boxShadow: '0 2px 15px rgba(26, 157, 255, 0.3), 0 2px 8px rgba(214, 40, 40, 0.25)'
        }}
      >
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <img
              src="/snakkaz-logo.png"
              alt="Background Logo"
              className="w-16 h-16 object-contain"
            />
          </div>

          <div className={`
            max-w-full flex flex-row items-center justify-between 
            ${isMobile ? 'h-[60px] py-1.5' : 'h-[50px] py-1'} 
            px-2 sm:px-6 gap-1 sm:gap-2 relative z-10`
          }>
            {/* Left Section */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Desktop logo */}
              {!isMobile && (
                <div className="text-base font-semibold text-cybergold-100 flex items-center">
                  <span className="bg-gradient-to-r from-cyberblue-400 to-red-400 bg-clip-text text-transparent">
                    SnakkaZ
                  </span>
                </div>
              )}
              {/* Mobile logo - small version with better styling */}
              {isMobile && (
                <div className="w-8 h-8 overflow-hidden rounded-full border border-cybergold-500/60 shadow-glow">
                  <img
                    src="/snakkaz-logo.png"
                    alt="SnakkaZ"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Center Section - navigation links */}
            <div className={`flex-1 flex justify-center ${isVeryNarrowScreen ? 'mx-0.5 px-0' : (isMobile ? 'mx-0.5 px-0.5' : 'mx-4')}`}>
              <HeaderNavLinks
                activeTab={activeTab}
                onTabChange={onTabChange}
                currentStatus={currentStatus}
              />
            </div>

            {/* Right Section - actions and profile */}
            <div className="flex flex-row items-center gap-1 sm:gap-2 flex-shrink-0">
              <AIAssistantButton currentUserId={currentUserId || ''} />
              {isAdmin && !isVeryNarrowScreen && <AdminButton />}
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

export default ChatHeader;
