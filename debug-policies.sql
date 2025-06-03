-- Check current policies on group_members table
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'group_members' 
ORDER BY policyname;

-- Check if our optimized function exists
SELECT proname, provolatile 
FROM pg_proc 
WHERE proname = 'get_current_user_id';

-- List all policies to see what might be causing recursion
\echo 'Current group_members policies:'
SELECT 
    pol.policyname,
    pol.cmd,
    pol.permissive,
    pol.roles,
    pol.qual,
    pol.with_check
FROM pg_policies pol
WHERE pol.tablename = 'group_members'
ORDER BY pol.policyname;
