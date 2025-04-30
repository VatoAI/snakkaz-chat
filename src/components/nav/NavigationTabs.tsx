import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Users, Settings } from 'lucide-react';

const NavigationTabs = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isActive = (path: string) => {
    // For chats, match both root path and anything under /chat
    if (path === '/chats' && (currentPath === '/' || currentPath.startsWith('/chat'))) {
      return true;
    }
    return currentPath.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around items-center h-16 px-2 z-40 md:relative md:border-t-0 md:border-r md:h-full md:w-20 md:flex-col md:justify-start md:py-8 md:gap-8">
      <Link 
        to="/chats" 
        className={`flex flex-col items-center justify-center p-2 rounded-md transition-colors ${
          isActive('/chats') 
            ? 'text-cybergold-400 bg-cybergold-950/30' 
            : 'text-muted-foreground hover:text-cybergold-300 hover:bg-background/80'
        }`}
      >
        <MessageSquare size={24} />
        <span className="text-xs mt-1">Chats</span>
      </Link>
      
      <Link 
        to="/contacts" 
        className={`flex flex-col items-center justify-center p-2 rounded-md transition-colors ${
          isActive('/contacts') 
            ? 'text-cybergold-400 bg-cybergold-950/30' 
            : 'text-muted-foreground hover:text-cybergold-300 hover:bg-background/80'
        }`}
      >
        <Users size={24} />
        <span className="text-xs mt-1">Kontakter</span>
      </Link>
      
      <Link 
        to="/settings" 
        className={`flex flex-col items-center justify-center p-2 rounded-md transition-colors ${
          isActive('/settings') 
            ? 'text-cybergold-400 bg-cybergold-950/30' 
            : 'text-muted-foreground hover:text-cybergold-300 hover:bg-background/80'
        }`}
      >
        <Settings size={24} />
        <span className="text-xs mt-1">Innstillinger</span>
      </Link>
    </div>
  );
};

export default NavigationTabs;