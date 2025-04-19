
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface NavButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  variant: 'blue' | 'red' | 'gold';
}

const variantStyles = {
  blue: "bg-cyberdark-800/90 border-cyberblue-400/50 text-cyberblue-400 hover:bg-cyberdark-700 hover:border-cyberblue-400 hover:text-cyberblue-300 shadow-neon-blue",
  red: "bg-cyberdark-800/90 border-cyberred-400/50 text-cyberred-400 hover:bg-cyberdark-700 hover:border-cyberred-400 hover:text-cyberred-300 shadow-neon-red",
  gold: "bg-cyberdark-800/90 border-cybergold-400/50 text-cybergold-400 hover:bg-cyberdark-700 hover:border-cybergold-400 hover:text-cybergold-300 shadow-neon-gold"
};

export const NavButton = ({ icon: Icon, onClick, variant }: NavButtonProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className={variantStyles[variant]}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};
