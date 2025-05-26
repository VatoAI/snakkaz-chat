# Chat Components Migration Plan

This document outlines the plan for migrating chat components to a feature-based structure.

## Component Categories

### Global Chat Components
- /workspaces/snakkaz-chat/src/components/chat/ChatGlobal.tsx
- /workspaces/snakkaz-chat/src/components/chat/global/GlobalChatContainer.tsx
- /workspaces/snakkaz-chat/src/components/chat/global/GlobalChatHeader.tsx
- /workspaces/snakkaz-chat/src/features/chat/components/ChatGlobal.tsx

### Private Chat Components
- /workspaces/snakkaz-chat/src/components/chat/private/PrivateChatsContainer.tsx
- /workspaces/snakkaz-chat/src/components/chat/private/PrivateChatsEmptyState.tsx
- /workspaces/snakkaz-chat/src/components/chat/private/PrivateChatActions.tsx
- /workspaces/snakkaz-chat/src/components/chat/private/PrivateChatDetailView.tsx
- /workspaces/snakkaz-chat/src/components/chat/private/PrivateChatsMainContent.tsx
- /workspaces/snakkaz-chat/src/components/chat/PrivateChats.tsx
- /workspaces/snakkaz-chat/src/components/chat/PrivateChat.tsx
- /workspaces/snakkaz-chat/src/components/chat/PrivateChatContainer.tsx
- /workspaces/snakkaz-chat/src/features/chat/components/PrivateChats.tsx
- /workspaces/snakkaz-chat/src/services/encryption/PrivateChat.tsx
- /workspaces/snakkaz-chat/src/services/encryption/PrivateChatContainer.tsx

### Group Chat Components
- /workspaces/snakkaz-chat/src/components/message/MessageGroupContent.tsx
- /workspaces/snakkaz-chat/src/components/message/MessageGroup.tsx
- /workspaces/snakkaz-chat/src/components/message/MessageGroups.tsx
- /workspaces/snakkaz-chat/src/components/chat/groups/GroupChatEmptyState.tsx
- /workspaces/snakkaz-chat/src/components/chat/groups/GroupMessageList.tsx
- /workspaces/snakkaz-chat/src/components/chat/groups/GroupChat.tsx
- /workspaces/snakkaz-chat/src/components/chat/groups/EnhancedGroupChat.tsx
- /workspaces/snakkaz-chat/src/components/chat/groups/GroupChatHeader.tsx
- /workspaces/snakkaz-chat/src/components/chat/private/GroupChatCreatorLoader.tsx
- /workspaces/snakkaz-chat/src/components/chat/group/GroupChatView.tsx
- /workspaces/snakkaz-chat/src/components/chat/security/GroupChatCreator.tsx
- /workspaces/snakkaz-chat/src/components/chat/GroupMessageList.tsx
- /workspaces/snakkaz-chat/src/features/chat/components/GroupMessageList.tsx
- /workspaces/snakkaz-chat/src/pages/GroupChatPage.tsx

### Interface Components
- /workspaces/snakkaz-chat/src/components/chat/direct-message/DirectMessageContainer.tsx
- /workspaces/snakkaz-chat/src/components/chat/friends/message/MessageContainer.tsx
- /workspaces/snakkaz-chat/src/components/chat/ChatInterface.tsx
- /workspaces/snakkaz-chat/src/components/chat/business/BusinessChatContainer.tsx
- /workspaces/snakkaz-chat/src/components/chat/AppChatInterface.tsx
- /workspaces/snakkaz-chat/src/components/mobile/MobileChatContainer.tsx
- /workspaces/snakkaz-chat/src/features/chat/components/ChatInterface.tsx
- /workspaces/snakkaz-chat/src/services/encryption/ChatInterface.tsx
- /workspaces/snakkaz-chat/src/pages/components/ChatInterface.tsx

