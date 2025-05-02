import { useState, useEffect, useCallback } from 'react';
import { Group } from '@/types/group';
import { supabase } from '@/integrations/supabase/client';
import { generateEncryptionKey, encryptWithKey, decryptWithKey } from '@/utils/encryption';

export const useGroupEncryption = (group: Group, currentUserId: string) => {
  const [groupKey, setGroupKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchGroupKey = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch the group encryption key from the database
      const { data, error } = await supabase
        .from('group_encryption')
        .select('session_key')
        .eq('group_id', group.id)
        .single();
      
      if (error) {
        throw new Error(`Error fetching group key: ${error.message}`);
      }
      
      if (data) {
        setGroupKey(data.session_key);
      } else {
        // If no key exists, and the current user is the creator, generate and store a new key
        const isCreator = (group.createdBy || group.creator_id) === currentUserId;
        if (isCreator) {
          const newKey = generateEncryptionKey();
          const { error: insertError } = await supabase
            .from('group_encryption')
            .insert([{ group_id: group.id, created_by: currentUserId, session_key: newKey }]);
          
          if (insertError) {
            throw new Error(`Error creating group key: ${insertError.message}`);
          }
          
          setGroupKey(newKey);
        } else {
          setError("No encryption key found and user is not the creator.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch or create group key.");
    } finally {
      setLoading(false);
    }
  }, [group.id, currentUserId, group.createdBy, group.creator_id]);
  
  useEffect(() => {
    if (group?.id) {
      fetchGroupKey();
    }
  }, [group, fetchGroupKey]);

  const isCreator = (group.createdBy || group.creator_id) === currentUserId;
  const isMember = group.members.some(member => (member.userId || member.user_id) === currentUserId);
  
  const encryptGroupMessage = useCallback(async (message: string) => {
    if (!groupKey) {
      throw new Error("Encryption key is not available.");
    }
    
    const { encryptedContent, iv } = await encryptWithKey(message, groupKey);
    return { encryptedContent, encryptionKey: groupKey, iv };
  }, [groupKey]);
  
  const decryptGroupMessage = useCallback(async (encryptedContent: string, key: string, iv: string) => {
    try {
      return await decryptWithKey(encryptedContent, key, iv);
    } catch (err) {
      console.error("Decryption error:", err);
      throw new Error("Failed to decrypt message.");
    }
  }, []);
  
  return {
    groupKey,
    loading,
    error,
    encryptGroupMessage,
    decryptGroupMessage
  };
};

export default useGroupEncryption;
