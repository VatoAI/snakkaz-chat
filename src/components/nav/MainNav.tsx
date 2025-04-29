import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MessageSquare, Info, Download, User, Home, Bot, Users, ShieldCheck } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsAdmin } from '@/hooks/useIsAdmin';

export const MainNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const isAdmin = useIsAdmin();

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

      {user && (
        <Button
          variant={isActive('/ai-chat') ? "default" : "ghost"}
          size="sm"
          className={`${isActive('/ai-chat')
            ? "bg-cybergold-600/20 text-cybergold-400"
            : "text-cybergold-400 hover:text-cybergold-300"}`}
          onClick={() => navigate('/ai-chat')}
        >
          <Bot className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">AI-Chat</span>
        </Button>
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

      {isAdmin && (
        <Button
          variant={isActive('/admin') ? "default" : "ghost"}
          size="sm"
          className={`${isActive('/admin')
            ? "bg-cybergold-600/20 text-cybergold-400"
            : "text-cybergold-400 hover:text-cybergold-300"}`}
          onClick={() => navigate('/admin')}
        >
          <ShieldCheck className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Admin</span>
        </Button>
      )}
    </nav>
  );
};
