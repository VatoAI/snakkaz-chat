/**
 * MCP Admin API Client
 * 
 * Provides API integration for the MCP Admin Dashboard
 * Handles authentication, real-time updates, and system management
 */

import { io, Socket } from 'socket.io-client';

// Types
export interface AdminUser {
  id: string;
  username: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
  lastLogin: Date;
  twoFactorEnabled: boolean;
}

export interface SystemMetrics {
  users: {
    total: number;
    active: number;
    new: number;
  };
  chats: {
    total: number;
    active: number;
    messagesPerDay: number;
  };
  system: {
    uptime: number;
    memory: number;
    cpu: number;
    errors: number;
  };
  email: {
    sent: number;
    delivered: number;
    failed: number;
    openRate: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class MCPAdminAPI {
  private baseUrl: string;
  private token: string | null = null;
  private socket: Socket | null = null;
  private refreshTokenTimer: NodeJS.Timeout | null = null;
  
  constructor(baseUrl: string = 'https://mcp.snakkaz.com/api') {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('mcp_admin_token');
  }
  
  // Authentication
  async login(credentials: {
    username: string;
    password: string;
    totpCode?: string;
    step?: 'credentials' | 'totp';
  }): Promise<ApiResponse<{ token?: string; requiresTwoFactor?: boolean; user?: AdminUser }>> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (data.success && data.data.token) {
        this.setToken(data.data.token);
        this.startTokenRefresh();
        this.connectWebSocket();
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Kunne ikke koble til server'
      };
    }
  }
  
  async logout(): Promise<void> {
    try {
      if (this.token) {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearToken();
      this.disconnectWebSocket();
      this.stopTokenRefresh();
    }
  }
  
  async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
      
      const data = await response.json();
      
      if (data.success && data.data.token) {
        this.setToken(data.data.token);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }
  
  // User Management
  async getUsers(page: number = 1, limit: number = 20): Promise<ApiResponse<{ users: any[], total: number }>> {
    return this.apiCall(`/users?page=${page}&limit=${limit}`);
  }
  
  async getUser(userId: string): Promise<ApiResponse<any>> {
    return this.apiCall(`/users/${userId}`);
  }
  
  async createUser(userData: {
    username: string;
    displayName: string;
    email?: string;
  }): Promise<ApiResponse<any>> {
    return this.apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }
  
  async updateUser(userId: string, updates: any): Promise<ApiResponse<any>> {
    return this.apiCall(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }
  
  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return this.apiCall(`/users/${userId}`, {
      method: 'DELETE',
    });
  }
  
  // Chat Management
  async getChats(page: number = 1, limit: number = 20): Promise<ApiResponse<{ chats: any[], total: number }>> {
    return this.apiCall(`/chats?page=${page}&limit=${limit}`);
  }
  
  async getChat(chatId: string): Promise<ApiResponse<any>> {
    return this.apiCall(`/chats/${chatId}`);
  }
  
  async getChatMessages(chatId: string, page: number = 1): Promise<ApiResponse<{ messages: any[], total: number }>> {
    return this.apiCall(`/chats/${chatId}/messages?page=${page}`);
  }
  
  async createChat(chatData: {
    name: string;
    participantIds: string[];
    type: 'GROUP' | 'DIRECT';
  }): Promise<ApiResponse<any>> {
    return this.apiCall('/chats', {
      method: 'POST',
      body: JSON.stringify(chatData),
    });
  }
  
  async deleteChat(chatId: string): Promise<ApiResponse<void>> {
    return this.apiCall(`/chats/${chatId}`, {
      method: 'DELETE',
    });
  }
  
  // Email Management
  async getEmailTemplates(): Promise<ApiResponse<any[]>> {
    return this.apiCall('/email/templates');
  }
  
  async getEmailTemplate(templateId: string): Promise<ApiResponse<any>> {
    return this.apiCall(`/email/templates/${templateId}`);
  }
  
  async createEmailTemplate(templateData: {
    name: string;
    subject: string;
    body: string;
    variables: string[];
  }): Promise<ApiResponse<any>> {
    return this.apiCall('/email/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  }
  
  async updateEmailTemplate(templateId: string, updates: any): Promise<ApiResponse<any>> {
    return this.apiCall(`/email/templates/${templateId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }
  
  async sendEmail(emailData: {
    templateId: string;
    to: string;
    variables?: Record<string, string>;
    subject?: string;
  }): Promise<ApiResponse<any>> {
    return this.apiCall('/email/send', {
      method: 'POST',
      body: JSON.stringify(emailData),
    });
  }
  
  async getEmailLogs(page: number = 1, limit: number = 50): Promise<ApiResponse<{ logs: any[], total: number }>> {
    return this.apiCall(`/email/logs?page=${page}&limit=${limit}`);
  }
  
  // System Metrics
  async getSystemMetrics(): Promise<ApiResponse<SystemMetrics>> {
    return this.apiCall('/system/metrics');
  }
  
  async getSystemHealth(): Promise<ApiResponse<any>> {
    return this.apiCall('/system/health');
  }
  
  async getSystemLogs(level: string = 'all', page: number = 1): Promise<ApiResponse<{ logs: any[], total: number }>> {
    return this.apiCall(`/system/logs?level=${level}&page=${page}`);
  }
  
  async restartService(service: string): Promise<ApiResponse<void>> {
    return this.apiCall(`/system/restart/${service}`, {
      method: 'POST',
    });
  }
  
  // Real-time updates
  connectWebSocket(): void {
    if (!this.token) return;
    
    this.socket = io(this.baseUrl.replace('/api', ''), {
      auth: {
        token: this.token,
      },
      transports: ['websocket'],
    });
    
    this.socket.on('connect', () => {
      console.log('🔗 Connected to MCP admin WebSocket');
    });
    
    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from MCP admin WebSocket');
    });
    
    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }
  
  disconnectWebSocket(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
  onRealTimeUpdate(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }
  
  offRealTimeUpdate(event: string, callback?: (data: any) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
  
  // Private methods
  private setToken(token: string): void {
    this.token = token;
    localStorage.setItem('mcp_admin_token', token);
  }
  
  private clearToken(): void {
    this.token = null;
    localStorage.removeItem('mcp_admin_token');
  }
  
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }
  
  private async apiCall(endpoint: string, options: RequestInit = {}): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });
      
      const data = await response.json();
      
      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the request
          return this.apiCall(endpoint, options);
        } else {
          // Redirect to login
          window.location.href = '/admin/login';
          return { success: false, error: 'Session expired' };
        }
      }
      
      return data;
    } catch (error) {
      console.error('API call error:', error);
      return {
        success: false,
        error: 'Nettverksfeil: Kunne ikke koble til server'
      };
    }
  }
  
  private startTokenRefresh(): void {
    this.stopTokenRefresh();
    
    // Refresh token every 50 minutes (tokens expire after 60 minutes)
    this.refreshTokenTimer = setInterval(() => {
      this.refreshToken();
    }, 50 * 60 * 1000);
  }
  
  private stopTokenRefresh(): void {
    if (this.refreshTokenTimer) {
      clearInterval(this.refreshTokenTimer);
      this.refreshTokenTimer = null;
    }
  }
}

// Export singleton instance
export const mcpAdminAPI = new MCPAdminAPI();
export default mcpAdminAPI;
