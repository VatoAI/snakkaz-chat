-- ===================================================================
-- SNAKKAZ CHAT BETA - CORRECTED SQL MIGRATION
-- Fixed: user_analytics room_id reference error
-- Date: July 13, 2025
-- ===================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===================================================================
-- INVITE SYSTEM TABLES (KRITISK FOR LANSERING)
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

-- User Profiles Table (enhanced with gamification)
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

-- User Analytics Table (FIXED - NO room_id reference)
CREATE TABLE IF NOT EXISTS user_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- 'login', 'message_sent', 'invite_sent', etc.
    event_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(100),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ===================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================================

-- Enable RLS on all tables
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- Chat Rooms Policies
CREATE POLICY "Users can view public rooms" ON chat_rooms
    FOR SELECT USING (type = 'public' OR id IN (
        SELECT room_id FROM room_participants WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can create rooms" ON chat_rooms
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Room creators can update their rooms" ON chat_rooms
    FOR UPDATE USING (created_by = auth.uid());

-- Messages Policies
CREATE POLICY "Users can view messages in their rooms" ON messages
    FOR SELECT USING (room_id IN (
        SELECT room_id FROM room_participants WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can insert messages in their rooms" ON messages
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND room_id IN (
            SELECT room_id FROM room_participants WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can edit their own messages" ON messages
    FOR UPDATE USING (user_id = auth.uid());

-- User Profiles Policies
CREATE POLICY "Users can view all profiles" ON user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Invites Policies
CREATE POLICY "Users can view their own invites" ON invites
    FOR SELECT USING (inviter_id = auth.uid());

CREATE POLICY "Users can create invites" ON invites
    FOR INSERT WITH CHECK (auth.uid() = inviter_id);

-- Room Participants Policies
CREATE POLICY "Users can view participants in their rooms" ON room_participants
    FOR SELECT USING (room_id IN (
        SELECT room_id FROM room_participants WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can join rooms" ON room_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Analytics Policies (FIXED - No room_id reference)
CREATE POLICY "Users can view their own analytics" ON user_analytics
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert analytics" ON user_analytics
    FOR INSERT WITH CHECK (true); -- Allow system to insert analytics

-- ===================================================================
-- INDEXES FOR PERFORMANCE
-- ===================================================================

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Room participants indexes
CREATE INDEX IF NOT EXISTS idx_room_participants_room_id ON room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_user_id ON room_participants(user_id);

-- Invites indexes
CREATE INDEX IF NOT EXISTS idx_invites_code ON invites(code);
CREATE INDEX IF NOT EXISTS idx_invites_inviter_id ON invites(inviter_id);

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_referral_code ON user_profiles(referral_code);

-- User analytics indexes
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_event_type ON user_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_user_analytics_created_at ON user_analytics(created_at DESC);

-- ===================================================================
-- TRIGGERS FOR AUTO-UPDATES
-- ===================================================================

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_chat_rooms_updated_at BEFORE UPDATE ON chat_rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================================================
-- VERIFICATION QUERY
-- ===================================================================

-- Run this to verify all tables are created correctly
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
