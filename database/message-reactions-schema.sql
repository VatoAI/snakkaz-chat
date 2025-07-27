-- SnakkaZ Message Reactions System
-- Database schema for message reactions and emoji support

-- Create message_reactions table
CREATE TABLE IF NOT EXISTS message_reactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji_code varchar(50) NOT NULL, -- Unicode emoji or custom emoji code
  emoji_type varchar(20) NOT NULL DEFAULT 'unicode', -- 'unicode', 'custom', 'system'
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Ensure one reaction per user per message per emoji
  UNIQUE(message_id, user_id, emoji_code)
);

-- Create custom_emojis table for SnakkaZ custom emojis
CREATE TABLE IF NOT EXISTS custom_emojis (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name varchar(50) NOT NULL UNIQUE, -- :snakkaz_fire:
  code varchar(50) NOT NULL UNIQUE, -- snakkaz_fire
  image_url text NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  is_system boolean DEFAULT false, -- System emojis vs user-created
  is_active boolean DEFAULT true,
  usage_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create reaction_counts materialized view for performance
CREATE MATERIALIZED VIEW IF NOT EXISTS message_reaction_counts AS
SELECT 
  message_id,
  emoji_code,
  emoji_type,
  COUNT(*) as count,
  ARRAY_AGG(user_id) as user_ids,
  MAX(created_at) as last_reacted_at
FROM message_reactions 
GROUP BY message_id, emoji_code, emoji_type;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_message_reactions_message_id ON message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_user_id ON message_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_emoji ON message_reactions(emoji_code, emoji_type);
CREATE INDEX IF NOT EXISTS idx_message_reactions_created_at ON message_reactions(created_at);
CREATE INDEX IF NOT EXISTS idx_custom_emojis_code ON custom_emojis(code);
CREATE INDEX IF NOT EXISTS idx_custom_emojis_usage ON custom_emojis(usage_count DESC);

-- Enable RLS
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_emojis ENABLE ROW LEVEL SECURITY;

-- RLS Policies for message_reactions
CREATE POLICY "Users can view all reactions" ON message_reactions
  FOR SELECT USING (true);

CREATE POLICY "Users can create reactions" ON message_reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions" ON message_reactions
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for custom_emojis
CREATE POLICY "Everyone can view active emojis" ON custom_emojis
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create custom emojis" ON custom_emojis
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own emojis" ON custom_emojis
  FOR UPDATE USING (auth.uid() = created_by);

-- Functions for real-time reactions
CREATE OR REPLACE FUNCTION handle_reaction_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Refresh materialized view
  REFRESH MATERIALIZED VIEW CONCURRENTLY message_reaction_counts;
  
  -- Update custom emoji usage count
  IF NEW.emoji_type = 'custom' THEN
    UPDATE custom_emojis 
    SET usage_count = usage_count + 1,
        updated_at = now()
    WHERE code = NEW.emoji_code;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for reaction changes
CREATE TRIGGER reaction_change_trigger
  AFTER INSERT OR DELETE ON message_reactions
  FOR EACH ROW EXECUTE FUNCTION handle_reaction_change();

-- Function to get popular emojis
CREATE OR REPLACE FUNCTION get_popular_emojis(limit_count integer DEFAULT 20)
RETURNS TABLE(
  emoji_code text,
  emoji_type text,
  usage_count bigint,
  is_custom boolean
) AS $$
BEGIN
  RETURN QUERY
  WITH emoji_usage AS (
    -- Unicode emojis from reactions
    SELECT 
      mr.emoji_code::text,
      mr.emoji_type::text,
      COUNT(*)::bigint as usage_count,
      false as is_custom
    FROM message_reactions mr
    WHERE mr.emoji_type = 'unicode'
    GROUP BY mr.emoji_code, mr.emoji_type
    
    UNION ALL
    
    -- Custom emojis
    SELECT 
      ce.code::text,
      'custom'::text,
      ce.usage_count::bigint,
      true as is_custom
    FROM custom_emojis ce
    WHERE ce.is_active = true
  )
  SELECT * FROM emoji_usage
  ORDER BY usage_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Insert some default Norwegian system emojis
INSERT INTO custom_emojis (name, code, image_url, is_system, is_active) VALUES
  (':snakkaz:', 'snakkaz', '/images/emojis/snakkaz.png', true, true),
  (':norway:', 'norway', '/images/emojis/norway.png', true, true),
  (':viking:', 'viking', '/images/emojis/viking.png', true, true),
  (':fjord:', 'fjord', '/images/emojis/fjord.png', true, true),
  (':aurora:', 'aurora', '/images/emojis/aurora.png', true, true),
  (':kod:', 'kod', '/images/emojis/kod.png', true, true)
ON CONFLICT (code) DO NOTHING;

-- Grant permissions
GRANT ALL ON message_reactions TO authenticated;
GRANT ALL ON custom_emojis TO authenticated;
GRANT SELECT ON message_reaction_counts TO authenticated;