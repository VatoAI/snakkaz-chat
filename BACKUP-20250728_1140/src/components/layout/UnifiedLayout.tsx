import React from 'react';
import { SmartMobileNav } from '@/components/mobile/SmartMobileNav';
import { MobileChatHeader } from '@/components/mobile/MobileChatHeader';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/utils/cn';

interface UnifiedLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  showNavigation?: boolean;
  headerActions?: {
    onCall?: () => void;
    onVideoCall?: () => void;
    onOptions?: () => void;
  };
}

export const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({
  children,
  title = "SnakkaZ",
  subtitle = "Secure Chat Platform",
  showHeader = true,
  showNavigation = true,
  headerActions = {}
}) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // Check if user is admin based on metadata or role
  const isAdmin = user?.user_metadata?.role === 'admin' || 
                  user?.app_metadata?.role === 'admin' ||
                  false; // Default to false for safety

  if (!isMobile) {
    // Desktop layout - existing desktop components
    return (
      <div className="min-h-screen bg-cyberdark-950">
        {children}
      </div>
    );
  }

  // Mobile layout with unified navigation
  return (
    <div className="relative min-h-screen bg-cyberdark-950">
      {/* Mobile header */}
      {showHeader && (
        <MobileChatHeader
          title={title}
          subtitle={subtitle}
          isOnline={!!user}
          isSecure={true}
          onCall={headerActions.onCall || (() => alert('📞 Call funksjon'))}
          onVideoCall={headerActions.onVideoCall || (() => alert('📹 Video call funksjon'))}
          onOptions={headerActions.onOptions || (() => alert('⚙️ Innstillinger'))}
        />
      )}

      {/* Main content with proper spacing */}
      <main className={cn(
        showHeader && "pt-16", // Header space
        showNavigation && "pb-24", // Navigation space
        "min-h-screen",
        "mobile-theme-dark"
      )}>
        {children}
      </main>

      {/* Smart mobile navigation */}
      {showNavigation && (
        <SmartMobileNav 
          isAdmin={isAdmin} 
          userRole={isAdmin ? 'admin' : 'user'} 
        />
      )}
    </div>
  );
};
