import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, User, Settings, Crown, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const FreeUserNavigation: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      path: '/basic-chat',
      label: 'Chat',
      icon: MessageCircle,
      description: 'Gratis chat for alle'
    },
    {
      path: '/profile',
      label: 'Profil',
      icon: User,
      description: 'Din profil'
    },
    {
      path: '/settings',
      label: 'Innstillinger',
      icon: Settings,
      description: 'Appinnstillinger'
    }
  ];

  return (
    <div className="bg-cyberdark-900 border-r border-cyberdark-700 w-64 h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-cyberdark-700">
        <h1 className="text-xl font-bold text-cyberprimary-100 mb-1">Snakkaz</h1>
        <p className="text-sm text-cyberdark-300">Gratis Bruker</p>
        {user && (
          <p className="text-xs text-cyberdark-400 mt-1">
            {user.email?.split('@')[0]}
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 h-auto p-3 ${
                  isActive 
                    ? 'bg-cyberprimary-600 hover:bg-cyberprimary-700 text-white' 
                    : 'text-cyberdark-200 hover:text-cyberprimary-200 hover:bg-cyberdark-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Premium Upgrade */}
      <div className="p-4 border-t border-cyberdark-700">
        <Card className="bg-gradient-to-r from-cyberprimary-900/20 to-cybersecondary-900/20 border-cyberprimary-500/30">
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-cyberprimary-400" />
              <span className="text-sm font-medium text-cyberprimary-200">Premium</span>
            </div>
            <p className="text-xs text-cyberdark-300 mb-3">
              Få tilgang til krypterte meldinger, avanserte BTC-analyser og mer!
            </p>
            <Link to="/subscription">
              <Button 
                size="sm" 
                className="w-full bg-cyberprimary-600 hover:bg-cyberprimary-700 text-white"
              >
                Oppgrader
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-cyberdark-700">
        <Button
          onClick={() => signOut()}
          variant="ghost"
          className="w-full justify-start gap-2 text-cyberdark-300 hover:text-cyberdark-100 hover:bg-cyberdark-800"
        >
          <LogOut className="h-4 w-4" />
          Logg ut
        </Button>
      </div>
    </div>
  );
};

export default FreeUserNavigation;
