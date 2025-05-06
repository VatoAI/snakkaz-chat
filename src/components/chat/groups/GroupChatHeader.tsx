import React, { useState, useCallback } from "react";
import { ArrowLeft, PhoneCall, VideoIcon, InfoIcon, Shield, Lock, AlertTriangle, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SecurityBadge } from "../security/SecurityBadge";
import { SecurityLevel } from '@/types/security';
import { getInitials } from "@/utils/user";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface GroupChatHeaderProps {
  group: any;
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
  isMobile
}) => {
  const [showSecurityOptions, setShowSecurityOptions] = useState(false);
  const { toast } = useToast();
  
  const handleSecurityChange = useCallback((level: SecurityLevel) => {
    if (!isAdmin && !isPremiumMember) {
      toast({
        title: "Manglende tillatelse",
        description: "Bare administratorer og premium-medlemmer kan endre sikkerhetsnivå",
        variant: "destructive",
      });
      return;
    }
    
    setSecurityLevel(level);
    setShowSecurityOptions(false);
  }, [isAdmin, isPremiumMember, setSecurityLevel, toast]);
  
  const isSecureConnection = 
    (securityLevel === 'p2p_e2ee' && (
      (connectionState === 'connected' && dataChannelState === 'open') || 
      usingServerFallback
    )) || 
    securityLevel === 'server_e2ee' || 
    securityLevel === 'standard';
  
  return (
    <div className="flex items-center justify-between px-3 py-2 bg-cyberdark-900/80 border-b border-cyberdark-800">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mr-2 text-cybergold-400 hover:bg-cyberdark-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-8 w-8 mr-2">
          {group.avatar_url ? (
            <AvatarImage src={group.avatar_url} alt={group.name} />
          ) : (
            <AvatarFallback className="bg-cyberdark-700 text-cybergold-300">
              {getInitials(group.name)}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex flex-col">
          <h3 className="font-medium text-cybergold-300">{group.name}</h3>
          <div className="text-xs text-cybergold-500 flex items-center gap-1">
            {isSecureConnection ? (
              <Shield className="h-3 w-3" />
            ) : (
              <AlertTriangle className="h-3 w-3 text-amber-500" />
            )}
            <span>{encryptionStatus}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {isPremium && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onShowPremium}
            className="text-cybergold-400 hover:bg-cyberdark-800"
          >
            <Star className="h-5 w-5" />
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onShowInvite}
          className="text-cybergold-400 hover:bg-cyberdark-800"
        >
          <Users className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onShowMembers}
          className="text-cybergold-400 hover:bg-cyberdark-800"
        >
          <InfoIcon className="h-5 w-5" />
        </Button>
        
        {showSecurityOptions ? (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSecurityOptions(false)}
              className="text-cybergold-400 hover:bg-cyberdark-800"
            >
              <Lock className="h-5 w-5" />
            </Button>
            
            <div className="absolute right-0 top-10 z-10 w-48 rounded-md shadow-lg bg-cyberdark-800 border border-cyberdark-700">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu-button">
                <button
                  onClick={() => handleSecurityChange('standard' as SecurityLevel)}
                  className="block w-full text-left px-4 py-2 text-sm text-cybergold-300 hover:bg-cyberdark-700 hover:text-white"
                  role="menuitem"
                >
                  Standard
                </button>
                <button
                  onClick={() => handleSecurityChange('server_e2ee' as SecurityLevel)}
                  className="block w-full text-left px-4 py-2 text-sm text-cybergold-300 hover:bg-cyberdark-700 hover:text-white"
                  role="menuitem"
                >
                  Server E2EE
                </button>
                <button
                  onClick={() => handleSecurityChange('p2p_e2ee' as SecurityLevel)}
                  className="block w-full text-left px-4 py-2 text-sm text-cybergold-300 hover:bg-cyberdark-700 hover:text-white"
                  role="menuitem"
                >
                  Peer-to-Peer E2EE
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSecurityOptions(true)}
            className="text-cybergold-400 hover:bg-cyberdark-800"
          >
            <Lock className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};
