/**
 * FASE 7 - Multi-Tenant Service
 * 
 * Core service for managing multi-tenant architecture
 * Handles tenant switching, isolation, and domain routing
 */

import { supabase } from '@/lib/supabaseClient';
import { TenantConfig, EnterpriseResponse, EnterpriseError } from '@/types/enterprise';
import { Json } from '@/types/supabase';

export class MultiTenantService {
  private static instance: MultiTenantService;
  private currentTenant: TenantConfig | null = null;
  private tenantCache = new Map<string, TenantConfig>();

  private constructor() {}

  public static getInstance(): MultiTenantService {
    if (!MultiTenantService.instance) {
      MultiTenantService.instance = new MultiTenantService();
    }
    return MultiTenantService.instance;
  }

  /**
   * Initialize tenant from domain or subdomain
   */
  async initializeTenant(domain?: string): Promise<EnterpriseResponse<TenantConfig>> {
    try {
      const tenantDomain = domain || window.location.hostname;
      
      // Check cache first
      if (this.tenantCache.has(tenantDomain)) {
        this.currentTenant = this.tenantCache.get(tenantDomain)!;
        await this.setTenantContext(this.currentTenant.id);
        return { success: true, data: this.currentTenant };
      }

      // Fetch tenant from database
      const { data: tenant, error } = await supabase
        .from('tenants')
        .select(`
          *,
          tenant_features (*),
          tenant_billing (*),
          tenant_business_hours (*),
          tenant_ip_whitelist (*),
          tenant_allowed_domains (*)
        `)
        .or(`domain.eq.${tenantDomain},subdomain.eq.${tenantDomain.split('.')[0]}`)
        .eq('status', 'active')
        .single();

      if (error || !tenant) {
        return {
          success: false,
          error: 'Tenant not found or inactive',
          code: 'TENANT_NOT_FOUND'
        };
      }

      // Transform database result to TenantConfig
      const tenantConfig = this.transformDatabaseTenant(tenant);
      
      // Cache the tenant
      this.tenantCache.set(tenantDomain, tenantConfig);
      this.currentTenant = tenantConfig;

      // Set tenant context in Supabase
      await this.setTenantContext(tenantConfig.id);

      return { success: true, data: tenantConfig };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        code: 'TENANT_INIT_ERROR'
      };
    }
  }

  /**
   * Create a new tenant
   */
  async createTenant(tenantData: Partial<TenantConfig>): Promise<EnterpriseResponse<TenantConfig>> {
    try {
      // Validate required fields
      if (!tenantData.name || !tenantData.domain || !tenantData.subdomain) {
        return {
          success: false,
          error: 'Name, domain, and subdomain are required',
          code: 'VALIDATION_ERROR'
        };
      }

      // Check if domain/subdomain already exists
      const { data: existingTenant } = await supabase
        .from('tenants')
        .select('id')
        .or(`domain.eq.${tenantData.domain},subdomain.eq.${tenantData.subdomain}`)
        .single();

      if (existingTenant) {
        return {
          success: false,
          error: 'Domain or subdomain already exists',
          code: 'DUPLICATE_DOMAIN'
        };
      }

      // Create tenant
      const { data: newTenant, error } = await supabase
        .from('tenants')
        .insert({
          name: tenantData.name,
          domain: tenantData.domain,
          subdomain: tenantData.subdomain,
          company_name: tenantData.branding?.company_name || tenantData.name,
          support_email: tenantData.branding?.support_email,
          primary_color: tenantData.branding?.primary_color || '#3B82F6',
          secondary_color: tenantData.branding?.secondary_color || '#1E40AF',
          accent_color: tenantData.branding?.accent_color || '#F59E0B',
          theme: tenantData.branding?.theme || 'auto',
          timezone: tenantData.settings?.timezone || 'Europe/Oslo',
          language: tenantData.settings?.language || 'no',
          currency: tenantData.settings?.currency || 'NOK'
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
          code: 'TENANT_CREATE_ERROR'
        };
      }

      // Get the full tenant with relationships
      const tenantResponse = await this.getTenant(newTenant.id);
      
      return tenantResponse;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        code: 'TENANT_CREATE_ERROR'
      };
    }
  }

  /**
   * Get tenant by ID
   */
  async getTenant(tenantId: string): Promise<EnterpriseResponse<TenantConfig>> {
    try {
      const { data: tenant, error } = await supabase
        .from('tenants')
        .select(`
          *,
          tenant_features (*),
          tenant_billing (*),
          tenant_business_hours (*),
          tenant_ip_whitelist (*),
          tenant_allowed_domains (*)
        `)
        .eq('id', tenantId)
        .single();

      if (error || !tenant) {
        return {
          success: false,
          error: 'Tenant not found',
          code: 'TENANT_NOT_FOUND'
        };
      }

      const tenantConfig = this.transformDatabaseTenant(tenant);
      return { success: true, data: tenantConfig };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        code: 'TENANT_GET_ERROR'
      };
    }
  }

  /**
   * Update tenant configuration
   */
  async updateTenant(tenantId: string, updates: Partial<TenantConfig>): Promise<EnterpriseResponse<TenantConfig>> {
    try {
      // Update main tenant record
      const tenantUpdates: any = {};
      
      if (updates.name) tenantUpdates.name = updates.name;
      if (updates.domain) tenantUpdates.domain = updates.domain;
      if (updates.subdomain) tenantUpdates.subdomain = updates.subdomain;
      if (updates.status) tenantUpdates.status = updates.status;
      
      if (updates.branding) {
        if (updates.branding.company_name) tenantUpdates.company_name = updates.branding.company_name;
        if (updates.branding.support_email) tenantUpdates.support_email = updates.branding.support_email;
        if (updates.branding.primary_color) tenantUpdates.primary_color = updates.branding.primary_color;
        if (updates.branding.secondary_color) tenantUpdates.secondary_color = updates.branding.secondary_color;
        if (updates.branding.accent_color) tenantUpdates.accent_color = updates.branding.accent_color;
        if (updates.branding.theme) tenantUpdates.theme = updates.branding.theme;
        if (updates.branding.custom_css) tenantUpdates.custom_css = updates.branding.custom_css;
        if (updates.branding.logo_url) tenantUpdates.logo_url = updates.branding.logo_url;
        if (updates.branding.favicon_url) tenantUpdates.favicon_url = updates.branding.favicon_url;
      }

      if (updates.settings) {
        if (updates.settings.timezone) tenantUpdates.timezone = updates.settings.timezone;
        if (updates.settings.language) tenantUpdates.language = updates.settings.language;
        if (updates.settings.currency) tenantUpdates.currency = updates.settings.currency;
      }

      if (Object.keys(tenantUpdates).length > 0) {
        const { error } = await supabase
          .from('tenants')
          .update(tenantUpdates)
          .eq('id', tenantId);

        if (error) {
          return {
            success: false,
            error: error.message,
            code: 'TENANT_UPDATE_ERROR'
          };
        }
      }

      // Update features if provided
      if (updates.features) {
        const { error: featuresError } = await supabase
          .from('tenant_features')
          .update(updates.features)
          .eq('tenant_id', tenantId);

        if (featuresError) {
          return {
            success: false,
            error: featuresError.message,
            code: 'FEATURES_UPDATE_ERROR'
          };
        }
      }

      // Clear cache for this tenant
      this.clearTenantCache(tenantId);

      // Return updated tenant
      return this.getTenant(tenantId);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        code: 'TENANT_UPDATE_ERROR'
      };
    }
  }

  /**
   * Switch to a different tenant context
   */
  async switchTenant(tenantId: string): Promise<EnterpriseResponse<TenantConfig>> {
    try {
      const tenantResponse = await this.getTenant(tenantId);
      
      if (!tenantResponse.success) {
        return tenantResponse;
      }

      this.currentTenant = tenantResponse.data!;
      await this.setTenantContext(tenantId);

      return tenantResponse;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        code: 'TENANT_SWITCH_ERROR'
      };
    }
  }

  /**
   * Get current tenant
   */
  getCurrentTenant(): TenantConfig | null {
    return this.currentTenant;
  }

  /**
   * Get current tenant ID
   */
  getCurrentTenantId(): string | null {
    return this.currentTenant?.id || null;
  }

  /**
   * Check if user has access to tenant
   */
  async checkTenantAccess(tenantId: string, userId: string): Promise<boolean> {
    try {
      // Check if user belongs to this tenant
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', userId)
        .single();

      if (!userProfile || userProfile.tenant_id !== tenantId) {
        return false;
      }

      // Check tenant status
      const { data: tenant } = await supabase
        .from('tenants')
        .select('status')
        .eq('id', tenantId)
        .single();

      return tenant?.status === 'active';
    } catch {
      return false;
    }
  }

  /**
   * List all tenants (admin only)
   */
  async listTenants(page = 1, limit = 20): Promise<EnterpriseResponse<{
    tenants: TenantConfig[];
    total: number;
    page: number;
    pages: number;
  }>> {
    try {
      const offset = (page - 1) * limit;

      // Get total count
      const { count } = await supabase
        .from('tenants')
        .select('*', { count: 'exact', head: true });

      // Get tenants with pagination
      const { data: tenants, error } = await supabase
        .from('tenants')
        .select(`
          *,
          tenant_features (*),
          tenant_billing (*),
          tenant_business_hours (*),
          tenant_ip_whitelist (*),
          tenant_allowed_domains (*)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        return {
          success: false,
          error: error.message,
          code: 'TENANTS_LIST_ERROR'
        };
      }

      const transformedTenants = tenants.map(tenant => this.transformDatabaseTenant(tenant));

      return {
        success: true,
        data: {
          tenants: transformedTenants,
          total: count || 0,
          page,
          pages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        code: 'TENANTS_LIST_ERROR'
      };
    }
  }

  /**
   * Apply tenant branding to the application
   */
  applyTenantBranding(tenant: TenantConfig): void {
    if (!tenant.branding) return;

    const root = document.documentElement;
    
    // Apply CSS custom properties
    if (tenant.branding.primary_color) {
      root.style.setProperty('--tenant-primary', tenant.branding.primary_color);
    }
    if (tenant.branding.secondary_color) {
      root.style.setProperty('--tenant-secondary', tenant.branding.secondary_color);
    }
    if (tenant.branding.accent_color) {
      root.style.setProperty('--tenant-accent', tenant.branding.accent_color);
    }

    // Apply theme
    if (tenant.branding.theme) {
      root.setAttribute('data-theme', tenant.branding.theme);
    }

    // Apply custom CSS
    if (tenant.branding.custom_css) {
      const styleId = 'tenant-custom-styles';
      let styleElement = document.getElementById(styleId) as HTMLStyleElement;
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      
      styleElement.textContent = tenant.branding.custom_css;
    }

    // Update favicon
    if (tenant.branding.favicon_url) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        favicon.href = tenant.branding.favicon_url;
      }
    }

    // Update page title
    if (tenant.branding.company_name) {
      document.title = `${tenant.branding.company_name} - SnakkaZ Enterprise`;
    }
  }

  /**
   * Private: Set tenant context in Supabase
   */
  private async setTenantContext(tenantId: string): Promise<void> {
    // Set the tenant context for RLS
    await supabase.rpc('set_config', {
      setting_name: 'app.current_tenant_id',
      setting_value: tenantId,
      is_local: true
    });
  }

  /**
   * Private: Transform database tenant to TenantConfig
   */
  private transformDatabaseTenant(tenant: any): TenantConfig {
    const features = tenant.tenant_features?.[0] || {};
    const billing = tenant.tenant_billing?.[0] || {};
    const businessHours = tenant.tenant_business_hours || [];
    const ipWhitelist = tenant.tenant_ip_whitelist || [];
    const allowedDomains = tenant.tenant_allowed_domains || [];

    return {
      id: tenant.id,
      name: tenant.name,
      domain: tenant.domain,
      subdomain: tenant.subdomain,
      status: tenant.status,
      branding: {
        logo_url: tenant.logo_url,
        favicon_url: tenant.favicon_url,
        primary_color: tenant.primary_color || '#3B82F6',
        secondary_color: tenant.secondary_color || '#1E40AF',
        accent_color: tenant.accent_color || '#F59E0B',
        theme: tenant.theme || 'auto',
        custom_css: tenant.custom_css,
        company_name: tenant.company_name || tenant.name,
        support_email: tenant.support_email,
        terms_url: tenant.terms_url,
        privacy_url: tenant.privacy_url
      },
      features: {
        sso_enabled: features.sso_enabled || false,
        api_access: features.api_access || false,
        advanced_analytics: features.advanced_analytics || false,
        custom_integrations: features.custom_integrations || false,
        white_label: features.white_label || false,
        priority_support: features.priority_support || false,
        custom_domains: features.custom_domains || false,
        advanced_security: features.advanced_security || false,
        compliance_tools: features.compliance_tools || false,
        custom_workflows: features.custom_workflows || false
      },
      quotas: {
        max_users: features.max_users || 25,
        max_storage_gb: features.max_storage_gb || 10,
        max_api_requests_per_month: features.max_api_requests_per_month || 10000,
        max_groups: features.max_groups || 10,
        max_integrations: features.max_integrations || 3,
        retention_days: features.retention_days || 90
      },
      billing: {
        plan_id: billing.plan_id || 'trial',
        plan_name: billing.plan_name || 'Trial',
        billing_email: billing.billing_email || tenant.support_email,
        billing_cycle: billing.billing_cycle || 'monthly',
        next_billing_date: billing.next_billing_date,
        amount: billing.amount || 0,
        currency: billing.currency || 'NOK',
        payment_method_id: billing.payment_method_id,
        trial_ends_at: billing.trial_ends_at
      },
      settings: {
        timezone: tenant.timezone || 'Europe/Oslo',
        language: tenant.language || 'no',
        date_format: tenant.date_format || 'dd.mm.yyyy',
        currency: tenant.currency || 'NOK',
        business_hours: this.transformBusinessHours(businessHours),
        security_settings: {
          enforce_2fa: tenant.enforce_2fa || false,
          session_timeout_minutes: tenant.session_timeout_minutes || 480,
          password_policy: {
            min_length: tenant.password_min_length || 8,
            require_uppercase: tenant.password_require_uppercase || true,
            require_lowercase: tenant.password_require_lowercase || true,
            require_numbers: tenant.password_require_numbers || true,
            require_symbols: tenant.password_require_symbols || false,
            max_age_days: tenant.password_max_age_days || 90
          },
          ip_whitelist: ipWhitelist.map((ip: any) => ip.ip_address),
          allowed_domains: allowedDomains.map((domain: any) => domain.domain)
        },
        notification_settings: {
          email_notifications: tenant.email_notifications || true,
          push_notifications: tenant.push_notifications || true,
          webhook_url: tenant.webhook_url,
          notification_channels: []
        }
      },
      created_at: tenant.created_at,
      updated_at: tenant.updated_at
    };
  }

  /**
   * Private: Transform business hours from database format
   */
  private transformBusinessHours(businessHours: any[]) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const result: any = {};

    days.forEach((day, index) => {
      const dayHours = businessHours.find(bh => bh.day_of_week === index + 1);
      result[day] = dayHours?.is_working_day 
        ? { start: dayHours.start_time, end: dayHours.end_time }
        : null;
    });

    return result;
  }

  /**
   * Private: Clear tenant cache
   */
  private clearTenantCache(tenantId?: string): void {
    if (tenantId) {
      // Find and remove specific tenant from cache
      for (const [domain, tenant] of this.tenantCache.entries()) {
        if (tenant.id === tenantId) {
          this.tenantCache.delete(domain);
          break;
        }
      }
    } else {
      this.tenantCache.clear();
    }
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.tenantCache.clear();
  }
}

// Export singleton instance
export const multiTenantService = MultiTenantService.getInstance();
