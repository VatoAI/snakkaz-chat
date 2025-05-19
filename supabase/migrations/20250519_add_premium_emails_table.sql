-- Create premium_emails table for tracking user email accounts
-- This migration should be run on your Supabase project

-- Create the table
CREATE TABLE IF NOT EXISTS premium_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_username TEXT NOT NULL,
  email_address TEXT NOT NULL,
  quota_mb INTEGER NOT NULL DEFAULT 250,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add constraints
ALTER TABLE premium_emails ADD CONSTRAINT unique_email_username UNIQUE (email_username);
ALTER TABLE premium_emails ADD CONSTRAINT unique_user_email UNIQUE (user_id, email_address);

-- Create index for faster lookups
CREATE INDEX idx_premium_emails_user_id ON premium_emails (user_id);
CREATE INDEX idx_premium_emails_email_username ON premium_emails (email_username);

-- Add RLS (Row Level Security) policies
ALTER TABLE premium_emails ENABLE ROW LEVEL SECURITY;

-- Policy for users to see only their own email accounts
CREATE POLICY "Users can view their own email accounts" 
  ON premium_emails FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for users to insert their own email accounts
CREATE POLICY "Users can insert their own email accounts" 
  ON premium_emails FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own email accounts
CREATE POLICY "Users can update their own email accounts" 
  ON premium_emails FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy for users to delete their own email accounts
CREATE POLICY "Users can delete their own email accounts" 
  ON premium_emails FOR DELETE 
  USING (auth.uid() = user_id);

-- Add a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_premium_emails_updated_at
  BEFORE UPDATE ON premium_emails
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();
