import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';

interface TypingUser {
  id: string;
  name: string;
  avatar?: string;
}

interface ChatTypingIndicatorProps {
  typingUsers?: TypingUser[];
  className?: string;
  variant?: 'compact' | 'full';
  showAvatars?: boolean;
}

export const ChatTypingIndicator: React.FC<ChatTypingIndicatorProps> = ({
  typingUsers = [],
  className,
  variant = 'full',
  showAvatars = true
}) => {
  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].name} skriver...`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].name} og ${typingUsers[1].name} skriver...`;
    } else {
      return `${typingUsers[0].name} og ${typingUsers.length - 1} andre skriver...`;
    }
  };

  if (variant === 'compact') {
    return (
      <div className={cn(
        'flex items-center gap-1 px-3 py-1.5 bg-cyberdark-800/60 rounded-lg border border-cybergold-900/30 max-w-[100px]',
        'animate-in slide-in-from-bottom-2 duration-300',
        className
      )}>
        <div className="typing-dot bg-cybergold-500"></div>
        <div className="typing-dot bg-cybergold-500 delay-150"></div>
        <div className="typing-dot bg-cybergold-500 delay-300"></div>
        <style jsx>{`
          .typing-dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            opacity: 0.7;
            animation: typing-pulse 1.5s ease-in-out infinite;
          }
          .delay-150 {
            animation-delay: 150ms;
          }
          .delay-300 {
            animation-delay: 300ms;
          }
          @keyframes typing-pulse {
            0%, 60%, 100% {
              opacity: 0.3;
              transform: scale(0.8);
            }
            30% {
              opacity: 1;
              transform: scale(1.2);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-2 mx-4 mb-2 bg-cyberdark-800/60 rounded-lg border border-cybergold-900/30 backdrop-blur-sm',
      'animate-in slide-in-from-bottom-2 duration-300',
      className
    )}>
      {/* User avatars */}
      {showAvatars && (
        <div className="flex -space-x-2">
          {typingUsers.slice(0, 3).map((user, index) => (
            <Avatar
              key={user.id}
              className={cn(
                'h-6 w-6 border-2 border-cyberdark-800 animate-in zoom-in duration-200',
                index > 0 && 'ml-[-8px]'
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-cybergold-600 flex items-center justify-center text-xs text-black font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </Avatar>
          ))}
        </div>
      )}

      {/* Typing text and animation */}
      <div className="flex items-center gap-2 text-sm text-cybergold-300">
        <span className="animate-in fade-in duration-300">
          {getTypingText()}
        </span>
        
        {/* Enhanced typing dots */}
        <div className="flex gap-1">
          <div className="typing-dot-enhanced bg-cybergold-400"></div>
          <div className="typing-dot-enhanced bg-cybergold-400 delay-200"></div>
          <div className="typing-dot-enhanced bg-cybergold-400 delay-400"></div>
        </div>
      </div>

      <style jsx>{`
        .typing-dot-enhanced {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          animation: enhanced-pulse 1.8s ease-in-out infinite;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-400 {
          animation-delay: 400ms;
        }
        @keyframes enhanced-pulse {
          0%, 60%, 100% {
            opacity: 0.4;
            transform: scale(0.6);
          }
          30% {
            opacity: 1;
            transform: scale(1.4);
          }
        }
      `}</style>
    </div>
  );
};