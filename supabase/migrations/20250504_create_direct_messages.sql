-- Oppretter direct_messages-tabellen som mangler men er referert til i koden
CREATE TABLE IF NOT EXISTS direct_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  encrypted_content TEXT,
  encryption_key TEXT,
  iv TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP WITH TIME ZONE,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  media_url TEXT,
  media_type TEXT,
  ephemeral_ttl INTEGER,
  read_at TIMESTAMP WITH TIME ZONE,
  is_delivered BOOLEAN DEFAULT FALSE,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  reply_to_message_id UUID REFERENCES direct_messages(id) ON DELETE SET NULL
);

-- Indekser for bedre ytelse
CREATE INDEX IF NOT EXISTS idx_direct_messages_sender_id ON direct_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_receiver_id ON direct_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_created_at ON direct_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_direct_messages_group_id ON direct_messages(group_id);

-- Tilgangskontroll
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Brukere kan bare lese meldinger de har sendt eller mottatt,
-- eller meldinger som er del av en gruppe de er medlem av
CREATE POLICY "Brukere kan lese egne meldinger"
  ON direct_messages
  FOR SELECT
  USING (
    auth.uid() = sender_id 
    OR auth.uid() = receiver_id 
    OR EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_members.group_id = direct_messages.group_id 
      AND group_members.user_id = auth.uid()
    )
  );

-- Policy: Brukere kan bare sende meldinger som seg selv
CREATE POLICY "Brukere kan sende meldinger som seg selv"
  ON direct_messages
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Policy: Brukere kan bare endre egne meldinger
CREATE POLICY "Brukere kan endre egne meldinger"
  ON direct_messages
  FOR UPDATE
  USING (auth.uid() = sender_id);

-- Policy: Brukere kan bare slette egne meldinger
CREATE POLICY "Brukere kan slette egne meldinger"
  ON direct_messages
  FOR DELETE
  USING (auth.uid() = sender_id);

-- Funksjon for å sette updated_at automatisk
CREATE OR REPLACE FUNCTION update_direct_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for å sette updated_at automatisk
CREATE TRIGGER set_direct_messages_updated_at
BEFORE UPDATE ON direct_messages
FOR EACH ROW
EXECUTE FUNCTION update_direct_messages_updated_at();

-- Funksjon for å håndtere automatisk sletting av meldinger basert på ttl
CREATE OR REPLACE FUNCTION check_direct_messages_ttl()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ephemeral_ttl IS NOT NULL THEN
    -- Sett opp en notifikasjon for når meldingen skal slettes
    PERFORM pg_notify(
      'message_ttl_channel',
      json_build_object(
        'id', NEW.id,
        'delete_at', (NEW.created_at + (NEW.ephemeral_ttl || ' seconds')::interval)::text
      )::text
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for å håndtere automatisk sletting av meldinger
CREATE TRIGGER direct_messages_ttl_trigger
AFTER INSERT ON direct_messages
FOR EACH ROW
WHEN (NEW.ephemeral_ttl IS NOT NULL)
EXECUTE FUNCTION check_direct_messages_ttl();
