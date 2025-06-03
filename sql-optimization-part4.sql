-- Part 4: Other Tables RLS Optimization
-- Fix auth.uid() re-evaluation issues for remaining tables

-- Signaling table policies
ALTER POLICY "Autentiserte brukere kan sende signaler" ON public.signaling 
USING ((select auth.uid()) IS NOT NULL);

ALTER POLICY "Brukere kan se signaler ment for dem" ON public.signaling 
USING ((select auth.uid()) = target_user_id);

ALTER POLICY "Users can delete their own signals" ON public.signaling 
USING ((select auth.uid()) = from_user_id);

ALTER POLICY "Users can insert signals" ON public.signaling 
USING ((select auth.uid()) = from_user_id);

ALTER POLICY "Users can read signals meant for them" ON public.signaling 
USING ((select auth.uid()) = target_user_id);

-- User presence table policies
ALTER POLICY "Users can insert their own presence" ON public.user_presence 
USING ((select auth.uid()) = user_id);

ALTER POLICY "Users can update their own presence" ON public.user_presence 
USING ((select auth.uid()) = user_id);

-- Friendships table policies
ALTER POLICY "Users can manage their own friendship requests" ON public.friendships 
USING ((select auth.uid()) = user_id OR (select auth.uid()) = friend_id);

-- User roles table policies
ALTER POLICY "Admins can manage all roles" ON public.user_roles 
USING ((select auth.uid()) IS NOT NULL);

ALTER POLICY "Users can view their own roles" ON public.user_roles 
USING ((select auth.uid()) = user_id);

-- Subscriptions table policies
ALTER POLICY "Users can view their own subscriptions" ON public.subscriptions 
USING ((select auth.uid()) = user_id);
