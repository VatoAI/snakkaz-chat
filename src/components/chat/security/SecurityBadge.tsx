
import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { SecurityLevel } from "@/types/security";
import { cn } from "@/lib/utils";

interface SecurityBadgeProps {
  securityLevel: SecurityLevel;
  connectionState?: string;
  dataChannelState?: string;
  usingServerFallback?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SecurityBadge = ({
  securityLevel,
  connectionState,
  dataChannelState,
  usingServerFallback,
  size = 'md'
}: SecurityBadgeProps) => {
  const isConnected = connectionState === 'connected' && dataChannelState === 'open';
  const fallback = usingServerFallback === true;
  
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7"
  };
  
  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };
  
  // Determine color and icon based on security level
  let bgColor = '';
  let Icon = Shield;
  let title = '';
  
  switch (securityLevel) {
    case 'p2p_e2ee':
      if (fallback) {
        bgColor = 'bg-amber-500/30';
        Icon = ShieldAlert;
        title = 'P2P Kryptering (Fallback)';
      } else if (!isConnected && (connectionState || dataChannelState)) {
        bgColor = 'bg-amber-500/30';
        Icon = ShieldAlert;
        title = 'P2P Kryptering (Kobler til...)';
      } else {
        bgColor = 'bg-green-500/30';
        Icon = ShieldCheck;
        title = 'Peer-to-Peer End-to-End Kryptering';
      }
      break;
    case 'server_e2ee':
      bgColor = 'bg-blue-500/30';
      Icon = ShieldCheck;
      title = 'Server End-to-End Kryptering';
      break;
    case 'standard':
      bgColor = 'bg-amber-600/30';
      Icon = Shield;
      title = 'Standard Kryptering';
      break;
  }
  
  return (
    <div 
      className={cn(
        "flex items-center justify-center rounded-full", 
        bgColor,
        sizeClasses[size]
      )}
      title={title}
    >
      <Icon className={iconSizes[size]} />
    </div>
  );
};
