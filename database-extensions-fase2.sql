-- ===== FASE 2: GRUPPE & INVITE SYSTEM - DATABASE EXTENSIONS =====
-- Utvidelser til eksisterende Supabase schema for gruppe-funksjonalitet

-- ===== GROUP CHATS =====
CREATE TABLE IF NOT EXISTS public.group_chats (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    avatar_url TEXT,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    is_private BOOLEAN DEFAULT true,
    security_level TEXT DEFAULT 'standard' CHECK (security_level IN ('standard', 'enhanced', 'premium')),
    allow_media_sharing BOOLEAN DEFAULT true,
    allow_link_previews BOOLEAN DEFAULT true,
    allow_member_invites BOOLEAN DEFAULT false,
    max_members INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Validering
    CONSTRAINT group_name_length CHECK (char_length(trim(name)) > 0 AND char_length(name) <= 50),
    CONSTRAINT group_description_length CHECK (char_length(description) <= 500)
);

COMMENT ON TABLE public.group_chats IS 'Group chat rooms for SnakkaZ';

-- ===== GROUP MEMBERS =====
CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.group_chats(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    display_name TEXT,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    is_muted BOOLEAN DEFAULT false,
    
    -- Unikt medlemskap
    UNIQUE(group_id, user_id)
);

COMMENT ON TABLE public.group_members IS 'Group membership with roles and permissions';

-- ===== GROUP MESSAGES =====
CREATE TABLE IF NOT EXISTS public.group_messages (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.group_chats(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'system', 'invite')),
    reply_to UUID REFERENCES public.group_messages(id) ON DELETE SET NULL,
    is_edited BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    pinned BOOLEAN DEFAULT false,
    pinned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    pinned_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    edited_at TIMESTAMP WITH TIME ZONE,
    
    -- Content validering
    CONSTRAINT content_not_empty CHECK (
        CASE 
            WHEN message_type = 'text' THEN char_length(trim(content)) > 0 
            ELSE true 
        END
    ),
    CONSTRAINT content_length CHECK (char_length(content) <= 4000)
);

COMMENT ON TABLE public.group_messages IS 'Messages within group chats';

-- ===== GROUP INVITES =====
CREATE TABLE IF NOT EXISTS public.group_invites (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.group_chats(id) ON DELETE CASCADE NOT NULL,
    invited_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    invited_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    invite_code TEXT UNIQUE,
    email TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    max_uses INTEGER DEFAULT 1,
    used_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    
    -- Enten user_id eller email må være satt
    CONSTRAINT invite_target_check CHECK (
        (invited_user_id IS NOT NULL) OR (email IS NOT NULL)
    ),
    -- Used count kan ikke overstige max uses
    CONSTRAINT used_count_valid CHECK (used_count <= max_uses)
);

COMMENT ON TABLE public.group_invites IS 'Group invitation system';

-- ===== INDEXES FOR PERFORMANCE =====

-- Group chats indexes
CREATE INDEX IF NOT EXISTS group_chats_creator_idx ON public.group_chats(creator_id);
CREATE INDEX IF NOT EXISTS group_chats_private_idx ON public.group_chats(is_private);
CREATE INDEX IF NOT EXISTS group_chats_name_idx ON public.group_chats(name);

-- Group members indexes
CREATE INDEX IF NOT EXISTS group_members_group_idx ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS group_members_user_idx ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS group_members_role_idx ON public.group_members(role);

