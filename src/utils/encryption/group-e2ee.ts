/**
 * Gruppespesifikk krypteringsmodul
 * 
 * Denne modulen håndterer unike krypteringsnøkler for hver gruppe,
 * som sikrer at gruppemeldinger får et dedikert krypteringslag.
 */

import { supabase } from "@/integrations/supabase/client";
import { arrayBufferToBase64, base64ToArrayBuffer } from "./data-conversion";

// Cache for gruppekrypteringsnøkler
const groupKeyCache: Record<string, {
  key: string,
  iv: string,
  expires: number
}> = {};

/**
 * Genererer en ny krypteringsnøkkel for en gruppe
 */
export const generateGroupEncryptionKey = async (): Promise<{key: string, iv: string}> => {
  // Generer tilfeldig krypteringsnøkkel
  const key = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  // Generer tilfeldig IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Eksporter nøkkelen for lagring
  const exportedKey = await window.crypto.subtle.exportKey("jwk", key);
  
  return {
    key: JSON.stringify(exportedKey),
    iv: arrayBufferToBase64(iv)
  };
};

/**
 * Henter gruppekrypteringsnøkkel fra cache eller database
 */
export const getGroupEncryptionKey = async (groupId: string): Promise<{key: string, iv: string}> => {
  // Sjekk cache først
  if (groupKeyCache[groupId] && groupKeyCache[groupId].expires > Date.now()) {
    return {
      key: groupKeyCache[groupId].key,
      iv: groupKeyCache[groupId].iv
    };
  }

  try {
    // Hent fra databasen
    const { data, error } = await supabase
      .from('group_encryption')
      .select('encryption_key, iv')
      .eq('group_id', groupId)
      .single();
    
    if (error || !data) {
      // Ingen nøkkel funnet, opprett en ny
      console.log('Ingen eksisterende krypteringsnøkkel for gruppe, oppretter ny');
      const newKeys = await generateGroupEncryptionKey();
      
      // Lagre nøkkelen i databasen
      await supabase
        .from('group_encryption')
        .upsert({
          group_id: groupId,
          encryption_key: newKeys.key,
          iv: newKeys.iv,
          created_at: new Date().toISOString()
        });
      
      // Oppdater cache
      groupKeyCache[groupId] = {
        key: newKeys.key,
        iv: newKeys.iv,
        expires: Date.now() + 3600000 // Cacher i 1 time
      };
      
      return newKeys;
    }
    
    // Oppdater cache og returner nøkler
    groupKeyCache[groupId] = {
      key: data.encryption_key,
      iv: data.iv,
      expires: Date.now() + 3600000 // Cacher i 1 time
    };
    
    return {
      key: data.encryption_key,
      iv: data.iv
    };
  } catch (err) {
    console.error('Feil ved henting av gruppekrypteringsnøkkel:', err);
    throw new Error('Kunne ikke hente gruppekrypteringsnøkkel');
  }
};

/**
 * Krypterer en gruppemelding med gruppespesifikk nøkkel
 */
export const encryptGroupMessage = async (
  groupId: string, 
  message: string
): Promise<{
  encryptedContent: string,
  key: string,
  iv: string
}> => {
  try {
    // Hent gruppens nøkkel
    const { key: groupKeyStr, iv: groupIvStr } = await getGroupEncryptionKey(groupId);
    const groupKey = await window.crypto.subtle.importKey(
      "jwk",
      JSON.parse(groupKeyStr),
      {
        name: "AES-GCM",
        length: 256,
      },
      false,
      ["encrypt"]
    );
    
    const groupIv = base64ToArrayBuffer(groupIvStr);
    
    // Krypter meldingen med gruppens nøkkel
    const messageBuffer = new TextEncoder().encode(message);
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(groupIv),
      },
      groupKey,
      messageBuffer
    );
    
    return {
      encryptedContent: arrayBufferToBase64(encryptedBuffer),
      key: groupKeyStr,
      iv: groupIvStr
    };
  } catch (error) {
    console.error("Gruppemelding-kryptering feilet:", error);
    throw new Error("Kunne ikke kryptere gruppemelding");
  }
};

/**
 * Fjern en gruppekrypteringsnøkkel fra cache
 * Dette bør kalles dersom gruppen slettes eller brukeren forlater gruppen
 */
export const clearGroupEncryptionKey = (groupId: string): void => {
  delete groupKeyCache[groupId];
};