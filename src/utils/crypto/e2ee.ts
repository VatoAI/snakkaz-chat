/**
 * SnakkaZ E2EE (Ende-til-Ende-Kryptering)
 * 
 * Denne modulen gir sikker kryptering for både direktemeldinger og gruppemeldinger
 * via Web Crypto API. Hovedfunksjonaliteter inkluderer:
 * 
 * - Sikker peer-to-peer kryptering for direktemeldinger
 * - Gruppekryptering med nøkkeldistribusjon
 * - Nøkkelhåndtering og cacheing for optimalisert ytelse
 * - Testing og verifisering av krypteringsfunksjoner
 * 
 * Sikkerhetsdetaljer:
 * - Bruker AES-GCM med 256-bit nøkler
 * - Unike, tilfeldige initialiserings-vektorer (IV) for hver melding
 * - SHA-256 for nøkkelderivasjon
 * - Støtter sikker nøkkeldeling for gruppesamtaler
 * 
 * Oppdatert: Juli 2025
 */

// Konstanter for kryptering
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits

// Cache for krypteringsnøkler
const keyCache = new Map<string, CryptoKey>();

/**
 * Konverterer ArrayBuffer til Base64-streng
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer))));
}

/**
 * Konverterer Base64-streng til ArrayBuffer
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Eksporter type for krypterte meldinger
export interface EncryptedMessage {
  type: number;
  body: string;
  registrationId?: number;
}

/**
 * Generer en krypteringsnøkkel basert på brukerens ID og mottakerens ID
 */
async function generateKey(userId: string, peerId: string): Promise<CryptoKey> {
  // Sjekk om nøkkelen allerede finnes i cachen
  const cacheKey = `${userId}-${peerId}`;
  if (keyCache.has(cacheKey)) {
    return keyCache.get(cacheKey)!;
  }
  
  // Bruk en kombinasjon av bruker-ID-er for å generere en unik, konsistent nøkkel
  const combinedIds = userId < peerId 
    ? `${userId}:${peerId}` 
    : `${peerId}:${userId}`;
  
  // Bruk SHA-256 for å lage et konsistent derivasjonsmateriale
  const encoder = new TextEncoder();
  const data = encoder.encode(combinedIds);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Opprett en AES-GCM-nøkkel
  const key = await crypto.subtle.importKey(
    'raw',
    hashBuffer,
    {
      name: ALGORITHM,
      length: KEY_LENGTH
    },
    false, // extractable
    ['encrypt', 'decrypt']
  );
  
  // Lagre nøkkelen i cachen
  keyCache.set(cacheKey, key);
  
  return key;
}

/**
 * Krypter en melding for en bestemt mottaker
 * @param userId Avsenders ID
 * @param peerId Mottakers ID
 * @param message Meldingen som skal krypteres
 * @returns Kryptert melding som Base64-streng
 */
export async function encryptMessage(userId: string, peerId: string, message: any): Promise<string> {
  try {
    // Generer en unik IV for denne meldingen
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    
    // Hent krypteringsnøkkel
    const key = await generateKey(userId, peerId);
    
    // Konverter meldingen til JSON og deretter til en byte array
    const encoder = new TextEncoder();
    const messageData = encoder.encode(JSON.stringify(message));
    
    // Krypter meldingsdata
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv
      },
      key,
      messageData
    );
    
    // Kombiner IV og kryptert data
    const result = new Uint8Array(iv.length + encryptedData.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encryptedData), iv.length);
    
    // Konverter til Base64 for enkel overføring
    return btoa(String.fromCharCode.apply(null, Array.from(result)));
  } catch (error) {
    console.error('Krypteringsfeil:', error);
    throw new Error('Kunne ikke kryptere meldingen');
  }
}

/**
 * Dekrypter en melding fra en bestemt avsender
 * @param userId Mottakers ID (din ID)
 * @param peerId Avsenders ID
 * @param encryptedMessage Kryptert melding som Base64-streng
 * @returns Dekryptert meldingsobjekt
 */
export async function decryptMessage(userId: string, peerId: string, encryptedMessage: string): Promise<any> {
  try {
    // Konverter Base64 tilbake til byte array
    const binaryString = atob(encryptedMessage);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Skill ut IV og kryptert data
    const iv = bytes.slice(0, IV_LENGTH);
    const encryptedData = bytes.slice(IV_LENGTH);
    
    // Hent krypteringsnøkkel
    const key = await generateKey(userId, peerId);
    
    // Dekrypter data
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv
      },
      key,
      encryptedData
    );
    
    // Konverter tilbake til JSON
    const decoder = new TextDecoder();
    const jsonString = decoder.decode(decryptedData);
    
    // Parse JSON til objekt
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Dekrypteringsfeil:', error);
    throw new Error('Kunne ikke dekryptere meldingen');
  }
}

