-- Custom Emojis Database Migration for SNAKKAZ Chat
-- Created: May 25, 2025
-- This migration creates the custom_emojis table and related functionality

-- Create custom_emojis table
CREATE TABLE IF NOT EXISTS public.custom_emojis (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shortcode TEXT NOT NULL UNIQUE, -- e.g., "happy_cat"
  name TEXT NOT NULL,
  url TEXT NOT NULL, -- URL to the emoji image file
  category TEXT DEFAULT 'custom' NOT NULL,
  is_animated BOOLEAN DEFAULT false NOT NULL,
  is_public BOOLEAN DEFAULT false NOT NULL, -- Whether other users can use this emoji
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  usage INTEGER DEFAULT 0 NOT NULL, -- Usage count for popularity
  is_favorite BOOLEAN DEFAULT false NOT NULL, -- Favorite flag for the creator
  file_size INTEGER, -- File size in bytes
  dimensions JSONB, -- Store width/height as JSON
  tags TEXT[], -- Array of tags for search
  
  -- Constraints
  CONSTRAINT valid_shortcode CHECK (shortcode ~ '^[a-z0-9_]+$' AND length(shortcode) >= 2 AND length(shortcode) <= 50),
  CONSTRAINT valid_category CHECK (category IN ('custom', 'reactions', 'memes', 'logos', 'personal', 'animated')),
  CONSTRAINT valid_usage CHECK (usage >= 0)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_custom_emojis_created_by ON public.custom_emojis(created_by);
CREATE INDEX IF NOT EXISTS idx_custom_emojis_shortcode ON public.custom_emojis(shortcode);
CREATE INDEX IF NOT EXISTS idx_custom_emojis_category ON public.custom_emojis(category);
CREATE INDEX IF NOT EXISTS idx_custom_emojis_is_public ON public.custom_emojis(is_public);
CREATE INDEX IF NOT EXISTS idx_custom_emojis_usage ON public.custom_emojis(usage DESC);
CREATE INDEX IF NOT EXISTS idx_custom_emojis_created_at ON public.custom_emojis(created_at DESC);

-- Create GIN index for tag search
CREATE INDEX IF NOT EXISTS idx_custom_emojis_tags ON public.custom_emojis USING GIN(tags);

-- Add trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_custom_emojis_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_custom_emojis_timestamp
  BEFORE UPDATE ON public.custom_emojis
  FOR EACH ROW EXECUTE PROCEDURE update_custom_emojis_timestamp();

-- Enable Row Level Security
ALTER TABLE public.custom_emojis ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy: Users can view public emojis and their own emojis
CREATE POLICY custom_emojis_select ON public.custom_emojis
  FOR SELECT USING (
    is_public = true OR created_by = auth.uid()
  );

-- Policy: Users can only insert their own emojis
CREATE POLICY custom_emojis_insert ON public.custom_emojis
  FOR INSERT WITH CHECK (
    created_by = auth.uid()
  );

-- Policy: Users can only update their own emojis
CREATE POLICY custom_emojis_update ON public.custom_emojis
  FOR UPDATE USING (
    created_by = auth.uid()
  ) WITH CHECK (
    created_by = auth.uid()
  );

-- Policy: Users can only delete their own emojis
CREATE POLICY custom_emojis_delete ON public.custom_emojis
  FOR DELETE USING (
    created_by = auth.uid()
  );

-- Create custom emoji reactions table to track emoji usage in messages
CREATE TABLE IF NOT EXISTS public.custom_emoji_reactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  message_id TEXT NOT NULL, -- Reference to messages table
  emoji_id UUID REFERENCES public.custom_emojis(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  -- Ensure one reaction per user per message per emoji
  UNIQUE(message_id, emoji_id, user_id)
);

-- Create indexes for custom emoji reactions
CREATE INDEX IF NOT EXISTS idx_custom_emoji_reactions_message_id ON public.custom_emoji_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_custom_emoji_reactions_emoji_id ON public.custom_emoji_reactions(emoji_id);
CREATE INDEX IF NOT EXISTS idx_custom_emoji_reactions_user_id ON public.custom_emoji_reactions(user_id);

-- Enable RLS for custom emoji reactions
ALTER TABLE public.custom_emoji_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for custom emoji reactions

-- Policy: Users can view reactions on messages they can see
CREATE POLICY custom_emoji_reactions_select ON public.custom_emoji_reactions
  FOR SELECT USING (
    -- For now, allow all users to see reactions
    -- This should be refined based on message visibility rules
    true
  );

-- Policy: Users can add their own reactions
CREATE POLICY custom_emoji_reactions_insert ON public.custom_emoji_reactions
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
  );

-- Policy: Users can remove their own reactions
CREATE POLICY custom_emoji_reactions_delete ON public.custom_emoji_reactions
  FOR DELETE USING (
    user_id = auth.uid()
  );

-- Create function to increment emoji usage when used in reactions
CREATE OR REPLACE FUNCTION increment_custom_emoji_usage()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment usage count when a reaction is added
  IF TG_OP = 'INSERT' THEN
    UPDATE public.custom_emojis 
    SET usage = usage + 1 
    WHERE id = NEW.emoji_id;
    RETURN NEW;
  END IF;
  
  -- Optionally decrement when a reaction is removed
  -- IF TG_OP = 'DELETE' THEN
  --   UPDATE public.custom_emojis 
  --   SET usage = GREATEST(usage - 1, 0) 
  --   WHERE id = OLD.emoji_id;
  --   RETURN OLD;
  -- END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for usage tracking
CREATE TRIGGER custom_emoji_usage_tracker
  AFTER INSERT ON public.custom_emoji_reactions
  FOR EACH ROW EXECUTE PROCEDURE increment_custom_emoji_usage();

-- Add comments for documentation
COMMENT ON TABLE public.custom_emojis IS 'Custom emoji definitions for SNAKKAZ chat';
COMMENT ON TABLE public.custom_emoji_reactions IS 'Custom emoji reactions on messages';
COMMENT ON COLUMN public.custom_emojis.shortcode IS 'Unique shortcode for the emoji (used in :shortcode: format)';
COMMENT ON COLUMN public.custom_emojis.is_public IS 'Whether this emoji can be used by other users';
COMMENT ON COLUMN public.custom_emojis.usage IS 'Number of times this emoji has been used (for popularity ranking)';

-- Insert some sample custom emojis for testing (optional)
-- These will only be inserted if the user running the migration exists
DO $$
DECLARE
  sample_user_id UUID;
BEGIN
  -- Try to get the first user ID for sample data
  SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
  
  IF sample_user_id IS NOT NULL THEN
    INSERT INTO public.custom_emojis (shortcode, name, url, category, is_public, created_by, tags)
    VALUES 
      ('snakkaz_logo', 'SNAKKAZ Logo', '/api/placeholder/64/64', 'logos', true, sample_user_id, ARRAY['logo', 'brand', 'snakkaz']),
      ('party_snake', 'Party Snake', '/api/placeholder/64/64', 'reactions', true, sample_user_id, ARRAY['party', 'snake', 'celebration'])
    ON CONFLICT (shortcode) DO NOTHING;
  END IF;
END $$;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Custom emojis migration completed successfully!';
  RAISE NOTICE 'Tables created: custom_emojis, custom_emoji_reactions';
  RAISE NOTICE 'RLS policies and triggers have been set up';
END $$;
