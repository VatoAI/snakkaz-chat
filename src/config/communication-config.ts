/**
 * Kommunikasjons-konfigurasjon for Snakkaz Chat
 * 
 * Denne filen definerer innstillinger for hvordan meldinger skal sendes og mottas
 * gjennom applikasjonen, inkludert valg mellom P2P og server-basert kommunikasjon.
 */

/**
 * Tilgjengelige kommunikasjonsmetoder i applikasjonen
 */
export type CommunicationMethod = 'p2p' | 'server' | 'hybrid';

/**
 * Konfigurasjon for kommunikasjons-subsystemet
 */
export interface CommunicationConfig {
  /** Primær kommunikasjonsmetode */
  primaryMethod: CommunicationMethod;
  
  /** Om P2P-kommunikasjon er aktivert */
  enableP2P: boolean;
  
  /** Om server-basert kommunikasjon er aktivert */
  enableServer: boolean;
  
  /** Maksimalt antall forsøk på å koble til en peer via P2P */
  maxP2PReconnectAttempts: number;
  
  /** Om systemet skal falle tilbake til server hvis P2P feiler */
  fallbackToServer: boolean;
  
  /** Om kryptering skal brukes for server-meldinger */
  encryptServerMessages: boolean;
}

/**
 * Standard kommunikasjonskonfigurasjon for applikasjonen
 */
export const defaultCommunicationConfig: CommunicationConfig = {
  // Setter server som standard kommunikasjonsmetode
  primaryMethod: 'server',
  
  // Deaktiverer P2P som standard for å forenkle systemet
  enableP2P: false,
  
  // Server-kommunikasjon er alltid aktivert
  enableServer: true,
  
  // Standard antall forsøk på P2P-tilkobling hvis det er aktivert
  maxP2PReconnectAttempts: 3,
  
  // Faller alltid tilbake til server hvis P2P feiler
  fallbackToServer: true,
  
  // Kryptering av server-meldinger er aktivert som standard
  encryptServerMessages: true
};

/**
 * Aktiv kommunikasjonskonfigurasjon for applikasjonen.
 * Denne kan endres runtime basert på brukerpreferanser eller systemkrav.
 */
export let activeCommunicationConfig: CommunicationConfig = {
  ...defaultCommunicationConfig
};

/**
 * Oppdater den aktive kommunikasjonskonfigurasjonen
 * @param newConfig Ny konfigurasjon som skal anvendes
 */
export function updateCommunicationConfig(newConfig: Partial<CommunicationConfig>): CommunicationConfig {
  activeCommunicationConfig = {
    ...activeCommunicationConfig,
    ...newConfig
  };
  
  console.log('Kommunikasjonskonfigurasjon oppdatert:', activeCommunicationConfig);
  return activeCommunicationConfig;
}

/**
 * Sjekk om P2P-kommunikasjon er aktivert og tilgjengelig
 */
export function isP2PEnabled(): boolean {
  return activeCommunicationConfig.enableP2P;
}

/**
 * Sjekk om server-kommunikasjon er aktivert
 */
export function isServerEnabled(): boolean {
  return activeCommunicationConfig.enableServer;
}