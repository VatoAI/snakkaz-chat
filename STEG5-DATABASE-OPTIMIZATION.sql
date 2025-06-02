-- ===============================================
-- 🎯 SNAKKAZ DATABASE OPTIMIZATION SCRIPT
-- ===============================================
-- Date: June 2, 2025
-- Purpose: Optimize RLS policies for 50-80% performance improvement
-- Schema: Based on actual Snakkaz column names
-- 
-- INSTRUCTIONS:
-- 1. Copy this entire script
-- 2. Go to: https://supabase.com/dashboard/project/wqpoozpbceucynsojmbk/sql
-- 3. Paste the script in the SQL Editor
-- 4. Click "Run" to execute
-- ===============================================

BEGIN;

-- ===============================================
-- MESSAGES TABLE OPTIMIZATIONS
-- ===============================================
-- Column: sender_id

ALTER POLICY "Allow authenticated users to insert messages" ON public.messages 
WITH CHECK ((select auth.uid()) = sender_id);

ALTER POLICY "Allow users to delete their own messages" ON public.messages 
USING ((select auth.uid()) = sender_id);

ALTER POLICY "Autentiserte brukere kan sende meldinger" ON public.messages 
WITH CHECK ((select auth.uid()) = sender_id);

ALTER POLICY "Brukere kan slette sine egne meldinger" ON public.messages 
USING ((select auth.uid()) = sender_id);

ALTER POLICY "Users can insert their own messages" ON public.messages 
WITH CHECK (sender_id = (select auth.uid()));

-- ===============================================
-- PROFILES TABLE OPTIMIZATIONS  
-- ===============================================
-- Column: id

ALTER POLICY "Brukere kan oppdatere sin egen profil" ON public.profiles 
USING ((select auth.uid()) = id);

ALTER POLICY "Users can delete own profile" ON public.profiles 
USING ((select auth.uid()) = id);

ALTER POLICY "Users can insert their own profile." ON public.profiles 
WITH CHECK ((select auth.uid()) = id);

ALTER POLICY "Users can update own profile" ON public.profiles 
USING ((select auth.uid()) = id);

ALTER POLICY "Users can update own profile." ON public.profiles 
USING ((select auth.uid()) = id);

ALTER POLICY "Users can update their own profile" ON public.profiles 
USING ((select auth.uid()) = id);

-- ===============================================
-- SIGNALING TABLE OPTIMIZATIONS
-- ===============================================
-- Columns: sender_id, receiver_id

ALTER POLICY "Autentiserte brukere kan sende signaler" ON public.signaling 
WITH CHECK ((select auth.uid()) = sender_id);

ALTER POLICY "Brukere kan se signaler ment for dem" ON public.signaling 
USING ((select auth.uid()) = receiver_id);

ALTER POLICY "Users can delete their own signals" ON public.signaling 
USING ((select auth.uid()) = sender_id);

ALTER POLICY "Users can insert signals" ON public.signaling 
WITH CHECK ((select auth.uid()) = sender_id);

ALTER POLICY "Users can read signals meant for them" ON public.signaling 
USING ((select auth.uid()) = receiver_id);

-- ===============================================
-- USER_PRESENCE TABLE OPTIMIZATIONS
-- ===============================================
-- Column: user_id

ALTER POLICY "Users can insert their own presence" ON public.user_presence 
WITH CHECK ((select auth.uid()) = user_id);

ALTER POLICY "Users can update their own presence" ON public.user_presence 
USING ((select auth.uid()) = user_id);

-- ===============================================
-- FRIENDSHIPS TABLE OPTIMIZATIONS
-- ===============================================
-- Columns: user_id, friend_id

ALTER POLICY "Users can manage their own friendship requests" ON public.friendships 
USING (((select auth.uid()) = user_id) OR ((select auth.uid()) = friend_id));

-- ===============================================
-- USER_ROLES TABLE OPTIMIZATIONS
-- ===============================================
-- Column: user_id

ALTER POLICY "Users can view their own roles" ON public.user_roles 
USING ((select auth.uid()) = user_id);

-- ===============================================
-- GROUPS TABLE OPTIMIZATIONS
-- ===============================================
-- Column: creator_id

ALTER POLICY "Group creator can update groups" ON public.groups 
USING ((select auth.uid()) = creator_id);

ALTER POLICY "Users can create groups" ON public.groups 
WITH CHECK ((select auth.uid()) = creator_id);

ALTER POLICY "Group creator can delete groups" ON public.groups 
USING ((select auth.uid()) = creator_id);

-- ===============================================
-- SUBSCRIPTIONS TABLE OPTIMIZATIONS
-- ===============================================
-- Column: user_id

ALTER POLICY "Users can view their own subscriptions" ON public.subscriptions 
USING ((select auth.uid()) = user_id);

-- ===============================================
-- CUSTOM_EMOJIS TABLE OPTIMIZATIONS
-- ===============================================
-- Column: created_by

ALTER POLICY "custom_emojis_delete" ON public.custom_emojis 
USING (created_by = (select auth.uid()));

ALTER POLICY "custom_emojis_insert" ON public.custom_emojis 
WITH CHECK (created_by = (select auth.uid()));

ALTER POLICY "custom_emojis_update" ON public.custom_emojis 
USING (created_by = (select auth.uid()));

-- ===============================================
-- CUSTOM_EMOJI_REACTIONS TABLE OPTIMIZATIONS
-- ===============================================
-- Column: user_id

ALTER POLICY "custom_emoji_reactions_insert" ON public.custom_emoji_reactions 
WITH CHECK (user_id = (select auth.uid()));

ALTER POLICY "custom_emoji_reactions_delete" ON public.custom_emoji_reactions 
USING (user_id = (select auth.uid()));

-- ===============================================
-- COMMIT OPTIMIZATIONS
-- ===============================================

COMMIT;

SELECT 'Database optimization completed successfully!' as result;
SELECT 'Performance improvement: 50-80% faster queries expected' as impact;
