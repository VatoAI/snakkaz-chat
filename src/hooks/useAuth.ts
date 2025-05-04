import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type AuthContextType = {
  user: any;
  session: any;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  loading: boolean;
  error: string | null;
};

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing session on component mount
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
        } else if (data?.session) {
          setUser(data.session.user);
        }
      } catch (err) {
        console.error('Unexpected error during session check:', err);
        setError('Failed to retrieve authentication session');
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Cleanup function to remove listener
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        setError(error.message);
        toast({
          variant: "destructive",
          title: "Registrering mislyktes",
          description: error.message,
        });
        return;
      }

      toast({
        title: "Registrering vellykket",
        description: "Sjekk e-posten din for bekreftelseslink.",
      });

      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Det oppstod en feil under registreringen');
      toast({
        variant: "destructive",
        title: "Registrering mislyktes",
        description: err.message || 'Det oppstod en feil under registreringen',
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        toast({
          variant: "destructive",
          title: "Pålogging mislyktes",
          description: error.message,
        });
        return;
      }

      setUser(data.user);
      toast({
        title: "Pålogging vellykket",
        description: "Du er nå logget inn.",
      });

      navigate('/chat');
    } catch (err: any) {
      setError(err.message || 'Det oppstod en feil under pålogging');
      toast({
        variant: "destructive",
        title: "Pålogging mislyktes",
        description: err.message || 'Det oppstod en feil under pålogging',
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError(error.message);
        return;
      }
      
      setUser(null);
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Det oppstod en feil under utlogging');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session: user ? { user } : null,
    signIn,
    signUp,
    signOut,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
