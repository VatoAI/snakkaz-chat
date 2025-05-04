import React from 'react';
import { cn } from '@/lib/utils';
import { User, Users } from 'lucide-react';

interface UserAvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  isGroup?: boolean;
  className?: string;
}

/**
 * Reusable avatar component for users and groups
 */
export function UserAvatar({ 
  src, 
  alt = 'User', 
  size = 'md', 
  isGroup = false,
  className 
}: UserAvatarProps) {
  // Size classes
  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-12 w-12'
  };

  // Icon size classes
  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  return (
    <div 
      className={cn(
        'rounded-full overflow-hidden bg-muted flex-shrink-0', 
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-primary/10">
          {isGroup ? (
            <Users className={cn('text-primary', iconSizeClasses[size])} />
          ) : (
            <User className={cn('text-primary', iconSizeClasses[size])} />
          )}
        </div>
      )}
    </div>
  );
}
