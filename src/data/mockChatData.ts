export interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  type: "text" | "image" | "file";
}

// Simple mock data for production build
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Du",
    avatar: "👤",
  },
  {
    id: "2",
    name: "SnakkaZ AI",
    avatar: "🤖",
  },
];

export const mockMessages: Message[] = [
  {
    id: "1",
    userId: "2",
    content: "Velkommen til SnakkaZ! Hvordan kan jeg hjelpe deg i dag?",
    timestamp: new Date(),
    type: "text",
  },
  {
    id: "2",
    userId: "1",
    content: "Hei! Jeg vil gjerne teste chatfunksjonen.",
    timestamp: new Date(),
    type: "text",
  },
];
