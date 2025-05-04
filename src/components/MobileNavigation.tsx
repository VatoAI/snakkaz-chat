import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Settings, User } from 'lucide-react';

export const MobileNavigation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cyberdark-900 border-t border-cyberdark-700 p-2 flex items-center justify-around">
      <button 
        onClick={() => navigate('/chat')}
        className="flex flex-col items-center p-2 text-cybergold-300 hover:text-cybergold-200"
      >
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1">Hjem</span>
      </button>

      <button 
        onClick={() => navigate('/group-chat')}
        className="flex flex-col items-center p-2 text-cybergold-300 hover:text-cybergold-200"
      >
        <Users className="h-5 w-5" />
        <span className="text-xs mt-1">Grupper</span>
      </button>

      <button 
        onClick={() => navigate('/profile')}
        className="flex flex-col items-center p-2 text-cybergold-300 hover:text-cybergold-200"
      >
        <User className="h-5 w-5" />
        <span className="text-xs mt-1">Profil</span>
      </button>

      <button 
        onClick={() => navigate('/settings')}
        className="flex flex-col items-center p-2 text-cybergold-300 hover:text-cybergold-200"
      >
        <Settings className="h-5 w-5" />
        <span className="text-xs mt-1">Innstillinger</span>
      </button>
    </nav>
  );
};