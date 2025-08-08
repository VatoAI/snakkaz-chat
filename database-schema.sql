-- 🚀 SNAKKAZ CHAT DATABASE SCHEMA
-- STEG 2: Supabase Database Setup
-- Version 1.0.0 - July 29, 2025

-- ===============================================
-- 1. PROFILES TABLE - User metadata & preferences
-- ===============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'away', 'busy', 'offline')),
  theme_preference TEXT DEFAULT 'liquid_dream' CHECK (theme_preference IN ('liquid_dream', 'dark', 'light')),
  language_preference TEXT DEFAULT 'no' CHECK (language_preference IN ('no', 'en', 'sv', 'da')),
  notification_settings JSONB DEFAULT '{"sound": true, "desktop": true, "email": false}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================================
-- 2. CHAT_ROOMS TABLE - Room management & settings
-- ===============================================
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  room_type TEXT DEFAULT 'group' CHECK (room_type IN ('direct', 'group', 'public', 'private')),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  members UUID[] DEFAULT '{}',
  settings JSONB DEFAULT '{"max_members": 100, "allow_file_upload": true, "encryption_enabled": true}'::jsonb,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================================
-- 3. MESSAGES TABLE - Real-time chat messages
-- ===============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'audio', 'video', 'system', 'ai_response')),
  thread_id UUID REFERENCES messages(id), -- For threaded conversations
  reply_to UUID REFERENCES messages(id),  -- For direct replies
  metadata JSONB DEFAULT '{}'::jsonb, -- File URLs, AI context, etc.
  encrypted BOOLEAN DEFAULT false,
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================================
-- 4. MESSAGE_ATTACHMENTS TABLE - File sharing
-- ===============================================
CREATE TABLE IF NOT EXISTS message_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL, -- Supabase Storage path
  thumbnail_path TEXT,        -- For images/videos
  upload_status TEXT DEFAULT 'uploading' CHECK (upload_status IN ('uploading', 'completed', 'failed')),
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================================
-- 5. ROOM_MEMBERS TABLE - Room membership tracking
-- ===============================================
CREATE TABLE IF NOT EXISTS room_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  notification_settings JSONB DEFAULT '{"mentions": true, "all_messages": true}'::jsonb,
  UNIQUE(room_id, user_id)
);

-- ===============================================
-- 6. TYPING_INDICATORS TABLE - Real-time typing
-- ===============================================
CREATE TABLE IF NOT EXISTS typing_indicators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- ===============================================
-- 7. MCP_SESSIONS TABLE - AI Chat Integration
-- ===============================================
CREATE TABLE IF NOT EXISTS mcp_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_context JSONB DEFAULT '{}'::jsonb,
  ai_provider TEXT DEFAULT 'claude' CHECK (ai_provider IN ('claude', 'openai', 'local')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================================
-- INDEXES FOR PERFORMANCE
-- ===============================================
CREATE INDEX IF NOT EXISTS idx_messages_room_id_created_at ON messages(room_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_room_members_user_id ON room_members(user_id);
CREATE INDEX IF NOT EXISTS idx_room_members_room_id ON room_members(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_owner_id ON chat_rooms(owner_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- ===============================================
-- UPDATED_AT TRIGGERS
-- ===============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_rooms_updated_at BEFORE UPDATE ON chat_rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mcp_sessions_updated_at BEFORE UPDATE ON mcp_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
