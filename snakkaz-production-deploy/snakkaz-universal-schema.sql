-- SnakkaZ Multi-Database Schema: MCP + Security + Performance
-- Compatible with: PostgreSQL, MySQL, MSSQL, SQLite
-- Created: 2025-07-22
-- Purpose: Deploy MCP, Hacker Trap, and Performance Analytics tables

-- ===========================================
-- MEMORY CONTEXT PROTOCOL (MCP) TABLES
-- ===========================================

-- MCP User Context Storage
CREATE TABLE IF NOT EXISTS mcp_user_context (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    context_type TEXT NOT NULL,
    context_data TEXT NOT NULL,
    relevance_score REAL DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NULL
);

CREATE INDEX IF NOT EXISTS idx_mcp_user_context_user_id ON mcp_user_context(user_id);
CREATE INDEX IF NOT EXISTS idx_mcp_user_context_type ON mcp_user_context(context_type);
CREATE INDEX IF NOT EXISTS idx_mcp_user_context_relevance ON mcp_user_context(relevance_score DESC);

-- MCP User Preferences
CREATE TABLE IF NOT EXISTS mcp_user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    preference_key TEXT NOT NULL,
    preference_value TEXT NOT NULL,
    auto_learned INTEGER DEFAULT 0,
    confidence_score REAL DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mcp_user_preferences_user_id ON mcp_user_preferences(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_mcp_user_preferences_unique ON mcp_user_preferences(user_id, preference_key);

-- MCP Analytics
CREATE TABLE IF NOT EXISTS mcp_analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    action_type TEXT NOT NULL,
    context_id INTEGER NULL,
    performance_metric TEXT NULL,
    metric_value REAL NULL,
    metadata TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mcp_analytics_user_id ON mcp_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_mcp_analytics_action_type ON mcp_analytics(action_type);
CREATE INDEX IF NOT EXISTS idx_mcp_analytics_created_at ON mcp_analytics(created_at);

-- ===========================================
-- INTELLIGENT HACKER TRAP SYSTEM TABLES
-- ===========================================

-- Hacker Profiles
CREATE TABLE IF NOT EXISTS hacker_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT NOT NULL,
    user_agent TEXT NULL,
    attack_type TEXT NOT NULL,
    skill_level TEXT DEFAULT 'unknown',
    behavior_pattern TEXT NULL,
    first_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_attacks INTEGER DEFAULT 1,
    threat_score REAL DEFAULT 0.0,
    blocked INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_hacker_profiles_ip ON hacker_profiles(ip_address);
CREATE INDEX IF NOT EXISTS idx_hacker_profiles_threat_score ON hacker_profiles(threat_score DESC);
CREATE INDEX IF NOT EXISTS idx_hacker_profiles_blocked ON hacker_profiles(blocked);

-- Trap Logs
CREATE TABLE IF NOT EXISTS trap_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hacker_id INTEGER NOT NULL,
    trap_type TEXT NOT NULL,
    trigger_url TEXT NOT NULL,
    request_method TEXT DEFAULT 'GET',
    request_data TEXT NULL,
    response_data TEXT NULL,
    challenge_presented TEXT NULL,
    challenge_solved INTEGER DEFAULT 0,
    defense_generated TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trap_logs_hacker_id ON trap_logs(hacker_id);
CREATE INDEX IF NOT EXISTS idx_trap_logs_trap_type ON trap_logs(trap_type);
CREATE INDEX IF NOT EXISTS idx_trap_logs_created_at ON trap_logs(created_at);

-- Defense Strategies
CREATE TABLE IF NOT EXISTS defense_strategies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attack_type TEXT NOT NULL,
    defense_name TEXT NOT NULL,
    defense_code TEXT NOT NULL,
    effectiveness_score REAL DEFAULT 0.0,
    auto_generated INTEGER DEFAULT 1,
    created_by_hacker_id INTEGER NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_used DATETIME NULL,
    usage_count INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_defense_strategies_attack_type ON defense_strategies(attack_type);
CREATE INDEX IF NOT EXISTS idx_defense_strategies_effectiveness ON defense_strategies(effectiveness_score DESC);
CREATE INDEX IF NOT EXISTS idx_defense_strategies_auto_generated ON defense_strategies(auto_generated);

-- Blocked IPs
CREATE TABLE IF NOT EXISTS blocked_ips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT NOT NULL,
    block_reason TEXT NOT NULL,
    hacker_id INTEGER NULL,
    auto_block INTEGER DEFAULT 1,
    manual_override INTEGER DEFAULT 0,
    blocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NULL,
    unblock_count INTEGER DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_blocked_ips_ip ON blocked_ips(ip_address);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_blocked_at ON blocked_ips(blocked_at);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_expires_at ON blocked_ips(expires_at);

-- ===========================================
-- PERFORMANCE ANALYTICS TABLES  
-- ===========================================

-- System Performance Metrics
CREATE TABLE IF NOT EXISTS performance_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_name TEXT NOT NULL,
    metric_value REAL NOT NULL,
    metric_unit TEXT NULL,
    component TEXT NULL,
    user_id TEXT NULL,
    session_id TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_name ON performance_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_component ON performance_metrics(component);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_created_at ON performance_metrics(created_at);

-- Connection Pool Stats
CREATE TABLE IF NOT EXISTS connection_pool_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pool_name TEXT NOT NULL,
    active_connections INTEGER DEFAULT 0,
    idle_connections INTEGER DEFAULT 0,
    total_connections INTEGER DEFAULT 0,
    avg_response_time REAL DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_connection_pool_stats_pool_name ON connection_pool_stats(pool_name);
CREATE INDEX IF NOT EXISTS idx_connection_pool_stats_created_at ON connection_pool_stats(created_at);

-- Message Batch Analytics
CREATE TABLE IF NOT EXISTS message_batch_analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    batch_size INTEGER NOT NULL,
    processing_time REAL NOT NULL,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    avg_message_size REAL DEFAULT 0.0,
    compression_ratio REAL DEFAULT 1.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_message_batch_analytics_batch_size ON message_batch_analytics(batch_size);
CREATE INDEX IF NOT EXISTS idx_message_batch_analytics_created_at ON message_batch_analytics(created_at);

-- User Experience Metrics
CREATE TABLE IF NOT EXISTS ux_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    page_load_time REAL NULL,
    first_paint_time REAL NULL,
    time_to_interactive REAL NULL,
    memory_usage REAL NULL,
    network_speed TEXT NULL,
    device_type TEXT NULL,
    satisfaction_score INTEGER NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ux_metrics_user_id ON ux_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_ux_metrics_session_id ON ux_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_ux_metrics_created_at ON ux_metrics(created_at);

-- ===========================================
-- COMPETITOR BENCHMARKS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS competitor_benchmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    competitor_name TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value REAL NOT NULL,
    snakkaz_value REAL NULL,
    performance_ratio REAL NULL,
    test_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT NULL
);

