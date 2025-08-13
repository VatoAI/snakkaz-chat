
import React from 'react';

export interface HeaderActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string; // Legg til className prop
}

export const HeaderActionButton: React.FC<HeaderActionButtonProps> = ({ 
  icon, 
  label, 
  onClick,
  className = ''
}) => {
  return (
    <button 
      className={`p-2 rounded-full hover:bg-cyberdark-800 flex items-center justify-center ${className}`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};
