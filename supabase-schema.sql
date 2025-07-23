-- SnakkaZ Beta Database Schema for Supabase
-- Optimized for real-time chat with WebRTC + MCP integration
-- Based on Supabase best practices and community examples

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===== USER PROFILES =====
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    username VARCHAR(24) NOT NULL UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'away', 'busy')),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Username validation: 3-24 chars, alphanumeric + underscore
    CONSTRAINT username_validation CHECK (username ~* '^[A-Za-z0-9_]{3,24}$')
);

COMMENT ON TABLE public.profiles IS 'User profiles for SnakkaZ chat system';

-- ===== CHAT ROOMS =====
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    room_type TEXT DEFAULT 'public' CHECK (room_type IN ('public', 'private', 'direct')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    max_participants INTEGER DEFAULT 50,
    is_active BOOLEAN DEFAULT true,
    webrtc_enabled BOOLEAN DEFAULT true,
    e2ee_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON TABLE public.rooms IS 'Chat rooms for SnakkaZ with WebRTC support';

-- ===== ROOM PARTICIPANTS =====
CREATE TABLE IF NOT EXISTS public.room_participants (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    is_muted BOOLEAN DEFAULT false,
    webrtc_peer_id TEXT, -- For WebRTC connection tracking
    
    -- Unique constraint to prevent duplicate memberships
    UNIQUE(room_id, profile_id)
);

COMMENT ON TABLE public.room_participants IS 'Room membership tracking with WebRTC peer info';

-- ===== MESSAGES =====
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'system', 'webrtc')),
    reply_to UUID REFERENCES public.messages(id) ON DELETE SET NULL,
    is_encrypted BOOLEAN DEFAULT false,
    encryption_key_id TEXT, -- For E2EE key management
    metadata JSONB, -- For file attachments, WebRTC signals, etc.
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Ensure content is not empty for text messages
    CONSTRAINT content_not_empty CHECK (
        CASE 
            WHEN message_type = 'text' THEN char_length(trim(content)) > 0 
            ELSE true 
        END
    ),
    
    -- Limit message length
    CONSTRAINT content_length CHECK (char_length(content) <= 4000)
);

COMMENT ON TABLE public.messages IS 'Chat messages with E2EE and WebRTC support';

