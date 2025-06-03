-- Part 1: Messages Table RLS Optimization
-- Fix auth.uid() re-evaluation issues for messages table

-- Messages table policies - Phase 1
ALTER POLICY "Allow authenticated users to insert messages" ON public.messages 
USING ((select auth.uid()) IS NOT NULL);

ALTER POLICY "Allow users to delete their own messages" ON public.messages 
USING ((select auth.uid()) = user_id);

ALTER POLICY "Autentiserte brukere kan sende meldinger" ON public.messages 
USING ((select auth.uid()) IS NOT NULL);

ALTER POLICY "Brukere kan slette sine egne meldinger" ON public.messages 
USING ((select auth.uid()) = user_id);

ALTER POLICY "Users can insert their own messages" ON public.messages 
USING ((select auth.uid()) = user_id);

ALTER POLICY "Users can read messages they sent or received" ON public.messages 
USING ((select auth.uid()) = user_id OR (select auth.uid()) = recipient_id);
