-- SnakkaZ MSSQL Schema: MCP + Security + Performance
-- Compatible with: Microsoft SQL Server
-- Created: 2025-07-22
-- Purpose: Deploy MCP, Hacker Trap, and Performance Analytics tables

-- ===========================================
-- MEMORY CONTEXT PROTOCOL (MCP) TABLES
-- ===========================================

-- Check if tables exist and create if they don't
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='mcp_user_context' AND xtype='U')
BEGIN
    CREATE TABLE mcp_user_context (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id NVARCHAR(255) NOT NULL,
        context_type NVARCHAR(100) NOT NULL,
        context_data NVARCHAR(MAX) NOT NULL,
        relevance_score FLOAT DEFAULT 0.0,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE(),
        expires_at DATETIME2 NULL
    );
    
    CREATE INDEX idx_mcp_user_context_user_id ON mcp_user_context(user_id);
    CREATE INDEX idx_mcp_user_context_type ON mcp_user_context(context_type);
    CREATE INDEX idx_mcp_user_context_relevance ON mcp_user_context(relevance_score DESC);
END;

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='mcp_user_preferences' AND xtype='U')
BEGIN
    CREATE TABLE mcp_user_preferences (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id NVARCHAR(255) NOT NULL,
        preference_key NVARCHAR(100) NOT NULL,
        preference_value NVARCHAR(MAX) NOT NULL,
        auto_learned BIT DEFAULT 0,
        confidence_score FLOAT DEFAULT 0.0,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
    );
    
    CREATE INDEX idx_mcp_user_preferences_user_id ON mcp_user_preferences(user_id);
    CREATE UNIQUE INDEX idx_mcp_user_preferences_unique ON mcp_user_preferences(user_id, preference_key);
END;

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='mcp_analytics' AND xtype='U')
BEGIN
    CREATE TABLE mcp_analytics (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id NVARCHAR(255) NOT NULL,
        action_type NVARCHAR(100) NOT NULL,
        context_id INT NULL,
        performance_metric NVARCHAR(100) NULL,
        metric_value FLOAT NULL,
        metadata NVARCHAR(MAX) NULL,
        created_at DATETIME2 DEFAULT GETDATE()
    );
    
    CREATE INDEX idx_mcp_analytics_user_id ON mcp_analytics(user_id);
    CREATE INDEX idx_mcp_analytics_action_type ON mcp_analytics(action_type);
    CREATE INDEX idx_mcp_analytics_created_at ON mcp_analytics(created_at);
END;

-- ===========================================
-- INTELLIGENT HACKER TRAP SYSTEM TABLES
-- ===========================================

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='hacker_profiles' AND xtype='U')
BEGIN
    CREATE TABLE hacker_profiles (
        id INT IDENTITY(1,1) PRIMARY KEY,
        ip_address NVARCHAR(45) NOT NULL,
        user_agent NVARCHAR(MAX) NULL,
        attack_type NVARCHAR(100) NOT NULL,
        skill_level NVARCHAR(50) DEFAULT 'unknown',
        behavior_pattern NVARCHAR(MAX) NULL,
        first_seen DATETIME2 DEFAULT GETDATE(),
        last_seen DATETIME2 DEFAULT GETDATE(),
        total_attacks INT DEFAULT 1,
        threat_score FLOAT DEFAULT 0.0,
        blocked BIT DEFAULT 0
    );
    
    CREATE INDEX idx_hacker_profiles_ip ON hacker_profiles(ip_address);
    CREATE INDEX idx_hacker_profiles_threat_score ON hacker_profiles(threat_score DESC);
    CREATE INDEX idx_hacker_profiles_blocked ON hacker_profiles(blocked);
