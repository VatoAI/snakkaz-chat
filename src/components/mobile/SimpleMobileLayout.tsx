import React from 'react';
import { Outlet } from 'react-router-dom';
import { MobileBottomNav } from './MobileBottomNav';
import { cn } from '@/utils/cn';

export const SimpleMobileLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-cyberdark-950">
      {/* Main content area with bottom navigation space */}
      <main className={cn(
        "pb-20", // Space for bottom navigation (80px)
        "min-h-screen",
        "mobile-theme-dark" // Theme-aware mobile optimization
      )}>
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <MobileBottomNav />
    </div>
  );
};
