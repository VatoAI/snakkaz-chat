-- Funksjon for å sjekke og legge til kolonner hvis de ikke finnes
CREATE OR REPLACE FUNCTION check_and_add_columns(p_table_name text, column_names text[])
RETURNS void AS $$
DECLARE
    col text;
BEGIN
    SET search_path = public;
    
    FOREACH col IN ARRAY column_names
    LOOP
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = p_table_name 
            AND column_name = col
        ) THEN
            -- Legg til riktig kolonnetyper basert på navn
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

-- Funksjon for å markere en melding som slettet
CREATE OR REPLACE FUNCTION mark_message_as_deleted(message_id uuid, user_id uuid)
RETURNS void AS $$
BEGIN
    UPDATE messages
    SET 
        is_deleted = true,
        deleted_at = now()
    WHERE 
        id = message_id 
        AND sender_id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Funksjon for å markere en melding som lest
CREATE OR REPLACE FUNCTION mark_message_as_read(message_id uuid)
RETURNS void AS $$
BEGIN
    UPDATE messages
    SET 
        read_at = now(),
        is_delivered = true
    WHERE 
        id = message_id;
END;
$$ LANGUAGE plpgsql;

-- Ensure signaling table has proper indexing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE tablename = 'signaling'
        AND indexname = 'idx_signaling_created_at'
    ) THEN
        CREATE INDEX idx_signaling_created_at ON public.signaling (created_at);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE tablename = 'signaling'
        AND indexname = 'idx_signaling_receiver_id'
    ) THEN
        CREATE INDEX idx_signaling_receiver_id ON public.signaling (receiver_id);
    END IF;
END
$$;

-- Ensure user_presence table has proper indexing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE tablename = 'user_presence'
        AND indexname = 'idx_user_presence_last_seen'
    ) THEN
        CREATE INDEX idx_user_presence_last_seen ON public.user_presence (last_seen);
    END IF;
END
$$;

-- Kjør check_and_add_columns for å sikre at vi har alle nødvendige kolonner
SELECT check_and_add_columns('messages', ARRAY[
    'is_edited', 
    'edited_at', 
    'is_deleted', 
    'deleted_at', 
    'group_id', 
    'read_at', 
    'is_delivered', 
    'encryption_key', 
    'iv', 
    'media_encryption_key', 
    'media_iv', 
    'media_metadata'
]);