END;

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='trap_logs' AND xtype='U')
BEGIN
    CREATE TABLE trap_logs (
        id INT IDENTITY(1,1) PRIMARY KEY,
        hacker_id INT NOT NULL,
        trap_type NVARCHAR(100) NOT NULL,
        trigger_url NVARCHAR(MAX) NOT NULL,
        request_method NVARCHAR(10) DEFAULT 'GET',
        request_data NVARCHAR(MAX) NULL,
        response_data NVARCHAR(MAX) NULL,
        challenge_presented NVARCHAR(MAX) NULL,
        challenge_solved BIT DEFAULT 0,
        defense_generated NVARCHAR(MAX) NULL,
        created_at DATETIME2 DEFAULT GETDATE()
    );
    
    CREATE INDEX idx_trap_logs_hacker_id ON trap_logs(hacker_id);
    CREATE INDEX idx_trap_logs_trap_type ON trap_logs(trap_type);
    CREATE INDEX idx_trap_logs_created_at ON trap_logs(created_at);
END;

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='defense_strategies' AND xtype='U')
BEGIN
    CREATE TABLE defense_strategies (
        id INT IDENTITY(1,1) PRIMARY KEY,
        attack_type NVARCHAR(100) NOT NULL,
        defense_name NVARCHAR(255) NOT NULL,
        defense_code NVARCHAR(MAX) NOT NULL,
        effectiveness_score FLOAT DEFAULT 0.0,
        auto_generated BIT DEFAULT 1,
        created_by_hacker_id INT NULL,
        created_at DATETIME2 DEFAULT GETDATE(),
        last_used DATETIME2 NULL,
        usage_count INT DEFAULT 0
    );
    
    CREATE INDEX idx_defense_strategies_attack_type ON defense_strategies(attack_type);
    CREATE INDEX idx_defense_strategies_effectiveness ON defense_strategies(effectiveness_score DESC);
    CREATE INDEX idx_defense_strategies_auto_generated ON defense_strategies(auto_generated);
END;

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='blocked_ips' AND xtype='U')
BEGIN
    CREATE TABLE blocked_ips (
        id INT IDENTITY(1,1) PRIMARY KEY,
        ip_address NVARCHAR(45) NOT NULL,
        block_reason NVARCHAR(MAX) NOT NULL,
        hacker_id INT NULL,
        auto_block BIT DEFAULT 1,
        manual_override BIT DEFAULT 0,
        blocked_at DATETIME2 DEFAULT GETDATE(),
        expires_at DATETIME2 NULL,
        unblock_count INT DEFAULT 0
    );
    
    CREATE UNIQUE INDEX idx_blocked_ips_ip ON blocked_ips(ip_address);
    CREATE INDEX idx_blocked_ips_blocked_at ON blocked_ips(blocked_at);
    CREATE INDEX idx_blocked_ips_expires_at ON blocked_ips(expires_at);
END;

-- ===========================================
-- PERFORMANCE ANALYTICS TABLES  
-- ===========================================

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='performance_metrics' AND xtype='U')
BEGIN
    CREATE TABLE performance_metrics (
        id INT IDENTITY(1,1) PRIMARY KEY,
        metric_name NVARCHAR(100) NOT NULL,
        metric_value FLOAT NOT NULL,
        metric_unit NVARCHAR(50) NULL,
        component NVARCHAR(100) NULL,
        user_id NVARCHAR(255) NULL,
        session_id NVARCHAR(255) NULL,
        created_at DATETIME2 DEFAULT GETDATE()
    );
    
    CREATE INDEX idx_performance_metrics_name ON performance_metrics(metric_name);
    CREATE INDEX idx_performance_metrics_component ON performance_metrics(component);
    CREATE INDEX idx_performance_metrics_created_at ON performance_metrics(created_at);
END;

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='connection_pool_stats' AND xtype='U')
BEGIN
    CREATE TABLE connection_pool_stats (
        id INT IDENTITY(1,1) PRIMARY KEY,
        pool_name NVARCHAR(100) NOT NULL,
        active_connections INT DEFAULT 0,
        idle_connections INT DEFAULT 0,
        total_connections INT DEFAULT 0,
        avg_response_time FLOAT DEFAULT 0.0,
        created_at DATETIME2 DEFAULT GETDATE()
    );
    
    CREATE INDEX idx_connection_pool_stats_pool_name ON connection_pool_stats(pool_name);
    CREATE INDEX idx_connection_pool_stats_created_at ON connection_pool_stats(created_at);
