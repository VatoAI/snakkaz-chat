-- SnakkaZ Chat Database Schema Fix
-- Dette skriptet reparerer database-problemene som hindrer appen

-- Opprett chat_rooms tabellen med riktig struktur
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(20) DEFAULT 'public' CHECK (type IN ('public', 'private', 'group')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  max_participants INTEGER DEFAULT 100,
  participant_count INTEGER DEFAULT 0
);

-- Opprett mcp_connections tabellen
CREATE TABLE IF NOT EXISTS public.mcp_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES auth.users(id),
  connection_type VARCHAR(50) DEFAULT 'webrtc',
  server_url TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  connection_data JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Opprett profiles tabellen hvis den ikke eksisterer
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  display_name VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sett inn standard rom
INSERT INTO public.chat_rooms (name, description, type, created_by) VALUES
  ('General 🌊', 'Hovedrom for generell diskusjon med liquid design', 'public', NULL),
  ('Tech Talk 💻', 'Tekniske diskusjoner og utvikling', 'public', NULL),
  ('Random 🎲', 'Tilfeldig chat og moro', 'public', NULL),
  ('Liquid Design 🎨', 'Diskusjoner om design og UX', 'public', NULL)
ON CONFLICT DO NOTHING;

-- Oppdater row counts
UPDATE public.chat_rooms SET participant_count = 1 WHERE participant_count = 0;

-- Enable RLS (Row Level Security)
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcp_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Opprett policies for chat_rooms
CREATE POLICY "Allow all users to read chat rooms" ON public.chat_rooms
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to create chat rooms" ON public.chat_rooms
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Opprett policies for mcp_connections
CREATE POLICY "Users can view their own connections" ON public.mcp_connections
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own connections" ON public.mcp_connections
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Opprett policies for profiles
CREATE POLICY "Allow all users to read profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
