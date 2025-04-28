import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, Info, Download, User } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

export const MainNav = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <nav className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="text-cybergold-400 hover:text-cybergold-300"
        onClick={() => navigate('/')}
      >
        <Home className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Hjem</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="text-cybergold-400 hover:text-cybergold-300"
        onClick={() => navigate('/info')}
      >
        <Info className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Info</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="bg-cybergold-500/10 border-cybergold-500/30 text-cybergold-400 hover:text-cybergold-300"
        onClick={() => window.open('/download', '_blank')}
      >
        <Download className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Last ned appen</span>
      </Button>

      {user && (
        <Button
          variant="ghost"
          size="sm"
          className="text-cybergold-400 hover:text-cybergold-300 ml-auto"
          onClick={() => navigate('/profile')}
        >
          <User className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Profil</span>
        </Button>
      )}
    </nav>
  );
};
