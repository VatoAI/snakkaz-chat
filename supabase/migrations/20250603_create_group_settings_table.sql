/**
 * Database Migration: Create group_settings table
 * This fixes the issue where previous migrations expected this table to exist
 */

-- Create group_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS group_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES group_chats(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id)
);

-- Enable RLS for group_settings
ALTER TABLE group_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see settings for groups they're members of
CREATE POLICY group_settings_select ON group_settings 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_members.group_id = group_settings.group_id 
      AND group_members.user_id = auth.uid()
    )
  );

-- Policy: Only admins/moderators can update group settings
CREATE POLICY group_settings_update ON group_settings 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_members.group_id = group_settings.group_id 
      AND group_members.user_id = auth.uid() 
      AND group_members.role IN ('admin', 'moderator')
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_group_settings_group_id ON group_settings(group_id);
