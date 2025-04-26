
import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { SecurityLevel } from "@/types/security";
import { cn } from "@/lib/utils";
import { securityColors } from "@/constants/colors";

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
  
  let Icon = Shield;
  let colors = securityColors[securityLevel];
  let title = '';
  
  switch (securityLevel) {
    case 'p2p_e2ee':
      if (fallback) {
        Icon = ShieldAlert;
        title = 'P2P Kryptering (Fallback)';
      } else if (!isConnected && (connectionState || dataChannelState)) {
        Icon = ShieldAlert;
        title = 'P2P Kryptering (Kobler til...)';
      } else {
        Icon = ShieldCheck;
        title = 'Peer-to-Peer End-to-End Kryptering';
      }
      break;
    case 'server_e2ee':
      Icon = ShieldCheck;
      title = 'Server End-to-End Kryptering';
      break;
    case 'standard':
      Icon = Shield;
      title = 'Standard Kryptering';
      break;
  }
  
  return (
    <div 
      className={cn(
        "flex items-center justify-center rounded-full transition-all duration-300", 
        colors.bg,
        colors.glow,
        sizeClasses[size]
      )}
      title={title}
    >
      <Icon className={cn(
        iconSizes[size],
        colors.primary
      )} />
    </div>
  );
};
