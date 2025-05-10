import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MessageSquare, Info, Download, User, Home, Bot, Users, ShieldCheck, UserPlus } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export const MainNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const isAdmin = useIsAdmin();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const activeIndicatorRef = useRef<HTMLDivElement>(null);
  
  // Funksjon for å sjekke om en rute er aktiv
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    } else {
      return location.pathname.includes(path);
    }
  };
  
  // Oppdater aktiv indikator når ruten endres
  useEffect(() => {
    updateActiveIndicator();
  }, [location.pathname]);
  
  // Funksjon for å oppdatere posisjonen til den aktive indikatoren
  const updateActiveIndicator = () => {
    if (!navRef.current || !activeIndicatorRef.current) return;
    
    const activeButton = navRef.current.querySelector('.nav-active');
    
    if (activeButton) {
      const rect = activeButton.getBoundingClientRect();
      const navRect = navRef.current.getBoundingClientRect();
      
      activeIndicatorRef.current.style.width = `${rect.width}px`;
      activeIndicatorRef.current.style.left = `${rect.left - navRect.left}px`;
      activeIndicatorRef.current.style.opacity = '1';
    } else {
      activeIndicatorRef.current.style.opacity = '0';
    }
  };

  const handleNavItemHover = (path: string) => {
    setHoveredItem(path);
  };

  const handleNavItemLeave = () => {
    setHoveredItem(null);
  };

  return (
    <div className="relative">
      <nav ref={navRef} className="flex items-center gap-3 p-0.5">
        <NavButton 
          path="/"
          icon={<Home className="w-4 h-4 transition-transform group-hover:scale-110" />}
          label="Hjem"
          isActive={isActive('/')}
          onHover={handleNavItemHover}
          onLeave={handleNavItemLeave}
          isHovered={hoveredItem === '/'}
          onClick={() => navigate('/')}
        />
        
        <NavButton 
          path="/chat"
          icon={<MessageSquare className="w-4 h-4 transition-transform group-hover:scale-110" />}
          label="Chat"
          isActive={isActive('/chat')}
          onHover={handleNavItemHover}
          onLeave={handleNavItemLeave}
          isHovered={hoveredItem === '/chat'}
          onClick={() => navigate('/chat')}
        />

        {user && (
          <NavButton 
            path="/ai-chat"
            icon={<Bot className="w-4 h-4 transition-transform group-hover:scale-110" />}
            label="AI-Chat"
            isActive={isActive('/ai-chat')}
            onHover={handleNavItemHover}
            onLeave={handleNavItemLeave}
            isHovered={hoveredItem === '/ai-chat'}
            onClick={() => navigate('/ai-chat')}
          />
        )}

      {user && (
        <Button
          variant={location.pathname.includes('/group-chat') ? "default" : "ghost"}
          size="sm"
          className={`${location.pathname.includes('/group-chat')
            ? "bg-cybergold-600/20 text-cybergold-400"
            : "text-cybergold-400 hover:text-cybergold-300"}`}
          onClick={() => navigate('/group-chat')}
        >
          <Users className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Grupper</span>
        </Button>
      )}

      {user && (
        <Button
          variant={isActive('/create-group') ? "default" : "ghost"}
          size="sm"
          className={`${isActive('/create-group')
            ? "bg-cybergold-600/20 text-cybergold-400"
            : "text-cybergold-400 hover:text-cybergold-300"}`}
          onClick={() => navigate('/create-group')}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Opprett gruppe</span>
        </Button>
      )}

      <Button
        variant={isActive('/info') ? "default" : "ghost"}
        size="sm"
        className={`${isActive('/info')
          ? "bg-cybergold-600/20 text-cybergold-400"
          : "text-cybergold-400 hover:text-cybergold-300"}`}
        onClick={() => navigate('/info')}
      >
        <Info className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Info</span>
      </Button>
        {user && (
          <NavButton 
            path="/group-chat"
            icon={<Users className="w-4 h-4 transition-transform group-hover:scale-110" />}
            label="Grupper"
            isActive={isActive('/group-chat')}
            onHover={handleNavItemHover}
            onLeave={handleNavItemLeave}
            isHovered={hoveredItem === '/group-chat'}
            onClick={() => navigate('/group-chat')}
          />
        )}

        <NavButton 
          path="/info"
          icon={<Info className="w-4 h-4 transition-transform group-hover:scale-110" />}
          label="Info"
          isActive={isActive('/info')}
          onHover={handleNavItemHover}
          onLeave={handleNavItemLeave}
          isHovered={hoveredItem === '/info'}
          onClick={() => navigate('/info')}
        />

        {user && (
          <NavButton 
            path="/profile"
            icon={<User className="w-4 h-4 transition-transform group-hover:scale-110" />}
            label="Profil"
            isActive={isActive('/profile')}
            onHover={handleNavItemHover}
            onLeave={handleNavItemLeave}
            isHovered={hoveredItem === '/profile'}
            onClick={() => navigate('/profile')}
          />
        )}

        {isAdmin && (
          <NavButton 
            path="/admin"
            icon={<ShieldCheck className="w-4 h-4 transition-transform group-hover:scale-110" />}
            label="Admin"
            isActive={isActive('/admin')}
            onHover={handleNavItemHover}
            onLeave={handleNavItemLeave}
            isHovered={hoveredItem === '/admin'}
            onClick={() => navigate('/admin')}
            adminButton={true}
          />
        )}
        
        {/* Animert underlinjeindikator */}
        <div
          ref={activeIndicatorRef}
          className="absolute bottom-0 h-0.5 bg-gradient-to-r from-cybergold-400 to-cybergold-500 rounded-full transition-all duration-300 ease-in-out shadow-[0_0_5px_rgba(218,188,69,0.5)]"
        />
      </nav>
    </div>
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
}) => {
  const isMobile = useIsMobile();
  
  return (
    <button
      className={cn(
        "group px-3 py-2 rounded-md transition-all duration-200 relative flex items-center gap-2",
        isActive ? "nav-active" : "",
        isActive 
          ? "bg-gradient-to-b from-cyberdark-800 to-cyberdark-850 text-cybergold-400" 
          : "text-cybergold-600 hover:text-cybergold-400",
        isHovered && !isActive && "bg-cyberdark-800/40",
        adminButton && "text-emerald-400"
      )}
      onClick={onClick}
      onMouseEnter={() => onHover(path)}
      onMouseLeave={onLeave}
    >
      <div className={cn(
        "transition-all", 
        isActive ? "text-cybergold-400" : "text-cybergold-600",
        adminButton && isActive ? "text-emerald-400" : "",
        adminButton && !isActive ? "text-emerald-600" : ""
      )}>
        {icon}
      </div>
      
      <span className={cn(
        "hidden sm:block font-medium text-sm transition-all",
        isActive ? "text-cybergold-400" : "text-cybergold-600",
        adminButton && isActive ? "text-emerald-400" : "",
        adminButton && !isActive ? "text-emerald-600" : ""
      )}>
        {label}
      </span>
      
      {/* Aktiv indikator prikk */}
      {isActive && (
        <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-cybergold-400 shadow-[0_0_5px_rgba(218,188,69,0.8)]" />
      )}
      
      {/* Hover glow effekt */}
      <div className={cn(
        "absolute inset-0 rounded-md opacity-0 transition-opacity duration-300",
        isHovered && !isActive ? "opacity-10 bg-cybergold-400" : "",
        adminButton && isHovered && !isActive ? "opacity-10 bg-emerald-500" : "",
      )} />
    </button>
  );
};
