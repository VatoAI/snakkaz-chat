import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import {
  MessageSquare,
  Info,
  User,
  Home,
  Bot,
  Users,
  ShieldCheck,
  Settings,
  UserPlus,
  MessageCircle
} from 'lucide-react';

type NavigationVariant = 'horizontal' | 'vertical' | 'bottom';

/**
 * NavItem type represents a navigation route
 */
interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  authRequired?: boolean;
  adminRequired?: boolean;
  hideOnMobile?: boolean;
}

interface AppNavigationProps {
  variant?: NavigationVariant;
  className?: string;
  activeIndicator?: boolean;
  compact?: boolean;
  showLabels?: boolean;
  onItemSelect?: () => void;
}

export const AppNavigation: React.FC<AppNavigationProps> = ({
  variant = 'horizontal',
  className,
  activeIndicator = true,
  compact = false,
  showLabels = true,
  onItemSelect
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const isAdmin = useIsAdmin();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const activeIndicatorRef = useRef<HTMLDivElement | null>(null);
  
  // Define all navigation items
  const navItems: NavItem[] = [
    {
      path: '/',
      label: 'Hjem',
      icon: <Home className="h-5 w-5" />
    },
    {
      path: '/chat',
      label: 'Chat',
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      path: '/ai-chat',
      label: 'AI-Chat',
      icon: <Bot className="h-5 w-5" />,
      authRequired: true
    },
    {
      path: '/group-chat',
      label: 'Grupper',
      icon: <Users className="h-5 w-5" />,
      authRequired: true
    },
    {
      path: '/create-group',
      label: 'Opprett Gruppe',
      icon: <UserPlus className="h-5 w-5" />,
      authRequired: true,
      hideOnMobile: true
    },
    {
      path: '/messages',
      label: 'Meldinger',
      icon: <MessageCircle className="h-5 w-5" />
    },
    {
      path: '/contacts',
      label: 'Kontakter',
      icon: <Users className="h-5 w-5" />
    },
    {
      path: '/info',
      label: 'Info',
      icon: <Info className="h-5 w-5" />
    },
    {
      path: '/profile',
      label: 'Profil',
      icon: <User className="h-5 w-5" />,
      authRequired: true
    },
    {
      path: '/settings',
      label: 'Innstillinger',
      icon: <Settings className="h-5 w-5" />,
      authRequired: true
    },
    {
      path: '/admin',
      label: 'Admin',
      icon: <ShieldCheck className="h-5 w-5" />,
      adminRequired: true
    }
  ];

  // Filter navigation items based on auth state and screen size
  const filteredNavItems = navItems.filter(item => {
    if (item.authRequired && !user) return false;
    if (item.adminRequired && !isAdmin) return false;
    if (item.hideOnMobile && isMobile) return false;
    return true;
  });

  // Check if a route is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    } 
    // For chats, match both root path and anything under /chat
    else if (path === '/chat' && (location.pathname === '/' || location.pathname.startsWith('/chat'))) {
      return true;
    }
    // For messages, match both /messages and anything under it
    else if (path === '/messages' && location.pathname.startsWith('/messages')) {
      return true;
    }
    // For other paths, check if the current path starts with the nav item path
    else {
      return location.pathname.startsWith(path);
    }
  };
  
  // Update active indicator position when route changes
  useEffect(() => {
    if (activeIndicator) {
      updateActiveIndicator();
    }
  }, [location.pathname, activeIndicator]);
  
  // Function to update the position of the active indicator
  const updateActiveIndicator = () => {
    if (!navRef.current || !activeIndicatorRef.current) return;
    
    const activeButton = navRef.current.querySelector('.nav-active');
    
    if (activeButton) {
      const rect = activeButton.getBoundingClientRect();
      const navRect = navRef.current.getBoundingClientRect();
      
      if (variant === 'horizontal') {
        activeIndicatorRef.current.style.width = `${rect.width}px`;
        activeIndicatorRef.current.style.height = '2px';
        activeIndicatorRef.current.style.left = `${rect.left - navRect.left}px`;
        activeIndicatorRef.current.style.top = 'auto';
        activeIndicatorRef.current.style.bottom = '0';
      } else if (variant === 'vertical') {
        activeIndicatorRef.current.style.width = '2px';
        activeIndicatorRef.current.style.height = `${rect.height}px`;
        activeIndicatorRef.current.style.left = '0';
        activeIndicatorRef.current.style.top = `${rect.top - navRect.top}px`;
      } else {
        // Bottom nav, so indicator is on top
        activeIndicatorRef.current.style.width = `${rect.width}px`;
        activeIndicatorRef.current.style.height = '2px';
        activeIndicatorRef.current.style.left = `${rect.left - navRect.left}px`;
        activeIndicatorRef.current.style.top = '0';
        activeIndicatorRef.current.style.bottom = 'auto';
      }
      
      activeIndicatorRef.current.style.opacity = '1';
    } else {
      activeIndicatorRef.current.style.opacity = '0';
    }
  };

  // Handle hover events for visual feedback
  const handleNavItemHover = (path: string) => {
    setHoveredItem(path);
  };

  const handleNavItemLeave = () => {
    setHoveredItem(null);
  };

  // Handle navigation item click
  const handleItemClick = (path: string) => {
    navigate(path);
    if (onItemSelect) {
      onItemSelect();
    }
  };

  // Determine container classes based on variant
  const containerClasses = cn(
    "relative",
    variant === 'horizontal' && "flex items-center gap-1 p-0.5",
    variant === 'vertical' && "flex flex-col gap-2 p-0.5",
    variant === 'bottom' && "fixed bottom-0 left-0 right-0 bg-cyberdark-900 border-t border-cyberdark-700 p-2 flex items-center justify-around",
    className
  );

  return (
    <nav
      ref={navRef}
      className={containerClasses}
      aria-label="Main Navigation"
    >
      {filteredNavItems.map((item) => (
        <NavButton
          key={item.path}
          path={item.path}
          icon={item.icon}
          label={item.label}
          isActive={isActive(item.path)}
          onHover={handleNavItemHover}
          onLeave={handleNavItemLeave}
          isHovered={hoveredItem === item.path}
          onClick={() => handleItemClick(item.path)}
          adminButton={item.adminRequired}
          variant={variant}
          compact={compact}
          showLabel={showLabels}
        />
      ))}
      
      {/* Active indicator */}
      {activeIndicator && (
        <div
          ref={activeIndicatorRef}
          className="absolute bg-gradient-to-r from-cybergold-400 to-cybergold-500 rounded-full transition-all duration-300 ease-in-out shadow-[0_0_5px_rgba(218,188,69,0.5)]"
        />
      )}
    </nav>
  );
};

