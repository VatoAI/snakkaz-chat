-- Performance Testing Queries
-- Run these before and after applying optimizations to measure improvement

-- Test 1: Count profiles with timing
EXPLAIN (ANALYZE, BUFFERS, TIMING) 
SELECT count(*) FROM profiles;

-- Test 2: Select messages with RLS policy evaluation
EXPLAIN (ANALYZE, BUFFERS, TIMING) 
SELECT * FROM messages LIMIT 100;

-- Test 3: Group membership queries
EXPLAIN (ANALYZE, BUFFERS, TIMING) 
SELECT g.* FROM groups g 
JOIN group_members gm ON g.id = gm.group_id 
LIMIT 50;

-- Test 4: Check policy evaluation overhead
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public' 
AND tablename IN ('messages', 'profiles', 'groups', 'group_members');

-- Test 5: Active connections and query performance
SELECT 
    count(*) as active_connections,
    max(now() - query_start) as longest_running_query
FROM pg_stat_activity 
WHERE state = 'active';
