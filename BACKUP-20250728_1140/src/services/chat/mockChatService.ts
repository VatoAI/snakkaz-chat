/**
 * 🌊 Liquid Dream Mock Data Service
 * Temporary service to show beautiful liquid design while DB is being fixed
 */

export interface MockChatRoom {
  id: string;
  name: string;
  description?: string;
  type: "public" | "private" | "group";
  created_by?: string;
  created_at: string;
  is_active: boolean;
  max_participants: number;
  participant_count: number;
}

export interface MockMessage {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  message_type: "text" | "image" | "file" | "system";
  created_at: string;
  user?: {
    email: string;
  };
}

export interface MockUserProfile {
  id: string;
  email: string;
  username: string;
  display_name: string;
  avatar_url?: string;
}

export const mockRooms: MockChatRoom[] = [
  {
    id: "room-1",
    name: "General 🌊",
    description: "Hovedrom for generell diskusjon med liquid design",
    type: "public",
    created_at: new Date().toISOString(),
    is_active: true,
    max_participants: 100,
    participant_count: 42,
  },
  {
    id: "room-2",
    name: "Tech Talk 💻",
    description: "Tekniske diskusjoner og utvikling",
    type: "public",
    created_at: new Date().toISOString(),
    is_active: true,
    max_participants: 50,
    participant_count: 23,
  },
  {
    id: "room-3",
    name: "Liquid Design 🎨",
    description: "Design diskusjoner med crystal blue aesthetics",
    type: "public",
    created_at: new Date().toISOString(),
    is_active: true,
    max_participants: 30,
    participant_count: 15,
  },
  {
    id: "room-4",
    name: "Random 🎲",
    description: "Tilfeldig chat og moro",
    type: "public",
    created_at: new Date().toISOString(),
    is_active: true,
    max_participants: 200,
    participant_count: 87,
  },
  {
    id: "group-1",
    name: "Dev Team 👥",
    description: "Private gruppe for utviklere",
    type: "group",
    created_at: new Date().toISOString(),
    is_active: true,
    max_participants: 10,
    participant_count: 5,
  },
];

export const mockMessages: MockMessage[] = [
  {
    id: "msg-1",
    room_id: "room-1",
    user_id: "user-1",
    content: "Velkommen til SnakkaZ Liquid Dream chat! 🌊✨",
    message_type: "text",
    created_at: new Date(Date.now() - 60000).toISOString(),
    user: { email: "admin@snakkaz.com" },
  },
  {
    id: "msg-2",
    room_id: "room-1",
    user_id: "user-2",
    content: "Wow, denne liquid designen er utrolig vakker! 💎",
    message_type: "text",
    created_at: new Date(Date.now() - 30000).toISOString(),
    user: { email: "designer@snakkaz.com" },
  },
  {
    id: "msg-3",
    room_id: "room-2",
    user_id: "user-3",
    content: "Crystal blue og cyan fargene er perfekte! 🔵",
    message_type: "text",
    created_at: new Date(Date.now() - 15000).toISOString(),
    user: { email: "developer@snakkaz.com" },
  },
  {
    id: "msg-4",
    room_id: "room-3",
    user_id: "user-4",
    content: "Glassmorphism effects fungerer fantastisk i denne chatten! 🌊",
    message_type: "text",
    created_at: new Date().toISOString(),
    user: { email: "ux@snakkaz.com" },
  },
];

export const mockOnlineUsers: MockUserProfile[] = [
  {
    id: "user-1",
    email: "admin@snakkaz.com",
    username: "admin",
    display_name: "Admin 🌊",
  },
  {
    id: "user-2",
    email: "designer@snakkaz.com",
    username: "designer",
    display_name: "Designer 🎨",
  },
  {
    id: "user-3",
    email: "developer@snakkaz.com",
    username: "developer",
    display_name: "Developer 💻",
  },
  {
    id: "user-4",
    email: "ux@snakkaz.com",
    username: "ux",
    display_name: "UX Expert ✨",
  },
];

export class MockChatService {
  static async getRooms(): Promise<MockChatRoom[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockRooms;
  }

  static async getMessages(roomId: string): Promise<MockMessage[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return mockMessages.filter((msg) => msg.room_id === roomId);
  }

  static async getOnlineUsers(): Promise<MockUserProfile[]> {
    await new Promise((resolve) => setTimeout(resolve, 30));
    return mockOnlineUsers;
  }

  static async sendMessage(
    roomId: string,
    content: string,
    userId: string
  ): Promise<MockMessage> {
    const newMessage: MockMessage = {
      id: `msg-${Date.now()}`,
      room_id: roomId,
      user_id: userId,
      content,
      message_type: "text",
      created_at: new Date().toISOString(),
      user: { email: "stianpm@gmail.com" },
    };

    mockMessages.push(newMessage);
    return newMessage;
  }
}
