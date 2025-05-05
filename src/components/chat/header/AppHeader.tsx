import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  variant?: 'default' | 'chat';
  context?: 'direct-message' | 'group-chat' | 'channel';
  title: string;
  subtitle?: string;
  avatar?: React.ReactNode;
  isOnline?: boolean;
  actions?: React.ReactNode;
  onBackClick?: () => void;
  children?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  variant = 'default',
  context,
  title,
  subtitle,
  avatar,
  actions,
  onBackClick,
  children
}) => {
  return (
    <header className="bg-cyberdark-900 border-b border-cyberdark-700 p-3 flex items-center">
      {onBackClick && (
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 rounded-full h-9 w-9 text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800 lg:hidden"
          onClick={onBackClick}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Tilbake</span>
        </Button>
      )}
      
      {avatar && (
        <div className="mr-3">
          {avatar}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-cybergold-400 truncate">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-cybergold-600 truncate">
            {subtitle}
          </p>
        )}
      </div>
      
      {actions && (
        <div className="flex items-center space-x-1">
          {actions}
        </div>
      )}

      {children && (
        <div className="ml-auto">
          {children}
        </div>
      )}
    </header>
  );
};
