import React, { useState, useEffect, ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import MobileMenu from './MobileMenu';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useMobilePinSecurity } from '@/hooks/useMobilePinSecurity';
import { AppHeader } from '@/components/chat/header/AppHeader';
import { MobileNavigation } from '@/components/MobileNavigation';

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
  
  // Determine page title based on current URL
  useEffect(() => {
    if (location.pathname.includes('/messages')) {
      setTitle('Meldinger');
    } else if (location.pathname.includes('/contacts')) {
      setTitle('Kontakter');
    } else if (location.pathname.includes('/settings')) {
      setTitle('Innstillinger');
    } else if (location.pathname.includes('/chat/')) {
      setTitle('Chat');
    } else if (location.pathname.includes('/chat')) {
      setTitle('Samtaler');
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

  // Handle menu actions
  const handleMenuOpen = () => setMenuOpen(true);
  const handleAddNew = () => {
    if (location.pathname === '/messages') {
      navigate('/new-message');
    } else if (location.pathname === '/chat') {
      navigate('/contacts');
    }
  };

  // Check if we should hide the navigation (in chat view for example)
  const hideNavigation = location.pathname.includes('/chat/');

  return (
    <div className="flex flex-col h-[100svh] bg-background mobile-dynamic-height">
      {/* Top header using unified AppHeader */}
      <AppHeader 
        variant="default"
        title={title}
        showLogo={false}
        showNavigation={false}
        showUserNav={false}
        showThemeToggle={false}
        onMenuClick={handleMenuOpen}
        onAddClick={(location.pathname === '/messages' || location.pathname === '/chat') ? handleAddNew : undefined}
        className="mobile-top-safe"
      />
      
      {/* Main content */}
      <div className={`flex-1 overflow-hidden ${!hideNavigation ? 'pb-16' : ''}`}> 
        {children}
      </div>
      
      {/* Bottom navigation - only show on list views, not in chat conversation */}
      {!hideNavigation && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <MobileNavigation />
        </div>
      )}
      
      {/* Mobile menu */}
      <MobileMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />
    </div>
  );
}

export default MobileLayout;