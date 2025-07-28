import { supabase } from '@/lib/supabaseClient';
import { APIGateway, APIRoute, APIKey, APIMetrics, APIRateLimit } from '../../types/enterprise';
import { MultiTenantService } from './MultiTenantService';

export class APIGatewayService {
  private static instance: APIGatewayService;
  private cache = new Map<string, any>();
  private rateLimitCache = new Map<string, { count: number; resetTime: number }>();

  private constructor() {}

  static getInstance(): APIGatewayService {
    if (!APIGatewayService.instance) {
      APIGatewayService.instance = new APIGatewayService();
    }
    return APIGatewayService.instance;
  }

  // Gateway Management
  async createGateway(gateway: Omit<APIGateway, 'id' | 'created_at' | 'updated_at'>): Promise<APIGateway> {
    const tenantId = MultiTenantService.getInstance().getCurrentTenantId();
    if (!tenantId) throw new Error('No active tenant');
    
    const { data, error } = await supabase
      .from('api_gateways')
      .insert({
        ...gateway,
        tenant_id: tenantId,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create API gateway: ${error.message}`);
    
    this.invalidateCache('gateways');
    return data;
  }

  async getGateway(id: string): Promise<APIGateway | null> {
    const cacheKey = `gateway_${id}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const { data, error } = await supabase
      .from('api_gateways')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to get API gateway: ${error.message}`);
    }

    this.cache.set(cacheKey, data);
    return data;
  }

  async listGateways(): Promise<APIGateway[]> {
    const cacheKey = 'gateways';
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const tenantId = MultiTenantService.getInstance().getCurrentTenantId();
    if (!tenantId) throw new Error('No active tenant');
    
    const { data, error } = await supabase
      .from('api_gateways')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to list API gateways: ${error.message}`);

    this.cache.set(cacheKey, data);
    return data;
  }

  async updateGateway(id: string, updates: Partial<APIGateway>): Promise<APIGateway> {
    const { data, error } = await supabase
      .from('api_gateways')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update API gateway: ${error.message}`);

    this.invalidateCache('gateways');
    this.cache.delete(`gateway_${id}`);
    return data;
  }

  async deleteGateway(id: string): Promise<void> {
    const { error } = await supabase
      .from('api_gateways')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete API gateway: ${error.message}`);

    this.invalidateCache('gateways');
    this.cache.delete(`gateway_${id}`);
  }

  // Route Management
  async createRoute(route: Omit<APIRoute, 'id' | 'created_at' | 'updated_at'>): Promise<APIRoute> {
    const { data, error } = await supabase
      .from('api_routes')
      .insert(route)
      .select()
      .single();

    if (error) throw new Error(`Failed to create API route: ${error.message}`);

    this.invalidateCache(`routes_${route.api_gateway_id}`);
    return data;
  }

  async getRoutes(gatewayId: string): Promise<APIRoute[]> {
    const cacheKey = `routes_${gatewayId}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const { data, error } = await supabase
      .from('api_routes')
      .select('*')
      .eq('api_gateway_id', gatewayId)
      .order('path');

    if (error) throw new Error(`Failed to get API routes: ${error.message}`);

    this.cache.set(cacheKey, data);
    return data;
  }

  async updateRoute(id: string, updates: Partial<APIRoute>): Promise<APIRoute> {
    const { data, error } = await supabase
      .from('api_routes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update API route: ${error.message}`);

    // Invalidate related caches
    const route = await this.getRoute(id);
    if (route) {
      this.invalidateCache(`routes_${route.api_gateway_id}`);
    }

