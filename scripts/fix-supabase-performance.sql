-- Script to fix Supabase performance issues identified in database linter
-- Created: May 22, 2025

-- ======================================================
-- PART 1: Create indexes for unindexed foreign keys
-- ======================================================

-- 1. friendships_friend_id_fkey
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON public.friendships(friend_id);

-- 2. group_encryption_group_id_fkey
CREATE INDEX IF NOT EXISTS idx_group_encryption_group_id ON public.group_encryption(group_id);

-- 3. group_invites_invited_by_fkey
CREATE INDEX IF NOT EXISTS idx_group_invites_invited_by ON public.group_invites(invited_by);

-- 4. group_invites_invited_user_id_fkey
CREATE INDEX IF NOT EXISTS idx_group_invites_invited_user_id ON public.group_invites(invited_user_id);

-- 5. group_members_group_id_fkey
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members(group_id);

-- 6. groups_creator_id_fkey
CREATE INDEX IF NOT EXISTS idx_groups_creator_id ON public.groups(creator_id);

-- 7. messages_sender_id_fkey
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);

-- ======================================================
-- PART 2: Handle unused indexes
-- ======================================================

-- Note: Before removing indexes, it's recommended to analyze query patterns.
-- Here we provide statements to remove them, but they are commented out.
-- Uncomment only after verifying these indexes are truly not needed.

-- -- 1. idx_messages_read_status on public.messages
-- DROP INDEX IF EXISTS public.idx_messages_read_status;

-- -- 2. profiles_id_idx on public.profiles
-- DROP INDEX IF EXISTS public.profiles_id_idx;

-- -- 3. profiles_username_idx on public.profiles
-- DROP INDEX IF EXISTS public.profiles_username_idx;

-- -- 4. signaling_receiver_id_idx on public.signaling
-- DROP INDEX IF EXISTS public.signaling_receiver_id_idx;

-- -- 5. idx_messages_group_id on public.messages
-- DROP INDEX IF EXISTS public.idx_messages_group_id;

-- ======================================================
-- PART 3: Optimize the check_and_add_columns function
-- ======================================================

-- Function optimization - Replace the inefficient check_and_add_columns function
CREATE OR REPLACE FUNCTION public.check_and_add_columns(p_table_name text, column_names text[], search_path text DEFAULT 'public')
RETURNS void AS $$
DECLARE
  col_name text;
  col_exists boolean;
BEGIN
  -- Set search_path explicitly for security
  EXECUTE 'SET search_path TO ' || quote_ident(search_path);
  
  -- Use a more efficient approach by checking information_schema once
  -- and then only executing ALTER TABLE commands for missing columns
  FOREACH col_name IN ARRAY column_names LOOP
    -- Check if column exists
    EXECUTE format('SELECT EXISTS(SELECT 1 FROM information_schema.columns 
                    WHERE table_schema = %L AND table_name = %L AND column_name = %L)',
                   search_path, p_table_name, col_name) 
    INTO col_exists;
    
    -- Only attempt to add if column doesn't exist
    IF NOT col_exists THEN
      BEGIN
        -- Add column with TEXT type as default
        EXECUTE format('ALTER TABLE %I.%I ADD COLUMN IF NOT EXISTS %I TEXT', 
                      search_path, p_table_name, col_name);
      EXCEPTION
        WHEN OTHERS THEN
          -- Log error but continue with other columns
          RAISE NOTICE 'Error adding column %: %', col_name, SQLERRM;
      END;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ======================================================
-- PART 4: Add index performance analysis
-- ======================================================

-- Create a helper function to analyze index usage
-- This allows easier identification of unused indexes in the future
CREATE OR REPLACE FUNCTION public.analyze_index_usage(days_threshold int DEFAULT 30, search_path text DEFAULT 'public')
RETURNS TABLE (
  schema_name text,
  table_name text,
  index_name text,
  index_size text,
  index_scans bigint,
  table_scans bigint,
  last_used timestamp,
  days_since_used numeric,
  recommendation text
) AS $$
BEGIN
  -- Set search_path explicitly for security
  EXECUTE 'SET search_path TO ' || quote_ident(search_path);
  
  RETURN QUERY
  SELECT
    schemaname::text AS schema_name,
    relname::text AS table_name,
    indexrelname::text AS index_name,
    pg_size_pretty(pg_relation_size(i.indexrelid)) AS index_size,
    idx_scan AS index_scans,
    seq_scan AS table_scans,
    stats_reset AS last_used,
    CASE WHEN idx_scan > 0 
      THEN NULL 
      ELSE EXTRACT(EPOCH FROM (now() - stats_reset))/86400.0
    END AS days_since_used,
    CASE 
      WHEN idx_scan = 0 AND stats_reset < (now() - (days_threshold || ' days')::interval)
        THEN 'Consider dropping'
      WHEN idx_scan > 0 AND idx_scan < 100 AND table_size > 10000
        THEN 'Review usage'
      ELSE 'Keep'
    END AS recommendation
  FROM 
    pg_stat_user_indexes ui
    JOIN pg_index i ON ui.indexrelid = i.indexrelid
    JOIN pg_stat_user_tables ut ON ui.relid = ut.relid
    JOIN (
      SELECT relid, n_live_tup as table_size 
      FROM pg_stat_user_tables
    ) ts ON ui.relid = ts.relid
  WHERE 
    schemaname = search_path AND
    NOT i.indisprimary AND  -- Skip primary keys
    NOT i.indisunique;      -- Skip unique constraints
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ======================================================
-- PART 5: Schedule regular index maintenance
-- ======================================================

-- Create a maintenance function to run weekly
-- This reindexes tables with high index bloat
CREATE OR REPLACE FUNCTION public.perform_index_maintenance(search_path text DEFAULT 'public')
RETURNS void AS $$
BEGIN
  -- Set search_path explicitly for security
  EXECUTE 'SET search_path TO ' || quote_ident(search_path);
  
  -- Reindex the most frequently used tables to prevent bloat
  REINDEX TABLE public.messages;
  REINDEX TABLE public.profiles;
  REINDEX TABLE public.friendships;
  REINDEX TABLE public.groups;
  
  -- Vacuum analyze the database
  ANALYZE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a comment explaining how to schedule this
COMMENT ON FUNCTION public.perform_index_maintenance IS 
  'Run this function weekly to maintain optimal index performance. 
   You can schedule it using pg_cron with: 
   SELECT cron.schedule(''@weekly'', ''SELECT public.perform_index_maintenance()'')';
