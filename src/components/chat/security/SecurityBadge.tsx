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
  isPremium?: boolean; // Legger til støtte for premium-status
}

export const SecurityBadge = ({
  securityLevel,
  connectionState,
  dataChannelState,
  usingServerFallback,
  size = 'md',
  isPremium = false // Standard verdi
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
        title = isPremium ? 'Premium P2P Kryptering (Fallback)' : 'P2P Kryptering (Fallback)';
      } else if (!isConnected && (connectionState || dataChannelState)) {
        Icon = ShieldAlert;
        title = isPremium ? 'Premium P2P Kryptering (Kobler til...)' : 'P2P Kryptering (Kobler til...)';
      } else {
        Icon = ShieldCheck;
        title = isPremium ? '256-bit Peer-to-Peer Kryptering' : 'Peer-to-Peer End-to-End Kryptering';
      }
      break;
    case 'server_e2ee':
      Icon = ShieldCheck;
      title = isPremium ? '256-bit Server Kryptering' : 'Server End-to-End Kryptering';
      break;
    case 'standard':
      Icon = Shield;
      title = isPremium ? 'Forbedret Standard Kryptering' : 'Standard Kryptering';
      break;
  }
  
  // Forsterker glow-effekten for premium-brukere
  const premiumGlowClass = isPremium ? 'shadow-lg shadow-cybergold-500/20' : '';
  
  return (
    <div 
      className={cn(
        "flex items-center justify-center rounded-full transition-all duration-300", 
        colors.bg,
        colors.glow,
        sizeClasses[size],
        isPremium && 'border border-cybergold-500/40',
        premiumGlowClass
      )}
      title={title}
    >
      <Icon className={cn(
        iconSizes[size],
        isPremium ? 'text-cybergold-300' : colors.primary
      )} />
    </div>
  );
};
