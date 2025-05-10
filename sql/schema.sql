/* 
 * SnakkaZ Chat Database Schema Script
 *
 * This SQL script sets up the necessary tables and functions for
 * the SnakkaZ secure chat application in Supabase.
 */

-- Enable RLS (Row Level Security)
alter table auth.users enable row level security;

-- Create profiles table for users
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  is_admin boolean default false not null,
  is_premium boolean default false not null,
  last_seen timestamptz,
  status text default 'offline' not null
);

comment on table public.profiles is 'User profiles for SnakkaZ Chat application';

-- Set up RLS for profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (
    true
  );

create policy "Users can insert their own profile"
  on public.profiles for insert with check (
    auth.uid() = id
  );

create policy "Users can update their own profile"
  on public.profiles for update using (
    auth.uid() = id
  );

-- Trigger to create a profile entry when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', 'user' || substr(new.id::text, 1, 8)), new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create a table for user settings
create table public.user_settings (
  user_id uuid references auth.users on delete cascade primary key,
  default_security_level text default 'e2ee' not null,
  store_offline_data boolean default false not null,
  enable_read_receipts boolean default true not null,
  enable_link_previews boolean default true not null,
  enable_typing_indicators boolean default true not null,
  screenshot_notifications boolean default true not null,
  auto_delete_messages boolean default false not null,
  auto_delete_days integer default 30 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.user_settings is 'User settings for the chat application';

-- Set up RLS for user settings
alter table public.user_settings enable row level security;

create policy "Users can view their own settings"
  on public.user_settings for select using (
    auth.uid() = user_id
  );

create policy "Users can insert their own settings"
  on public.user_settings for insert with check (
    auth.uid() = user_id
  );

create policy "Users can update their own settings"
  on public.user_settings for update using (
    auth.uid() = user_id
  );

-- Create a table for groups/conversations
create table public.groups (
  id text primary key,
  name text not null,
  description text,
  avatar_url text,
  creator_id uuid references auth.users on delete set null,
  security_level text default 'enhanced' not null,
  is_private boolean default true not null,
  allow_invites boolean default false not null,
  block_screenshots boolean default false not null,
  message_retention_days integer default 30 not null,
  max_members integer default 50 not null,
  encryption_enabled boolean default true not null,
  current_key_id text,
  key_rotated_at timestamptz default now(),
  key_version integer default 1,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  deleted boolean default false not null
);

comment on table public.groups is 'Groups/conversation channels for the chat application';

-- Set up RLS for groups
alter table public.groups enable row level security;

-- Create a table for group members
create table public.group_members (
  id uuid default uuid_generate_v4() primary key,
  group_id text references public.groups on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  role text default 'member' not null,
  display_name text,
  joined_at timestamptz default now() not null,
  unique(group_id, user_id)
);

comment on table public.group_members is 'Members of chat groups';

-- Set up RLS for group members
alter table public.group_members enable row level security;

-- Create a table for messages
create table public.messages (
  id text primary key,
  group_id text references public.groups on delete cascade not null,
  sender_id uuid references auth.users on delete set null not null,
  content text not null,
  is_encrypted boolean default false not null,
  key_id text,
  media_attachments jsonb,
  reference_message_id text references public.messages on delete set null,
  reference_snippet text,
  read_by uuid[] default array[]::uuid[],
  delivered_to uuid[] default array[]::uuid[],
  reactions jsonb,
  is_edited boolean default false not null,
  is_deleted boolean default false not null,
  expires_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.messages is 'Chat messages';

-- Set up RLS for messages
alter table public.messages enable row level security;

-- Create a table for group invitations
create table public.group_invites (
  id uuid default uuid_generate_v4() primary key,
  group_id text references public.groups on delete cascade not null,
  inviter_id uuid references auth.users on delete cascade not null,
  invitee_id uuid references auth.users on delete cascade not null,
  role text default 'member' not null,
  created_at timestamptz default now() not null,
  accepted_at timestamptz,
  rejected_at timestamptz,
  expires_at timestamptz default now() + interval '7 days' not null,
  unique(group_id, invitee_id)
);

comment on table public.group_invites is 'Invitations to join chat groups';

-- Set up RLS for group invites
alter table public.group_invites enable row level security;

-- Create a table for encryption keys
create table public.encryption_keys (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  key_type text not null, -- 'group', 'message', 'media'
  target_id text not null, -- group_id or message_id
  encrypted_key_data text not null, -- encrypted key data
  algorithm text not null,
  created_at timestamptz default now() not null,
  expires_at timestamptz,
  version integer default 1 not null,
  unique(user_id, key_type, target_id)
);

comment on table public.encryption_keys is 'Encryption keys for E2EE';

-- Set up RLS for encryption keys
alter table public.encryption_keys enable row level security;

create policy "Users can view their own encryption keys"
  on public.encryption_keys for select using (
    auth.uid() = user_id
  );

create policy "Users can insert their own encryption keys"
  on public.encryption_keys for insert with check (
    auth.uid() = user_id
  );

-- Create a table for user presence/status
create table public.user_presence (
  user_id uuid references auth.users on delete cascade primary key,
  status text default 'offline' not null,
  last_seen_at timestamptz default now() not null,
  last_typed_at timestamptz,
  last_typed_group_id text references public.groups on delete set null,
  device_info jsonb
);

comment on table public.user_presence is 'User online presence information';

-- Set up RLS for user presence
alter table public.user_presence enable row level security;

create policy "Everyone can view user presence"
  on public.user_presence for select using (
    true
  );

create policy "Users can update their own presence"
  on public.user_presence for update using (
    auth.uid() = user_id
  );

create policy "Users can insert their own presence"
  on public.user_presence for insert with check (
    auth.uid() = user_id
  );

-- Group security policies

create policy "Group members can view their groups"
  on public.groups for select using (
    exists (
      select 1 from public.group_members
      where group_members.group_id = groups.id
      and group_members.user_id = auth.uid()
    )
    or 
    groups.creator_id = auth.uid()
  );

create policy "Group creators can update their groups"
  on public.groups for update using (
    auth.uid() = creator_id
    or 
    exists (
      select 1 from public.group_members
      where group_members.group_id = groups.id
      and group_members.user_id = auth.uid()
      and group_members.role = 'admin'
    )
  );

-- Group members security policies

create policy "Group members can view members in their groups"
  on public.group_members for select using (
    exists (
      select 1 from public.group_members as gm
      where gm.group_id = group_members.group_id
      and gm.user_id = auth.uid()
    )
  );

create policy "Group admins can manage members"
  on public.group_members for delete using (
    exists (
      select 1 from public.group_members as gm
      where gm.group_id = group_members.group_id
      and gm.user_id = auth.uid()
      and (gm.role = 'admin' or gm.role = 'moderator')
    )
    or group_members.user_id = auth.uid()
  );

-- Messages security policies

create policy "Group members can view messages in their groups"
  on public.messages for select using (
    exists (
      select 1 from public.group_members
      where group_members.group_id = messages.group_id
      and group_members.user_id = auth.uid()
    )
  );

create policy "Users can insert messages in their groups"
  on public.messages for insert with check (
    exists (
      select 1 from public.group_members
      where group_members.group_id = messages.group_id
      and group_members.user_id = auth.uid()
    )
    and
    auth.uid() = sender_id
  );

create policy "Users can update their own messages"
  on public.messages for update using (
    auth.uid() = sender_id
    or
    exists (
      select 1 from public.group_members
      where group_members.group_id = messages.group_id
      and group_members.user_id = auth.uid()
      and (group_members.role = 'admin' or group_members.role = 'moderator')
    )
  );

-- Group invites security policies

create policy "Users can view invites sent to them"
  on public.group_invites for select using (
    auth.uid() = invitee_id
    or
    auth.uid() = inviter_id
    or
    exists (
      select 1 from public.group_members
      where group_members.group_id = group_invites.group_id
      and group_members.user_id = auth.uid()
      and group_members.role in ('admin', 'moderator')
    )
  );

create policy "Group members with invite permissions can send invites"
  on public.group_invites for insert with check (
    auth.uid() = inviter_id
    and
    exists (
      select 1 from public.groups
      join public.group_members on groups.id = group_members.group_id
      where groups.id = group_invites.group_id
      and group_members.user_id = auth.uid()
      and (
        group_members.role in ('admin', 'moderator')
        or 
        (groups.allow_invites = true and group_members.user_id = auth.uid())
      )
    )
  );

-- Function to update timestamps on record changes
create or replace function update_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Create triggers for timestamp updates
create trigger update_profiles_timestamp
  before update on public.profiles
  for each row execute procedure update_timestamp();

create trigger update_groups_timestamp
  before update on public.groups
  for each row execute procedure update_timestamp();

create trigger update_messages_timestamp
  before update on public.messages
  for each row execute procedure update_timestamp();

-- Function to handle message cleanup based on retention policies
create or replace function cleanup_expired_messages()
returns void as $$
begin
  -- Delete messages that are past their expiration date
  delete from public.messages
  where expires_at is not null and expires_at < now();
  
  -- Mark messages as deleted based on group retention policy
  update public.messages
  set is_deleted = true, content = '[Message expired]', media_attachments = null
  where not is_deleted and created_at < (
    select now() - (message_retention_days * interval '1 day')
    from public.groups
    where groups.id = messages.group_id
    and message_retention_days > 0
  );
end;
$$ language plpgsql security definer;

-- Create a scheduled job to run the cleanup function daily
-- (This would typically be done through a cron job or a Supabase edge function)
