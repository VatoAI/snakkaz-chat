/**
 * JWT Refresh Service Tests - FASE 3 Security Testing
 * 
 * Tests for the JWT refresh mechanism to ensure proper token management
 * and security compliance in the authentication system.
 */

import { AdminAuthService } from '@/admin/services/AdminAuthService';

// Mock the ApiService
jest.mock('@/admin/services/ApiService', () => ({
  ApiService: {
    post: jest.fn(),
    get: jest.fn(),
  }
}));

describe('AdminAuthService - JWT Refresh Tests', () => {
  const mockApiService = require('@/admin/services/ApiService').ApiService;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Token Refresh Functionality', () => {
    it('should successfully refresh a valid token', async () => {
      // Arrange
      const mockRefreshToken = 'valid-refresh-token';
      const mockNewTokenResponse = {
        data: {
          token: 'new-access-token',
          refreshToken: 'new-refresh-token',
          user: {
            id: 'user-1',
            username: 'testuser',
            role: 'admin'
          }
        }
      };

      localStorage.setItem('mcp_admin_refresh_token', mockRefreshToken);
      mockApiService.post.mockResolvedValueOnce(mockNewTokenResponse);

      // Act
      await AdminAuthService.refreshToken();

      // Assert
      expect(mockApiService.post).toHaveBeenCalledWith('/admin/auth/refresh', {
        refreshToken: mockRefreshToken
      });
      expect(localStorage.getItem('mcp_admin_token')).toBe('new-access-token');
      expect(localStorage.getItem('mcp_admin_refresh_token')).toBe('new-refresh-token');
    });

    it('should handle missing refresh token', async () => {
      // Arrange - no refresh token in localStorage

      // Act & Assert
      await expect(AdminAuthService.refreshToken()).rejects.toThrow('Ingen refresh token tilgjengelig');
    });

    it('should clear auth data on refresh failure', async () => {
      // Arrange
      localStorage.setItem('mcp_admin_refresh_token', 'invalid-token');
      localStorage.setItem('mcp_admin_token', 'old-token');
      mockApiService.post.mockRejectedValueOnce(new Error('Token expired'));

      // Act
      try {
        await AdminAuthService.refreshToken();
      } catch (error) {
        // Expected to throw
      }

      // Assert
      expect(localStorage.getItem('mcp_admin_token')).toBeNull();
      expect(localStorage.getItem('mcp_admin_refresh_token')).toBeNull();
    });
  });

  describe('Token Validation', () => {
    it('should attempt token refresh when current token is invalid', async () => {
      // Arrange
      const mockUser = { id: 'user-1', username: 'testuser' };
      localStorage.setItem('mcp_admin_user', JSON.stringify(mockUser));
      localStorage.setItem('mcp_admin_token', 'invalid-token');
      localStorage.setItem('mcp_admin_refresh_token', 'valid-refresh-token');

      mockApiService.get.mockRejectedValueOnce(new Error('Token invalid'));
      mockApiService.post.mockResolvedValueOnce({
        data: {
          token: 'new-token',
          user: mockUser
        }
      });

      // Act
      const result = await AdminAuthService.getCurrentUser();

      // Assert
      expect(mockApiService.post).toHaveBeenCalledWith('/admin/auth/refresh', {
        refreshToken: 'valid-refresh-token'
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('Permission System', () => {
    it('should correctly validate super admin permissions', () => {
      // Arrange
      const superAdmin = {
        id: 'admin-1',
        username: 'superadmin',
        email: 'superadmin@example.com',
        displayName: 'Super Admin',
        role: 'super_admin' as const,
        permissions: ['*'],
        lastLogin: new Date(),
        isActive: true,
        isTwoFactorEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Act & Assert
      expect(AdminAuthService.hasPermission(superAdmin, 'any.permission')).toBe(true);
      expect(AdminAuthService.hasPermission(superAdmin, 'users.write')).toBe(true);
    });

    it('should correctly validate regular admin permissions', () => {
      // Arrange
      const admin = {
        id: 'admin-2',
        username: 'admin',
        email: 'admin@example.com',
        displayName: 'Admin User',
        role: 'admin' as const,
        permissions: ['users.read', 'users.write', 'chats.read'],
        lastLogin: new Date(),
        isActive: true,
        isTwoFactorEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Act & Assert
      expect(AdminAuthService.hasPermission(admin, 'users.read')).toBe(true);
      expect(AdminAuthService.hasPermission(admin, 'users.write')).toBe(true);
      expect(AdminAuthService.hasPermission(admin, 'system.admin')).toBe(false);
    });

    it('should deny permissions for null user', () => {
      // Act & Assert
      expect(AdminAuthService.hasPermission(null, 'any.permission')).toBe(false);
    });
  });

  describe('Role Configuration', () => {
    it('should return correct roles and permissions', () => {
      // Act
      const roles = AdminAuthService.getAdminRoles();

      // Assert
      expect(roles.super_admin).toEqual(['*']);
      expect(roles.admin).toContain('users.read');
      expect(roles.admin).toContain('users.write');
      expect(roles.moderator).toContain('chats.moderate');
      expect(roles.support).toContain('emails.read');
      expect(roles.support).not.toContain('users.write');
    });
  });
});
