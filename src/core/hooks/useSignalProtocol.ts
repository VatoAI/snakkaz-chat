import { useState, useCallback } from 'react';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/hooks/useAuth';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Signal Protocol inspired E2EE implementation for Snakkaz Chat
 * Provides end-to-end encryption functionality for group messages
 */
export const useSignalProtocol = () => {
  const { user } = useAuth();
  const [encryptionReady, setEncryptionReady] = useState(false);
  
  // Initialize encryption for a new device/session
  const initializeEncryption = useCallback(async () => {
    if (!user) return;
    
    try {
      // Check if user already has key materials
      const { data, error } = await supabase
        .from('user_encryption_keys')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      // If no key material exists, generate and store new ones
      if (!data) {
        // In a real implementation, this would generate actual Signal Protocol keys
        // For now we'll use a simplified version
        const keyMaterial = {
          identity_key: CryptoJS.lib.WordArray.random(32).toString(),
          signed_pre_key: CryptoJS.lib.WordArray.random(32).toString(),
          one_time_keys: Array(10).fill(null).map(() => CryptoJS.lib.WordArray.random(32).toString())
        };
        
        // Store keys in database
        await supabase
          .from('user_encryption_keys')
          .insert({
            user_id: user.id,
            identity_key: keyMaterial.identity_key,
            signed_pre_key: keyMaterial.signed_pre_key,
            one_time_keys: keyMaterial.one_time_keys,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }
      
      setEncryptionReady(true);
    } catch (err) {
      console.error('Failed to initialize encryption:', err);
    }
  }, [user]);
  
  // Helper function to derive a shared secret for a specific group and user
  const deriveGroupKey = useCallback(async (groupId: string, userId?: string) => {
    if (!user) return null;
    
    // In a real implementation, this would use actual Signal Protocol key exchange
    // Here we're using a simplified approach with HMAC
    const seed = `${groupId}-${userId || user.id}-snakkaz-secure`;
    return CryptoJS.HmacSHA256(seed, 'snakkaz-group-key').toString();
  }, [user]);
  
  // Encrypt a message for a group (to all recipients)
  const encryptGroupMessage = useCallback(async (
    plaintext: string,
    groupId: string,
    recipientIds: string[]
  ) => {
    if (!user || !encryptionReady) {
      await initializeEncryption();
    }
    
    try {
      // In real Signal Protocol, you would encrypt separately for each recipient
      // using their public keys. Here we're using a simplified approach.
      
      // Generate a random message key
      const messageKey = CryptoJS.lib.WordArray.random(16).toString();
      
      // Encrypt the actual message content with the message key
      const encryptedContent = CryptoJS.AES.encrypt(plaintext, messageKey).toString();
      
      // For each recipient, encrypt the message key with a derived key
      const encryptedKeys: Record<string, string> = {};
      
      for (const recipientId of recipientIds) {
        const sharedKey = await deriveGroupKey(groupId, recipientId);
        if (sharedKey) {
          encryptedKeys[recipientId] = CryptoJS.AES.encrypt(messageKey, sharedKey).toString();
        }
      }
      
      // Also encrypt the message key for the sender (so they can read their own messages)
      const senderKey = await deriveGroupKey(groupId);
      if (senderKey) {
        encryptedKeys[user.id] = CryptoJS.AES.encrypt(messageKey, senderKey).toString();
      }
      
      // Combine everything into a single encrypted package
      const encryptedPackage = {
        v: 1, // Version
        c: encryptedContent,
        k: encryptedKeys,
        s: user.id, // Sender ID
        t: new Date().toISOString(), // Timestamp
        i: uuidv4() // Message ID
      };
      
      return JSON.stringify(encryptedPackage);
    } catch (err) {
      console.error('Error encrypting group message:', err);
      throw new Error('Kunne ikke kryptere meldingen');
    }
  }, [user, encryptionReady, initializeEncryption, deriveGroupKey]);
  
  // Decrypt a message from a group
  const decryptGroupMessage = useCallback(async (
    encryptedMessage: string,
    groupId: string,
    senderId: string
  ) => {
    if (!user) throw new Error('Bruker må være logget inn for å dekryptere');
    
    try {
      // Parse the encrypted package
      const encryptedPackage = JSON.parse(encryptedMessage);
      
      // Make sure we have a supported version
      if (encryptedPackage.v !== 1) {
        throw new Error('Ikke-støttet krypteringsversjon');
      }
      
      // Get the encrypted message key for the current user
      const encryptedMessageKey = encryptedPackage.k[user.id];
      if (!encryptedMessageKey) {
        throw new Error('Meldingen var ikke kryptert for denne brukeren');
      }
      
      // Derive the shared key and decrypt the message key
      const sharedKey = await deriveGroupKey(groupId);
      if (!sharedKey) {
        throw new Error('Kunne ikke generere nøkkel');
      }
      
      const messageKey = CryptoJS.AES.decrypt(encryptedMessageKey, sharedKey).toString(CryptoJS.enc.Utf8);
      
      // Decrypt the actual message content
      const plaintext = CryptoJS.AES.decrypt(encryptedPackage.c, messageKey).toString(CryptoJS.enc.Utf8);
      
      return plaintext;
    } catch (err) {
      console.error('Error decrypting group message:', err);
      throw new Error('Kunne ikke dekryptere meldingen');
    }
  }, [user, deriveGroupKey]);
  
  // Rotate keys periodically for better security
  const rotateKeys = useCallback(async () => {
    if (!user) return;
    
    try {
      // Generate new one-time keys
      const newOneTimeKeys = Array(10).fill(null).map(() => CryptoJS.lib.WordArray.random(32).toString());
      
      // Update in database
      await supabase
        .from('user_encryption_keys')
        .update({
          one_time_keys: newOneTimeKeys,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
    } catch (err) {
      console.error('Failed to rotate keys:', err);
    }
  }, [user]);
  
  return {
    encryptGroupMessage,
    decryptGroupMessage,
    initializeEncryption,
    rotateKeys,
    encryptionReady
  };
};

export default useSignalProtocol;