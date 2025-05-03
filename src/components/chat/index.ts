
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
// Export default imports as named exports
import ChatSidebar from './ChatSidebar';
export { ChatSidebar };
export { ChatTabs } from './ChatTabs';
import MessageBubble from './MessageBubble';
export { MessageBubble };

// Chat funksjonalitetskomponenter
export { ChatPresence } from './ChatPresence';
export { FriendsList } from './FriendsList';
export { PrivateChats } from './PrivateChats';

// Create basic placeholder for missing exports
export const ai = {};
export const groups = {};
export const security = {};
