
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { getInitials } from '@/utils/user';
import { UserStatus } from '@/types/presence';

export interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: number;
  status?: UserStatus | string;
  className?: string;
  fallbackClassName?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt = 'User',
  fallback,
  size = 40,
  status,
  className,
  fallbackClassName
}) => {
  const initials = fallback || getInitials(alt);
  
  return (
    <div className="relative">
      <Avatar 
        className={cn(
          "border-2 border-cyberdark-700",
          className
        )}
        style={{ width: size, height: size }}
      >
        {src ? (
          <AvatarImage src={src} alt={alt} />
        ) : (
          <AvatarFallback 
            className={cn(
              "bg-cyberdark-700 text-cybergold-300",
              fallbackClassName
            )}
          >
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
      
      {status && (
        <span 
          className={cn(
            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-cyberdark-900",
            typeof status === 'string' ? (
              status === 'online' ? 'bg-green-500' :
              status === 'away' ? 'bg-amber-500' :
              status === 'busy' ? 'bg-red-500' :
              status === 'brb' ? 'bg-purple-500' :
              'bg-gray-500'
            ) : 'bg-gray-500'
          )}
        />
      )}
    </div>
  );
};
