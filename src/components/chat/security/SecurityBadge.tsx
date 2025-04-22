
import React from 'react';
import { Shield, ShieldCheck, ShieldAlert, Wifi, WifiOff } from 'lucide-react';
import { cn } from "@/lib/utils";
import { SecurityLevel } from '@/types/security';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SecurityBadgeProps {
  securityLevel: SecurityLevel;
  connectionState?: string;
  dataChannelState?: string;
  usingServerFallback?: boolean;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SecurityBadge = ({
  securityLevel,
  connectionState,
  dataChannelState,
  usingServerFallback = false,
  className,
  showLabel = false,
  size = 'md'
}: SecurityBadgeProps) => {
  const isConnected = connectionState === 'connected' && dataChannelState === 'open';
  const isP2P = securityLevel === 'p2p_e2ee' && isConnected && !usingServerFallback;
  
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-3 w-3';
      case 'lg': return 'h-5 w-5';
      default: return 'h-4 w-4';
    }
  };
  
  const getTextSize = () => {
    switch (size) {
      case 'sm': return 'text-xs';
      case 'lg': return 'text-sm';
      default: return 'text-xs';
    }
  };
  
  const getLabel = () => {
    if (securityLevel === 'p2p_e2ee') {
      return isP2P ? 'P2P + E2EE' : 'E2EE (P2P tilkobling mislyktes)';
    } else if (securityLevel === 'server_e2ee') {
      return 'Server + E2EE';
    } else {
      return 'Standard';
    }
  };
  
  const getTooltipText = () => {
    if (securityLevel === 'p2p_e2ee') {
      return isP2P 
        ? 'Høyeste sikkerhetsnivå: Direkte tilkobling med ende-til-ende-kryptering' 
        : 'Ende-til-ende-kryptering aktiv, men direkte tilkobling mislyktes';
    } else if (securityLevel === 'server_e2ee') {
      return 'Medium sikkerhetsnivå: Ende-til-ende-kryptering via server';
    } else {
      return 'Grunnleggende sikkerhetsnivå med server-basert kryptering';
    }
  };
  
  const renderIcon = () => {
    const iconSize = getIconSize();
    
    if (securityLevel === 'p2p_e2ee') {
      return (
        <div className="flex items-center">
          <ShieldCheck className={cn(iconSize, "text-green-500")} />
          {isP2P && <Wifi className={cn(iconSize, "text-green-500 ml-0.5")} />}
          {!isP2P && <WifiOff className={cn(iconSize, "text-amber-500 ml-0.5")} />}
        </div>
      );
    } else if (securityLevel === 'server_e2ee') {
      return <Shield className={cn(iconSize, "text-blue-500")} />;
    } else {
      return <ShieldAlert className={cn(iconSize, "text-amber-500")} />;
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 rounded-full", 
            securityLevel === 'p2p_e2ee' ? "bg-green-500/10 border border-green-500/30" : 
            securityLevel === 'server_e2ee' ? "bg-blue-500/10 border border-blue-500/30" : 
            "bg-amber-500/10 border border-amber-500/30",
            className
          )}>
            {renderIcon()}
            {showLabel && (
              <span className={cn(
                getTextSize(),
                securityLevel === 'p2p_e2ee' ? "text-green-400" : 
                securityLevel === 'server_e2ee' ? "text-blue-400" : 
                "text-amber-400"
              )}>
                {getLabel()}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
