import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: any;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signOut: async () => {},
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authListenerInitialized, setAuthListenerInitialized] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[AuthContext] Error checking session:', error);
        } else {
          setSession(data.session);
          setUser(data.session?.user || null);
          console.log('[AuthContext] Checked session on mount:', data.session ? 'Active' : 'None');
        }
      } catch (error) {
        console.error('[AuthContext] Exception checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Setup auth state change listener with error handling
    try {
      // Ensure we don't set up duplicate listeners
      if (!authListenerInitialized && typeof supabase.auth.onAuthStateChange === 'function') {
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            console.log('[AuthContext] Auth state event:', event);
            setSession(currentSession);
            setUser(currentSession?.user || null);
          }
        );

        setAuthListenerInitialized(true);

        // Return cleanup function
        return () => {
          try {
            if (authListener?.subscription?.unsubscribe) {
              authListener.subscription.unsubscribe();
            }
          } catch (error) {
            console.error('[AuthContext] Error unsubscribing from auth listener:', error);
          }
        };
      }
    } catch (error) {
      console.error('[AuthContext] Error setting up auth listener:', error);
      setIsLoading(false);
    }
  }, [authListenerInitialized]);

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('[AuthContext] Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
