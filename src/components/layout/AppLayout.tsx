/**
 * App Layout
 * 
 * Main application layout with navigation and consistent structure
 */

import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Toaster } from '../ui/toaster';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../theme/ThemeToggle';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import {
  MessageSquare,
  Settings,
  User,
  Shield,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const AppLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  
  const navItems = [
    { label: 'Chat', href: '/secure-chat', icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { label: 'Innstillinger', href: '/settings', icon: <Settings className="h-4 w-4 mr-2" /> }
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-cyberdark-950">
      {/* Header */}
      <header className="border-b border-cyberdark-800 bg-cyberdark-900">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & brand */}
          <div className="flex items-center">
            <div className="hidden md:block">
              <img src="/snakkaz-logo.svg" alt="SnakkaZ Logo" className="h-8 w-auto" />
            </div>
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden mr-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-cybergold-400" />
              ) : (
                <Menu className="h-5 w-5 text-cybergold-400" />
              )}
            </Button>
            
            <h1 className="text-xl font-bold text-cybergold-400">
              SnakkaZ
            </h1>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4 mr-4">
            {navItems.map(item => (
              <Button
                key={item.href}
                variant={location.pathname.startsWith(item.href) ? 'default' : 'ghost'}
                className={cn(
                  location.pathname.startsWith(item.href) 
                    ? 'bg-cybergold-900/30 text-cybergold-300' 
                    : 'text-cybergold-500'
                )}
                onClick={() => navigate(item.href)}
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
          </nav>
          
          {/* User menu */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.username} />
                    <AvatarFallback className="bg-cybergold-900/50 text-cybergold-400">
                      {user?.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-cyberdark-900 border-cyberdark-800">
                <div className="px-2 py-2 text-sm text-cybergold-100">
                  <div className="font-medium">{user?.user_metadata?.username || 'Bruker'}</div>
                  <div className="text-xs text-cybergold-500 truncate">{user?.email}</div>
                </div>
                <DropdownMenuSeparator className="bg-cyberdark-800" />
                <DropdownMenuItem 
                  className="cursor-pointer flex items-center"
                  onClick={() => navigate('/profile')}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer flex items-center"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Innstillinger
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer flex items-center"
                  onClick={() => navigate('/security')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Sikkerhet
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-cyberdark-800" />
                <DropdownMenuItem 
                  className="cursor-pointer flex items-center text-red-500"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logg ut
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute inset-x-0 top-16 z-20 bg-cyberdark-900 border-b border-cyberdark-800 py-2">
          <nav className="container mx-auto px-4 flex flex-col space-y-1">
            {navItems.map(item => (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "justify-start w-full",
                  location.pathname.startsWith(item.href) 
                    ? 'bg-cybergold-900/20 text-cybergold-300' 
                    : 'text-cybergold-500'
                )}
                onClick={() => {
                  navigate(item.href);
                  setIsMobileMenuOpen(false);
                }}
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      )}
      
      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default AppLayout;
