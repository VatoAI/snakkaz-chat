-- filepath: /workspaces/snakkaz-chat/src/sql/optimizations/fix_rls_performance.sql
-- POSTGRESQL SYNTAX - NOT MS SQL SERVER
-- =============================================================================
-- IMPORTANT: This file uses PostgreSQL-specific syntax for Supabase Row Level Security
-- Your editor may show MS SQL Server syntax errors which should be IGNORED
-- VS Code may incorrectly validate this as MS SQL Server syntax, but this file is meant
-- to be run on PostgreSQL databases only
-- =============================================================================

-- fix_rls_performance.sql
-- Dette skriptet fikser ytelsesproblemene som er identifisert av Supabase Database Linter
-- Problemet er todelt:
-- 1. auth_rls_initplan: Bruk av auth.uid() direkte i stedet for (select auth.uid()) forårsaker dårlig ytelse
-- 2. multiple_permissive_policies: Flere permissive policies for samme rolle og handling på samme tabell

-- =============================================
-- DEL 1: FIKSE AUTH_RLS_INITPLAN ADVARSLER
-- =============================================

-- Oppdater messages-tabell policies
DROP POLICY IF EXISTS "Allow authenticated users to insert messages" ON public.messages;
CREATE POLICY "Allow authenticated users to insert messages" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Allow users to delete their own messages" ON public.messages;
CREATE POLICY "Allow users to delete their own messages" ON public.messages
  FOR DELETE TO authenticated
  USING (sender_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Autentiserte brukere kan sende meldinger" ON public.messages;
CREATE POLICY "Autentiserte brukere kan sende meldinger" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Brukere kan slette sine egne meldinger" ON public.messages;
CREATE POLICY "Brukere kan slette sine egne meldinger" ON public.messages
  FOR DELETE TO authenticated
  USING (sender_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own messages" ON public.messages;
CREATE POLICY "Users can insert their own messages" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can read messages they sent or received" ON public.messages;
CREATE POLICY "Users can read messages they sent or received" ON public.messages
  FOR SELECT TO authenticated
  USING (sender_id = (SELECT auth.uid()) OR recipient_id = (SELECT auth.uid()) OR
         recipient_id IS NULL OR group_id IN (
           SELECT group_id FROM public.group_members 
           WHERE user_id = (SELECT auth.uid())
         ));

-- Oppdater signaling-tabell policies
DROP POLICY IF EXISTS "Autentiserte brukere kan sende signaler" ON public.signaling;
CREATE POLICY "Autentiserte brukere kan sende signaler" ON public.signaling
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Brukere kan se signaler ment for dem" ON public.signaling;
CREATE POLICY "Brukere kan se signaler ment for dem" ON public.signaling
  FOR SELECT TO authenticated
  USING (recipient_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own signals" ON public.signaling;
CREATE POLICY "Users can delete their own signals" ON public.signaling
  FOR DELETE TO authenticated
  USING (sender_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert signals" ON public.signaling;
CREATE POLICY "Users can insert signals" ON public.signaling
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can read signals meant for them" ON public.signaling;
CREATE POLICY "Users can read signals meant for them" ON public.signaling
  FOR SELECT TO authenticated
  USING (recipient_id = (SELECT auth.uid()));

-- Oppdater profiles-tabell policies
DROP POLICY IF EXISTS "Brukere kan oppdatere sin egen profil" ON public.profiles;
CREATE POLICY "Brukere kan oppdatere sin egen profil" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
CREATE POLICY "Users can delete own profile" ON public.profiles
  FOR DELETE TO authenticated
  USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

-- Oppdater user_presence-tabell policies
DROP POLICY IF EXISTS "Users can insert their own presence" ON public.user_presence;
CREATE POLICY "Users can insert their own presence" ON public.user_presence
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own presence" ON public.user_presence;
CREATE POLICY "Users can update their own presence" ON public.user_presence
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Oppdater friendships-tabell policies
DROP POLICY IF EXISTS "Users can manage their own friendship requests" ON public.friendships;
CREATE POLICY "Users can manage their own friendship requests" ON public.friendships
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()) OR friend_id = (SELECT auth.uid()));

-- Oppdater user_roles-tabell policies
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = (SELECT auth.uid())
    AND ur.role = 'admin'
  ));

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Oppdater groups-tabell policies
DROP POLICY IF EXISTS "Groups are viewable by members" ON public.groups;
CREATE POLICY "Groups are viewable by members" ON public.groups
  FOR SELECT TO authenticated
  USING (id IN (
    SELECT group_id FROM public.group_members
    WHERE user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Group creator can update groups" ON public.groups;
CREATE POLICY "Group creator can update groups" ON public.groups
  FOR UPDATE TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create groups" ON public.groups;
CREATE POLICY "Users can create groups" ON public.groups
  FOR INSERT TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Group creator can delete groups" ON public.groups;
CREATE POLICY "Group creator can delete groups" ON public.groups
  FOR DELETE TO authenticated
  USING (creator_id = (SELECT auth.uid()));

-- Oppdater group_members-tabell policies
DROP POLICY IF EXISTS "Members are viewable by group members" ON public.group_members;
CREATE POLICY "Members are viewable by group members" ON public.group_members
  FOR SELECT TO authenticated
  USING (group_id IN (
    SELECT group_id FROM public.group_members
    WHERE user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Group admins can add members" ON public.group_members;
CREATE POLICY "Group admins can add members" ON public.group_members
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_id
    AND gm.user_id = (SELECT auth.uid())
    AND gm.role = 'admin'
  ));

DROP POLICY IF EXISTS "Group admins can delete members" ON public.group_members;
CREATE POLICY "Group admins can delete members" ON public.group_members
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_id
    AND gm.user_id = (SELECT auth.uid())
    AND gm.role = 'admin'
  ));

