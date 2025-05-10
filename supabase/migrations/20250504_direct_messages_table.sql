-- Opprett direct_messages tabell som er referert til i koden men som mangler i databasen
-- Dette vil støtte direktemeldings-funksjonaliteten i appen

-- Opprett direct_messages tabell hvis den ikke finnes
CREATE TABLE IF NOT EXISTS public.direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  receiver_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT,
  encrypted_content TEXT, -- For krypterte meldinger
  encryption_key TEXT,    -- For krypterte meldinger 
  iv TEXT,                -- Initialiserings-vektor for kryptering
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMPTZ,
  is_delivered BOOLEAN DEFAULT false,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  is_encrypted BOOLEAN DEFAULT false,
  media_url TEXT,
  media_type TEXT,
  thumbnail_url TEXT,
  ephemeral_ttl INTEGER, -- Tid før meldingen forsvinner automatisk (i sekunder)
  media_encryption_key TEXT,
  media_iv TEXT,
  media_metadata JSONB
);

-- Legg til indekser for bedre ytelse
CREATE INDEX IF NOT EXISTS idx_direct_messages_sender_id ON public.direct_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_receiver_id ON public.direct_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_created_at ON public.direct_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_direct_messages_conversation 
  ON public.direct_messages(
    LEAST(sender_id, receiver_id), 
    GREATEST(sender_id, receiver_id)
  );

-- Legg til Row Level Security (RLS) for sikkerhet
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

-- Policy for å tillate brukere å sette inn sine egne meldinger
CREATE POLICY "Brukere kan sette inn egne meldinger" 
  ON public.direct_messages FOR INSERT 
  TO authenticated 
  WITH CHECK (sender_id = auth.uid());

-- Policy for å tillate brukere å lese meldinger de har sendt eller mottatt
CREATE POLICY "Brukere kan lese meldinger de er involvert i"
  ON public.direct_messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- Policy for å tillate brukere å oppdatere sine egne meldinger
CREATE POLICY "Brukere kan oppdatere egne meldinger"
  ON public.direct_messages FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid());

-- Policy for å tillate brukere å slette sine egne meldinger
CREATE POLICY "Brukere kan slette egne meldinger"
  ON public.direct_messages FOR DELETE
  TO authenticated
  USING (sender_id = auth.uid());

-- Grant tillatelser til authenticated brukere
GRANT ALL ON public.direct_messages TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.direct_messages TO authenticated;

-- Opprett en funksjon for å markere direktemeldinger som lest
CREATE OR REPLACE FUNCTION mark_direct_message_as_read(message_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.direct_messages
  SET is_read = true, read_at = now()
  WHERE id = message_id AND receiver_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Opprett en funksjon for å sjekke om en bruker kan sende melding til en annen
CREATE OR REPLACE FUNCTION can_send_direct_message_to(sender_id UUID, receiver_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Kontroller om mottakeren har blokkert avsenderen
  RETURN NOT EXISTS (
    SELECT 1 
    FROM public.blocked_users 
    WHERE user_id = receiver_id AND blocked_user_id = sender_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Opprett en trigger for å automatisk oppdatere updated_at-feltet
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_direct_messages_timestamp
BEFORE UPDATE ON public.direct_messages
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();