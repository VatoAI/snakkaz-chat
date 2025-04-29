-- Migration: Add Ratchet State Table for Perfect Forward Secrecy
-- Created by: GitHub Copilot
-- Creates necessary database structure for the Double Ratchet algorithm

-- Create table for storing conversation ratchet states
CREATE TABLE IF NOT EXISTS public.conversation_ratchets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL UNIQUE,
  ratchet_state JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_conversation_ratchets_conversation_id ON public.conversation_ratchets (conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_ratchets_updated_at ON public.conversation_ratchets (updated_at);

-- Set up Row Level Security
ALTER TABLE public.conversation_ratchets ENABLE ROW LEVEL SECURITY;

-- Create policy for reading and writing ratchet states
CREATE POLICY "Users can manage their own conversation ratchets" ON public.conversation_ratchets
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
    AND (c.user_id_1 = auth.uid() OR c.user_id_2 = auth.uid())
  )
);

-- Create a trigger to auto-update the 'updated_at' field on changes
CREATE OR REPLACE FUNCTION update_ratchet_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ratchets_timestamp
BEFORE UPDATE ON public.conversation_ratchets
FOR EACH ROW
EXECUTE FUNCTION update_ratchet_timestamp();

-- Create a function to clean up old ratchet states (privacy protection)
CREATE OR REPLACE FUNCTION clean_old_ratchet_states()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete ratchet states older than 90 days that haven't been updated
  DELETE FROM public.conversation_ratchets
  WHERE updated_at < NOW() - INTERVAL '90 days';
  
  RETURN NULL;
END;
$$;

-- Create trigger to periodically clean up old ratchets
CREATE TRIGGER trigger_clean_old_ratchets
  AFTER INSERT ON public.conversation_ratchets
  FOR EACH STATEMENT
  EXECUTE FUNCTION clean_old_ratchet_states();

-- Set appropriate permissions
GRANT SELECT, INSERT, UPDATE ON public.conversation_ratchets TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.conversation_ratchets_id_seq TO authenticated;