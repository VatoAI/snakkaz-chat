/*
 * POSTGRESQL-SPESIFIKK KODE FOR SUPABASE
 * --------------------------------------
 * MERK: Dette er PostgreSQL-syntaks for Supabase, ikke MS SQL Server.
 * Din IDE kan vise syntaksfeil hvis den bruker MS SQL Server-validering, 
 * men dette er korrekt PostgreSQL-syntaks som vil kjøre på Supabase.
 *
 * Noen hovedforskjeller fra MS SQL Server:
 * - "IF NOT EXISTS" ved oppretting av tabeller/kolonner
 * - RLS (Row Level Security) policies
 * - "auth.uid()" for brukeridentifikasjon
 * - USING og WITH CHECK i policyer
 * - Annen constraint-syntaks
 */

-- Add is_premium column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;

-- Add subscription_type column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscription_type TEXT DEFAULT 'free';

-- Create user_subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  subscription_type TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  payment_id TEXT,
  payment_status TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Add description column to groups table
ALTER TABLE groups
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add is_premium column to groups table
ALTER TABLE groups
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;

-- Update profiles definition in the types
DO $$
BEGIN
  -- PostgreSQL-spesifikk kode for å sjekke og legge til kolonner
  PERFORM check_and_add_columns('profiles', ARRAY['is_premium', 'subscription_type']);
  PERFORM check_and_add_columns('groups', ARRAY['description', 'is_premium']);
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error updating tables: %', SQLERRM;
END $$;

-- PostgreSQL RLS (Row Level Security) policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions"
ON user_subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
ON user_subscriptions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
ON user_subscriptions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Grant PostgreSQL permissions on the new table
GRANT ALL ON user_subscriptions TO service_role;
GRANT SELECT, INSERT, UPDATE ON user_subscriptions TO authenticated;