### Common Components
- /workspaces/snakkaz-chat/src/components/MessageInput.tsx
- /workspaces/snakkaz-chat/src/components/message-list/MessageList.tsx
- /workspaces/snakkaz-chat/src/components/message-list/DeleteMessageHandler.tsx
- /workspaces/snakkaz-chat/src/components/emoji/MessageTextWithEmojis.tsx
- /workspaces/snakkaz-chat/src/components/message/message-item/MessageActionsMenu.tsx
- /workspaces/snakkaz-chat/src/components/message/message-item/MessageMetadata.tsx
- /workspaces/snakkaz-chat/src/components/message/message-item/MessageContentDisplay.tsx
- /workspaces/snakkaz-chat/src/components/message/MessageContent.tsx
- /workspaces/snakkaz-chat/src/components/message/DeleteMessageDialog.tsx
- /workspaces/snakkaz-chat/src/components/message/MessageActions.tsx
- /workspaces/snakkaz-chat/src/components/message/MessageTimer.tsx
- /workspaces/snakkaz-chat/src/components/message/SecureMediaMessage.tsx
- /workspaces/snakkaz-chat/src/components/message/MessageBubble.tsx
- /workspaces/snakkaz-chat/src/components/message/LoadMoreMessages.tsx
- /workspaces/snakkaz-chat/src/components/message/MessageListContent.tsx
- /workspaces/snakkaz-chat/src/components/message/AppMessageList.tsx
- /workspaces/snakkaz-chat/src/components/message/MessageMedia.tsx
- /workspaces/snakkaz-chat/src/components/message/MessageListHeader.tsx
- /workspaces/snakkaz-chat/src/components/message/AppMessage.tsx
- /workspaces/snakkaz-chat/src/components/message/MessageScrollArea.tsx
- /workspaces/snakkaz-chat/src/components/message/BurnOnReadMessage.tsx
- /workspaces/snakkaz-chat/src/components/chat/ChatMessageList.tsx
- /workspaces/snakkaz-chat/src/components/chat/ChatSidebar.tsx
- /workspaces/snakkaz-chat/src/components/chat/MessageInput.tsx
- /workspaces/snakkaz-chat/src/components/chat/ai/AIMessageList.tsx
- /workspaces/snakkaz-chat/src/components/chat/ChatDialogs.tsx
- /workspaces/snakkaz-chat/src/components/chat/SecureMessageViewer.tsx
- /workspaces/snakkaz-chat/src/components/chat/ChatInputField.tsx
- /workspaces/snakkaz-chat/src/components/chat/direct-message/DirectMessageContent.tsx
- /workspaces/snakkaz-chat/src/components/chat/direct-message/DirectMessageForm.tsx
- /workspaces/snakkaz-chat/src/components/chat/direct-message/DirectMessageHeader.tsx
- /workspaces/snakkaz-chat/src/components/chat/MessageSearch.tsx
- /workspaces/snakkaz-chat/src/components/chat/friends/DirectMessageForm.tsx
- /workspaces/snakkaz-chat/src/components/chat/friends/DirectMessageHeader.tsx
- /workspaces/snakkaz-chat/src/components/chat/friends/message/MessageItem.tsx
- /workspaces/snakkaz-chat/src/components/chat/friends/message/MessageSecurityBanner.tsx
- /workspaces/snakkaz-chat/src/components/chat/friends/message/MessageBodyContent.tsx
- /workspaces/snakkaz-chat/src/components/chat/friends/DirectMessage.tsx
- /workspaces/snakkaz-chat/src/components/chat/friends/DirectMessageList.tsx
- /workspaces/snakkaz-chat/src/components/chat/friends/DirectMessageEmptyState.tsx
- /workspaces/snakkaz-chat/src/components/chat/ChatPresence.tsx
- /workspaces/snakkaz-chat/src/components/chat/global/ChatSidebar.tsx
- /workspaces/snakkaz-chat/src/components/chat/global/ChatInput.tsx
- /workspaces/snakkaz-chat/src/components/chat/global/RecentChatsSection.tsx
- /workspaces/snakkaz-chat/src/components/chat/global/ChatMessages.tsx
- /workspaces/snakkaz-chat/src/components/chat/MessageList.tsx
- /workspaces/snakkaz-chat/src/components/chat/message/MessageActions.tsx
- /workspaces/snakkaz-chat/src/components/chat/message/ResponsiveMessageList.tsx
- /workspaces/snakkaz-chat/src/components/chat/message/MessageMedia.tsx
- /workspaces/snakkaz-chat/src/components/chat/MessageReactions.tsx
- /workspaces/snakkaz-chat/src/components/chat/MessageBubble.tsx
- /workspaces/snakkaz-chat/src/components/chat/PinnedMessages.tsx
- /workspaces/snakkaz-chat/src/components/chat/business/AutoMessages.tsx
- /workspaces/snakkaz-chat/src/components/chat/recent/RecentChats.tsx
- /workspaces/snakkaz-chat/src/components/chat/ChatConnectionStatus.tsx
- /workspaces/snakkaz-chat/src/components/chat/ChatList.tsx
- /workspaces/snakkaz-chat/src/components/chat/ChatTabs.tsx
- /workspaces/snakkaz-chat/src/components/chat/ChatHeader.tsx
- /workspaces/snakkaz-chat/src/components/chat/ChatMessage.tsx
- /workspaces/snakkaz-chat/src/components/chat/AppMessage.tsx
- /workspaces/snakkaz-chat/src/components/chat/AIAgentChat.tsx
- /workspaces/snakkaz-chat/src/components/chat/header/ChatHeader.tsx
- /workspaces/snakkaz-chat/src/components/chat/ChatTypingIndicator.tsx
- /workspaces/snakkaz-chat/src/components/chat/ChatFriends.tsx
- /workspaces/snakkaz-chat/src/components/chat/OptimizedChatFriends.tsx
- /workspaces/snakkaz-chat/src/components/chat/ChatGlassPanel.tsx
- /workspaces/snakkaz-chat/src/components/chat/EnhancedMessageInput.tsx
- /workspaces/snakkaz-chat/src/components/message-input/MessageInput.tsx
- /workspaces/snakkaz-chat/src/components/message-input/SecureMessageInput.tsx
- /workspaces/snakkaz-chat/src/components/message-input/EditingMessage.tsx
- /workspaces/snakkaz-chat/src/components/mobile/MobileMessageList.tsx
- /workspaces/snakkaz-chat/src/components/mobile/pin/MobileChatMessageList.tsx
- /workspaces/snakkaz-chat/src/components/mobile/pin/MobileChatMessage.tsx
- /workspaces/snakkaz-chat/src/components/mobile/ChatCodeModal.tsx
- /workspaces/snakkaz-chat/src/components/mobile/MobileChatView.tsx
- /workspaces/snakkaz-chat/src/features/chat/components/ChatMessageList.tsx
- /workspaces/snakkaz-chat/src/features/chat/components/ChatSidebar.tsx
- /workspaces/snakkaz-chat/src/features/chat/components/ChatDialogs.tsx
- /workspaces/snakkaz-chat/src/features/chat/components/ChatInputField.tsx
- /workspaces/snakkaz-chat/src/features/chat/components/ChatPresence.tsx
- /workspaces/snakkaz-chat/src/features/chat/components/MessageBubble.tsx
- /workspaces/snakkaz-chat/src/features/chat/components/ChatList.tsx
- /workspaces/snakkaz-chat/src/features/chat/components/ChatTabs.tsx
- /workspaces/snakkaz-chat/src/features/chat/components/ChatHeader.tsx
- /workspaces/snakkaz-chat/src/features/chat/components/ChatMessage.tsx
- /workspaces/snakkaz-chat/src/features/chat/components/AIAgentChat.tsx
- /workspaces/snakkaz-chat/src/features/chat/components/ChatFriends.tsx
- /workspaces/snakkaz-chat/src/features/chat/components/ChatGlassPanel.tsx
- /workspaces/snakkaz-chat/src/services/encryption/SecureMessageViewer.tsx
- /workspaces/snakkaz-chat/src/services/encryption/ChatContext.tsx
- /workspaces/snakkaz-chat/src/contexts/MessageReplyContext.tsx
- /workspaces/snakkaz-chat/src/contexts/ChatContext.tsx
- /workspaces/snakkaz-chat/src/pages/components/ChatMessageList.tsx
- /workspaces/snakkaz-chat/src/pages/components/ChatInputField.tsx
- /workspaces/snakkaz-chat/src/pages/components/ChatMessage.tsx
- /workspaces/snakkaz-chat/src/pages/SecureChatPage.tsx
- /workspaces/snakkaz-chat/src/pages/Chat.tsx
- /workspaces/snakkaz-chat/src/pages/OptimizedChat.tsx
- /workspaces/snakkaz-chat/src/pages/AIChat.tsx
- /workspaces/snakkaz-chat/src/pages/ChatSettingsPage.tsx
- /workspaces/snakkaz-chat/src/pages/chat/components/ChatStateManager.tsx
- /workspaces/snakkaz-chat/src/pages/chat/components/ChatLayout.tsx
- /workspaces/snakkaz-chat/src/pages/chat/SafeChatPage.tsx
- /workspaces/snakkaz-chat/src/pages/chat/AIChatPage.tsx
- /workspaces/snakkaz-chat/src/pages/chat/ChatPage.tsx

### Uncategorized Components


## Migration Steps

1. Create feature-based structure in `src/features/chat`
2. Move components to appropriate subdirectories
3. Update import paths throughout the codebase
4. Test functionality after migration
5. Remove duplicate components after validating functionality

## Import Path Updates

After moving components, the following import path updates will be needed:

```typescript
// Before
import { ChatMessage } from '@/components/chat/ChatMessage';

// After
import { ChatMessage } from '@/features/chat';
```

## Manual Review Required

Some components may require manual review to determine their proper categorization:

1. Components marked as "uncategorized"
2. Components that might have dependencies on specific other components
3. Components with duplicate functionality that need to be consolidated

## Implementation Strategy

1. Start with moving the common and interface components
2. Then migrate global, private, and group components
3. Update imports incrementally and test after each set of changes
4. Refactor duplicate functionality into shared components
