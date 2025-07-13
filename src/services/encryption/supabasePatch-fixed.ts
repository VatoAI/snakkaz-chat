/**
 * SnakkaZ Beta - Complete Database Schema Migration
 * 
 * This file contains the complete database schema for SnakkaZ Chat Beta
 * including all missing tables for the invite system, analytics, and chat features.
 * 
 * Run this in your Supabase SQL editor to set up the complete database.
 */

export const SNAKKAZ_COMPLETE_SCHEMA = `
-- ===================================================================
-- SNAKKAZ CHAT BETA - COMPLETE DATABASE SCHEMA
-- Version: 1.0.0 - Production Ready
-- Date: July 13, 2025
-- ===================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===================================================================
-- INVITE SYSTEM TABLES
-- ===================================================================

-- Invites Table - Core invite tracking
CREATE TABLE IF NOT EXISTS invites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    inviter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'app' CHECK (type IN ('app', 'group', 'room')),
    target_id UUID, -- group or room id (nullable for app invites)
    uses_count INTEGER DEFAULT 0,
    max_uses INTEGER DEFAULT 1,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Invite Clicks Table - Analytics tracking
CREATE TABLE IF NOT EXISTS invite_clicks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    invite_id UUID REFERENCES invites(id) ON DELETE CASCADE NOT NULL,
    platform VARCHAR(50) NOT NULL, -- 'whatsapp', 'telegram', 'facebook', etc.
    user_agent TEXT,
    ip_address INET,
    referrer TEXT,
    converted BOOLEAN DEFAULT false,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- set when converted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Invite Conversions Table - Success tracking
CREATE TABLE IF NOT EXISTS invite_conversions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    invite_id UUID REFERENCES invites(id) ON DELETE CASCADE NOT NULL,
    click_id UUID REFERENCES invite_clicks(id) ON DELETE SET NULL,
    inviter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    invitee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    bonus_points INTEGER DEFAULT 10,
    converted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(invite_id, invitee_id) -- Prevent duplicate conversions
);

-- ===================================================================
-- ENHANCED CHAT SYSTEM TABLES
-- ===================================================================

-- Chat Rooms Table (enhanced)
CREATE TABLE IF NOT EXISTS chat_rooms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL DEFAULT 'public' CHECK (type IN ('public', 'private', 'group')),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    max_participants INTEGER DEFAULT 1000,
    invite_code VARCHAR(20) UNIQUE, -- For room-specific invites
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Messages Table (enhanced)
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system', 'emoji')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_edited BOOLEAN DEFAULT false,
    reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    reactions JSONB DEFAULT '[]'::jsonb, -- Store emoji reactions
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Message Reactions Table (for detailed reaction tracking)
CREATE TABLE IF NOT EXISTS message_reactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(message_id, user_id, emoji) -- One reaction per user per emoji per message
);

-- Room Participants Table (enhanced)
CREATE TABLE IF NOT EXISTS room_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    is_typing BOOLEAN DEFAULT false,
    typing_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(room_id, user_id)
);

-- User Profiles Table (enhanced)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'away', 'busy', 'offline')),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    bonus_points INTEGER DEFAULT 0, -- Gamification points
    referral_code VARCHAR(20) UNIQUE, -- Personal referral code
    referred_by UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Who referred this user
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ===================================================================
-- ANALYTICS & MONITORING TABLES
-- ===================================================================

-- User Analytics Table
CREATE TABLE IF NOT EXISTS user_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- 'login', 'message_sent', 'invite_sent', etc.
    event_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Performance Metrics Table
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    metric_name VARCHAR(50) NOT NULL,
    metric_value DECIMAL,
    metric_unit VARCHAR(20),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ===================================================================
-- INDEXES FOR PERFORMANCE
-- ===================================================================

-- Invite system indexes
CREATE INDEX IF NOT EXISTS idx_invites_inviter_id ON invites(inviter_id);
CREATE INDEX IF NOT EXISTS idx_invites_code ON invites(code);
CREATE INDEX IF NOT EXISTS idx_invites_type ON invites(type);
CREATE INDEX IF NOT EXISTS idx_invite_clicks_invite_id ON invite_clicks(invite_id);
CREATE INDEX IF NOT EXISTS idx_invite_clicks_platform ON invite_clicks(platform);
CREATE INDEX IF NOT EXISTS idx_invite_clicks_created_at ON invite_clicks(created_at);
CREATE INDEX IF NOT EXISTS idx_invite_conversions_inviter_id ON invite_conversions(inviter_id);
CREATE INDEX IF NOT EXISTS idx_invite_conversions_invitee_id ON invite_conversions(invitee_id);

-- Chat system indexes
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_message_reactions_message_id ON message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_room_id ON room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_user_id ON room_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_referral_code ON user_profiles(referral_code);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_event_type ON user_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_user_analytics_created_at ON user_analytics(created_at);

-- ===================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================================

-- Enable RLS on all tables
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- Invite system policies
CREATE POLICY "Users can view their own invites" ON invites
    FOR SELECT USING (auth.uid() = inviter_id);

CREATE POLICY "Users can create invites" ON invites
    FOR INSERT WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Users can update their own invites" ON invites
    FOR UPDATE USING (auth.uid() = inviter_id);

CREATE POLICY "Anyone can view invite clicks for analytics" ON invite_clicks
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create invite clicks" ON invite_clicks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their conversion data" ON invite_conversions
    FOR SELECT USING (auth.uid() = inviter_id OR auth.uid() = invitee_id);

-- Chat rooms policies
CREATE POLICY "Public rooms are viewable by everyone" ON chat_rooms
    FOR SELECT USING (type = 'public');

CREATE POLICY "Users can create rooms" ON chat_rooms
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room creators can update their rooms" ON chat_rooms
    FOR UPDATE USING (auth.uid() = created_by);

-- Messages policies
CREATE POLICY "Users can view messages in public rooms" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_rooms 
            WHERE chat_rooms.id = messages.room_id 
            AND chat_rooms.type = 'public'
        )
    );

CREATE POLICY "Users can view messages in rooms they participate in" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM room_participants 
            WHERE room_participants.room_id = messages.room_id 
            AND room_participants.user_id = auth.uid()
            AND room_participants.is_active = true
        )
    );

CREATE POLICY "Users can insert messages in accessible rooms" ON messages
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND (
            EXISTS (
                SELECT 1 FROM chat_rooms 
                WHERE chat_rooms.id = messages.room_id 
                AND chat_rooms.type = 'public'
            ) OR
            EXISTS (
                SELECT 1 FROM room_participants 
                WHERE room_participants.room_id = messages.room_id 
                AND room_participants.user_id = auth.uid()
                AND room_participants.is_active = true
            )
        )
    );

CREATE POLICY "Users can update their own messages" ON messages
    FOR UPDATE USING (auth.uid() = user_id);

-- Message reactions policies
CREATE POLICY "Users can view reactions in accessible rooms" ON message_reactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM messages 
            JOIN chat_rooms ON messages.room_id = chat_rooms.id
            WHERE messages.id = message_reactions.message_id 
            AND (
                chat_rooms.type = 'public' OR
                EXISTS (
                    SELECT 1 FROM room_participants 
                    WHERE room_participants.room_id = chat_rooms.id 
                    AND room_participants.user_id = auth.uid()
                    AND room_participants.is_active = true
                )
            )
        )
    );

CREATE POLICY "Users can add reactions" ON message_reactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own reactions" ON message_reactions
    FOR DELETE USING (auth.uid() = user_id);

-- Room participants policies
CREATE POLICY "Users can view participants in rooms they're in" ON room_participants
    FOR SELECT USING (
        user_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM room_participants rp 
            WHERE rp.room_id = room_participants.room_id 
            AND rp.user_id = auth.uid()
            AND rp.is_active = true
        )
    );

CREATE POLICY "Users can join rooms" ON room_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their participation" ON room_participants
    FOR UPDATE USING (auth.uid() = user_id);

-- User profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Analytics policies (admin only for now)
CREATE POLICY "Users can view their own analytics" ON user_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert analytics" ON user_analytics
    FOR INSERT WITH CHECK (true);

-- Performance metrics (admin only)
CREATE POLICY "Performance metrics are admin-only" ON performance_metrics
    FOR ALL USING (false); -- Restrict for now, implement admin check later

-- ===================================================================
-- FUNCTIONS AND TRIGGERS
-- ===================================================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
    new_referral_code TEXT;
BEGIN
    -- Generate unique referral code
    new_referral_code := UPPER(SUBSTRING(MD5(NEW.id::text) FROM 1 FOR 8));
    
    -- Insert user profile
    INSERT INTO user_profiles (
        id, 
        username, 
        display_name, 
        referral_code,
        referred_by
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        new_referral_code,
        CASE 
            WHEN NEW.raw_user_meta_data->>'referred_by' IS NOT NULL 
            THEN (NEW.raw_user_meta_data->>'referred_by')::UUID
            ELSE NULL
        END
    );
    
    -- Award referral bonus if user was referred
    IF NEW.raw_user_meta_data->>'referred_by' IS NOT NULL THEN
        UPDATE user_profiles 
        SET bonus_points = bonus_points + 10
        WHERE id = (NEW.raw_user_meta_data->>'referred_by')::UUID;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update user status and last seen
CREATE OR REPLACE FUNCTION update_user_status(new_status TEXT DEFAULT 'online')
RETURNS void AS $$
BEGIN
    UPDATE user_profiles 
    SET 
        status = new_status, 
        last_seen_at = NOW(),
        updated_at = NOW()
    WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate unique invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate 8-character code
        new_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM invites WHERE code = new_code) INTO code_exists;
        
        -- Exit loop if code is unique
        IF NOT code_exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Function to track invite conversion
CREATE OR REPLACE FUNCTION process_invite_conversion(
    invite_code_param TEXT,
    new_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    invite_record invites%ROWTYPE;
    click_record invite_clicks%ROWTYPE;
BEGIN
    -- Get invite record
    SELECT * INTO invite_record 
    FROM invites 
    WHERE code = invite_code_param AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Check if invite is still valid
    IF invite_record.expires_at IS NOT NULL AND invite_record.expires_at < NOW() THEN
        RETURN false;
    END IF;
    
    IF invite_record.uses_count >= invite_record.max_uses THEN
        RETURN false;
    END IF;
    
    -- Get latest click for this invite (optional)
    SELECT * INTO click_record 
    FROM invite_clicks 
    WHERE invite_id = invite_record.id 
    ORDER BY created_at DESC 
    LIMIT 1;
    
    -- Create conversion record
    INSERT INTO invite_conversions (
        invite_id,
        click_id,
        inviter_id,
        invitee_id,
        bonus_points
    ) VALUES (
        invite_record.id,
        click_record.id,
        invite_record.inviter_id,
        new_user_id,
        10
    );
    
    -- Update invite usage count
    UPDATE invites 
    SET uses_count = uses_count + 1,
        updated_at = NOW()
    WHERE id = invite_record.id;
    
    -- Mark click as converted
    IF click_record.id IS NOT NULL THEN
        UPDATE invite_clicks 
        SET converted = true,
            user_id = new_user_id
        WHERE id = click_record.id;
    END IF;
    
    -- Award bonus points to inviter
    UPDATE user_profiles 
    SET bonus_points = bonus_points + 10,
        updated_at = NOW()
    WHERE id = invite_record.inviter_id;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- DEFAULT DATA
-- ===================================================================

-- Insert default public rooms
INSERT INTO chat_rooms (id, name, description, type, created_by) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Generell', 'Generell diskusjon for alle brukere', 'public', NULL),
    ('550e8400-e29b-41d4-a716-446655440002', 'Teknologi', 'Diskuter teknologi, programmering og innovasjon', 'public', NULL),
    ('550e8400-e29b-41d4-a716-446655440003', 'Gaming', 'Gaming diskusjoner, anmeldelser og tips', 'public', NULL),
    ('550e8400-e29b-41d4-a716-446655440004', 'Musikk', 'Del og diskuter musikk, artister og konserter', 'public', NULL),
    ('550e8400-e29b-41d4-a716-446655440005', 'Beta Testing', 'Feedback og bug reports for SnakkaZ Beta', 'public', NULL)
ON CONFLICT (id) DO NOTHING;

-- Add welcome messages to rooms
INSERT INTO messages (id, room_id, user_id, content, message_type) VALUES
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440001', NULL, 'Velkommen til SnakkaZ Chat Beta! 🚀 Dette er generell-rommet hvor alle kan chatte.', 'system'),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440002', NULL, 'Velkommen til teknologi-rommet! 💻 Del dine tech-tips og diskuter fremtidens teknologi.', 'system'),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440003', NULL, 'Velkommen til gaming-rommet! 🎮 Diskuter dine favorittspill og gaming-nyheter.', 'system'),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440004', NULL, 'Velkommen til musikk-rommet! 🎵 Del dine favorittlåter og musikk-anbefalinger.', 'system'),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440005', NULL, 'Velkommen til beta testing-rommet! 🧪 Rapporter bugs og del feedback her.', 'system');

-- ===================================================================
-- VIEWS FOR ANALYTICS
-- ===================================================================

-- Invite statistics view
CREATE OR REPLACE VIEW invite_statistics AS
SELECT 
    i.inviter_id,
    COUNT(i.id) as total_invites_created,
    COUNT(ic.id) as total_clicks,
    COUNT(CASE WHEN ic.converted = true THEN 1 END) as total_conversions,
    CASE 
        WHEN COUNT(ic.id) > 0 
        THEN ROUND((COUNT(CASE WHEN ic.converted = true THEN 1 END)::DECIMAL / COUNT(ic.id)) * 100, 2)
        ELSE 0 
    END as conversion_rate_percent,
    SUM(icv.bonus_points) as total_bonus_points_earned
FROM invites i
LEFT JOIN invite_clicks ic ON i.id = ic.invite_id
LEFT JOIN invite_conversions icv ON i.id = icv.invite_id
GROUP BY i.inviter_id;

-- Room activity view
CREATE OR REPLACE VIEW room_activity AS
SELECT 
    cr.id as room_id,
    cr.name as room_name,
    COUNT(DISTINCT rp.user_id) as total_participants,
    COUNT(DISTINCT CASE WHEN rp.is_active = true THEN rp.user_id END) as active_participants,
    COUNT(m.id) as total_messages,
    COUNT(CASE WHEN m.created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as messages_last_24h,
    MAX(m.created_at) as last_message_at
FROM chat_rooms cr
LEFT JOIN room_participants rp ON cr.id = rp.room_id
LEFT JOIN messages m ON cr.id = m.room_id
GROUP BY cr.id, cr.name;

-- User engagement view
CREATE OR REPLACE VIEW user_engagement AS
SELECT 
    up.id as user_id,
    up.username,
    up.display_name,
    up.bonus_points,
    COUNT(DISTINCT rp.room_id) as rooms_joined,
    COUNT(m.id) as messages_sent,
    COUNT(CASE WHEN m.created_at > NOW() - INTERVAL '7 days' THEN 1 END) as messages_last_7_days,
    COUNT(i.id) as invites_sent,
    COALESCE(istat.total_conversions, 0) as successful_referrals,
    up.last_seen_at
FROM user_profiles up
LEFT JOIN room_participants rp ON up.id = rp.user_id AND rp.is_active = true
LEFT JOIN messages m ON up.id = m.user_id
LEFT JOIN invites i ON up.id = i.inviter_id
LEFT JOIN invite_statistics istat ON up.id = istat.inviter_id
GROUP BY up.id, up.username, up.display_name, up.bonus_points, up.last_seen_at, istat.total_conversions;

-- Platform performance view
CREATE OR REPLACE VIEW platform_performance AS
SELECT 
    ic.platform,
    COUNT(*) as total_clicks,
    COUNT(CASE WHEN ic.converted = true THEN 1 END) as conversions,
    CASE 
        WHEN COUNT(*) > 0 
        THEN ROUND((COUNT(CASE WHEN ic.converted = true THEN 1 END)::DECIMAL / COUNT(*)) * 100, 2)
        ELSE 0 
    END as conversion_rate_percent
FROM invite_clicks ic
GROUP BY ic.platform
ORDER BY conversions DESC;

COMMENT ON TABLE invites IS 'Core invite tracking system for viral growth';
COMMENT ON TABLE invite_clicks IS 'Analytics for invite link clicks';
COMMENT ON TABLE invite_conversions IS 'Successful conversions from invites';
COMMENT ON TABLE user_profiles IS 'Extended user information with gamification';
COMMENT ON TABLE message_reactions IS 'Emoji reactions to messages';
COMMENT ON VIEW invite_statistics IS 'Aggregated invite performance per user';
COMMENT ON VIEW room_activity IS 'Room engagement and activity metrics';
COMMENT ON VIEW user_engagement IS 'User activity and engagement metrics';
COMMENT ON VIEW platform_performance IS 'Platform-wise invite performance';

-- ===================================================================
-- FINAL SETUP
-- ===================================================================

-- Grant permissions for service role (for server-side operations)
-- These would be set up in Supabase dashboard or via service role

NOTIFY pgsql_notify, 'SnakkaZ Beta database schema setup complete! 🚀';
`;

/**
 * Function to execute the schema
 * This should be run in Supabase SQL editor
 */
export const executeSchema = async () => {
  console.log('To set up the database:');
  console.log('1. Copy the SNAKKAZ_COMPLETE_SCHEMA constant');
  console.log('2. Go to your Supabase project > SQL Editor');
  console.log('3. Paste and execute the schema');
  console.log('4. Verify all tables are created');
  
  return SNAKKAZ_COMPLETE_SCHEMA;
};

/**
 * Migration status checker
 */
export const checkMigrationStatus = async () => {
  // This would check if tables exist in the database
  // Implementation depends on your database connection
  return {
    invites: false,
    invite_clicks: false,
    invite_conversions: false,
    // ... other tables
  };
};