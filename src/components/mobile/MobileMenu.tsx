import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  Users, 
  Settings, 
  Shield, 
  LogOut, 
  Home,
  Bot,
  Heart,
  User,
  Globe
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, setIsOpen }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const navigationItems = [
    {
      icon: <Home size={24} />,
      label: 'Hjem',
      action: () => {
        navigate('/');
        setIsOpen(false);
      },
      color: 'text-cybergold-400'
    },
    {
      icon: <MessageCircle size={24} />,
      label: 'Chat',
      action: () => {
        navigate('/basic-chat');
        setIsOpen(false);
      },
      color: 'text-cyberblue-400'
    },
    {
      icon: <Heart size={24} />,
      label: 'Venner',
      action: () => {
        navigate('/friends');
        setIsOpen(false);
      },
      color: 'text-cyberred-400',
      authRequired: true
    },
    {
      icon: <Bot size={24} />,
      label: 'AI Assistent',
      action: () => {
        navigate('/ai-chat');
        setIsOpen(false);
      },
      color: 'text-cyberprimary-400',
      authRequired: true
    },
    {
      icon: <Globe size={24} />,
      label: 'Global Chat',
      action: () => {
        navigate('/global-chat');
        setIsOpen(false);
      },
      color: 'text-cybergreen-400'
    },
    {
      icon: <User size={24} />,
      label: 'Profil',
      action: () => {
        navigate('/profile');
        setIsOpen(false);
      },
      color: 'text-cybergold-400',
      authRequired: true
    }
  ];

  const settingsItems = [
    {
      icon: <Shield size={24} />,
      label: 'Sikkerhet',
      action: () => {
        navigate('/security');
        setIsOpen(false);
      },
      color: 'text-cybergreen-400'
    },
    {
      icon: <Settings size={24} />,
      label: 'Innstillinger',
      action: () => {
        navigate('/settings');
        setIsOpen(false);
      },
      color: 'text-cyberdark-400'
    },
    {
      icon: <LogOut size={24} />,
      label: 'Logg ut',
      action: () => {
        signOut();
        setIsOpen(false);
      },
      color: 'text-cyberred-400',
      authRequired: true
    }
  ];

  // Filter items based on auth status
  const filteredNavItems = navigationItems.filter(item => !item.authRequired || user);
  const filteredSettingsItems = settingsItems.filter(item => !item.authRequired || user);

  // Hvis ikke mobil, ikke vis menyen
  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay for closing when clicking outside */}
          <motion.div 
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-cyberdark-900 rounded-t-2xl z-50 px-4 py-6 shadow-lg border-t border-cyberdark-700 max-h-[80vh] overflow-y-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Drag handle */}
            <div className="w-16 h-1 rounded-full bg-cyberdark-600 mx-auto mb-6" />
            
            {/* User info if logged in */}
            {user && (
              <div className="flex items-center gap-3 mb-6 p-3 bg-cyberdark-800 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-cybergold-600 flex items-center justify-center">
                  <User size={20} className="text-black" />
                </div>
                <div>
                  <p className="text-cybergold-400 font-medium">{user.user_metadata?.username || 'Bruker'}</p>
                  <p className="text-cyberdark-400 text-sm truncate">{user.email}</p>
                </div>
              </div>
            )}
            
            {/* Navigation Items */}
            <div className="mb-6">
              <h3 className="text-cybergold-400 font-medium mb-3 px-2">Navigasjon</h3>
              <div className="grid grid-cols-3 gap-3">
                {filteredNavItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-cyberdark-800/50 hover:bg-cyberdark-800 transition-colors cursor-pointer" 
                    onClick={item.action}
                  >
                    <div className={`w-12 h-12 rounded-full bg-cyberdark-700 flex items-center justify-center mb-2 ${item.color}`}>
                      {item.icon}
                    </div>
                    <span className="text-xs text-cybergold-300 text-center">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Settings Items */}
            <div>
              <h3 className="text-cybergold-400 font-medium mb-3 px-2">Innstillinger</h3>
              <div className="space-y-2">
                {filteredSettingsItems.map((item, index) => (
                  <button
                    key={index}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg bg-cyberdark-800/50 hover:bg-cyberdark-800 transition-colors text-left ${item.color}`}
                    onClick={item.action}
                  >
                    {item.icon}
                    <span className="text-cybergold-300">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;