-- Group messages indexes
CREATE INDEX IF NOT EXISTS group_messages_group_created_idx ON public.group_messages(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS group_messages_sender_idx ON public.group_messages(sender_id);
CREATE INDEX IF NOT EXISTS group_messages_pinned_idx ON public.group_messages(pinned) WHERE pinned = true;

-- Group invites indexes
CREATE INDEX IF NOT EXISTS group_invites_group_idx ON public.group_invites(group_id);
CREATE INDEX IF NOT EXISTS group_invites_user_idx ON public.group_invites(invited_user_id);
CREATE INDEX IF NOT EXISTS group_invites_code_idx ON public.group_invites(invite_code);
CREATE INDEX IF NOT EXISTS group_invites_status_idx ON public.group_invites(status);
CREATE INDEX IF NOT EXISTS group_invites_email_idx ON public.group_invites(email);

-- ===== ROW LEVEL SECURITY (RLS) =====

-- Enable RLS on all new tables
ALTER TABLE public.group_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_invites ENABLE ROW LEVEL SECURITY;

-- Group chats policies
CREATE POLICY "Users can view public groups or groups they're members of" ON public.group_chats
    FOR SELECT USING (
        NOT is_private OR 
        id IN (
            SELECT group_id FROM public.group_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create groups" ON public.group_chats
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND creator_id = auth.uid());

CREATE POLICY "Group creators and admins can update groups" ON public.group_chats
    FOR UPDATE USING (
        creator_id = auth.uid() OR 
        id IN (
            SELECT group_id FROM public.group_members 
            WHERE user_id = auth.uid() AND role IN ('admin')
        )
    );

-- Group members policies
CREATE POLICY "Users can view members of groups they're in" ON public.group_members
    FOR SELECT USING (
        group_id IN (
            SELECT group_id FROM public.group_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can join groups via invites" ON public.group_members
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage group members" ON public.group_members
    FOR UPDATE USING (
        group_id IN (
            SELECT group_id FROM public.group_members 
            WHERE user_id = auth.uid() AND role IN ('admin')
        )
    );

-- Group messages policies
CREATE POLICY "Users can view messages in groups they're members of" ON public.group_messages
    FOR SELECT USING (
        group_id IN (
            SELECT group_id FROM public.group_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Group members can send messages" ON public.group_messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        group_id IN (
            SELECT group_id FROM public.group_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own messages" ON public.group_messages
    FOR UPDATE USING (sender_id = auth.uid());

-- Group invites policies
CREATE POLICY "Users can view invites sent to them" ON public.group_invites
    FOR SELECT USING (
        invited_user_id = auth.uid() OR 
        invited_by = auth.uid() OR
        (invite_code IS NOT NULL AND status = 'pending')
    );

CREATE POLICY "Group members can create invites if allowed" ON public.group_invites
    FOR INSERT WITH CHECK (
        invited_by = auth.uid() AND
        group_id IN (
            SELECT gm.group_id FROM public.group_members gm
            JOIN public.group_chats gc ON gm.group_id = gc.id
            WHERE gm.user_id = auth.uid() 
            AND (gc.allow_member_invites = true OR gm.role IN ('admin'))
        )
    );

-- ===== REALTIME PUBLICATION =====

-- Add new tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_chats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_invites;

-- ===== FUNCTIONS =====

-- Function to generate group invite code
CREATE OR REPLACE FUNCTION public.generate_group_invite_code()
RETURNS TEXT AS $$
BEGIN
    RETURN 'grp_' || substr(gen_random_uuid()::text, 1, 12);
END;
$$ LANGUAGE plpgsql;

-- Function to create group with creator as admin
CREATE OR REPLACE FUNCTION public.create_group_with_admin(
    group_name TEXT,
    group_description TEXT DEFAULT NULL,
    is_private BOOLEAN DEFAULT true
)
RETURNS UUID AS $$
DECLARE
    new_group_id UUID;
BEGIN
    -- Create the group
    INSERT INTO public.group_chats (name, description, creator_id, is_private)
    VALUES (group_name, group_description, auth.uid(), is_private)
    RETURNING id INTO new_group_id;
    
    -- Add creator as admin
    INSERT INTO public.group_members (group_id, user_id, role)
    VALUES (new_group_id, auth.uid(), 'admin');
    
    RETURN new_group_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to accept group invite
CREATE OR REPLACE FUNCTION public.accept_group_invite(invite_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    invite_record RECORD;
BEGIN
    -- Get invite details
    SELECT * INTO invite_record
    FROM public.group_invites
    WHERE id = invite_id
    AND status = 'pending'
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (invited_user_id = auth.uid() OR invited_user_id IS NULL);
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Check if user is already a member
    IF EXISTS (
        SELECT 1 FROM public.group_members 
        WHERE group_id = invite_record.group_id 
        AND user_id = auth.uid()
    ) THEN
        RETURN false;
    END IF;
    
    -- Add user to group
    INSERT INTO public.group_members (group_id, user_id, role)
    VALUES (invite_record.group_id, auth.uid(), 'member');
    
    -- Update invite status
    UPDATE public.group_invites
    SET status = 'accepted', used_at = NOW(), used_count = used_count + 1
    WHERE id = invite_id;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== SAMPLE DATA =====

-- Create a sample public group
DO $$
DECLARE
    sample_group_id UUID;
BEGIN
    -- Only create if no groups exist
    IF NOT EXISTS (SELECT 1 FROM public.group_chats LIMIT 1) THEN
        INSERT INTO public.group_chats (id, name, description, is_private, creator_id)
        VALUES (
            gen_random_uuid(),
            'SnakkaZ Beta Testing',
            'Hovedgruppe for testing av SnakkaZ Beta funksjoner',
            false,
            NULL
        ) RETURNING id INTO sample_group_id;
        
        RAISE NOTICE 'Sample group created with ID: %', sample_group_id;
    END IF;
END $$;

-- ===== SUCCESS MESSAGE =====
DO $$
BEGIN
    RAISE NOTICE '🚀 FASE 2: Gruppe & Invite System Database Extensions created successfully!';
    RAISE NOTICE '✅ New Tables: group_chats, group_members, group_messages, group_invites';
    RAISE NOTICE '✅ RLS Policies: Secure access controls for group functionality';
    RAISE NOTICE '✅ Realtime: Enabled for all group tables';
    RAISE NOTICE '✅ Functions: Group creation, invite management';
    RAISE NOTICE '✅ Sample Data: Beta testing group created';
    RAISE NOTICE '🎯 Ready for Phase 2 Frontend Integration!';
END $$;
