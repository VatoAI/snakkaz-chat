-- SnakkaZ Chat Database Schema
-- This creates all necessary tables for the chat application

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create user profiles table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    status TEXT DEFAULT 'online' CHECK (status IN ('online', 'away', 'busy', 'offline')),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat rooms table
CREATE TABLE public.chat_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'group' CHECK (type IN ('private', 'group', 'marketplace', 'broadcast')),
    avatar_url TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    max_members INTEGER DEFAULT 10000,
    e2ee_enabled BOOLEAN DEFAULT TRUE,
    marketplace_enabled BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create room participants table (many-to-many relationship)
CREATE TABLE public.room_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_pinned BOOLEAN DEFAULT FALSE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    UNIQUE(room_id, user_id)
);

-- Create messages table
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'audio', 'video', 'system', 'marketplace')),
    file_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    thumbnail_url TEXT,
    reply_to UUID REFERENCES public.messages(id),
    edited_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure we have either content or file
    CONSTRAINT messages_content_check CHECK (
        (content IS NOT NULL AND content != '') OR 
        (file_url IS NOT NULL AND file_url != '')
    )
);

-- Create marketplace items table
CREATE TABLE public.marketplace_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    currency TEXT DEFAULT 'NOK',
    category TEXT,
    images TEXT[], -- Array of image URLs
    condition TEXT CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')),
    is_available BOOLEAN DEFAULT TRUE,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create file attachments table
CREATE TABLE public.file_attachments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    thumbnail_path TEXT,
    uploaded_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_messages_room_created ON public.messages(room_id, created_at DESC);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_room_participants_user ON public.room_participants(user_id);
CREATE INDEX idx_room_participants_room ON public.room_participants(room_id);
CREATE INDEX idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX idx_chat_rooms_type ON public.chat_rooms(type);
CREATE INDEX idx_marketplace_items_room ON public.marketplace_items(room_id, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User profiles: Users can read all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Chat rooms: Users can see rooms they're participants of
CREATE POLICY "Users can view rooms they participate in" ON public.chat_rooms
    FOR SELECT USING (
        id IN (
            SELECT room_id FROM public.room_participants 
            WHERE user_id = auth.uid()
        ) OR is_public = true
    );

CREATE POLICY "Users can create rooms" ON public.chat_rooms
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room creators and admins can update rooms" ON public.chat_rooms
    FOR UPDATE USING (
        auth.uid() = created_by OR
        auth.uid() IN (
            SELECT user_id FROM public.room_participants 
            WHERE room_id = id AND role IN ('admin', 'owner')
        )
    );

-- Room participants: Users can see participants of rooms they're in
CREATE POLICY "Users can view participants of their rooms" ON public.room_participants
    FOR SELECT USING (
        room_id IN (
            SELECT room_id FROM public.room_participants 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can join rooms" ON public.room_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms" ON public.room_participants
    FOR DELETE USING (auth.uid() = user_id);

-- Messages: Users can see messages from rooms they participate in
CREATE POLICY "Users can view messages from their rooms" ON public.messages
    FOR SELECT USING (
        room_id IN (
            SELECT room_id FROM public.room_participants 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can send messages to rooms they're in" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        room_id IN (
            SELECT room_id FROM public.room_participants 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own messages" ON public.messages
    FOR UPDATE USING (auth.uid() = sender_id);

CREATE POLICY "Users can delete their own messages" ON public.messages
    FOR DELETE USING (auth.uid() = sender_id);

-- Marketplace items: Users can see items from rooms they participate in
CREATE POLICY "Users can view marketplace items from their rooms" ON public.marketplace_items
    FOR SELECT USING (
        room_id IN (
            SELECT room_id FROM public.room_participants 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create marketplace items" ON public.marketplace_items
    FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own items" ON public.marketplace_items
    FOR UPDATE USING (auth.uid() = seller_id);

-- File attachments: Users can see files from messages they can access
CREATE POLICY "Users can view file attachments from accessible messages" ON public.file_attachments
    FOR SELECT USING (
        message_id IN (
            SELECT id FROM public.messages 
            WHERE room_id IN (
                SELECT room_id FROM public.room_participants 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can upload file attachments" ON public.file_attachments
    FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- Create functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name, username)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_chat_rooms_updated_at BEFORE UPDATE ON public.chat_rooms
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_marketplace_items_updated_at BEFORE UPDATE ON public.marketplace_items
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_rooms;

-- Insert some default data
INSERT INTO public.chat_rooms (id, name, description, type, is_public, marketplace_enabled, e2ee_enabled) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'SnakkaZ Norge 🇳🇴', 'Hovedchat for norske brukere', 'group', true, true, true),
    ('550e8400-e29b-41d4-a716-446655440002', 'Oslo Tech Meetup', 'For tech-interesserte i Oslo området', 'group', true, false, true),
    ('550e8400-e29b-41d4-a716-446655440003', 'Norsk Crypto Trading', 'Handel og diskusjon om kryptovaluta', 'marketplace', true, true, true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
