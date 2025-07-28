import { AdminUser, LoginCredentials, LoginResponse, AdminRole } from '../types/auth';
import { ApiService } from './ApiService';

/**
 * Admin Authentication Service
 * 
 * Handles all authentication-related operations for the MCP admin dashboard,
 * including login, logout, token management, and session handling.
 */
export class AdminAuthService {
  private static readonly TOKEN_KEY = 'mcp_admin_token';
  private static readonly REFRESH_TOKEN_KEY = 'mcp_admin_refresh_token';
  private static readonly USER_KEY = 'mcp_admin_user';
  
  /**
   * Authenticate admin user with credentials
   */
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      if (credentials.step === 'credentials') {
        // Step 1: Validate username and password
        const response = await ApiService.post('/admin/auth/login', {
          username: credentials.username,
          password: credentials.password
        });
        
        if (response.data.requiresTwoFactor) {
          return {
            success: false,
            requiresTwoFactor: true,
            message: 'To-faktor autentisering påkrevd'
          };
        }
        
        // Store tokens and user data
        this.storeAuthData(response.data);
        
        return {
          success: true,
          user: response.data.user,
          message: 'Pålogging vellykket'
        };
      } else if (credentials.step === 'totp') {
        // Step 2: Validate TOTP code
        const response = await ApiService.post('/admin/auth/verify-totp', {
          username: credentials.username,
          password: credentials.password,
          totpCode: credentials.totpCode,
          rememberDevice: credentials.rememberMe
        });
        
        // Store tokens and user data
        this.storeAuthData(response.data);
        
        return {
          success: true,
          user: response.data.user,
          message: 'Pålogging vellykket'
        };
      }
      
      throw new Error('Ugyldig påloggingstrinn');
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Ugyldig brukernavn eller passord');
      } else if (error.response?.status === 423) {
        throw new Error('Kontoen er låst. Prøv igjen senere.');
      } else if (error.response?.status === 429) {
        throw new Error('For mange påloggingsforsøk. Prøv igjen senere.');
      }
      
      throw new Error(error.message || 'Pålogging mislyktes');
    }
  }
  
  /**
   * Log out current admin user
   */
  static async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await ApiService.post('/admin/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }
  
  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('Ingen refresh token tilgjengelig');
      }
      
      const response = await ApiService.post('/admin/auth/refresh', {
        refreshToken
      });
      
      this.storeAuthData(response.data);
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuthData();
      throw error;
    }
  }
  
  /**
   * Get current authenticated user
   */
  static async getCurrentUser(): Promise<AdminUser | null> {
    try {
      const token = this.getToken();
      if (!token) {
        return null;
      }
      
      // First try to get user from local storage
      const storedUser = localStorage.getItem(this.USER_KEY);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        
        // Verify token is still valid
        try {
          await ApiService.get('/admin/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          return user;
        } catch (error) {
          // Token invalid, try to refresh
          await this.refreshToken();
          return JSON.parse(localStorage.getItem(this.USER_KEY) || 'null');
        }
      }
      
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      this.clearAuthData();
      return null;
    }
  }
  
  /**
   * Check if user has specific permission
   */
  static hasPermission(user: AdminUser | null, permission: string): boolean {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return user.permissions.includes(permission);
  }
  
  /**
   * Get admin user roles and their permissions
   */
  static getAdminRoles(): Record<AdminRole, string[]> {
    return {
      super_admin: ['*'], // All permissions
      admin: [
        'users.read',
        'users.write',
        'chats.read',
        'chats.write',
        'emails.read',
        'emails.write',
        'metrics.read',
        'system.read'
      ],
      moderator: [
        'users.read',
        'chats.read',
        'chats.moderate',
        'emails.read',
        'metrics.read'
      ],
      support: [
        'users.read',
        'chats.read',
        'emails.read',
        'emails.write'
      ]
    };
  }
  
  /**
   * Store authentication data
   */
  private static storeAuthData(data: any): void {
    if (data.token) {
      localStorage.setItem(this.TOKEN_KEY, data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, data.refreshToken);
    }
    if (data.user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
    }
  }
  
  /**
   * Clear all authentication data
   */
  private static clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
  
  /**
   * Get stored authentication token
   */
  private static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  /**
   * Get stored refresh token
   */
  private static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }
}
