// Using singleton Supabase client to prevent "Multiple GoTrueClient instances" warning
import { supabase } from '@/lib/supabaseClient';
// Using singleton Supabase client to prevent "Multiple GoTrueClient instances" warning
import { supabase } from '@/lib/supabaseClient';
// useEncryption.ts - Hook for å håndtere kryptering i Snakkaz
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import * as Encryption from '../lib/encryption';
import { createClient } from '@supabase/supabase-js';

// Supabase-konfigurasjon
// Bruker miljøvariabler med fallback til standardverdier
import { ENV } from '@/utils/env/environmentFix';
const supabaseUrl = ENV.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = ENV.SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Type-definisjoner
interface UserKeys {
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
}

interface KeysState {
  myKeys: UserKeys | null;
  userPublicKeys: Record<string, JsonWebKey>;
  groupKeys: Record<string, CryptoKey>;
  isGeneratingKeys: boolean;
  isLoadingKeys: boolean;
  error: string | null;
}

interface RawStoredKeys {
  user_id: string;
  public_key: string; // JSON.stringify av JsonWebKey
  encrypted_private_key: string; // Kryptert JsonWebKey
  created_at: string;
}

// Hook for å håndtere kryptering
export function useEncryption() {
  const { user } = useAuth();
  // REPLACED: // REPLACED: const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // State for krypteringsnøkler
  const [keysState, setKeysState] = useState<KeysState>({
    myKeys: null,
    userPublicKeys: {},
    groupKeys: {},
    isGeneratingKeys: false,
    isLoadingKeys: false,
    error: null
  });

  // Hent og set up brukerens krypteringsnøkler
  const initializeUserKeys = useCallback(async () => {
    if (!user) return;
    
    try {
      setKeysState(prev => ({ ...prev, isLoadingKeys: true, error: null }));
      
      // Sjekk om brukeren allerede har nøkler i databasen
      const { data: existingKeys, error: fetchError } = await supabase
        .from('encryption_keys')
        .select('*')
        .eq('user_id', user.uid)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw new Error(`Feil ved henting av nøkler: ${fetchError.message}`);
      }
      
      let userKeys: UserKeys;
      
      if (!existingKeys) {
        // Generer nye nøkler hvis brukeren ikke har noen
        setKeysState(prev => ({ ...prev, isGeneratingKeys: true }));
        userKeys = await Encryption.generateUserKeys();
        
        // Generer en lagringsnøkkel basert på brukerens UID
        const storageKey = await Encryption.generateEncryptionKeyForStorage(
          user.uid,
          'snakkaz-salt' // I produksjon: bruk en unik salt for hver bruker
        );
        
        // Krypter den private nøkkelen før lagring
        const encryptedPrivateKey = await Encryption.encryptKeysForStorage(
          { publicKey: userKeys.publicKey, privateKey: userKeys.privateKey },
          storageKey
        );
        
        // Lagre nøklene i databasen
        const { error: insertError } = await supabase
          .from('encryption_keys')
          .insert([{
            user_id: user.uid,
            public_key: JSON.stringify(userKeys.publicKey),
            encrypted_private_key: encryptedPrivateKey,
            created_at: new Date().toISOString()
          }]);
        
        if (insertError) {
          throw new Error(`Feil ved lagring av nøkler: ${insertError.message}`);
        }
      } else {
        // Dekrypter eksisterende nøkler
        const storageKey = await Encryption.generateEncryptionKeyForStorage(
          user.uid,
          'snakkaz-salt'
        );
        
        const decryptedKeys = await Encryption.decryptKeysFromStorage(
          existingKeys.encrypted_private_key,
          storageKey
        );
        
        userKeys = {
          publicKey: decryptedKeys.publicKey,
          privateKey: decryptedKeys.privateKey
        };
      }
      
      // Oppdater state med brukerens nøkler
      setKeysState(prev => ({
        ...prev,
        myKeys: userKeys,
        isGeneratingKeys: false,
        isLoadingKeys: false
      }));
      
      // Hent offentlige nøkler for andre brukere
      await fetchPublicKeys();
      
    } catch (error) {
      console.error('Feil ved initialisering av krypteringsnøkler:', error);
      setKeysState(prev => ({
        ...prev,
        isGeneratingKeys: false,
        isLoadingKeys: false,
        error: error instanceof Error ? error.message : 'Ukjent feil ved nøkkeloppsett'
      }));
    }
  }, [user, supabase]);
  
  // Hent offentlige nøkler for alle brukere
  const fetchPublicKeys = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data: publicKeysData, error } = await supabase
        .from('encryption_keys')
        .select('user_id, public_key');
      
      if (error) throw new Error(`Feil ved henting av offentlige nøkler: ${error.message}`);
      
      if (publicKeysData) {
        const publicKeys: Record<string, JsonWebKey> = {};
        
        for (const keyData of publicKeysData) {
          try {
            publicKeys[keyData.user_id] = JSON.parse(keyData.public_key);
          } catch (e) {
            console.error(`Kunne ikke parse offentlig nøkkel for bruker ${keyData.user_id}:`, e);
          }
        }
        
        setKeysState(prev => ({
          ...prev,
          userPublicKeys: publicKeys
        }));
      }
    } catch (error) {
      console.error('Feil ved henting av offentlige nøkler:', error);
      setKeysState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Ukjent feil ved henting av nøkler'
      }));
    }
  }, [user, supabase]);
  
  // Opprett eller hent en gruppenøkkel
  const getGroupKey = useCallback(async (groupId: string): Promise<CryptoKey | null> => {
    if (!user) return null;
    
    // Sjekk om vi allerede har nøkkelen i minnet
    if (keysState.groupKeys[groupId]) {
      return keysState.groupKeys[groupId];
    }
    
    try {
      // Hent gruppenøkkelen fra databasen
      const { data: groupKeyData, error } = await supabase
        .from('group_keys')
        .select('encrypted_key')
        .eq('group_id', groupId)
        .eq('user_id', user.uid)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw new Error(`Feil ved henting av gruppenøkkel: ${error.message}`);
      }
      
      // Hvis ingen nøkkel finnes, må brukeren legges til i gruppen først
      if (!groupKeyData) {
        return null;
      }
      
      // Dekrypter gruppenøkkelen med brukerens private nøkkel
      if (!keysState.myKeys) {
        throw new Error('Brukerens nøkler er ikke initialisert');
      }
      
      // Her trenger vi implementasjon av gruppekryptering...
      // Dette er en mock-implementasjon
      const mockGroupKey = await window.crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          length: 256
        },
        true,
        ["encrypt", "decrypt"]
      );
      
      // Oppdater state med den nye gruppenøkkelen
      setKeysState(prev => ({
        ...prev,
        groupKeys: {
          ...prev.groupKeys,
          [groupId]: mockGroupKey
        }
      }));
      
      return mockGroupKey;
    } catch (error) {
      console.error(`Feil ved henting av gruppenøkkel for gruppe ${groupId}:`, error);
      return null;
    }
  }, [user, supabase, keysState.myKeys, keysState.groupKeys]);
  
  // Krypter en melding til en bestemt bruker
  const encryptForUser = useCallback(async (
    message: string,
    recipientId: string
  ): Promise<Encryption.EncryptedData | null> => {
    if (!keysState.myKeys || !keysState.userPublicKeys[recipientId]) {
      console.error('Mangler nøkler for kryptering');
      return null;
    }
    
    try {
      const encryptedData = await Encryption.encryptMessage(
        message,
        keysState.userPublicKeys[recipientId],
        keysState.myKeys.privateKey
      );
      
      return encryptedData;
    } catch (error) {
      console.error('Feil ved kryptering av melding:', error);
      return null;
    }
  }, [keysState.myKeys, keysState.userPublicKeys]);
  
  // Dekrypter en melding som er sendt til denne brukeren
  const decryptFromUser = useCallback(async (
    encryptedData: Encryption.EncryptedData
  ): Promise<string | null> => {
    if (!keysState.myKeys) {
      console.error('Mangler nøkler for dekryptering');
      return null;
    }
    
    try {
      const decryptedMessage = await Encryption.decryptMessage(
        encryptedData,
        keysState.myKeys.privateKey
      );
      
      return decryptedMessage;
    } catch (error) {
      console.error('Feil ved dekryptering av melding:', error);
      return null;
    }
  }, [keysState.myKeys]);
  
  // Krypter en melding for en gruppe
  const encryptForGroup = useCallback(async (
    message: string,
    groupId: string
  ): Promise<{ ciphertext: string; iv: string } | null> => {
    try {
      const groupKey = await getGroupKey(groupId);
      
      if (!groupKey) {
        throw new Error(`Ingen nøkkel funnet for gruppe ${groupId}`);
      }
      
      return await Encryption.encryptGroupMessage(message, groupKey);
    } catch (error) {
      console.error(`Feil ved kryptering av gruppemelding for gruppe ${groupId}:`, error);
      return null;
    }
  }, [getGroupKey]);
  
  // Dekrypter en gruppemelding
  const decryptFromGroup = useCallback(async (
    encryptedData: { ciphertext: string; iv: string },
    groupId: string
  ): Promise<string | null> => {
    try {
      const groupKey = await getGroupKey(groupId);
      
      if (!groupKey) {
        throw new Error(`Ingen nøkkel funnet for gruppe ${groupId}`);
      }
      
      // Decoder base64-strengene
      const ciphertext = Uint8Array.from(
        atob(encryptedData.ciphertext)
          .split('')
          .map(char => char.charCodeAt(0))
      );
      
      const iv = Uint8Array.from(
        atob(encryptedData.iv)
          .split('')
          .map(char => char.charCodeAt(0))
      );
      
      // Dekrypter meldingen
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        groupKey,
        ciphertext
      );
      
      // Konverter binærdata tilbake til tekst
      const decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);
    } catch (error) {
      console.error(`Feil ved dekryptering av gruppemelding for gruppe ${groupId}:`, error);
      return null;
    }
  }, [getGroupKey]);
  
  // Initialiser nøkler når brukeren endrer seg
  useEffect(() => {
    if (user) {
      initializeUserKeys();
    } else {
      // Reset state når brukeren logger ut
      setKeysState({
        myKeys: null,
        userPublicKeys: {},
        groupKeys: {},
        isGeneratingKeys: false,
        isLoadingKeys: false,
        error: null
      });
    }
  }, [user, initializeUserKeys]);
  
  // Returner alle funksjoner og tilstander som trengs for kryptering
  return {
    // Nøkkeltilstand
    hasKeys: !!keysState.myKeys,
    isGeneratingKeys: keysState.isGeneratingKeys,
    isLoadingKeys: keysState.isLoadingKeys,
    error: keysState.error,
    
    // Krypterings/dekrypteringsfunksjoner
    encryptForUser,
    decryptFromUser,
    encryptForGroup,
    decryptFromGroup,
    
    // Andre hjelpefunksjoner
    refreshPublicKeys: fetchPublicKeys
  };
}

export default useEncryption;