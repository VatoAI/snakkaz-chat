import { supabase } from '@/lib/supabaseClient';
import { SecuritySuite, SecurityIncident, DLPRule, SecurityPolicy, ComplianceReport, ThreatDetection } from '../../types/enterprise';
import { MultiTenantService } from './MultiTenantService';

export class SecuritySuiteService {
  private static instance: SecuritySuiteService;
  private cache = new Map<string, any>();
  private realTimeSubscriptions = new Map<string, any>();

  private constructor() {}

  static getInstance(): SecuritySuiteService {
    if (!SecuritySuiteService.instance) {
      SecuritySuiteService.instance = new SecuritySuiteService();
    }
    return SecuritySuiteService.instance;
  }

  // Security Suite Management
  async getSecuritySuite(): Promise<SecuritySuite | null> {
    const tenantId = MultiTenantService.getInstance().getCurrentTenantId();
    if (!tenantId) throw new Error('No active tenant');

    const cacheKey = `security_suite_${tenantId}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Get all security data for tenant
    const [
      incidents,
      dlpRules,
      policies,
      complianceReports,
      threatDetections
    ] = await Promise.all([
      this.getSecurityIncidents(),
      this.getDLPRules(),
      this.getSecurityPolicies(),
      this.getComplianceReports(),
      this.getThreatDetections()
    ]);

    const securitySuite: SecuritySuite = {
      tenant_id: tenantId,
      threat_detection: {
        enabled: true,
        sensitivity: 'medium',
        machine_learning: true,
        real_time_monitoring: true,
        threat_intelligence: true,
      },
      data_loss_prevention: {
        enabled: true,
        scan_files: true,
        scan_messages: true,
        scan_databases: true,
        custom_patterns: dlpRules.map(rule => rule.pattern),
      },
      compliance: {
        gdpr_enabled: true,
        hipaa_enabled: false,
        sox_enabled: false,
        iso27001_enabled: true,
        custom_frameworks: [],
      },
      audit_logging: {
        enabled: true,
        retention_days: 365,
        real_time_alerts: true,
        log_levels: ['info', 'warn', 'error', 'critical'],
      },
      incidents_summary: {
        total: incidents.length,
        open: incidents.filter(i => i.status === 'open').length,
        critical: incidents.filter(i => i.severity === 'critical').length,
        resolved_today: incidents.filter(i => 
          i.status === 'resolved' && 
          new Date(i.updated_at).toDateString() === new Date().toDateString()
        ).length,
      }
    };

    this.cache.set(cacheKey, securitySuite);
    return securitySuite;
  }

  async updateSecuritySuite(updates: Partial<SecuritySuite>): Promise<SecuritySuite> {
    const tenantId = MultiTenantService.getInstance().getCurrentTenantId();
    if (!tenantId) throw new Error('No active tenant');

    // Update tenant security settings
    const { error } = await supabase
      .from('tenant_security_settings')
      .upsert({
        tenant_id: tenantId,
        ...updates,
        updated_at: new Date().toISOString(),
      });

    if (error) throw new Error(`Failed to update security suite: ${error.message}`);

    this.cache.delete(`security_suite_${tenantId}`);
    return this.getSecuritySuite() as Promise<SecuritySuite>;
  }

  // Security Incidents
  async getSecurityIncidents(): Promise<SecurityIncident[]> {
    const tenantId = MultiTenantService.getInstance().getCurrentTenantId();
    if (!tenantId) throw new Error('No active tenant');

    const cacheKey = `incidents_${tenantId}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const { data, error } = await supabase
      .from('security_incidents')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to get security incidents: ${error.message}`);

    this.cache.set(cacheKey, data);
    return data;
  }

  async createSecurityIncident(incident: Omit<SecurityIncident, 'id' | 'created_at' | 'updated_at'>): Promise<SecurityIncident> {
    const tenantId = MultiTenantService.getInstance().getCurrentTenantId();
    if (!tenantId) throw new Error('No active tenant');

    const { data, error } = await supabase
      .from('security_incidents')
      .insert({
        ...incident,
        tenant_id: tenantId,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create security incident: ${error.message}`);

    this.invalidateCache('incidents');
    await this.triggerSecurityAlert(data);
    
