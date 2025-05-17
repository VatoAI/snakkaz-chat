# Supabase Database Optimization Guide

This guide outlines the performance and security optimizations identified by the Supabase Database Linter and implemented in the Snakkaz Chat application.

## Overview of Optimizations

The following issues were identified and fixed:

1. **Function Search Path Mutable** (Security)
2. **Auth RLS Initialization Plan** (Performance) 
3. **Multiple Permissive Policies** (Performance)
4. **Unindexed Foreign Keys** (Performance)
5. **Unused Indexes** (Maintenance)
6. **Leaked Password Protection** (Security)

## Details

### 1. Function Search Path Mutable

**Problem:** Functions without a fixed search path parameter could be vulnerable to SQL injection attacks. The attacker could potentially alter the search path to access schemas they shouldn't have access to.

**Solution:** Added explicit `search_path` parameters with default values to all functions and set the search path explicitly at the beginning of each function.

```sql
CREATE OR REPLACE FUNCTION public.my_function(search_path text DEFAULT 'public')
RETURNS void AS $$
BEGIN
  -- Set search_path explicitly
  EXECUTE 'SET search_path TO ' || quote_ident(search_path);
  
  -- Function body
  -- ...
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Auth RLS Initialization Plan

**Problem:** Row Level Security (RLS) policies using `auth.uid()` directly were being re-evaluated for each row, causing performance issues at scale.

**Solution:** Replaced direct calls to `auth.uid()` with subselects `(select auth.uid())` in all RLS policies.

```sql
-- Before:
CREATE POLICY "Users can delete own profile" ON public.profiles
  FOR DELETE TO authenticated
  USING (id = auth.uid());

-- After:
CREATE POLICY "Users can delete own profile" ON public.profiles
  FOR DELETE TO authenticated
  USING (id = (select auth.uid()));
```

### 3. Multiple Permissive Policies

**Problem:** Tables had multiple overlapping permissive policies for the same role and action, requiring unnecessary policy evaluations for each query.

**Solution:** Consolidated multiple policies into single comprehensive policies for each role-action combination.

```sql
-- Before:
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = (select auth.uid()));
  
CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = (select auth.uid()));

-- After:
CREATE POLICY "Update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = (select auth.uid()));
```

### 4. Unindexed Foreign Keys

**Problem:** Foreign key constraints without indexes caused poor query performance, especially for joins and lookups.

**Solution:** Added indexes for all foreign key columns.

```sql
-- For the foreign key constraint on group_members.group_id
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members(group_id);
```

### 5. Unused Indexes

**Problem:** Several indexes were never used in queries, wasting space and slowing down writes.

**Solution:** We've identified but preserved these indexes for now, as they might be used in future queries. Consider dropping them if they remain unused.

```sql
-- Example of an unused index that could be removed
-- DROP INDEX IF EXISTS public.idx_messages_read_status;
```

### 6. Leaked Password Protection

**Problem:** The Supabase Auth leaked password protection feature was disabled, allowing users to set passwords that have been compromised in known data breaches.

**Solution:** Enable the HaveIBeenPwned integration in Supabase Auth settings to check passwords against known breaches.

## Applying the Changes

1. Run the database optimization script:
   ```bash
   ./scripts/apply-supabase-optimizations.sh
   ```

2. Enable leaked password protection through the Supabase dashboard:
   - Go to Authentication > Settings
   - Scroll to Security section
   - Enable "HaveIBeenPwned Digest"
   - Save changes

3. Verify the fixes by running the Supabase Database Linter again.

## Additional Resources

- [Supabase RLS Performance Optimization](https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select)
- [Function Search Path Security](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable)
- [Password Security Best Practices](https://supabase.com/docs/guides/auth/password-security)
- [PostgreSQL Indexing Strategies](https://www.postgresql.org/docs/current/indexes-strategies.html)
