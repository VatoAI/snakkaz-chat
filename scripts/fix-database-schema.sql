-- SnakkaZ Database Schema Fix Script
-- This script checks for missing tables and creates them if needed

-- Create chat_rooms table if it doesn't exist
-- (Required if 'rooms' table was used incorrectly in the code)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'chat_rooms') THEN
        CREATE TABLE IF NOT EXISTS public.chat_rooms (
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

        COMMENT ON TABLE public.chat_rooms IS 'Chat rooms for SnakkaZ with WebRTC support';
    END IF;
END
$$;

-- Create MCP connections table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'mcp_connections') THEN
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
    END IF;
END
$$;

-- If rooms table exists but chat_rooms doesn't, copy data from rooms to chat_rooms
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'rooms') 
       AND EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'chat_rooms') THEN
       
        -- Copy data if chat_rooms is empty
        IF (SELECT COUNT(*) FROM public.chat_rooms) = 0 THEN
            INSERT INTO public.chat_rooms (
                id, name, description, room_type, created_by, max_participants,
                is_active, webrtc_enabled, e2ee_enabled, created_at, updated_at
            )
            SELECT 
                id, name, description, 
                CASE WHEN room_type IN ('public', 'private', 'direct') THEN room_type ELSE 'public' END,
                created_by, max_participants, is_active, true, true, created_at, updated_at
            FROM public.rooms;
        END IF;
    END IF;
END
$$;
