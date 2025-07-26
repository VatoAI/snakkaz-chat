-- FASE 7 - Enterprise Multi-Tenant Database Schema
-- SnakkaZ Enterprise Features Database Setup

-- ================== TENANTS CORE TABLES ==================

-- Tenants table - Core tenant information
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'trial' CHECK (status IN ('active', 'suspended', 'trial', 'expired', 'pending')),
    
    -- Branding
    logo_url TEXT,
    favicon_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#3B82F6',
    secondary_color VARCHAR(7) DEFAULT '#1E40AF',
    accent_color VARCHAR(7) DEFAULT '#F59E0B',
    theme VARCHAR(10) DEFAULT 'auto' CHECK (theme IN ('light', 'dark', 'auto')),
    custom_css TEXT,
    company_name VARCHAR(255),
    support_email VARCHAR(255),
    terms_url TEXT,
    privacy_url TEXT,
    
    -- Settings
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'no',
    date_format VARCHAR(20) DEFAULT 'dd.mm.yyyy',
    currency VARCHAR(3) DEFAULT 'NOK',
    
    -- Security Settings
    enforce_2fa BOOLEAN DEFAULT false,
    session_timeout_minutes INTEGER DEFAULT 480,
    password_min_length INTEGER DEFAULT 8,
    password_require_uppercase BOOLEAN DEFAULT true,
    password_require_lowercase BOOLEAN DEFAULT true,
    password_require_numbers BOOLEAN DEFAULT true,
    password_require_symbols BOOLEAN DEFAULT false,
    password_max_age_days INTEGER DEFAULT 90,
    
    -- Notification Settings
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    webhook_url TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Tenant features and quotas
CREATE TABLE IF NOT EXISTS tenant_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Feature Flags
    sso_enabled BOOLEAN DEFAULT false,
    api_access BOOLEAN DEFAULT false,
    advanced_analytics BOOLEAN DEFAULT false,
    custom_integrations BOOLEAN DEFAULT false,
    white_label BOOLEAN DEFAULT false,
    priority_support BOOLEAN DEFAULT false,
    custom_domains BOOLEAN DEFAULT false,
    advanced_security BOOLEAN DEFAULT false,
    compliance_tools BOOLEAN DEFAULT false,
    custom_workflows BOOLEAN DEFAULT false,
    
    -- Resource Quotas
    max_users INTEGER DEFAULT 25,
    max_storage_gb INTEGER DEFAULT 10,
    max_api_requests_per_month INTEGER DEFAULT 10000,
    max_groups INTEGER DEFAULT 10,
    max_integrations INTEGER DEFAULT 3,
    retention_days INTEGER DEFAULT 90,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tenant billing information
CREATE TABLE IF NOT EXISTS tenant_billing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    plan_id VARCHAR(100) NOT NULL,
    plan_name VARCHAR(255) NOT NULL,
    billing_email VARCHAR(255) NOT NULL,
    billing_cycle VARCHAR(20) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual')),
    next_billing_date DATE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NOK',
    payment_method_id VARCHAR(255),
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business hours configuration
CREATE TABLE IF NOT EXISTS tenant_business_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Monday, 7=Sunday
    start_time TIME,
    end_time TIME,
    is_working_day BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, day_of_week)
);

-- IP whitelist for tenant security
CREATE TABLE IF NOT EXISTS tenant_ip_whitelist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    ip_address INET NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Allowed domains for tenant users
CREATE TABLE IF NOT EXISTS tenant_allowed_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    domain VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, domain)
);

-- ================== SSO INTEGRATION TABLES ==================

-- SSO Providers configuration
CREATE TABLE IF NOT EXISTS sso_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    type VARCHAR(50) NOT NULL CHECK (type IN ('saml', 'oauth2', 'ldap', 'openid_connect')),
    name VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT false,
    
    -- SAML Configuration
    saml_metadata_url TEXT,
    saml_certificate TEXT,
    saml_sign_requests BOOLEAN DEFAULT false,
    
    -- OAuth2/OpenID Configuration
    client_id VARCHAR(255),
    client_secret TEXT,
    authorization_url TEXT,
    token_url TEXT,
    userinfo_url TEXT,
    scopes TEXT[], -- Array of scopes
    
    -- LDAP Configuration
    ldap_url TEXT,
    ldap_bind_dn TEXT,
    ldap_bind_password TEXT,
    ldap_user_search_base TEXT,
    ldap_user_search_filter TEXT,
    ldap_group_search_base TEXT,
    ldap_group_search_filter TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SSO User attribute mapping
