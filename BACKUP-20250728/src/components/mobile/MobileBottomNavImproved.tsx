import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { 
  MessageCircle, 
  Users, 
  Hash,
  User,
  Bell,
  Search,
  Plus
} from 'lucide-react';

interface NavTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
  badge?: number;
  description: string;
}

// Optimized mobile navigation based on user behavior patterns
const tabs: NavTab[] = [
  {
    id: 'chats',
    label: 'Chats',
    icon: MessageCircle,
    path: '/chat',
    badge: 3,
    description: 'Private meldinger og samtaler'
  },
  {
    id: 'groups',
    label: 'Grupper',
    icon: Hash,
    path: '/groups',
    badge: 1,
    description: 'Fellesskap og team-chats'
  },
  {
    id: 'contacts',
    label: 'Kontakter',
    icon: Users,
    path: '/contacts',
    description: 'Venner og kontakter'
  },
  {
    id: 'profile',
    label: 'Profil',
    icon: User,
    path: '/profile',
    description: 'Din profil og innstillinger'
  }
];

export const MobileBottomNavImproved: React.FC = () => {
  const location = useLocation();

  return (
    <>
      {/* Bottom navigation with improved spacing */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-cyberdark-900/98 backdrop-blur-xl border-t border-cyberdark-700/50 shadow-2xl">
        {/* Main navigation area */}
        <div className="relative">
          <div className="flex items-center justify-around px-2 py-1">
            {tabs.map((tab) => {
              const isActive = location.pathname.startsWith(tab.path);
              const Icon = tab.icon;
              
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={cn(
                    "flex flex-col items-center justify-center relative group",
                    "min-h-[60px] min-w-[60px] px-3 py-2",
                    "transition-all duration-300 ease-out",
                    "active:scale-90",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cybergold-500 focus-visible:rounded-lg",
                    isActive 
                      ? "text-cybergold-400" 
                      : "text-cyberdark-300 hover:text-cyberdark-100"
                  )}
                >
                  {/* Active state background */}
                  {isActive && (
                    <div className="absolute inset-x-1 inset-y-1 bg-cybergold-500/10 rounded-lg border border-cybergold-500/20" />
                  )}
                  
                  <div className="relative z-10">
                    <Icon 
                      size={22} 
                      className={cn(
                        "transition-all duration-300",
                        isActive && "scale-110 drop-shadow-sm"
                      )} 
                    />
                    {tab.badge && tab.badge > 0 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium shadow-lg">
                        {tab.badge > 99 ? '99+' : tab.badge}
                      </div>
                    )}
                  </div>
                  
                  <span className={cn(
                    "text-xs font-medium mt-1 transition-all duration-300 relative z-10",
                    isActive ? "opacity-100 text-cybergold-400" : "opacity-70"
                  )}>
                    {tab.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* iPhone home indicator safe area */}
        <div className="pb-safe h-1" />
      </nav>

      {/* Quick actions floating button */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          className={cn(
            "bg-cybergold-500 hover:bg-cybergold-400 text-cyberdark-900",
            "w-14 h-14 rounded-full shadow-2xl",
            "flex items-center justify-center",
            "transition-all duration-300 ease-out",
            "active:scale-90 hover:scale-105",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cybergold-300"
          )}
          onClick={() => alert('🚀 Quick actions: Ny chat, Ny gruppe, Legg til kontakt')}
        >
          <Plus size={24} className="font-bold" />
        </button>
      </div>
    </>
  );
};
