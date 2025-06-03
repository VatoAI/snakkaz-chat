-- Part 2: Profiles Table RLS Optimization
-- Fix auth.uid() re-evaluation issues for profiles table

ALTER POLICY "Brukere kan oppdatere sin egen profil" ON public.profiles 
USING ((select auth.uid()) = id);

ALTER POLICY "Users can delete own profile" ON public.profiles 
USING ((select auth.uid()) = id);

ALTER POLICY "Users can insert their own profile." ON public.profiles 
USING ((select auth.uid()) = id);

ALTER POLICY "Users can update own profile" ON public.profiles 
USING ((select auth.uid()) = id);

ALTER POLICY "Users can update own profile." ON public.profiles 
USING ((select auth.uid()) = id);

ALTER POLICY "Users can update their own profile" ON public.profiles 
USING ((select auth.uid()) = id);
