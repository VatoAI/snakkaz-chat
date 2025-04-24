/**
 * Group encryption key utilities
 */

/**
 * Genererer en tilfeldig krypteringsnøkkel for gruppekryptering
 * Returnerer nøkkelen som en Base64-kodet streng
 */
export const generateEncryptionKey = async (): Promise<string> => {
  try {
    // Generer tilfeldig krypteringsnøkkel
    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
    
    // Eksporter nøkkelen som JWK
    const exportedKey = await window.crypto.subtle.exportKey("jwk", key);
    
    // Returner som streng
    return JSON.stringify(exportedKey);
  } catch (error) {
    console.error("Encryption key generation failed:", error);
    throw new Error("Failed to generate encryption key");
  }
};

/**
 * Importerer en krypteringsnøkkel fra en streng
 */
export const importGroupEncryptionKey = async (keyString: string): Promise<CryptoKey> => {
  try {
    return await window.crypto.subtle.importKey(
      "jwk",
      JSON.parse(keyString),
      {
        name: "AES-GCM",
        length: 256,
      },
      false,
      ["encrypt", "decrypt"]
    );
  } catch (error) {
    console.error("Group key import failed:", error);
    throw new Error("Failed to import group encryption key");
  }
};