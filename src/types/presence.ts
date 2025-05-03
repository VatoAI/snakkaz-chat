// Define user status types for online presence
export type UserStatus = 'online' | 'away' | 'busy' | 'offline' | 'invisible';

// User presence interface with comprehensive information
export interface UserPresence {
  userId: string;
  status: UserStatus;
  lastSeen?: string | Date;
  lastActivity?: string;
  isTyping?: boolean;
  typingIn?: string; // chat/group ID where user is typing
  customStatus?: string;
  deviceInfo?: {
    platform: string;
    browser?: string;
    app?: string;
    version?: string;
  };
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
}

// User presence update payload (subset of UserPresence)
export interface UserPresenceUpdate {
  status?: UserStatus;
  lastActivity?: string;
  isTyping?: boolean;
  typingIn?: string;
  customStatus?: string;
}

// Presence service response
export interface PresenceResponse {
  users: UserPresence[];
  timestamp: string;
}

// Helper functions for presence
export const getUserStatusDisplay = (status: UserStatus): string => {
  switch (status) {
    case 'online':
      return 'Pålogget';
    case 'away':
      return 'Borte';
    case 'busy':
      return 'Opptatt';
    case 'offline':
      return 'Avlogget';
    case 'invisible':
      return 'Usynlig';
    default:
      return 'Ukjent';
  }
};

export const getStatusColor = (status: UserStatus): string => {
  switch (status) {
    case 'online':
      return 'text-green-500';
    case 'away':
      return 'text-amber-500';
    case 'busy':
      return 'text-red-500';
    case 'offline':
    case 'invisible':
    default:
      return 'text-gray-500';
  }
};
