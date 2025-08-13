/**
 * Enhanced Authentication Hook for SnakkaZ
 * Provides complete auth functionality with Supabase integration
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

export interface Profile {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  last_seen: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  authenticated: boolean;
}

export interface AuthActions {
  signUp: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

export function useAuth(): AuthState & AuthActions {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    authenticated: false
  });

  const { toast } = useToast();

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }
  }, []);

  // Create profile for new user
  const createProfile = useCallback(async (user: User, username: string): Promise<Profile | null> => {
    try {
      const profileData = {
        id: user.id,
        username,
        display_name: username,
        status: 'online' as const,
        last_seen: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error('Failed to create profile:', error);
      return null;
    }
  }, []);

  // Update auth state
  const updateAuthState = useCallback(async (session: Session | null) => {
    if (session?.user) {
      const profile = await fetchProfile(session.user.id);
      setState({
        user: session.user,
        profile,
        session,
        loading: false,
        authenticated: true
      });
    } else {
      setState({
        user: null,
        profile: null,
        session: null,
        loading: false,
        authenticated: false
      });
    }
  }, [fetchProfile]);

  // Sign up function
  const signUp = useCallback(async (email: string, password: string, username: string) => {
    try {
      setState(prev => ({ ...prev, loading: true }));

      // Check if username is available
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingProfile) {
        return { success: false, error: 'Username is already taken' };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Create profile
        await createProfile(data.user, username);
        
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });

        return { success: true };
      }

      return { success: false, error: 'Failed to create account' };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [createProfile, toast]);

  // Sign in function
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [toast]);

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));

      // Update status to offline before signing out
      if (state.user) {
        await supabase
          .from('profiles')
          .update({ 
            status: 'offline',
            last_seen: new Date().toISOString()
          })
          .eq('id', state.user.id);
      }

      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });

      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.user, toast]);

  // Reset password function
  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      toast({
        title: "Password reset sent",
        description: "Check your email for password reset instructions.",
      });

      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, [toast]);

  // Update profile function
  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    try {
      if (!state.user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', state.user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Refresh profile data
      const updatedProfile = await fetchProfile(state.user.id);
      setState(prev => ({ ...prev, profile: updatedProfile }));

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, [state.user, fetchProfile, toast]);

  // Refresh profile function
  const refreshProfile = useCallback(async () => {
    if (state.user) {
      const profile = await fetchProfile(state.user.id);
      setState(prev => ({ ...prev, profile }));
    }
  }, [state.user, fetchProfile]);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }

        if (isMounted) {
          await updateAuthState(session);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        if (isMounted) {
          setState(prev => ({ ...prev, loading: false }));
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (isMounted) {
        await updateAuthState(session);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [updateAuthState]);

  // Update user status to online when authenticated
  useEffect(() => {
    if (state.authenticated && state.user && state.profile) {
      const updateStatus = async () => {
        await supabase
          .from('profiles')
          .update({
            status: 'online',
            last_seen: new Date().toISOString()
          })
          .eq('id', state.user!.id);
      };

      updateStatus();

      // Set up periodic status updates
      const statusInterval = setInterval(updateStatus, 30000); // Every 30 seconds

      return () => clearInterval(statusInterval);
    }
  }, [state.authenticated, state.user, state.profile]);

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile
  };
}
