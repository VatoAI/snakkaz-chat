
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  autoLogoutTime: number | null;
  setAutoLogoutTime: (minutes: number | null) => void;
  usePinLock: boolean;
  setUsePinLock: (usePinLock: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  autoLogoutTime: null,
  setAutoLogoutTime: () => {},
  usePinLock: false,
  setUsePinLock: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoLogoutTime, setAutoLogoutTime] = useState<number | null>(null);
  const [usePinLock, setUsePinLock] = useState(false);
  
  // Handle auth state changes
  useEffect(() => {
    const setupAuth = async () => {
      try {
        // Get the current session first
        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData.session);
        setUser(sessionData.session?.user ?? null);
        
        // Set up the listener for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);
          }
        );
        
        setIsLoading(false);
        
        // Clean up subscription on unmount
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsLoading(false);
      }
    };
    
    setupAuth();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signOut,
    autoLogoutTime,
    setAutoLogoutTime,
    usePinLock,
    setUsePinLock,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
