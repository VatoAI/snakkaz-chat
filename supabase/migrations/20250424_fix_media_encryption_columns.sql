-- Drop the old function if it exists
DROP FUNCTION IF EXISTS public.check_and_add_columns(text, text[]);

-- Create a more robust function to check for and add columns
CREATE OR REPLACE FUNCTION public.add_column_if_not_exists(
  p_table_name text,
  p_column_name text,
  p_column_type text
) RETURNS void AS $$
BEGIN
  -- Check if the column already exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = p_table_name
    AND column_name = p_column_name
  ) THEN
    -- If not, add it
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN %I %s', p_table_name, p_column_name, p_column_type);
    RAISE NOTICE 'Added column % to table %', p_column_name, p_table_name;
  ELSE
    RAISE NOTICE 'Column % already exists in table %', p_column_name, p_table_name;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Add each column individually with proper error handling
DO $$
BEGIN
  -- Add media_encryption_key column
  PERFORM public.add_column_if_not_exists('messages', 'media_encryption_key', 'TEXT');
  
  -- Add media_iv column
  PERFORM public.add_column_if_not_exists('messages', 'media_iv', 'TEXT');
  
  -- Add media_metadata column
  PERFORM public.add_column_if_not_exists('messages', 'media_metadata', 'JSONB');
  
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Migration failed: %', SQLERRM;
END $$;

-- After migration completes, we can drop our temporary function 
DROP FUNCTION IF EXISTS public.add_column_if_not_exists(text, text, text);