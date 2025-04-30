/**
 * App-konfigurasjonsfil for Snakkaz Chat
 * Inneholder globale innstillinger og konfigurasjonsvariabler
 */

// Import miljøvariabler fra .env filer
const env = import.meta.env;

export interface AppConfig {
  appName: string;
  version: string;
  buildNumber: string;
  apiEndpoint: string;
  debugMode: boolean;
  sentryDsn?: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  maxFileSize: number;
  maxMessageLength: number;
  security: {
    defaultE2EE: boolean;
    enforcePinLock: boolean;
    pinLockTimeout: number;
    allowBiometrics: boolean;
    screenshotProtection: boolean;  // Ny sikkerhetsfunksjon: Skjermbildebeskyttelse
    preventScreenRecording: boolean; // Ny sikkerhetsfunksjon: Forhindre skjermopptak
    autoDeleteMessages: {
      enabled: boolean;
      defaultTimeout: number; // I timer
    };
    signalProtocolEnabled: boolean;
  };
  ui: {
    theme: 'light' | 'dark' | 'system';
    density: 'compact' | 'comfortable' | 'spacious';
    animations: boolean;
  };
}

/**
 * Standard app-konfigurasjon
 */
export const defaultConfig: AppConfig = {
  appName: 'Snakkaz',
  version: '1.0.0',
  buildNumber: '100',
  apiEndpoint: env.VITE_API_ENDPOINT || 'https://api.snakkaz.com',
  debugMode: env.VITE_DEBUG_MODE === 'true',
  sentryDsn: env.VITE_SENTRY_DSN,
  defaultLanguage: 'no',
  supportedLanguages: ['no', 'en', 'sv', 'da'],
  maxFileSize: 100 * 1024 * 1024, // 100 MB
  maxMessageLength: 10000, // 10 000 tegn
  security: {
    defaultE2EE: true,
    enforcePinLock: false,
    pinLockTimeout: 5, // I minutter
    allowBiometrics: true,
    screenshotProtection: false, // Deaktivert som standard
    preventScreenRecording: false, // Deaktivert som standard
    autoDeleteMessages: {
      enabled: false,
      defaultTimeout: 24 // 24 timer
    },
    signalProtocolEnabled: true // Bruker Signal Protocol for kryptering
  },
  ui: {
    theme: 'system',
    density: 'comfortable',
    animations: true
  }
};

/**
 * Aktiv app-konfigurasjon (kan endres runtime)
 */
export let activeConfig: AppConfig = { ...defaultConfig };

/**
 * Oppdater app-konfigurasjonen
 * @param updates Delvise oppdateringer til konfigurasjonen
 */
export function updateConfig(updates: Partial<AppConfig>): void {
  activeConfig = {
    ...activeConfig,
    ...updates,
    // Sikre at nøstede objekter også slås sammen riktig
    security: {
      ...activeConfig.security,
      ...updates.security,
      autoDeleteMessages: {
        ...activeConfig.security.autoDeleteMessages,
        ...updates.security?.autoDeleteMessages
      }
    },
    ui: {
      ...activeConfig.ui,
      ...updates.ui
    }
  };

  // Utløs en hendelse for å varsle andre komponenter om endringen
  const event = new CustomEvent('app-config-updated', { detail: activeConfig });
  window.dispatchEvent(event);
}

/**
 * Hent gjeldende app-konfigurasjon
 */
export function getConfig(): AppConfig {
  return activeConfig;
}

/**
 * Sjekk om en funksjon er aktivert basert på konfigurasjon
 * @param feature Navnet på funksjonen som skal sjekkes
 */
export function isFeatureEnabled(feature: string): boolean {
  switch (feature) {
    case 'e2ee':
      return activeConfig.security.defaultE2EE;
    case 'pinLock':
      return activeConfig.security.enforcePinLock;
    case 'biometrics':
      return activeConfig.security.allowBiometrics;
    case 'screenshots':
      return !activeConfig.security.screenshotProtection; // Inverter verdien siden vi sjekker om de er tillatt
    case 'screenRecording':
      return !activeConfig.security.preventScreenRecording; // Inverter verdien siden vi sjekker om det er tillatt
    case 'autoDelete':
      return activeConfig.security.autoDeleteMessages.enabled;
    default:
      return false;
  }
}