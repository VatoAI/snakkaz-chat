import { CustomEmoji } from '@/hooks/useCustomEmojis';
import { supabase } from '@/integrations/supabase/client';

/**
 * Interface for emoji pack metadata
 */
export interface EmojiPack {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  version: string;
  cover_url: string;
  emoji_count: number;
  is_animated: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for emoji within a pack
 */
export interface PackEmoji {
  id: string;
  pack_id: string;
  shortcode: string;
  name: string;
  url: string;
  is_animated: boolean;
}

/**
 * Get list of available emoji packs
 * 
 * @param includePrivate - Whether to include private packs (default: false)
 * @returns Promise with array of emoji packs
 */
export const getEmojiPacks = async (includePrivate = false): Promise<EmojiPack[]> => {
  try {
    let query = supabase
      .from('emoji_packs')
      .select('*')
      .order('name');
    
    if (!includePrivate) {
      query = query.eq('is_public', true);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching emoji packs:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Failed to get emoji packs:', err);
    return [];
  }
};

/**
 * Get details for a specific emoji pack
 * 
 * @param packId - ID of the pack to fetch
 * @returns Promise with emoji pack details or null if not found
 */
export const getEmojiPackDetails = async (packId: string): Promise<EmojiPack | null> => {
  try {
    const { data, error } = await supabase
      .from('emoji_packs')
      .select('*')
      .eq('id', packId)
      .single();
    
    if (error || !data) {
      console.error('Error fetching emoji pack details:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Failed to get emoji pack details:', err);
    return null;
  }
};

/**
 * Get all emojis in a specific pack
 * 
 * @param packId - ID of the pack to fetch emojis from
 * @returns Promise with array of pack emojis
 */
export const getPackEmojis = async (packId: string): Promise<PackEmoji[]> => {
  try {
    const { data, error } = await supabase
      .from('pack_emojis')
      .select('*')
      .eq('pack_id', packId)
      .order('name');
    
    if (error) {
      console.error('Error fetching pack emojis:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Failed to get pack emojis:', err);
    return [];
  }
};

/**
 * Create a new emoji pack
 * 
 * @param packData - Object containing pack metadata
 * @returns Promise with created pack ID or null if failed
 */
export const createEmojiPack = async (
  packData: Omit<EmojiPack, 'id' | 'created_at' | 'updated_at' | 'emoji_count'>
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('emoji_packs')
      .insert({
        ...packData,
        emoji_count: 0,
      })
      .select('id')
      .single();
    
    if (error || !data) {
      console.error('Error creating emoji pack:', error);
      return null;
    }
    
    return data.id;
  } catch (err) {
    console.error('Failed to create emoji pack:', err);
    return null;
  }
};

/**
 * Add an emoji to a pack
 * 
 * @param packId - ID of the pack to add emoji to
 * @param emoji - Object containing emoji data
 * @returns Promise with boolean indicating success
 */
export const addEmojiToPack = async (
  packId: string,
  emoji: Omit<PackEmoji, 'id' | 'pack_id'>
): Promise<boolean> => {
  try {
    // Add emoji to pack_emojis table
    const { error: insertError } = await supabase
      .from('pack_emojis')
      .insert({
        pack_id: packId,
        ...emoji,
      });
    
    if (insertError) {
      console.error('Error adding emoji to pack:', insertError);
      return false;
    }
    
    // Update emoji count in packs table
    const { error: updateError } = await supabase
      .rpc('increment_emoji_pack_count', { pack_id: packId });
    
    if (updateError) {
      console.error('Error updating emoji count:', updateError);
    }
    
    return true;
  } catch (err) {
    console.error('Failed to add emoji to pack:', err);
    return false;
  }
};

/**
 * Install all emojis from a pack to user's custom emojis
 * 
 * @param packId - ID of the pack to install
 * @param userId - ID of the user installing the pack
 * @returns Promise with array of installed emoji IDs
 */
export const installEmojiPack = async (
  packId: string,
  userId: string
): Promise<string[]> => {
  try {
    // Get pack details first
    const packDetails = await getEmojiPackDetails(packId);
    if (!packDetails) {
      throw new Error('Pack not found');
    }
    
    // Get all emojis in the pack
    const packEmojis = await getPackEmojis(packId);
    if (!packEmojis.length) {
      throw new Error('Pack is empty');
    }
    
    // Convert pack emojis to custom emojis format
    const customEmojis = packEmojis.map(emoji => ({
      shortcode: emoji.shortcode,
      name: emoji.name,
      url: emoji.url,
      category: packDetails.name, // Use pack name as category
      isAnimated: emoji.is_animated,
      isPublic: true, // User installed emojis are public by default
      createdBy: userId,
    }));
    
    // Insert all emojis as a batch
    const { data, error } = await supabase
      .from('custom_emojis')
      .insert(customEmojis)
      .select('id');
    
    if (error) {
      console.error('Error installing emoji pack:', error);
      return [];
    }
    
    return data?.map(item => item.id) || [];
  } catch (err) {
    console.error('Failed to install emoji pack:', err);
    return [];
  }
};

/**
 * Create a new emoji pack from a user's custom emojis
 * 
 * @param packData - Object containing pack metadata
 * @param emojiIds - Array of custom emoji IDs to include in the pack
 * @param userId - ID of the user creating the pack
 * @returns Promise with created pack ID or null if failed
 */
export const createPackFromCustomEmojis = async (
  packData: Omit<EmojiPack, 'id' | 'created_at' | 'updated_at' | 'emoji_count'>,
  emojiIds: string[],
  userId: string
): Promise<string | null> => {
  try {
    // Create the pack first
    const packId = await createEmojiPack(packData);
    if (!packId) {
      throw new Error('Failed to create emoji pack');
    }
    
    // Get all the custom emojis
    const { data: customEmojis, error: fetchError } = await supabase
      .from('custom_emojis')
      .select('*')
      .in('id', emojiIds)
      .eq('created_by', userId); // Ensure user only exports their own emojis
    
    if (fetchError || !customEmojis) {
      console.error('Error fetching custom emojis:', fetchError);
      return null;
    }
    
    // Add each emoji to the pack
    for (const emoji of customEmojis) {
      await addEmojiToPack(packId, {
        shortcode: emoji.shortcode,
        name: emoji.name,
        url: emoji.url,
        is_animated: emoji.is_animated,
      });
    }
    
    return packId;
  } catch (err) {
    console.error('Failed to create pack from custom emojis:', err);
    return null;
  }
};

/**
 * Get the SQL migration script for emoji packs
 * 
 * @returns SQL script as a string
 */
export const getEmojiPackMigrationSQL = (): string => {
  return `
-- Create emoji packs table
CREATE TABLE IF NOT EXISTS emoji_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  author TEXT,
  version TEXT,
  cover_url TEXT,
  emoji_count INTEGER DEFAULT 0,
  is_animated BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create pack emojis table
CREATE TABLE IF NOT EXISTS pack_emojis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pack_id UUID NOT NULL REFERENCES emoji_packs(id) ON DELETE CASCADE,
  shortcode TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  is_animated BOOLEAN DEFAULT false
);

-- Add indexes
CREATE INDEX idx_pack_emojis_pack_id ON pack_emojis(pack_id);
CREATE INDEX idx_emoji_packs_name ON emoji_packs(name);
CREATE INDEX idx_emoji_packs_category ON emoji_packs(category);

-- Function to increment emoji count in pack
CREATE OR REPLACE FUNCTION increment_emoji_pack_count(pack_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE emoji_packs 
  SET 
    emoji_count = emoji_count + 1,
    updated_at = NOW()
  WHERE id = pack_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement emoji count in pack
CREATE OR REPLACE FUNCTION decrement_emoji_pack_count(pack_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE emoji_packs 
  SET 
    emoji_count = GREATEST(0, emoji_count - 1),
    updated_at = NOW()
  WHERE id = pack_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to decrement count when emoji is deleted
CREATE OR REPLACE FUNCTION decrement_emoji_count_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM decrement_emoji_pack_count(OLD.pack_id);
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER decrement_emoji_count_trigger
AFTER DELETE ON pack_emojis
FOR EACH ROW
EXECUTE FUNCTION decrement_emoji_count_on_delete();

-- Row-level security policies
ALTER TABLE emoji_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_emojis ENABLE ROW LEVEL SECURITY;

-- Public packs are readable by all authenticated users
CREATE POLICY emoji_packs_public_select
  ON emoji_packs FOR SELECT
  USING (is_public = true);

-- Users can see their own private packs
CREATE POLICY emoji_packs_private_select
  ON emoji_packs FOR SELECT
  USING (author = auth.uid() OR is_public = true);

-- Only authors can modify/delete packs
CREATE POLICY emoji_packs_insert
  ON emoji_packs FOR INSERT
  WITH CHECK (auth.uid() = author);

CREATE POLICY emoji_packs_update
  ON emoji_packs FOR UPDATE
  USING (auth.uid() = author);

CREATE POLICY emoji_packs_delete
  ON emoji_packs FOR DELETE
  USING (auth.uid() = author);

-- Pack emoji policies
CREATE POLICY pack_emojis_select
  ON pack_emojis FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM emoji_packs
    WHERE emoji_packs.id = pack_emojis.pack_id
    AND (emoji_packs.is_public OR emoji_packs.author = auth.uid())
  ));

-- Only pack authors can modify pack emojis
CREATE POLICY pack_emojis_insert
  ON pack_emojis FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM emoji_packs
    WHERE emoji_packs.id = pack_emojis.pack_id
    AND emoji_packs.author = auth.uid()
  ));

CREATE POLICY pack_emojis_delete
  ON pack_emojis FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM emoji_packs
    WHERE emoji_packs.id = pack_emojis.pack_id
    AND emoji_packs.author = auth.uid()
  ));

-- Permissions
GRANT SELECT ON emoji_packs TO authenticated;
GRANT INSERT, UPDATE, DELETE ON emoji_packs TO authenticated;
GRANT SELECT ON pack_emojis TO authenticated;
GRANT INSERT, DELETE ON pack_emojis TO authenticated;
GRANT USAGE ON SEQUENCE emoji_packs_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE pack_emojis_id_seq TO authenticated;
  `;
};
