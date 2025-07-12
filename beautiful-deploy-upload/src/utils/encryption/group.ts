
/**
 * Group-specific encryption functions
 */

import { supabase } from '@/integrations/supabase/client';
import { generateMessageEncryptionKey } from './message-encryption';

// Create a new encryption key for a group
export const createGroupEncryptionKey = async (
  groupId: string,
  userId: string
): Promise<string> => {
  try {
    const key = generateMessageEncryptionKey();
    
    // Store the key in the database, associated with the group
    const { error } = await supabase
      .from('group_encryption')
      .insert({
        group_id: groupId,
        created_by: userId,
        session_key: key
      });
    
    if (error) throw error;
    
    return key;
  } catch (error) {
    console.error('Error creating group encryption key:', error);
    throw new Error('Failed to create group encryption key');
  }
};

// Retrieve an existing encryption key for a group
export const getGroupEncryptionKey = async (groupId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('group_encryption')
      .select('session_key')
      .eq('group_id', groupId)
      .single();
    
    if (error) throw error;
    if (!data || !data.session_key) {
      throw new Error('No encryption key found for this group');
    }
    
    return data.session_key;
  } catch (error) {
    console.error('Error retrieving group encryption key:', error);
    throw new Error('Failed to retrieve group encryption key');
  }
};
