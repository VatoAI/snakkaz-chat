/**
 * AnonymityManager
 * 
 * Håndterer personvern og anonymitetsinnstillinger i appen
 * Implementerer "privacy by default" og "minimum viable data collection"
 */

import { v4 as uuidv4 } from 'uuid';
import { getAppEncryption } from './app-encryption';
import { getRandomBytes } from './crypto-utils';

// Type definisjon for brukeridentifikatorer
interface AnonymousIdentifiers {
  publicId: string;       // Offentlig ID som brukes i meldinger (generert)
  tempId: string;         // Midlertidig ID for økten (roteres regelmessig)
  displayName: string;    // Visningsnavn (kan være pseudonym)
}

// Type definisjon for personverninnstillinger
interface PrivacySettings {
  allowReadReceipts: boolean;      // Tillat lesebekreftelser
  allowTypingIndicator: boolean;   // Tillat skriveindikatorer
  allowPushNotifications: boolean; // Tillat pushvarsler
  allowDataCollection: boolean;    // Tillat anonym datanalyse
  messageTTL: number;              // Tid i sekunder før meldinger slettes automatisk
  maskIP: boolean;                 // Masker IP-adresse via proxy
  useStrictE2EE: boolean;          // Bruk strengeste E2EE-modus (ingen mellomlagring)
}

/**
 * AnonymityManager for brukerpersonvern og anonymitet
 */
export class AnonymityManager {
  private identifiers: AnonymousIdentifiers | null = null;
  private privacySettings: PrivacySettings;
  private idRotationInterval: number | null = null;
  private appEncryption = getAppEncryption();
  
  constructor() {
    // Standard personverninnstillinger (privacy by default)
    this.privacySettings = {
      allowReadReceipts: false,
      allowTypingIndicator: false,
      allowPushNotifications: true,
      allowDataCollection: false,
      messageTTL: 7 * 24 * 60 * 60, // 7 dager som standard
      maskIP: true,
      useStrictE2EE: true
    };
  }
  
  /**
   * Initialiserer anonymitetsmanager med brukerens innstillinger
   */
  async initialize(storedSettings?: string, displayName?: string): Promise<void> {
    try {
      // Generer eller gjenopprett identifikatorer
      this.identifiers = {
        publicId: this.generateOrRestorePublicId(),
        tempId: this.generateTempId(),
        displayName: displayName || this.generateRandomName()
      };
      
      // Gjenopprett lagrede innstillinger hvis de finnes
      if (storedSettings && this.appEncryption.isReady()) {
        try {
          const decryptedSettings = await this.appEncryption.decrypt(
            JSON.parse(storedSettings),
            'privacy-settings'
          ) as string;
          this.privacySettings = { ...this.privacySettings, ...JSON.parse(decryptedSettings) };
        } catch (error) {
          console.warn('Kunne ikke gjenopprette personverninnstillinger, bruker standardverdier');
        }
      }
      
      // Start automatisk ID-rotering hvis aktivert
      this.startIdRotation();
    } catch (error) {
      console.error('Feil ved initialisering av anonymitetshåndtering:', error);
    }
  }
  
  /**
   * Lagrer personverninnstillinger kryptert
   */
  async saveSettings(): Promise<string | null> {
    if (!this.appEncryption.isReady()) {
      console.error('App-kryptering ikke initialisert');
      return null;
    }
    
    try {
      const settingsData = JSON.stringify(this.privacySettings);
      const encryptedSettings = await this.appEncryption.encrypt(
        settingsData,
        'privacy-settings'
      );
      
      return JSON.stringify(encryptedSettings);
    } catch (error) {
      console.error('Kunne ikke lagre personverninnstillinger:', error);
      return null;
    }
  }
  
  /**
   * Oppdaterer personverninnstillinger
   */
  updatePrivacySettings(newSettings: Partial<PrivacySettings>): void {
    this.privacySettings = { ...this.privacySettings, ...newSettings };
    this.saveSettings().catch(console.error);
  }
  
  /**
   * Henter gjeldende personverninnstillinger
   */
  getPrivacySettings(): PrivacySettings {
    return { ...this.privacySettings };
  }
  
  /**
   * Henter anonymisert bruker-ID for offentlig bruk
   */
  getPublicId(): string {
    return this.identifiers?.publicId || this.generateOrRestorePublicId();
  }
  
  /**
   * Henter gjeldende visningsnavn
   */
  getDisplayName(): string {
    return this.identifiers?.displayName || 'Anonym';
  }
  
  /**
   * Setter nytt visningsnavn
   */
  setDisplayName(name: string): void {
    if (this.identifiers) {
      this.identifiers.displayName = name;
    }
  }
  
  /**
   * Fjerner alle persondata og innstillinger
   */
  async clearAllData(): Promise<void> {
    // Stopp ID-rotering
    if (this.idRotationInterval !== null) {
      clearInterval(this.idRotationInterval);
      this.idRotationInterval = null;
    }
    
    // Tilbakestill innstillinger til standard
    this.privacySettings = {
      allowReadReceipts: false,
      allowTypingIndicator: false,
      allowPushNotifications: true,
      allowDataCollection: false,
      messageTTL: 7 * 24 * 60 * 60,
      maskIP: true,
      useStrictE2EE: true
    };
    
    // Tilbakestill identifikatorer
    this.identifiers = {
      publicId: this.generateOrRestorePublicId(true),
      tempId: this.generateTempId(),
      displayName: this.generateRandomName()
    };
    
    // Lagre nye innstillinger
    await this.saveSettings();
  }
  
