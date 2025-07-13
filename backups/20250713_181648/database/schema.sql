-- SnakkaZ Chat Beta - Database Schema
-- Production-ready setup for chat system

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Chat Rooms Table
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
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_edited BOOLEAN DEFAULT false,
    reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Room Participants Table (for private rooms and groups)
CREATE TABLE IF NOT EXISTS room_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(room_id, user_id)
);

-- User Profiles Table (extended user info)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(30) UNIQUE,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'away', 'busy', 'offline')),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_room_participants_room_id ON room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_user_id ON room_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Chat Rooms Policies
CREATE POLICY "Public rooms are viewable by everyone" ON chat_rooms
    FOR SELECT USING (type = 'public');

CREATE POLICY "Users can create rooms" ON chat_rooms
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room creators can update their rooms" ON chat_rooms
    FOR UPDATE USING (auth.uid() = created_by);

-- Messages Policies
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

CREATE POLICY "Users can insert messages in rooms they have access to" ON messages
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

-- Room Participants Policies
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

CREATE POLICY "Users can leave rooms" ON room_participants
    FOR UPDATE USING (auth.uid() = user_id);

-- User Profiles Policies
CREATE POLICY "Profiles are viewable by everyone" ON user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Functions for real-time subscriptions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO user_profiles (id, username, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update user status
CREATE OR REPLACE FUNCTION update_user_status(new_status TEXT)
RETURNS void AS $$
BEGIN
    UPDATE user_profiles 
    SET status = new_status, last_seen_at = NOW()
    WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default public rooms
INSERT INTO chat_rooms (id, name, description, type, created_by) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Generell', 'Generell diskusjon for alle brukere', 'public', NULL),
    ('550e8400-e29b-41d4-a716-446655440002', 'Teknologi', 'Diskuter teknologi, programmering og innovasjon', 'public', NULL),
    ('550e8400-e29b-41d4-a716-446655440003', 'Gaming', 'Gaming diskusjoner, anmeldelser og tips', 'public', NULL),
    ('550e8400-e29b-41d4-a716-446655440004', 'Musikk', 'Del og diskuter musikk, artister og konserter', 'public', NULL)
ON CONFLICT (id) DO NOTHING;

-- Add welcome messages to rooms
INSERT INTO messages (id, room_id, user_id, content, message_type) VALUES
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440001', NULL, 'Velkommen til SnakkaZ Chat Beta! 🚀 Dette er generell-rommet hvor alle kan chatte.', 'system'),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440002', NULL, 'Velkommen til teknologi-rommet! 💻 Del dine tech-tips og diskuter fremtidens teknologi.', 'system'),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440003', NULL, 'Velkommen til gaming-rommet! 🎮 Diskuter dine favorittspill og gaming-nyheter.', 'system'),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440004', NULL, 'Velkommen til musikk-rommet! 🎵 Del dine favorittlåter og musikk-anbefalinger.', 'system');
