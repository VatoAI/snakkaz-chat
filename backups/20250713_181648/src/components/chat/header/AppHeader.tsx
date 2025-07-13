import React from 'react';
import { ArrowLeft, Menu, Plus } from 'lucide-react';
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
  onMenuClick?: () => void;
  onAddClick?: () => void;
  children?: React.ReactNode; // Added children prop
  showNavigation?: boolean;
  showLogo?: boolean;
  showUserNav?: boolean;
  showThemeToggle?: boolean;
  showDownloadButton?: boolean;
  className?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  variant = 'default',
  context,
  title,
  subtitle,
  avatar,
  actions,
  onBackClick,
  onMenuClick,
  onAddClick,
  children,
  className
}) => {
  return (
    <header className={`bg-cyberdark-900 border-b border-cyberdark-700 p-3 flex items-center ${className || ''}`}>
      {/* Hamburger menu button - only show if onMenuClick is provided */}
      {onMenuClick && (
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 rounded-full h-9 w-9 text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Meny</span>
        </Button>
      )}
      
      {/* Back button - only show if onBackClick is provided */}
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
      
      {/* Add button - only show if onAddClick is provided */}
      {onAddClick && (
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 rounded-full h-9 w-9 text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800"
          onClick={onAddClick}
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">Legg til</span>
        </Button>
      )}
      
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
