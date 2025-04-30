/**
 * Konfigurasjon for Snakkaz Business-funksjoner
 * Inspirert av Telegram Business
 */

export interface BusinessHours {
  monday?: { open: string; close: string } | 'closed';
  tuesday?: { open: string; close: string } | 'closed';
  wednesday?: { open: string; close: string } | 'closed';
  thursday?: { open: string; close: string } | 'closed';
  friday?: { open: string; close: string } | 'closed';
  saturday?: { open: string; close: string } | 'closed';
  sunday?: { open: string; close: string } | 'closed';
}

export interface BusinessLocation {
  address: string;
  city?: string;
  postalCode?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export interface QuickReply {
  id: string;
  name: string;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  stickerId?: string;
}

export interface BusinessConfig {
  /** Om business-funksjoner er aktivert */
  enabled: boolean;
  
  /** Premium status */
  isPremium: boolean;
  
  /** Virksomhetsnavn */
  businessName: string;
  
  /** Beskrivelse av virksomheten */
  description?: string;
  
  /** Logo eller profilbilde for virksomheten */
  logoUrl?: string;

  /** Om virksomheten er verifisert */
  verified?: boolean;
  
  /** Åpningstider */
  businessHours?: BusinessHours;
  
  /** Lokasjon */
  location?: BusinessLocation;
  
  /** Velkomstmelding for nye brukere */
  welcomeMessage?: {
    enabled: boolean;
    message: string;
    mediaUrl?: string;
    mediaType?: string;
    /** Periode i dager før samme bruker får velkomstmeldingen på nytt */
    repeatPeriod?: number;
  };
  
  /** Fraværsmelding */
  awayMessage?: {
    enabled: boolean;
    message: string;
    /** Om fraværsmeldingen skal sendes basert på åpningstider */
    useBusinessHours: boolean;
    /** Dato for start av fravær */
    startDate?: string;
    /** Dato for slutt av fravær */
    endDate?: string;
    /** Chatter som skal ekskluderes fra fraværsmelding */
    excludedChats: string[];
  };
  
  /** Forhåndsdefinerte raske svar */
  quickReplies?: QuickReply[];
  
  /** Om chatbot er aktivert */
  chatbotEnabled?: boolean;
  
  /** Chatbot konfigurasjon */
  chatbotConfig?: {
    botId: string;
    /** Chatter som chatboten kan aksessere */
    allowedChats: 'all' | 'new' | 'specific';
    /** Spesifikke chatter for chatboten */
    specificChats?: string[];
    /** Om chatboten skal ekskludere kontakter */
    excludeContacts: boolean;
  };
  
  /** Tilpasset startside for tomme chatter */
  startPage?: {
    enabled: boolean;
    title: string;
    description: string;
    imageUrl?: string;
    buttonText?: string;
    buttonAction?: 'sendMessage' | 'openWebsite' | 'call';
    buttonValue?: string;
  };
}

/**
 * Standard business-konfigurasjon
 */
export const defaultBusinessConfig: BusinessConfig = {
  enabled: false,
  isPremium: false,
  businessName: '',
  description: '',
  welcomeMessage: {
    enabled: false,
    message: 'Hei! Velkommen til vår chat. Hvordan kan vi hjelpe deg?',
    repeatPeriod: 30
  },
  awayMessage: {
    enabled: false,
    message: 'Takk for at du kontakter oss. Vi er for øyeblikket ikke tilgjengelige, men vil svare så snart som mulig.',
    useBusinessHours: true,
    excludedChats: []
  },
  quickReplies: [],
  chatbotEnabled: false,
  startPage: {
    enabled: false,
    title: 'Velkommen',
    description: 'Start en samtale med oss!',
    buttonText: 'Start samtale',
    buttonAction: 'sendMessage',
    buttonValue: 'Hei! Jeg har et spørsmål.'
  }
};

/**
 * Aktiv business-konfigurasjon for applikasjonen
 */
export let activeBusinessConfig: BusinessConfig = { 
  ...defaultBusinessConfig 
};

/**
 * Oppdater business-konfigurasjonen
 */
export function updateBusinessConfig(config: Partial<BusinessConfig>): BusinessConfig {
  activeBusinessConfig = {
    ...activeBusinessConfig,
    ...config
  };
  
  // Utløs en hendelse så andre komponenter vet om endringen
  window.dispatchEvent(new CustomEvent('business-config-change', { 
    detail: activeBusinessConfig 
  }));
  
  return activeBusinessConfig;
}

/**
 * Sjekk om business-funksjoner er aktivert
 */
export function isBusinessEnabled(): boolean {
  return activeBusinessConfig.enabled;
}

/**
 * Aktiverer business-modus
 */
export function enableBusiness(businessName: string): BusinessConfig {
  return updateBusinessConfig({
    enabled: true,
    businessName
  });
}

/**
 * Deaktiverer business-modus
 */
export function disableBusiness(): BusinessConfig {
  return updateBusinessConfig({
    enabled: false
  });
}