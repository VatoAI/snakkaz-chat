// 🚀 CHAT FEATURE TYPES
export interface ChatRoom {
  id: string;
  name: string;
  type: "private" | "group" | "marketplace";
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  members: number;
  isOnline: boolean;
  isPinned: boolean;
  hasMarketplace: boolean;
  e2eeEnabled: boolean;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  seller: string;
  image: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  messageType: "text" | "image" | "file" | "voice" | "system";
  metadata?: Record<string, any>;
  replyTo?: string;
  editedAt?: Date;
  createdAt: Date;
}
