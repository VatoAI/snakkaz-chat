import { Group } from "@/types/groups";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Shield, Users, UserPlus, Lock, Layers, Crown, Star, UserCog } from "lucide-react";
import { SecurityLevel } from "@/types/security";
import { SecurityBadge } from "../security/SecurityBadge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

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
  isPremium?: boolean;
  isPremiumMember?: boolean;
  onShowInvite?: () => void;
  onShowPremium?: () => void;
  onShowMembers?: () => void;
  // Props for helside-kryptering
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
  isPremium = false,
  isPremiumMember = false,
  onShowInvite,
  onShowPremium,
  onShowMembers,
  // Helside-krypteringsprops
  isPageEncryptionEnabled = false,
  encryptionStatus = 'idle',
  onEnablePageEncryption,
  onEncryptAllMessages
}: GroupChatHeaderProps) => {
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
        message: isPremiumMember ? "256-bit kryptering" : "Server-kryptert",
        icon: <Shield className="h-4 w-4 text-green-500" />
      };
    }

    if (connectionState === 'connected' && dataChannelState === 'open') {
      return {
        status: "ok",
        message: isPremiumMember ? "Premium P2P forbindelse" : "Tilkoblet P2P",
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
  
  return (
    <header className={cn(
      "bg-cyberdark-900 border-b p-3",
      isPremium ? "border-cybergold-500/40" : "border-cybergold-500/20"
    )}>
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
            <div className="relative">
              <Avatar className={cn(
                "h-10 w-10 border-2",
                isPremium ? "border-cybergold-500/50" : "border-cybergold-500/20"
              )}>
                {group.avatar_url ? (
                  <AvatarImage 
                    src={supabase.storage.from('group_avatars').getPublicUrl(group.avatar_url).data.publicUrl} 
                    alt={group.name} 
                  />
                ) : (
                  <AvatarFallback className="bg-cybergold-500/20 text-cybergold-300">
                    <Users className="h-5 w-5" />
                  </AvatarFallback>
                )}
              </Avatar>
              
              {isPremium && (
                <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-cybergold-500 border border-cyberdark-900 flex items-center justify-center">
                  <Crown className="h-2.5 w-2.5 text-cyberdark-950" />
                </span>
              )}
            </div>
            
            <div>
              <h3 className="font-medium text-cybergold-200 flex items-center gap-1">
                {group.name}
                {isPremium && <Crown className="h-3.5 w-3.5 text-cybergold-400" />}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-cybergold-400 flex items-center cursor-pointer" onClick={onShowMembers}>
                  <Users className="h-3.5 w-3.5 mr-1" />
                  {group.members?.length || 0} {group.members?.length === 1 ? 'medlem' : 'medlemmer'}
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
                    <span>{isPremiumMember ? "256-bit kryptert" : "Kryptert"}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            {/* Premium-medlemskap knapp */}
            {isPremium && onShowPremium && !isPremiumMember && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800"
                    onClick={onShowPremium}
                  >
                    <Star className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Oppgrader til Premium</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {/* Medlemsliste-knapp */}
            {onShowMembers && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800"
                    onClick={onShowMembers}
                  >
                    <UserCog className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Se medlemmer</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Helside-krypteringsmeny */}
            {(isAdmin || isPremiumMember) && onEnablePageEncryption && (
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
                      {isPremiumMember 
                        ? "Aktiver 256-bit kryptering" 
                        : "Aktiver helside-kryptering"}
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
              isPremiumSecurity={isPremiumMember}
            />
            
            {(isAdmin || isPremiumMember) && onShowInvite && (
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
