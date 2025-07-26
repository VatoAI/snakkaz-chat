#!/bin/bash

# FASE 7 - Enterprise Demo Data Generator
# Creates realistic demo data for testing enterprise features

set -e

echo "🎭 FASE 7 - Generating Enterprise Demo Data..."

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first."
    exit 1
fi

echo "📊 Creating demo tenants and users..."

# Generate demo data SQL
cat << 'EOF' | supabase sql
-- Generate Enterprise Demo Data

-- Create additional demo tenants
INSERT INTO tenants (
    id,
    name,
    domain,
    subdomain,
    company_name,
    support_email,
    status
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'TechCorp Enterprise',
    'techcorp.snakkaz.com',
    'techcorp',
    'TechCorp Solutions Inc.',
    'support@techcorp.com',
    'active'
),
(
    '22222222-2222-2222-2222-222222222222',
    'Healthcare Plus',
    'healthplus.snakkaz.com',
    'healthplus',
    'Healthcare Plus Medical Center',
    'it@healthplus.com',
    'active'
),
(
    '33333333-3333-3333-3333-333333333333',
    'FinanceSecure',
    'financesecure.snakkaz.com',
    'financesecure',
    'FinanceSecure Banking Corp',
    'security@financesecure.com',
    'trial'
) ON CONFLICT (id) DO NOTHING;

-- Configure tenant features for each demo tenant
INSERT INTO tenant_features (
    tenant_id,
    sso_enabled,
    api_access,
    advanced_analytics,
    custom_integrations,
    white_label,
    priority_support,
    custom_domains,
    advanced_security,
    compliance_tools,
    custom_workflows,
    max_users,
    max_storage_gb,
    max_api_requests_per_month
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    true, true, true, true, true, true, true, true, true, true,
    500, 50, 500000
),
(
    '22222222-2222-2222-2222-222222222222',
    true, true, true, false, true, true, true, true, true, false,
    200, 25, 250000
),
(
    '33333333-3333-3333-3333-333333333333',
    false, true, false, false, false, false, false, true, false, false,
    50, 10, 100000
) ON CONFLICT (tenant_id) DO UPDATE SET
    sso_enabled = EXCLUDED.sso_enabled,
    api_access = EXCLUDED.api_access,
    advanced_analytics = EXCLUDED.advanced_analytics,
    custom_integrations = EXCLUDED.custom_integrations,
    white_label = EXCLUDED.white_label,
    priority_support = EXCLUDED.priority_support,
    custom_domains = EXCLUDED.custom_domains,
    advanced_security = EXCLUDED.advanced_security,
    compliance_tools = EXCLUDED.compliance_tools,
    custom_workflows = EXCLUDED.custom_workflows,
    max_users = EXCLUDED.max_users,
    max_storage_gb = EXCLUDED.max_storage_gb,
    max_api_requests_per_month = EXCLUDED.max_api_requests_per_month;

-- Create SSO providers for demo tenants
INSERT INTO sso_providers (
    tenant_id,
    name,
    type,
    is_active,
    config
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'TechCorp Azure AD',
    'azure_ad',
    true,
    '{"client_id": "demo-client-id", "tenant_id": "demo-tenant-id", "domain": "techcorp.com"}'::jsonb
),
(
    '22222222-2222-2222-2222-222222222222',
    'HealthPlus SAML',
    'saml',
    true,
    '{"entity_id": "healthplus-saml", "sso_url": "https://healthplus.com/sso", "certificate": "demo-cert"}'::jsonb
) ON CONFLICT DO NOTHING;

