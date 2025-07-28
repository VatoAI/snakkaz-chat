/**
 * FASE 7 - Enterprise Types and Interfaces
 * 
 * Core TypeScript interfaces for enterprise-grade features
 * Multi-tenant architecture, SSO, BI Dashboard, API Gateway, Security Suite
 */

import { Json } from '@/types/supabase';

// ================== MULTI-TENANT ARCHITECTURE ==================

export interface TenantConfig {
  id: string;
  name: string;
  domain: string;
  subdomain: string;
  branding: TenantBranding;
  features: FeatureFlags;
  quotas: ResourceQuotas;
  billing: BillingInfo;
  settings: TenantSettings;
  status: TenantStatus;
  created_at: string;
  updated_at: string;
}

export interface TenantBranding {
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  theme: 'light' | 'dark' | 'auto';
  custom_css: string | null;
  company_name: string;
  support_email: string;
  terms_url: string | null;
  privacy_url: string | null;
}

export interface FeatureFlags {
  sso_enabled: boolean;
  api_access: boolean;
  advanced_analytics: boolean;
  custom_integrations: boolean;
  white_label: boolean;
  priority_support: boolean;
  custom_domains: boolean;
  advanced_security: boolean;
  compliance_tools: boolean;
  custom_workflows: boolean;
}

export interface ResourceQuotas {
  max_users: number;
  max_storage_gb: number;
  max_api_requests_per_month: number;
  max_groups: number;
  max_integrations: number;
  retention_days: number;
}

export interface BillingInfo {
  plan_id: string;
  plan_name: string;
  billing_email: string;
  billing_cycle: 'monthly' | 'annual';
  next_billing_date: string;
  amount: number;
  currency: string;
  payment_method_id: string | null;
  trial_ends_at: string | null;
}

export interface TenantSettings {
  timezone: string;
  language: string;
  date_format: string;
  currency: string;
  business_hours: BusinessHours;
  security_settings: TenantSecuritySettings;
  notification_settings: TenantNotificationSettings;
}

export interface BusinessHours {
  monday: TimeRange;
  tuesday: TimeRange;
  wednesday: TimeRange;
  thursday: TimeRange;
  friday: TimeRange;
  saturday: TimeRange | null;
  sunday: TimeRange | null;
}

export interface TimeRange {
  start: string; // HH:MM format
  end: string;   // HH:MM format
}

export interface TenantSecuritySettings {
  enforce_2fa: boolean;
  session_timeout_minutes: number;
  password_policy: PasswordPolicy;
  ip_whitelist: string[];
  allowed_domains: string[];
}

export interface PasswordPolicy {
  min_length: number;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_numbers: boolean;
  require_symbols: boolean;
  max_age_days: number;
}

export interface TenantNotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  webhook_url: string | null;
  notification_channels: string[];
}

export type TenantStatus = 'active' | 'suspended' | 'trial' | 'expired' | 'pending';

// ================== SSO INTEGRATION ==================

export interface SSOProvider {
  id: string;
  tenant_id: string;
  type: SSOType;
  name: string;
  config: SSOConfig;
  user_mapping: UserAttributeMapping;
  role_mapping: RoleMapping;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export type SSOType = 'saml' | 'oauth2' | 'ldap' | 'openid_connect';

export interface SSOConfig {
  // SAML Configuration
  saml_metadata_url?: string;
  saml_certificate?: string;
  saml_sign_requests?: boolean;
  
  // OAuth2/OpenID Configuration
  client_id?: string;
  client_secret?: string;
  authorization_url?: string;
  token_url?: string;
  userinfo_url?: string;
  scopes?: string[];
  
