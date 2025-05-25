-- Safe Custom Emojis Migration for SNAKKAZ Chat
-- Created: May 25, 2025
-- This version handles existing objects gracefully

-- Step 1: Drop existing trigger and function to avoid conflicts
DROP TRIGGER IF EXISTS update_custom_emojis_timestamp ON public.custom_emojis;
DROP FUNCTION IF EXISTS update_custom_emojis_timestamp();

-- Step 2: Create custom_emojis table (will be skipped if exists)
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

-- Step 3: Create indexes for better performance (will be skipped if they exist)
CREATE INDEX IF NOT EXISTS idx_custom_emojis_created_by ON public.custom_emojis(created_by);
CREATE INDEX IF NOT EXISTS idx_custom_emojis_shortcode ON public.custom_emojis(shortcode);
CREATE INDEX IF NOT EXISTS idx_custom_emojis_category ON public.custom_emojis(category);
CREATE INDEX IF NOT EXISTS idx_custom_emojis_is_public ON public.custom_emojis(is_public);
CREATE INDEX IF NOT EXISTS idx_custom_emojis_usage ON public.custom_emojis(usage DESC);
CREATE INDEX IF NOT EXISTS idx_custom_emojis_created_at ON public.custom_emojis(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_custom_emojis_tags ON public.custom_emojis USING GIN(tags);

-- Step 4: Recreate the timestamp function
CREATE OR REPLACE FUNCTION update_custom_emojis_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Recreate the trigger
CREATE TRIGGER update_custom_emojis_timestamp
  BEFORE UPDATE ON public.custom_emojis
  FOR EACH ROW EXECUTE PROCEDURE update_custom_emojis_timestamp();

-- Step 6: Enable Row Level Security
ALTER TABLE public.custom_emojis ENABLE ROW LEVEL SECURITY;

-- Step 7: Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS custom_emojis_select ON public.custom_emojis;
DROP POLICY IF EXISTS custom_emojis_insert ON public.custom_emojis;
DROP POLICY IF EXISTS custom_emojis_update ON public.custom_emojis;
DROP POLICY IF EXISTS custom_emojis_delete ON public.custom_emojis;

-- Step 8: Create RLS policies
CREATE POLICY custom_emojis_select ON public.custom_emojis
  FOR SELECT USING (
    is_public = true OR created_by = auth.uid()
  );

CREATE POLICY custom_emojis_insert ON public.custom_emojis
  FOR INSERT WITH CHECK (
    created_by = auth.uid()
  );

CREATE POLICY custom_emojis_update ON public.custom_emojis
  FOR UPDATE USING (
    created_by = auth.uid()
  ) WITH CHECK (
    created_by = auth.uid()
  );

CREATE POLICY custom_emojis_delete ON public.custom_emojis
  FOR DELETE USING (
    created_by = auth.uid()
  );

-- Step 9: Create custom emoji reactions table
CREATE TABLE IF NOT EXISTS public.custom_emoji_reactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  message_id TEXT NOT NULL, -- Reference to messages table
  emoji_id UUID REFERENCES public.custom_emojis(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  -- Ensure one reaction per user per message per emoji
  UNIQUE(message_id, emoji_id, user_id)
);

-- Step 10: Create indexes for custom emoji reactions
CREATE INDEX IF NOT EXISTS idx_custom_emoji_reactions_message_id ON public.custom_emoji_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_custom_emoji_reactions_emoji_id ON public.custom_emoji_reactions(emoji_id);
CREATE INDEX IF NOT EXISTS idx_custom_emoji_reactions_user_id ON public.custom_emoji_reactions(user_id);

-- Step 11: Enable RLS for custom emoji reactions
ALTER TABLE public.custom_emoji_reactions ENABLE ROW LEVEL SECURITY;

-- Step 12: Drop existing reaction policies
DROP POLICY IF EXISTS custom_emoji_reactions_select ON public.custom_emoji_reactions;
DROP POLICY IF EXISTS custom_emoji_reactions_insert ON public.custom_emoji_reactions;
DROP POLICY IF EXISTS custom_emoji_reactions_delete ON public.custom_emoji_reactions;

-- Step 13: Create RLS policies for custom emoji reactions
CREATE POLICY custom_emoji_reactions_select ON public.custom_emoji_reactions
  FOR SELECT USING (
    -- For now, allow all users to see reactions
    -- This should be refined based on message visibility rules
    true
  );

CREATE POLICY custom_emoji_reactions_insert ON public.custom_emoji_reactions
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
  );

CREATE POLICY custom_emoji_reactions_delete ON public.custom_emoji_reactions
  FOR DELETE USING (
    user_id = auth.uid()
  );

-- Step 14: Drop existing usage tracking function and trigger
DROP TRIGGER IF EXISTS custom_emoji_usage_tracker ON public.custom_emoji_reactions;
DROP FUNCTION IF EXISTS increment_custom_emoji_usage();

-- Step 15: Create function to increment emoji usage when used in reactions
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
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 16: Create trigger for usage tracking
CREATE TRIGGER custom_emoji_usage_tracker
  AFTER INSERT ON public.custom_emoji_reactions
  FOR EACH ROW EXECUTE PROCEDURE increment_custom_emoji_usage();

-- Step 17: Add comments for documentation
COMMENT ON TABLE public.custom_emojis IS 'Custom emoji definitions for SNAKKAZ chat';
COMMENT ON TABLE public.custom_emoji_reactions IS 'Custom emoji reactions on messages';
COMMENT ON COLUMN public.custom_emojis.shortcode IS 'Unique shortcode for the emoji (used in :shortcode: format)';
COMMENT ON COLUMN public.custom_emojis.is_public IS 'Whether this emoji can be used by other users';
COMMENT ON COLUMN public.custom_emojis.usage IS 'Number of times this emoji has been used (for popularity ranking)';

-- Migration completed successfully!
-- Tables created: custom_emojis, custom_emoji_reactions
-- RLS policies and triggers have been set up
