/**
 * Implementering av kryptering for hele sider eller større datastrukturer
 * Bruker AES-GCM for sikker kryptering
 */

export type WholePageData = Record<string, any>;

interface EncryptedData {
  encryptedContent: string; // Base64-kodet kryptert innhold
  iv: string; // Initialiserings vektor (IV)
  salt: string; // Salt for nøkkelderivering
  timestamp: string; // Tidsstempel for krypteringen
}

/**
 * Konverterer en streng til en ArrayBuffer
 */
const stringToArrayBuffer = (str: string): ArrayBuffer => {
  const encoder = new TextEncoder();
  return encoder.encode(str).buffer;
};

/**
 * Konverterer en ArrayBuffer til en streng
 */
const arrayBufferToString = (buffer: ArrayBuffer): string => {
  const decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(buffer));
};

/**
 * Konverterer en streng til en krypteringsnøkkel
 */
const importKeyFromString = async (keyString: string): Promise<CryptoKey> => {
  try {
    // Dekoder base64-strengen til rådata
    const keyData = stringToArrayBuffer(atob(keyString));
    
    // Importerer nøkkelen til Web Crypto API
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM', length: 256 },
      false, // extractable
      ['encrypt', 'decrypt']
    );
    
    return key;
  } catch (err) {
    console.error('Feil ved import av krypteringsnøkkel:', err);
    throw new Error('Kunne ikke importere krypteringsnøkkel');
  }
};

/**
 * Krypterer sidedata med AES-GCM
 */
export const encryptWholePage = async (
  pageData: WholePageData, 
  keyString: string
): Promise<string> => {
  try {
    // Importerer nøkkelen
    const key = await importKeyFromString(keyString);
    
    // Genererer en tilfeldig IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Genererer et salt
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    // Konverterer dataene til JSON
    const jsonData = JSON.stringify(pageData);
    
    // Krypterer dataene
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
        tagLength: 128
      },
      key,
      stringToArrayBuffer(jsonData)
    );
    
    // Konverterer de krypterte dataene og IV til base64
    const encryptedContent = btoa(String.fromCharCode.apply(null, [...new Uint8Array(encryptedBuffer)]));
    const ivString = btoa(String.fromCharCode.apply(null, [...iv]));
    const saltString = btoa(String.fromCharCode.apply(null, [...salt]));
    
    // Pakker inn de krypterte dataene med metadata
    const encryptedData: EncryptedData = {
      encryptedContent,
      iv: ivString,
      salt: saltString,
      timestamp: new Date().toISOString()
    };
    
    // Returnerer de krypterte dataene som JSON
    return JSON.stringify(encryptedData);
  } catch (err) {
    console.error('Feil ved kryptering av sidedata:', err);
    throw new Error('Kunne ikke kryptere sidedata');
  }
};

/**
 * Dekrypterer sidedata med AES-GCM
 */
export const decryptWholePage = async <T,>(
  encryptedDataString: string, 
  keyString: string
): Promise<T> => {
  try {
    // Importerer nøkkelen
    const key = await importKeyFromString(keyString);
    
    // Henter de krypterte dataene og metadata
    const encryptedData: EncryptedData = JSON.parse(encryptedDataString);
    
    // Konverterer IV fra base64 til Uint8Array
    const iv = new Uint8Array(
      atob(encryptedData.iv)
        .split('')
        .map(c => c.charCodeAt(0))
    );
    
    // Konverterer krypterte data fra base64 til ArrayBuffer
    const encryptedContent = new Uint8Array(
      atob(encryptedData.encryptedContent)
        .split('')
        .map(c => c.charCodeAt(0))
    );
    
    // Dekrypterer dataene
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
        tagLength: 128
      },
      key,
      encryptedContent
    );
    
    // Konverterer dekrypterte data til JSON
    const decryptedText = arrayBufferToString(decryptedBuffer);
    const decryptedData = JSON.parse(decryptedText);
    
    return decryptedData as T;
  } catch (err) {
    console.error('Feil ved dekryptering av sidedata:', err);
    throw new Error('Kunne ikke dekryptere sidedata');
  }
};