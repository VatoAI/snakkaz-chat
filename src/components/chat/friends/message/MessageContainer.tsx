
import { ReactNode } from "react";

interface MessageContainerProps {
  children: ReactNode;
  isCurrentUser: boolean;
  isDeleted: boolean;
}

export const MessageContainer = ({ children, isCurrentUser, isDeleted }: MessageContainerProps) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} my-2`}>
      <div className="group relative max-w-[85%] sm:max-w-[75%]">
        <div className={`
          p-3 rounded-2xl shadow-lg transition-all duration-300
          ${isCurrentUser 
            ? 'bg-gradient-to-br from-cyberblue-600/90 to-cyberblue-800/90 text-white border border-cyberblue-400/20' 
            : 'bg-gradient-to-br from-cyberdark-800/95 to-cyberdark-900/95 text-cybergold-200 border border-cybergold-500/20'
          } 
          ${isDeleted ? 'opacity-50 italic' : ''}
          backdrop-blur-sm hover:shadow-neon-blue/10
        `}>
          {children}
        </div>
      </div>
    </div>
  );
};