-- Create API gateways for demo tenants
INSERT INTO api_gateways (
    tenant_id,
    name,
    base_url,
    status,
    rate_limit,
    authentication,
    monitoring
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'TechCorp API Gateway',
    'https://api.techcorp.snakkaz.com',
    'active',
    '{"requests_per_minute": 1000, "requests_per_hour": 50000, "requests_per_day": 1000000, "burst_limit": 2000, "per_tenant": true, "per_user": false, "per_ip": true}'::jsonb,
    '{"require_api_key": true, "require_jwt": false, "jwt_secret": "", "api_key_header": "X-API-Key", "allowed_origins": ["https://techcorp.com", "https://app.techcorp.com"]}'::jsonb,
    '{"total_requests": 45000, "error_rate": 0.02, "average_response_time_ms": 120, "uptime_percentage": 99.8}'::jsonb
),
(
    '22222222-2222-2222-2222-222222222222',
    'HealthPlus Secure API',
    'https://api.healthplus.snakkaz.com',
    'active',
    '{"requests_per_minute": 500, "requests_per_hour": 25000, "requests_per_day": 500000, "burst_limit": 1000, "per_tenant": true, "per_user": true, "per_ip": true}'::jsonb,
    '{"require_api_key": true, "require_jwt": true, "jwt_secret": "demo-jwt-secret", "api_key_header": "Authorization", "allowed_origins": ["https://healthplus.com"]}'::jsonb,
    '{"total_requests": 12000, "error_rate": 0.01, "average_response_time_ms": 95, "uptime_percentage": 99.9}'::jsonb
) ON CONFLICT DO NOTHING;

-- Create BI dashboards for demo tenants
INSERT INTO bi_dashboards (
    id,
    tenant_id,
    name,
    description,
    is_public
) VALUES 
(
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'TechCorp Executive Dashboard',
    'High-level KPIs and metrics for TechCorp leadership team',
    false
),
(
    '55555555-5555-5555-5555-555555555555',
    '22222222-2222-2222-2222-222222222222',
    'HealthPlus Patient Analytics',
    'Patient engagement and care quality metrics',
    false
),
(
    '66666666-6666-6666-6666-666666666666',
    '33333333-3333-3333-3333-333333333333',
    'FinanceSecure Risk Dashboard',
    'Financial risk and compliance monitoring',
    false
) ON CONFLICT (id) DO NOTHING;

-- Create demo security incidents
INSERT INTO security_incidents (
    tenant_id,
    type,
    severity,
    title,
    description,
    source_ip,
    user_agent,
    status,
    priority,
    metadata
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'login_anomaly',
    'medium',
    'Unusual Login Pattern Detected',
    'Multiple failed login attempts from new location',
    '192.168.1.100',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'resolved',
    'medium',
    '{"failed_attempts": 5, "location": "New York, US", "device": "Windows PC"}'::jsonb
),
(
    '22222222-2222-2222-2222-222222222222',
    'data_access',
    'high',
    'Unauthorized Data Access Attempt',
    'Attempt to access patient records without proper authorization',
    '10.0.0.25',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'open',
    'high',
    '{"user_id": "user-123", "resource": "patient_records", "timestamp": "2025-01-14T10:30:00Z"}'::jsonb
),
(
    '33333333-3333-3333-3333-333333333333',
    'api_abuse',
    'critical',
    'API Rate Limit Exceeded',
    'Sustained API abuse detected - possible DDoS attempt',
    '203.0.113.45',
    'curl/7.68.0',
    'investigating',
    'high',
    '{"requests_per_minute": 5000, "endpoint": "/api/transactions", "duration_minutes": 15}'::jsonb
) ON CONFLICT DO NOTHING;

-- Create DLP rules for demo tenants
INSERT INTO dlp_rules (
    tenant_id,
    name,
    description,
    pattern,
    severity,
    action,
    is_active
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'Credit Card Detection',
    'Detects credit card numbers in messages and files',
    '\b(?:\d{4}[\s-]?){3}\d{4}\b',
    'high',
    'block',
    true
),
(
    '22222222-2222-2222-2222-222222222222',
    'Patient ID Protection',
    'Protects patient identification numbers',
    '\b[P|p]atient[\s-]?[I|i][D|d][\s-]?\d{6,8}\b',
    'critical',
    'encrypt',
    true
),
(
    '22222222-2222-2222-2222-222222222222',
    'SSN Detection',
    'Detects Social Security Numbers',
    '\b\d{3}-\d{2}-\d{4}\b',
    'critical',
    'block',
    true
),
(
    '33333333-3333-3333-3333-333333333333',
    'Financial Account Numbers',
    'Detects bank account and routing numbers',
    '\b\d{9,12}\b',
    'high',
    'alert',
    true
) ON CONFLICT DO NOTHING;

