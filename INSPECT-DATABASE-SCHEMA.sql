-- ===============================================
-- 🔍 DATABASE SCHEMA INSPECTION
-- ===============================================
-- Purpose: Check actual column names in tables
-- This will help us create the correct optimization script
-- ===============================================

-- Check profiles table structure
SELECT 'PROFILES TABLE COLUMNS:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Check messages table structure
SELECT 'MESSAGES TABLE COLUMNS:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'messages'
ORDER BY ordinal_position;

-- Check user_presence table structure
SELECT 'USER_PRESENCE TABLE COLUMNS:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'user_presence'
ORDER BY ordinal_position;

-- Check signaling table structure
SELECT 'SIGNALING TABLE COLUMNS:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'signaling'
ORDER BY ordinal_position;

-- Check custom_emojis table structure
SELECT 'CUSTOM_EMOJIS TABLE COLUMNS:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'custom_emojis'
ORDER BY ordinal_position;

-- List all existing RLS policies to see what we're working with
SELECT 'EXISTING RLS POLICIES:' as info;
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
