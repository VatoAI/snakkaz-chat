-- Fix for infinite recursion in group_members policy
-- This script identifies and fixes recursive policies on the group_members table

-- First, let's get information about the current policies
DO $$
DECLARE
    policy_record RECORD;
    using_clause TEXT;
    check_clause TEXT;
    policy_name TEXT;
BEGIN
    -- Output current policies for debugging
    RAISE NOTICE 'Current policies on group_members:';
    
    FOR policy_record IN 
        SELECT policyname, permissive, cmd, qual, with_check 
        FROM pg_policies 
        WHERE tablename = 'group_members'
    LOOP
        RAISE NOTICE 'Policy: %, Command: %, Using: %, With check: %', 
            policy_record.policyname, 
            policy_record.cmd, 
            policy_record.qual, 
            policy_record.with_check;
    END LOOP;
    
    -- Drop potentially problematic policies
    -- Look for policies that might reference group_members table in their conditions
    FOR policy_record IN 
        SELECT policyname, cmd
        FROM pg_policies 
        WHERE tablename = 'group_members'
        AND (
            qual::text LIKE '%group_members%' OR 
            with_check::text LIKE '%group_members%'
        )
    LOOP
        policy_name := policy_record.policyname;
        EXECUTE format('DROP POLICY IF EXISTS %I ON group_members', policy_name);
        RAISE NOTICE 'Dropped potentially recursive policy: %', policy_name;
    END LOOP;

END $$;

-- Now recreate the policies with non-recursive conditions
-- Policy for SELECT - users can see groups they're members of
CREATE POLICY select_own_memberships 
ON group_members 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy for INSERT - users can insert records for themselves
CREATE POLICY insert_own_memberships 
ON group_members 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy for admins - if your app has admin privileges
CREATE POLICY admin_manage_all_memberships 
ON group_members 
USING (
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'admin'
    )
);

-- Policy for group owners - can manage their own groups' memberships
CREATE POLICY group_owner_manage_memberships 
ON group_members 
USING (
    EXISTS (
        SELECT 1 FROM groups 
        WHERE groups.id = group_members.group_id 
        AND groups.created_by = auth.uid()
    )
);

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON group_members TO authenticated;

-- Enable RLS
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Add notice about the solution
COMMENT ON TABLE group_members IS 'Group membership table with fixed policies to prevent infinite recursion.';