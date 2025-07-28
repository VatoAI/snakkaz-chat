/**
 * Authentication Types for MCP Admin Dashboard
 */

export type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'support';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: AdminRole;
  permissions: string[];
  lastLogin: Date;
  isActive: boolean;
  isTwoFactorEnabled: boolean;
  profilePicture?: string;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
  totpCode?: string;
  rememberMe?: boolean;
  step: 'credentials' | 'totp';
}

export interface LoginResponse {
  success: boolean;
  user?: AdminUser;
  token?: string;
  refreshToken?: string;
  requiresTwoFactor?: boolean;
  message: string;
  expiresIn?: number;
}

export interface AuthToken {
  token: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface PermissionCheck {
  permission: string;
  granted: boolean;
  reason?: string;
}

export interface SessionInfo {
  user: AdminUser;
  sessionId: string;
  createdAt: Date;
  lastActivity: Date;
  ipAddress: string;
  userAgent: string;
  expiresAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Audit Log Types
export interface AuditLogEntry {
  id: string;
  userId: string;
  username: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

// Security Types
export interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'login_success' | 'login_failure' | 'logout' | 'token_refresh' | 'permission_denied';
  userId?: string;
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
  timestamp: Date;
  riskScore: number;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface PasswordResetRequest {
  email: string;
  token?: string;
  newPassword?: string;
}

// System Metrics Types
export interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    used: number;
    total: number;
    usage: number;
  };
  disk: {
    used: number;
    total: number;
    usage: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
  };
  uptime: number;
  timestamp: Date;
}

export interface ApplicationMetrics {
  activeUsers: number;
  totalSessions: number;
  apiRequests: {
    total: number;
    success: number;
    error: number;
    averageResponseTime: number;
  };
  database: {
    connections: number;
    queries: number;
    averageQueryTime: number;
  };
  cache: {
    hits: number;
    misses: number;
    hitRate: number;
  };
  timestamp: Date;
}
