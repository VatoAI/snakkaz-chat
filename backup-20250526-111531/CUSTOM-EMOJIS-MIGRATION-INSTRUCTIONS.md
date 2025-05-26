# Custom Emojis Migration Instructions

## The Problem
The automated migration script failed because the Supabase instance doesn't have the required RPC functions for automated SQL execution. Additionally, there was a conflict with an existing trigger.

## The Solution
Use the manually optimized `custom-emojis-safe-migration.sql` file that handles all conflicts gracefully.

## Manual Migration Steps

### Step 1: Access Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **"+ New query"**

### Step 2: Apply the Migration
1. Copy the entire contents of `custom-emojis-safe-migration.sql`
2. Paste it into the SQL Editor
3. Click **"Run"** button

### Step 3: Verify Migration Success
After running the migration, you should see:
- ✅ `custom_emojis` table created
- ✅ `custom_emoji_reactions` table created
- ✅ All indexes and triggers configured
- ✅ RLS policies enabled

## Alternative: Step-by-Step Manual Migration

If the complete migration fails, execute these commands one by one in the SQL Editor:

### Step 1: Clean up existing objects
```sql
DROP TRIGGER IF EXISTS update_custom_emojis_timestamp ON public.custom_emojis;
DROP FUNCTION IF EXISTS update_custom_emojis_timestamp();
DROP TRIGGER IF EXISTS custom_emoji_usage_tracker ON public.custom_emoji_reactions;
DROP FUNCTION IF EXISTS increment_custom_emoji_usage();
```

### Step 2: Create tables
```sql
CREATE TABLE IF NOT EXISTS public.custom_emojis (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shortcode TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT DEFAULT 'custom' NOT NULL,
  is_animated BOOLEAN DEFAULT false NOT NULL,
  is_public BOOLEAN DEFAULT false NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  usage INTEGER DEFAULT 0 NOT NULL,
  is_favorite BOOLEAN DEFAULT false NOT NULL,
  file_size INTEGER,
  dimensions JSONB,
  tags TEXT[],
  
  CONSTRAINT valid_shortcode CHECK (shortcode ~ '^[a-z0-9_]+$' AND length(shortcode) >= 2 AND length(shortcode) <= 50),
  CONSTRAINT valid_category CHECK (category IN ('custom', 'reactions', 'memes', 'logos', 'personal', 'animated')),
  CONSTRAINT valid_usage CHECK (usage >= 0)
);

CREATE TABLE IF NOT EXISTS public.custom_emoji_reactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  message_id TEXT NOT NULL,
  emoji_id UUID REFERENCES public.custom_emojis(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  UNIQUE(message_id, emoji_id, user_id)
);
```

### Step 3: Create indexes and enable RLS
```sql
-- Create indexes
CREATE INDEX IF NOT EXISTS idx_custom_emojis_created_by ON public.custom_emojis(created_by);
CREATE INDEX IF NOT EXISTS idx_custom_emojis_shortcode ON public.custom_emojis(shortcode);
CREATE INDEX IF NOT EXISTS idx_custom_emojis_category ON public.custom_emojis(category);
CREATE INDEX IF NOT EXISTS idx_custom_emojis_is_public ON public.custom_emojis(is_public);
CREATE INDEX IF NOT EXISTS idx_custom_emojis_usage ON public.custom_emojis(usage DESC);
CREATE INDEX IF NOT EXISTS idx_custom_emojis_created_at ON public.custom_emojis(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_custom_emojis_tags ON public.custom_emojis USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_custom_emoji_reactions_message_id ON public.custom_emoji_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_custom_emoji_reactions_emoji_id ON public.custom_emoji_reactions(emoji_id);
CREATE INDEX IF NOT EXISTS idx_custom_emoji_reactions_user_id ON public.custom_emoji_reactions(user_id);

-- Enable RLS
ALTER TABLE public.custom_emojis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_emoji_reactions ENABLE ROW LEVEL SECURITY;
```

### Step 4: Create RLS policies
```sql
-- Drop existing policies
DROP POLICY IF EXISTS custom_emojis_select ON public.custom_emojis;
DROP POLICY IF EXISTS custom_emojis_insert ON public.custom_emojis;
DROP POLICY IF EXISTS custom_emojis_update ON public.custom_emojis;
DROP POLICY IF EXISTS custom_emojis_delete ON public.custom_emojis;
DROP POLICY IF EXISTS custom_emoji_reactions_select ON public.custom_emoji_reactions;
DROP POLICY IF EXISTS custom_emoji_reactions_insert ON public.custom_emoji_reactions;
DROP POLICY IF EXISTS custom_emoji_reactions_delete ON public.custom_emoji_reactions;

-- Create new policies
CREATE POLICY custom_emojis_select ON public.custom_emojis
  FOR SELECT USING (is_public = true OR created_by = auth.uid());

CREATE POLICY custom_emojis_insert ON public.custom_emojis
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY custom_emojis_update ON public.custom_emojis
  FOR UPDATE USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

CREATE POLICY custom_emojis_delete ON public.custom_emojis
  FOR DELETE USING (created_by = auth.uid());

CREATE POLICY custom_emoji_reactions_select ON public.custom_emoji_reactions
  FOR SELECT USING (true);

CREATE POLICY custom_emoji_reactions_insert ON public.custom_emoji_reactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY custom_emoji_reactions_delete ON public.custom_emoji_reactions
  FOR DELETE USING (user_id = auth.uid());
```

### Step 5: Create functions and triggers
```sql
CREATE OR REPLACE FUNCTION update_custom_emojis_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_custom_emojis_timestamp
  BEFORE UPDATE ON public.custom_emojis
  FOR EACH ROW EXECUTE PROCEDURE update_custom_emojis_timestamp();

CREATE OR REPLACE FUNCTION increment_custom_emoji_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.custom_emojis 
    SET usage = usage + 1 
    WHERE id = NEW.emoji_id;
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER custom_emoji_usage_tracker
  AFTER INSERT ON public.custom_emoji_reactions
  FOR EACH ROW EXECUTE PROCEDURE increment_custom_emoji_usage();
```

## What This Migration Creates

### Tables
- **`custom_emojis`**: Stores custom emoji definitions
  - Unique shortcodes (e.g., `:happy_cat:`)
  - Public/private visibility settings
  - Usage tracking for popularity
  - Categories and tags for organization
  - File metadata (size, dimensions)

- **`custom_emoji_reactions`**: Tracks custom emoji reactions on messages
  - Links messages to custom emojis
  - Prevents duplicate reactions
  - Automatically increments usage counts

### Security Features
- **Row Level Security (RLS)**: Users can only see public emojis or their own
- **Input Validation**: Shortcode format validation
- **Usage Tracking**: Automatic increment when emojis are used

### Performance Features
- **Indexes**: Optimized for common queries
- **GIN Index**: Fast text search on tags
- **Triggers**: Automatic timestamp updates

## Next Steps After Migration
1. ✅ Test custom emoji upload functionality
2. ✅ Test custom emoji reactions in messages
3. ✅ Verify file upload integration works
4. ✅ Test emoji popularity and favorites features

## Troubleshooting
If you encounter any issues:
1. Check that both tables exist in your Supabase database
2. Verify RLS policies are active
3. Test with a simple emoji upload first
4. Check browser console for any JavaScript errors
