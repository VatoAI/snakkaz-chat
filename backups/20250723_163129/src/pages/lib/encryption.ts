// End-to-End Encryption implementasjon for Snakkaz Chat
// Dette bruker Web Crypto API for sikker kryptografisk funksjonalitet

// Type definisjoner for kryptering
export interface EncryptionKeys {
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
}

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  ephemeralPublicKey: JsonWebKey;
}

// Generere nytt asymmetrisk nøkkelpar for en bruker
export async function generateUserKeys(): Promise<EncryptionKeys> {
  try {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey"]
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
      privateKey
    };
  } catch (error) {
    console.error('Feil ved generering av krypteringsnøkler:', error);
    throw new Error('Kunne ikke generere krypteringsnøkler');
  }
}

// Importer en offentlig nøkkel
async function importPublicKey(publicKeyJwk: JsonWebKey): Promise<CryptoKey> {
  return await window.crypto.subtle.importKey(
    "jwk",
    publicKeyJwk,
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    []
  );
}

// Importer en privat nøkkel
async function importPrivateKey(privateKeyJwk: JsonWebKey): Promise<CryptoKey> {
  return await window.crypto.subtle.importKey(
    "jwk",
    privateKeyJwk,
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey"]
  );
}

// Utlede en delt hemmelighet mellom to brukere for sikker kommunikasjon
async function deriveSharedSecret(
  privateKey: CryptoKey,
  publicKey: CryptoKey
): Promise<CryptoKey> {
  return await window.crypto.subtle.deriveKey(
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
}

// Kryptere en melding til en mottaker
export async function encryptMessage(
  message: string,
  receiverPublicKeyJwk: JsonWebKey,
  senderPrivateKeyJwk: JsonWebKey
): Promise<EncryptedData> {
  try {
    // Generer et enkeltstående efemert nøkkelpar for denne meldingen
    const ephemeralKeyPair = await window.crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey"]
    );

    const ephemeralPublicKey = await window.crypto.subtle.exportKey(
      "jwk",
      ephemeralKeyPair.publicKey
    );

    // Import mottakerens offentlige nøkkel
    const receiverPublicKey = await importPublicKey(receiverPublicKeyJwk);
    
    // Utled delt hemmelighet mellom efemert privat nøkkel og mottakerens offentlige nøkkel
    const sharedSecret = await deriveSharedSecret(
      ephemeralKeyPair.privateKey,
      receiverPublicKey
    );

    // Krypter meldingen
    const encoder = new TextEncoder();
    const messageData = encoder.encode(message);

    // Generer en tilfeldig Initialization Vector (IV)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      sharedSecret,
      messageData
    );

    // Konverter binærdata til Base64-strenger for lagring/overføring
    const ciphertext = btoa(
      String.fromCharCode.apply(null, new Uint8Array(encryptedBuffer) as any)
    );
    
    const ivString = btoa(
      String.fromCharCode.apply(null, new Uint8Array(iv) as any)
    );

    return {
      ciphertext,
      iv: ivString,
      ephemeralPublicKey
    };
  } catch (error) {
    console.error('Krypteringsfeil:', error);
    throw new Error('Kunne ikke kryptere melding');
  }
}

// Dekryptere en mottatt melding
export async function decryptMessage(
  encryptedData: EncryptedData,
  receiverPrivateKeyJwk: JsonWebKey
): Promise<string> {
  try {
    // Import mottakerens private nøkkel
    const receiverPrivateKey = await importPrivateKey(receiverPrivateKeyJwk);
    
    // Import den efemere offentlige nøkkelen fra den krypterte meldingen
    const ephemeralPublicKey = await importPublicKey(encryptedData.ephemeralPublicKey);
    
    // Utled samme delte hemmelighet som ble brukt til kryptering
    const sharedSecret = await deriveSharedSecret(
      receiverPrivateKey,
      ephemeralPublicKey
    );

    // Dekoder Base64-strengene tilbake til binærdata
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
      sharedSecret,
      ciphertext
    );

    // Konverter binærdata tilbake til tekst
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('Dekrypteringsfeil:', error);
    throw new Error('Kunne ikke dekryptere melding');
  }
}

// Hjelpefunksjon for å kryptere meldinger i gruppechatter
export async function encryptGroupMessage(
  message: string, 
  groupKey: CryptoKey
): Promise<{ ciphertext: string; iv: string }> {
  try {
    const encoder = new TextEncoder();
    const messageData = encoder.encode(message);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      groupKey,
      messageData
    );
    
    // Konverter til Base64
    const ciphertext = btoa(
      String.fromCharCode.apply(null, new Uint8Array(encryptedBuffer) as any)
    );
    
    const ivString = btoa(
      String.fromCharCode.apply(null, new Uint8Array(iv) as any)
    );
    
    return {
      ciphertext,
      iv: ivString
    };
  } catch (error) {
    console.error('Feil ved kryptering av gruppemelding:', error);
    throw new Error('Kunne ikke kryptere gruppemelding');
  }
}

// Funksjon som brukes sammen med Supabase for sikker lagring av nøkler
export async function generateEncryptionKeyForStorage(password: string, salt: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  const saltData = encoder.encode(salt);
  
  // Utled en nøkkel fra passordet
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    passwordData,
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  
  // Bruk PBKDF2 for å generere en sterk nøkkel
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltData,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256
    },
    true,
    ["encrypt", "decrypt"]
  );
}

// Krypter private nøkler før lagring i database
export async function encryptKeysForStorage(
  keys: EncryptionKeys,
  storageKey: CryptoKey
): Promise<string> {
  const encoder = new TextEncoder();
  const keysData = encoder.encode(JSON.stringify(keys));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    storageKey,
    keysData
  );
  
  // Pakk sammen IV og kryptert data for lagring
  const encryptedArray = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  encryptedArray.set(iv);
  encryptedArray.set(new Uint8Array(encryptedBuffer), iv.length);
  
  return btoa(String.fromCharCode.apply(null, encryptedArray as any));
}

// Dekrypter lagrede nøkler
export async function decryptKeysFromStorage(
  encryptedKeysString: string,
  storageKey: CryptoKey
): Promise<EncryptionKeys> {
  try {
    const encryptedData = Uint8Array.from(
      atob(encryptedKeysString)
        .split('')
        .map(char => char.charCodeAt(0))
    );
    
    // Skill ut IV og kryptert data
    const iv = encryptedData.slice(0, 12);
    const ciphertext = encryptedData.slice(12);
    
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      storageKey,
      ciphertext
    );
    
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedBuffer));
  } catch (error) {
    console.error('Feil ved dekryptering av lagrede nøkler:', error);
    throw new Error('Kunne ikke dekryptere lagrede nøkler');
  }
}