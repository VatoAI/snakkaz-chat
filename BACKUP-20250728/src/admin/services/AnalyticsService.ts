import { ApiService } from './ApiService';
import { AdminUser, SystemMetrics, ApplicationMetrics, AuditLogEntry, SecurityEvent } from '../types/auth';

/**
 * MCP Analytics Service
 * 
 * Provides advanced analytics, metrics collection, and predictive analysis
 * for the MCP admin dashboard.
 */
export class AnalyticsService {
  /**
   * Get system metrics over time
   */
  static async getSystemMetrics(timeRange: string = '24h'): Promise<SystemMetrics[]> {
    const response = await ApiService.get(`/admin/analytics/system-metrics?range=${timeRange}`);
    return response.data.data;
  }
  
  /**
   * Get application metrics
   */
  static async getApplicationMetrics(timeRange: string = '24h'): Promise<ApplicationMetrics[]> {
    const response = await ApiService.get(`/admin/analytics/app-metrics?range=${timeRange}`);
    return response.data.data;
  }
  
  /**
   * Get user activity analytics
   */
  static async getUserActivityAnalytics(timeRange: string = '7d'): Promise<any> {
    const response = await ApiService.get(`/admin/analytics/user-activity?range=${timeRange}`);
    return response.data.data;
  }
  
  /**
   * Get chat analytics
   */
  static async getChatAnalytics(timeRange: string = '7d'): Promise<any> {
    const response = await ApiService.get(`/admin/analytics/chats?range=${timeRange}`);
    return response.data.data;
  }
  
  /**
   * Get email analytics
   */
  static async getEmailAnalytics(timeRange: string = '30d'): Promise<any> {
    const response = await ApiService.get(`/admin/analytics/emails?range=${timeRange}`);
    return response.data.data;
  }
  
  /**
   * Get audit log entries
   */
  static async getAuditLogs(
    page: number = 1,
    limit: number = 50,
    filters?: {
      userId?: string;
      action?: string;
      dateFrom?: string;
      dateTo?: string;
      severity?: string;
    }
  ): Promise<{ logs: AuditLogEntry[], pagination: any }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    
    const response = await ApiService.get(`/admin/analytics/audit-logs?${params}`);
    return {
      logs: response.data.data,
      pagination: response.data.pagination
    };
  }
  
  /**
   * Get security events
   */
  static async getSecurityEvents(
    page: number = 1,
    limit: number = 50,
    filters?: {
      type?: string;
      riskScore?: number;
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<{ events: SecurityEvent[], pagination: any }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    
    const response = await ApiService.get(`/admin/analytics/security-events?${params}`);
    return {
      events: response.data.data,
      pagination: response.data.pagination
    };
  }
  
  /**
   * Get predictive analytics for resource planning
   */
  static async getPredictiveAnalytics(
    metric: 'users' | 'storage' | 'bandwidth' | 'cpu' | 'memory',
    days: number = 30
  ): Promise<any> {
    const response = await ApiService.get(`/admin/analytics/predictive/${metric}?days=${days}`);
    return response.data.data;
  }
  
  /**
   * Get performance insights
   */
  static async getPerformanceInsights(): Promise<any> {
    const response = await ApiService.get('/admin/analytics/performance-insights');
    return response.data.data;
  }
  
  /**
   * Generate custom report
   */
  static async generateReport(config: {
    type: 'users' | 'chats' | 'emails' | 'system' | 'security';
    timeRange: string;
    format: 'json' | 'csv' | 'pdf';
    filters?: Record<string, any>;
  }): Promise<any> {
    const response = await ApiService.post('/admin/analytics/generate-report', config);
    return response.data.data;
  }
  
  /**
   * Get real-time dashboard data
   */
  static async getDashboardData(): Promise<any> {
    const response = await ApiService.get('/admin/analytics/dashboard');
    return response.data.data;
  }
  
  /**
   * Track custom event
   */
  static async trackEvent(event: {
    name: string;
    category: string;
    properties?: Record<string, any>;
  }): Promise<void> {
    await ApiService.post('/admin/analytics/track-event', event);
  }
  
  /**
   * Get usage trends
   */
  static async getUsageTrends(metric: string, timeRange: string = '30d'): Promise<any> {
    const response = await ApiService.get(`/admin/analytics/trends/${metric}?range=${timeRange}`);
    return response.data.data;
  }
  
  /**
   * Get capacity forecasting
   */
  static async getCapacityForecast(
    resource: 'storage' | 'bandwidth' | 'users' | 'messages',
    horizon: number = 90
  ): Promise<any> {
    const response = await ApiService.get(`/admin/analytics/forecast/${resource}?horizon=${horizon}`);
    return response.data.data;
  }
  
  /**
   * Get anomaly detection results
   */
  static async getAnomalies(timeRange: string = '24h'): Promise<any> {
    const response = await ApiService.get(`/admin/analytics/anomalies?range=${timeRange}`);
    return response.data.data;
  }
  
  /**
   * Get geographic analytics
   */
  static async getGeographicAnalytics(timeRange: string = '7d'): Promise<any> {
    const response = await ApiService.get(`/admin/analytics/geographic?range=${timeRange}`);
    return response.data.data;
  }
  
  /**
   * Get device and platform analytics
   */
  static async getDeviceAnalytics(timeRange: string = '30d'): Promise<any> {
    const response = await ApiService.get(`/admin/analytics/devices?range=${timeRange}`);
    return response.data.data;
  }
  
  /**
   * Get cost analytics
   */
  static async getCostAnalytics(timeRange: string = '30d'): Promise<any> {
    const response = await ApiService.get(`/admin/analytics/costs?range=${timeRange}`);
    return response.data.data;
  }
  
  /**
   * Export analytics data
   */
  static async exportData(
    type: string,
    format: 'csv' | 'json' | 'xlsx',
    timeRange: string,
    filters?: Record<string, any>
  ): Promise<Blob> {
    const response = await ApiService.post('/admin/analytics/export', {
      type,
      format,
      timeRange,
      filters
    }, {
      responseType: 'blob'
    });
    
    return response.data;
  }
}

