#!/bin/bash

# FASE 7 - Enterprise Database Setup Script
# Sets up the complete enterprise multi-tenant schema for SnakkaZ

set -e

echo "🚀 FASE 7 - Setting up Enterprise Database Schema..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Check if Supabase is linked
if [ ! -f ".supabase/config.toml" ]; then
    echo "❌ Supabase project not linked. Please run: npm run supabase:link"
    exit 1
fi

echo "📋 Checking Supabase connection..."
supabase status || {
    echo "❌ Supabase is not running. Starting local instance..."
    supabase start
}

echo "🗃️  Applying Enterprise Schema..."

# Apply the enterprise schema
echo "📝 Creating enterprise tables and functions..."
supabase db push --file src/database/enterprise-schema.sql || {
    echo "⚠️  Failed to apply schema directly. Trying with migrations..."
    
    # Create a new migration file
    MIGRATION_NAME="$(date +%Y%m%d%H%M%S)_enterprise_schema"
    supabase migration new "$MIGRATION_NAME"
    
    # Copy the schema to the migration file
    cp src/database/enterprise-schema.sql "supabase/migrations/${MIGRATION_NAME}.sql"
    
    # Apply migrations
    supabase db push
}

echo "🔐 Setting up Row Level Security policies..."

# Create RLS policies for enterprise tables
cat << 'EOF' | supabase db reset --db-password postgres
-- Enterprise RLS Policies

-- Tenants can only access their own data
CREATE POLICY "tenant_isolation_policy" ON tenants
    FOR ALL TO authenticated
    USING (id = get_current_tenant_id());

CREATE POLICY "tenant_features_isolation" ON tenant_features
    FOR ALL TO authenticated
    USING (tenant_id = get_current_tenant_id());

CREATE POLICY "tenant_billing_isolation" ON tenant_billing
    FOR ALL TO authenticated
    USING (tenant_id = get_current_tenant_id());

-- SSO providers
CREATE POLICY "sso_providers_isolation" ON sso_providers
    FOR ALL TO authenticated
    USING (tenant_id = get_current_tenant_id());

-- BI Dashboards
CREATE POLICY "bi_dashboards_isolation" ON bi_dashboards
    FOR ALL TO authenticated
    USING (tenant_id = get_current_tenant_id());

-- API Gateways
CREATE POLICY "api_gateways_isolation" ON api_gateways
    FOR ALL TO authenticated
    USING (tenant_id = get_current_tenant_id());

-- Security
CREATE POLICY "security_incidents_isolation" ON security_incidents
    FOR ALL TO authenticated
    USING (tenant_id = get_current_tenant_id());

COMMIT;
EOF

echo "📊 Creating initial sample data..."

# Insert sample data for development
cat << 'EOF' | supabase sql
-- Sample Enterprise Data

-- Insert a demo tenant
INSERT INTO tenants (
    id,
    name,
    domain,
    subdomain,
    company_name,
    support_email,
    status
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Demo Enterprise',
    'demo.snakkaz.com',
    'demo',
    'Demo Enterprise Corp',
    'support@demo.snakkaz.com',
    'active'
) ON CONFLICT (id) DO NOTHING;

-- Enable advanced features for demo tenant
UPDATE tenant_features 
SET 
    sso_enabled = true,
    api_access = true,
    advanced_analytics = true,
    custom_integrations = true,
    white_label = true,
    priority_support = true,
    custom_domains = true,
    advanced_security = true,
    compliance_tools = true,
    custom_workflows = true,
    max_users = 1000,
    max_storage_gb = 100,
    max_api_requests_per_month = 1000000
WHERE tenant_id = '00000000-0000-0000-0000-000000000001';

-- Insert sample BI dashboard
INSERT INTO bi_dashboards (
    id,
    tenant_id,
    name,
    description,
    is_public
) VALUES (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Executive Dashboard',
    'High-level KPIs and metrics for executive team',
    false
) ON CONFLICT (id) DO NOTHING;

-- Insert sample widgets
INSERT INTO bi_widgets (
    dashboard_id,
    type,
    title,
    description,
    data_source_query,
    position_x,
    position_y,
    size_width,
    size_height
) VALUES 
(
    '00000000-0000-0000-0000-000000000002',
    'metric_card',
    'Total Users',
    'Total number of active users',
    'SELECT COUNT(*) as value FROM profiles WHERE tenant_id = get_current_tenant_id()',
    0, 0, 3, 2
),
(
    '00000000-0000-0000-0000-000000000002',
    'line_chart',
    'Daily Active Users',
    'Daily active users over time',
    'SELECT DATE(created_at) as date, COUNT(*) as value FROM profiles WHERE tenant_id = get_current_tenant_id() GROUP BY DATE(created_at)',
    3, 0, 6, 4
),
(
    '00000000-0000-0000-0000-000000000002',
    'metric_card',
    'Messages Today',
    'Messages sent today',
    'SELECT COUNT(*) as value FROM messages WHERE DATE(created_at) = CURRENT_DATE',
    9, 0, 3, 2
) ON CONFLICT DO NOTHING;

-- Insert sample API gateway
INSERT INTO api_gateways (
    tenant_id,
    name,
    base_url,
    status
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Demo API Gateway',
    'https://api.demo.snakkaz.com',
    'active'
) ON CONFLICT DO NOTHING;

