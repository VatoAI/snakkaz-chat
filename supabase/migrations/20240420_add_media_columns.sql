
-- Add media encryption columns to messages table
ALTER TABLE IF EXISTS public.messages 
ADD COLUMN IF NOT EXISTS media_encryption_key TEXT,
ADD COLUMN IF NOT EXISTS media_iv TEXT,
ADD COLUMN IF NOT EXISTS media_metadata JSONB;

-- Update the check_and_add_columns function to include these new columns
CREATE OR REPLACE FUNCTION check_and_add_columns(p_table_name text, column_names text[])
RETURNS void AS $$
DECLARE
    col text;
BEGIN
    FOREACH col IN ARRAY column_names
    LOOP
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = p_table_name 
            AND column_name = col
        ) THEN
            -- Legg til boolean eller timestamp kolonner basert på navn
            IF col LIKE '%\_at' THEN
                EXECUTE format('ALTER TABLE %I ADD COLUMN %I timestamp with time zone', p_table_name, col);
            ELSIF col LIKE '%\_key' OR col LIKE '%\_iv' THEN
                EXECUTE format('ALTER TABLE %I ADD COLUMN %I text', p_table_name, col);
            ELSIF col LIKE '%\_metadata' THEN
                EXECUTE format('ALTER TABLE %I ADD COLUMN %I jsonb', p_table_name, col);
            ELSE
                EXECUTE format('ALTER TABLE %I ADD COLUMN %I boolean DEFAULT false', p_table_name, col);
            END IF;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Call the updated function to ensure all necessary columns exist
SELECT check_and_add_columns('messages', ARRAY['media_encryption_key', 'media_iv', 'media_metadata']);
