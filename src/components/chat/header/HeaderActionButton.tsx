
import React from 'react';
import { Button } from '@/components/ui/button';

interface HeaderActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export const HeaderActionButton: React.FC<HeaderActionButtonProps> = ({
  icon,
  label,
  onClick
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full h-9 w-9 text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800"
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {icon}
    </Button>
  );
};
