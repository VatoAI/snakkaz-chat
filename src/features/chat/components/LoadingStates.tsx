import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, MessageCircle, Send, Wifi, WifiOff } from 'lucide-react';
import { TypingDots as StandardTypingDots } from '../common/StandardLoading';

interface LoadingStateProps {
  type: 'messages' | 'sending' | 'typing' | 'connecting' | 'uploading' | 'custom';
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  showIcon?: boolean;
}

interface MessageSkeletonProps {
  count?: number;
  className?: string;
}

interface TypingDotsProps {
  className?: string;
  color?: 'gold' | 'blue' | 'green';
}

// 🚀 SNAKKAZ STANDARDIZED TYPING DOTS
// Bruker ny StandardTypingDots komponent
export const TypingDots: React.FC<TypingDotsProps> = ({
  className,
  color = 'gold'
}) => {
  return <StandardTypingDots className={className} color={color} />;
};// Message skeleton for loading states
export const MessageSkeleton: React.FC<MessageSkeletonProps> = ({
  count = 3,
  className
}) => {
  return (
    <div className={cn('space-y-4 p-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-3 animate-pulse">
          {/* Avatar skeleton */}
          <div className="w-8 h-8 bg-cyberdark-700 rounded-full shrink-0" />

          {/* Message content skeleton */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-20 h-3 bg-cyberdark-700 rounded" />
              <div className="w-12 h-2 bg-cyberdark-800 rounded" />
            </div>
            <div className={cn(
              'space-y-1',
              index % 2 === 0 ? 'mr-20' : 'mr-8' // Vary message lengths
            )}>
              <div className="w-full h-3 bg-cyberdark-700 rounded" />
              {Math.random() > 0.5 && (
                <div className="w-3/4 h-3 bg-cyberdark-700 rounded" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main loading state component
export const LoadingState: React.FC<LoadingStateProps> = ({
  type,
  message,
  className,
  size = 'md',
  variant = 'spinner',
  showIcon = true
}) => {
  const sizeClasses = {
    sm: 'text-sm gap-2',
    md: 'text-base gap-3',
    lg: 'text-lg gap-4'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getIcon = () => {
    switch (type) {
      case 'messages':
        return <MessageCircle className={iconSizes[size]} />;
      case 'sending':
        return <Send className={iconSizes[size]} />;
      case 'typing':
        return <MessageCircle className={iconSizes[size]} />;
      case 'connecting':
        return <Wifi className={iconSizes[size]} />;
      case 'uploading':
        return <Loader2 className={cn(iconSizes[size], 'animate-spin')} />;
      default:
        return <Loader2 className={cn(iconSizes[size], 'animate-spin')} />;
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'messages':
        return 'Laster meldinger...';
      case 'sending':
        return 'Sender melding...';
      case 'typing':
        return 'Skriver...';
      case 'connecting':
        return 'Kobler til...';
      case 'uploading':
        return 'Laster opp...';
      default:
        return 'Laster...';
    }
  };

  if (variant === 'skeleton' && type === 'messages') {
    return <MessageSkeleton className={className} />;
  }

  if (variant === 'dots') {
    return (
      <div className={cn(
        'flex items-center justify-center',
        sizeClasses[size],
        className
      )}>
        {showIcon && getIcon()}
        <TypingDots />
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn(
        'flex items-center justify-center',
        sizeClasses[size],
        className
      )}>
        <div className="animate-pulse flex items-center gap-3">
          {showIcon && (
            <div className={cn(
              'rounded-full bg-cybergold-400',
              size === 'sm' && 'w-4 h-4',
              size === 'md' && 'w-5 h-5',
              size === 'lg' && 'w-6 h-6'
            )} />
          )}
          <div className="text-cybergold-300">
            {message || getDefaultMessage()}
          </div>
        </div>
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className={cn(
      'flex items-center justify-center text-cybergold-300',
      sizeClasses[size],
      className
    )}>
      {showIcon && (
        <div className="relative">
          {getIcon()}
          {type === 'connecting' && (
            <div className="absolute inset-0 animate-ping">
              <Wifi className={cn(iconSizes[size], 'opacity-75')} />
            </div>
          )}
        </div>
      )}
      <span>{message || getDefaultMessage()}</span>
    </div>
  );
};

// Specialized loading components
export const MessagesLoading: React.FC<{ variant?: 'spinner' | 'skeleton' }> = ({
  variant = 'skeleton'
}) => (
  <LoadingState
    type="messages"
    variant={variant}
    className="py-8"
  />
);

export const SendingMessage: React.FC<{ message?: string }> = ({ message }) => (
  <LoadingState
    type="sending"
    message={message}
    size="sm"
    className="text-cybergold-400 animate-pulse"
  />
);

export const ConnectingStatus: React.FC<{ isConnected?: boolean }> = ({
  isConnected
}) => {
  if (isConnected) {
    return (
      <div className="flex items-center gap-2 text-green-400 text-sm">
        <Wifi className="w-4 h-4" />
        <span>Tilkoblet</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-red-400 text-sm animate-pulse">
      <WifiOff className="w-4 h-4" />
      <span>Ikke tilkoblet</span>
    </div>
  );
};

export const UploadProgress: React.FC<{
  fileName: string;
  progress: number;
  className?: string;
}> = ({ fileName, progress, className }) => (
  <div className={cn(
    'flex items-center gap-3 p-2 bg-cyberdark-800/50 rounded-lg border border-cyberdark-700',
    className
  )}>
    <Loader2 className="w-4 h-4 animate-spin text-cybergold-400" />
    <div className="flex-1 min-w-0">
      <div className="text-sm text-cybergold-300 truncate">{fileName}</div>
      <div className="w-full bg-cyberdark-700 rounded-full h-1 mt-1">
        <div
          className="bg-cybergold-400 h-1 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
    <span className="text-xs text-cybergold-400">{progress}%</span>
  </div>
);

// Chat-specific loading wrapper
export const ChatLoadingWrapper: React.FC<{
  isLoading: boolean;
  type: 'messages' | 'sending' | 'connecting';
  children: React.ReactNode;
  loadingMessage?: string;
}> = ({ isLoading, type, children, loadingMessage }) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingState
          type={type}
          message={loadingMessage}
          variant={type === 'messages' ? 'skeleton' : 'spinner'}
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingState;