-- Create threat detections for demo
INSERT INTO threat_detections (
    tenant_id,
    threat_type,
    severity,
    source_ip,
    user_agent,
    description,
    raw_data,
    status,
    confidence_score
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'sql_injection',
    'high',
    '198.51.100.42',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    'SQL injection attempt detected in search parameter',
    '{"endpoint": "/api/search", "parameter": "query", "payload": "1'' OR 1=1--"}'::jsonb,
    'blocked',
    0.92
),
(
    '22222222-2222-2222-2222-222222222222',
    'suspicious_user_agent',
    'medium',
    '172.16.0.15',
    'BadBot/1.0',
    'Suspicious user agent string detected',
    '{"user_agent": "BadBot/1.0", "requests_count": 150}'::jsonb,
    'monitored',
    0.75
),
(
    '33333333-3333-3333-3333-333333333333',
    'rate_limit_exceeded',
    'medium',
    '203.0.113.99',
    'curl/7.68.0',
    'Rate limit exceeded - possible automated attack',
    '{"requests_per_minute": 200, "endpoint": "/api/balance"}'::jsonb,
    'rate_limited',
    0.85
) ON CONFLICT DO NOTHING;

-- Create API metrics for demo
INSERT INTO api_metrics (
    api_gateway_id,
    date,
    total_requests,
    average_response_time_ms,
    error_count,
    rate_limit_hits,
    bandwidth_bytes
) VALUES 
(
    (SELECT id FROM api_gateways WHERE tenant_id = '11111111-1111-1111-1111-111111111111' LIMIT 1),
    CURRENT_DATE - INTERVAL '1 day',
    15420,
    125,
    23,
    2,
    1024000000
),
(
    (SELECT id FROM api_gateways WHERE tenant_id = '11111111-1111-1111-1111-111111111111' LIMIT 1),
    CURRENT_DATE,
    18950,
    118,
    15,
    1,
    1387520000
),
(
    (SELECT id FROM api_gateways WHERE tenant_id = '22222222-2222-2222-2222-222222222222' LIMIT 1),
    CURRENT_DATE - INTERVAL '1 day',
    8420,
    89,
    5,
    0,
    523264000
),
(
    (SELECT id FROM api_gateways WHERE tenant_id = '22222222-2222-2222-2222-222222222222' LIMIT 1),
    CURRENT_DATE,
    9150,
    92,
    3,
    0,
    601088000
) ON CONFLICT DO NOTHING;

-- Create audit logs for demo
INSERT INTO audit_logs (
    tenant_id,
    action,
    details,
    created_at
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'user_login',
    '{"user_id": "admin@techcorp.com", "ip_address": "192.168.1.100", "success": true}'::jsonb,
    NOW() - INTERVAL '2 hours'
),
(
    '11111111-1111-1111-1111-111111111111',
    'security_policy_updated',
    '{"policy_id": "password_policy", "changes": {"min_length": 12}}'::jsonb,
    NOW() - INTERVAL '1 day'
),
(
    '22222222-2222-2222-2222-222222222222',
    'data_export',
    '{"resource": "patient_records", "count": 150, "format": "CSV"}'::jsonb,
    NOW() - INTERVAL '3 hours'
),
(
    '22222222-2222-2222-2222-222222222222',
    'dlp_rule_triggered',
    '{"rule": "SSN Detection", "action": "blocked", "resource": "message_123"}'::jsonb,
    NOW() - INTERVAL '30 minutes'
),
(
    '33333333-3333-3333-3333-333333333333',
    'api_key_created',
    '{"key_name": "Mobile App Key", "permissions": ["read", "write"]}'::jsonb,
    NOW() - INTERVAL '6 hours'
) ON CONFLICT DO NOTHING;

COMMIT;
EOF

echo "🔧 Creating BI widgets for demo dashboards..."

# Create BI widgets
cat << 'EOF' | supabase sql
-- Create BI widgets for demo dashboards

