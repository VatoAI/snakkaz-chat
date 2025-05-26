
-- Create table for sync events
CREATE TABLE IF NOT EXISTS public.sync_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type TEXT NOT NULL CHECK (sync_type IN ('github', 'supabase', 'domain')),
  status TEXT NOT NULL CHECK (status IN ('idle', 'syncing', 'success', 'error')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB
);

-- Create index on sync_type for faster queries
CREATE INDEX IF NOT EXISTS idx_sync_events_type ON public.sync_events (sync_type);

-- Create table for GitHub events
CREATE TABLE IF NOT EXISTS public.github_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  commit_id TEXT,
  commit_message TEXT,
  author TEXT,
  branch TEXT,
  repository TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  payload JSONB
);

-- Create table for domain health checks
CREATE TABLE IF NOT EXISTS public.domain_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('online', 'offline', 'degraded')),
  response_time INTEGER,
  checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  uptime_percentage NUMERIC(5,2) DEFAULT 100
);

-- Add RLS policies
ALTER TABLE public.sync_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_health ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view sync events
CREATE POLICY "Allow all users to view sync events" ON public.sync_events
  FOR SELECT USING (true);

-- Allow all authenticated users to view GitHub events
CREATE POLICY "Allow all users to view GitHub events" ON public.github_events
  FOR SELECT USING (true);

-- Allow all authenticated users to view domain health
CREATE POLICY "Allow all users to view domain health" ON public.domain_health
  FOR SELECT USING (true);