-- ===== BETA INVITES =====
CREATE TABLE IF NOT EXISTS public.beta_invites (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    invite_code TEXT NOT NULL UNIQUE,
    invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    email TEXT,
    used_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_used BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE public.beta_invites IS 'Beta invitation system for SnakkaZ';

-- ===== MCP CONNECTIONS =====
CREATE TABLE IF NOT EXISTS public.mcp_connections (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    connection_id TEXT NOT NULL,
    connection_type TEXT DEFAULT 'websocket' CHECK (connection_type IN ('websocket', 'webrtc', 'fallback')),
    server_endpoint TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    metadata JSONB, -- Connection details, capabilities, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON TABLE public.mcp_connections IS 'MCP server connection tracking';

-- ===== INDEXES FOR PERFORMANCE =====

-- Profiles indexes
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);
CREATE INDEX IF NOT EXISTS profiles_status_idx ON public.profiles(status);
CREATE INDEX IF NOT EXISTS profiles_last_seen_idx ON public.profiles(last_seen);

-- Room indexes
CREATE INDEX IF NOT EXISTS rooms_type_active_idx ON public.rooms(room_type, is_active);
CREATE INDEX IF NOT EXISTS rooms_created_by_idx ON public.rooms(created_by);

-- Room participants indexes
CREATE INDEX IF NOT EXISTS room_participants_room_idx ON public.room_participants(room_id);
CREATE INDEX IF NOT EXISTS room_participants_profile_idx ON public.room_participants(profile_id);
CREATE INDEX IF NOT EXISTS room_participants_activity_idx ON public.room_participants(last_activity);

-- Messages indexes
CREATE INDEX IF NOT EXISTS messages_room_created_idx ON public.messages(room_id, created_at DESC);
CREATE INDEX IF NOT EXISTS messages_profile_idx ON public.messages(profile_id);
CREATE INDEX IF NOT EXISTS messages_reply_idx ON public.messages(reply_to) WHERE reply_to IS NOT NULL;
CREATE INDEX IF NOT EXISTS messages_type_idx ON public.messages(message_type);

-- Beta invites indexes
CREATE INDEX IF NOT EXISTS beta_invites_code_idx ON public.beta_invites(invite_code);
CREATE INDEX IF NOT EXISTS beta_invites_email_idx ON public.beta_invites(email);
CREATE INDEX IF NOT EXISTS beta_invites_expires_idx ON public.beta_invites(expires_at);

-- MCP connections indexes
CREATE INDEX IF NOT EXISTS mcp_connections_profile_idx ON public.mcp_connections(profile_id);
CREATE INDEX IF NOT EXISTS mcp_connections_active_idx ON public.mcp_connections(is_active);
CREATE INDEX IF NOT EXISTS mcp_connections_heartbeat_idx ON public.mcp_connections(last_heartbeat);

-- ===== ROW LEVEL SECURITY (RLS) =====

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beta_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcp_connections ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Rooms policies
CREATE POLICY "Public rooms are viewable by everyone" ON public.rooms
    FOR SELECT USING (room_type = 'public' OR id IN (
        SELECT room_id FROM public.room_participants 
        WHERE profile_id = auth.uid()
    ));

CREATE POLICY "Authenticated users can create rooms" ON public.rooms
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Room creators and admins can update rooms" ON public.rooms
    FOR UPDATE USING (
        created_by = auth.uid() OR 
        id IN (
            SELECT room_id FROM public.room_participants 
            WHERE profile_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Room participants policies
CREATE POLICY "Users can view room participants for rooms they're in" ON public.room_participants
    FOR SELECT USING (
        room_id IN (
            SELECT room_id FROM public.room_participants 
            WHERE profile_id = auth.uid()
        )
    );

CREATE POLICY "Users can join public rooms" ON public.room_participants
    FOR INSERT WITH CHECK (
        profile_id = auth.uid() AND
        room_id IN (SELECT id FROM public.rooms WHERE room_type = 'public')
    );

-- Messages policies
CREATE POLICY "Users can view messages in rooms they're part of" ON public.messages
    FOR SELECT USING (
        room_id IN (
            SELECT room_id FROM public.room_participants 
            WHERE profile_id = auth.uid()
        )
    );

CREATE POLICY "Users can send messages to rooms they're part of" ON public.messages
    FOR INSERT WITH CHECK (
        profile_id = auth.uid() AND
        room_id IN (
            SELECT room_id FROM public.room_participants 
            WHERE profile_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own messages" ON public.messages
    FOR UPDATE USING (profile_id = auth.uid());

-- Beta invites policies
CREATE POLICY "Anyone can view unused invites by code" ON public.beta_invites
    FOR SELECT USING (NOT is_used AND expires_at > NOW());

CREATE POLICY "Authenticated users can create invites" ON public.beta_invites
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- MCP connections policies
CREATE POLICY "Users can manage their own MCP connections" ON public.mcp_connections
    FOR ALL USING (profile_id = auth.uid());

-- ===== REALTIME PUBLICATION =====

-- Enable realtime for key tables
BEGIN;
    DROP PUBLICATION IF EXISTS supabase_realtime;
    CREATE PUBLICATION supabase_realtime;
COMMIT;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mcp_connections;

-- ===== FUNCTIONS =====

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
        COALESCE(new.raw_user_meta_data->>'display_name', new.email)
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update user last_seen
CREATE OR REPLACE FUNCTION public.update_user_last_seen(user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.profiles 
    SET last_seen = NOW(), status = 'online'
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate beta invite
CREATE OR REPLACE FUNCTION public.generate_beta_invite(invited_email TEXT DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    invite_code TEXT;
BEGIN
    invite_code := 'snakkaz_' || substr(gen_random_uuid()::text, 1, 8);
    
    INSERT INTO public.beta_invites (invite_code, invited_by, email)
    VALUES (invite_code, auth.uid(), invited_email);
    
    RETURN invite_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to use beta invite
CREATE OR REPLACE FUNCTION public.use_beta_invite(code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    invite_record RECORD;
BEGIN
    SELECT * INTO invite_record
    FROM public.beta_invites
    WHERE invite_code = code
    AND NOT is_used
    AND expires_at > NOW();
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    UPDATE public.beta_invites
    SET is_used = true, used_by = auth.uid(), used_at = NOW()
    WHERE invite_code = code;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== SAMPLE DATA =====

-- Create a default public room
INSERT INTO public.rooms (id, name, description, room_type, webrtc_enabled, e2ee_enabled)
VALUES (
    gen_random_uuid(),
    'SnakkaZ Beta Lounge',
    'Welcome to SnakkaZ Beta! Test all features here.',
    'public',
    true,
    true
) ON CONFLICT DO NOTHING;

-- Create a sample beta invite
INSERT INTO public.beta_invites (invite_code, email)
VALUES ('snakkaz_beta2025', null)
ON CONFLICT (invite_code) DO NOTHING;

-- ===== SUCCESS MESSAGE =====
DO $$
BEGIN
    RAISE NOTICE '🚀 SnakkaZ Beta Database Schema created successfully!';
    RAISE NOTICE '✅ Tables: profiles, rooms, room_participants, messages, beta_invites, mcp_connections';
    RAISE NOTICE '✅ RLS policies: Enabled with secure access controls';
    RAISE NOTICE '✅ Realtime: Enabled for all key tables';
    RAISE NOTICE '✅ Functions: User registration, last_seen, beta invites';
    RAISE NOTICE '✅ Sample data: Default room and beta invite created';
    RAISE NOTICE '🎯 Ready for SnakkaZ Beta Launch!';
END $$;
