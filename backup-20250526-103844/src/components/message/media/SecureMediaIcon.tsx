
import { Shield } from "lucide-react";

interface SecureMediaIconProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'sm' | 'md' | 'lg';
}

export const SecureMediaIcon = ({ position, size = 'md' }: SecureMediaIconProps) => {
  // Position classes
  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
  };

  // Size classes
  const sizeClasses = {
    sm: 'p-1 rounded-sm',
    md: 'p-1.5 rounded',
    lg: 'p-2 rounded-md',
  };

  const iconSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className={`absolute ${positionClasses[position]} ${sizeClasses[size]} bg-cybergold-900/80 backdrop-blur-sm z-10`}>
      <Shield className={`${iconSize[size]} text-cybergold-400`} />
    </div>
  );
};
