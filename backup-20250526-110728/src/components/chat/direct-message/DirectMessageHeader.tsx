import { ArrowLeft, RefreshCcw, Shield, ShieldCheck, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Friend } from "../friends/types";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { SecurityLevel } from "@/types/security";
import { SecurityLevelSelect } from "../security/SecurityLevelSelect";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SecurityVerification } from "@/components/security/SecurityVerification";

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
  securityLevel,
  setSecurityLevel
}: DirectMessageHeaderProps) => {
  const isConnected = connectionState === 'connected' && dataChannelState === 'open';
  const [isVerificationOpen, setIsVerificationOpen] = useState<boolean>(false);
  
  return (
    <>
      <div className="p-4 border-b border-cybergold-500/30 bg-cyberdark-900 flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 text-cybergold-400" />
        </Button>
        
        <div className="relative mr-3">
          <div className="h-10 w-10 rounded-full bg-cybergold-900 border border-cybergold-500/50 overflow-hidden">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={username} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-cybergold-400 bg-cyberdark-800">
                {username?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>
          
          <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-cyberdark-900"></div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-medium text-cybergold-200">{username}</h3>
          
          <div className="flex items-center gap-2">
            {securityLevel === 'p2p_e2ee' && (
              <ConnectionStatus 
                connectionState={connectionState} 
                dataChannelState={dataChannelState} 
                usingServerFallback={usingServerFallback}
              />
            )}
            
            <SecurityIndicator securityLevel={securityLevel} />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {(securityLevel === 'p2p_e2ee' || securityLevel === 'server_e2ee') && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsVerificationOpen(true)}
                    className="h-8 w-8 text-cybergold-400 hover:text-cybergold-200"
                  >
                    <Fingerprint className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Verifiser identitet</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        
          {securityLevel === 'p2p_e2ee' && !isConnected && connectionAttempts > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onReconnect}
                    className="h-8 w-8 text-cybergold-400 hover:text-cybergold-200"
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Forsøk å koble til igjen</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <SecurityLevelSelect 
            value={securityLevel} 
            onValueChange={setSecurityLevel} 
          />
        </div>
      </div>
      
      <Dialog open={isVerificationOpen} onOpenChange={setIsVerificationOpen}>
        <DialogContent className="bg-cyberdark-900 border-cybergold-500/20 text-cyberdark-100">
          <DialogHeader>
            <DialogTitle className="text-cybergold-300">Verifiser identitet</DialogTitle>
          </DialogHeader>
          <SecurityVerification 
            userId={friend.user_id}
            userName={username}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

const ConnectionStatus = ({ 
  connectionState, 
  dataChannelState,
  usingServerFallback 
}: { 
  connectionState: string;
  dataChannelState: string;
  usingServerFallback: boolean;
}) => {
  if (usingServerFallback) {
    return (
      <Badge variant="secondary" className="text-[10px] h-5 px-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30">
        Fallback
      </Badge>
    );
  }
  
  if (connectionState === 'connected' && dataChannelState === 'open') {
    return (
      <Badge variant="secondary" className="text-[10px] h-5 px-1 bg-green-500/20 text-green-300 hover:bg-green-500/30">
        P2P Tilkoblet
      </Badge>
    );
  }
  
  if (connectionState === 'connecting' || dataChannelState === 'connecting') {
    return (
      <Badge variant="secondary" className="text-[10px] h-5 px-1 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
        Kobler til...
      </Badge>
    );
  }
  
  return (
    <Badge variant="secondary" className="text-[10px] h-5 px-1 bg-red-500/20 text-red-300 hover:bg-red-500/30">
      Frakoblet
    </Badge>
  );
};

const SecurityIndicator = ({ securityLevel }: { securityLevel: SecurityLevel }) => {
  let color = '';
  let icon = null;
  let label = '';
  
  switch (securityLevel) {
    case 'p2p_e2ee':
      color = 'bg-green-500/20 text-green-300 hover:bg-green-500/30';
      icon = <ShieldCheck className="h-3 w-3" />;
      label = 'P2P E2EE';
      break;
    case 'server_e2ee':
      color = 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30';
      icon = <ShieldCheck className="h-3 w-3" />;
      label = 'Server E2EE';
      break;
    case 'standard':
      color = 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30';
      icon = <Shield className="h-3 w-3" />;
      label = 'Standard';
      break;
  }
  
  return (
    <Badge variant="secondary" className={`text-[10px] h-5 px-1 flex items-center gap-1 ${color}`}>
      {icon} {label}
    </Badge>
  );
};
