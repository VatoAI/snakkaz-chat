-- Group Encryption Tables for SnakkaZ Chat
-- This script creates tables for storing encryption keys and encrypted data for groups

-- Table for storing group encryption keys
CREATE TABLE IF NOT EXISTS group_encryption_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  encryption_key TEXT NOT NULL,
  key_id TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true,
  UNIQUE(group_id, key_id)
);

-- Enable RLS on the keys table
ALTER TABLE group_encryption_keys ENABLE ROW LEVEL SECURITY;

-- Group member access policy
CREATE POLICY group_encryption_keys_group_member_policy
  ON group_encryption_keys
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_encryption_keys.group_id
      AND group_members.user_id = auth.uid()
    )
  );

-- Group admin insert/update policy
CREATE POLICY group_encryption_keys_admin_policy
  ON group_encryption_keys
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_encryption_keys.group_id
      AND group_members.user_id = auth.uid()
      AND group_members.role IN ('admin', 'owner')
    )
  );

-- Table for storing encrypted group data
CREATE TABLE IF NOT EXISTS group_encrypted_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  encrypted_data TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_by UUID NOT NULL REFERENCES profiles(id),
  UNIQUE(group_id)
);

-- Enable RLS on the encrypted data table
ALTER TABLE group_encrypted_data ENABLE ROW LEVEL SECURITY;

-- Group member access policy for encrypted data
CREATE POLICY group_encrypted_data_member_policy
  ON group_encrypted_data
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_encrypted_data.group_id
      AND group_members.user_id = auth.uid()
    )
  );

-- Group admin insert/update policy for encrypted data
CREATE POLICY group_encrypted_data_admin_policy
  ON group_encrypted_data
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_encrypted_data.group_id
      AND group_members.user_id = auth.uid()
      AND group_members.role IN ('admin', 'owner')
    )
  );