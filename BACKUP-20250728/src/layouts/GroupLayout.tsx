import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, Bell, Settings } from 'lucide-react';

const GroupLayout: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-cyberdark-950">
      {/* Mobile-friendly header */}
      <header className="sticky top-0 z-10 border-b border-cyberdark-700 bg-cyberdark-900/80 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/chat" className="text-xl font-bold text-cybergold-100">
            SnakkaZ <span className="text-xs bg-cybergold-500 text-black px-1.5 py-0.5 rounded-sm ml-1">Beta</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="text-cybergold-400 hover:text-cybergold-100 hidden sm:flex">
              <Bell className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-cybergold-400 hover:text-cybergold-100 hidden sm:flex">
              <Settings className="h-4 w-4" />
            </Button>
            <Link to="/profile">
              <div className="w-8 h-8 rounded-full bg-cyberdark-800 border border-cybergold-600/30 flex items-center justify-center text-cybergold-100">
                {user?.username?.charAt(0) || '?'}
              </div>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Mobile tab navigation */}
      <div className="md:hidden border-b border-cyberdark-700 bg-cyberdark-900">
        <div className="grid grid-cols-3 gap-1 px-2 py-1.5">
          <Link to="/chat" className="flex flex-col items-center p-1.5 rounded-md text-cybergold-400 hover:bg-cyberdark-800">
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs mt-0.5">Chatter</span>
          </Link>
          <Link to="/groups" className="flex flex-col items-center p-1.5 rounded-md text-cybergold-400 bg-cyberdark-800/50 border border-cybergold-800/30">
            <Users className="h-5 w-5 text-cybergold-100" />
            <span className="text-xs mt-0.5 text-cybergold-100">Grupper</span>
          </Link>
          <Link to="/notifications" className="flex flex-col items-center p-1.5 rounded-md text-cybergold-400 hover:bg-cyberdark-800 relative">
            <Bell className="h-5 w-5" />
            <span className="text-xs mt-0.5">Varsler</span>
            <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px] bg-cybergold-500 text-black">
              3
            </Badge>
          </Link>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1">
        <Outlet />
      </div>
      
      {/* Mobile notification for MCP */}
      <div className="fixed bottom-6 left-0 right-0 mx-auto w-max z-20 animate-bounce">
        <div className="bg-gradient-to-r from-cyberblue-700 to-cyberblue-900 px-4 py-2 rounded-full shadow-lg shadow-cyberblue-900/30 border border-cyberblue-500/30 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cybergreen-400 animate-pulse"></div>
          <span className="text-white text-sm font-medium">MCP er tilkoblet</span>
        </div>
      </div>
    </div>
  );
};

export default GroupLayout;
