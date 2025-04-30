import React, { useState, useEffect, ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { MessageCircle, Users, Settings, Plus, Menu } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useMobilePinSecurity } from '@/hooks/useMobilePinSecurity';

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
  
  // Bestem sidetittel basert på gjeldende URL
  useEffect(() => {
    if (location.pathname.includes('/messages')) {
      setTitle('Meldinger');
    } else if (location.pathname.includes('/contacts')) {
      setTitle('Kontakter');
    } else if (location.pathname.includes('/settings')) {
      setTitle('Innstillinger');
    } else if (location.pathname.includes('/chat/')) {
      setTitle('Chat');
    } else {
      setTitle('SnakkaZ');
    }
  }, [location]);

  // Håndter PIN-validering 
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
        // Automatisk verifiser når alle 4 sifre er lagt inn
        setTimeout(() => {
          handlePinSubmit();
        }, 200);
      }
    }
  };
  
  const handlePinDelete = () => {
    setPinInput(prev => prev.slice(0, -1));
  };

  // Hvis ikke mobil, ikke vis mobildesignet
  if (!isMobile) {
    return <>{children}</>;
  }
  
  // Vis PIN-skjerm hvis låst
  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background p-6">
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
              className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center text-2xl font-medium"
              onClick={() => handlePinDigit(num.toString())}
            >
              {num}
            </button>
          ))}
          <div className="w-16 h-16" /> {/* Empty space */}
          <button 
            className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center text-2xl font-medium"
            onClick={() => handlePinDigit('0')}
          >
            0
          </button>
          <button 
            className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center"
            onClick={handlePinDelete}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l-7-7 7-7"></path><path d="M19 12H5"></path></svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100svh] bg-background">
      {/* Topp-bar */}
      <div className="h-14 border-b flex items-center justify-between px-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(true)}>
            <Menu size={22} />
          </Button>
          <h1 className="ml-3 text-lg font-medium">{title}</h1>
        </div>
        {location.pathname === '/messages' && (
          <Button variant="ghost" size="icon" onClick={() => navigate('/new-message')}>
            <Plus size={22} />
          </Button>
        )}
      </div>
      
      {/* Hovedinnhold */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
      
      {/* Bunnmeny */}
      <div className="h-16 border-t flex items-center justify-around">
        <Button 
          variant="ghost" 
          className="flex flex-col items-center py-1 h-full w-full"
          onClick={() => navigate('/messages')}
        >
          <MessageCircle size={22} />
          <span className="text-xs mt-1">Meldinger</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex flex-col items-center py-1 h-full w-full"
          onClick={() => navigate('/contacts')}
        >
          <Users size={22} />
          <span className="text-xs mt-1">Kontakter</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex flex-col items-center py-1 h-full w-full"
          onClick={() => navigate('/settings')}
        >
          <Settings size={22} />
          <span className="text-xs mt-1">Innstillinger</span>
        </Button>
      </div>
      
      {/* Mobil-meny */}
      <MobileMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />
    </div>
  );
};

export default MobileLayout;