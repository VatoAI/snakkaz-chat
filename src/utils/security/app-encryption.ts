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
  version?: number;  // Versjon av krypteringsalgoritmen, for framtidig nøkkelrotasjon
}

// Standardinnstillinger for rask og sikker kryptering
const DEFAULT_ENCRYPTION_ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256; // AES-256
const PBKDF2_ITERATIONS = 100000; // Høy verdi gir bedre sikkerhet, men tregere ytelse
const CURRENT_ENCRYPTION_VERSION = 1; // For nøkkelrotasjon

/**
 * Cache-konfigurasjon for mobile enheter
 */
interface CacheConfig {
  maxCacheSize: number;   // Maksimum antall nøkler i cache
  cacheTTL: number;       // Cache-levetid i millisekunder
}

const DEFAULT_CACHE_CONFIG: CacheConfig = {
  maxCacheSize: 10,       // Cache for de 10 mest brukte kontekstene
  cacheTTL: 1000 * 60 * 30 // 30 minutters levetid
};

/**
 * Håndterer kryptering på app-nivå for å beskytte all brukerdata
 */
export class AppEncryption {
  private masterKey: CryptoKey | null = null;
  private derivedKeys: Map<string, CryptoKey> = new Map();
  private isInitialized: boolean = false;
  private keyCache: Map<string, {key: CryptoKey, timestamp: number}> = new Map();
  private cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG;
  private keyVersion: number = CURRENT_ENCRYPTION_VERSION;
  
