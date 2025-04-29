
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MessageSquare, Info, Download, User, Home } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

export const MainNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Funksjon for å sjekke om en rute er aktiv
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex items-center gap-2">
      <Button
        variant={isActive('/') ? "default" : "ghost"}
        size="sm"
        className={`${isActive('/')
          ? "bg-cybergold-600/20 text-cybergold-400"
          : "text-cybergold-400 hover:text-cybergold-300"}`}
        onClick={() => navigate('/')}
      >
        <Home className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Hjem</span>
      </Button>
      
      <Button
        variant={isActive('/chat') ? "default" : "ghost"}
        size="sm"
        className={`${isActive('/chat')
          ? "bg-cybergold-600/20 text-cybergold-400"
          : "text-cybergold-400 hover:text-cybergold-300"}`}
        onClick={() => navigate('/chat')}
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Chat</span>
      </Button>

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
        <Button
          variant={isActive('/profile') ? "default" : "ghost"}
          size="sm"
          className={`${isActive('/profile')
            ? "bg-cybergold-600/20 text-cybergold-400"
            : "text-cybergold-400 hover:text-cybergold-300"}`}
          onClick={() => navigate('/profile')}
        >
          <User className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Profil</span>
        </Button>
      )}
    </nav>
  );
};