CREATE TABLE IF NOT EXISTS sso_user_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sso_provider_id UUID NOT NULL REFERENCES sso_providers(id) ON DELETE CASCADE,
    
    email_attribute VARCHAR(100) NOT NULL DEFAULT 'email',
    first_name_attribute VARCHAR(100) NOT NULL DEFAULT 'firstName',
    last_name_attribute VARCHAR(100) NOT NULL DEFAULT 'lastName',
    display_name_attribute VARCHAR(100) NOT NULL DEFAULT 'displayName',
    department_attribute VARCHAR(100),
    job_title_attribute VARCHAR(100),
    phone_attribute VARCHAR(100),
    avatar_url_attribute VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SSO Role mapping
CREATE TABLE IF NOT EXISTS sso_role_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sso_provider_id UUID NOT NULL REFERENCES sso_providers(id) ON DELETE CASCADE,
    
    admin_groups TEXT[], -- Array of group names that map to admin role
    user_groups TEXT[], -- Array of group names that map to user role
    default_role VARCHAR(50) DEFAULT 'user' CHECK (default_role IN ('admin', 'manager', 'user', 'viewer', 'guest')),
    group_attribute VARCHAR(100) DEFAULT 'groups',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================== BUSINESS INTELLIGENCE TABLES ==================

-- BI Dashboards
CREATE TABLE IF NOT EXISTS bi_dashboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    layout_columns INTEGER DEFAULT 12,
    layout_row_height INTEGER DEFAULT 50,
    layout_margin_x INTEGER DEFAULT 10,
    layout_margin_y INTEGER DEFAULT 10,
    layout_container_padding_x INTEGER DEFAULT 10,
    layout_container_padding_y INTEGER DEFAULT 10,
    refresh_interval INTEGER DEFAULT 300, -- seconds
    is_public BOOLEAN DEFAULT false,
    
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BI Dashboard Widgets
CREATE TABLE IF NOT EXISTS bi_widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dashboard_id UUID NOT NULL REFERENCES bi_dashboards(id) ON DELETE CASCADE,
    
    type VARCHAR(50) NOT NULL CHECK (type IN ('metric_card', 'line_chart', 'bar_chart', 'pie_chart', 'table', 'heatmap', 'funnel', 'gauge', 'timeline')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Data Source
    data_source_type VARCHAR(50) DEFAULT 'realtime' CHECK (data_source_type IN ('realtime', 'batch', 'api')),
    data_source_query TEXT NOT NULL,
    refresh_rate INTEGER DEFAULT 60, -- seconds
    cache_ttl INTEGER DEFAULT 300, -- seconds
    
    -- Configuration
    metrics TEXT[], -- Array of metric names
    dimensions TEXT[], -- Array of dimension names
    aggregation VARCHAR(50) DEFAULT 'count' CHECK (aggregation IN ('sum', 'avg', 'count', 'min', 'max', 'distinct')),
    colors TEXT[], -- Array of color hex codes
    
    -- Position and Size
    position_x INTEGER NOT NULL DEFAULT 0,
    position_y INTEGER NOT NULL DEFAULT 0,
    size_width INTEGER NOT NULL DEFAULT 4,
    size_height INTEGER NOT NULL DEFAULT 2,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BI Widget Thresholds
CREATE TABLE IF NOT EXISTS bi_widget_thresholds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    widget_id UUID NOT NULL REFERENCES bi_widgets(id) ON DELETE CASCADE,
    
    value DECIMAL(15,4) NOT NULL,
    color VARCHAR(7) NOT NULL,
    operator VARCHAR(10) NOT NULL CHECK (operator IN ('gt', 'gte', 'lt', 'lte', 'eq')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BI Dashboard Filters
CREATE TABLE IF NOT EXISTS bi_dashboard_filters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dashboard_id UUID NOT NULL REFERENCES bi_dashboards(id) ON DELETE CASCADE,
    
    field VARCHAR(255) NOT NULL,
    operator VARCHAR(50) NOT NULL CHECK (operator IN ('equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with', 'greater_than', 'less_than', 'between', 'in', 'not_in')),
    value JSONB NOT NULL,
    label VARCHAR(255) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BI Report Exports
CREATE TABLE IF NOT EXISTS bi_report_exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dashboard_id UUID NOT NULL REFERENCES bi_dashboards(id) ON DELETE CASCADE,
    
    format VARCHAR(20) NOT NULL CHECK (format IN ('pdf', 'excel', 'csv', 'json')),
    schedule_frequency VARCHAR(20) CHECK (schedule_frequency IN ('daily', 'weekly', 'monthly')),
    schedule_time TIME,
    schedule_timezone VARCHAR(50),
    recipients TEXT[], -- Array of email addresses
    template VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================== API GATEWAY TABLES ==================

-- API Gateways
CREATE TABLE IF NOT EXISTS api_gateways (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    base_url TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'disabled')),
    
    -- Rate Limiting
    rate_limit_requests_per_minute INTEGER DEFAULT 100,
    rate_limit_requests_per_hour INTEGER DEFAULT 1000,
    rate_limit_requests_per_day INTEGER DEFAULT 10000,
    rate_limit_burst_limit INTEGER DEFAULT 50,
    rate_limit_per_tenant BOOLEAN DEFAULT true,
    rate_limit_per_user BOOLEAN DEFAULT true,
    rate_limit_per_ip BOOLEAN DEFAULT true,
    
    -- Authentication
    require_api_key BOOLEAN DEFAULT true,
    require_jwt BOOLEAN DEFAULT false,
    jwt_secret TEXT,
    api_key_header VARCHAR(100) DEFAULT 'X-API-Key',
    cors_enabled BOOLEAN DEFAULT true,
    allowed_origins TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Routes
CREATE TABLE IF NOT EXISTS api_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_gateway_id UUID NOT NULL REFERENCES api_gateways(id) ON DELETE CASCADE,
    
    path VARCHAR(500) NOT NULL,
    method VARCHAR(10) NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS')),
    handler VARCHAR(255) NOT NULL,
    middleware TEXT[], -- Array of middleware names
    cache_ttl INTEGER,
    require_auth BOOLEAN DEFAULT true,
    
    -- Route-specific rate limiting (overrides gateway defaults)
    rate_limit_override_requests_per_minute INTEGER,
    rate_limit_override_requests_per_hour INTEGER,
    rate_limit_override_requests_per_day INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(api_gateway_id, path, method)
);