  /**
   * Initialiserer krypteringsbiblioteket
   * @param secret En hemmelig streng (f.eks. brukerens PIN eller en app-hemmelighet)
   * @param salt Salt for nøkkelavledning - kan være hardkodet i appen
   * @param cacheConfig Valgfri cache-konfigurasjon for ytelsesoptimalisering
   */
  async initialize(
    secret: string, 
    salt: string, 
    cacheConfig?: Partial<CacheConfig>
  ): Promise<boolean> {
    try {
      // Sett cache-konfigurasjon hvis spesifisert
      if (cacheConfig) {
        this.cacheConfig = { ...this.cacheConfig, ...cacheConfig };
      }
      
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
        iv: bufferToBase64(iv),
        version: this.keyVersion // Inkluder versjonsnummer for fremtidig nøkkelrotasjon
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
      // Velg riktig nøkkel basert på versjon hvis tilgjengelig
      const key = await this.getDerivedKeyForContext(context, encryptedData.version);
      
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
   * Avleder en kontekstspesifikk nøkkel fra masternøkkelen med cache-støtte
   * Dette isolerer ulike deler av appen, slik at en kompromittert nøkkel
   * kun gjelder for den spesifikke konteksten
   */
  private async getDerivedKeyForContext(context: string, version?: number): Promise<CryptoKey> {
    if (!this.masterKey) {
      throw new Error('Master-nøkkel er ikke initialisert');
    }
    
    const keyVersion = version || this.keyVersion;
    const cacheKey = `${context}-v${keyVersion}`;
    
    // Sjekk om vi har en gyldig nøkkel i cache
    const now = Date.now();
    const cachedItem = this.keyCache.get(cacheKey);
    
    if (cachedItem && (now - cachedItem.timestamp < this.cacheConfig.cacheTTL)) {
      // Oppdater timestamp for å markere nylig bruk
      cachedItem.timestamp = now;
      return cachedItem.key;
    }
    
    // Gjenbruk eksisterende nøkkel hvis den finnes og ikke er i cache
    if (this.derivedKeys.has(cacheKey)) {
      const key = this.derivedKeys.get(cacheKey)!;
      
      // Legg nøkkelen i cache
      this.updateKeyCache(cacheKey, key);
      return key;
    }
    
    // Avled en kontekstspesifikk nøkkel
    const salt = new TextEncoder().encode(`snakkaz-${context}-salt-v${keyVersion}`);
    const info = new TextEncoder().encode(`snakkaz-${context}-info-v${keyVersion}`);
    
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
      this.derivedKeys.set(cacheKey, derivedKey);
      
      // Legg nøkkelen i cache
      this.updateKeyCache(cacheKey, derivedKey);
      
      return derivedKey;
    } catch (error) {
      console.error('Feil ved avledning av nøkkel:', error);
      throw new Error('Kunne ikke avlede nøkkel for kontekst');
    }
  }
  
  /**
   * Oppdaterer nøkkelcachen med en ny nøkkel
   * Fjerner den eldste nøkkelen hvis cachen er full
   */
  private updateKeyCache(cacheKey: string, key: CryptoKey): void {
    const now = Date.now();
    
    // Sjekk om cachen er full
    if (this.keyCache.size >= this.cacheConfig.maxCacheSize) {
      // Finn og fjern den eldste oppføringen
      let oldestKey: string | null = null;
      let oldestTime = Infinity;
      
      for (const [key, value] of this.keyCache.entries()) {
        if (value.timestamp < oldestTime) {
          oldestTime = value.timestamp;
          oldestKey = key;
        }
      }
      
      if (oldestKey) {
        this.keyCache.delete(oldestKey);
      }
    }
    
    // Legg til den nye nøkkelen i cachen
    this.keyCache.set(cacheKey, { key, timestamp: now });
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
  
  /**
   * Roterer krypteringsnøkkelen til en ny versjon
   * Dette er nyttig for å forbedre sikkerheten over tid
   * eller når en nøkkel kan ha blitt kompromittert
   * 
   * @param rekeyAllData Funksjon som håndterer rekryptering av eksisterende data
   * @returns Den nye nøkkelversjonen
   */
  async rotateEncryptionKey(
    rekeyAllData?: (oldVersion: number, newVersion: number) => Promise<void>
  ): Promise<number> {
    if (!this.masterKey) {
      throw new Error('Master-nøkkel er ikke initialisert');
    }
    
    const oldVersion = this.keyVersion;
    this.keyVersion = oldVersion + 1;
    
    // Tøm cache og avledede nøkler for å tvinge ny generering
    this.keyCache.clear();
    
    // Hvis rekryptering av data er påkrevd, kjør den innsendte funksjonen
    if (rekeyAllData) {
      try {
        await rekeyAllData(oldVersion, this.keyVersion);
      } catch (error) {
        // Ruller tilbake ved feil
        this.keyVersion = oldVersion;
        console.error('Feil ved nøkkelrotasjon:', error);
        throw new Error('Kunne ikke rotere krypteringsnøkkel');
      }
    }
    
    return this.keyVersion;
  }
  
  /**
   * Eksporterer sikkerhetskopi av krypteringsnøkler
   * Dette er kryptert med en separat sikkerhetskopieringsnøkkel
   * 
   * @param backupPassword Passord for å beskytte sikkerhetskopien
   * @returns Kryptert nøkkelsikkerhetskopi
   */
  async exportEncryptionKeyBackup(backupPassword: string): Promise<string> {
    if (!this.masterKey) {
      throw new Error('Master-nøkkel er ikke initialisert');
    }
    
    try {
      // Eksporter masternøkkelen
      const rawMasterKey = await window.crypto.subtle.exportKey('raw', this.masterKey);
      
      // Opprett en sikkerhetskopibuffer med metadata
      const backupData = {
        version: this.keyVersion,
        timestamp: Date.now(),
        masterKey: bufferToBase64(rawMasterKey)
      };
      
      // Krypter sikkerhetskopien med et separat passord
      const backupSalt = getRandomBytes(16);
      const backupKeyMaterial = await this.getKeyMaterial(backupPassword);
      
      const backupKey = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: backupSalt,
          iterations: 250000, // Ekstra høyt for sikkerhetskopier
          hash: 'SHA-256'
        },
        backupKeyMaterial,
        {
          name: DEFAULT_ENCRYPTION_ALGORITHM,
          length: KEY_LENGTH
        },
        false,
        ['encrypt']
      );
      
      // Krypter backup-dataene
      const iv = getRandomBytes(12);
      const backupJson = JSON.stringify(backupData);
      const backupBuffer = new TextEncoder().encode(backupJson);
      
      const encryptedBackup = await window.crypto.subtle.encrypt(
        {
          name: DEFAULT_ENCRYPTION_ALGORITHM,
          iv
        },
        backupKey,
        backupBuffer
      );
      
      // Pakk alt sammen i en JSON-struktur
      const fullBackup = {
        salt: bufferToBase64(backupSalt),
        iv: bufferToBase64(iv),
        data: bufferToBase64(encryptedBackup),
        format: 'snakkaz-key-backup-v1'
      };
      
      return JSON.stringify(fullBackup);
    } catch (error) {
      console.error('Feil ved eksport av nøkkelsikkerhetskopi:', error);
      throw new Error('Kunne ikke eksportere nøkkelsikkerhetskopi');
    }
  }
  
