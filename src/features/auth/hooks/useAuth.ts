
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type AuthContextType = {
  user: any;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  loading: boolean;
  error: string | null;
};

export const useAuth = () => {
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
        return { success: false, requiresTwoFactor: false };
      }

      // Check if user has 2FA enabled
      const user = data.user;
      const totpEnabled = user?.user_metadata?.totp_enabled || false;

      if (totpEnabled) {
        // Return user data and indicate 2FA is required
        return { 
          success: false, 
          requiresTwoFactor: true, 
          user,
          totpSecret: user.user_metadata?.totp_secret 
        };
      }

      // No 2FA required, complete login
      setUser(data.user);
      toast({
        title: "Pålogging vellykket",
        description: "Du er nå logget inn.",
      });

      navigate('/chat');
      return { success: true, requiresTwoFactor: false };
    } catch (err: any) {
      setError(err.message || 'Det oppstod en feil under pålogging');
      toast({
        variant: "destructive",
        title: "Pålogging mislyktes",
        description: err.message || 'Det oppstod en feil under pålogging',
      });
      return { success: false, requiresTwoFactor: false };
    } finally {
      setLoading(false);
    }
  };

  const completeTwoFactorAuth = async (user: any) => {
    try {
      setUser(user);
      toast({
        title: "Pålogging vellykket",
        description: "Du er nå logget inn med to-faktor autentisering.",
      });

      navigate('/chat');
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Det oppstod en feil under 2FA pålogging');
      return { success: false, error: err.message };
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

  return {
    user,
    session: user ? { user } : null,
    signIn,
    signUp,
    signOut,
    completeTwoFactorAuth,
    loading,
    error,
  };
};