-- API Keys
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    
    name VARCHAR(255) NOT NULL,
    key_hash TEXT NOT NULL UNIQUE, -- Hashed version of the API key
    key_prefix VARCHAR(20) NOT NULL, -- First few characters for identification
    scopes TEXT[], -- Array of allowed scopes
    expires_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- API Metrics
CREATE TABLE IF NOT EXISTS api_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_gateway_id UUID NOT NULL REFERENCES api_gateways(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    
    date DATE NOT NULL,
    hour INTEGER NOT NULL CHECK (hour BETWEEN 0 AND 23),
    
    total_requests INTEGER DEFAULT 0,
    successful_requests INTEGER DEFAULT 0,
    failed_requests INTEGER DEFAULT 0,
    rate_limit_hits INTEGER DEFAULT 0,
    average_response_time_ms DECIMAL(10,2) DEFAULT 0,
    bandwidth_bytes BIGINT DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(api_gateway_id, tenant_id, date, hour)
);

-- Webhook Endpoints
CREATE TABLE IF NOT EXISTS webhook_endpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    url TEXT NOT NULL,
    events TEXT[] NOT NULL, -- Array of event types
    secret VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT true,
    retry_attempts INTEGER DEFAULT 3,
    timeout_seconds INTEGER DEFAULT 30,
    headers JSONB, -- Custom headers as JSON
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhook Deliveries
CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_endpoint_id UUID NOT NULL REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
    
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'failed', 'retrying')),
    attempts INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    response_status INTEGER,
    response_body TEXT,
    error_message TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- ================== SECURITY SUITE TABLES ==================

-- DLP Rules
CREATE TABLE IF NOT EXISTS dlp_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    pattern TEXT NOT NULL, -- Regex pattern
    action VARCHAR(20) NOT NULL CHECK (action IN ('block', 'quarantine', 'alert', 'encrypt', 'redact')),
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    enabled BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Compliance Frameworks
CREATE TABLE IF NOT EXISTS compliance_frameworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('compliant', 'non_compliant', 'partial', 'pending')),
    last_audit DATE,
    next_audit DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance Requirements