  /**
   * Generer eller gjenopprett offentlig ID
   */
  private generateOrRestorePublicId(forceNew: boolean = false): string {
    const storedId = !forceNew ? localStorage.getItem('snakkaz-pubid') : null;
    
    if (storedId) {
      return storedId;
    }
    
    // Generer ny ID med UUID for å unngå kollisjoner
    const newId = uuidv4();
    localStorage.setItem('snakkaz-pubid', newId);
    return newId;
  }
  
  /**
   * Generer midlertidig ID for økten
   */
  private generateTempId(): string {
    // Generer en tilfeldig byte-array og konverter til hexadesimalt
    const randomBytes = getRandomBytes(16);
    return Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  
  /**
   * Starter automatisk ID-rotering for økt anonymitet
   */
  private startIdRotation(): void {
    // Roter midlertidig ID hvert 30. minutt
    this.idRotationInterval = window.setInterval(() => {
      if (this.identifiers) {
        this.identifiers.tempId = this.generateTempId();
      }
    }, 30 * 60 * 1000); // 30 minutter
  }
  
  /**
   * Genererer et tilfeldig pseudonym som visningsnavn
   */
  private generateRandomName(): string {
    const adjektiver = [
      'Rask', 'Stille', 'Modig', 'Klok', 'Mystisk', 'Leken',
      'Smart', 'Rolig', 'Lykkelig', 'Fri', 'Kreativ', 'Sterk'
    ];
    
    const substantiver = [
      'Ulv', 'Ørn', 'Tiger', 'Panda', 'Løve', 'Ravn',
      'Falk', 'Hjort', 'Bjørn', 'Rev', 'Elg', 'Ekorn'
    ];
    
    // Velg tilfeldig adjektiv og substantiv
    const adjektiv = adjektiver[Math.floor(Math.random() * adjektiver.length)];
    const substantiv = substantiver[Math.floor(Math.random() * substantiver.length)];
    
    // Legg til tilfeldige tall for å unngå kollisjoner
    const randomTall = Math.floor(Math.random() * 1000);
    
    return `${adjektiv}${substantiv}${randomTall}`;
  }
  
  /**
   * Lager anonymiserte analytiske data for sending til server
   * Garantert å ikke inneholde personidentifiserbar informasjon
   */
  getAnonymizedAnalytics(): object | null {
    // Ikke samle data hvis brukeren har slått det av
    if (!this.privacySettings.allowDataCollection) {
      return null;
    }
    
    // Samle bare anonyme data om enhetstype og bruksmønstre
    return {
      appVersion: '1.0.0', // App-versjon
      deviceType: this.getDeviceType(),
      sessionLength: this.getSessionLength(),
      features: {
        e2eeEnabled: this.privacySettings.useStrictE2EE,
        pushEnabled: this.privacySettings.allowPushNotifications,
        // Ingen brukeridentifikasjon
      },
      timestamp: new Date().toISOString(),
      // Unik, ikke-sporbar øktsidentifikator
      sessionId: this.identifiers?.tempId || 'unknown'
    };
  }
  
  /**
   * Forbereder en melding for sending i henhold til personverninnstillinger
   */
  prepareOutgoingMessage(content: string, metadata: any = {}): { content: string, metadata: any } {
    // Fjern metadata som ikke er tillatt
    const sanitizedMetadata = { ...metadata };
    
    // Fjern lesebekreftelser hvis ikke tillatt
    if (!this.privacySettings.allowReadReceipts) {
      delete sanitizedMetadata.readReceipt;
      delete sanitizedMetadata.deliveryStatus;
    }
    
    // Legg til TTL basert på personverninnstillinger
    if (this.privacySettings.messageTTL > 0) {
      sanitizedMetadata.expiresAt = new Date(
        Date.now() + this.privacySettings.messageTTL * 1000
      ).toISOString();
    }
    
    return {
      content,
      metadata: sanitizedMetadata
    };
  }
  
  /**
   * Anonymiserer brukerens IP-adresse hvis innstillingen er aktivert
   */
  shouldAnonymizeConnection(): boolean {
    return this.privacySettings.maskIP;
  }
  
  /**
   * Hjelpemetode for å få enhetstypen
   */
  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(userAgent)) {
      return 'ios';
    } else if (/Android/.test(userAgent)) {
      return 'android';
    } else if (/Windows/.test(userAgent)) {
      return 'windows';
    } else if (/Mac/.test(userAgent)) {
      return 'mac';
    } else if (/Linux/.test(userAgent)) {
      return 'linux';
    }
    return 'unknown';
  }
  
  /**
   * Beregner øktsvarighet siden innlasting av app
   */
  private getSessionLength(): number {
    // Assuming we store page load timestamp in localStorage
    const loadTime = localStorage.getItem('snakkaz-session-start');
    if (!loadTime) {
      const now = Date.now().toString();
      localStorage.setItem('snakkaz-session-start', now);
      return 0;
    }
    
    return Math.floor((Date.now() - parseInt(loadTime)) / 1000);
  }
}

// Singleton-instans
let instance: AnonymityManager | null = null;

// Eksporter en singleton-instans
export function getAnonymityManager(): AnonymityManager {
  if (!instance) {
    instance = new AnonymityManager();
  }
  return instance;
}

export default AnonymityManager;