    return data;
  }

  async updateSecurityIncident(id: string, updates: Partial<SecurityIncident>): Promise<SecurityIncident> {
    const { data, error } = await supabase
      .from('security_incidents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update security incident: ${error.message}`);

    this.invalidateCache('incidents');
    return data;
  }

  async resolveSecurityIncident(id: string, resolution_notes: string): Promise<SecurityIncident> {
    return this.updateSecurityIncident(id, {
      status: 'resolved',
      resolution_notes,
      resolved_at: new Date().toISOString(),
    });
  }

  // Data Loss Prevention (DLP)
  async getDLPRules(): Promise<DLPRule[]> {
    const tenantId = MultiTenantService.getInstance().getCurrentTenantId();
    if (!tenantId) throw new Error('No active tenant');

    const cacheKey = `dlp_rules_${tenantId}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const { data, error } = await supabase
      .from('dlp_rules')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to get DLP rules: ${error.message}`);

    this.cache.set(cacheKey, data);
    return data;
  }

  async createDLPRule(rule: Omit<DLPRule, 'id' | 'created_at' | 'updated_at'>): Promise<DLPRule> {
    const tenantId = MultiTenantService.getInstance().getCurrentTenantId();
    if (!tenantId) throw new Error('No active tenant');

    const { data, error } = await supabase
      .from('dlp_rules')
      .insert({
        ...rule,
        tenant_id: tenantId,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create DLP rule: ${error.message}`);

    this.invalidateCache('dlp_rules');
    return data;
  }

  async testDLPRule(ruleId: string, testData: string): Promise<{ matches: boolean; details: string[] }> {
    const rules = await this.getDLPRules();
    const rule = rules.find(r => r.id === ruleId);
    
    if (!rule) {
      throw new Error('DLP rule not found');
    }

    const matches = this.testDLPPattern(rule.pattern, testData);
    
    return {
      matches,
      details: matches ? [`Pattern "${rule.pattern}" matched in test data`] : ['No matches found'],
    };
  }

  private testDLPPattern(pattern: string, data: string): boolean {
    try {
      const regex = new RegExp(pattern, 'gi');
      return regex.test(data);
    } catch (error) {
      console.warn(`Invalid DLP pattern: ${pattern}`, error);
      return false;
    }
  }

  // Security Policies
  async getSecurityPolicies(): Promise<SecurityPolicy[]> {
    const tenantId = MultiTenantService.getInstance().getCurrentTenantId();
    if (!tenantId) throw new Error('No active tenant');

    // Return default security policies for now
    // In a real implementation, these would be stored in the database
    return [
      {
        id: 'password_policy',
        name: 'Password Policy',
        type: 'password',
        rules: {
          min_length: 12,
          require_uppercase: true,
          require_lowercase: true,
          require_numbers: true,
          require_symbols: true,
          prevent_reuse: 5,
        },
        is_active: true,
      },
      {
        id: 'session_policy',
        name: 'Session Management',
        type: 'session',
        rules: {
          max_session_duration: 480, // 8 hours in minutes
          idle_timeout: 30, // 30 minutes
          concurrent_sessions: 3,
          require_2fa: true,
        },
        is_active: true,
      },
      {
        id: 'access_policy',
        name: 'Access Control',
        type: 'access',
        rules: {
          max_failed_attempts: 5,
          lockout_duration: 15, // 15 minutes
          ip_whitelist: [],
          geo_restrictions: [],
        },
        is_active: true,
      },
    ];
  }

  async updateSecurityPolicy(policyId: string, updates: Partial<SecurityPolicy>): Promise<SecurityPolicy> {
    // In a real implementation, this would update the database
    const policies = await this.getSecurityPolicies();
    const policy = policies.find(p => p.id === policyId);
    
    if (!policy) {
      throw new Error('Security policy not found');
    }

    const updatedPolicy = { ...policy, ...updates };
    
    // Trigger policy update event
    await this.logSecurityEvent('policy_updated', {
      policy_id: policyId,
      changes: updates,
    });

    return updatedPolicy;
  }

  // Compliance Reporting
  async getComplianceReports(): Promise<ComplianceReport[]> {
    const tenantId = MultiTenantService.getInstance().getCurrentTenantId();
    if (!tenantId) throw new Error('No active tenant');

    // Generate compliance reports based on current data
    const [incidents, auditLogs] = await Promise.all([
      this.getSecurityIncidents(),
      this.getAuditLogs(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // Last 30 days
    ]);

    const gdprReport: ComplianceReport = {
      id: `gdpr_${Date.now()}`,
      framework: 'GDPR',
      period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      period_end: new Date().toISOString(),
      status: 'compliant',
      findings: [],
      recommendations: [],
      data_processed: auditLogs.filter(log => log.action.includes('data')).length,
      security_incidents: incidents.length,
      generated_at: new Date().toISOString(),
    };

    return [gdprReport];
  }

  async generateComplianceReport(framework: string): Promise<ComplianceReport> {
    const tenantId = MultiTenantService.getInstance().getCurrentTenantId();
    if (!tenantId) throw new Error('No active tenant');

    // This would generate a comprehensive compliance report
    // For now, return a basic report structure
    return {
      id: `${framework.toLowerCase()}_${Date.now()}`,
      framework: framework.toUpperCase(),
      period_start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      period_end: new Date().toISOString(),
      status: 'compliant',
      findings: [],
      recommendations: [],
      data_processed: 0,
      security_incidents: 0,
      generated_at: new Date().toISOString(),
    };
  }

  // Threat Detection
  async getThreatDetections(): Promise<ThreatDetection[]> {
    const tenantId = MultiTenantService.getInstance().getCurrentTenantId();
    if (!tenantId) throw new Error('No active tenant');

    const cacheKey = `threats_${tenantId}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const { data, error } = await supabase
      .from('threat_detections')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('detected_at', { ascending: false })
      .limit(100);

    if (error) throw new Error(`Failed to get threat detections: ${error.message}`);

    this.cache.set(cacheKey, data);
    return data;
  }

  async analyzeThreat(data: {
    source_ip: string;
    user_agent: string;
    request_path: string;
    payload?: any;
  }): Promise<ThreatDetection | null> {
    const tenantId = MultiTenantService.getInstance().getCurrentTenantId();
    if (!tenantId) throw new Error('No active tenant');

    // Basic threat analysis (in production, this would use ML models)
    const threats = this.detectThreats(data);
    
    if (threats.length > 0) {
      const threat: Omit<ThreatDetection, 'id'> = {
        tenant_id: tenantId,
        threat_type: threats[0].type,
        severity: threats[0].severity,
        source_ip: data.source_ip,
        user_agent: data.user_agent,
        description: threats[0].description,
        raw_data: data,
        status: 'detected',
        confidence_score: threats[0].confidence,
        detected_at: new Date().toISOString(),
      };

      const { data: savedThreat, error } = await supabase
        .from('threat_detections')
        .insert(threat)
        .select()
        .single();

      if (error) throw new Error(`Failed to save threat detection: ${error.message}`);

      this.invalidateCache('threats');
      await this.handleThreatResponse(savedThreat);
      
      return savedThreat;
    }

    return null;
  }

  private detectThreats(data: any): Array<{ type: string; severity: string; description: string; confidence: number }> {
    const threats = [];

    // SQL Injection detection
    if (data.payload && typeof data.payload === 'string') {
      const sqlPatterns = [
        /('|(\\')|(--)|(%7C)|(\*|%2A)|(;|%3B)|(@|%40)|(\||%7C)/i,
        /(union|select|insert|update|delete|drop|create|alter)/i
      ];
      
      if (sqlPatterns.some(pattern => pattern.test(data.payload))) {
        threats.push({
          type: 'sql_injection',
          severity: 'high',
          description: 'Potential SQL injection attempt detected',
          confidence: 0.8
        });
      }
    }

    // XSS detection
    if (data.request_path && /<script|javascript:|onerror=/i.test(data.request_path)) {
      threats.push({
        type: 'xss',
        severity: 'medium',
        description: 'Potential XSS attempt detected',
        confidence: 0.7
      });
    }

    // Suspicious user agent
    if (data.user_agent && (
      /bot|crawler|spider|scraper/i.test(data.user_agent) ||
      data.user_agent.length < 10 ||
      !data.user_agent.includes('Mozilla')
    )) {
      threats.push({
        type: 'suspicious_user_agent',
        severity: 'low',
        description: 'Suspicious user agent detected',
        confidence: 0.6
      });
    }

    return threats;
  }

  private async handleThreatResponse(threat: ThreatDetection): Promise<void> {
    // Create security incident for high-severity threats
    if (threat.severity === 'high' || threat.severity === 'critical') {
      await this.createSecurityIncident({
        type: 'threat_detected',
        severity: threat.severity,
        title: `Threat Detected: ${threat.threat_type}`,
        description: threat.description,
        source_ip: threat.source_ip,
        user_agent: threat.user_agent,
        status: 'open',
        priority: threat.severity === 'critical' ? 'high' : 'medium',
        metadata: threat.raw_data,
      });
    }

    // Log security event
    await this.logSecurityEvent('threat_detected', {
      threat_id: threat.id,
      threat_type: threat.threat_type,
      severity: threat.severity,
      source_ip: threat.source_ip,
    });
  }

  // Audit Logging
  async getAuditLogs(since: Date): Promise<any[]> {
    const tenantId = MultiTenantService.getInstance().getCurrentTenantId();
    if (!tenantId) throw new Error('No active tenant');

    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('tenant_id', tenantId)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to get audit logs: ${error.message}`);

    return data;
  }

  async logSecurityEvent(action: string, details: any): Promise<void> {
    const tenantId = MultiTenantService.getInstance().getCurrentTenantId();
    if (!tenantId) return;

    await supabase
      .from('audit_logs')
      .insert({
        tenant_id: tenantId,
        action,
        details,
        created_at: new Date().toISOString(),
      });
  }

  // Real-time Security Monitoring
  async startRealTimeMonitoring(): Promise<void> {
    const tenantId = MultiTenantService.getInstance().getCurrentTenantId();
    if (!tenantId) return;

    // Subscribe to security incidents
    const incidentsSubscription = supabase
      .channel(`security_incidents_${tenantId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'security_incidents',
        filter: `tenant_id=eq.${tenantId}`,
      }, (payload) => {
        this.handleRealTimeSecurityUpdate('incident', payload);
      })
      .subscribe();

    // Subscribe to threat detections
    const threatsSubscription = supabase
      .channel(`threat_detections_${tenantId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'threat_detections',
        filter: `tenant_id=eq.${tenantId}`,
      }, (payload) => {
        this.handleRealTimeSecurityUpdate('threat', payload);
      })
      .subscribe();

    this.realTimeSubscriptions.set('incidents', incidentsSubscription);
    this.realTimeSubscriptions.set('threats', threatsSubscription);
  }

  async stopRealTimeMonitoring(): Promise<void> {
    for (const [_key, subscription] of this.realTimeSubscriptions) {
      await supabase.removeChannel(subscription);
    }
    this.realTimeSubscriptions.clear();
  }

  private handleRealTimeSecurityUpdate(type: string, payload: any): void {
    // Invalidate caches
    this.invalidateCache(type === 'incident' ? 'incidents' : 'threats');
    
    // Emit events for UI updates
    window.dispatchEvent(new CustomEvent('securityUpdate', {
      detail: { type, payload }
    }));
  }

  // Security Alerts
  private async triggerSecurityAlert(incident: SecurityIncident): Promise<void> {
    // In production, this would send notifications via email, Slack, etc.
    console.warn('Security Alert:', incident);
    
    // For high-priority incidents, we might want to notify admins immediately
    if (incident.severity === 'critical') {
      // Send immediate notification
      await this.logSecurityEvent('critical_alert_sent', {
        incident_id: incident.id,
        notification_channels: ['email', 'slack'],
      });
    }
  }

  // Utility Functions
  private invalidateCache(pattern: string): void {
    for (const [key] of this.cache) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Security Metrics
  async getSecurityMetrics(): Promise<{
    totalIncidents: number;
    openIncidents: number;
    threatsDetected: number;
    complianceScore: number;
  }> {
    const [incidents, threats] = await Promise.all([
      this.getSecurityIncidents(),
      this.getThreatDetections()
    ]);

    return {
      totalIncidents: incidents.length,
      openIncidents: incidents.filter(i => i.status === 'open').length,
      threatsDetected: threats.length,
      complianceScore: 95, // This would be calculated based on actual compliance data
    };
  }
}
