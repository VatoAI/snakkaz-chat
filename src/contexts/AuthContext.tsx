import { createContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/hooks/useProfileLoader";
import { useToast } from "@/hooks/use-toast";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  autoLogoutTime: number | null;
  setAutoLogoutTime: (minutes: number | null) => void;
  usePinLock: boolean;
  setUsePinLock: (usePinLock: boolean) => void;
  updateUserProfile: (profileData: Partial<Profile>) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => { },
  autoLogoutTime: null,
  setAutoLogoutTime: () => { },
  usePinLock: false,
  setUsePinLock: () => { },
  updateUserProfile: async () => false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoLogoutTime, setAutoLogoutTime] = useState<number | null>(null);
  const [usePinLock, setUsePinLock] = useState(false);
  const toast = useToast ? useToast() : { toast: () => { } };

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

  // Oppdaterer brukerens profil
  const updateUserProfile = async (profileData: Partial<Profile>): Promise<boolean> => {
    if (!user) return false;

    try {
      // Fjern null-verdier
      const cleanedData = Object.fromEntries(
        Object.entries(profileData).filter(([_, value]) => value !== null)
      );

      const { error } = await supabase
        .from('profiles')
        .update(cleanedData)
        .eq('id', user.id);

      if (error) throw error;

      toast.toast?.({
        title: "Profil oppdatert",
        description: "Din profil har blitt oppdatert",
        variant: "default"
      });

      return true;
    } catch (error) {
      console.error("Error updating profile:", error);

      toast.toast?.({
        title: "Feil ved oppdatering",
        description: "Kunne ikke oppdatere profilen din",
        variant: "destructive"
      });

      return false;
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
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
