
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
  avatarUrl?: string | null;  // Added for compatibility
  isGroup?: boolean;  // Added for compatibility with group chats
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  avatarUrl, // Added alternative prop for avatar URL
  alt = 'User',
  fallback,
  size = 40,
  status,
  className,
  fallbackClassName,
  isGroup = false // Default to false
}) => {
  // Use src or avatarUrl, whichever is provided
  const imageUrl = src || avatarUrl;
  const initials = fallback || getInitials(alt);
  
  return (
    <div className="relative">
      <Avatar 
        className={cn(
          "border-2",
          isGroup ? "border-cybergold-700" : "border-cyberdark-700",
          className
        )}
        style={{ width: size, height: size }}
      >
        {imageUrl ? (
          <AvatarImage src={imageUrl} alt={alt} />
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
      
      {status && !isGroup && (
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
