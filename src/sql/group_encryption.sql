-- Gruppe-krypteringstabell for å lagre krypteringsnøkler for grupper

-- Sjekk om tabellen allerede eksisterer
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'group_encryption') THEN
    -- Opprett tabellen
    CREATE TABLE group_encryption (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
      session_key TEXT NOT NULL,
      encryption_key TEXT NOT NULL,
      iv TEXT NOT NULL,
      created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      expiry_date TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
      is_active BOOLEAN DEFAULT TRUE NOT NULL,
      rotation_count INTEGER DEFAULT 0 NOT NULL,
      
      -- Hver gruppe skal kun ha én aktiv krypteringsnøkkel
      CONSTRAINT unique_active_group_key UNIQUE (group_id, is_active)
    );

    -- Legg til indekser
    CREATE INDEX idx_group_encryption_group_id ON group_encryption(group_id);
    CREATE INDEX idx_group_encryption_active ON group_encryption(is_active) WHERE is_active = TRUE;
    
    -- Legg til trigger som automatisk oppdaterer updated_at
    CREATE OR REPLACE FUNCTION update_modified_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON group_encryption
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();
    
    -- Legg til en row level security policy som begrenser tilgang
    ALTER TABLE group_encryption ENABLE ROW LEVEL SECURITY;
    
    -- Medlemmer av en gruppe kan lese krypteringsnøkkelen
    CREATE POLICY group_encryption_read_policy ON group_encryption
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM group_members
          WHERE group_members.group_id = group_encryption.group_id
            AND group_members.user_id = auth.uid()
        )
      );
    
    -- Bare administratorer av en gruppe kan opprette eller oppdatere en krypteringsnøkkel
    CREATE POLICY group_encryption_insert_policy ON group_encryption
      FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM group_members
          WHERE group_members.group_id = group_encryption.group_id
            AND group_members.user_id = auth.uid()
            AND group_members.role = 'admin'
        )
      );
    
    CREATE POLICY group_encryption_update_policy ON group_encryption
      FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM group_members
          WHERE group_members.group_id = group_encryption.group_id
            AND group_members.user_id = auth.uid()
            AND group_members.role = 'admin'
        )
      );
      
    -- Opprett funksjon og trigger som automatisk oppretter en oppføring når nye grupper lages
    CREATE OR REPLACE FUNCTION create_group_encryption_entry()
    RETURNS TRIGGER AS $$
    DECLARE
      default_key TEXT := encode(gen_random_bytes(32), 'base64');
      default_iv TEXT := encode(gen_random_bytes(16), 'base64');
    BEGIN
        -- Vi oppretter en standardoppføring med en tilfeldig nøkkel
        -- Dette gir en viss grad av sikkerhet selv før brukeren setter sin egen nøkkel
        INSERT INTO public.group_encryption (
          group_id, 
          session_key, 
          encryption_key, 
          iv, 
          created_by
        )
        VALUES (
          NEW.id, 
          default_key, 
          default_key, 
          default_iv, 
          auth.uid()
        );
        
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Opprett trigger som kjører når ny gruppe opprettes
    DROP TRIGGER IF EXISTS on_group_created ON public.groups;
    CREATE TRIGGER on_group_created
        AFTER INSERT ON public.groups
        FOR EACH ROW
        EXECUTE FUNCTION create_group_encryption_entry();

    RAISE NOTICE 'Created group_encryption table with triggers and policies';
  ELSE
    RAISE NOTICE 'group_encryption table already exists';
  END IF;
END $$;