    return data;
  }

  async deleteRoute(id: string): Promise<void> {
    const route = await this.getRoute(id);
    
    const { error } = await supabase
      .from('api_routes')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete API route: ${error.message}`);

    if (route) {
      this.invalidateCache(`routes_${route.api_gateway_id}`);
    }
  }

  private async getRoute(id: string): Promise<APIRoute | null> {
    const { data, error } = await supabase
      .from('api_routes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to get API route: ${error.message}`);
    }

    return data;
  }

  // API Key Management
  async createAPIKey(key: Omit<APIKey, 'id' | 'created_at' | 'last_used_at'>): Promise<APIKey> {
    const tenantId = MultiTenantService.getInstance().getCurrentTenantId();
    if (!tenantId) throw new Error('No active tenant');
    
    // Generate a secure API key
    const apiKey = this.generateAPIKey();
    
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        ...key,
        tenant_id: tenantId,
        key_hash: await this.hashAPIKey(apiKey),
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create API key: ${error.message}`);

    this.invalidateCache('api_keys');
    
    // Return the key with the plain text key (only time it's visible)
    return { ...data, key: apiKey };
  }

  async listAPIKeys(): Promise<Omit<APIKey, 'key_hash'>[]> {
    const cacheKey = 'api_keys';
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const tenantId = MultiTenantService.getInstance().getCurrentTenantId();
    if (!tenantId) throw new Error('No active tenant');
    
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, description, permissions, rate_limit, is_active, expires_at, created_at, last_used_at, tenant_id')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to list API keys: ${error.message}`);

    this.cache.set(cacheKey, data);
    return data;
  }

  async validateAPIKey(key: string): Promise<APIKey | null> {
    const keyHash = await this.hashAPIKey(key);
    
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key_hash', keyHash)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to validate API key: ${error.message}`);
    }

    // Check expiration
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return null;
    }

    // Update last used timestamp
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id);

    return data;
  }

  async revokeAPIKey(id: string): Promise<void> {
    const { error } = await supabase
      .from('api_keys')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw new Error(`Failed to revoke API key: ${error.message}`);

    this.invalidateCache('api_keys');
  }

  // Rate Limiting
  async checkRateLimit(apiKeyId: string, rateLimit: APIRateLimit): Promise<boolean> {
    const now = Date.now();
    const windowMs = this.getRateLimitWindowMs(rateLimit.window);
    const cacheKey = `rate_limit_${apiKeyId}`;
    
    let rateLimitData = this.rateLimitCache.get(cacheKey);
    
    if (!rateLimitData || rateLimitData.resetTime < now) {
      // Reset the rate limit window
      rateLimitData = {
        count: 0,
        resetTime: now + windowMs,
      };
    }

    rateLimitData.count++;
    this.rateLimitCache.set(cacheKey, rateLimitData);

    // Check if rate limit exceeded
    if (rateLimitData.count > rateLimit.requests) {
      // Log rate limit hit
      await this.logRateLimitHit(apiKeyId);
      return false;
    }

    return true;
  }

  private getRateLimitWindowMs(window: string): number {
    switch (window) {
      case 'minute': return 60 * 1000;
      case 'hour': return 60 * 60 * 1000;
      case 'day': return 24 * 60 * 60 * 1000;
      default: return 60 * 1000;
    }
  }

  private async logRateLimitHit(apiKeyId: string): Promise<void> {
    // This would normally update metrics in the database
    // For now, we'll just log it
    console.warn(`Rate limit exceeded for API key: ${apiKeyId}`);
  }

  // Metrics and Analytics
  async getAPIMetrics(gatewayId: string, startDate: Date, endDate: Date): Promise<APIMetrics[]> {
    const { data, error } = await supabase
      .from('api_metrics')
      .select('*')
      .eq('api_gateway_id', gatewayId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date');

    if (error) throw new Error(`Failed to get API metrics: ${error.message}`);

    return data;
  }

  async recordAPICall(gatewayId: string, _routeId: string, _apiKeyId: string, responseTime: number, statusCode: number): Promise<void> {
    // This would normally be handled by middleware in the actual API gateway
    // For now, we'll aggregate into daily metrics
    const today = new Date().toISOString().split('T')[0];
    
    // Try to update existing metrics for today
    const { data: existingMetrics } = await supabase
      .from('api_metrics')
      .select('*')
      .eq('api_gateway_id', gatewayId)
      .eq('date', today)
      .single();

    if (existingMetrics) {
      // Update existing metrics
      const newTotalRequests = existingMetrics.total_requests + 1;
      const newAvgResponseTime = 
        (existingMetrics.average_response_time_ms * existingMetrics.total_requests + responseTime) / newTotalRequests;

      await supabase
        .from('api_metrics')
        .update({
          total_requests: newTotalRequests,
          average_response_time_ms: newAvgResponseTime,
          error_count: statusCode >= 400 ? existingMetrics.error_count + 1 : existingMetrics.error_count,
        })
        .eq('id', existingMetrics.id);
    } else {
      // Create new metrics record
      await supabase
        .from('api_metrics')
        .insert({
          api_gateway_id: gatewayId,
          date: today,
          total_requests: 1,
          average_response_time_ms: responseTime,
          error_count: statusCode >= 400 ? 1 : 0,
          rate_limit_hits: 0,
          bandwidth_bytes: 0, // Would be calculated from actual request/response sizes
        });
    }
  }

  // Gateway Testing
  async testGatewayHealth(gatewayId: string): Promise<{ healthy: boolean; responseTime: number; errors: string[] }> {
    const gateway = await this.getGateway(gatewayId);
    if (!gateway) {
      throw new Error('Gateway not found');
    }

    const errors: string[] = [];
    const startTime = Date.now();

    try {
      // Test basic connectivity using AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${gateway.base_url}/health`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        errors.push(`Health check failed with status ${response.status}`);
      }

      // Test authentication endpoint if available
      if (gateway.authentication?.require_api_key || gateway.authentication?.require_jwt) {
        try {
          const authController = new AbortController();
          const authTimeoutId = setTimeout(() => authController.abort(), 3000);

          const authResponse = await fetch(`${gateway.base_url}/auth/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ test: true }),
            signal: authController.signal,
          });

          clearTimeout(authTimeoutId);

          if (!authResponse.ok && authResponse.status !== 401) {
            errors.push(`Auth endpoint returned unexpected status ${authResponse.status}`);
          }
        } catch (error) {
          const err = error as Error;
          errors.push(`Auth endpoint test failed: ${err.message}`);
        }
      }

    } catch (error) {
      const err = error as Error;
      errors.push(`Gateway connectivity test failed: ${err.message}`);
    }

    const responseTime = Date.now() - startTime;

    return {
      healthy: errors.length === 0,
      responseTime,
      errors,
    };
  }

  // Utility Functions
  private generateAPIKey(): string {
    const prefix = 'snk_';
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    const key = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
    return prefix + key;
  }

  private async hashAPIKey(key: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private invalidateCache(pattern: string): void {
    for (const [key] of this.cache) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // Cache management
  clearCache(): void {
    this.cache.clear();
    this.rateLimitCache.clear();
  }
}
