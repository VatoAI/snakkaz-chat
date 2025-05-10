
-- Create direct_messages table for private messaging
CREATE TABLE IF NOT EXISTS public.direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_direct_messages_sender_id ON direct_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_receiver_id ON direct_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_created_at ON direct_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_direct_messages_group_id ON direct_messages(group_id);

-- Row level security
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

-- Users can only read messages they sent or received
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

-- Users can only send messages as themselves
CREATE POLICY "Brukere kan sende meldinger som seg selv"
  ON direct_messages
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Users can only update their own messages
CREATE POLICY "Brukere kan endre egne meldinger"
  ON direct_messages
  FOR UPDATE
  USING (auth.uid() = sender_id);

-- Users can only delete their own messages
CREATE POLICY "Brukere kan slette egne meldinger"
  ON direct_messages
  FOR DELETE
  USING (auth.uid() = sender_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_direct_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update timestamp
CREATE TRIGGER set_direct_messages_updated_at
BEFORE UPDATE ON direct_messages
FOR EACH ROW
EXECUTE FUNCTION update_direct_messages_updated_at();
