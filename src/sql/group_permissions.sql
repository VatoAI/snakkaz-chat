-- Legg til nye felter for gruppetillatelser og TTL-alternativer

-- Sjekk og oppdater tabellstruktur for groups
DO $$
BEGIN
  -- Legg til write_permissions felt hvis det ikke finnes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'groups' AND column_name = 'write_permissions') THEN
    ALTER TABLE groups ADD COLUMN write_permissions TEXT NOT NULL DEFAULT 'all';
    RAISE NOTICE 'Added write_permissions column to groups table';
  END IF;

  -- Legg til default_message_ttl felt hvis det ikke finnes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'groups' AND column_name = 'default_message_ttl') THEN
    ALTER TABLE groups ADD COLUMN default_message_ttl INTEGER DEFAULT NULL;
    RAISE NOTICE 'Added default_message_ttl column to groups table';
  END IF;

  -- Opprett en constraint for write_permissions for å sikre gyldige verdier
  IF NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage 
                WHERE table_name = 'groups' AND column_name = 'write_permissions' 
                AND constraint_name = 'groups_write_permissions_check') THEN
    ALTER TABLE groups ADD CONSTRAINT groups_write_permissions_check 
      CHECK (write_permissions IN ('all', 'admin', 'selected'));
    RAISE NOTICE 'Added constraint for write_permissions column';
  END IF;

  -- Sjekk og oppdater tabellstruktur for group_members
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'group_members' AND column_name = 'can_write') THEN
    ALTER TABLE group_members ADD COLUMN can_write BOOLEAN DEFAULT TRUE;
    RAISE NOTICE 'Added can_write column to group_members table';
  END IF;

END $$;

-- Oppdater eksisterende oppføringer for å sikre konsistens
UPDATE groups SET write_permissions = 'all' WHERE write_permissions IS NULL;
UPDATE group_members SET can_write = TRUE WHERE can_write IS NULL;

-- Kommentar om hvordan feltene brukes
COMMENT ON COLUMN groups.write_permissions IS 'Kontrollerer hvem som kan skrive meldinger i gruppen. Verdier: "all" (alle medlemmer), "admin" (kun administratorer), "selected" (utvalgte medlemmer)';
COMMENT ON COLUMN groups.default_message_ttl IS 'Standard tid i sekunder før meldinger slettes automatisk. NULL betyr at meldinger ikke slettes automatisk';
COMMENT ON COLUMN group_members.can_write IS 'Om medlemmet har tillatelse til å skrive meldinger i gruppen. Relevant når gruppens write_permissions er "selected"';