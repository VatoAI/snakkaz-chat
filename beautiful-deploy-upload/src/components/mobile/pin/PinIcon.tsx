
import { Lock, Unlock } from "lucide-react";

interface PinIconProps {
  isSetMode: boolean;
  animateError: boolean;
}

export const PinIcon = ({ isSetMode, animateError }: PinIconProps) => {
  return (
    <div className="mt-4 mb-2 flex justify-center">
      <div className={`p-4 rounded-full bg-cyberdark-800 border border-cybergold-500/30 
                    ${animateError ? 'animate-shake border-cyberred-500' : ''}`}>
        {isSetMode ? (
          <Lock className="h-8 w-8 text-cybergold-400" />
        ) : (
          <Unlock className="h-8 w-8 text-cybergold-400" />
        )}
      </div>
    </div>
  );
};
