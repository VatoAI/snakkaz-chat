-- SnakkaZ - Memory Context Protocol & Intelligent Hacker Trap Tables
-- Created: 2025-07-22

-- Memory Context Protocol Tables
CREATE TABLE IF NOT EXISTS user_memory_context (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    conversation_id TEXT,
    message_content TEXT,
    context_type TEXT DEFAULT 'chat',
    topics TEXT[] DEFAULT '{}',
    sentiment TEXT DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    preferences_detected JSONB DEFAULT '{}',
    session_id TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    preferences JSONB DEFAULT '{}',
    ai_personality JSONB DEFAULT '{}',
    communication_style TEXT DEFAULT 'balanced',
    interests TEXT[] DEFAULT '{}',
    active_hours JSONB DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Intelligent Hacker Trap Tables
CREATE TABLE IF NOT EXISTS hacker_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ip TEXT NOT NULL,
    user_agent TEXT,
    attack_type TEXT NOT NULL,
    skill_level TEXT DEFAULT 'beginner' CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    challenge_presented BOOLEAN DEFAULT FALSE,
    challenge_solved BOOLEAN DEFAULT FALSE,
    defense_generated BOOLEAN DEFAULT FALSE,
    first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hacker_trap_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    challenge_id TEXT NOT NULL,
    hacker_ip TEXT NOT NULL,
    solution_provided TEXT,
    defense_steps_generated INTEGER DEFAULT 0,
    total_effectiveness DECIMAL(5,2) DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'successful_trap', 'failed', 'blocked')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS defense_implementations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    attack_type TEXT NOT NULL,
    defense_name TEXT NOT NULL,
    implementation_code TEXT,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    effectiveness DECIMAL(5,2) DEFAULT 50.0,
    auto_generated BOOLEAN DEFAULT FALSE,
    hacker_ip TEXT,
    implemented BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blocked_ips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ip_address TEXT NOT NULL UNIQUE,
    block_reason TEXT,
    blocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    block_duration INTEGER DEFAULT 86400000, -- 24 hours in milliseconds
    generated_defense BOOLEAN DEFAULT FALSE,
    unblock_at TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (blocked_at + (block_duration * INTERVAL '1 millisecond')) STORED,
    is_active BOOLEAN DEFAULT TRUE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_memory_context_user_id ON user_memory_context(user_id);
CREATE INDEX IF NOT EXISTS idx_user_memory_context_timestamp ON user_memory_context(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_user_memory_context_topics ON user_memory_context USING GIN(topics);

CREATE INDEX IF NOT EXISTS idx_hacker_profiles_ip ON hacker_profiles(ip);
CREATE INDEX IF NOT EXISTS idx_hacker_profiles_attack_type ON hacker_profiles(attack_type);
CREATE INDEX IF NOT EXISTS idx_hacker_profiles_last_activity ON hacker_profiles(last_activity DESC);

CREATE INDEX IF NOT EXISTS idx_hacker_trap_logs_hacker_ip ON hacker_trap_logs(hacker_ip);
CREATE INDEX IF NOT EXISTS idx_hacker_trap_logs_timestamp ON hacker_trap_logs(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_defense_implementations_attack_type ON defense_implementations(attack_type);
CREATE INDEX IF NOT EXISTS idx_defense_implementations_priority ON defense_implementations(priority);
CREATE INDEX IF NOT EXISTS idx_defense_implementations_effectiveness ON defense_implementations(effectiveness DESC);

CREATE INDEX IF NOT EXISTS idx_blocked_ips_ip_address ON blocked_ips(ip_address);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_is_active ON blocked_ips(is_active);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_unblock_at ON blocked_ips(unblock_at);

-- RLS Policies
ALTER TABLE user_memory_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE hacker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hacker_trap_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE defense_implementations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_ips ENABLE ROW LEVEL SECURITY;

-- Users can access their own memory context
CREATE POLICY "Users can access own memory context" ON user_memory_context
    FOR ALL USING (user_id = auth.uid());

-- Users can access their own preferences
CREATE POLICY "Users can access own preferences" ON user_preferences
    FOR ALL USING (user_id = auth.uid());

-- Only admins can access security tables
CREATE POLICY "Admins can access hacker profiles" ON hacker_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access trap logs" ON hacker_trap_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access defense implementations" ON defense_implementations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access blocked IPs" ON blocked_ips
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Functions and triggers
CREATE OR REPLACE FUNCTION update_user_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_user_preferences_updated_at();

-- Function to check if IP is currently blocked
CREATE OR REPLACE FUNCTION is_ip_blocked(check_ip TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM blocked_ips 
        WHERE ip_address = check_ip 
        AND is_active = TRUE 
        AND unblock_at > NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- Function to automatically unblock expired IPs
CREATE OR REPLACE FUNCTION cleanup_expired_blocks()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE blocked_ips 
    SET is_active = FALSE 
    WHERE is_active = TRUE AND unblock_at <= NOW();
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE user_memory_context IS 'Stores user conversation context for personalized AI responses';
COMMENT ON TABLE user_preferences IS 'User preferences and AI personality settings';
COMMENT ON TABLE hacker_profiles IS 'Profiles of detected hackers and their attack patterns';
COMMENT ON TABLE hacker_trap_logs IS 'Logs of successful hacker traps and generated defenses';
COMMENT ON TABLE defense_implementations IS 'Auto-generated defense implementations from hacker solutions';
COMMENT ON TABLE blocked_ips IS 'IP addresses blocked by the intelligent hacker trap system';

COMMENT ON COLUMN user_memory_context.topics IS 'Array of conversation topics for context analysis';
COMMENT ON COLUMN user_memory_context.sentiment IS 'Detected sentiment: positive, neutral, or negative';
COMMENT ON COLUMN user_preferences.preferences IS 'JSON object containing user preferences';
COMMENT ON COLUMN hacker_profiles.skill_level IS 'Assessed hacker skill level based on attack sophistication';
COMMENT ON COLUMN defense_implementations.effectiveness IS 'Percentage effectiveness of the defense (0-100)';
COMMENT ON COLUMN blocked_ips.block_duration IS 'Block duration in milliseconds';
