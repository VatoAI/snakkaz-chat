/**
 * App-nivå krypteringsverktøy
 * 
 * Dette verktøyet sørger for at alle data som lagres lokalt eller synkroniseres
 * er beskyttet med sterk kryptering. Det fungerer som et lag over WebCrypto API
 * og er optimalisert for ytelse på mobile enheter.
 */

import { getRandomBytes } from './crypto-utils';

// Støtter både tekstdata og binærdata
type EncryptableData = string | ArrayBuffer;

// Krypteringsresultat
interface EncryptedData {
  ciphertext: string; // Base64-kodet kryptert data
  iv: string;        // Initialiseringsvektor (Base64)
  tag?: string;      // Autentiseringsmerke for GCM-modus (Base64)
}

// Standardinnstillinger for rask og sikker kryptering
const DEFAULT_ENCRYPTION_ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256; // AES-256
const PBKDF2_ITERATIONS = 100000; // Høy verdi gir bedre sikkerhet, men tregere ytelse

/**
 * Håndterer kryptering på app-nivå for å beskytte all brukerdata
 */
export class AppEncryption {
  private masterKey: CryptoKey | null = null;
  private derivedKeys: Map<string, CryptoKey> = new Map();
  private isInitialized: boolean = false;
  
  /**
   * Initialiserer krypteringsbiblioteket
   * @param secret En hemmelig streng (f.eks. brukerens PIN eller en app-hemmelighet)
   * @param salt Salt for nøkkelavledning - kan være hardkodet i appen
   */
  async initialize(secret: string, salt: string): Promise<boolean> {
    try {
      // Generer hovedmasternøkkel fra hemmelighet
      const keyMaterial = await this.getKeyMaterial(secret);
      
      // Salt bør være unikt for hver bruker, men konsistent mellom økter
      const saltBytes = new TextEncoder().encode(salt);
      
      // Generer masternøkkel med PBKDF2
      this.masterKey = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: saltBytes,
          iterations: PBKDF2_ITERATIONS,
          hash: 'SHA-256'
        },
        keyMaterial,
        {
          name: DEFAULT_ENCRYPTION_ALGORITHM,
          length: KEY_LENGTH
        },
        true, // kan eksporteres
        ['encrypt', 'decrypt']
      );
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Feil ved initialisering av app-kryptering:', error);
      return false;
    }
  }
  
  /**
   * Krypterer data med den spesifiserte nøkkelen (eller standard masternøkkel)
   * @param data Data som skal krypteres
   * @param context Kontekst for avledning av en spesifikk nøkkel (f.eks. 'meldinger', 'profil')
   * @returns Krypterte data med IV
   */
  async encrypt(data: EncryptableData, context: string = 'default'): Promise<EncryptedData> {
    if (!this.isInitialized) {
      throw new Error('App-kryptering er ikke initialisert');
    }
    
    try {
      const key = await this.getDerivedKeyForContext(context);
      const iv = getRandomBytes(12); // 12 bytes er standard for GCM
      
      // Konverter til riktig format for kryptering
      let dataToEncrypt: ArrayBuffer;
      if (typeof data === 'string') {
        dataToEncrypt = new TextEncoder().encode(data);
      } else {
        dataToEncrypt = data;
      }
      
      // Krypter med AES-GCM
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: DEFAULT_ENCRYPTION_ALGORITHM,
          iv
        },
        key,
        dataToEncrypt
      );
      
      // Konverter til Base64 for enkel lagring og overføring
      return {
        ciphertext: bufferToBase64(encryptedBuffer),
        iv: bufferToBase64(iv)
      };
    } catch (error) {
      console.error('Krypteringsfeil:', error);
      throw new Error('Kunne ikke kryptere data');
    }
  }
  
  /**
   * Dekrypterer data med den spesifiserte nøkkelen
   * @param encryptedData De krypterte dataene
   * @param context Kontekst som ble brukt under kryptering
   * @param asString Returnerer resultatet som streng hvis true, ellers som ArrayBuffer
   * @returns Dekryptert innhold
   */
  async decrypt(encryptedData: EncryptedData, context: string = 'default', asString: boolean = true): Promise<string | ArrayBuffer> {
    if (!this.isInitialized) {
      throw new Error('App-kryptering er ikke initialisert');
    }
    
    try {
      const key = await this.getDerivedKeyForContext(context);
      
      // Konverter fra Base64 til binærformater
      const encryptedBytes = base64ToBuffer(encryptedData.ciphertext);
      const iv = base64ToBuffer(encryptedData.iv);
      
      // Dekrypter med AES-GCM
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: DEFAULT_ENCRYPTION_ALGORITHM,
          iv
        },
        key,
        encryptedBytes
      );
      
      // Returner som streng eller binærdata basert på parameteren
      if (asString) {
        return new TextDecoder().decode(decryptedBuffer);
      } else {
        return decryptedBuffer;
      }
    } catch (error) {
      console.error('Dekrypteringsfeil:', error);
      throw new Error('Kunne ikke dekryptere data');
    }
  }
  
  /**
   * Avleder en kontekstspesifikk nøkkel fra masternøkkelen
   * Dette isolerer ulike deler av appen, slik at en kompromittert nøkkel
   * kun gjelder for den spesifikke konteksten
   */
  private async getDerivedKeyForContext(context: string): Promise<CryptoKey> {
    if (!this.masterKey) {
      throw new Error('Master-nøkkel er ikke initialisert');
    }
    
    // Gjenbruk eksisterende nøkkel hvis den finnes
    if (this.derivedKeys.has(context)) {
      return this.derivedKeys.get(context)!;
    }
    
    // Avled en kontekstspesifikk nøkkel
    const salt = new TextEncoder().encode(`snakkaz-${context}-salt`);
    const info = new TextEncoder().encode(`snakkaz-${context}-info`);
    
    try {
      // Bruk HKDF for å avlede en ny nøkkel
      const derivedKey = await window.crypto.subtle.deriveKey(
        {
          name: 'HKDF',
          hash: 'SHA-256',
          salt,
          info
        },
        this.masterKey,
        {
          name: DEFAULT_ENCRYPTION_ALGORITHM,
          length: KEY_LENGTH
        },
        false, // Avledede nøkler kan ikke eksporteres
        ['encrypt', 'decrypt']
      );
      
      // Lagre nøkkelen for fremtidig bruk
      this.derivedKeys.set(context, derivedKey);
      return derivedKey;
    } catch (error) {
      console.error('Feil ved avledning av nøkkel:', error);
      throw new Error('Kunne ikke avlede nøkkel for kontekst');
    }
  }
  
  /**
   * Generer nøkkelmateriale fra en hemmelighet
   */
  private async getKeyMaterial(secret: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    
    return await window.crypto.subtle.importKey(
      'raw',
      keyData,
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );
  }
  
  /**
   * Genererer et Argon2-lignende passordhasj
   * Merk: Bruker PBKDF2 siden Argon2 ikke er tilgjengelig i WebCrypto API
   * @param password Passordet som skal hashes
   * @param salt Salt (bør være random og unikt)
   */
  async hashPassword(password: string, salt: string): Promise<string> {
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    const saltData = encoder.encode(salt);
    
    // Importer passordet som nøkkel
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      passwordData,
      'PBKDF2',
      false,
      ['deriveBits']
    );
    
    // Derive bits using PBKDF2 with high iteration count
    const keyBits = await window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltData,
        iterations: 210000, // Høyere enn standardverdien for bedre sikkerhet
        hash: 'SHA-256'
      },
      keyMaterial,
      256 // 256 bit (32 byte) output
    );
    
    // Konverter til Base64 for lagring
    return bufferToBase64(keyBits);
  }
  
  /**
   * Verifiserer et passord mot et hasj
   * @param password Passordet som skal verifiseres
   * @param hash Det lagrede hasjet
   * @param salt Saltet som ble brukt for å generere hasjet
   */
  async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    try {
      const generatedHash = await this.hashPassword(password, salt);
      return generatedHash === hash;
    } catch (error) {
      console.error('Feil ved passordverifisering:', error);
      return false;
    }
  }
  
  /**
   * Genererer en sikker tilfeldig nøkkel for kryptering
   * @param length Lengde på nøkkelen i bytes
   */
  generateRandomKey(length: number = 32): Uint8Array {
    return getRandomBytes(length);
  }
  
  /**
   * Sjekker om krypteringsmotoren er initialisert
   */
  isReady(): boolean {
    return this.isInitialized;
  }
}

// Hjelpefunksjoner for Base64-konvertering
function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Singleton-instans
let instance: AppEncryption | null = null;

// Eksporter en singleton-instans
export function getAppEncryption(): AppEncryption {
  if (!instance) {
    instance = new AppEncryption();
  }
  return instance;
}

export default AppEncryption;