/**
 * Generer en unik nøkkel for en gruppe
 * @param groupId Gruppe-ID
 * @param salt Ekstra salt for å sikre unikhet (f.eks. tidsstempel)
 * @returns CryptoKey for denne gruppen
 */
export async function generateGroupKey(groupId: string, salt: string = ''): Promise<CryptoKey> {
  // Cachekey for gruppens nøkkel
  const cacheKey = `group-${groupId}-${salt}`;
  if (keyCache.has(cacheKey)) {
    return keyCache.get(cacheKey)!;
  }
  
  // Bruk en kombinasjon av gruppe-ID og salt for å generere en unik nøkkel
  const encoder = new TextEncoder();
  const data = encoder.encode(`${groupId}:${salt}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Opprett en AES-GCM-nøkkel
  const key = await crypto.subtle.importKey(
    'raw',
    hashBuffer,
    {
      name: ALGORITHM,
      length: KEY_LENGTH
    },
    true, // extractable (så vi kan dele nøkkelen med gruppens medlemmer)
    ['encrypt', 'decrypt']
  );
  
  // Lagre nøkkelen i cachen
  keyCache.set(cacheKey, key);
  
  return key;
}

/**
 * Eksporter en gruppenøkkel som kan deles med andre gruppemedlemmer
 * @param groupId Gruppe-ID
 * @param salt Ekstra salt som ble brukt for å generere nøkkelen
 * @returns Base64-kodet nøkkel som kan deles
 */
export async function exportGroupKey(groupId: string, salt: string = ''): Promise<string> {
  try {
    // Hent eller generer gruppenøkkel
    const key = await generateGroupKey(groupId, salt);
    
    // Eksporter nøkkelen som rådata
    const exportedKey = await crypto.subtle.exportKey('raw', key);
    
    // Konverter til Base64 for enkel deling
    return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(exportedKey))));
  } catch (error) {
    console.error('Feil ved eksportering av gruppenøkkel:', error);
    throw new Error('Kunne ikke eksportere gruppenøkkel');
  }
}

/**
 * Importer en delt gruppenøkkel
 * @param groupId Gruppe-ID for å cachelagre nøkkelen
 * @param keyBase64 Base64-kodet nøkkel
 * @returns Importert CryptoKey
 */
export async function importGroupKey(groupId: string, keyBase64: string): Promise<CryptoKey> {
  try {
    // Sjekk om nøkkelen allerede er i cache
    const cacheKey = `group-${groupId}-imported`;
    if (keyCache.has(cacheKey)) {
      return keyCache.get(cacheKey)!;
    }
    
    // Dekode Base64-strengen til rådata
    const binaryString = atob(keyBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Importer rådata som CryptoKey
    const key = await crypto.subtle.importKey(
      'raw',
      bytes,
      {
        name: ALGORITHM,
        length: KEY_LENGTH
      },
      false, // ikke extractable etter import
      ['encrypt', 'decrypt']
    );
    
    // Lagre nøkkelen i cachen
    keyCache.set(cacheKey, key);
    
    return key;
  } catch (error) {
    console.error('Feil ved importering av gruppenøkkel:', error);
    throw new Error('Kunne ikke importere gruppenøkkel');
  }
}

/**
 * Krypter en melding for en gruppe
 * @param groupId Gruppe-ID
 * @param message Meldingen som skal krypteres
 * @param keyBase64 Valgfri base64-kodet nøkkel (hvis ikke generert)
 * @returns Kryptert melding som Base64-streng
 */
export async function encryptGroupMessage(
  groupId: string, 
  message: any, 
  keyBase64?: string
): Promise<string> {
  try {
    // Få tak i gruppenøkkelen
    let key: CryptoKey;
    if (keyBase64) {
      key = await importGroupKey(groupId, keyBase64);
    } else {
      key = await generateGroupKey(groupId);
    }
    
    // Generer en unik IV for denne meldingen
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    
    // Konverter meldingen til JSON og deretter til en byte array
    const encoder = new TextEncoder();
    const messageData = encoder.encode(JSON.stringify(message));
    
    // Krypter meldingsdata
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv
      },
      key,
      messageData
    );
    
    // Kombiner IV og kryptert data
    const result = new Uint8Array(iv.length + encryptedData.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encryptedData), iv.length);
    
    // Konverter til Base64 for enkel overføring
    return btoa(String.fromCharCode.apply(null, Array.from(result)));
  } catch (error) {
    console.error('Gruppemelding krypteringsfeil:', error);
    throw new Error('Kunne ikke kryptere gruppemeldingen');
  }
}

/**
 * Dekrypter en melding fra en gruppe
 * @param groupId Gruppe-ID
 * @param encryptedMessage Kryptert melding som Base64-streng
 * @param keyBase64 Valgfri base64-kodet nøkkel (hvis ikke generert)
 * @returns Dekryptert meldingsobjekt
 */
export async function decryptGroupMessage(
  groupId: string, 
  encryptedMessage: string, 
  keyBase64?: string
): Promise<any> {
  try {
    // Få tak i gruppenøkkelen
    let key: CryptoKey;
    if (keyBase64) {
      key = await importGroupKey(groupId, keyBase64);
    } else {
      key = await generateGroupKey(groupId);
    }
    
    // Konverter Base64 tilbake til byte array
    const binaryString = atob(encryptedMessage);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Skill ut IV og kryptert data
    const iv = bytes.slice(0, IV_LENGTH);
    const encryptedData = bytes.slice(IV_LENGTH);
    
    // Dekrypter data
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv
      },
      key,
      encryptedData
    );
    
    // Konverter tilbake til JSON
    const decoder = new TextDecoder();
    const jsonString = decoder.decode(decryptedData);
    
    // Parse JSON til objekt
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Gruppemelding dekrypteringsfeil:', error);
    throw new Error('Kunne ikke dekryptere gruppemeldingen');
  }
}

/**
 * Lagre en gruppenøkkel i lokal lagring
 * @param groupId Gruppe-ID
 * @param keyBase64 Base64-kodet nøkkel
 */
export function storeGroupKey(groupId: string, keyBase64: string): void {
  try {
    localStorage.setItem(`snakkaz-group-key-${groupId}`, keyBase64);
  } catch (error) {
    console.error('Feil ved lagring av gruppenøkkel:', error);
    throw new Error('Kunne ikke lagre gruppenøkkelen');
  }
}

/**
 * Hente en gruppenøkkel fra lokal lagring
 * @param groupId Gruppe-ID
 * @returns Base64-kodet nøkkel eller null hvis ikke funnet
 */
export function getGroupKey(groupId: string): string | null {
  try {
    return localStorage.getItem(`snakkaz-group-key-${groupId}`);
  } catch (error) {
    console.error('Feil ved henting av gruppenøkkel:', error);
    return null;
  }
}

/**
 * Distribuere en gruppenøkkel til alle gruppemedlemmer via personlig krypterte kanaler
 * @param groupId Gruppe-ID
 * @param userId Brukerens ID (sender)
 * @param memberIds Liste over gruppe-medlemmers ID-er
 * @param encryptFn Funksjon for å kryptere og sende data til et medlem
 */
export async function distributeGroupKey(
  groupId: string,
  userId: string,
  memberIds: string[],
  encryptFn: (memberId: string, data: any) => Promise<boolean>
): Promise<{ success: boolean, errors: string[] }> {
  const errors: string[] = [];
  let successCount = 0;
  
  try {
    // Generer eller hent gruppenøkkel
    let keyBase64 = getGroupKey(groupId);
    
    if (!keyBase64) {
      // Generer ny nøkkel hvis ingen eksisterer
      await generateGroupKey(groupId);
      keyBase64 = await exportGroupKey(groupId, '');
      storeGroupKey(groupId, keyBase64);
    }
    
    // Distribuer nøkkelen til alle medlemmer
    for (const memberId of memberIds) {
      if (memberId === userId) continue; // Ikke send til seg selv
      
      try {
        // Pakk nøkkelen med metadata
        const keyPackage = {
          type: 'group-key',
          groupId,
          key: keyBase64,
          timestamp: Date.now(),
          sender: userId
        };
        
        // Krypter og send til medlemmet
        const result = await encryptFn(memberId, keyPackage);
        
        if (result) {
          successCount++;
        } else {
          errors.push(`Kunne ikke sende nøkkel til medlem: ${memberId}`);
        }
      } catch (error) {
        errors.push(`Feil ved sending av nøkkel til ${memberId}: ${error}`);
      }
    }
    
    return {
      success: successCount > 0,
      errors
    };
  } catch (error) {
    errors.push(`Generell feil ved distribusjon av gruppenøkkel: ${error}`);
    return {
      success: false,
      errors
    };
  }
}

// --------------------------------
// Testingsverktøy for kryptering
// --------------------------------

/**
 * Test kryptering og dekryptering mellom to brukere
 * @param userId1 Første bruker-ID
 * @param userId2 Andre bruker-ID
 * @param message Melding som skal testes
 * @returns Testresultat med suksess/feil og tidsmåling
 */
export async function testPeerEncryption(
  userId1: string,
  userId2: string,
  message: any = { text: "Test melding", timestamp: Date.now() }
): Promise<{
  success: boolean;
  encryptTime: number;
  decryptTime: number;
  originalSize: number;
  encryptedSize: number;
  message: any;
  error?: string;
}> {
  try {
    const startEncrypt = performance.now();
    const encrypted = await encryptMessage(userId1, userId2, message);
    const encryptTime = performance.now() - startEncrypt;
    
    const startDecrypt = performance.now();
    const decrypted = await decryptMessage(userId2, userId1, encrypted);
    const decryptTime = performance.now() - startDecrypt;
    
    const originalSize = JSON.stringify(message).length;
    const encryptedSize = encrypted.length;
    
    const success = JSON.stringify(message) === JSON.stringify(decrypted);
    
    return {
      success,
      encryptTime,
      decryptTime,
      originalSize,
      encryptedSize,
      message: decrypted
    };
  } catch (error) {
    return {
      success: false,
      encryptTime: 0,
      decryptTime: 0,
      originalSize: JSON.stringify(message).length,
      encryptedSize: 0,
      message: null,
      error: String(error)
    };
  }
}

/**
 * Test gruppekryptering for flere brukere
 * @param groupId Gruppe-ID
 * @param message Melding som skal testes
 * @returns Testresultat med suksess/feil og tidsmåling
 */
export async function testGroupEncryption(
  groupId: string,
  message: any = { text: "Test gruppemelding", timestamp: Date.now() }
): Promise<{
  success: boolean;
  encryptTime: number;
  decryptTime: number;
  originalSize: number;
  encryptedSize: number;
  message: any;
  error?: string;
}> {
  try {
    // Generer en ny gruppenøkkel for testing
    await generateGroupKey(groupId, `test-${Date.now()}`);
    const keyBase64 = await exportGroupKey(groupId, `test-${Date.now()}`);
    
    const startEncrypt = performance.now();
    const encrypted = await encryptGroupMessage(groupId, message, keyBase64);
    const encryptTime = performance.now() - startEncrypt;
    
    const startDecrypt = performance.now();
    const decrypted = await decryptGroupMessage(groupId, encrypted, keyBase64);
    const decryptTime = performance.now() - startDecrypt;
    
    const originalSize = JSON.stringify(message).length;
    const encryptedSize = encrypted.length;
    
    const success = JSON.stringify(message) === JSON.stringify(decrypted);
    
    return {
      success,
      encryptTime,
      decryptTime,
      originalSize,
      encryptedSize,
      message: decrypted
    };
  } catch (error) {
    return {
      success: false,
      encryptTime: 0,
      decryptTime: 0,
      originalSize: JSON.stringify(message).length,
      encryptedSize: 0,
      message: null,
      error: String(error)
    };
  }
}

/**
 * Kjør en omfattende krypteringstest for å verifisere at alt fungerer
 * @returns Testresultater
 */
export async function runE2EETests(): Promise<{
  peerToPeerTest: any;
  groupTest: any;
  keyCacheSize: number;
  browserSupport: {
    webCrypto: boolean;
    subtleCrypto: boolean;
    randomValues: boolean;
  };
  featureSupport: {
    aesGcm: boolean;
    sha256: boolean;
    localStorage: boolean;
  };
}> {
  // Test peer-to-peer kryptering
  const peerToPeerTest = await testPeerEncryption(
    'test-user-1',
    'test-user-2',
    { text: "Dette er en testmelding", data: { num: 123, bool: true }, timestamp: Date.now() }
  );
  
  // Test gruppekryptering
  const groupTest = await testGroupEncryption(
    'test-group-1',
    { text: "Dette er en gruppemelding", data: { participants: ['user1', 'user2', 'user3'] }, timestamp: Date.now() }
  );
  
  // Sjekk nøkkelcachens størrelse
  const keyCacheSize = keyCache.size;
  
  // Sjekk nettleserstøtte
  const browserSupport = {
    webCrypto: !!window.crypto,
    subtleCrypto: !!(window.crypto && window.crypto.subtle),
    randomValues: !!(window.crypto && typeof window.crypto.getRandomValues === 'function')
  };
  
  // Sjekk funksjonalitetsstøtte
  let aesGcm = false;
  let sha256 = false;
  
  if (browserSupport.subtleCrypto) {
    try {
      await window.crypto.subtle.digest('SHA-256', new Uint8Array([1, 2, 3]));
      sha256 = true;
    } catch (e) {}
    
    try {
      const testKey = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      aesGcm = !!testKey;
    } catch (e) {}
  }
  
  return {
    peerToPeerTest,
    groupTest,
    keyCacheSize,
    browserSupport,
    featureSupport: {
      aesGcm,
      sha256,
      localStorage: typeof localStorage !== 'undefined'
    }
  };
}
