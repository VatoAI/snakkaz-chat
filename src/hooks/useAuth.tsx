
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  pinLocked: boolean;
  setPinLocked: (locked: boolean) => void;
  hasPinSetup: boolean;
  setHasPinSetup: (hasPin: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pinLocked, setPinLocked] = useState(false);
  const [hasPinSetup, setHasPinSetup] = useState(false);
  
  // Mock Authentication functions for demo purposes
  // Replace these with actual supabase or other auth provider methods
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock successful login
      const mockUser = {
        uid: '123',
        email: email,
        displayName: 'Test User',
        photoURL: null,
      };
      setUser(mockUser);
      setError(null);
      
      // Check if PIN is set up by looking for a stored value
      const hasPin = localStorage.getItem('snakkaz_pin_setup') === 'true';
      setHasPinSetup(hasPin);
      setPinLocked(hasPin); // If PIN is set up, lock by default until PIN is entered
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    try {
      // Mock successful registration
      const mockUser = {
        uid: '123',
        email: email,
        displayName: displayName,
        photoURL: null,
      };
      setUser(mockUser);
      setError(null);
      
      // New user doesn't have PIN setup
      setHasPinSetup(false);
      setPinLocked(false);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Mock logout
    setUser(null);
    setError(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    // Mock profile update
    setUser({ ...user, ...data });
  };

  const resetPassword = async (email: string) => {
    // Mock password reset
    setError(null);
  };

  useEffect(() => {
    // Mock checking session
    setUser(null);
    setLoading(false);
    
    // Check if PIN is set up
    const hasPin = localStorage.getItem('snakkaz_pin_setup') === 'true';
    setHasPinSetup(hasPin);
    setPinLocked(hasPin); // If PIN is set up, lock by default until PIN is entered
  }, []);

  const value = {
    user,
    loading,
    error,
    pinLocked,
    setPinLocked,
    hasPinSetup,
    setHasPinSetup,
    login,
    register,
    logout,
    updateProfile,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
