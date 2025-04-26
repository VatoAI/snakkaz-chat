import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  autoLogoutTime: number | null;
  setAutoLogoutTime: (minutes: number | null) => void;
  usePinLock: boolean;
  setUsePinLock: (usePinLock: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  autoLogoutTime: null,
  setAutoLogoutTime: () => {},
  usePinLock: false,
  setUsePinLock: () => {}
});

const AUTO_LOGOUT_KEY = 'snakkaz_auto_logout_time';
const USE_PIN_LOCK_KEY = 'snakkaz_use_pin_lock';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoLogoutTime, setAutoLogoutTimeState] = useState<number | null>(() => {
    const saved = localStorage.getItem(AUTO_LOGOUT_KEY);
    return saved ? parseInt(saved, 10) : null;
  });
  const [usePinLock, setUsePinLockState] = useState<boolean>(() => {
    const saved = localStorage.getItem(USE_PIN_LOCK_KEY);
    return saved ? saved === 'true' : false;
  });
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Save auto logout time to localStorage
  const setAutoLogoutTime = (minutes: number | null) => {
    setAutoLogoutTimeState(minutes);
    if (minutes === null) {
      localStorage.removeItem(AUTO_LOGOUT_KEY);
    } else {
      localStorage.setItem(AUTO_LOGOUT_KEY, minutes.toString());
    }
    resetInactivityTimer();
  };
  
  // Save PIN lock preference to localStorage
  const setUsePinLock = (usePinLock: boolean) => {
    setUsePinLockState(usePinLock);
    localStorage.setItem(USE_PIN_LOCK_KEY, usePinLock.toString());
  };

  // Reset the inactivity timer whenever there is user activity
  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      setInactivityTimer(null);
    }
    
    if (autoLogoutTime && autoLogoutTime > 0) {
      const timer = setTimeout(() => {
        // Auto logout after inactivity
        if (session) {
          toast({
            title: "Automatisk utlogging",
            description: "Du har blitt logget ut på grunn av inaktivitet",
          });
          
          // If using PIN lock, redirect to PIN page instead of logging out completely
          if (usePinLock) {
            // Set a flag for PIN lock
            localStorage.setItem('snakkaz_pin_locked', 'true');
            navigate('/pin');
          } else {
            // Complete logout
            supabase.auth.signOut();
          }
        }
      }, autoLogoutTime * 60 * 1000); // Convert minutes to milliseconds
      
      setInactivityTimer(timer);
    }
  };

  // Setup user activity listeners
  useEffect(() => {
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    
    const handleUserActivity = () => {
      resetInactivityTimer();
    };
    
    // Add event listeners for user activity
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    // Initialize timer if auto logout is enabled
    if (autoLogoutTime && autoLogoutTime > 0) {
      resetInactivityTimer();
    }
    
    // Clean up event listeners
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
      
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
    };
  }, [autoLogoutTime, session, usePinLock]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        console.log("[AuthContext] Auth state event:", event, "session:", currentSession);
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
      console.log("[AuthContext] Checked session on mount:", currentSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      autoLogoutTime, 
      setAutoLogoutTime,
      usePinLock,
      setUsePinLock
    }}>
      {children}
    </AuthContext.Provider>
  );
};
