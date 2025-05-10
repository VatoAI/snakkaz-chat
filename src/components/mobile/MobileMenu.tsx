import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, Settings, Shield, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, setIsOpen }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const menuItems = [
    {
      icon: <MessageCircle size={24} />,
      label: 'Meldinger',
      action: () => {
        navigate('/messages');
        setIsOpen(false);
      }
    },
    {
      icon: <Users size={24} />,
      label: 'Kontakter',
      action: () => {
        navigate('/contacts');
        setIsOpen(false);
      }
    },
    {
      icon: <Shield size={24} />,
      label: 'Sikkerhet',
      action: () => {
        navigate('/security');
        setIsOpen(false);
      }
    },
    {
      icon: <Settings size={24} />,
      label: 'Innstillinger',
      action: () => {
        navigate('/settings');
        setIsOpen(false);
      }
    },
    {
      icon: <LogOut size={24} />,
      label: 'Logg ut',
      action: () => {
        signOut();
        setIsOpen(false);
      }
    }
  ];

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
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl z-50 px-2 py-6 shadow-lg border-t"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="w-16 h-1 rounded-full bg-gray-300 mx-auto mb-6" />
            
            <div className="grid grid-cols-3 gap-4 px-4 pb-6">
              {menuItems.map((item, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center justify-center" 
                  onClick={item.action}
                >
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2 cursor-pointer hover:bg-primary/10">
                    {item.icon}
                  </div>
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;