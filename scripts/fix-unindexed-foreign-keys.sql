-- Script to create indexes for unindexed foreign keys
-- This will improve query performance for foreign key relationships

-- Create index for friendships.friend_id
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON public.friendships(friend_id);

-- Create index for group_encryption.group_id
CREATE INDEX IF NOT EXISTS idx_group_encryption_group_id ON public.group_encryption(group_id);

-- Create index for group_invites.invited_by
CREATE INDEX IF NOT EXISTS idx_group_invites_invited_by ON public.group_invites(invited_by);

-- Create index for group_invites.invited_user_id
CREATE INDEX IF NOT EXISTS idx_group_invites_invited_user_id ON public.group_invites(invited_user_id);

-- Create index for group_members.group_id
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members(group_id);

-- Create index for groups.creator_id
CREATE INDEX IF NOT EXISTS idx_groups_creator_id ON public.groups(creator_id);

-- Create index for messages.sender_id
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);

-- Clean up unused indexes to improve performance during writes
-- Note: Only drop these if you're sure they're not needed
-- Comment out any that might be useful in the future

-- DROP INDEX IF EXISTS public.idx_messages_read_status;
-- DROP INDEX IF EXISTS public.profiles_id_idx;
-- DROP INDEX IF EXISTS public.profiles_username_idx;
-- DROP INDEX IF EXISTS public.signaling_receiver_id_idx;
-- DROP INDEX IF EXISTS public.signaling_sender_id_idx;
-- DROP INDEX IF EXISTS public.idx_sync_events_type;
-- DROP INDEX IF EXISTS public.idx_user_roles_user_id;
-- DROP INDEX IF EXISTS public.idx_user_roles_role;
-- DROP INDEX IF EXISTS public.idx_messages_group_id;
