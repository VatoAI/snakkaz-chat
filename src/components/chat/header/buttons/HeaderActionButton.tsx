import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string; // Add className prop
}

export const HeaderActionButton: React.FC<HeaderActionButtonProps> = ({
  icon,
  label,
  onClick,
  className
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn(
        "relative rounded-full h-8 w-8 hover:bg-cyberdark-800 text-cybergold-400",
        className
      )}
      aria-label={label}
    >
      {icon}
    </Button>
  );
};
