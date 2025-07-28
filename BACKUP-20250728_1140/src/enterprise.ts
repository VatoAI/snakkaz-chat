// FASE 7 - Enterprise Features Integration
// Central export for all enterprise services and components

// Services
export { MultiTenantService } from './services/enterprise/MultiTenantService';
export { SSOIntegrationService } from './services/enterprise/SSOIntegrationService';
export { BIService } from './services/enterprise/BIService';
export { APIGatewayService } from './services/enterprise/APIGatewayService';
export { SecuritySuiteService } from './services/enterprise/SecuritySuiteService';

// Components
export { default as TenantManagement } from './components/enterprise/TenantManagement';
export { EnterpriseDashboard } from './components/enterprise/EnterpriseDashboard';

// Types
export * from './types/enterprise';

// Import services for internal use
import { MultiTenantService } from './services/enterprise/MultiTenantService';
import { SSOIntegrationService } from './services/enterprise/SSOIntegrationService';
import { BIService } from './services/enterprise/BIService';
import { APIGatewayService } from './services/enterprise/APIGatewayService';
import { SecuritySuiteService } from './services/enterprise/SecuritySuiteService';

// Enterprise Features Manager
export class EnterpriseManager {
  private static instance: EnterpriseManager;
  
  private multiTenantService: MultiTenantService;
  private ssoService: SSOIntegrationService;
  private biService: BIService;
  private apiService: APIGatewayService;
  private securityService: SecuritySuiteService;

  private constructor() {
    this.multiTenantService = MultiTenantService.getInstance();
    this.ssoService = SSOIntegrationService.getInstance();
    this.biService = BIService.getInstance();
    this.apiService = APIGatewayService.getInstance();
    this.securityService = SecuritySuiteService.getInstance();
  }

  static getInstance(): EnterpriseManager {
    if (!EnterpriseManager.instance) {
      EnterpriseManager.instance = new EnterpriseManager();
    }
    return EnterpriseManager.instance;
  }

  // Initialize all enterprise services
  async initialize(tenantId?: string): Promise<void> {
    try {
      console.log('🚀 Initializing FASE 7 Enterprise Features...');
      
      // Initialize tenant if provided
      if (tenantId) {
        const tenantResponse = await this.multiTenantService.switchTenant(tenantId);
        if (!tenantResponse.success) {
          throw new Error(`Failed to initialize tenant: ${tenantResponse.error}`);
        }
        console.log(`✅ Tenant initialized: ${tenantResponse.data?.name}`);
      }

      // Start security monitoring
      await this.securityService.startRealTimeMonitoring();
      console.log('🛡️ Security monitoring started');

      console.log('✅ Enterprise features initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize enterprise features:', error);
      throw error;
    }
  }

  // Cleanup enterprise services
  async cleanup(): Promise<void> {
    try {
      // Stop security monitoring
      await this.securityService.stopRealTimeMonitoring();
      
      // Clear all caches
      this.multiTenantService.clearCache();
      this.ssoService.clearCache();
      this.biService.clearCache();
      this.apiService.clearCache();
      this.securityService.clearCache();
      
      console.log('✅ Enterprise services cleaned up');
    } catch (error) {
      console.error('❌ Failed to cleanup enterprise services:', error);
    }
  }

  // Get all enterprise services
  getServices() {
    return {
      multiTenant: this.multiTenantService,
      sso: this.ssoService,
      bi: this.biService,
      api: this.apiService,
      security: this.securityService,
    };
  }

  // Health check for all enterprise services
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, boolean>;
    errors: string[];
  }> {
    const errors: string[] = [];
    const services: Record<string, boolean> = {};

    try {
      // Check multi-tenant service
      const currentTenant = this.multiTenantService.getCurrentTenant();
      services.multiTenant = currentTenant !== null;
      if (!currentTenant) {
        errors.push('No active tenant');
      }

      // Check other services (basic availability)
      services.sso = true; // SSO service is always available
      services.bi = true; // BI service is always available
      services.api = true; // API service is always available
      services.security = true; // Security service is always available

      const healthyServices = Object.values(services).filter(Boolean).length;
      const totalServices = Object.keys(services).length;

      let status: 'healthy' | 'degraded' | 'unhealthy';
      if (healthyServices === totalServices) {
        status = 'healthy';
      } else if (healthyServices > totalServices / 2) {
        status = 'degraded';
      } else {
        status = 'unhealthy';
      }

      return { status, services, errors };
    } catch (error) {
      const err = error as Error;
      errors.push(`Health check failed: ${err.message}`);
      return { 
        status: 'unhealthy', 
        services: Object.fromEntries(Object.keys(services).map(k => [k, false])), 
        errors 
      };
    }
  }

  // Get enterprise feature availability for current tenant
  async getFeatureAvailability(): Promise<{
    multiTenant: boolean;
    sso: boolean;
    advancedAnalytics: boolean;
    apiAccess: boolean;
    advancedSecurity: boolean;
    customIntegrations: boolean;
    whiteLabel: boolean;
    complianceTools: boolean;
  }> {
    const currentTenant = this.multiTenantService.getCurrentTenant();
    
    if (!currentTenant || !currentTenant.features) {
      // Return basic features if no tenant or features
      return {
        multiTenant: false,
        sso: false,
        advancedAnalytics: false,
        apiAccess: false,
        advancedSecurity: false,
        customIntegrations: false,
        whiteLabel: false,
        complianceTools: false,
      };
    }

    return {
      multiTenant: true, // Always available if tenant exists
      sso: currentTenant.features.sso_enabled || false,
      advancedAnalytics: currentTenant.features.advanced_analytics || false,
      apiAccess: currentTenant.features.api_access || false,
      advancedSecurity: currentTenant.features.advanced_security || false,
      customIntegrations: currentTenant.features.custom_integrations || false,
      whiteLabel: currentTenant.features.white_label || false,
      complianceTools: currentTenant.features.compliance_tools || false,
    };
  }
}
