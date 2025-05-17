-- Script to consolidate multiple permissive policies
-- This will combine policies that apply to the same role and action to improve performance

-- Fix group_members table policies
DROP POLICY IF EXISTS "Group admins can add members" ON public.group_members;
DROP POLICY IF EXISTS "Users can join groups themselves" ON public.group_members;
CREATE POLICY "Manage group membership" ON public.group_members
  FOR INSERT TO authenticated
  USING (true)
  WITH CHECK (
    user_id = (select auth.uid()) -- User can add themselves
    OR EXISTS (  -- Admin can add anyone to groups they manage
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = group_members.group_id 
      AND gm.user_id = (select auth.uid()) 
      AND gm.role = 'admin'
    )
  );

-- Fix messages table policies for DELETE
DROP POLICY IF EXISTS "Allow users to delete their own messages" ON public.messages;
DROP POLICY IF EXISTS "Brukere kan slette sine egne meldinger" ON public.messages;
CREATE POLICY "Delete own messages" ON public.messages
  FOR DELETE TO authenticated
  USING (sender_id = (select auth.uid()));

-- Fix messages table policies for INSERT
DROP POLICY IF EXISTS "Allow authenticated users to insert messages" ON public.messages;
DROP POLICY IF EXISTS "Autentiserte brukere kan sende meldinger" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert their own messages" ON public.messages;
CREATE POLICY "Insert own messages" ON public.messages
  FOR INSERT TO authenticated
  USING (true)
  WITH CHECK (sender_id = (select auth.uid()));

-- Fix messages table policies for SELECT
DROP POLICY IF EXISTS "Allow users to read all messages" ON public.messages;
DROP POLICY IF EXISTS "Anyone can read messages" ON public.messages;
DROP POLICY IF EXISTS "Meldinger er synlige for alle autentiserte brukere" ON public.messages;
DROP POLICY IF EXISTS "Users can read all messages" ON public.messages;
DROP POLICY IF EXISTS "Users can read messages they sent or received" ON public.messages;
CREATE POLICY "Read messages" ON public.messages
  FOR SELECT TO authenticated
  USING (
    sender_id = (select auth.uid()) 
    OR receiver_id = (select auth.uid())
    OR (
      receiver_type = 'group' AND EXISTS (
        SELECT 1 FROM group_members
        WHERE group_id = messages.group_id
        AND user_id = (select auth.uid())
      )
    )
  );

-- Fix profiles table policies for INSERT
DROP POLICY IF EXISTS "Anyone can insert their profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  USING (true)
  WITH CHECK (id = (select auth.uid()));

-- Fix profiles table policies for SELECT
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Profiles er synlige for alle autentiserte brukere" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "View profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (true);
CREATE POLICY "View profiles for anonymous" ON public.profiles
  FOR SELECT TO anon
  USING (is_public = true);

-- Fix profiles table policies for UPDATE
DROP POLICY IF EXISTS "Brukere kan oppdatere sin egen profil" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- Fix signaling table policies for INSERT
DROP POLICY IF EXISTS "Autentiserte brukere kan sende signaler" ON public.signaling;
DROP POLICY IF EXISTS "Users can insert signals" ON public.signaling;
CREATE POLICY "Insert own signals" ON public.signaling
  FOR INSERT TO authenticated
  USING (true)
  WITH CHECK (sender_id = (select auth.uid()));

-- Fix signaling table policies for SELECT
DROP POLICY IF EXISTS "Brukere kan se signaler ment for dem" ON public.signaling;
DROP POLICY IF EXISTS "Users can read signals meant for them" ON public.signaling;
CREATE POLICY "Read signals" ON public.signaling
  FOR SELECT TO authenticated
  USING (sender_id = (select auth.uid()) OR receiver_id = (select auth.uid()));

-- Fix user_roles table policies for SELECT
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "View roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (
    user_id = (select auth.uid()) -- Users can view their own roles
    OR EXISTS (  -- Admins can view all roles
      SELECT 1 FROM user_roles
      WHERE user_id = (select auth.uid())
      AND role = 'admin'
    )
  );