interface NavButtonProps {
  path: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onHover: (path: string) => void;
  onLeave: () => void;
  isHovered: boolean;
  onClick: () => void;
  adminButton?: boolean;
  variant: NavigationVariant;
  compact?: boolean;
  showLabel?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({
  path,
  icon,
  label,
  isActive,
  onHover,
  onLeave,
  isHovered,
  onClick,
  adminButton = false,
  variant,
  compact = false,
  showLabel = true
}) => {
  // Determine button classes based on variant and state
  const buttonClasses = cn(
    "group transition-all duration-200 relative flex items-center",
    isActive ? "nav-active" : "",
    
    // Horizontal variant styling
    variant === 'horizontal' && "px-3 py-2 rounded-md gap-2",
    variant === 'horizontal' && isActive && "bg-gradient-to-b from-cyberdark-800 to-cyberdark-850",
    variant === 'horizontal' && !isActive && "hover:bg-cyberdark-800/40",
    
    // Vertical variant styling
    variant === 'vertical' && "px-3 py-2 rounded-md w-full gap-3 justify-start",
    variant === 'vertical' && isActive && "bg-gradient-to-r from-cyberdark-800 to-cyberdark-850",
    variant === 'vertical' && !isActive && "hover:bg-cyberdark-800/40",
    
    // Bottom variant styling
    variant === 'bottom' && "flex-col items-center p-2 gap-1",
    
    // Compact mode
    compact && "p-1.5",
    
    // Text colors
    isActive 
      ? (adminButton ? "text-emerald-400" : "text-cybergold-400") 
      : (adminButton ? "text-emerald-600 hover:text-emerald-400" : "text-cybergold-600 hover:text-cybergold-400"),
  );
  
  const iconClasses = cn(
    "transition-transform",
    variant !== 'bottom' && "group-hover:scale-110",
    compact ? "h-4 w-4" : "h-5 w-5",
    isActive 
      ? (adminButton ? "text-emerald-400" : "text-cybergold-400") 
      : (adminButton ? "text-emerald-600" : "text-cybergold-600")
  );
  
  const labelClasses = cn(
    "font-medium transition-all",
    compact ? "text-xs" : "text-sm",
    isActive 
      ? (adminButton ? "text-emerald-400" : "text-cybergold-400") 
      : (adminButton ? "text-emerald-600" : "text-cybergold-600"),
    variant === 'bottom' ? "text-xs mt-1" : "",
    variant === 'horizontal' && !showLabel && "hidden",
    variant === 'horizontal' && showLabel && "hidden sm:block"
  );
  
  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      onMouseEnter={() => onHover(path)}
      onMouseLeave={onLeave}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className={iconClasses}>
        {icon}
      </div>
      
      {showLabel && (
        <span className={labelClasses}>
          {label}
        </span>
      )}
      
      {/* Active indicator dot (small visual enhancement) */}
      {isActive && variant !== 'bottom' && (
        <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-cybergold-400 shadow-[0_0_5px_rgba(218,188,69,0.8)]" />
      )}
      
      {/* Hover glow effect */}
      <div className={cn(
        "absolute inset-0 rounded-md opacity-0 transition-opacity duration-300",
        isHovered && !isActive ? "opacity-10" : "",
        adminButton ? "bg-emerald-500" : "bg-cybergold-400"
      )} />
    </button>
  );
};

export default AppNavigation;