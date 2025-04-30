import React, { createContext, useContext, useState, useEffect } from 'react';
import { secureSupabase, secureSignIn, secureSignOut } from '../integrations/supabase/secure-client';
import { User } from '@supabase/supabase-js';

// Definere process hvis det ikke finnes i nettlesermiljøet
if (typeof window !== 'undefined' && typeof process === 'undefined') {
  window.process = { env: {} };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  enableEncryption: () => Promise<void>;
  upgradeToPremuim: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
  updatePassword: async () => {},
  enableEncryption: async () => {},
  upgradeToPremuim: async () => {}
});

// Eksporterer AuthContext så det kan importeres direkte
export { AuthContext, type AuthContextType };

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Sjekk om brukeren er logget inn
    const checkUser = async () => {
      try {
        const { data, error } = await secureSupabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session?.user) {
          setUser(data.session.user);
        }
      } catch (err: any) {
        setError(err.message || 'Kunne ikke hente brukerinformasjon');
        console.error('Auth error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
    
    // Lytt til autentiseringsstatus-endringer
    const { data: authListener } = secureSupabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );
    
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Logg inn med e-post og passord
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await secureSignIn(email, password);
      
      if (data?.user) {
        setUser(data.user);
      }
    } catch (err: any) {
      setError(err.message || 'Innlogging mislyktes');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logg ut
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await secureSignOut();
      
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Utlogging mislyktes');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Registrer ny bruker
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await secureSupabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) throw error;
      
      // I Supabase håndteres verifisering via e-post automatisk
      // så vi behøver ikke å verifisere brukeren her
    } catch (err: any) {
      setError(err.message || 'Registrering mislyktes');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Be om tilbakestilling av passord
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await secureSupabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Tilbakestilling av passord mislyktes');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Oppdater brukerprofil
  const updateProfile = async (updates: any) => {
    if (!user) throw new Error('Ingen bruker er innlogget');
    
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await secureSupabase.auth.updateUser({
        data: updates
      });
      
      if (error) throw error;
      
      // Oppdater lokal brukerinfo
      setUser(prev => prev ? { ...prev, user_metadata: { ...prev.user_metadata, ...updates } } : null);
    } catch (err: any) {
      setError(err.message || 'Oppdatering av profil mislyktes');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Oppdater passord
  const updatePassword = async (oldPassword: string, newPassword: string) => {
    if (!user) throw new Error('Ingen bruker er innlogget');
    
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await secureSupabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Oppdatering av passord mislyktes');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Aktiver E2EE for brukeren
  const enableEncryption = async () => {
    if (!user) throw new Error('Ingen bruker er innlogget');
    
    try {
      await updateProfile({ isEncryptionEnabled: true });
      // Her kan du også initiere generering av krypteringsnøkler
      console.log('E2EE aktivert for bruker:', user.id);
    } catch (err: any) {
      setError(err.message || 'Aktivering av kryptering mislyktes');
      throw err;
    }
  };

  // Oppgrader til premium
  const upgradeToPremuim = async () => {
    if (!user) throw new Error('Ingen bruker er innlogget');
    
    try {
      // Her ville du vanligvis håndtere betaling gjennom en betalingsgateway
      // Dette er bare en forenklet implementasjon
      await updateProfile({ isPremium: true });
      console.log('Premium aktivert for bruker:', user.id);
    } catch (err: any) {
      setError(err.message || 'Oppgradering til premium mislyktes');
      throw err;
    }
  };

  const value = {
    user,
    isLoading,
    error,
    signIn,
    signOut,
    signUp,
    resetPassword,
    updateProfile,
    updatePassword,
    enableEncryption,
    upgradeToPremuim
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