CREATE TABLE IF NOT EXISTS compliance_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    compliance_framework_id UUID NOT NULL REFERENCES compliance_frameworks(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('compliant', 'non_compliant', 'partial', 'pending')),
    evidence TEXT[], -- Array of evidence file URLs or descriptions
    remediation TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security Incidents
CREATE TABLE IF NOT EXISTS security_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
    
    -- Incident Details
    incident_type VARCHAR(100),
    source_ip INET,
    affected_user_id UUID REFERENCES auth.users(id),
    detection_method VARCHAR(100),
    
    -- Response
    assigned_to UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security Playbooks
CREATE TABLE IF NOT EXISTS security_playbooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    trigger_conditions TEXT[], -- Array of condition strings
    assignee_role VARCHAR(50) NOT NULL,
    sla_minutes INTEGER DEFAULT 240, -- 4 hours default SLA
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security Playbook Steps
CREATE TABLE IF NOT EXISTS security_playbook_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playbook_id UUID NOT NULL REFERENCES security_playbooks(id) ON DELETE CASCADE,
    
    step_order INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    automated BOOLEAN DEFAULT false,
    script TEXT, -- Automation script if automated
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Threat Detection Events
CREATE TABLE IF NOT EXISTS threat_detection_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    event_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
    
    -- Event Details
    source_ip INET,
    user_id UUID REFERENCES auth.users(id),
    details JSONB,
    raw_data JSONB,
    
    -- ML Model Information
    detected_by_model VARCHAR(255),
    model_version VARCHAR(50),
    
    -- Response
    blocked BOOLEAN DEFAULT false,
    investigated BOOLEAN DEFAULT false,
    false_positive BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================== INDEXES FOR PERFORMANCE ==================

-- Tenant-related indexes
CREATE INDEX IF NOT EXISTS idx_tenants_domain ON tenants(domain);
CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON tenants(subdomain);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);

-- SSO indexes
CREATE INDEX IF NOT EXISTS idx_sso_providers_tenant ON sso_providers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sso_providers_type ON sso_providers(type, enabled);