END;

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='message_batch_analytics' AND xtype='U')
BEGIN
    CREATE TABLE message_batch_analytics (
        id INT IDENTITY(1,1) PRIMARY KEY,
        batch_size INT NOT NULL,
        processing_time FLOAT NOT NULL,
        success_count INT DEFAULT 0,
        error_count INT DEFAULT 0,
        avg_message_size FLOAT DEFAULT 0.0,
        compression_ratio FLOAT DEFAULT 1.0,
        created_at DATETIME2 DEFAULT GETDATE()
    );
    
    CREATE INDEX idx_message_batch_analytics_batch_size ON message_batch_analytics(batch_size);
    CREATE INDEX idx_message_batch_analytics_created_at ON message_batch_analytics(created_at);
END;

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ux_metrics' AND xtype='U')
BEGIN
    CREATE TABLE ux_metrics (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id NVARCHAR(255) NOT NULL,
        session_id NVARCHAR(255) NOT NULL,
        page_load_time FLOAT NULL,
        first_paint_time FLOAT NULL,
        time_to_interactive FLOAT NULL,
        memory_usage FLOAT NULL,
        network_speed NVARCHAR(50) NULL,
        device_type NVARCHAR(50) NULL,
        satisfaction_score INT NULL,
        created_at DATETIME2 DEFAULT GETDATE()
    );
    
    CREATE INDEX idx_ux_metrics_user_id ON ux_metrics(user_id);
    CREATE INDEX idx_ux_metrics_session_id ON ux_metrics(session_id);
    CREATE INDEX idx_ux_metrics_created_at ON ux_metrics(created_at);
END;

-- ===========================================
-- COMPETITOR BENCHMARKS TABLE
-- ===========================================

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='competitor_benchmarks' AND xtype='U')
BEGIN
    CREATE TABLE competitor_benchmarks (
        id INT IDENTITY(1,1) PRIMARY KEY,
        competitor_name NVARCHAR(100) NOT NULL,
        metric_name NVARCHAR(100) NOT NULL,
        metric_value FLOAT NOT NULL,
        snakkaz_value FLOAT NULL,
        performance_ratio FLOAT NULL,
        test_date DATETIME2 DEFAULT GETDATE(),
        notes NVARCHAR(MAX) NULL
    );
    
    CREATE INDEX idx_competitor_benchmarks_competitor ON competitor_benchmarks(competitor_name);
    CREATE INDEX idx_competitor_benchmarks_metric ON competitor_benchmarks(metric_name);
    CREATE UNIQUE INDEX idx_competitor_benchmarks_unique ON competitor_benchmarks(competitor_name, metric_name, test_date);
END;

-- ===========================================
-- INITIAL DATA INSERTION
-- ===========================================

-- Insert competitor benchmark data
MERGE competitor_benchmarks AS target
USING (VALUES 
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
    ('wickr', 'memory_usage_mb', 190.0, 'Wickr average memory usage')
) AS source (competitor_name, metric_name, metric_value, notes)
ON target.competitor_name = source.competitor_name AND target.metric_name = source.metric_name
WHEN NOT MATCHED THEN
    INSERT (competitor_name, metric_name, metric_value, notes)
    VALUES (source.competitor_name, source.metric_name, source.metric_value, source.notes);

-- Success message
IF NOT EXISTS (SELECT * FROM performance_metrics WHERE metric_name = 'database_schema_version')
BEGIN
    INSERT INTO performance_metrics (metric_name, metric_value, metric_unit, component) 
    VALUES ('database_schema_version', 1.0, 'version', 'database');
END;

-- Verification query
SELECT 'SnakkaZ MSSQL Schema Successfully Created!' as status,
       COUNT(*) as tables_created
FROM information_schema.tables 
WHERE table_name IN (
    'mcp_user_context', 'mcp_user_preferences', 'mcp_analytics',
    'hacker_profiles', 'trap_logs', 'defense_strategies', 'blocked_ips',
    'performance_metrics', 'connection_pool_stats', 'message_batch_analytics',
    'ux_metrics', 'competitor_benchmarks'
);