/**
 * Supabase Integration Service
 * 
 * Handles integration with Supabase for authentication and database operations.
 */
export class SupabaseIntegrationService {
  /**
   * Sync users with Supabase
   */
  static async syncUsersWithSupabase(): Promise<any> {
    const response = await ApiService.post('/admin/integrations/supabase/sync-users');
    return response.data.data;
  }
  
  /**
   * Get Supabase connection status
   */
  static async getSupabaseStatus(): Promise<any> {
    const response = await ApiService.get('/admin/integrations/supabase/status');
    return response.data.data;
  }
  
  /**
   * Configure Supabase settings
   */
  static async configureSupabase(config: {
    url: string;
    anonKey: string;
    serviceKey: string;
    jwtSecret: string;
  }): Promise<any> {
    const response = await ApiService.post('/admin/integrations/supabase/configure', config);
    return response.data.data;
  }
  
  /**
   * Test Supabase connection
   */
  static async testSupabaseConnection(): Promise<any> {
    const response = await ApiService.post('/admin/integrations/supabase/test-connection');
    return response.data.data;
  }
  
  /**
   * Get Supabase analytics
   */
  static async getSupabaseAnalytics(timeRange: string = '7d'): Promise<any> {
    const response = await ApiService.get(`/admin/integrations/supabase/analytics?range=${timeRange}`);
    return response.data.data;
  }
}

/**
 * Email Integration Service
 * 
 * Handles integration with various email services for robust delivery.
 */
export class EmailIntegrationService {
  /**
   * Get email service providers status
   */
  static async getEmailProvidersStatus(): Promise<any> {
    const response = await ApiService.get('/admin/integrations/email/providers');
    return response.data.data;
  }
  
  /**
   * Configure email provider
   */
  static async configureEmailProvider(provider: string, config: any): Promise<any> {
    const response = await ApiService.post(`/admin/integrations/email/providers/${provider}`, config);
    return response.data.data;
  }
  
  /**
   * Test email delivery
   */
  static async testEmailDelivery(
    provider: string,
    testEmail: string
  ): Promise<any> {
    const response = await ApiService.post('/admin/integrations/email/test', {
      provider,
      testEmail
    });
    return response.data.data;
  }
  
  /**
   * Get email delivery analytics
   */
  static async getEmailAnalytics(timeRange: string = '30d'): Promise<any> {
    const response = await ApiService.get(`/admin/integrations/email/analytics?range=${timeRange}`);
    return response.data.data;
  }
  
  /**
   * Manage email templates
   */
  static async getEmailTemplates(): Promise<any> {
    const response = await ApiService.get('/admin/integrations/email/templates');
    return response.data.data;
  }
  
  static async createEmailTemplate(template: any): Promise<any> {
    const response = await ApiService.post('/admin/integrations/email/templates', template);
    return response.data.data;
  }
  
  static async updateEmailTemplate(id: string, template: any): Promise<any> {
    const response = await ApiService.put(`/admin/integrations/email/templates/${id}`, template);
    return response.data.data;
  }
  
  static async deleteEmailTemplate(id: string): Promise<any> {
    const response = await ApiService.delete(`/admin/integrations/email/templates/${id}`);
    return response.data.data;
  }
}

/**
 * CRM Integration Service
 * 
 * Handles integration with CRM systems for customer service.
 */
export class CRMIntegrationService {
  /**
   * Get available CRM integrations
   */
  static async getAvailableCRMs(): Promise<any> {
    const response = await ApiService.get('/admin/integrations/crm/available');
    return response.data.data;
  }
  
  /**
   * Configure CRM integration
   */
  static async configureCRM(crmType: string, config: any): Promise<any> {
    const response = await ApiService.post(`/admin/integrations/crm/${crmType}`, config);
    return response.data.data;
  }
  
  /**
   * Sync customers with CRM
   */
  static async syncWithCRM(crmType: string): Promise<any> {
    const response = await ApiService.post(`/admin/integrations/crm/${crmType}/sync`);
    return response.data.data;
  }
  
  /**
   * Get CRM sync status
   */
  static async getCRMSyncStatus(crmType: string): Promise<any> {
    const response = await ApiService.get(`/admin/integrations/crm/${crmType}/status`);
    return response.data.data;
  }
  
  /**
   * Get customer service tickets
   */
  static async getCustomerServiceTickets(
    page: number = 1,
    limit: number = 50,
    filters?: any
  ): Promise<any> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    
    const response = await ApiService.get(`/admin/integrations/crm/tickets?${params}`);
    return response.data.data;
  }
  
  /**
   * Create customer service ticket
   */
  static async createTicket(ticket: any): Promise<any> {
    const response = await ApiService.post('/admin/integrations/crm/tickets', ticket);
    return response.data.data;
  }
}