-- BI indexes
CREATE INDEX IF NOT EXISTS idx_bi_dashboards_tenant ON bi_dashboards(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bi_widgets_dashboard ON bi_widgets(dashboard_id);

-- API Gateway indexes
CREATE INDEX IF NOT EXISTS idx_api_gateways_tenant ON api_gateways(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_routes_gateway ON api_routes(api_gateway_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_tenant ON api_keys(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_metrics_date ON api_metrics(date, hour);

-- Security indexes
CREATE INDEX IF NOT EXISTS idx_security_incidents_tenant ON security_incidents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_security_incidents_status ON security_incidents(status);
CREATE INDEX IF NOT EXISTS idx_threat_detection_tenant ON threat_detection_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_threat_detection_severity ON threat_detection_events(severity);

-- ================== ROW LEVEL SECURITY (RLS) ==================

-- Enable RLS on all tenant-related tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_ip_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_allowed_domains ENABLE ROW LEVEL SECURITY;

ALTER TABLE sso_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sso_user_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sso_role_mappings ENABLE ROW LEVEL SECURITY;

ALTER TABLE bi_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE bi_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bi_widget_thresholds ENABLE ROW LEVEL SECURITY;
ALTER TABLE bi_dashboard_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE bi_report_exports ENABLE ROW LEVEL SECURITY;

ALTER TABLE api_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;

ALTER TABLE dlp_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_playbook_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE threat_detection_events ENABLE ROW LEVEL SECURITY;

-- ================== FUNCTIONS AND TRIGGERS ==================

-- Function to get current user's tenant_id
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID
LANGUAGE SQL
STABLE
AS $$
    SELECT 
        CASE 
            WHEN current_setting('app.current_tenant_id', true) IS NOT NULL 
            THEN current_setting('app.current_tenant_id')::UUID
            ELSE NULL
        END;
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tenant_features_updated_at BEFORE UPDATE ON tenant_features FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tenant_billing_updated_at BEFORE UPDATE ON tenant_billing FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sso_providers_updated_at BEFORE UPDATE ON sso_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sso_user_mappings_updated_at BEFORE UPDATE ON sso_user_mappings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sso_role_mappings_updated_at BEFORE UPDATE ON sso_role_mappings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bi_dashboards_updated_at BEFORE UPDATE ON bi_dashboards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bi_widgets_updated_at BEFORE UPDATE ON bi_widgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_gateways_updated_at BEFORE UPDATE ON api_gateways FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_routes_updated_at BEFORE UPDATE ON api_routes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_webhook_endpoints_updated_at BEFORE UPDATE ON webhook_endpoints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dlp_rules_updated_at BEFORE UPDATE ON dlp_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_frameworks_updated_at BEFORE UPDATE ON compliance_frameworks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_requirements_updated_at BEFORE UPDATE ON compliance_requirements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_security_incidents_updated_at BEFORE UPDATE ON security_incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_security_playbooks_updated_at BEFORE UPDATE ON security_playbooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================== SAMPLE DATA FOR DEVELOPMENT ==================

-- Insert default enterprise features for new tenants
CREATE OR REPLACE FUNCTION create_default_tenant_features()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO tenant_features (tenant_id) VALUES (NEW.id);
    
    -- Create default business hours (Monday to Friday, 9-17)
    INSERT INTO tenant_business_hours (tenant_id, day_of_week, start_time, end_time, is_working_day) VALUES
    (NEW.id, 1, '09:00', '17:00', true),  -- Monday
    (NEW.id, 2, '09:00', '17:00', true),  -- Tuesday
    (NEW.id, 3, '09:00', '17:00', true),  -- Wednesday
    (NEW.id, 4, '09:00', '17:00', true),  -- Thursday
    (NEW.id, 5, '09:00', '17:00', true),  -- Friday
    (NEW.id, 6, null, null, false),       -- Saturday
    (NEW.id, 7, null, null, false);       -- Sunday
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create default features when tenant is created
CREATE TRIGGER create_tenant_defaults_trigger
    AFTER INSERT ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION create_default_tenant_features();

-- ================== ENTERPRISE ANALYTICS VIEWS ==================

-- Tenant metrics view
CREATE OR REPLACE VIEW tenant_metrics AS
SELECT 
    COUNT(*) as total_tenants,
    COUNT(*) FILTER (WHERE status = 'active') as active_tenants,
    COUNT(*) FILTER (WHERE status = 'trial') as trial_tenants,
    COUNT(*) FILTER (WHERE status = 'expired' OR status = 'suspended') as churned_tenants,
    ROUND(AVG(
        (SELECT COUNT(*) FROM auth.users u 
         JOIN profiles p ON p.id = u.id 
         WHERE p.tenant_id = t.id)
    ), 2) as average_users_per_tenant
FROM tenants t;

-- Security metrics view
CREATE OR REPLACE VIEW security_metrics AS
SELECT 
    COUNT(*) as total_incidents,
    COUNT(*) FILTER (WHERE severity = 'critical') as critical_incidents,
    COUNT(*) FILTER (WHERE severity = 'high') as high_severity_incidents,
    COUNT(*) FILTER (WHERE status = 'open') as open_incidents,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as incidents_last_24h,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as incidents_last_7d
FROM security_incidents;

-- API usage metrics view
CREATE OR REPLACE VIEW api_usage_metrics AS
SELECT 
    ag.tenant_id,
    t.name as tenant_name,
    SUM(am.total_requests) as total_requests,
    SUM(am.successful_requests) as successful_requests,
    SUM(am.failed_requests) as failed_requests,
    ROUND(AVG(am.average_response_time_ms), 2) as avg_response_time_ms,
    SUM(am.bandwidth_bytes) as total_bandwidth_bytes
FROM api_metrics am
JOIN api_gateways ag ON am.api_gateway_id = ag.id
JOIN tenants t ON ag.tenant_id = t.id
WHERE am.date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY ag.tenant_id, t.name;

-- Comments for documentation
COMMENT ON TABLE tenants IS 'Core tenant information for multi-tenant architecture';
COMMENT ON TABLE tenant_features IS 'Feature flags and resource quotas per tenant';
COMMENT ON TABLE tenant_billing IS 'Billing and subscription information per tenant';
COMMENT ON TABLE sso_providers IS 'SSO provider configurations for enterprise authentication';
COMMENT ON TABLE bi_dashboards IS 'Business Intelligence dashboards for analytics';
COMMENT ON TABLE api_gateways IS 'API gateway configurations for tenant API access';
COMMENT ON TABLE security_incidents IS 'Security incident tracking and management';
COMMENT ON TABLE threat_detection_events IS 'AI-powered threat detection events';

COMMIT;
