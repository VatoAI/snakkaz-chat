
/**
 * Secure connection establishment utilities
 */

// Etabler sikker forbindelse mellom to parter
export const establishSecureConnection = async (
  localPublicKey: JsonWebKey,
  localPrivateKey: JsonWebKey,
  remotePublicKey: JsonWebKey
): Promise<CryptoKey> => {
  try {
    // Importer nøkler
    const privateKey = await window.crypto.subtle.importKey(
      "jwk",
      localPrivateKey,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      false,
      ["deriveKey", "deriveBits"]
    );

    const publicKey = await window.crypto.subtle.importKey(
      "jwk",
      remotePublicKey,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      []
    );

    // Utlede en felles hemmelighet
    const derivedKey = await window.crypto.subtle.deriveKey(
      {
        name: "ECDH",
        public: publicKey,
      },
      privateKey,
      {
        name: "AES-GCM",
        length: 256,
      },
      false,
      ["encrypt", "decrypt"]
    );

    return derivedKey;
  } catch (error) {
    console.error("Secure connection establishment failed:", error);
    throw new Error("Failed to establish secure connection");
  }
};
