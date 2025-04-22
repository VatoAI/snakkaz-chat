
import { RefreshCw, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Friend } from "./types";
import { SecurityLevelSelector } from "../security/SecurityLevelSelector";
import { SecurityBadge } from "../security/SecurityBadge";
import { SecurityLevel } from "@/types/security";
import { supabase } from "@/integrations/supabase/client";

interface DirectMessageHeaderProps {
  friend: Friend;
  username: string;
  avatarUrl: string | null;
  connectionState: string;
  dataChannelState: string;
  usingServerFallback: boolean;
  connectionAttempts: number;
  onBack: () => void;
  onReconnect: () => void;
  isTyping?: boolean;
  securityLevel: SecurityLevel;
  setSecurityLevel: (level: SecurityLevel) => void;
}

export const DirectMessageHeader = ({
  friend,
  username,
  avatarUrl,
  connectionState,
  dataChannelState,
  usingServerFallback,
  connectionAttempts,
  onBack,
  onReconnect,
  isTyping,
  securityLevel,
  setSecurityLevel
}: DirectMessageHeaderProps) => {
  return (
    <div className="border-b border-cybergold-500/30 p-3 flex items-center bg-cyberdark-900">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="mr-2 text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center space-x-3 flex-1">
        <Avatar className="w-10 h-10 border-2 border-cybergold-500/20">
          {avatarUrl ? (
            <AvatarImage 
              src={supabase.storage.from('avatars').getPublicUrl(avatarUrl).data.publicUrl} 
              alt={username}
            />
          ) : (
            <AvatarFallback className="bg-cybergold-500/20 text-cybergold-300">
              {username[0].toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex flex-col">
          <h2 className="text-cybergold-200 font-medium">{username}</h2>
          {isTyping ? (
            <p className="text-xs text-green-400">Skriver...</p>
          ) : (
            <p className="text-xs text-cybergold-400">
              {securityLevel === 'p2p_e2ee' && !usingServerFallback 
                ? 'Direkte tilkobling aktiv'
                : securityLevel === 'p2p_e2ee' && usingServerFallback
                ? 'Server tilkobling (E2EE)'
                : securityLevel === 'server_e2ee'
                ? 'Server tilkobling (E2EE)'
                : 'Standard sikkerhet'}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <SecurityBadge
          securityLevel={securityLevel}
          connectionState={connectionState}
          dataChannelState={dataChannelState}
          usingServerFallback={usingServerFallback}
          showLabel={true}
        />
        
        <SecurityLevelSelector
          value={securityLevel}
          onChange={setSecurityLevel}
        />
        
        {securityLevel === 'p2p_e2ee' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onReconnect}
            className="text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800"
            disabled={connectionState === 'connecting'}
          >
            <RefreshCw className={`h-5 w-5 ${connectionState === 'connecting' ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>
    </div>
  );
};