  // LDAP Configuration
  ldap_url?: string;
  ldap_bind_dn?: string;
  ldap_bind_password?: string;
  ldap_user_search_base?: string;
  ldap_user_search_filter?: string;
  ldap_group_search_base?: string;
  ldap_group_search_filter?: string;
}

export interface UserAttributeMapping {
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  department?: string;
  job_title?: string;
  phone?: string;
  avatar_url?: string;
}

export interface RoleMapping {
  admin_groups: string[];
  user_groups: string[];
  default_role: UserRole;
  group_attribute: string;
}

export type UserRole = 'admin' | 'manager' | 'user' | 'viewer' | 'guest';

// ================== BUSINESS INTELLIGENCE ==================

export interface BIDashboard {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  layout: DashboardLayout;
  filters: AnalyticsFilter[];
  refresh_interval: number;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  description: string;
  data_source: DataSource;
  configuration: WidgetConfiguration;
  position: WidgetPosition;
  size: WidgetSize;
}

export type WidgetType = 
  | 'metric_card' 
  | 'line_chart' 
  | 'bar_chart' 
  | 'pie_chart' 
  | 'table' 
  | 'heatmap' 
  | 'funnel' 
  | 'gauge' 
  | 'timeline';

export interface DataSource {
  type: 'realtime' | 'batch' | 'api';
  query: string;
  refresh_rate: number;
  cache_ttl: number;
}

export interface WidgetConfiguration {
  metrics: string[];
  dimensions: string[];
  aggregation: AggregationType;
  time_range: TimeRange;
  colors: string[];
  thresholds?: Threshold[];
}

export type AggregationType = 'sum' | 'avg' | 'count' | 'min' | 'max' | 'distinct';

export interface Threshold {
  value: number;
  color: string;
  operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq';
}

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface WidgetSize {
  width: number;
  height: number;
}

export interface DashboardLayout {
  columns: number;
  row_height: number;
  margin: [number, number];
  container_padding: [number, number];
}

export interface AnalyticsFilter {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
  label: string;
}

export type FilterOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains' 
  | 'starts_with' 
  | 'ends_with' 
  | 'greater_than' 
  | 'less_than' 
  | 'between' 
  | 'in' 
  | 'not_in';

export interface ReportExport {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  schedule?: ExportSchedule;
  recipients: string[];
  template: string;
}

export interface ExportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  timezone: string;
}

export interface WebSocketMetrics {
  active_connections: number;
  messages_per_second: number;
  average_response_time: number;
  error_rate: number;
}

// ================== API GATEWAY ==================

export interface APIGateway {
  id: string;
  tenant_id: string;
  name: string;
  base_url: string;
  rate_limit: RateLimitConfig;
  authentication: APIAuthConfig;
  monitoring: APIMetrics;
  webhooks: WebhookEndpoint[];
  routes: APIRoute[];
  status: 'active' | 'maintenance' | 'disabled';
  created_at: string;
  updated_at: string;
}

export interface RateLimitConfig {
  requests_per_minute: number;
  requests_per_hour: number;
  requests_per_day: number;
  burst_limit: number;
  per_tenant: boolean;
  per_user: boolean;
  per_ip: boolean;
}

export interface APIAuthConfig {
  require_api_key: boolean;
  require_jwt: boolean;
  jwt_secret: string;
  api_key_header: string;
  allowed_origins: string[];
  cors_enabled: boolean;
}

export interface APIMetrics {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  average_response_time: number;
  rate_limit_hits: number;
  last_24h_requests: number;
  bandwidth_used: number;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  secret: string;
  enabled: boolean;
  retry_attempts: number;
  timeout_seconds: number;
  headers: Record<string, string>;
}

export interface APIRoute {
  id: string;
  api_gateway_id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  upstream_url: string;
  timeout_ms?: number;
  retry_count?: number;
  cache_ttl?: number;
  auth_required?: boolean;
  rate_limit?: APIRateLimit;
  transformations?: {
    request?: Record<string, any>;
    response?: Record<string, any>;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface APIKey {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  key?: string; // Only returned when creating, never stored in plain text
  key_hash: string;
  permissions: string[];
  rate_limit: APIRateLimit;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  last_used_at?: string;
}

export interface APIRateLimit {
  requests: number;
  window: 'minute' | 'hour' | 'day';
}

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

// ================== ADVANCED SECURITY ==================

export interface SecuritySuite {
  id: string;
  tenant_id: string;
  dlp: DLPRules[];
  compliance: ComplianceFramework[];
  audit: AuditLogger;
  incidents: IncidentResponse;
  threat_detection: ThreatDetection;
  access_control: AccessControl;
  encryption: EncryptionConfig;
}

export interface DLPRules {
  id: string;
  name: string;
  description: string;
  pattern: string;
  action: DLPAction;
  severity: SecuritySeverity;
  enabled: boolean;
}

export type DLPAction = 'block' | 'quarantine' | 'alert' | 'encrypt' | 'redact';
export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  requirements: ComplianceRequirement[];
  status: ComplianceStatus;
  last_audit: string;
  next_audit: string;
}

export type ComplianceStatus = 'compliant' | 'non_compliant' | 'partial' | 'pending';

export interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  status: ComplianceStatus;
  evidence: string[];
  remediation: string;
}

