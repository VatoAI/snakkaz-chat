-- Migration: Add premium_emails table for tracking @snakkaz.com email accounts
-- Created: 2025-05-19

-- Create the premium_emails table
CREATE TABLE IF NOT EXISTS premium_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_username TEXT NOT NULL,
  email_address TEXT NOT NULL,
  quota_mb INT NOT NULL DEFAULT 250,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique email addresses across the platform
  CONSTRAINT unique_email_address UNIQUE (email_address),
  -- Ensure unique usernames per domain
  CONSTRAINT unique_email_username UNIQUE (email_username)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_premium_emails_user_id ON premium_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_emails_username ON premium_emails(email_username);

-- Create a function to update the last_updated timestamp
CREATE OR REPLACE FUNCTION update_premium_emails_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update timestamp on record update
CREATE TRIGGER update_premium_email_timestamp
BEFORE UPDATE ON premium_emails
FOR EACH ROW
EXECUTE FUNCTION update_premium_emails_timestamp();

-- Add RLS (Row Level Security) policies for premium_emails table
ALTER TABLE premium_emails ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own email accounts
CREATE POLICY select_own_emails ON premium_emails
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own email accounts
CREATE POLICY insert_own_emails ON premium_emails
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own email accounts
CREATE POLICY update_own_emails ON premium_emails
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy: Users can only delete their own email accounts
CREATE POLICY delete_own_emails ON premium_emails
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add special policy for service role to manage all email accounts
CREATE POLICY service_manage_all_emails ON premium_emails
  FOR ALL
  USING (auth.role() = 'service_role');

COMMENT ON TABLE premium_emails IS 'Stores information about premium user email accounts';
