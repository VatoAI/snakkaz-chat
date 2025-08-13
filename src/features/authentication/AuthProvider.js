import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = "https://wqpoozpbceucynsojmbk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8";

export const supabase = createClient(supabaseUrl, supabaseKey);

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    console.log("AuthProvider: Initializing...");
    
    // Get initial session with timeout
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("AuthProvider: Initial session:", session?.user?.email || 'No user');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            await loadUserProfile(session.user.id);
          } catch (error) {
            console.warn("Profile loading failed during init:", error);
          }
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        setLoading(false);
      }
    };

    // Set a maximum wait time
    const timeoutId = setTimeout(() => {
      console.warn("AuthProvider: Timeout reached, setting loading to false");
      setLoading(false);
    }, 5000);

    initializeAuth().then(() => {
      clearTimeout(timeoutId);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Try to load profile, but don't block on it
        try {
          await loadUserProfile(session.user.id);
          await updateUserStatus("online");
        } catch (error) {
          console.warn("Profile operations failed, continuing anyway:", error);
        }
      } else {
        setProfile(null);
      }

      // Always set loading to false, even if profile operations fail
      setLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      console.log("Loading user profile for:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.warn("Profile table might not exist or user has no access:", error);
        // Create a basic profile from auth data instead
        setProfile({
          id: userId,
          username: userId.split('@')[0] || 'user',
          status: 'online'
        });
        return;
      }

      if (data) {
        console.log("Profile loaded successfully:", data);
        setProfile(data);
      } else {
        console.log("No profile found, creating basic profile");
        setProfile({
          id: userId,
          username: userId.split('@')[0] || 'user',
          status: 'online'
        });
      }
    } catch (error) {
      console.warn("Error in loadUserProfile, using fallback:", error);
      setProfile({
        id: userId,
        username: userId.split('@')[0] || 'user',
        status: 'online'
      });
    }
  };

  const updateUserStatus = async (status) => {
    if (!user) return;

    try {
      console.log("Updating user status to:", status);
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        status,
        last_seen: new Date().toISOString(),
      });

      if (error) {
        console.warn("Could not update user status (profiles table might not exist):", error);
      } else {
        console.log("User status updated successfully");
      }
    } catch (error) {
      console.warn("Error in updateUserStatus:", error);
    }
  };

  const signUp = async (email, password, username, displayName) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: displayName,
          },
        },
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Error signing up:", error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Error signing in:", error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);

      // Update status to offline before signing out
      await updateUserStatus("offline");

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error("Error resetting password:", error);
      return { error };
    }
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...updates,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Reload profile
      await loadUserProfile(user.id);

      return { error: null };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const verifyBetaInvite = async (inviteCode) => {
    try {
      const { data, error } = await supabase
        .from("beta_invites")
        .select("*")
        .eq("invite_code", inviteCode)
        .eq("is_used", false)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (error) {
        return { valid: false, error: "Invalid or expired invite code" };
      }

      return { valid: true, invite: data, error: null };
    } catch (error) {
      console.error("Error verifying beta invite:", error);
      return { valid: false, error: error.message };
    }
  };

  const useBetaInvite = async (inviteCode) => {
    try {
      const { error } = await supabase.rpc("use_beta_invite", {
        code: inviteCode,
      });

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error("Error using beta invite:", error);
      return { success: false, error };
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    updateUserStatus,
    verifyBetaInvite,
    useBetaInvite,
    supabase,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};
