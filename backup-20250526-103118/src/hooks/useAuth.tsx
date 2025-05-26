import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient'; // Import the singleton client
import { useToast } from '@/hooks/use-toast';
import { Session, User } from '@supabase/supabase-js';
import { subscriptionService } from '@/services/subscription/subscriptionService'; 
import { Subscription } from '@/services/subscription/types';

// Import types from .ts file
import { AuthContextType } from './useAuth.d';

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user's subscription data
  const refreshSubscription = async () => {
    if (!user) return;
    
    setLoadingSubscription(true);
    try {
      const userSubscription = await subscriptionService.getUserSubscription(user.id);
      setSubscription(userSubscription);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  useEffect(() => {
    // Check if user is already logged in
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
        console.error('Error loading user:', error);
        setError('Could not load user profile');
      } finally {
        setLoading(false);
      }
    };

    // Run initial check
    checkUser();

    // Set up listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setSession(session);
          setUser(session.user);
        } else {
          setSession(null);
          setUser(null);
          setSubscription(null);
        }
        setLoading(false);
      }
    );

    // Cleanup lytter ved unmounting
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Load subscription data when user changes
  useEffect(() => {
    if (user) {
      refreshSubscription();
    }
  }, [user, refreshSubscription]);

  // Check if subscription is expiring soon and show notification
  useEffect(() => {
    const checkExpiringSubscription = async () => {
      if (!user) return;
      
      const isExpiringSoon = await subscriptionService.isSubscriptionExpiringSoon(user.id);
      if (isExpiringSoon && subscription) {
        const expiryDate = new Date(subscription.current_period_end || '');
        const formattedDate = expiryDate.toLocaleDateString();
        
        toast({
          title: "Subscription Expiring Soon",
          description: `Your premium subscription will expire on ${formattedDate}. Renew now to avoid losing premium features.`,
          variant: "warning",
          duration: 10000,
        });
      }
    };
    
    checkExpiringSubscription();
    // Set up a daily check for expiring subscriptions
    const interval = setInterval(checkExpiringSubscription, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [subscription, toast, user]);

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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error('Innloggingsfeil:', errorMessage);
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Innloggingsfeil",
        description: errorMessage || "Kunne ikke logge inn. Sjekk påloggingsinformasjonen.",
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
      setSubscription(null);
      navigate('/');
      
      toast({
        title: "Utlogget",
        description: "Du har blitt logget ut.",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error('Utloggingsfeil:', errorMessage);
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Utloggingsfeil",
        description: errorMessage || "Kunne ikke logge ut. Prøv igjen.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Registrer ny bruker
  const signUp = async (email: string, password: string, metadata: Record<string, unknown> = {}) => {
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error('Registreringsfeil:', errorMessage);
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Registreringsfeil",
        description: errorMessage || "Kunne ikke opprette konto. Prøv igjen.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate premium status
  const isPremium = !!subscription && 
    (subscription.status === 'active' || subscription.status === 'trial');

  // Eksporter alle verdiene
  const value = {
    user,
    session,
    subscription,
    signIn,
    signOut,
    signUp,
    loading,
    loadingSubscription,
    error,
    isAuthenticated: !!user,
    isPremium,
    refreshSubscription
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
