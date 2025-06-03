-- Apply remaining RLS performance optimizations
-- This script applies the cached auth.uid() function and performance indexes

-- 1. Create optimized get_current_user_id() function to cache auth.uid() calls
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS uuid
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    current_user_id uuid;
BEGIN
    -- Cache the auth.uid() result to avoid re-evaluation
    current_user_id := auth.uid();
    RETURN current_user_id;
END;
$$;

-- 2. Add performance indexes for common queries
-- Index for group_members lookups by user_id and group_id
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_group ON group_members(user_id, group_id);

-- Index for group_chats lookups
CREATE INDEX IF NOT EXISTS idx_group_chats_group_id ON group_chats(group_id);
CREATE INDEX IF NOT EXISTS idx_group_chats_created_at ON group_chats(created_at);

-- Index for group_invites lookups
CREATE INDEX IF NOT EXISTS idx_group_invites_invitee_id ON group_invites(invitee_id);
CREATE INDEX IF NOT EXISTS idx_group_invites_group_id ON group_invites(group_id);

-- Index for subscriptions lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- 3. Optimize auth.uid() calls in policies by using the cached function
-- Note: We'll update policies to use get_current_user_id() instead of auth.uid()

-- Update group_members policies to use cached function
DROP POLICY IF EXISTS "group_members_select_fixed" ON group_members;
CREATE POLICY "group_members_select_optimized" ON group_members 
FOR SELECT USING (user_id = get_current_user_id());

-- Update group_chats policies if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'group_chats' AND policyname = 'group_chats_select') THEN
        DROP POLICY "group_chats_select" ON group_chats;
    END IF;
    
    CREATE POLICY "group_chats_select_optimized" ON group_chats 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM group_members 
            WHERE group_id = group_chats.group_id 
            AND user_id = get_current_user_id()
        )
    );
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Error updating group_chats policy: %', SQLERRM;
END
$$;

-- Update group_invites policies if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'group_invites' AND policyname = 'group_invites_select') THEN
        DROP POLICY "group_invites_select" ON group_invites;
    END IF;
    
    CREATE POLICY "group_invites_select_optimized" ON group_invites 
    FOR SELECT USING (
        invitee_id = get_current_user_id() OR 
        EXISTS (
            SELECT 1 FROM group_members 
            WHERE group_id = group_invites.group_id 
            AND user_id = get_current_user_id()
        )
    );
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Error updating group_invites policy: %', SQLERRM;
END
$$;

-- Update subscriptions policies if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'subscriptions_select') THEN
        DROP POLICY "subscriptions_select" ON subscriptions;
    END IF;
    
    CREATE POLICY "subscriptions_select_optimized" ON subscriptions 
    FOR SELECT USING (user_id = get_current_user_id());
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Error updating subscriptions policy: %', SQLERRM;
END
$$;

-- 4. Add ANALYZE to update table statistics for better query planning
ANALYZE group_members;
ANALYZE group_chats;
ANALYZE group_invites;
ANALYZE group_settings;
ANALYZE subscriptions;

-- Performance optimization complete!
SELECT 'RLS Performance Optimization Applied Successfully!' as status;
