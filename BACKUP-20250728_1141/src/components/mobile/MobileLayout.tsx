import React, { useState, useEffect, ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import MobileMenu from './MobileMenu';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useMobilePinSecurity } from '@/hooks/useMobilePinSecurity';
import { AppHeader } from '@/components/chat/header/AppHeader';
import { UnifiedNavigation } from '@/components/navigation/UnifiedNavigation';

interface MobileLayoutProps {
  children: ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const deviceInfo = useDeviceDetection();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [title, setTitle] = useState('SnakkaZ');
  const { isLocked, verifyPin } = useMobilePinSecurity();
  const [pinInput, setPinInput] = useState('');
  
  // Determine page title based on current URL - simplified and cleaner
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/basic-chat') || path.includes('/chat')) {
      setTitle('Chat');
    } else if (path.includes('/friends')) {
      setTitle('Venner');
    } else if (path.includes('/ai-chat')) {
      setTitle('AI Assistent');
    } else if (path.includes('/global-chat')) {
      setTitle('Global Chat');
    } else if (path.includes('/settings')) {
      setTitle('Innstillinger');
    } else if (path.includes('/security')) {
      setTitle('Sikkerhet');
    } else if (path.includes('/profile')) {
      setTitle('Profil');
    } else {
      setTitle('SnakkaZ');
    }
  }, [location]);

  // Handle PIN verification 
  const handlePinSubmit = () => {
    if (pinInput.length === 4) {
      if (verifyPin(pinInput)) {
        setPinInput('');
      } else {
        setPinInput('');
      }
    }
  };
  
  const handlePinDigit = (digit: string) => {
    if (pinInput.length < 4) {
      const newPin = pinInput + digit;
      setPinInput(newPin);
      
      if (newPin.length === 4) {
        // Automatically verify when all 4 digits are entered
        setTimeout(() => {
          handlePinSubmit();
        }, 200);
      }
    }
  };
  
  const handlePinDelete = () => {
    setPinInput(prev => prev.slice(0, -1));
  };

  // If not mobile, don't show mobile design
  if (!isMobile) {
    return <>{children}</>;
  }
  
  // Show PIN screen if locked
  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center h-[100svh] bg-background p-6 mobile-safe-padding">
        <h1 className="text-2xl font-bold mb-8">Lås opp SnakkaZ</h1>
        
        <div className="flex gap-3 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i}
              className={`w-4 h-4 rounded-full ${
                i < pinInput.length ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button 
              key={num} 
              className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center text-2xl font-medium mobile-touch-target"
              onClick={() => handlePinDigit(num.toString())}
            >
              {num}
            </button>
          ))}
          <div className="w-16 h-16" /> {/* Empty space */}
          <button 
            className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center text-2xl font-medium mobile-touch-target"
            onClick={() => handlePinDigit('0')}
          >
            0
          </button>
          <button 
            className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mobile-touch-target"
            onClick={handlePinDelete}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l-7-7 7-7"></path><path d="M19 12H5"></path></svg>
          </button>
        </div>
      </div>
    );
  }

  // Handle menu actions - simplified
  const handleMenuOpen = () => setMenuOpen(true);
  const handleAddNew = () => {
    const path = location.pathname;
    if (path.includes('/basic-chat') || path.includes('/chat')) {
      navigate('/friends'); // Navigate to friends to start new chat
    } else if (path.includes('/friends')) {
      navigate('/basic-chat'); // Navigate to chat from friends
    }
  };

  // Check if we should hide the navigation (in individual chat view)
  const hideNavigation = location.pathname.includes('/chat/') || location.pathname.includes('/conversation/');

  return (
    <div className="flex flex-col h-[100svh] bg-cyberdark-950 mobile-dynamic-height">
      {/* Optimized Top header - cleaner and more focused */}
      <AppHeader 
        variant="default"
        title={title}
        onMenuClick={handleMenuOpen}
        onAddClick={(location.pathname === '/messages' || location.pathname === '/basic-chat') ? handleAddNew : undefined}
        className="mobile-top-safe border-b border-cyberdark-700 bg-cyberdark-900"
      />
      
      {/* Main content with proper spacing */}
      <div className={`flex-1 overflow-hidden ${!hideNavigation ? 'pb-16' : ''}`}> 
        {children}
      </div>
      
      {/* Bottom navigation - only show on main views, not in chat conversation */}
      {!hideNavigation && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-cyberdark-900 border-t border-cyberdark-700">
          <UnifiedNavigation variant="mobile" />
        </div>
      )}
      
      {/* Enhanced Mobile menu */}
      <MobileMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />
    </div>
  );
}

export default MobileLayout;