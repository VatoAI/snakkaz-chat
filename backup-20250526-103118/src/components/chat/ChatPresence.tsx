import React, { useState } from 'react';
import { UserStatus } from '@/types/presence';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ChatPresenceProps {
  status: UserStatus;
  showLabel?: boolean;
  className?: string;
  tooltipText?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ChatPresence: React.FC<ChatPresenceProps> = ({
  status,
  showLabel = false,
  className = '',
  tooltipText,
  size = 'md'
}) => {
  // Status color mapping
  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ONLINE:
        return 'bg-green-500';
      case UserStatus.AWAY:
        return 'bg-amber-500';
      case UserStatus.BUSY:
        return 'bg-red-500';
      case 'brb': // Use string literal instead of enum value
        return 'bg-purple-500';
      case UserStatus.OFFLINE:
      default:
        return 'bg-gray-500';
    }
  };

  // Status label mapping
  const getStatusLabel = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ONLINE:
        return 'Online';
      case UserStatus.AWAY:
        return 'Away';
      case UserStatus.BUSY:
        return 'Busy';
      case 'brb': // Use string literal instead of enum value
        return 'Be Right Back';
      case UserStatus.OFFLINE:
      default:
        return 'Offline';
    }
  };

  // Size mapping
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const indicator = (
    <div className={cn(
      'rounded-full', 
      getStatusColor(status),
      sizeClasses[size],
      'animate-pulse',
      className
    )} />
  );

  if (tooltipText) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-1.5">
              {indicator}
              {showLabel && (
                <span className="text-xs text-gray-400">{getStatusLabel(status)}</span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-black text-white text-xs py-1 px-2">
            {tooltipText}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center space-x-1.5">
      {indicator}
      {showLabel && (
        <span className="text-xs text-gray-400">{getStatusLabel(status)}</span>
      )}
    </div>
  );
};
