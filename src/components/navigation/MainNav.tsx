import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Users,
  Bell,
  Settings,
  User,
  LogOut
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MainNav: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logget ut",
        description: "Du har blitt logget ut av Snakkaz Chat.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Feil ved utlogging",
        description: "Kunne ikke logge ut. Vennligst prøv igjen.",
      });
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      label: "Chat",
      path: "/chat",
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      label: "Grupper",
      path: "/groups",
      icon: <Users className="h-5 w-5" />
    },
    {
      label: "Varsler",
      path: "/notifications",
      icon: <Bell className="h-5 w-5" />
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full bg-cyberdark-900 border-t border-cyberdark-700 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo (synlig bare på større skjermer) */}
        <div className="hidden md:flex items-center gap-2">
          <img 
            src="/logos/snakkaz-gold.svg" 
            alt="Snakkaz" 
            className="h-8 w-auto"
            onError={(e) => {
              // Fallback til PNG hvis SVG ikke lastes
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/logos/snakkaz-gold.png";
            }}
          />
          <span className="font-bold text-lg text-cybergold-400">Snakkaz</span>
        </div>

        {/* Navigasjon */}
        <nav className="flex items-center justify-around md:justify-center space-x-1 md:space-x-2 w-full md:w-auto">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive(item.path) ? "default" : "ghost"}
                size="sm"
                className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-2 h-auto text-xs md:text-sm ${
                  isActive(item.path) 
                  ? "bg-cybergold-600/20 text-cybergold-400" 
                  : "text-cybergold-500 hover:text-cybergold-400"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        {/* Bruker og innstillinger */}
        <div className="hidden md:flex items-center gap-2">
          <Link to="/settings">
            <Button
              variant={isActive('/settings') ? "default" : "ghost"}
              size="sm"
              className={`px-3 md:px-4 text-sm ${isActive('/settings') ? "bg-cybergold-600/20 text-cybergold-400" : "text-cybergold-500"}`}
            >
              <Settings className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline">Innstillinger</span>
            </Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full p-0 w-10 h-10">
                <Avatar className="h-9 w-9 border border-cyberdark-700">
                  <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                  <AvatarFallback className="bg-cybergold-700 text-black">
                    {user?.email?.substring(0, 2).toUpperCase() || 'SN'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-cyberdark-800 border-cyberdark-700 text-cybergold-300" align="end">
              <DropdownMenuLabel className="text-cybergold-500">Min konto</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-cyberdark-700" />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center cursor-pointer">
                  <User className="h-4 w-4 mr-2 text-cybergold-500" />
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center cursor-pointer">
                  <Settings className="h-4 w-4 mr-2 text-cybergold-500" />
                  Innstillinger
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-cyberdark-700" />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-400 cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Logg ut
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Mobil bruker-knapp (synlig bare på små skjermer) */}
        <div className="flex md:hidden">
          <Link to="/profile">
            <Button
              variant={isActive('/profile') ? "default" : "ghost"}
              size="sm"
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 h-auto text-xs ${
                isActive('/profile') 
                ? "bg-cybergold-600/20 text-cybergold-400" 
                : "text-cybergold-500"
              }`}
            >
              <User className="h-5 w-5" />
              <span>Profil</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainNav;