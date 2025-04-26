/**
 * Encryption Utilities
 * 
 * Dette filen inneholder verktøy for end-to-end kryptering i Snakkaz-appen.
 * Disse funksjonene brukes av AppEncryptionContext for å sikre helhetlig 
 * kryptering av all data i appen.
 */

// Konverter string til ArrayBuffer
export const str2ab = (str: string): ArrayBuffer => {
  const buf = new ArrayBuffer(str.length * 2); // 2 bytes per karakter
  const bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};

// Konverter ArrayBuffer til string
export const ab2str = (buf: ArrayBuffer): string => {
  return String.fromCharCode.apply(null, [...new Uint16Array(buf)]);
};

// Konverter ArrayBuffer til Base64
export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// Konverter Base64 til ArrayBuffer
export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Generer en krypteringsnøkkel for en gruppe
export const generateGroupPageKey = async (): Promise<{ key: string; keyId: string } | null> => {
  try {
    // Generer en AES-GCM 256-bit krypteringsnøkkel
    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true, // extractable
      ["encrypt", "decrypt"]
    );

    // Eksporter nøkkelen for lagring
    const exportedKey = await window.crypto.subtle.exportKey("jwk", key);
    const keyString = JSON.stringify(exportedKey);
    const keyId = crypto.randomUUID();

    return { key: keyString, keyId };
  } catch (error) {
    console.error("Kunne ikke generere krypteringsnøkkel:", error);
    return null;
  }
};

// Importer en krypteringsnøkkel fra en JSON Web Key string
export const importEncryptionKey = async (keyString: string): Promise<CryptoKey> => {
  try {
    const keyData = JSON.parse(keyString);
    
    return await window.crypto.subtle.importKey(
      "jwk",
      keyData,
      {
        name: "AES-GCM",
        length: 256,
      },
      false, // ikke exportable
      ["encrypt", "decrypt"]
    );
  } catch (error) {
    console.error("Kunne ikke importere krypteringsnøkkel:", error);
    throw new Error("Kunne ikke importere krypteringsnøkkel");
  }
};

// Krypter hele siden
export const encryptWholePage = async <T>(data: T, encryptionKeyString: string): Promise<string> => {
  try {
    // Konverter dataen til string
    const dataString = JSON.stringify(data);
    
    // Importer krypteringsnøkkelen
    const key = await importEncryptionKey(encryptionKeyString);
    
    // Generer en tilfeldig IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Krypter dataen
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      str2ab(dataString)
    );
    
    // Konverter buffers til base64 strings for lagring
    const encryptedBase64 = arrayBufferToBase64(encryptedBuffer);
    const ivBase64 = arrayBufferToBase64(iv);
    
    // Returner kryptert data format
    return JSON.stringify({
      encryptedContent: encryptedBase64,
      iv: ivBase64,
    });
  } catch (error) {
    console.error("Kunne ikke kryptere siden:", error);
    throw new Error("Kunne ikke kryptere siden");
  }
};

// Dekrypter hele siden
export const decryptWholePage = async <T>(encryptedDataString: string, encryptionKeyString: string): Promise<T> => {
  try {
    // Parse den krypterte dataen
    const { encryptedContent, iv } = JSON.parse(encryptedDataString);
    
    // Importer krypteringsnøkkelen
    const key = await importEncryptionKey(encryptionKeyString);
    
    // Konverter base64 strings tilbake til ArrayBuffers
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
    
    // Konverter ArrayBuffer til string og parse JSON
    const decryptedString = ab2str(decryptedBuffer);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Kunne ikke dekryptere siden:", error);
    throw new Error("Kunne ikke dekryptere siden");
  }
};

// Re-eksporter eventuelt eksisterende funksjoner fra andre encryption-filer
export * from './global-e2ee';
