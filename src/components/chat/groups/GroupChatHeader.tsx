import { Group } from "@/types/group";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Shield, Users, UserPlus, Lock, Layers } from "lucide-react";
import { SecurityLevel } from "@/types/security";
import { SecurityBadge } from "../security/SecurityBadge";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { getGroupAvatarUrl } from "@/utils/group-avatar-utils";
import { ResilientImage } from "@/components/ui/resilient-image";

interface GroupChatHeaderProps {
  group: Group;
  connectionState: string;
  dataChannelState: string;
  usingServerFallback: boolean;
  connectionAttempts: number;
  onBack: () => void;
  onReconnect: () => void;
  securityLevel: SecurityLevel;
  setSecurityLevel: (level: SecurityLevel) => void;
  userProfiles?: Record<string, {username: string | null, avatar_url: string | null}>;
  isAdmin?: boolean;
  onShowInvite?: () => void;
  // Nye props for helside-kryptering
  isPageEncryptionEnabled?: boolean;
  encryptionStatus?: 'idle' | 'encrypting' | 'decrypting' | 'error';
  onEnablePageEncryption?: () => void;
  onEncryptAllMessages?: () => void;
}

export const GroupChatHeader = ({
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
  isAdmin = false,
  onShowInvite,
  // Nye props for helside-kryptering
  isPageEncryptionEnabled = false,
  encryptionStatus = 'idle',
  onEnablePageEncryption,
  onEncryptAllMessages
}: GroupChatHeaderProps) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  
  // Process avatar URL using the new utility
  useEffect(() => {
    if (group.avatar_url) {
      const url = getGroupAvatarUrl(group.avatar_url);
      setImageUrl(url);
    } else {
      setImageUrl('');
    }
  }, [group.avatar_url]);
  
  // Map the connection states to a display indicator
  const getConnectionStatus = () => {
    if (usingServerFallback) {
      return {
        status: "warning",
        message: "Faller tilbake til server",
        icon: <Shield className="h-4 w-4 text-yellow-500" />
      };
    }
    
    if (securityLevel === 'server_e2ee' || securityLevel === 'standard') {
      return {
        status: "ok",
        message: "Server-kryptert",
        icon: <Shield className="h-4 w-4 text-green-500" />
      };
    }

    if (connectionState === 'connected' && dataChannelState === 'open') {
      return {
        status: "ok",
        message: "Tilkoblet P2P",
        icon: <Shield className="h-4 w-4 text-green-500" />
      };
    }
    
    if (connectionState === 'connecting' || connectionAttempts > 0) {
      return {
        status: "warning",
        message: "Kobler til...",
        icon: <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />
      };
    }

    return {
      status: "error",
      message: "Ikke tilkoblet",
      icon: <Shield className="h-4 w-4 text-red-500" />
    };
  };
  
  const connectionStatus = getConnectionStatus();
  
  // Prepare fallback content for group avatar
  const groupAvatarFallback = (
    <AvatarFallback className="bg-cybergold-500/20 text-cybergold-300">
      <Users className="h-5 w-5" />
    </AvatarFallback>
  );
  
  return (
    <header className="bg-cyberdark-900 border-b border-cybergold-500/20 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-cybergold-500 hover:bg-cyberdark-800"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 border-2 border-cybergold-500/20">
              {imageUrl ? (
                <div className="absolute inset-0 w-full h-full">
                  <ResilientImage
                    src={imageUrl}
                    alt={group.name}
                    className="w-full h-full object-cover"
                    fallback={groupAvatarFallback}
                    retryCount={2}
                  />
                </div>
              ) : groupAvatarFallback}
            </Avatar>
            
            <div>
              <h3 className="font-medium text-cybergold-200">{group.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-cybergold-400 flex items-center">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  {group.members.length} {group.members.length === 1 ? 'medlem' : 'medlemmer'}
                </span>
                
                <span 
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full flex items-center",
                    connectionStatus.status === 'ok' ? "bg-green-600/20 text-green-400" : 
                    connectionStatus.status === 'warning' ? "bg-yellow-600/20 text-yellow-400" : 
                    "bg-red-600/20 text-red-400"
                  )}
                >
                  {connectionStatus.icon}
                  <span className="ml-1">{connectionStatus.message}</span>
                </span>
                
                {/* Vis helside-krypteringsindikator hvis aktivert */}
                {isPageEncryptionEnabled && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-cybergold-600/20 text-cybergold-400 flex items-center">
                    <Lock className="h-3.5 w-3.5 mr-1" />
                    <span className="ml-1">Helside-kryptert</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            {/* Helside-krypteringsmeny for administratorer */}
            {isAdmin && onEnablePageEncryption && (
              <Tooltip>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 hover:bg-cyberdark-800",
                        isPageEncryptionEnabled ? "text-cybergold-300" : "text-gray-400"
                      )}
                    >
                      <Layers className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-cyberdark-900 border border-cybergold-500/30">
                    <DropdownMenuItem
                      disabled={isPageEncryptionEnabled || encryptionStatus !== 'idle'}
                      onClick={onEnablePageEncryption}
                      className={cn(
                        "flex items-center cursor-pointer",
                        isPageEncryptionEnabled ? "text-gray-500" : "text-cybergold-400 hover:bg-cyberdark-800"
                      )}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Aktiver helside-kryptering
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator className="bg-cybergold-500/20" />
                    
                    <DropdownMenuItem
                      disabled={!isPageEncryptionEnabled || encryptionStatus !== 'idle'}
                      onClick={onEncryptAllMessages}
                      className={cn(
                        "flex items-center cursor-pointer",
                        !isPageEncryptionEnabled ? "text-gray-500" : "text-cybergold-400 hover:bg-cyberdark-800"
                      )}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Krypter alle meldinger
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <TooltipTrigger asChild>
                  <div className="inline-block">
                    <span className="sr-only">Krypteringsalternativer</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Krypteringsalternativer</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            <SecurityBadge 
              securityLevel={securityLevel}
              connectionState={connectionState}
              dataChannelState={dataChannelState}
              usingServerFallback={usingServerFallback}
            />
            
            {isAdmin && onShowInvite && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800"
                    onClick={onShowInvite}
                  >
                    <UserPlus className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Inviter til gruppe</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {connectionStatus.status === 'error' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800"
                    onClick={onReconnect}
                  >
                    <RefreshCw className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Koble til på nytt</p>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};
