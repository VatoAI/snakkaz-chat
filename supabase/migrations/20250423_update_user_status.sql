
-- Ensure we have the user_status enum type with the right values
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
    -- If the type exists, try to add 'brb' and 'offline' values if they don't already exist
    BEGIN
      ALTER TYPE public.user_status ADD VALUE IF NOT EXISTS 'brb';
      ALTER TYPE public.user_status ADD VALUE IF NOT EXISTS 'offline';
    EXCEPTION
      WHEN duplicate_object THEN
        -- Value already exists, nothing to do
    END;
  ELSE
    -- Create the type with all needed values
    CREATE TYPE public.user_status AS ENUM ('online', 'busy', 'brb', 'offline');
  END IF;
END$$;
