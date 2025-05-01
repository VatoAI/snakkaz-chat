/**
 * Index-fil for eksport av chat-relaterte komponenter
 * Forenkler imports ved å samle alle eksporter på ett sted
 */

// Chat UI-komponenter
export { ChatInterface } from './ChatInterface';
export { ChatHeader } from './header/ChatHeader';
export { ChatInputField } from './ChatInputField';
export { ChatMessageList } from './ChatMessageList';
export { ChatMessage } from './ChatMessage';
export { ChatSidebar } from './ChatSidebar';
export { ChatTabs } from './ChatTabs';
export { MessageBubble } from './MessageBubble';

// Chat funksjonalitetskomponenter
export { ChatPresence } from './ChatPresence';
export { FriendsList } from './FriendsList';
export { PrivateChats } from './PrivateChats';

// AI-chat komponenter
export * from './ai';

// Gruppe-chat komponenter
export * from './groups';

// Sikkerhetsfunksjoner for chat
export * from './security';