INSERT INTO bi_widgets (
    dashboard_id,
    type,
    title,
    description,
    data_source_query,
    position_x,
    position_y,
    size_width,
    size_height,
    config
) VALUES 
-- TechCorp Dashboard Widgets
(
    '44444444-4444-4444-4444-444444444444',
    'metric_card',
    'Total Employees',
    'Total number of employees in the system',
    'SELECT COUNT(*) as value FROM profiles WHERE tenant_id = ''11111111-1111-1111-1111-111111111111''',
    0, 0, 3, 2,
    '{"format": "number", "color": "blue"}'::jsonb
),
(
    '44444444-4444-4444-4444-444444444444',
    'metric_card',
    'Active Projects',
    'Number of active projects',
    'SELECT 25 as value',
    3, 0, 3, 2,
    '{"format": "number", "color": "green"}'::jsonb
),
(
    '44444444-4444-4444-4444-444444444444',
    'line_chart',
    'Monthly Revenue',
    'Revenue trend over time',
    'SELECT EXTRACT(MONTH FROM CURRENT_DATE) as month, 150000 + RANDOM() * 50000 as revenue',
    6, 0, 6, 4,
    '{"x_axis": "month", "y_axis": "revenue", "color": "green"}'::jsonb
),

-- HealthPlus Dashboard Widgets
(
    '55555555-5555-5555-5555-555555555555',
    'metric_card',
    'Total Patients',
    'Total number of registered patients',
    'SELECT 1247 as value',
    0, 0, 3, 2,
    '{"format": "number", "color": "blue"}'::jsonb
),
(
    '55555555-5555-5555-5555-555555555555',
    'metric_card',
    'Appointments Today',
    'Number of appointments scheduled for today',
    'SELECT 23 as value',
    3, 0, 3, 2,
    '{"format": "number", "color": "orange"}'::jsonb
),
(
    '55555555-5555-5555-5555-555555555555',
    'bar_chart',
    'Patient Satisfaction',
    'Patient satisfaction scores by department',
    'SELECT ''Cardiology'' as department, 4.8 as score UNION SELECT ''Emergency'', 4.2 UNION SELECT ''Surgery'', 4.9',
    6, 0, 6, 4,
    '{"x_axis": "department", "y_axis": "score", "color": "green"}'::jsonb
),

-- FinanceSecure Dashboard Widgets
(
    '66666666-6666-6666-6666-666666666666',
    'metric_card',
    'Risk Score',
    'Current enterprise risk score',
    'SELECT 2.3 as value',
    0, 0, 3, 2,
    '{"format": "decimal", "color": "red", "threshold": 3.0}'::jsonb
),
(
    '66666666-6666-6666-6666-666666666666',
    'metric_card',
    'Compliance Rate',
    'Overall compliance percentage',
    'SELECT 97.5 as value',
    3, 0, 3, 2,
    '{"format": "percentage", "color": "green"}'::jsonb
),
(
    '66666666-6666-6666-6666-666666666666',
    'pie_chart',
    'Security Incidents by Type',
    'Breakdown of security incidents by category',
    'SELECT ''Login Anomaly'' as category, 5 as count UNION SELECT ''Data Access'', 2 UNION SELECT ''API Abuse'', 1',
    6, 0, 6, 4,
    '{"label_field": "category", "value_field": "count"}'::jsonb
) ON CONFLICT DO NOTHING;

COMMIT;
EOF

echo "✅ Enterprise demo data created successfully!"
echo ""
echo "📊 Demo Tenants Created:"
echo "   1. TechCorp Enterprise (ID: 11111111-1111-1111-1111-111111111111)"
echo "   2. Healthcare Plus (ID: 22222222-2222-2222-2222-222222222222)"
echo "   3. FinanceSecure (ID: 33333333-3333-3333-3333-333333333333)"
echo ""
echo "🔧 Demo Data Includes:"
echo "   - Multi-tenant configurations"
echo "   - SSO provider settings"
echo "   - API gateway configurations"
echo "   - BI dashboards and widgets"
echo "   - Security incidents and threats"
echo "   - DLP rules and policies"
echo "   - API metrics and audit logs"
echo ""
echo "🚀 You can now test all FASE 7 Enterprise Features!"
echo "   Access the dashboard at: http://localhost:5173/admin/enterprise"
echo ""
echo "💡 Tip: Use the tenant switcher to view different organizations"
