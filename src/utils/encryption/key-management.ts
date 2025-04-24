/**
 * Key management utilities for encryption
 */

// Generer et tilfeldig nøkkelpar for sikker kommunikasjon
export const generateKeyPair = async (): Promise<{ publicKey: JsonWebKey; privateKey: JsonWebKey }> => {
  try {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey", "deriveBits"]
    );

    const publicKey = await window.crypto.subtle.exportKey(
      "jwk",
      keyPair.publicKey
    );

    const privateKey = await window.crypto.subtle.exportKey(
      "jwk",
      keyPair.privateKey
    );

    return {
      publicKey,
      privateKey,
    };
  } catch (error) {
    console.error("Key generation failed:", error);
    throw new Error("Failed to generate key pair");
  }
};

/**
 * Genererer en tilfeldig krypteringsnøkkel for gruppekryptering og andre formål
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
