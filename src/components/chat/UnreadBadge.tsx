
import React from 'react';
import { cn } from '@/lib/utils';
import { Variants, motion } from 'framer-motion';

interface UnreadBadgeProps {
  count: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'danger';
  pulse?: boolean;
}

const badgeVariants: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 25 } },
  exit: { scale: 0.8, opacity: 0 }
};

export const UnreadBadge: React.FC<UnreadBadgeProps> = ({
  count,
  className,
  size = 'md',
  variant = 'primary',
  pulse = false
}) => {
  if (!count) return null;
  
  const displayCount = count > 99 ? '99+' : count.toString();
  
  const sizeClasses = {
    sm: 'h-4 min-w-4 text-[10px]',
    md: 'h-5 min-w-5 text-xs',
    lg: 'h-6 min-w-6 text-sm'
  };
  
  const variantClasses = {
    primary: 'bg-cyberblue-600 text-white',
    secondary: 'bg-cybergold-600 text-black',
    danger: 'bg-red-600 text-white'
  };
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={badgeVariants}
      className={cn(
        'flex items-center justify-center rounded-full px-1 font-medium',
        sizeClasses[size],
        variantClasses[variant],
        pulse && 'animate-pulse',
        className
      )}
    >
      {displayCount}
    </motion.div>
  );
};

export default UnreadBadge;
