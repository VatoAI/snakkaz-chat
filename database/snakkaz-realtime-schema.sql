-- SnakkaZ Real-time Chat Database Schema
-- PostgreSQL/Supabase optimized for Telegram-style group chat

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Enhanced user profiles)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    superpower_level INTEGER DEFAULT 1,
    chat_messages_count INTEGER DEFAULT 0,
    is_online BOOLEAN DEFAULT false,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. GROUPS TABLE (Telegram-style groups)
CREATE TABLE IF NOT EXISTS groups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    avatar_url TEXT,
    group_type TEXT DEFAULT 'public' CHECK (group_type IN ('public', 'private', 'channel')),
    member_count INTEGER DEFAULT 0,
    max_members INTEGER DEFAULT 200000,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. GROUP MEMBERS TABLE (User membership in groups)
CREATE TABLE IF NOT EXISTS group_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'restricted')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- 4. MESSAGES TABLE (Real-time chat messages)
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'voice', 'video')),
    file_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    reply_to UUID REFERENCES messages(id) ON DELETE SET NULL,
    edited_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. MESSAGE REACTIONS TABLE (Emoji reactions)
CREATE TABLE IF NOT EXISTS message_reactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(message_id, user_id, emoji)
);

-- 6. TYPING INDICATORS TABLE (Real-time typing status)
CREATE TABLE IF NOT EXISTS typing_indicators (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    is_typing BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- 7. MARKETPLACE PRODUCTS TABLE (Hybrid chat + marketplace)
CREATE TABLE IF NOT EXISTS marketplace_products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    currency TEXT DEFAULT 'NOK',
    images TEXT[], -- Array of image URLs
    category TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Groups policies
CREATE POLICY "Users can view groups they're members of" ON groups FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM group_members 
        WHERE group_id = groups.id AND user_id = auth.uid()
    ) OR group_type = 'public'
);

CREATE POLICY "Users can create groups" ON groups FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Group admins can update groups" ON groups FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM group_members 
        WHERE group_id = groups.id AND user_id = auth.uid() AND role IN ('owner', 'admin')
    )
);

-- Group members policies
CREATE POLICY "Users can view group members" ON group_members FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM group_members gm2 
        WHERE gm2.group_id = group_members.group_id AND gm2.user_id = auth.uid()
    )
);

CREATE POLICY "Users can join/leave groups" ON group_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave groups" ON group_members FOR DELETE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages in their groups" ON messages FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM group_members 
        WHERE group_id = messages.group_id AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can send messages to their groups" ON messages FOR INSERT 
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM group_members 
        WHERE group_id = messages.group_id AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can edit own messages" ON messages FOR UPDATE 
USING (auth.uid() = user_id);

-- Message reactions policies
CREATE POLICY "Users can view reactions" ON message_reactions FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM messages m
        JOIN group_members gm ON m.group_id = gm.group_id
        WHERE m.id = message_reactions.message_id AND gm.user_id = auth.uid()
    )
);

CREATE POLICY "Users can add/remove own reactions" ON message_reactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own reactions" ON message_reactions FOR DELETE 
USING (auth.uid() = user_id);

-- Typing indicators policies
CREATE POLICY "Users can view typing indicators" ON typing_indicators FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM group_members 
        WHERE group_id = typing_indicators.group_id AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can update own typing status" ON typing_indicators 
FOR ALL USING (auth.uid() = user_id);

-- Marketplace policies
CREATE POLICY "Users can view marketplace products" ON marketplace_products FOR SELECT USING (true);
CREATE POLICY "Users can create own products" ON marketplace_products FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update own products" ON marketplace_products FOR UPDATE USING (auth.uid() = seller_id);

-- FUNCTIONS AND TRIGGERS

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, email, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update group member count
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE groups SET member_count = member_count - 1 WHERE id = OLD.group_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update user message count
CREATE OR REPLACE FUNCTION update_user_message_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE profiles SET chat_messages_count = chat_messages_count + 1 WHERE id = NEW.user_id;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to clean old typing indicators
CREATE OR REPLACE FUNCTION clean_old_typing_indicators()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM typing_indicators 
    WHERE created_at < NOW() - INTERVAL '30 seconds';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS

-- Auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_products_updated_at BEFORE UPDATE ON marketplace_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update group member counts
CREATE TRIGGER update_group_member_count_on_insert
    AFTER INSERT ON group_members
    FOR EACH ROW EXECUTE FUNCTION update_group_member_count();

CREATE TRIGGER update_group_member_count_on_delete
    AFTER DELETE ON group_members
    FOR EACH ROW EXECUTE FUNCTION update_group_member_count();

-- Update user message counts
CREATE TRIGGER update_user_message_count_on_insert
    AFTER INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION update_user_message_count();

-- Clean old typing indicators
CREATE TRIGGER clean_typing_indicators
    AFTER INSERT ON typing_indicators
    FOR EACH ROW EXECUTE FUNCTION clean_old_typing_indicators();

-- INDEXES FOR PERFORMANCE

CREATE INDEX IF NOT EXISTS idx_messages_group_id_created_at ON messages(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_message_id ON message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_typing_indicators_group_id ON typing_indicators(group_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_group_id ON marketplace_products(group_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- INSERT DEFAULT DATA

-- Create default SnakkaZ Beta Testing group
INSERT INTO groups (id, name, description, group_type, created_by) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'SnakkaZ Beta Testing',
    'Welcome to SnakkaZ! Test our hybrid chat + marketplace platform. Share feedback, connect with other beta testers, and explore AI superpowers!',
    'public',
    NULL
) ON CONFLICT DO NOTHING;

-- Insert some sample marketplace categories
INSERT INTO marketplace_products (id, seller_id, group_id, title, description, price, category, status) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    NULL,
    '00000000-0000-0000-0000-000000000001',
    'AI Superpower Boost',
    'Unlock advanced AI features for enhanced chat experience. Get smart auto-translate, context-aware responses, and personalized suggestions.',
    99.00,
    'AI Superpowers',
    'active'
) ON CONFLICT DO NOTHING;
