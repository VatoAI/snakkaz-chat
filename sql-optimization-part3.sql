-- Part 3: Groups & Members RLS Optimization
-- Fix auth.uid() re-evaluation issues for group-related tables

-- Groups table policies
ALTER POLICY "Groups are viewable by members" ON public.groups 
USING (EXISTS (
  SELECT 1 FROM group_members 
  WHERE group_id = groups.id 
  AND user_id = (select auth.uid())
));

ALTER POLICY "Group creator can update groups" ON public.groups 
USING ((select auth.uid()) = created_by);

ALTER POLICY "Users can create groups" ON public.groups 
USING ((select auth.uid()) = created_by);

ALTER POLICY "Group creator can delete groups" ON public.groups 
USING ((select auth.uid()) = created_by);

-- Group members table policies
ALTER POLICY "Members are viewable by group members" ON public.group_members 
USING (EXISTS (
  SELECT 1 FROM group_members gm2 
  WHERE gm2.group_id = group_members.group_id 
  AND gm2.user_id = (select auth.uid())
));

ALTER POLICY "Group admins can add members" ON public.group_members 
USING (EXISTS (
  SELECT 1 FROM group_members gm 
  WHERE gm.group_id = group_members.group_id 
  AND gm.user_id = (select auth.uid()) 
  AND gm.role = 'admin'
));

ALTER POLICY "Users can join groups themselves" ON public.group_members 
USING ((select auth.uid()) = user_id);

ALTER POLICY "Group admins can delete members" ON public.group_members 
USING (EXISTS (
  SELECT 1 FROM group_members gm 
  WHERE gm.group_id = group_members.group_id 
  AND gm.user_id = (select auth.uid()) 
  AND gm.role = 'admin'
));
