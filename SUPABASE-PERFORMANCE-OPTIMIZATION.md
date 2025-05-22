# Supabase Database Performance Optimization

**Date: May 22, 2025**

This document describes the database performance issues identified in the Supabase Database Linter and the solutions implemented to address them.

## Issues Identified

The Supabase Database Linter identified several performance issues:

### 1. Unindexed Foreign Keys

Seven foreign key constraints were found without covering indexes:

| Table | Foreign Key | Columns |
|-------|-------------|---------|
| `public.friendships` | `friendships_friend_id_fkey` | friend_id |
| `public.group_encryption` | `group_encryption_group_id_fkey` | group_id |
| `public.group_invites` | `group_invites_invited_by_fkey` | invited_by |
| `public.group_invites` | `group_invites_invited_user_id_fkey` | invited_user_id |
| `public.group_members` | `group_members_group_id_fkey` | group_id |
| `public.groups` | `groups_creator_id_fkey` | creator_id |
| `public.messages` | `messages_sender_id_fkey` | sender_id |

**Impact**: Lack of indexes on foreign keys can significantly impact join performance, especially for large tables. When database engines join tables, they need to match rows between them. Without indexes on the join columns, the database must perform full table scans, which become increasingly inefficient as tables grow.

### 2. Unused Indexes

Five indexes were identified as potentially unused:

| Table | Index |
|-------|-------|
| `public.messages` | `idx_messages_read_status` |
| `public.profiles` | `profiles_id_idx` |
| `public.profiles` | `profiles_username_idx` |
| `public.signaling` | `signaling_receiver_id_idx` |
| `public.messages` | `idx_messages_group_id` |

**Impact**: Unused indexes consume storage space and can slow down write operations (INSERT/UPDATE/DELETE) without providing any read performance benefit. Each time a row is modified, the database must also update all associated indexes, causing unnecessary overhead.

### 3. Inefficient Function

Query performance analysis showed that the `check_and_add_columns` function accounted for 11.8% of total query time.

**Impact**: This function was inefficiently implemented, causing unnecessary database overhead, particularly during schema validation operations.

## Solutions Implemented

### 1. Added Missing Indexes

Created indexes for all identified unindexed foreign keys:

```sql
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON public.friendships(friend_id);
CREATE INDEX IF NOT EXISTS idx_group_encryption_group_id ON public.group_encryption(group_id);
CREATE INDEX IF NOT EXISTS idx_group_invites_invited_by ON public.group_invites(invited_by);
CREATE INDEX IF NOT EXISTS idx_group_invites_invited_user_id ON public.group_invites(invited_user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_groups_creator_id ON public.groups(creator_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
```

**Expected Improvement**: Join operations involving these tables will be significantly faster, especially for larger tables like `messages` and `friendships`.

### 2. Handled Unused Indexes

Instead of immediately dropping the unused indexes (which could be risky if they're used by occasional queries not captured during analysis), we provided commented-out DROP statements and created an `analyze_index_usage` function to help monitor index usage:

```sql
CREATE OR REPLACE FUNCTION public.analyze_index_usage(days_threshold int DEFAULT 30)
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
) 
```

**Expected Improvement**: This approach allows for safe, data-driven decisions about index removal. Removing truly unused indexes will improve write performance and reduce storage needs.

### 3. Optimized `check_and_add_columns` Function

Rewrote the function to:
- Add proper search_path parameter for security
- Use more efficient query patterns
- Reduce redundant information_schema queries
- Add better error handling

**Expected Improvement**: The function now uses less resources and executes more efficiently, which should significantly reduce its impact on overall database performance.

### 4. Added Maintenance Functions

Created a `perform_index_maintenance` function that can be scheduled to run periodically:

```sql
CREATE OR REPLACE FUNCTION public.perform_index_maintenance()
RETURNS void AS $$
BEGIN
  -- Reindex the most frequently used tables
  REINDEX TABLE public.messages;
  REINDEX TABLE public.profiles;
  REINDEX TABLE public.friendships;
  REINDEX TABLE public.groups;
  
  -- Vacuum analyze the database
  ANALYZE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Expected Improvement**: Regular maintenance helps prevent index bloat and keeps statistics up-to-date, ensuring the query planner makes optimal decisions.

## Implementation

The fixes are packaged in two files:

1. `scripts/fix-supabase-performance.sql` - The SQL script containing all database changes
2. `scripts/apply-performance-fixes.sh` - A shell script to apply the fixes and provide guidance

## Verification

After applying these changes, verify the improvements by:

1. Running the Supabase Database Linter again to check if the unindexed foreign keys issues are resolved
2. Monitoring query performance for critical operations
3. Using the `analyze_index_usage` function to continue monitoring index usage patterns

## Future Recommendations

1. **Regular Maintenance**: Schedule weekly index maintenance using pg_cron
2. **Performance Monitoring**: Set up regular query performance analysis using pg_stat_statements
3. **Index Review**: Review indexes quarterly to remove unused ones and add new ones as query patterns evolve
4. **Table Partitioning**: Consider partitioning the `messages` table if it continues to grow significantly

## Additional Resources

- [PostgreSQL Indexing Strategies](https://www.postgresql.org/docs/current/indexes-strategies.html)
- [Supabase Database Linter Documentation](https://supabase.com/docs/guides/database/database-linter)
- [PostgreSQL Performance Optimization](https://www.postgresql.org/docs/current/performance-tips.html)
