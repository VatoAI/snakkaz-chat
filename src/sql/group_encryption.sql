-- Tabell for å lagre gruppespesifikke krypteringsnøkler
CREATE TABLE IF NOT EXISTS public.group_encryption (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  encryption_key TEXT NOT NULL,
  iv TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Hver gruppe skal kun ha én krypteringsnøkkel
  CONSTRAINT unique_group_key UNIQUE (group_id)
);

-- Tilgangskontroll: Kun autentiserte brukere kan lese gruppekrypteringsnøkler
ALTER TABLE public.group_encryption ENABLE ROW LEVEL SECURITY;

-- Policy: Brukere kan kun se krypteringsnøkler for grupper de er medlemmer av
CREATE POLICY "Group members can view encryption keys" ON public.group_encryption
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_members.group_id = group_encryption.group_id
      AND group_members.user_id = auth.uid()
    )
  );

-- Policy: Kun gruppeadministratorer kan opprette/oppdatere krypteringsnøkler
CREATE POLICY "Group admins can insert and update encryption keys" ON public.group_encryption
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_members.group_id = group_encryption.group_id
      AND group_members.user_id = auth.uid()
      AND group_members.role = 'admin'
    )
  );

-- Oppdater triggers for å opprette oppføringer automatisk når nye grupper opprettes
CREATE OR REPLACE FUNCTION create_group_encryption_entry()
RETURNS TRIGGER AS $$
BEGIN
    -- Vi oppretter ikke krypteringsnøkkelen her, den vil genereres ved første forespørsel
    -- Men vi oppretter en tom oppføring som kan oppdateres senere
    INSERT INTO public.group_encryption (group_id, encryption_key, iv)
    VALUES (NEW.id, '{}', '');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Opprett trigger som kjører når ny gruppe opprettes
DROP TRIGGER IF EXISTS on_group_created ON public.groups;
CREATE TRIGGER on_group_created
    AFTER INSERT ON public.groups
    FOR EACH ROW
    EXECUTE FUNCTION create_group_encryption_entry();

-- Indeks for raskere oppslag
CREATE INDEX IF NOT EXISTS idx_group_encryption_group_id ON public.group_encryption(group_id);