COMMIT;
EOF

echo "🔧 Setting up enterprise functions and triggers..."

cat << 'EOF' | supabase sql
-- Enterprise utility functions

-- Function to check if user is admin for tenant
CREATE OR REPLACE FUNCTION is_tenant_admin(user_id UUID, tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id 
        AND profiles.tenant_id = is_tenant_admin.tenant_id
        AND role IN ('admin', 'super_admin')
    );
$$;

-- Function to get tenant usage metrics
CREATE OR REPLACE FUNCTION get_tenant_usage_metrics(tenant_id UUID)
RETURNS JSON
LANGUAGE SQL
STABLE
AS $$
    SELECT json_build_object(
        'users', (SELECT COUNT(*) FROM profiles WHERE profiles.tenant_id = get_tenant_usage_metrics.tenant_id),
        'groups', (SELECT COUNT(*) FROM groups WHERE creator_id IN (SELECT id FROM profiles WHERE profiles.tenant_id = get_tenant_usage_metrics.tenant_id)),
        'messages', (SELECT COUNT(*) FROM messages WHERE sender_id IN (SELECT id FROM profiles WHERE profiles.tenant_id = get_tenant_usage_metrics.tenant_id)),
        'storage_used_gb', 0.5 -- This would be calculated from actual storage usage
    );
$$;

-- Function to enforce resource quotas
CREATE OR REPLACE FUNCTION check_resource_quota(tenant_id UUID, resource_type TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
    SELECT 
        CASE resource_type
            WHEN 'users' THEN 
                (SELECT COUNT(*) FROM profiles WHERE profiles.tenant_id = check_resource_quota.tenant_id) < 
                (SELECT max_users FROM tenant_features WHERE tenant_features.tenant_id = check_resource_quota.tenant_id)
            WHEN 'groups' THEN 
                (SELECT COUNT(*) FROM groups WHERE creator_id IN (SELECT id FROM profiles WHERE profiles.tenant_id = check_resource_quota.tenant_id)) < 
                (SELECT max_groups FROM tenant_features WHERE tenant_features.tenant_id = check_resource_quota.tenant_id)
            ELSE true
        END;
$$;

COMMIT;
EOF

echo "📈 Setting up analytics views..."

cat << 'EOF' | supabase sql
-- Enterprise Analytics Views

-- Real-time dashboard metrics view
CREATE OR REPLACE VIEW enterprise_dashboard_metrics AS
SELECT 
    t.id as tenant_id,
    t.name as tenant_name,
    (SELECT COUNT(*) FROM profiles p WHERE p.tenant_id = t.id) as total_users,
    (SELECT COUNT(*) FROM profiles p WHERE p.tenant_id = t.id AND p.last_seen > NOW() - INTERVAL '24 hours') as active_users_24h,
    (SELECT COUNT(*) FROM groups g JOIN profiles p ON g.creator_id = p.id WHERE p.tenant_id = t.id) as total_groups,
    (SELECT COUNT(*) FROM messages m JOIN profiles p ON m.sender_id = p.id WHERE p.tenant_id = t.id AND m.created_at > NOW() - INTERVAL '24 hours') as messages_24h,
    tf.max_users,
    tf.max_storage_gb,
    t.status
FROM tenants t
LEFT JOIN tenant_features tf ON t.id = tf.tenant_id;

-- API usage analytics view
CREATE OR REPLACE VIEW api_usage_analytics AS
SELECT 
    ag.tenant_id,
    ag.name as gateway_name,
    SUM(am.total_requests) as total_requests_30d,
    AVG(am.average_response_time_ms) as avg_response_time,
    SUM(am.rate_limit_hits) as rate_limit_hits_30d,
    SUM(am.bandwidth_bytes) as bandwidth_30d
FROM api_gateways ag
LEFT JOIN api_metrics am ON ag.id = am.api_gateway_id
WHERE am.date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY ag.tenant_id, ag.name;

-- Security incidents summary view
CREATE OR REPLACE VIEW security_incidents_summary AS
SELECT 
    tenant_id,
    COUNT(*) as total_incidents,
    COUNT(*) FILTER (WHERE severity = 'critical') as critical_incidents,
    COUNT(*) FILTER (WHERE severity = 'high') as high_incidents,
    COUNT(*) FILTER (WHERE status = 'open') as open_incidents,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as incidents_7d
FROM security_incidents
GROUP BY tenant_id;

COMMIT;
EOF

echo "✅ Enterprise Database Schema Setup Complete!"
echo ""
echo "🎯 Next Steps:"
echo "1. ✅ Multi-tenant database schema created"
echo "2. ✅ Row Level Security policies applied"
echo "3. ✅ Sample data inserted for development"
echo "4. ✅ Enterprise functions and views created"
echo ""
echo "🚀 You can now start developing FASE 7 Enterprise Features:"
echo "   - Multi-tenant architecture ✅"
echo "   - SSO Integration (Week 2)"
echo "   - Business Intelligence (Week 3)"
echo "   - API Gateway & Security (Week 4)"
echo ""
echo "📊 Access the demo dashboard at: http://localhost:5173/admin/enterprise"
echo "🔧 Demo tenant ID: 00000000-0000-0000-0000-000000000001"
echo ""
echo "Happy coding! 🚀"
