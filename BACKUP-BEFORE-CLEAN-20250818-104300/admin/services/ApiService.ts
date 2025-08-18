import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '../types/auth';

/**
 * API Service for MCP Admin Dashboard
 * 
 * Handles all HTTP communication with the backend API,
 * including authentication, error handling, and request/response interceptors.
 */
export class ApiService {
  private static instance: AxiosInstance;
  
  static {
    this.initialize();
  }
  
  /**
   * Initialize the API service with default configuration
   */
  private static initialize(): void {
    this.instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'https://api.snakkaz.com',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    this.setupInterceptors();
  }
  
  /**
   * Set up request and response interceptors
   */
  private static setupInterceptors(): void {
    // Request interceptor - add auth token
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('mcp_admin_token');
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add request timestamp for debugging
        config.metadata = { startTime: new Date() };
        
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );
    
    // Response interceptor - handle common errors
    this.instance.interceptors.response.use(
      (response) => {
        // Log response time for monitoring
        const endTime = new Date();
        const startTime = response.config.metadata?.startTime;
        if (startTime) {
          const duration = endTime.getTime() - startTime.getTime();
          console.log(`API Request to ${response.config.url} took ${duration}ms`);
        }
        
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh token
            const refreshToken = localStorage.getItem('mcp_admin_refresh_token');
            if (refreshToken) {
              const response = await this.post('/admin/auth/refresh', {
                refreshToken
              });
              
              const { token } = response.data;
              localStorage.setItem('mcp_admin_token', token);
              
              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.handleAuthenticationFailure();
            return Promise.reject(refreshError);
          }
        }
        
        // Handle other common errors
        if (error.response?.status === 403) {
          console.error('Access forbidden:', error.response.data);
        } else if (error.response?.status >= 500) {
          console.error('Server error:', error.response.data);
        }
        
        return Promise.reject(error);
      }
    );
  }
  
  /**
   * Handle authentication failure
   */
  private static handleAuthenticationFailure(): void {
    localStorage.removeItem('mcp_admin_token');
    localStorage.removeItem('mcp_admin_refresh_token');
    localStorage.removeItem('mcp_admin_user');
    
    // Redirect to login page if we're not already there
    if (window.location.pathname !== '/admin/login') {
      window.location.href = '/admin/login';
    }
  }
  
  /**
   * GET request
   */
  static async get<T = any>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.get(url, config);
  }
  
  /**
   * POST request
   */
  static async post<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.post(url, data, config);
  }
  
  /**
   * PUT request
   */
  static async put<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.put(url, data, config);
  }
  
  /**
   * DELETE request
   */
  static async delete<T = any>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.delete(url, config);
  }
  
  /**
   * PATCH request
   */
  static async patch<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.patch(url, data, config);
  }
  
  /**
   * Upload file
   */
  static async uploadFile<T = any>(
    url: string,
    file: File,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
  }
  
  /**
   * Download file
   */
  static async downloadFile(
    url: string,
    filename?: string
  ): Promise<void> {
    const response = await this.instance.get(url, {
      responseType: 'blob'
    });
    
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(downloadUrl);
  }
  
  /**
   * Set base URL
   */
  static setBaseURL(baseURL: string): void {
    this.instance.defaults.baseURL = baseURL;
  }
  
  /**
   * Set default headers
   */
  static setDefaultHeaders(headers: Record<string, string>): void {
    Object.assign(this.instance.defaults.headers, headers);
  }
  
  /**
   * Create a custom instance with different configuration
   */
  static createCustomInstance(config: AxiosRequestConfig): AxiosInstance {
    return axios.create({
      ...this.instance.defaults,
      ...config
    });
  }
}

// Type augmentation for axios metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
  }
}
