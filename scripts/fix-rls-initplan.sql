-- Script to fix auth RLS initialization plan issues
-- Replace auth.uid() with (select auth.uid()) to improve query performance

-- Fix policies for messages table
ALTER POLICY "Allow authenticated users to insert messages" ON public.messages
  USING (true) WITH CHECK (auth_user_id = (select auth.uid()));

ALTER POLICY "Allow users to delete their own messages" ON public.messages
  USING (sender_id = (select auth.uid()));

ALTER POLICY "Autentiserte brukere kan sende meldinger" ON public.messages
  USING (true) WITH CHECK (auth_user_id = (select auth.uid()));
  
ALTER POLICY "Brukere kan slette sine egne meldinger" ON public.messages
  USING (sender_id = (select auth.uid()));
  
ALTER POLICY "Users can insert their own messages" ON public.messages
  USING (true) WITH CHECK (sender_id = (select auth.uid()));
  
ALTER POLICY "Users can read messages they sent or received" ON public.messages
  USING (sender_id = (select auth.uid()) OR receiver_id = (select auth.uid()));

-- Fix policies for signaling table
ALTER POLICY "Autentiserte brukere kan sende signaler" ON public.signaling
  USING (true) WITH CHECK (sender_id = (select auth.uid()));

ALTER POLICY "Brukere kan se signaler ment for dem" ON public.signaling
  USING (sender_id = (select auth.uid()) OR receiver_id = (select auth.uid()));

ALTER POLICY "Users can delete their own signals" ON public.signaling
  USING (sender_id = (select auth.uid()));

ALTER POLICY "Users can insert signals" ON public.signaling
  USING (true) WITH CHECK (sender_id = (select auth.uid()));

ALTER POLICY "Users can read signals meant for them" ON public.signaling
  USING (sender_id = (select auth.uid()) OR receiver_id = (select auth.uid()));

-- Fix policies for profiles table
ALTER POLICY "Brukere kan oppdatere sin egen profil" ON public.profiles
  USING (id = (select auth.uid())) WITH CHECK (id = (select auth.uid()));

ALTER POLICY "Users can delete own profile" ON public.profiles
  USING (id = (select auth.uid()));

ALTER POLICY "Users can insert their own profile." ON public.profiles
  USING (true) WITH CHECK (id = (select auth.uid()));

ALTER POLICY "Users can update own profile" ON public.profiles
  USING (id = (select auth.uid())) WITH CHECK (id = (select auth.uid()));

ALTER POLICY "Users can update own profile." ON public.profiles
  USING (id = (select auth.uid())) WITH CHECK (id = (select auth.uid()));

ALTER POLICY "Users can update their own profile" ON public.profiles
  USING (id = (select auth.uid())) WITH CHECK (id = (select auth.uid()));

-- Fix policies for user_presence table
ALTER POLICY "Users can insert their own presence" ON public.user_presence
  USING (true) WITH CHECK (user_id = (select auth.uid()));

ALTER POLICY "Users can update their own presence" ON public.user_presence
  USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));

-- Fix policies for user_roles table
ALTER POLICY "Admins can manage all roles" ON public.user_roles
  USING (has_role('admin'));

ALTER POLICY "Users can view their own roles" ON public.user_roles
  USING (user_id = (select auth.uid()));

-- Fix policies for friendships table
ALTER POLICY "Users can manage their own friendship requests" ON public.friendships
  USING (user_id = (select auth.uid()) OR friend_id = (select auth.uid()));

-- Fix policies for groups table
ALTER POLICY "Groups are viewable by members" ON public.groups
  USING (EXISTS (
    SELECT 1 FROM group_members
    WHERE group_id = groups.id AND user_id = (select auth.uid())
  ));

ALTER POLICY "Group creator can update groups" ON public.groups
  USING (creator_id = (select auth.uid())) WITH CHECK (creator_id = (select auth.uid()));

ALTER POLICY "Users can create groups" ON public.groups
  USING (true) WITH CHECK (creator_id = (select auth.uid()));

ALTER POLICY "Group creator can delete groups" ON public.groups
  USING (creator_id = (select auth.uid()));

-- Fix policies for group_members table
ALTER POLICY "Members are viewable by group members" ON public.group_members
  USING (EXISTS (
    SELECT 1 FROM group_members gm
    WHERE gm.group_id = group_members.group_id AND gm.user_id = (select auth.uid())
  ));

ALTER POLICY "Group admins can add members" ON public.group_members
  USING (true) WITH CHECK (EXISTS (
    SELECT 1 FROM group_members gm
    WHERE gm.group_id = group_members.group_id AND gm.user_id = (select auth.uid()) AND gm.role = 'admin'
  ));

ALTER POLICY "Users can join groups themselves" ON public.group_members
  USING (true) WITH CHECK (user_id = (select auth.uid()));

ALTER POLICY "Group admins can delete members" ON public.group_members
  USING (EXISTS (
    SELECT 1 FROM group_members gm
    WHERE gm.group_id = group_members.group_id AND gm.user_id = (select auth.uid()) AND gm.role = 'admin'
  ));

-- Fix policies for group_invites table
ALTER POLICY "Invites are viewable by invited user" ON public.group_invites
  USING (invited_user_id = (select auth.uid()));

ALTER POLICY "Group admins can create invites" ON public.group_invites
  USING (true) WITH CHECK (EXISTS (
    SELECT 1 FROM group_members gm
    WHERE gm.group_id = group_invites.group_id AND gm.user_id = (select auth.uid()) AND gm.role = 'admin'
  ));

ALTER POLICY "Invited users can delete their invites" ON public.group_invites
  USING (invited_user_id = (select auth.uid()));

-- Fix policies for group_encryption table
ALTER POLICY "Group members can read encryption keys" ON public.group_encryption
  USING (EXISTS (
    SELECT 1 FROM group_members gm
    WHERE gm.group_id = group_encryption.group_id AND gm.user_id = (select auth.uid())
  ));

ALTER POLICY "Group admins can create encryption keys" ON public.group_encryption
  USING (true) WITH CHECK (EXISTS (
    SELECT 1 FROM group_members gm
    WHERE gm.group_id = group_encryption.group_id AND gm.user_id = (select auth.uid()) AND gm.role = 'admin'
  ));
