
-- Create emoji analytics table
CREATE TABLE IF NOT EXISTS emoji_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  emoji_id UUID NOT NULL REFERENCES custom_emojis(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_id UUID NOT NULL,
  usage_type TEXT NOT NULL CHECK (usage_type IN ('message', 'reaction')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Additional metadata (optional JSON field)
  metadata JSONB
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_emoji_analytics_emoji_id ON emoji_analytics(emoji_id);
CREATE INDEX IF NOT EXISTS idx_emoji_analytics_user_id ON emoji_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_emoji_analytics_message_id ON emoji_analytics(message_id);
CREATE INDEX IF NOT EXISTS idx_emoji_analytics_timestamp ON emoji_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_emoji_analytics_usage_type ON emoji_analytics(usage_type);

-- Row-level security policies
ALTER TABLE emoji_analytics ENABLE ROW LEVEL SECURITY;

-- Allow users to see all emoji analytics
CREATE POLICY emoji_analytics_select_policy
  ON emoji_analytics FOR SELECT
  USING (true);

-- Only allow users to insert their own analytics
CREATE POLICY emoji_analytics_insert_policy
  ON emoji_analytics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only allow users to update their own analytics
CREATE POLICY emoji_analytics_update_policy
  ON emoji_analytics FOR UPDATE
  USING (auth.uid() = user_id);

-- Only allow users to delete their own analytics
CREATE POLICY emoji_analytics_delete_policy
  ON emoji_analytics FOR DELETE
  USING (auth.uid() = user_id);

-- Create a function to update emoji usage count
CREATE OR REPLACE FUNCTION update_emoji_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment the usage count in the custom_emojis table
  UPDATE custom_emojis
  SET usage = usage + 1
  WHERE id = NEW.emoji_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update emoji usage count on insert
CREATE TRIGGER update_emoji_usage_count_trigger
AFTER INSERT ON emoji_analytics
FOR EACH ROW
EXECUTE FUNCTION update_emoji_usage_count();

-- Create a view for emoji usage statistics
CREATE OR REPLACE VIEW emoji_usage_stats AS
SELECT 
  e.id AS emoji_id,
  e.shortcode,
  e.name,
  e.category,
  e.usage,
  COUNT(DISTINCT ea.user_id) AS unique_users,
  COUNT(DISTINCT CASE WHEN ea.usage_type = 'reaction' THEN ea.id ELSE NULL END) AS reaction_count,
  COUNT(DISTINCT CASE WHEN ea.usage_type = 'message' THEN ea.id ELSE NULL END) AS message_count,
  MAX(ea.timestamp) AS last_used
FROM 
  custom_emojis e
LEFT JOIN 
  emoji_analytics ea ON e.id = ea.emoji_id
GROUP BY 
  e.id, e.shortcode, e.name, e.category, e.usage;

-- Grant permissions
GRANT SELECT ON emoji_usage_stats TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON emoji_analytics TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE emoji_analytics_id_seq TO authenticated;
