
-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.cleanup_old_signaling_records;

-- Enhanced function to clean up old signaling records with better error handling
CREATE OR REPLACE FUNCTION public.cleanup_old_signaling_records()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  cleaned_count INTEGER;
BEGIN
  -- Delete records older than 5 minutes with proper logging
  DELETE FROM public.signaling
  WHERE created_at < NOW() - INTERVAL '5 minutes'
  RETURNING COUNT(*) INTO cleaned_count;
  
  -- Log the cleanup to the health table for monitoring
  INSERT INTO public.health (id, status, last_checked)
  VALUES ('38d75fee-16f2-4b42-a084-93567e21e3a7', 'signaling_cleaned_' || cleaned_count, NOW())
  ON CONFLICT (id) DO UPDATE
  SET last_checked = NOW(),
      status = 'signaling_cleaned_' || cleaned_count;

  RETURN NULL; -- Triggers must return a trigger type, NULL is acceptable here
EXCEPTION WHEN OTHERS THEN
  -- Log errors to the health table
  INSERT INTO public.health (id, status, last_checked)
  VALUES ('38d75fee-16f2-4b42-a084-93567e21e3a7', 'signaling_error_' || SQLERRM, NOW())
  ON CONFLICT (id) DO UPDATE
  SET last_checked = NOW(),
      status = 'signaling_error_' || SQLERRM;
  
  RETURN NULL;
END;
$$;

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.clean_stale_presence;

-- Enhanced function to clean up stale presence records with better error handling
CREATE OR REPLACE FUNCTION public.clean_stale_presence()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  cleaned_count INTEGER;
BEGIN
  -- Delete presence records older than 5 minutes
  DELETE FROM public.user_presence
  WHERE last_seen < NOW() - INTERVAL '5 minutes'
  RETURNING COUNT(*) INTO cleaned_count;

  -- Log the cleanup to the health table
  INSERT INTO public.health (id, status, last_checked)
  VALUES ('38d75fee-16f2-4b42-a084-93567e21e3a7', 'presence_cleaned_' || cleaned_count, NOW())
  ON CONFLICT (id) DO UPDATE
  SET last_checked = NOW(),
      status = 'presence_cleaned_' || cleaned_count;

  RETURN NULL;
EXCEPTION WHEN OTHERS THEN
  -- Log errors to the health table
  INSERT INTO public.health (id, status, last_checked)
  VALUES ('38d75fee-16f2-4b42-a084-93567e21e3a7', 'presence_error_' || SQLERRM, NOW())
  ON CONFLICT (id) DO UPDATE
  SET last_checked = NOW(),
      status = 'presence_error_' || SQLERRM;
  
  RETURN NULL;
END;
$$;

-- Add a trigger to run cleanup periodically for signaling with improved frequency
DROP TRIGGER IF EXISTS trigger_cleanup_signaling ON public.signaling;
CREATE TRIGGER trigger_cleanup_signaling
  AFTER INSERT ON public.signaling
  FOR EACH ROW
  EXECUTE FUNCTION public.cleanup_old_signaling_records();

-- Add a trigger to run cleanup periodically for user presence
DROP TRIGGER IF EXISTS trigger_cleanup_presence ON public.user_presence;
CREATE TRIGGER trigger_cleanup_presence
  AFTER INSERT ON public.user_presence
  FOR EACH ROW
  EXECUTE FUNCTION public.clean_stale_presence();

-- Create health table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'health') THEN
    CREATE TABLE public.health (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      status TEXT NOT NULL DEFAULT 'ok',
      last_checked TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
    
    -- Insert initial health record
    INSERT INTO public.health (id, status, last_checked)
    VALUES ('38d75fee-16f2-4b42-a084-93567e21e3a7', 'initialized', NOW());
  END IF;
END
$$;

-- Ensure indexes exist for performance
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'signaling' AND indexname = 'idx_signaling_created_at') THEN
    CREATE INDEX idx_signaling_created_at ON public.signaling (created_at);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'user_presence' AND indexname = 'idx_user_presence_last_seen') THEN
    CREATE INDEX idx_user_presence_last_seen ON public.user_presence (last_seen);
  END IF;
END
$$;
