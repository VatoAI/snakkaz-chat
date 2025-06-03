-- EMERGENCY FIX: Drop ALL potentially recursive policies
-- This will completely remove infinite recursion

BEGIN;

-- Drop ALL existing policies on group_members to start fresh
DO $$ 
DECLARE 
    pol_name text;
BEGIN
    FOR pol_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'group_members'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON group_members', pol_name);
        RAISE NOTICE 'Dropped policy: %', pol_name;
    END LOOP;
END $$;

-- Create a simple, non-recursive policy for testing
CREATE POLICY "group_members_allow_all" ON group_members 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

COMMIT;
