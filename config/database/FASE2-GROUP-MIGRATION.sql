/**
 * Database Migration for FASE 2
 * Update group tables to support administration features
 */

------------------
-- FASE 2: Group Administration Database Improvements
------------------

-- 1. Update group_settings table
ALTER TABLE group_settings ADD COLUMN IF NOT EXISTS allow_member_invites BOOLEAN DEFAULT FALSE;
ALTER TABLE group_settings ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT TRUE;
ALTER TABLE group_settings ADD COLUMN IF NOT EXISTS allow_link_previews BOOLEAN DEFAULT TRUE;
ALTER TABLE group_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE group_settings ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

-- 2. Ensure group_members table has role column
ALTER TABLE group_members ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member'::TEXT;

-- 3. Create group invites table if it doesn't exist
CREATE TABLE IF NOT EXISTS group_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES group_chats(id) ON DELETE CASCADE,
  invited_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, invited_user_id, status)
);

-- 4. Add RLS policies for group_invites
ALTER TABLE group_invites ENABLE ROW LEVEL SECURITY;

-- Policy for viewing invites (user is invited, or is admin/moderator of the group)
CREATE POLICY group_invites_select ON group_invites 
  FOR SELECT USING (
    invited_user_id = auth.uid() OR 
    invited_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_members.group_id = group_invites.group_id 
      AND group_members.user_id = auth.uid() 
      AND group_members.role IN ('admin', 'moderator')
    )
  );

-- Policy for inserting invites (user is admin/moderator/member with invite permission)
CREATE POLICY group_invites_insert ON group_invites 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_members AS gm
      JOIN group_settings AS gs ON gm.group_id = gs.group_id
      WHERE gm.group_id = group_invites.group_id 
      AND gm.user_id = auth.uid() 
      AND (
        gm.role IN ('admin', 'moderator') OR 
        (gm.role = 'member' AND gs.allow_member_invites = TRUE)
      )
    )
  );

-- Policy for deleting invites (user is admin/moderator or the inviter)
CREATE POLICY group_invites_delete ON group_invites 
  FOR DELETE USING (
    invited_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_members.group_id = group_invites.group_id 
      AND group_members.user_id = auth.uid() 
      AND group_members.role IN ('admin', 'moderator')
    )
  );

-- 5. Create or update functions for group administration
CREATE OR REPLACE FUNCTION accept_group_invite(p_invite_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Get the invite details
  DECLARE
    v_group_id UUID;
    v_user_id UUID;
  BEGIN
    SELECT group_id, invited_user_id INTO v_group_id, v_user_id
    FROM group_invites
    WHERE id = p_invite_id AND status = 'pending' AND invited_user_id = auth.uid();
    
    IF v_group_id IS NULL OR v_user_id IS NULL THEN
      RAISE EXCEPTION 'Invite not found or not valid for current user';
    END IF;
    
    -- Add user to group
    INSERT INTO group_members (group_id, user_id, role, joined_at)
    VALUES (v_group_id, v_user_id, 'member', NOW())
    ON CONFLICT (group_id, user_id) DO NOTHING;
    
    -- Update invite status
    UPDATE group_invites
    SET status = 'accepted', updated_at = NOW()
    WHERE id = p_invite_id;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to all authenticated users
GRANT EXECUTE ON FUNCTION accept_group_invite TO authenticated;

-- 6. Add function to reject group invite
CREATE OR REPLACE FUNCTION reject_group_invite(p_invite_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE group_invites
  SET status = 'rejected', updated_at = NOW()
  WHERE id = p_invite_id AND invited_user_id = auth.uid() AND status = 'pending';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invite not found or not valid for current user';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to all authenticated users
GRANT EXECUTE ON FUNCTION reject_group_invite TO authenticated;