CREATE INDEX IF NOT EXISTS idx_competitor_benchmarks_competitor ON competitor_benchmarks(competitor_name);
CREATE INDEX IF NOT EXISTS idx_competitor_benchmarks_metric ON competitor_benchmarks(metric_name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_competitor_benchmarks_unique ON competitor_benchmarks(competitor_name, metric_name, test_date);

-- ===========================================
-- INITIAL DATA INSERTION
-- ===========================================

-- Insert competitor benchmark data
INSERT OR REPLACE INTO competitor_benchmarks (competitor_name, metric_name, metric_value, notes) VALUES
('signal', 'message_speed_ms', 150.0, 'Signal average message processing time'),
('signal', 'connection_speed_ms', 2000.0, 'Signal WebSocket connection time'),
('signal', 'memory_usage_mb', 180.0, 'Signal average memory usage'),
('telegram', 'message_speed_ms', 120.0, 'Telegram average message processing time'),
('telegram', 'connection_speed_ms', 1800.0, 'Telegram WebSocket connection time'),
('telegram', 'memory_usage_mb', 220.0, 'Telegram average memory usage'),
('whatsapp', 'message_speed_ms', 180.0, 'WhatsApp average message processing time'),
('whatsapp', 'connection_speed_ms', 2200.0, 'WhatsApp WebSocket connection time'),
('whatsapp', 'memory_usage_mb', 200.0, 'WhatsApp average memory usage'),
('snapchat', 'message_speed_ms', 200.0, 'Snapchat average message processing time'),
('snapchat', 'connection_speed_ms', 2500.0, 'Snapchat WebSocket connection time'),
('snapchat', 'memory_usage_mb', 250.0, 'Snapchat average memory usage'),
('wickr', 'message_speed_ms', 160.0, 'Wickr average message processing time'),
('wickr', 'connection_speed_ms', 2100.0, 'Wickr WebSocket connection time'),
('wickr', 'memory_usage_mb', 190.0, 'Wickr average memory usage');

-- ===========================================
-- VIEWS FOR EASY ANALYTICS
-- ===========================================

-- Performance Summary View
CREATE VIEW IF NOT EXISTS performance_summary AS
SELECT 
    DATE(created_at) as performance_date,
    component,
    metric_name,
    AVG(metric_value) as avg_value,
    MIN(metric_value) as min_value,
    MAX(metric_value) as max_value,
    COUNT(*) as sample_count
FROM performance_metrics 
GROUP BY DATE(created_at), component, metric_name;

-- Hacker Activity Summary View
CREATE VIEW IF NOT EXISTS hacker_activity_summary AS
SELECT 
    DATE(h.last_seen) as activity_date,
    h.attack_type,
    COUNT(DISTINCT h.id) as unique_hackers,
    SUM(h.total_attacks) as total_attacks,
    AVG(h.threat_score) as avg_threat_score,
    COUNT(CASE WHEN h.blocked = 1 THEN 1 END) as blocked_count
FROM hacker_profiles h
GROUP BY DATE(h.last_seen), h.attack_type;

-- MCP Context Insights View
CREATE VIEW IF NOT EXISTS mcp_context_insights AS
SELECT 
    user_id,
    context_type,
    COUNT(*) as context_count,
    AVG(relevance_score) as avg_relevance,
    MAX(updated_at) as last_updated
FROM mcp_user_context
GROUP BY user_id, context_type;

-- Success message
INSERT OR REPLACE INTO performance_metrics (metric_name, metric_value, metric_unit, component) VALUES
('database_schema_version', 1.0, 'version', 'database');

-- Final verification
SELECT 'SnakkaZ Multi-Database Schema Successfully Created!' as status;
