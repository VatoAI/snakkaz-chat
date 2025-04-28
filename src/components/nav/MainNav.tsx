import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MessageSquare, Info, Download, User } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

export const MainNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Funksjon for å sjekke om en rute er aktiv
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex items-center gap-2">
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

      <Button
        variant="outline"
        size="sm"
        className="bg-cybergold-500/10 border-cybergold-500/30 text-cybergold-400 hover:text-cybergold-300"
        onClick={() => navigate('/download')}
      >
        <Download className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Last ned appen</span>
      </Button>

      {user && (
        <Button
          variant={isActive('/profile') ? "default" : "ghost"}
          size="sm"
          className={`${isActive('/profile')
            ? "bg-cybergold-600/20 text-cybergold-400 ml-auto"
            : "text-cybergold-400 hover:text-cybergold-300 ml-auto"}`}
          onClick={() => navigate('/profile')}
        >
          <User className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Profil</span>
        </Button>
      )}
    </nav>
  );
};
