
-- Ensure we have the user_status enum type
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
    CREATE TYPE public.user_status AS ENUM ('online', 'busy', 'brb', 'offline');
  ELSE
    -- Try to add 'offline' to the existing enum if it doesn't already exist
    BEGIN
      ALTER TYPE public.user_status ADD VALUE IF NOT EXISTS 'offline';
    EXCEPTION
      WHEN duplicate_object THEN
        -- Value already exists, nothing to do
    END;
  END IF;
END$$;

-- Function to clean up stale presence records (older than 5 minutes)
CREATE OR REPLACE FUNCTION clean_stale_presence()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.user_presence
  WHERE last_seen < NOW() - INTERVAL '5 minutes';
END;
$$;

-- Make sure we have the clean-up trigger
DROP TRIGGER IF EXISTS trigger_clean_stale_presence ON public.user_presence;
CREATE TRIGGER trigger_clean_stale_presence
  AFTER INSERT OR UPDATE ON public.user_presence
  FOR EACH STATEMENT
  EXECUTE FUNCTION clean_stale_presence();
