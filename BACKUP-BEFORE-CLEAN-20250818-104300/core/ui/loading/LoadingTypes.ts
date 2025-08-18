// 🚀 SNAKKAZ UNIFIED LOADING TYPES
// Alle loading states samlet på ett sted

export type LoadingType =
  | "app-startup" // Full app initialisering
  | "auth-login" // Login prosess
  | "auth-register" // Registrering
  | "chat-loading" // Chat initialisering
  | "message-sending" // Sender melding
  | "file-upload" // Fil opplasting
  | "page-transition" // Side overgang
  | "data-fetching" // Generell data henting
  | "inline"; // Inline loading (small)

export interface LoadingState {
  type: LoadingType;
  message: string;
  progress?: number;
  isVisible: boolean;
  duration?: number;
}

export interface LoadingConfig {
  type: LoadingType;
  message?: string;
  showProgress?: boolean;
  autoHide?: boolean;
  duration?: number;
}

// 🎯 DEFAULT MESSAGES FOR EACH TYPE
export const LOADING_MESSAGES: Record<LoadingType, string> = {
  "app-startup": "Krypterer forbindelse...",
  "auth-login": "Autentiserer bruker...",
  "auth-register": "Oppretter konto...",
  "chat-loading": "SnakkaZ forbereder chat opplevelse...",
  "message-sending": "Sender melding...",
  "file-upload": "Laster opp fil...",
  "page-transition": "Navigerer til SnakkaZ...",
  "data-fetching": "Henter SnakkaZ data...",
  inline: "Laster...",
};

// 🎨 LOADING STYLES FOR EACH TYPE
export const LOADING_STYLES: Record<
  LoadingType,
  {
    fullScreen: boolean;
    showMatrix: boolean;
    size: "sm" | "md" | "lg";
    duration: number;
  }
> = {
  "app-startup": {
    fullScreen: true,
    showMatrix: true,
    size: "lg",
    duration: 2000,
  },
  "auth-login": {
    fullScreen: true,
    showMatrix: true,
    size: "md",
    duration: 1500,
  },
  "auth-register": {
    fullScreen: true,
    showMatrix: true,
    size: "md",
    duration: 2000,
  },
  "chat-loading": {
    fullScreen: false,
    showMatrix: true,
    size: "md",
    duration: 1000,
  },
  "message-sending": {
    fullScreen: false,
    showMatrix: false,
    size: "sm",
    duration: 500,
  },
  "file-upload": {
    fullScreen: false,
    showMatrix: true,
    size: "md",
    duration: 0,
  },
  "page-transition": {
    fullScreen: true,
    showMatrix: true,
    size: "md",
    duration: 800,
  },
  "data-fetching": {
    fullScreen: false,
    showMatrix: false,
    size: "sm",
    duration: 1000,
  },
  inline: { fullScreen: false, showMatrix: false, size: "sm", duration: 0 },
};
