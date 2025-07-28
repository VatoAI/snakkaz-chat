// SnakkaZ Beta V2 - Type Definitions

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: Date;
  isTyping?: boolean;
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  username: string;
  avatar: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  edited?: boolean;
  editedAt?: Date;
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'direct';
  participantCount: number;
  isActive: boolean;
  lastActivity: Date;
  unreadCount?: number;
  emoji?: string;
}

export interface ChatState {
  currentRoom: ChatRoom | null;
  messages: Message[];
  users: User[];
  rooms: ChatRoom[];
  isLoading: boolean;
  isConnected: boolean;
  typingUsers: string[];
}

export interface NotificationSettings {
  sound: boolean;
  desktop: boolean;
  mentions: boolean;
  directMessages: boolean;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  language: 'no' | 'en';
  notifications: NotificationSettings;
  compactMode: boolean;
  showAvatars: boolean;
  fontSize: 'small' | 'medium' | 'large';
}