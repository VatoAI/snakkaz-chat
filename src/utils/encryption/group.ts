
import { generateEncryptionKey } from "./key-management";

export const createGroupEncryptionKey = async (groupId: string, userId: string) => {
  try {
    const sessionKey = await generateEncryptionKey();
    
    const { error } = await supabase
      .from('group_encryption')
      .insert({
        group_id: groupId,
        session_key: sessionKey,
        created_by: userId
      });

    if (error) throw error;
    
    return sessionKey;
  } catch (error) {
    console.error('Error creating group encryption key:', error);
    throw error;
  }
};

export const getGroupEncryptionKey = async (groupId: string) => {
  try {
    const { data, error } = await supabase
      .from('group_encryption')
      .select('session_key')
      .eq('group_id', groupId)
      .single();

    if (error) throw error;
    return data?.session_key;
  } catch (error) {
    console.error('Error getting group encryption key:', error);
    throw error;
  }
};
