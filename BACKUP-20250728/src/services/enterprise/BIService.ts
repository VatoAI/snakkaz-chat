/**
 * FASE 7 - Business Intelligence Dashboard Service
 * 
 * Real-time analytics and insights for enterprise decision makers
 * Handles dashboard management, widgets, and data visualization
 */

import { supabase } from '@/lib/supabaseClient';
import { 
  BIDashboard, 
  DashboardWidget, 
  WidgetType,
  AnalyticsFilter,
  EnterpriseResponse,
  EnterpriseMetrics,
  WebSocketMetrics
} from '@/types/enterprise';
import { multiTenantService } from './MultiTenantService';

export class BIService {
  private static instance: BIService;
  private realtimeChannel: any = null;
  private metricsCache = new Map<string, any>();
  private cacheTimeout = 300000; // 5 minutes

  private constructor() {}

  public static getInstance(): BIService {
    if (!BIService.instance) {
      BIService.instance = new BIService();
    }
    return BIService.instance;
  }

  /**
   * Create a new dashboard
   */
  async createDashboard(
    tenantId: string,
    dashboardData: Omit<BIDashboard, 'id' | 'created_at' | 'updated_at'>
  ): Promise<EnterpriseResponse<BIDashboard>> {
    try {
      // Validate tenant access and features
      const currentTenant = multiTenantService.getCurrentTenant();
      if (!currentTenant || currentTenant.id !== tenantId) {
        return {
          success: false,
          error: 'Invalid tenant access',
          code: 'TENANT_ACCESS_DENIED'
        };
      }

      if (!currentTenant.features.advanced_analytics) {
        return {
          success: false,
          error: 'Advanced analytics feature not enabled',
          code: 'FEATURE_NOT_ENABLED'
        };
      }

      // Create dashboard
      const { data: dashboard, error } = await supabase
        .from('bi_dashboards')
        .insert({
          tenant_id: tenantId,
          name: dashboardData.name,
          description: dashboardData.description,
          layout_columns: dashboardData.layout.columns,
          layout_row_height: dashboardData.layout.row_height,
          layout_margin_x: dashboardData.layout.margin[0],
          layout_margin_y: dashboardData.layout.margin[1],
          layout_container_padding_x: dashboardData.layout.container_padding[0],
          layout_container_padding_y: dashboardData.layout.container_padding[1],
          refresh_interval: dashboardData.refresh_interval,
          is_public: dashboardData.is_public,
          created_by: dashboardData.created_by
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
          code: 'DASHBOARD_CREATE_ERROR'
        };
      }

      // Create widgets if provided
      if (dashboardData.widgets && dashboardData.widgets.length > 0) {
        for (const widget of dashboardData.widgets) {
          await this.createWidget(dashboard.id, widget);
        }
      }

      // Create filters if provided
      if (dashboardData.filters && dashboardData.filters.length > 0) {
        await this.createDashboardFilters(dashboard.id, dashboardData.filters);
      }

      // Return complete dashboard
      return this.getDashboard(dashboard.id);

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        code: 'DASHBOARD_CREATE_ERROR'
      };
    }
  }

  /**
   * Get dashboard by ID
   */
  async getDashboard(dashboardId: string): Promise<EnterpriseResponse<BIDashboard>> {
    try {
      const { data: dashboard, error } = await supabase
        .from('bi_dashboards')
        .select(`
          *,
          bi_widgets (*,
            bi_widget_thresholds (*)
          ),
          bi_dashboard_filters (*)
        `)
        .eq('id', dashboardId)
        .single();

      if (error || !dashboard) {
        return {
          success: false,
          error: 'Dashboard not found',
          code: 'DASHBOARD_NOT_FOUND'
        };
      }

      const transformedDashboard = this.transformDatabaseDashboard(dashboard);
      return { success: true, data: transformedDashboard };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        code: 'DASHBOARD_GET_ERROR'
      };
    }
  }

  /**
   * List dashboards for a tenant
   */
  async listDashboards(tenantId: string): Promise<EnterpriseResponse<BIDashboard[]>> {
    try {
      const { data: dashboards, error } = await supabase
        .from('bi_dashboards')
        .select(`
          *,
          bi_widgets (*,
            bi_widget_thresholds (*)
          ),
          bi_dashboard_filters (*)
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) {
        return {
          success: false,
          error: error.message,
          code: 'DASHBOARDS_LIST_ERROR'
        };
      }

      const transformedDashboards = dashboards.map(dashboard => 
        this.transformDatabaseDashboard(dashboard)
      );

      return { success: true, data: transformedDashboards };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        code: 'DASHBOARDS_LIST_ERROR'
      };
    }
  }

  /**
   * Create a widget
   */
  async createWidget(
    dashboardId: string,
    widgetData: Omit<DashboardWidget, 'id'>
  ): Promise<EnterpriseResponse<DashboardWidget>> {
    try {
      const { data: widget, error } = await supabase
        .from('bi_widgets')
        .insert({
          dashboard_id: dashboardId,
          type: widgetData.type,
          title: widgetData.title,
          description: widgetData.description,
          data_source_type: widgetData.data_source.type,
          data_source_query: widgetData.data_source.query,
          refresh_rate: widgetData.data_source.refresh_rate,
          cache_ttl: widgetData.data_source.cache_ttl,
          metrics: widgetData.configuration.metrics,
          dimensions: widgetData.configuration.dimensions,
          aggregation: widgetData.configuration.aggregation,
          colors: widgetData.configuration.colors,
          position_x: widgetData.position.x,
          position_y: widgetData.position.y,
          size_width: widgetData.size.width,
          size_height: widgetData.size.height
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
          code: 'WIDGET_CREATE_ERROR'
        };
      }

      // Create thresholds if provided
      if (widgetData.configuration.thresholds) {
        for (const threshold of widgetData.configuration.thresholds) {
          await supabase
            .from('bi_widget_thresholds')
            .insert({
              widget_id: widget.id,
              value: threshold.value,
              color: threshold.color,
              operator: threshold.operator
            });
        }
      }

      // Return complete widget
      return this.getWidget(widget.id);

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        code: 'WIDGET_CREATE_ERROR'
      };
    }
  }

  /**
   * Get widget by ID
   */
  async getWidget(widgetId: string): Promise<EnterpriseResponse<DashboardWidget>> {
    try {
      const { data: widget, error } = await supabase
        .from('bi_widgets')
        .select(`
          *,
          bi_widget_thresholds (*)
        `)
        .eq('id', widgetId)
        .single();

      if (error || !widget) {
        return {
          success: false,
          error: 'Widget not found',
          code: 'WIDGET_NOT_FOUND'
        };
      }

      const transformedWidget = this.transformDatabaseWidget(widget);
      return { success: true, data: transformedWidget };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        code: 'WIDGET_GET_ERROR'
      };
    }
  }

  /**
   * Execute widget query and get data
   */
  async getWidgetData(widgetId: string): Promise<EnterpriseResponse<any>> {
    try {
      const widgetResponse = await this.getWidget(widgetId);
      
      if (!widgetResponse.success || !widgetResponse.data) {
        return widgetResponse;
      }

      const widget = widgetResponse.data;
      
      // Check cache first
      const cacheKey = `widget_${widgetId}_${Date.now() - (Date.now() % (widget.data_source.cache_ttl * 1000))}`;
      
      if (this.metricsCache.has(cacheKey)) {
        return {
          success: true,
          data: this.metricsCache.get(cacheKey)
        };
      }

      // Execute query based on data source type
      let data: any;
      
      switch (widget.data_source.type) {
        case 'realtime':
          data = await this.executeRealtimeQuery(widget);
          break;
        case 'batch':
          data = await this.executeBatchQuery(widget);
          break;
        case 'api':
          data = await this.executeAPIQuery(widget);
          break;
        default:
          return {
            success: false,
            error: 'Unsupported data source type',
            code: 'UNSUPPORTED_DATA_SOURCE'
          };
      }

      // Cache the result
      this.metricsCache.set(cacheKey, data);
      
      // Clean old cache entries
      setTimeout(() => {
        this.metricsCache.delete(cacheKey);
      }, this.cacheTimeout);

      return { success: true, data };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        code: 'WIDGET_DATA_ERROR'
      };
    }
  }

  /**
   * Get enterprise metrics overview
   */
  async getEnterpriseMetrics(tenantId?: string): Promise<EnterpriseResponse<EnterpriseMetrics>> {
    try {
      const cacheKey = `enterprise_metrics_${tenantId || 'all'}`;
      
      if (this.metricsCache.has(cacheKey)) {
        return {
          success: true,
          data: this.metricsCache.get(cacheKey)
        };
      }

      // Gather metrics from various sources
      const [
        tenantMetrics,
        userMetrics,
        securityMetrics,
        performanceMetrics,
        businessMetrics
      ] = await Promise.all([
        this.getTenantMetrics(tenantId),
        this.getUserMetrics(tenantId),
        this.getSecurityMetrics(tenantId),
        this.getPerformanceMetrics(tenantId),
        this.getBusinessMetrics(tenantId)
      ]);

      const enterpriseMetrics: EnterpriseMetrics = {
        tenant_metrics: tenantMetrics,
        user_metrics: userMetrics,
        security_metrics: securityMetrics,
        performance_metrics: performanceMetrics,
        business_metrics: businessMetrics
      };

      // Cache the result
      this.metricsCache.set(cacheKey, enterpriseMetrics);
      
      setTimeout(() => {
        this.metricsCache.delete(cacheKey);
      }, this.cacheTimeout);

      return { success: true, data: enterpriseMetrics };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        code: 'METRICS_ERROR'
      };
    }
  }

  /**
   * Start real-time metrics streaming
   */
  async startRealtimeMetrics(
    tenantId: string,
    callback: (metrics: WebSocketMetrics) => void
  ): Promise<void> {
    if (this.realtimeChannel) {
      await this.stopRealtimeMetrics();
    }

    this.realtimeChannel = supabase
      .channel(`tenant_metrics_${tenantId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'api_metrics' }, 
        () => {
          // When data changes, recalculate metrics
          this.calculateRealtimeMetrics(tenantId).then(callback);
        }
      )
      .subscribe();

    // Send initial metrics
    const initialMetrics = await this.calculateRealtimeMetrics(tenantId);
    callback(initialMetrics);

    // Send periodic updates
    setInterval(async () => {
      const metrics = await this.calculateRealtimeMetrics(tenantId);
      callback(metrics);
    }, 30000); // Every 30 seconds
  }

  /**
   * Stop real-time metrics streaming
   */
  async stopRealtimeMetrics(): Promise<void> {
    if (this.realtimeChannel) {
      await supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }
  }

  /**
   * Export dashboard to various formats
   */
  async exportDashboard(
    dashboardId: string,
    format: 'pdf' | 'excel' | 'csv' | 'json'
  ): Promise<EnterpriseResponse<{
    downloadUrl: string;
    expiresAt: string;
  }>> {
    try {
      // In a real implementation, you would:
      // 1. Generate the export based on format
      // 2. Store it temporarily
      // 3. Return a download URL

      return {
        success: false,
        error: 'Dashboard export not yet implemented',
        code: 'NOT_IMPLEMENTED'
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        code: 'EXPORT_ERROR'
      };
    }
  }

  /**
   * Private: Transform database dashboard to BIDashboard interface
   */
  private transformDatabaseDashboard(dashboard: any): BIDashboard {
    const widgets = dashboard.bi_widgets?.map((widget: any) => 
      this.transformDatabaseWidget(widget)
    ) || [];

    const filters = dashboard.bi_dashboard_filters?.map((filter: any) => ({
      id: filter.id,
      field: filter.field,
      operator: filter.operator,
      value: filter.value,
      label: filter.label
    })) || [];

    return {
      id: dashboard.id,
      tenant_id: dashboard.tenant_id,
      name: dashboard.name,
      description: dashboard.description,
      widgets,
      layout: {
        columns: dashboard.layout_columns,
        row_height: dashboard.layout_row_height,
        margin: [dashboard.layout_margin_x, dashboard.layout_margin_y],
        container_padding: [dashboard.layout_container_padding_x, dashboard.layout_container_padding_y]
      },
      filters,
      refresh_interval: dashboard.refresh_interval,
      is_public: dashboard.is_public,
      created_by: dashboard.created_by,
      created_at: dashboard.created_at,
      updated_at: dashboard.updated_at
    };
  }

  /**
   * Private: Transform database widget to DashboardWidget interface
   */
  private transformDatabaseWidget(widget: any): DashboardWidget {
    const thresholds = widget.bi_widget_thresholds?.map((threshold: any) => ({
      value: threshold.value,
      color: threshold.color,
      operator: threshold.operator
    })) || [];

    return {
      id: widget.id,
      type: widget.type,
      title: widget.title,
      description: widget.description,
      data_source: {
        type: widget.data_source_type,
        query: widget.data_source_query,
        refresh_rate: widget.refresh_rate,
        cache_ttl: widget.cache_ttl
      },
      configuration: {
        metrics: widget.metrics || [],
        dimensions: widget.dimensions || [],
        aggregation: widget.aggregation,
        time_range: { start: '', end: '' }, // This would come from filters
        colors: widget.colors || [],
        thresholds
      },
      position: {
        x: widget.position_x,
        y: widget.position_y
      },
      size: {
        width: widget.size_width,
        height: widget.size_height
      }
    };
  }

  /**
   * Private: Execute realtime query
   */
  private async executeRealtimeQuery(widget: DashboardWidget): Promise<any> {
    // Parse the query to determine what data to fetch
    const query = widget.data_source.query;
    
    if (query.includes('user_count')) {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      return { value: count || 0, timestamp: new Date().toISOString() };
    }
    
    if (query.includes('message_count')) {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      
      return { value: count || 0, timestamp: new Date().toISOString() };
    }

    // Default mock data
    return {
      value: Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Private: Execute batch query
   */
  private async executeBatchQuery(widget: DashboardWidget): Promise<any> {
    // Similar to realtime but for historical/aggregated data
    return this.executeRealtimeQuery(widget);
  }

  /**
   * Private: Execute API query
   */
  private async executeAPIQuery(widget: DashboardWidget): Promise<any> {
    // For external API calls
    try {
      const response = await fetch(widget.data_source.query);
      return await response.json();
    } catch (error) {
      return { error: 'Failed to fetch external data' };
    }
  }

  /**
   * Private: Get tenant metrics
   */
  private async getTenantMetrics(tenantId?: string) {
    const { count: totalTenants } = await supabase
      .from('tenants')
      .select('*', { count: 'exact', head: true });

    const { count: activeTenants } = await supabase
      .from('tenants')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    return {
      total_tenants: totalTenants || 0,
      active_tenants: activeTenants || 0,
      trial_tenants: 0,
      churned_tenants: 0,
      average_users_per_tenant: 0,
      revenue_per_tenant: 0
    };
  }

  /**
   * Private: Get user metrics
   */
  private async getUserMetrics(tenantId?: string) {
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    return {
      total_users: totalUsers || 0,
      active_users_daily: 0,
      active_users_weekly: 0,
      active_users_monthly: 0,
      new_signups: 0,
      user_retention_rate: 0
    };
  }

  /**
   * Private: Get security metrics
   */
  private async getSecurityMetrics(tenantId?: string) {
    const { count: incidents } = await supabase
      .from('security_incidents')
      .select('*', { count: 'exact', head: true });

    return {
      security_incidents: incidents || 0,
      blocked_attacks: 0,
      compliance_score: 95,
      failed_login_attempts: 0,
      suspicious_activities: 0
    };
  }

  /**
   * Private: Get performance metrics
   */
  private async getPerformanceMetrics(tenantId?: string) {
    return {
      average_response_time: 150,
      uptime_percentage: 99.9,
      error_rate: 0.1,
      throughput_requests_per_second: 120,
      database_performance: 95
    };
  }

  /**
   * Private: Get business metrics
   */
  private async getBusinessMetrics(tenantId?: string) {
    return {
      total_revenue: 0,
      monthly_recurring_revenue: 0,
      customer_acquisition_cost: 0,
      customer_lifetime_value: 0,
      churn_rate: 0,
      net_promoter_score: 0
    };
  }

  /**
   * Private: Calculate real-time metrics
   */
  private async calculateRealtimeMetrics(tenantId: string): Promise<WebSocketMetrics> {
    // In a real implementation, you would calculate these from actual data
    return {
      active_connections: Math.floor(Math.random() * 1000) + 100,
      messages_per_second: Math.floor(Math.random() * 50) + 10,
      average_response_time: Math.floor(Math.random() * 100) + 50,
      error_rate: Math.random() * 2
    };
  }

  /**
   * Private: Create dashboard filters
   */
  private async createDashboardFilters(
    dashboardId: string,
    filters: AnalyticsFilter[]
  ): Promise<void> {
    for (const filter of filters) {
      await supabase
        .from('bi_dashboard_filters')
        .insert({
          dashboard_id: dashboardId,
          field: filter.field,
          operator: filter.operator,
          value: filter.value,
          label: filter.label
        });
    }
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.metricsCache.clear();
  }
}

// Export singleton instance
export const biService = BIService.getInstance();