  /**
   * Importerer en sikkerhetskopi av krypteringsnøkler
   * 
   * @param backupData Den krypterte sikkerhetskopien
   * @param backupPassword Passordet som ble brukt for å beskytte sikkerhetskopien
   * @returns Om importen var vellykket
   */
  async importEncryptionKeyBackup(backupData: string, backupPassword: string): Promise<boolean> {
    try {
      // Parse sikkerhetskopien
      const fullBackup = JSON.parse(backupData);
      
      if (fullBackup.format !== 'snakkaz-key-backup-v1') {
        throw new Error('Ugyldig sikkerhetskopieringsformat');
      }
      
      const backupSalt = base64ToBuffer(fullBackup.salt);
      const iv = base64ToBuffer(fullBackup.iv);
      const encryptedBackup = base64ToBuffer(fullBackup.data);
      
      // Generer nøkkel fra sikkerhetskopipassordet
      const backupKeyMaterial = await this.getKeyMaterial(backupPassword);
      const backupKey = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: backupSalt,
          iterations: 250000,
          hash: 'SHA-256'
        },
        backupKeyMaterial,
        {
          name: DEFAULT_ENCRYPTION_ALGORITHM,
          length: KEY_LENGTH
        },
        false,
        ['decrypt']
      );
      
      // Dekrypter sikkerhetskopien
      const decryptedBackup = await window.crypto.subtle.decrypt(
        {
          name: DEFAULT_ENCRYPTION_ALGORITHM,
          iv
        },
        backupKey,
        encryptedBackup
      );
      
      const backupJson = new TextDecoder().decode(decryptedBackup);
      const backupObject = JSON.parse(backupJson);
      
      // Importer masternøkkelen
      const rawMasterKey = base64ToBuffer(backupObject.masterKey);
      
      this.masterKey = await window.crypto.subtle.importKey(
        'raw',
        rawMasterKey,
        {
          name: DEFAULT_ENCRYPTION_ALGORITHM,
          length: KEY_LENGTH
        },
        false,
        ['encrypt', 'decrypt']
      );
      
      // Oppdater nøkkelversjonen
      this.keyVersion = backupObject.version;
      
      // Tøm cache og avledede nøkler
      this.keyCache.clear();
      this.derivedKeys.clear();
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Feil ved import av nøkkelsikkerhetskopi:', error);
      return false;
    }
  }
  
  /**
   * Forbedrer ytelse på mobilenheter ved å forhåndsgenerere og cache nøkler
   * for kontekster som brukes ofte
   * 
   * @param contexts Liste over kontekster som skal forhåndsgenereres
   */
  async preloadContextKeys(contexts: string[]): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('App-kryptering er ikke initialisert');
    }
    
    try {
      // For hver kontekst, generer nøkkelen og cache den
      const uniqueContexts = [...new Set(contexts)];
      await Promise.all(uniqueContexts.map(async (context) => {
        await this.getDerivedKeyForContext(context);
      }));
      
      console.log(`Forhåndslastet nøkler for ${uniqueContexts.length} kontekster`);
    } catch (error) {
      console.error('Feil ved forhåndslasting av nøkler:', error);
    }
  }
  
  /**
   * Renser alle krypteringsdata fra minnet
   * Dette bør kalles ved utlogging eller når appen går i bakgrunnen
   * for å minimere risikoen for at krypteringsdata blir tilgjengelig
   * for ondsinnede aktører
   */
  clearEncryptionData(): void {
    // Nullstill masternøkkel
    this.masterKey = null;
    
    // Tøm alle deriverte nøkler
    this.derivedKeys.clear();
    
    // Tøm nøkkelcachen
    this.keyCache.clear();
    
    // Marker som ikke-initialisert
    this.isInitialized = false;
    
    // Kjør garbage collection hvis tilgjengelig (kun for debug)
    if (typeof global !== 'undefined' && global.gc) {
      try {
        global.gc();
      } catch (e) {
        console.log('Kunne ikke tvinge fram garbage collection');
      }
    }
  }
  
  /**
   * Verifiserer integriteten til en krypteringsnøkkel ved å utføre en test
   * av kryptering og dekryptering med den gitte konteksten
   * 
   * @param context Konteksten som skal verifiseres
   * @returns true hvis nøkkelen er intakt og fungerer
   */
  async verifyKeyIntegrity(context: string = 'default'): Promise<boolean> {
    if (!this.isInitialized) {
      return false;
    }
    
    try {
      // Generer testdata
      const testData = "snakkaz-integrity-check";
      
      // Forsøk å kryptere og dekryptere
      const encrypted = await this.encrypt(testData, context);
      const decrypted = await this.decrypt(encrypted, context, true);
      
      // Verifiser at resultatet matcher original
      return decrypted === testData;
    } catch (error) {
      console.error(`Integritetskontroll mislyktes for kontekst '${context}':`, error);
      return false;
    }
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