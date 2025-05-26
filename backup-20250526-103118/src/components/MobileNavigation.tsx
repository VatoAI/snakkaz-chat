import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Users, Settings, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MobileNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if a route is active
  const isActive = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Navigation items
  const navItems = [
    { path: '/chat', icon: <MessageCircle />, label: 'Chat' },
    { path: '/group-chat', icon: <Users />, label: 'Grupper' },
    { path: '/profile', icon: <User />, label: 'Profil' },
    { path: '/settings', icon: <Settings />, label: 'Innstillinger' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cyberdark-900 border-t border-cyberdark-700 px-2 pt-2 pb-2 mobile-bottom-safe flex items-center justify-around z-50 shadow-lg">
      {navItems.map((item) => (
        <button 
          key={item.path}
          onClick={() => navigate(item.path)}
          className="flex flex-col items-center justify-center relative w-full"
        >
          <div className={cn(
            "p-2 rounded-full transition-all duration-200 relative",
            isActive(item.path) 
              ? "text-cybergold-400 bg-gradient-to-b from-cyberdark-800 to-cyberdark-850" 
              : "text-cybergold-600"
          )}>
            <div className={cn("h-5 w-5", isActive(item.path) && "animate-pulse-subtle")}>
              {item.icon}
            </div>
          </div>
          
          <span className={cn(
            "text-xs mt-1 transition-colors",
            isActive(item.path) ? "text-cybergold-400" : "text-cybergold-600"
          )}>
            {item.label}
          </span>
          
          {/* Active indicator */}
          {isActive(item.path) && (
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cybergold-400 shadow-[0_0_5px_rgba(218,188,69,0.8)]" />
          )}
        </button>
      ))}
    </nav>
  );
};