-- Oppdater group_invites-tabell policies
DROP POLICY IF EXISTS "Invites are viewable by invited user" ON public.group_invites;
CREATE POLICY "Invites are viewable by invited user" ON public.group_invites
  FOR SELECT TO authenticated
  USING (invited_user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Group admins can create invites" ON public.group_invites;
CREATE POLICY "Group admins can create invites" ON public.group_invites
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_id
    AND gm.user_id = (SELECT auth.uid())
    AND gm.role = 'admin'
  ));

DROP POLICY IF EXISTS "Invited users can delete their invites" ON public.group_invites;
CREATE POLICY "Invited users can delete their invites" ON public.group_invites
  FOR DELETE TO authenticated
  USING (invited_user_id = (SELECT auth.uid()));

-- Oppdater group_encryption-tabell policies
DROP POLICY IF EXISTS "Group members can read encryption keys" ON public.group_encryption;
CREATE POLICY "Group members can read encryption keys" ON public.group_encryption
  FOR SELECT TO authenticated
  USING (group_id IN (
    SELECT group_id FROM public.group_members
    WHERE user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Group admins can create encryption keys" ON public.group_encryption;
CREATE POLICY "Group admins can create encryption keys" ON public.group_encryption
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_id
    AND gm.user_id = (SELECT auth.uid())
    AND gm.role = 'admin'
  ));

-- =============================================
-- DEL 2: FIKSE MULTIPLE_PERMISSIVE_POLICIES ADVARSLER
-- =============================================

-- Slå sammen overlappende policies for group_members tabell
DROP POLICY IF EXISTS "Users can join groups themselves" ON public.group_members;
-- Merged into "Group admins can add members" policy with additional conditions

DROP POLICY IF EXISTS "Group admins can add members" ON public.group_members;
CREATE POLICY "Group admins or users can add members" ON public.group_members
  FOR INSERT TO authenticated
  WITH CHECK (
    -- Admin can add any member
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_id
      AND gm.user_id = (SELECT auth.uid())
      AND gm.role = 'admin'
    )
    OR 
    -- Users can add themselves to public groups or with password
    (user_id = (SELECT auth.uid()) AND EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id = group_id
      AND (g.security_level = 'public' OR g.password IS NOT NULL)
    ))
  );

-- Slå sammen overlappende policies for messages tabell
DROP POLICY IF EXISTS "Allow authenticated users to insert messages" ON public.messages;
DROP POLICY IF EXISTS "Autentiserte brukere kan sende meldinger" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert their own messages" ON public.messages;

CREATE POLICY "Users can insert their own messages" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Allow users to delete their own messages" ON public.messages;
DROP POLICY IF EXISTS "Brukere kan slette sine egne meldinger" ON public.messages;

CREATE POLICY "Users can delete their own messages" ON public.messages
  FOR DELETE TO authenticated
  USING (sender_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Allow users to read all messages" ON public.messages;
DROP POLICY IF EXISTS "Anyone can read messages" ON public.messages;
DROP POLICY IF EXISTS "Meldinger er synlige for alle autentiserte brukere" ON public.messages;
DROP POLICY IF EXISTS "Users can read all messages" ON public.messages;
DROP POLICY IF EXISTS "Users can read messages they sent or received" ON public.messages;

CREATE POLICY "Users can access relevant messages" ON public.messages
  FOR SELECT TO authenticated
  USING (
    sender_id = (SELECT auth.uid()) 
    OR recipient_id = (SELECT auth.uid()) 
    OR recipient_id IS NULL 
    OR group_id IN (
      SELECT group_id FROM public.group_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- Slå sammen overlappende policies for profiles tabell
DROP POLICY IF EXISTS "Anyone can insert their profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Profiles er synlige for alle autentiserte brukere" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT TO anon
  USING (true);

DROP POLICY IF EXISTS "Brukere kan oppdatere sin egen profil" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

-- Slå sammen overlappende policies for signaling tabell
DROP POLICY IF EXISTS "Autentiserte brukere kan sende signaler" ON public.signaling;
DROP POLICY IF EXISTS "Users can insert signals" ON public.signaling;

CREATE POLICY "Users can insert signals" ON public.signaling
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Brukere kan se signaler ment for dem" ON public.signaling;
DROP POLICY IF EXISTS "Users can read signals meant for them" ON public.signaling;

CREATE POLICY "Users can read signals meant for them" ON public.signaling
  FOR SELECT TO authenticated
  USING (recipient_id = (SELECT auth.uid()));

-- Slå sammen overlappende policies for user_roles tabell
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Users can view roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR 
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = (SELECT auth.uid())
      AND ur.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = (SELECT auth.uid())
    AND ur.role = 'admin'
  ));