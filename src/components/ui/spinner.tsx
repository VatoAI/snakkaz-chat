
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

export const Spinner = ({ 
  size = 'md', 
  className, 
  variant = 'default' 
}: SpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
  };

  const variantClasses = {
    default: 'text-gray-400',
    primary: 'text-cybergold-500',
    secondary: 'text-blue-500',
  };

  return (
    <Loader2 
      className={cn(
        "animate-spin",
        sizeClasses[size],
        variantClasses[variant],
        className
      )} 
    />
  );
};

export default Spinner;
