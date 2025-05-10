import React from 'react';
import { ChevronLeft, Shield, Lock, Users, Download, Upload, RefreshCw } from 'lucide-react';
import { UserAvatar } from '../header/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Group } from '@/types/group';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface GroupChatHeaderProps {
  group: Group;
  connectionState: string;
  dataChannelState: string;
  usingServerFallback: boolean;
  connectionAttempts: number;
  onBack: () => void;
  onReconnect: () => void;
  securityLevel: string;
  setSecurityLevel: (level: string) => void;
  userProfiles?: Record<string, any>;
  isAdmin: boolean;
  isPremium: boolean;
  isPremiumMember: boolean;
  onShowInvite: () => void;
  onShowPremium: () => void;
  onShowMembers: () => void;
  isPageEncryptionEnabled: boolean;
  onEnablePageEncryption: () => void;
  onEncryptAllMessages: () => void;
  encryptionStatus: string;
  isMobile?: boolean;
}

export const GroupChatHeader: React.FC<GroupChatHeaderProps> = ({
  group,
  connectionState,
  dataChannelState,
  usingServerFallback,
  connectionAttempts,
  onBack,
  onReconnect,
  securityLevel,
  setSecurityLevel,
  userProfiles = {},
  isAdmin,
  isPremium,
  isPremiumMember,
  onShowInvite,
  onShowPremium,
  onShowMembers,
  isPageEncryptionEnabled,
  onEnablePageEncryption,
  onEncryptAllMessages,
  encryptionStatus,
  isMobile = false
}) => {
  const isSecureConnection =
    (securityLevel === "p2p_e2ee" && connectionState === "connected" && dataChannelState === "open") ||
    securityLevel === "server_e2ee" ||
    securityLevel === "standard";

  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-cyberdark-700 bg-cyberdark-900/80">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mr-2 text-cybergold-400 hover:bg-cyberdark-800"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center">
          <UserAvatar
            src={group.avatar_url || "/snakkaz-logo.png"}
            alt={group.name}
            isGroup={true}
            size={isMobile ? 32 : 36}
          />
          <div className="ml-2">
            <h3 className="font-medium text-cybergold-300">{group.name}</h3>
            <p className="text-xs text-cybergold-500">
              {group.memberCount || group.members?.length || 0} medlemmer
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onShowMembers}
                className="text-cybergold-400 hover:bg-cyberdark-800"
              >
                <Users className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Vis medlemmer</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onShowInvite}
                className="text-cybergold-400 hover:bg-cyberdark-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-user-plus h-4 w-4"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" x2="17" y1="15" y2="15" />
                  <line x1="18.5" x2="18.5" y1="13.5" y2="16.5" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Inviter medlemmer</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onReconnect}
                disabled={connectionState === "connecting" || connectionState === "connected"}
                className={cn(
                  "text-cybergold-400 hover:bg-cyberdark-800",
                  connectionState === "connecting" && "animate-spin"
                )}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {connectionState === "connecting"
                  ? "Kobler til..."
                  : connectionState === "connected"
                  ? "Tilkoblet"
                  : "Koble til på nytt"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
