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
import { AdminButton } from "./AdminButton";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

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
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin(user?.id);

  return (
    <TooltipProvider>
      <header className={`
        w-full backdrop-blur-sm bg-cyberdark-900/85 border-b border-cybergold-400/40 
        shadow-neon-blue sticky top-0 z-40 animate-fadeIn
        ${isMobile ? 'mobile-top-safe pt-safe' : ''}
      `}>
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <img
              src="/snakkaz-logo.png"
              alt="Background Logo"
              className="w-16 h-16 object-contain"
            />
          </div>

          <div className={`max-w-full flex flex-row items-center justify-between ${isMobile ? 'h-[60px]' : 'h-[50px]'} px-1 sm:px-6 py-1 gap-1 sm:gap-2 relative z-10`}>
            <div className="flex items-center gap-1 sm:gap-2">
              {!isMobile && (
                <div className="text-base font-semibold text-cybergold-100">
                  SnakkaZ
                </div>
              )}
            </div>

            <div className={`flex-1 flex justify-center ${isMobile ? 'mx-1' : 'mx-4'}`}>
              <HeaderNavLinks 
                activeTab={activeTab} 
                onTabChange={onTabChange}
                currentStatus={currentStatus}
              />
            </div>

            <div className="flex flex-row items-center gap-1 sm:gap-2">
              {!isMobile && <NotificationSettings />}
              <AIAssistantButton currentUserId={currentUserId || ''} />
              {isAdmin && <AdminButton />}
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
