import React from 'react';
import { cn } from '@/lib/utils';
import { TrustLevel, trustConfig } from '@/utils/trustSystem';

interface TrustBadgeProps {
  trustLevel: TrustLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    container: 'h-5 px-1',
    icon: 'text-xs',
    text: 'text-xs'
  },
  md: {
    container: 'h-6 px-2',
    icon: 'text-sm',
    text: 'text-xs'
  },
  lg: {
    container: 'h-7 px-2',
    icon: 'text-base',
    text: 'text-sm'
  }
};

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  trustLevel,
  size = 'md',
  showLabel = false,
  className
}) => {
  const config = trustConfig[trustLevel];
  const sizeClasses = sizeConfig[size];
  
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border transition-all duration-200',
        config.bgColor,
        config.borderColor,
        sizeClasses.container,
        className
      )}
      title={config.label}
    >
      <span className={cn('mr-1', sizeClasses.icon)}>
        {config.icon}
      </span>
      {showLabel && (
        <span className={cn(config.color, sizeClasses.text, 'font-medium')}>
          {config.label}
        </span>
      )}
    </div>
  );
};