export interface AuditLogger {
  retention_days: number;
  log_level: LogLevel;
  include_ip: boolean;
  include_user_agent: boolean;
  encrypted: boolean;
  real_time_alerts: boolean;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export interface IncidentResponse {
  playbooks: SecurityPlaybook[];
  escalation_rules: EscalationRule[];
  notification_channels: NotificationChannel[];
  automated_responses: AutomatedResponse[];
}

export interface SecurityPlaybook {
  id: string;
  name: string;
  trigger_conditions: string[];
  steps: PlaybookStep[];
  assignee_role: string;
  sla_minutes: number;
}

export interface PlaybookStep {
  id: string;
  order: number;
  title: string;
  description: string;
  automated: boolean;
  script?: string;
}

export interface EscalationRule {
  id: string;
  trigger_after_minutes: number;
  escalate_to_role: string;
  notification_method: string;
}

export interface NotificationChannel {
  id: string;
  type: 'email' | 'sms' | 'slack' | 'webhook';
  endpoint: string;
  events: string[];
}

export interface AutomatedResponse {
  id: string;
  trigger_event: string;
  action: 'block_ip' | 'disable_user' | 'quarantine_file' | 'alert_admin';
  parameters: Record<string, any>;
}

export interface ThreatDetection {
  ai_enabled: boolean;
  ml_models: MLModel[];
  behavioral_analysis: boolean;
  anomaly_detection: boolean;
  threat_intelligence: boolean;
  real_time_scanning: boolean;
}

export interface MLModel {
  id: string;
  name: string;
  type: 'classification' | 'anomaly' | 'prediction';
  accuracy: number;
  last_trained: string;
  enabled: boolean;
}

export interface AccessControl {
  rbac_enabled: boolean;
  abac_enabled: boolean;
  roles: SecurityRole[];
  policies: AccessPolicy[];
  session_management: SessionManagement;
}

export interface SecurityRole {
  id: string;
  name: string;
  permissions: Permission[];
  inherits_from: string[];
}

export interface Permission {
  resource: string;
  actions: string[];
  conditions?: string;
}

export interface AccessPolicy {
  id: string;
  name: string;
  effect: 'allow' | 'deny';
  subjects: string[];
  resources: string[];
  actions: string[];
  conditions: string;
}

export interface SessionManagement {
  max_concurrent_sessions: number;
  idle_timeout_minutes: number;
  absolute_timeout_hours: number;
  require_reauth_for_sensitive: boolean;
}

export interface EncryptionConfig {
  algorithm: string;
  key_size: number;
  key_rotation_days: number;
  encrypt_at_rest: boolean;
  encrypt_in_transit: boolean;
  hsm_enabled: boolean;
}

// ================== ANALYTICS & METRICS ==================

export interface EnterpriseMetrics {
  tenant_metrics: TenantMetrics;
  user_metrics: UserMetrics;
  security_metrics: SecurityMetrics;
  performance_metrics: PerformanceMetrics;
  business_metrics: BusinessMetrics;
}

export interface TenantMetrics {
  total_tenants: number;
  active_tenants: number;
  trial_tenants: number;
  churned_tenants: number;
  average_users_per_tenant: number;
  revenue_per_tenant: number;
}

export interface UserMetrics {
  total_users: number;
  active_users_daily: number;
  active_users_weekly: number;
  active_users_monthly: number;
  new_signups: number;
  user_retention_rate: number;
}

export interface SecurityMetrics {
  security_incidents: number;
  blocked_attacks: number;
  compliance_score: number;
  failed_login_attempts: number;
  suspicious_activities: number;
}

export interface PerformanceMetrics {
  average_response_time: number;
  uptime_percentage: number;
  error_rate: number;
  throughput_requests_per_second: number;
  database_performance: number;
}

export interface BusinessMetrics {
  total_revenue: number;
  monthly_recurring_revenue: number;
  customer_acquisition_cost: number;
  customer_lifetime_value: number;
  churn_rate: number;
  net_promoter_score: number;
}

// ================== UTILITY TYPES ==================

export interface EnterpriseResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  meta?: {
    pagination?: PaginationMeta;
    filters?: Record<string, any>;
    timestamp: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface EnterpriseError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  tenant_id?: string;
  user_id?: string;
  request_id?: string;
}

export type EnterpriseEventType = 
  | 'tenant.created'
  | 'tenant.updated'
  | 'tenant.suspended'
  | 'user.sso_login'
  | 'security.incident'
  | 'compliance.violation'
  | 'api.rate_limit_exceeded'
  | 'billing.payment_failed'
  | 'integration.webhook_failed';

export interface EnterpriseEvent {
  id: string;
  type: EnterpriseEventType;
  tenant_id: string;
  user_id?: string;
  data: Record<string, any>;
  metadata: {
    source: string;
    ip_address?: string;
    user_agent?: string;
    correlation_id?: string;
  };
  created_at: string;
}
