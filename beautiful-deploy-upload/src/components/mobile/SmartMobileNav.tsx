import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { 
  BarChart3,
  MessageCircle, 
  Users,
  UserPlus,
  Bot,
  Mail,
  Settings,
  User,
  Shield,
  Info,
  Search,
  Plus,
  Menu,
  X
} from 'lucide-react';

interface NavSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  items: NavItem[];
  adminOnly?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
  badge?: number;
  description: string;
  adminOnly?: boolean;
}

// Smart navigation structure inspired by Claude's suggestions
const navigationSections: NavSection[] = [
  {
    id: 'main',
    title: 'Hovedmeny',
    icon: BarChart3,
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: BarChart3,
        path: '/dashboard',
        description: 'Oversikt med stats og aktivitet'
      }
    ]
  },
  {
    id: 'chat-hub',
    title: 'Chat Hub',
    icon: MessageCircle,
    items: [
      {
        id: 'chat',
        label: 'Chat',
        icon: MessageCircle,
        path: '/chat-new',
        badge: 3,
        description: 'Private meldinger med brukere'
      },
      {
        id: 'groups',
        label: 'Grupper',
        icon: Users,
        path: '/groups',
        badge: 1,
        description: 'Gruppe-chats og team samtaler'
      }
    ]
  },
  {
    id: 'social',
    title: 'Sosialt',
    icon: Users,
    items: [
      {
        id: 'friends',
        label: 'Venner',
        icon: Users,
        path: '/friends',
        description: 'Venneliste og kontakter'
      },
      {
        id: 'find-friends',
        label: 'Finn Venner',
        icon: UserPlus,
        path: '/find-friends',
        description: 'Finn nye venner og kontakter'
      }
    ]
  },
  {
    id: 'services',
    title: 'Tjenester',
    icon: Bot,
    items: [
      {
        id: 'ai-assistant',
        label: 'AI Assistent',
        icon: Bot,
        path: '/ai-assistant',
        description: 'Kundeservice chatbot'
      },
      {
        id: 'mail',
        label: 'Mail',
        icon: Mail,
        path: '/mail',
        badge: 2,
        description: 'E-post system'
      }
    ]
  },
  {
    id: 'settings',
    title: 'Innstillinger',
    icon: Settings,
    items: [
      {
        id: 'profile',
        label: 'Profil',
        icon: User,
        path: '/profile-new',
        description: 'Din brukerprofil'
      },
      {
        id: 'app-settings',
        label: 'Innstillinger',
        icon: Settings,
        path: '/settings',
        description: 'App-innstillinger'
      },
      {
        id: 'info',
        label: 'Info',
        icon: Info,
        path: '/info',
        description: 'Generell informasjon'
      }
    ]
  },
  {
    id: 'admin',
    title: 'Admin',
    icon: Shield,
    adminOnly: true,
    items: [
      {
        id: 'admin-panel',
        label: 'Admin Panel',
        icon: Shield,
        path: '/admin',
        description: 'Administrative kontroller',
        adminOnly: true
      },
      {
        id: 'memory-mcp',
        label: 'Memory (MCP)',
        icon: BarChart3,
        path: '/admin/memory',
        description: 'Memory management system',
        adminOnly: true
      }
    ]
  }
];

// Mobile bottom nav shows most important items
const mobileBottomTabs = [
  { id: 'dashboard', label: 'Home', icon: BarChart3, path: '/dashboard' },
  { id: 'chat', label: 'Chat', icon: MessageCircle, path: '/chat-new', badge: 3 },
  { id: 'friends', label: 'Venner', icon: Users, path: '/friends' },
  { id: 'menu', label: 'Meny', icon: Menu, path: '/menu' }
];

interface Props {
  isAdmin?: boolean;
  userRole?: 'admin' | 'user';
}

export const SmartMobileNav: React.FC<Props> = ({ 
  isAdmin = false, 
  userRole = 'user' 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showFullMenu, setShowFullMenu] = useState(false);

  // Filter sections based on admin status
  const visibleSections = navigationSections.filter(section => 
    !section.adminOnly || isAdmin
  );

  const renderBottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-cyberdark-900/98 backdrop-blur-xl border-t border-cyberdark-700/50 shadow-2xl">
      <div className="flex items-center justify-around px-2 py-1">
        {mobileBottomTabs.map((tab) => {
          const isActive = tab.id === 'menu' 
            ? showFullMenu 
            : location.pathname.startsWith(tab.path);
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'menu') {
                  setShowFullMenu(!showFullMenu);
                } else {
                  navigate(tab.path);
                }
              }}
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
            </button>
          );
        })}
      </div>
      <div className="pb-safe h-1" />
    </nav>
  );

  const renderFullMenu = () => (
    <div className={cn(
      "fixed inset-0 z-60 bg-cyberdark-950/95 backdrop-blur-xl transition-all duration-300",
      showFullMenu ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      <div className="min-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-cyberdark-900/95 backdrop-blur-md border-b border-cyberdark-700 px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-cybergold-400">SnakkaZ Meny</h1>
            <button
              onClick={() => setShowFullMenu(false)}
              className="p-2 text-cyberdark-300 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          {isAdmin && (
            <div className="mt-2 text-sm text-cybergold-400 bg-cybergold-500/10 px-3 py-1 rounded-full inline-block">
              👑 Admin Access
            </div>
          )}
        </div>

        {/* Navigation sections */}
        <div className="px-4 py-6 space-y-8 pb-24">
          {visibleSections.map((section) => (
            <div key={section.id} className="space-y-3">
              <div className="flex items-center space-x-2 mb-4">
                <section.icon size={20} className="text-cybergold-400" />
                <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                {section.adminOnly && (
                  <div className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                    ADMIN
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                {section.items
                  .filter(item => !item.adminOnly || isAdmin)
                  .map((item) => {
                    const isActive = location.pathname === item.path;
                    const ItemIcon = item.icon;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigate(item.path);
                          setShowFullMenu(false);
                        }}
                        className={cn(
                          "w-full bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700",
                          "flex items-center space-x-4",
                          "transition-all duration-200",
                          "active:bg-cyberdark-700",
                          isActive && "border-cybergold-500/50 bg-cybergold-500/5"
                        )}
                      >
                        <div className="relative">
                          <ItemIcon 
                            size={24} 
                            className={cn(
                              "transition-colors",
                              isActive ? "text-cybergold-400" : "text-cyberdark-300"
                            )} 
                          />
                          {item.badge && item.badge > 0 && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center font-medium">
                              {item.badge > 99 ? '99+' : item.badge}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 text-left">
                          <h3 className={cn(
                            "font-medium",
                            isActive ? "text-cybergold-400" : "text-white"
                          )}>
                            {item.label}
                          </h3>
                          <p className="text-sm text-cyberdark-400">{item.description}</p>
                        </div>
                        
                        {item.adminOnly && (
                          <div className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                            ADMIN
                          </div>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {renderBottomNav()}
      {renderFullMenu()}
      
      {/* Quick action floating button */}
      {!showFullMenu && (
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
            onClick={() => alert('🚀 Quick actions: Ny chat, Ny gruppe, Søk')}
          >
            <Plus size={24} className="font-bold" />
          </button>
        </div>
      )}
    </>
  );
};
