
import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SecureMediaIconProps {
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  size?: 'sm' | 'md' | 'lg';
}

export const SecureMediaIcon = ({ 
  position = 'top-right', 
  size = 'sm' 
}: SecureMediaIconProps) => {
  const positionClass = {
    'top-right': 'top-2 right-2',
    'bottom-right': 'bottom-2 right-2',
    'top-left': 'top-2 left-2',
    'bottom-left': 'bottom-2 left-2'
  }[position];
  
  const sizeClass = {
    'sm': 'h-3 w-3',
    'md': 'h-4 w-4',
    'lg': 'h-5 w-5'
  }[size];
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`absolute ${positionClass} bg-cyberblue-900/90 p-1.5 rounded-full border border-cyberblue-500/30 shadow-neon-blue`}>
          <Lock className={`${sizeClass} text-cyberblue-400`} />
        </div>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p className="text-xs">Ende-til-ende kryptert</p>
      </TooltipContent>
    </Tooltip>
  );
};
