import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Session, User } from '@supabase/supabase-js';

// Importer typene fra .ts-filen
import { AuthContextType } from './useAuth.d';

// Opprett Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider komponent
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Sjekk om brukeren allerede er innlogget
    const checkUser = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data?.session) {
          setSession(data.session);
          setUser(data.session.user);
        }
      } catch (error) {
        console.error('Feil ved innlasting av bruker:', error);
        setError('Kunne ikke laste inn brukerprofil');
      } finally {
        setLoading(false);
      }
    };

    // Kjør initialsjekk
    checkUser();

    // Set opp lytter for auth-endringer
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setSession(session);
          setUser(session.user);
        } else {
          setSession(null);
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Cleanup lytter ved unmounting
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Logg inn
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      setSession(data.session);
      setUser(data.user);
      navigate('/chat');
      
      toast({
        title: "Innlogging vellykket",
        description: "Velkommen tilbake!",
      });
    } catch (error: any) {
      console.error('Innloggingsfeil:', error.message);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Innloggingsfeil",
        description: error.message || "Kunne ikke logge inn. Sjekk påloggingsinformasjonen.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Logg ut
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      setSession(null);
      setUser(null);
      navigate('/');
      
      toast({
        title: "Utlogget",
        description: "Du har blitt logget ut.",
      });
    } catch (error: any) {
      console.error('Utloggingsfeil:', error.message);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Utloggingsfeil",
        description: error.message || "Kunne ikke logge ut. Prøv igjen.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Registrer ny bruker
  const signUp = async (email: string, password: string, metadata: any = {}) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) throw error;

      toast({
        title: "Registrering vellykket",
        description: "Sjekk e-posten din for bekreftelseslenke.",
      });
      
      // Ikke naviger til Chat direkte, vent på e-postbekreftelse
      // Hvis bruker er bekreftet umiddelbart, vil onAuthStateChange håndtere det
    } catch (error: any) {
      console.error('Registreringsfeil:', error.message);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Registreringsfeil",
        description: error.message || "Kunne ikke opprette konto. Prøv igjen.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Eksporter alle verdiene
  const value = {
    user,
    session,
    signIn,
    signOut,
    signUp,
    loading,
    error,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for enkel tilgang til auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth må brukes innenfor en AuthProvider');
  }
  return context;
};

export default useAuth;
