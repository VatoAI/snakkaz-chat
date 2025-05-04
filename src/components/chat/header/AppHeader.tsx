import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { HeaderLogo } from './HeaderLogo';
import { MainNav } from '@/components/nav/MainNav';
import { useAuth } from '@/hooks/useAuth';
import { useMediaQuery } from '@/hooks/use-media-query';

type HeaderVariant = 'main' | 'chat' | 'minimal';
type HeaderContext = 'general' | 'direct-message' | 'group-chat' | 'ai-chat';

interface AppHeaderProps {
  variant?: HeaderVariant;
  context?: HeaderContext;
  className?: string;
  showNavigation?: boolean;
  onBackClick?: () => void;
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
 */
export function AppHeader({
  variant = 'main',
  context = 'general',
  className,
  showNavigation = true,
  onBackClick,
  children,
  title,
  subtitle,
  actions,
  avatar,
  isOnline,
}: AppHeaderProps) {
  const { session } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur-sm",
        variant === 'main' ? "bg-cyberdark-900/95 border-cyberblue-500/30 shadow-neon-blue" : 
        variant === 'chat' ? "bg-background border-border h-14" :
        "bg-background/80 border-border",
        className
      )}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Left section - Logo or back button + title */}
        <div className="flex items-center gap-2">
          {variant === 'main' ? (
            <div className="flex items-center space-x-3">
              <HeaderLogo />
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cybergold-400 via-white to-cybergold-400 text-transparent bg-clip-text">
                SnakkaZ
              </h1>
            </div>
          ) : (
            <>
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
              <div className="flex flex-col justify-center">
                {title && <h2 className="font-medium text-foreground truncate">{title}</h2>}
                {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
              </div>
            </>
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
          {actions}
          {children}
        </div>
      </div>
    </header>
  );
}