import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { 
  MessageCircle, 
  Users, 
  UserPlus, 
  Settings,
  Heart
} from 'lucide-react';

interface NavTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
  badge?: number;
}

const tabs: NavTab[] = [
  {
    id: 'chats',
    label: 'Chats',
    icon: MessageCircle,
    path: '/chat',
    badge: 3
  },
  {
    id: 'friends',
    label: 'Friends',
    icon: Users,
    path: '/friends'
  },
  {
    id: 'groups',
    label: 'Groups',
    icon: UserPlus,
    path: '/groups'
  },
  {
    id: 'profile',
    label: 'Me',
    icon: Settings,
    path: '/profile'
  }
];

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-cyberdark-900/95 backdrop-blur-md border-t border-cyberdark-700">
      {/* Safe area for iPhone home indicator */}
      <div className="pb-safe">
        <div className="flex items-center justify-around px-4 py-2">
          {tabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.path);
            const Icon = tab.icon;
            
            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={cn(
                  "flex flex-col items-center justify-center relative",
                  "min-h-[56px] min-w-[56px] px-2 py-1",
                  "transition-all duration-200 ease-out",
                  "active:scale-95",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cybergold-500",
                  isActive 
                    ? "text-cybergold-400" 
                    : "text-cyberdark-300 hover:text-cyberdark-100"
                )}
              >
                <div className="relative">
                  <Icon 
                    size={24} 
                    className={cn(
                      "transition-all duration-200",
                      isActive && "scale-110"
                    )} 
                  />
                  {tab.badge && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium">
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </div>
                  )}
                </div>
                <span className={cn(
                  "text-xs font-medium mt-1 transition-all duration-200",
                  isActive ? "opacity-100" : "opacity-70"
                )}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
