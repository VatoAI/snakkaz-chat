import { useState, useEffect, createContext, useContext, ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type AuthError = {
  code: string;
  message: string;
  details?: string;
};

export type AuthContextType = {
  user: any;
  session: any;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: AuthError }>;
  signOut: () => Promise<{ success: boolean; error?: AuthError }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ success: boolean; error?: AuthError }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: AuthError }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: AuthError }>;
  verifyEmail: (token: string) => Promise<{ success: boolean; error?: AuthError }>;
  loading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
  lastActivity: number;
  refreshSession: () => Promise<void>;
};

// Create Auth Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default inactivity timeout (30 minutes)
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to update last activity timestamp
  const updateActivity = () => {
    setLastActivity(Date.now());
  };

  // Track user activity
  useEffect(() => {
    // Add event listeners to track user activity
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    // Set up a timer to check for inactivity
    const inactivityInterval = setInterval(() => {
      const now = Date.now();
      if (user && now - lastActivity > INACTIVITY_TIMEOUT) {
        // Log out user due to inactivity
        console.log("User inactive for too long, logging out");
        signOut();
      }
    }, 60000); // Check every minute

    return () => {
      // Clean up event listeners
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(inactivityInterval);
    };
  }, [user, lastActivity]);

  // Create standardized error from Supabase error
  const formatError = (error: any): AuthError => {
    if (!error) {
      return { code: 'unknown', message: 'Ukjent feil' };
    }
    
    return {
      code: error.code || 'unknown',
      message: error.message || 'Ukjent feil oppstod',
      details: error.details || undefined
    };
  };

  // Check for existing session on component mount
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError(formatError(error));
        } else if (data?.session) {
          setUser(data.session.user);
          updateActivity();
        }
      } catch (err) {
        console.error('Unexpected error during session check:', err);
        setError({ code: 'session_check', message: 'Failed to retrieve authentication session' });
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
          updateActivity();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'PASSWORD_RECOVERY') {
          navigate('/reset-password');
        } else if (event === 'TOKEN_REFRESHED') {
          updateActivity();
        } else if (event === 'USER_UPDATED') {
          if (session) {
            setUser(session.user);
          }
        }
      }
    );

    // Cleanup function to remove listener
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  const refreshSession = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Failed to refresh session:', error);
        setError(formatError(error));
      } else if (data.session) {
        setUser(data.session.user);
        updateActivity();
      }
    } catch (err) {
      console.error('Error refreshing session:', err);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        const formattedError = formatError(error);
        setError(formattedError);
        
        toast({
          variant: "destructive",
          title: "Registrering mislyktes",
          description: formattedError.message,
        });
        
        return { success: false, error: formattedError };
      }

      toast({
        title: "Registrering vellykket",
        description: "Sjekk e-posten din for bekreftelseslink.",
      });

      navigate('/login');
      return { success: true };
    } catch (err: any) {
      const formattedError = { 
        code: 'unexpected',
        message: err.message || 'Det oppstod en feil under registreringen' 
      };
      
      setError(formattedError);
      
      toast({
        variant: "destructive",
        title: "Registrering mislyktes",
        description: formattedError.message,
      });
      
      return { success: false, error: formattedError };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const formattedError = formatError(error);
        setError(formattedError);
        
        toast({
          variant: "destructive",
          title: "Pålogging mislyktes",
          description: formattedError.message,
        });
        
        return { success: false, error: formattedError };
      }

      setUser(data.user);
      updateActivity();
      
      toast({
        title: "Pålogging vellykket",
        description: "Du er nå logget inn.",
      });

      navigate('/chat');
      return { success: true };
    } catch (err: any) {
      const formattedError = { 
        code: 'unexpected',
        message: err.message || 'Det oppstod en feil under pålogging' 
      };
      
      setError(formattedError);
      
      toast({
        variant: "destructive",
        title: "Pålogging mislyktes",
        description: formattedError.message,
      });
      
      return { success: false, error: formattedError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        const formattedError = formatError(error);
        setError(formattedError);
        return { success: false, error: formattedError };
      }
      
      setUser(null);
      navigate('/login');
      return { success: true };
    } catch (err: any) {
      const formattedError = { 
        code: 'unexpected', 
        message: err.message || 'Det oppstod en feil under utlogging' 
      };
      setError(formattedError);
      return { success: false, error: formattedError };
    } finally {
      setLoading(false);
    }
  };

  // New function for password reset
  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        const formattedError = formatError(error);
        setError(formattedError);
        
        toast({
          variant: "destructive",
          title: "Tilbakestilling av passord mislyktes",
          description: formattedError.message,
        });
        
        return { success: false, error: formattedError };
      }
      
      toast({
        title: "Tilbakestilling av passord",
        description: "Sjekk e-posten din for instruksjoner om tilbakestilling av passord.",
      });
      
      return { success: true };
    } catch (err: any) {
      const formattedError = { 
        code: 'unexpected', 
        message: err.message || 'Det oppstod en feil under tilbakestilling av passord' 
      };
      
      setError(formattedError);
      
      toast({
        variant: "destructive",
        title: "Tilbakestilling av passord mislyktes",
        description: formattedError.message,
      });
      
      return { success: false, error: formattedError };
    } finally {
      setLoading(false);
    }
  };

  // New function for updating password
  const updatePassword = async (password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        const formattedError = formatError(error);
        setError(formattedError);
        
        toast({
          variant: "destructive",
          title: "Oppdatering av passord mislyktes",
          description: formattedError.message,
        });
        
        return { success: false, error: formattedError };
      }
      
      toast({
        title: "Passord oppdatert",
        description: "Passordet ditt er nå oppdatert.",
      });
      
      navigate('/profile');
      return { success: true };
    } catch (err: any) {
      const formattedError = { 
        code: 'unexpected', 
        message: err.message || 'Det oppstod en feil under oppdatering av passord' 
      };
      
      setError(formattedError);
      
      toast({
        variant: "destructive",
        title: "Oppdatering av passord mislyktes",
        description: formattedError.message,
      });
      
      return { success: false, error: formattedError };
    } finally {
      setLoading(false);
    }
  };

  // New function for email verification
  const verifyEmail = async (token: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });
      
      if (error) {
        const formattedError = formatError(error);
        setError(formattedError);
        
        toast({
          variant: "destructive",
          title: "Verifisering av e-post mislyktes",
          description: formattedError.message,
        });
        
        return { success: false, error: formattedError };
      }
      
      toast({
        title: "E-post verifisert",
        description: "E-postadressen din er nå verifisert.",
      });
      
      return { success: true };
    } catch (err: any) {
      const formattedError = { 
        code: 'unexpected', 
        message: err.message || 'Det oppstod en feil under verifisering av e-post' 
      };
      
      setError(formattedError);
      
      toast({
        variant: "destructive",
        title: "Verifisering av e-post mislyktes",
        description: formattedError.message,
      });
      
      return { success: false, error: formattedError };
    } finally {
      setLoading(false);
    }
  };

  // Compute whether user is authenticated (memoized)
  const isAuthenticated = useMemo(() => !!user, [user]);

  // Context value
  const value = {
    user,
    session: user ? { user } : null,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    verifyEmail,
    loading,
    error,
    isAuthenticated,
    lastActivity,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
