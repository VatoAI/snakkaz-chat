/**
 * Whole Page Encryption for SnakkaZ
 * Implementerer kryptering av hele sider eller grupper i ett steg
 */

import { importGroupEncryptionKey } from './group-keys';
import { str2ab, ab2str, arrayBufferToBase64, base64ToArrayBuffer } from './data-conversion';

interface WholePageData {
  messages: any[];
  metadata: any;
  settings: any;
  [key: string]: any; // Tillater andre felter som kan være nødvendige
}

/**
 * Krypterer hele sidens data med én enkelt nøkkel
 * Dette gjør kryptering mer effektiv og sikker
 */
export const encryptWholePage = async (
  pageData: WholePageData, 
  encryptionKeyString: string
): Promise<string> => {
  try {
    // Importer krypteringsnøkkelen
    const key = await importGroupEncryptionKey(encryptionKeyString);
    
    // Konverter sidedata til JSON string
    const dataString = JSON.stringify(pageData);
    
    // Generer en tilfeldig IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Krypter dataen
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      str2ab(dataString)
    );
    
    // Kombiner IV og kryptert data for lagring/overføring
    const combinedData = {
      encryptedContent: arrayBufferToBase64(encryptedBuffer),
      iv: arrayBufferToBase64(iv)
    };
    
    return JSON.stringify(combinedData);
  } catch (error) {
    console.error("Whole page encryption failed:", error);
    throw new Error("Kunne ikke kryptere hele siden");
  }
};

/**
 * Dekrypterer hele sidens data med den gitte nøkkelen
 */
export const decryptWholePage = async (
  encryptedPageData: string,
  encryptionKeyString: string
): Promise<WholePageData> => {
  try {
    // Parse den krypterte dataen
    const { encryptedContent, iv } = JSON.parse(encryptedPageData);
    
    // Importer krypteringsnøkkelen
    const key = await importGroupEncryptionKey(encryptionKeyString);
    
    // Konverter base64 tilbake til ArrayBuffer
    const encryptedBuffer = base64ToArrayBuffer(encryptedContent);
    const ivBuffer = base64ToArrayBuffer(iv);
    
    // Dekrypter dataen
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(ivBuffer),
      },
      key,
      encryptedBuffer
    );
    
    // Konverter buffer tilbake til string og parse JSON
    const decryptedData = JSON.parse(ab2str(decryptedBuffer));
    
    return decryptedData;
  } catch (error) {
    console.error("Whole page decryption failed:", error);
    throw new Error("Kunne ikke dekryptere siden");
  }
};

/**
 * Generer en gruppenøkkel for en ny gruppe
 * Dette er forskjellig fra enkelt-melding kryptering 
 * og brukes for å sikre hele gruppen
 */
export const generateGroupPageKey = async (): Promise<{key: string, keyId: string}> => {
  try {
    // Generer en tilfeldig krypteringsnøkkel
    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
    
    // Eksporter nøkkelen
    const exportedKey = await window.crypto.subtle.exportKey("jwk", key);
    const keyString = JSON.stringify(exportedKey);
    
    // Generer en unik ID for nøkkelen
    const keyId = Array.from(
      window.crypto.getRandomValues(new Uint8Array(16)),
      byte => byte.toString(16).padStart(2, "0")
    ).join("");
    
    return {
      key: keyString,
      keyId
    };
  } catch (error) {
    console.error("Group key generation failed:", error);
    throw new Error("Kunne ikke generere gruppenøkkel");
  }
};