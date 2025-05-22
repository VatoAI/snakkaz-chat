import { useState, useEffect } from 'react';
import { UserStatus } from '@/types/presence';
import { StatusIcon } from './StatusIcon';
import { cn } from "@/lib/utils";
import { statusLabels } from "@/constants/statusConfig";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StatusIndicatorProps {
  status: UserStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
  animated?: boolean;
  lastActive?: string | Date;
}

export function StatusIndicator({
  status,
  size = 'md',
  className,
  showLabel = false,
  animated = true,
  lastActive
}: StatusIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState<string>('');
  
  // Size mapping
  const sizeMap = {
    sm: 3,
    md: 4,
    lg: 5
  };
  
  // Format time ago
  useEffect(() => {
    if (!lastActive || status === 'online') return;
    
    const updateTimeAgo = () => {
      if (!lastActive) return '';
      
      const now = new Date();
      const activeTime = typeof lastActive === 'string' 
        ? new Date(lastActive) 
        : lastActive;
      
      const diffMs = now.getTime() - activeTime.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'nå nettopp';
      if (diffMins < 60) return `${diffMins} min siden`;
      
      const diffHrs = Math.floor(diffMins / 60);
      if (diffHrs < 24) return `${diffHrs} t siden`;
      
      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays} d siden`;
    };
    
    setTimeAgo(updateTimeAgo());
    
    // Update time ago every minute
    const interval = setInterval(() => {
      setTimeAgo(updateTimeAgo());
    }, 60000);
    
    return () => clearInterval(interval);
  }, [lastActive, status]);
  
  // Status label to display
  const label = statusLabels[status] || 'Offline';
  
  // For offline status with last active time
  const tooltipContent = status === 'offline' && timeAgo
    ? `${label} · Sist aktiv ${timeAgo}`
    : label;
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className={cn(
            "flex items-center", 
            className
          )}>
            <StatusIcon 
              status={status} 
              size={sizeMap[size]}
              pulseEffect={animated && status === 'online'}
              className="mr-1.5"
            />
            
            {showLabel && (
              <span className="text-xs font-medium">{label}</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
