import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { HeaderLogo } from './HeaderLogo';
import { MainNav } from '@/components/nav/MainNav';
import { UserNav } from '@/components/nav/UserNav';
import { useAuth } from '@/hooks/useAuth';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Download, Menu, Plus } from 'lucide-react';

export type HeaderVariant = 'main' | 'chat' | 'minimal' | 'mobile';
export type HeaderContext = 'general' | 'direct-message' | 'group-chat' | 'ai-chat' | 'mobile';

export interface AppHeaderProps {
  variant?: HeaderVariant;
  context?: HeaderContext;
  className?: string;
  showNavigation?: boolean;
  showLogo?: boolean;
  showUserNav?: boolean;
  showThemeToggle?: boolean;
  showDownloadButton?: boolean;
  onBackClick?: () => void;
  onMenuClick?: () => void;
  onAddClick?: () => void;
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  avatar?: React.ReactNode;
  isOnline?: boolean;
}

/**
 * AppHeader - A unified header component for the entire application
 * 
 * This component provides a consistent header structure across the app,
 * with context-specific content that changes based on the current view.
 * It consolidates multiple header implementations across the application.
 */
export function AppHeader({
  variant = 'main',
  context = 'general',
  className,
  showNavigation = true,
  showLogo = true,
  showUserNav = true,
  showThemeToggle = true,
  showDownloadButton = false,
  onBackClick,
  onMenuClick,
  onAddClick,
  children,
  title = 'SnakkaZ',
  subtitle,
  actions,
  avatar,
  isOnline,
}: AppHeaderProps) {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const handleDownloadClick = () => {
    navigate('/download');
  };
  
  // Determine the appropriate styling based on the variant
  const getHeaderStyles = () => {
    switch (variant) {
      case 'main':
        return "bg-cyberdark-900/95 border-cyberblue-500/30 shadow-neon-blue";
      case 'chat':
        return "bg-background border-border h-14";
      case 'mobile':
        return "bg-background border-border h-14";
      case 'minimal':
      default:
        return "bg-background/80 border-border";
    }
  };
  
  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur-sm",
        getHeaderStyles(),
        className
      )}
    >
      <div className={cn(
        variant === 'main' ? "container mx-auto px-4 py-2" : "px-4 py-2",
        "flex items-center justify-between"
      )}>
        {/* Left section - Logo, back button, menu button, or title */}
        <div className="flex items-center gap-2">
          {variant === 'mobile' && onMenuClick && (
            <Button variant="ghost" size="icon" onClick={onMenuClick}>
              <Menu size={22} />
            </Button>
          )}
          
          {onBackClick && (
            <button
              onClick={onBackClick}
              className="mr-2 p-1.5 rounded-full hover:bg-muted"
              aria-label="Tilbake"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          )}
          
          {showLogo && variant === 'main' ? (
            <div 
              className="flex items-center gap-3 mr-6 group" 
              onClick={() => navigate('/')} 
              style={{ cursor: 'pointer' }}
            >
              <img
                src="/icons/snakkaz-gold.png"
                alt="SnakkaZ Logo"
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-xl font-bold text-cybergold-500 tracking-wide transition-colors duration-200 group-hover:text-cybergold-400">
                SnakkaZ
              </span>
            </div>
          ) : showLogo ? (
            <div className="flex items-center space-x-3">
              <HeaderLogo />
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cybergold-400 via-white to-cybergold-400 text-transparent bg-clip-text">
                SnakkaZ
              </h1>
            </div>
          ) : null}
          
          {avatar && (
            <div className="relative">
              {avatar}
              {isOnline !== undefined && (
                <div 
                  className={cn(
                    "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                    isOnline ? 'bg-green-500' : 'bg-gray-400'
                  )} 
                />
              )}
            </div>
          )}
          
          {(title || subtitle) && (
            <div className="flex flex-col justify-center">
              {title && !showLogo && <h2 className="font-medium text-foreground truncate">{title}</h2>}
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          )}
        </div>

        {/* Middle section - Navigation (desktop only) */}
        {!isMobile && showNavigation && variant === 'main' && (
          <div className="flex-1 flex justify-center">
            <MainNav />
          </div>
        )}

        {/* Right section - Actions */}
        <div className="flex items-center gap-2">
          {variant === 'mobile' && onAddClick && (
            <Button variant="ghost" size="icon" onClick={onAddClick}>
              <Plus size={22} />
            </Button>
          )}
          
          {showThemeToggle && (
            variant === 'main' ? <ThemeToggle /> : <ThemeSwitcher />
          )}
          
          {showDownloadButton && (
            <Button
              variant="outline"
              size="sm"
              className="bg-cybergold-500 border-cybergold-600 text-black font-medium hover:bg-cybergold-400 hover:text-black transition-colors"
              onClick={handleDownloadClick}
            >
              <Download className="w-4 h-4 mr-2" />
              <span className={isMobile ? "hidden" : "inline"}>Last ned app</span>
            </Button>
          )}
          
          {showUserNav && user && <UserNav />}
          
          {actions}
          {children}
        </div>
      </div>
    </header>
  );
}