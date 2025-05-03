
import { useState, useEffect, useCallback } from 'react';
import { Group } from '@/types/group';
import { supabase } from '@/integrations/supabase/client';
import { generateEncryptionKey, encryptWithKey, decryptWithKey } from '@/utils/encryption';
import { DecryptedMessage } from '@/types/message';

export const useGroupEncryption = (group: Group, currentUserId: string, messages: DecryptedMessage[] = []) => {
  const [groupKey, setGroupKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(false);
  const [encryptionStatus, setEncryptionStatus] = useState<'idle' | 'encrypting' | 'decrypting'>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  
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
        setIsEncryptionEnabled(true);
      } else {
        // If no key exists, and the current user is the creator, prepare for key generation
        const isCreator = (group.createdBy || group.creator_id) === currentUserId;
        if (!isCreator) {
          setError("No encryption key found and user is not the creator.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch group key.");
    } finally {
      setLoading(false);
    }
  }, [group.id, currentUserId, group.createdBy, group.creator_id]);
  
  useEffect(() => {
    if (group?.id) {
      fetchGroupKey();
    }
  }, [group, fetchGroupKey]);

  // Enable encryption for the group
  const enableEncryption = useCallback(async () => {
    setIsProcessing(true);
    try {
      const newKey = generateEncryptionKey();
      
      const { error: insertError } = await supabase
        .from('group_encryption')
        .insert([{ 
          group_id: group.id, 
          created_by: currentUserId, 
          session_key: newKey 
        }]);
      
      if (insertError) {
        throw new Error(`Error creating group key: ${insertError.message}`);
      }
      
      setGroupKey(newKey);
      setIsEncryptionEnabled(true);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to enable encryption.");
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [group.id, currentUserId]);
  
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
  
  // Bulk encrypt all group messages
  const encryptGroupMessages = useCallback(async () => {
    if (!isEncryptionEnabled || !groupKey) {
      throw new Error("Encryption is not enabled or key is not available.");
    }
    
    setEncryptionStatus('encrypting');
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would process messages and store encrypted versions
      // This is a placeholder implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEncryptionStatus('idle');
      return true;
    } catch (err) {
      console.error("Error encrypting messages:", err);
      setError("Failed to encrypt messages");
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [groupKey, isEncryptionEnabled]);
  
  // Bulk decrypt all group messages
  const decryptGroupMessages = useCallback(async () => {
    if (!isEncryptionEnabled || !groupKey) {
      throw new Error("Encryption is not enabled or key is not available.");
    }
    
    setEncryptionStatus('decrypting');
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would process messages and return decrypted versions
      // This is a placeholder implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEncryptionStatus('idle');
      return true;
    } catch (err) {
      console.error("Error decrypting messages:", err);
      setError("Failed to decrypt messages");
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [groupKey, isEncryptionEnabled]);
  
  return {
    groupKey,
    loading,
    error,
    isEncryptionEnabled,
    encryptionStatus,
    isProcessing,
    enableEncryption,
    encryptGroupMessage,
    decryptGroupMessage,
    encryptGroupMessages,
    decryptGroupMessages
  };
};

export default useGroupEncryption;
