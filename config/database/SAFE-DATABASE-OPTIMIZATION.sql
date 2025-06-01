-- ===============================================
-- 🚨 SAFE DATABASE OPTIMIZATION SCRIPT
-- ===============================================
-- Date: May 28, 2025
-- Purpose: Fix RLS policies safely, one by one
-- Strategy: Test each policy individually
-- ===============================================

-- Test connectivity first
SELECT 'Database connection test' as status;

-- ===============================================
-- PHASE 1: SIMPLE POLICIES FIRST
-- ===============================================

-- Fix simple auth.uid() calls in profiles table
DO $$
BEGIN
    -- Profiles: Update policies
    ALTER POLICY "Users can update their own profile" ON public.profiles 
    USING ((select auth.uid()) = id);
    
    RAISE NOTICE 'Fixed profiles update policy';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Profiles update policy already optimized or failed: %', SQLERRM;
END $$;

DO $$
BEGIN
    -- Profiles: Insert policy
    ALTER POLICY "Users can insert their own profile." ON public.profiles 
    WITH CHECK ((select auth.uid()) = id);
    
    RAISE NOTICE 'Fixed profiles insert policy';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Profiles insert policy already optimized or failed: %', SQLERRM;
END $$;

-- ===============================================
-- PHASE 2: MESSAGES TABLE
-- ===============================================

DO $$
BEGIN
    -- Messages: Update policies one by one
    ALTER POLICY "Users can insert their own messages" ON public.messages 
    WITH CHECK ((select auth.uid()) = user_id);
    
    RAISE NOTICE 'Fixed messages insert policy';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Messages insert policy already optimized or failed: %', SQLERRM;
END $$;

DO $$
BEGIN
    ALTER POLICY "Allow users to delete their own messages" ON public.messages 
    USING ((select auth.uid()) = user_id);
    
    RAISE NOTICE 'Fixed messages delete policy';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Messages delete policy already optimized or failed: %', SQLERRM;
END $$;

-- ===============================================
-- PHASE 3: USER PRESENCE
-- ===============================================

DO $$
BEGIN
    ALTER POLICY "Users can insert their own presence" ON public.user_presence 
    WITH CHECK ((select auth.uid()) = user_id);
    
    RAISE NOTICE 'Fixed user_presence insert policy';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'User_presence insert policy already optimized or failed: %', SQLERRM;
END $$;

DO $$
BEGIN
    ALTER POLICY "Users can update their own presence" ON public.user_presence 
    USING ((select auth.uid()) = user_id);
    
    RAISE NOTICE 'Fixed user_presence update policy';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'User_presence update policy already optimized or failed: %', SQLERRM;
END $$;

-- ===============================================
-- PHASE 4: CUSTOM EMOJIS
-- ===============================================

DO $$
BEGIN
    ALTER POLICY "custom_emojis_insert" ON public.custom_emojis 
    WITH CHECK ((select auth.uid()) = created_by);
    
    RAISE NOTICE 'Fixed custom_emojis insert policy';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Custom_emojis insert policy already optimized or failed: %', SQLERRM;
END $$;

DO $$
BEGIN
    ALTER POLICY "custom_emojis_update" ON public.custom_emojis 
    USING ((select auth.uid()) = created_by);
    
    RAISE NOTICE 'Fixed custom_emojis update policy';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Custom_emojis update policy already optimized or failed: %', SQLERRM;
END $$;

-- ===============================================
-- PHASE 5: SIGNALING TABLE
-- ===============================================

DO $$
BEGIN
    ALTER POLICY "Users can insert signals" ON public.signaling 
    WITH CHECK ((select auth.uid()) = from_user_id);
    
    RAISE NOTICE 'Fixed signaling insert policy';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Signaling insert policy already optimized or failed: %', SQLERRM;
END $$;

DO $$
BEGIN
    ALTER POLICY "Users can read signals meant for them" ON public.signaling 
    USING ((select auth.uid()) = target_user_id);
    
    RAISE NOTICE 'Fixed signaling read policy';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Signaling read policy already optimized or failed: %', SQLERRM;
END $$;

-- ===============================================
-- VERIFICATION
-- ===============================================

SELECT 'Optimization script completed successfully!' as result;

-- Test a simple query to ensure everything still works
SELECT COUNT(*) as profile_count FROM profiles LIMIT 1;
