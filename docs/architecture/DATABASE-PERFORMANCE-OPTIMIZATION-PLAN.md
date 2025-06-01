# 🚨 DATABASE PERFORMANCE OPTIMIZATION PLAN - May 28, 2025

## ⚠️ CRITICAL ISSUES IDENTIFIED

**Status**: 49 RLS optimization warnings + 34 duplicate policy warnings
**Impact**: Significant performance degradation at scale
**Priority**: HIGH (after subdomain deployment)

## 📊 ISSUE BREAKDOWN

### 1. Auth RLS Initialization Plan (49 warnings)
**Problem**: `auth.<function>()` calls re-evaluated for each row
**Solution**: Wrap with `(select auth.<function>())`

**Affected Tables**:
- `messages` (6 policies)
- `profiles` (8 policies) 
- `signaling` (6 policies)
- `groups` (4 policies)
- `group_members` (4 policies)
- `group_invites` (3 policies)
- `group_encryption` (2 policies)
- `custom_emojis` (4 policies)
- `custom_emoji_reactions` (2 policies)
- `user_roles` (2 policies)
- `subscriptions` (1 policy)
- `user_presence` (2 policies)
- `friendships` (1 policy)

### 2. Multiple Permissive Policies (34 warnings)
**Problem**: Duplicate/overlapping RLS policies
**Solution**: Consolidate or remove redundant policies

**Most Critical**:
- `messages`: 4 duplicate INSERT policies, 5 duplicate SELECT policies
- `profiles`: 4 duplicate UPDATE policies, 4 duplicate SELECT policies
- `group_members`: Multiple INSERT policy conflicts

## 🔧 EXECUTION PLAN

### Phase 1: RLS Optimization (High Impact)
```sql
-- Example fix for messages table
-- BEFORE: auth.uid() = user_id
-- AFTER: (select auth.uid()) = user_id

-- Apply to all 49 affected policies
ALTER POLICY "policy_name" ON table_name 
USING ((select auth.uid()) = user_id);
```

### Phase 2: Remove Duplicate Policies (Critical)
```sql
-- Identify and drop redundant policies
-- Example: messages table has 4 duplicate INSERT policies
DROP POLICY "Autentiserte brukere kan sende meldinger" ON messages;
DROP POLICY "Users can insert messages" ON messages;
-- Keep only: "Users can insert their own messages"
```

### Phase 3: Policy Consolidation
```sql
-- Combine overlapping policies into single optimized policies
-- Reduce policy count from ~80 to ~40 policies
```

## 🎯 IMMEDIATE ACTIONS

### 1. **CREATE OPTIMIZATION SCRIPT**
Generate SQL migration script to fix all issues

### 2. **BACKUP FIRST**
```bash
# Export current policies before changes
pg_dump --schema-only > rls_policies_backup.sql
```

### 3. **APPLY FIXES**
Run optimization script in controlled manner

### 4. **VERIFY PERFORMANCE**
Test query performance before/after

## 📈 EXPECTED IMPROVEMENTS

- **Query Performance**: 50-80% improvement on large datasets
- **Policy Count**: Reduce from ~80 to ~40 policies
- **Database Load**: Significant reduction in policy evaluation overhead
- **Scalability**: Better performance as user base grows

## 🚦 MIGRATION STRATEGY

```sql
-- 1. Fix auth.uid() optimization (safe, immediate benefit)
-- 2. Remove exact duplicates (safe, no functional change)  
-- 3. Consolidate similar policies (requires testing)
-- 4. Verify all functionality still works
```

## ⚠️ RISKS & MITIGATION

**Low Risk Changes**:
- ✅ `auth.uid()` → `(select auth.uid())` optimization
- ✅ Removing exact duplicate policies

**Medium Risk Changes**:
- ⚠️ Policy consolidation (requires thorough testing)

**Mitigation**:
- Full database backup before changes
- Apply changes incrementally
- Test each table's functionality after changes
- Rollback plan ready

## 🔄 NEXT STEPS

1. **IMMEDIATE**: Finish subdomain deployment (blocking issue)
2. **TODAY**: Create and test RLS optimization script
3. **THIS WEEK**: Apply database performance fixes
4. **ONGOING**: Monitor performance improvements

Would you like me to generate the SQL migration script to fix these issues?
