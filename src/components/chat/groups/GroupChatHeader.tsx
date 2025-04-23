import { Group } from "@/types/group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Shield, Users, UserPlus } from "lucide-react";
import { SecurityLevel } from "@/types/security";
import { SecurityBadge } from "../security/SecurityBadge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  onShowInvite
}: any) => {
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
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <SecurityBadge 
              securityLevel={securityLevel} 
              setSecurityLevel={setSecurityLevel}
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
