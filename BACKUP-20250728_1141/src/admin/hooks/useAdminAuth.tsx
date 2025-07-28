import { useState, useEffect, useCallback } from 'react';
import { AdminAuthService } from '../services/AdminAuthService';
import { AdminUser, LoginCredentials, LoginResponse } from '../types/auth';

interface UseAdminAuthReturn {
  user: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  checkPermission: (permission: string) => boolean;
}

/**
 * Custom hook for managing admin authentication
 * 
 * Provides authentication state, login/logout functionality,
 * and permission checking for the MCP admin dashboard.
 */
export const useAdminAuth = (): UseAdminAuthReturn => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const currentUser = await AdminAuthService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  // Set up token refresh interval
  useEffect(() => {
    if (user) {
      const interval = setInterval(async () => {
        try {
          await AdminAuthService.refreshToken();
        } catch (err) {
          console.error('Token refresh failed:', err);
          setUser(null);
        }
      }, 15 * 60 * 1000); // Refresh every 15 minutes
      
      return () => clearInterval(interval);
    }
  }, [user]);
  
  const login = useCallback(async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AdminAuthService.login(credentials);
      
      if (response.success && response.user) {
        setUser(response.user);
      }
      
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Pålogging mislyktes';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      await AdminAuthService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      await AdminAuthService.refreshToken();
      const currentUser = await AdminAuthService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Token refresh failed:', err);
      setUser(null);
      throw err;
    }
  }, []);
  
  const checkPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission) || user.role === 'super_admin';
  }, [user]);
  
  return {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout,
    refreshToken,
    checkPermission
  };
};
