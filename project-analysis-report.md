# Snakkaz Chat Project Structure Analysis Report
Generated on Mon May 26 11:15:31 UTC 2025

## Overview
This report analyzes the current project structure to identify areas for improvement,
duplicate files, and potential consolidation points.

## Duplicate File Names
The following file names appear in multiple locations:

| Count | Filename |
|-------|----------|
| 33 | index.ts |

### Locations of 'index.ts':
- `src/components/admin/index.ts`
- `src/components/charts/index.ts`
- `src/components/chat/business/index.ts`
- `src/components/chat/index.ts`
- `src/components/dashboard/index.ts`
- `src/components/media/index.ts`
- `src/components/message-input/index.ts`
- `src/components/onboarding/index.ts`
- `src/components/ui/index.ts`
- `src/components/utils-ui/index.ts`
- `src/features/auth/components/index.ts`
- `src/features/auth/hooks/index.ts`
- `src/features/auth/index.ts`
- `src/features/chat/components/common/index.ts`
- `src/features/chat/components/global/index.ts`
- `src/features/chat/components/group/index.ts`
- `src/features/chat/components/index.ts`
- `src/features/chat/components/interface/index.ts`
- `src/features/chat/components/private/index.ts`
- `src/features/chat/index.ts`
- `src/features/groups/components/index.ts`
- `src/features/groups/hooks/index.ts`
- `src/features/groups/index.ts`
- `src/features/groups/types/index.ts`
- `src/features/index.ts`
- `src/hooks/index.ts`
- `src/services/encryption/index.ts`
- `src/services/supabase/index.ts`
- `src/utils/encryption/index.ts`
- `src/utils/encryption/media/index.ts`
- `src/utils/lazy-loading/index.ts`
- `src/utils/performance/index.ts`
- `src/utils/webrtc/index.ts`

| 7 | types.ts |

### Locations of 'types.ts':
- `src/components/chat/ai/types.ts`
- `src/components/chat/friends/types.ts`
- `src/integrations/supabase/types.ts`
- `src/services/ai/types.ts`
- `src/services/subscription/types.ts`
- `src/utils/encryption/types.ts`
- `src/utils/webrtc/types.ts`

| 5 | GroupList.tsx |

### Locations of 'GroupList.tsx':
- `src/components/chat/GroupList.tsx`
- `src/components/chat/groups/GroupList.tsx`
- `src/components/groups/GroupList.tsx`
- `src/features/groups/components/GroupList.tsx`
- `src/services/encryption/GroupList.tsx`

| 4 | MediaUploader.tsx |

### Locations of 'MediaUploader.tsx':
- `src/components/chat/MediaUploader.tsx`
- `src/components/media/MediaUploader.tsx`
- `src/features/chat/components/MediaUploader.tsx`
- `src/pages/components/MediaUploader.tsx`

| 4 | FriendsList.tsx |

### Locations of 'FriendsList.tsx':
- `src/components/chat/FriendsList.tsx`
- `src/components/chat/friends/FriendsList.tsx`
- `src/components/chat/friends/list/FriendsList.tsx`
- `src/features/chat/components/FriendsList.tsx`

| 4 | ChatInterface.tsx |

### Locations of 'ChatInterface.tsx':
- `src/components/chat/ChatInterface.tsx`
- `src/features/chat/components/ChatInterface.tsx`
- `src/pages/components/ChatInterface.tsx`
- `src/services/encryption/ChatInterface.tsx`

| 3 | utils.ts |

### Locations of 'utils.ts':
- `src/components/message/media/utils.ts`
- `src/lib/utils.ts`
- `src/pages/lib/utils.ts`

| 3 | useGroupChat.ts |

### Locations of 'useGroupChat.ts':
- `src/components/chat/groups/hooks/useGroupChat.ts`
- `src/features/chat/hooks/useGroupChat.ts`
- `src/hooks/useGroupChat.ts`

| 3 | theme.ts |

### Locations of 'theme.ts':
- `src/components/lib/theme.ts`
- `src/lib/theme.ts`
- `src/pages/lib/theme.ts`

| 3 | storage.ts |

### Locations of 'storage.ts':
- `src/integrations/supabase/storage.ts`
- `src/types/storage.ts`
- `src/utils/storage.ts`

| 3 | group.ts |

### Locations of 'group.ts':
- `src/features/groups/types/group.ts`
- `src/types/group.ts`
- `src/utils/encryption/group.ts`

| 3 | encryptionService.ts |

### Locations of 'encryptionService.ts':
- `src/components/chat/encryptionService.ts`
- `src/services/encryption/encryptionService.ts`
- `src/utils/encryption/encryptionService.ts`

| 3 | RegisterForm.tsx |

### Locations of 'RegisterForm.tsx':
- `src/components/auth/RegisterForm.tsx`
- `src/features/auth/components/RegisterForm.tsx`
- `src/pages/auth/RegisterForm.tsx`

| 3 | MessageInput.tsx |

### Locations of 'MessageInput.tsx':
- `src/components/MessageInput.tsx`
- `src/components/chat/MessageInput.tsx`
- `src/components/message-input/MessageInput.tsx`

| 3 | MessageBubble.tsx |

### Locations of 'MessageBubble.tsx':
- `src/components/chat/MessageBubble.tsx`
- `src/components/message/MessageBubble.tsx`
- `src/features/chat/components/MessageBubble.tsx`

| 3 | MainNav.tsx |

### Locations of 'MainNav.tsx':
- `src/components/nav/MainNav.tsx`
- `src/components/navigation/MainNav.tsx`
- `src/pages/components/MainNav.tsx`

| 3 | LoginForm.tsx |

### Locations of 'LoginForm.tsx':
- `src/components/auth/LoginForm.tsx`
- `src/features/auth/components/LoginForm.tsx`
- `src/pages/auth/LoginForm.tsx`

| 3 | GroupMessageList.tsx |

### Locations of 'GroupMessageList.tsx':
- `src/components/chat/GroupMessageList.tsx`
- `src/components/chat/groups/GroupMessageList.tsx`
- `src/features/chat/components/GroupMessageList.tsx`

| 3 | ChatSidebar.tsx |

### Locations of 'ChatSidebar.tsx':
- `src/components/chat/ChatSidebar.tsx`
- `src/components/chat/global/ChatSidebar.tsx`
- `src/features/chat/components/ChatSidebar.tsx`

| 3 | ChatMessageList.tsx |

### Locations of 'ChatMessageList.tsx':
- `src/components/chat/ChatMessageList.tsx`
- `src/features/chat/components/ChatMessageList.tsx`
- `src/pages/components/ChatMessageList.tsx`

| 3 | ChatMessage.tsx |

### Locations of 'ChatMessage.tsx':
- `src/components/chat/ChatMessage.tsx`
- `src/features/chat/components/ChatMessage.tsx`
- `src/pages/components/ChatMessage.tsx`

| 3 | ChatInputField.tsx |

### Locations of 'ChatInputField.tsx':
- `src/components/chat/ChatInputField.tsx`
- `src/features/chat/components/ChatInputField.tsx`
- `src/pages/components/ChatInputField.tsx`

| 3 | ChatHeader.tsx |

### Locations of 'ChatHeader.tsx':
- `src/components/chat/ChatHeader.tsx`
- `src/components/chat/header/ChatHeader.tsx`
- `src/features/chat/components/ChatHeader.tsx`

| 3 | AuthContext.tsx |

### Locations of 'AuthContext.tsx':
- `src/contexts/AuthContext.tsx`
- `src/features/auth/AuthContext.tsx`
- `src/pages/contexts/AuthContext.tsx`

| 2 | useTypingIndicator.ts |

### Locations of 'useTypingIndicator.ts':
- `src/hooks/chat/useTypingIndicator.ts`
- `src/hooks/message/useTypingIndicator.ts`

| 2 | useRecentConversations.ts |

### Locations of 'useRecentConversations.ts':
- `src/features/chat/hooks/useRecentConversations.ts`
- `src/hooks/chat/useRecentConversations.ts`

| 2 | usePresence.ts |

### Locations of 'usePresence.ts':
- `src/components/chat/hooks/usePresence.ts`
- `src/hooks/usePresence.ts`

| 2 | useMessageSend.ts |

### Locations of 'useMessageSend.ts':
- `src/hooks/message/useMessageSend.ts`
- `src/hooks/useMessageSend.ts`

| 2 | useMediaDecryption.ts |

### Locations of 'useMediaDecryption.ts':
- `src/components/message/media/useMediaDecryption.ts`
- `src/utils/encryption/media/useMediaDecryption.ts`

| 2 | useGroups.ts |

### Locations of 'useGroups.ts':
- `src/components/chat/hooks/useGroups.ts`
- `src/hooks/useGroups.ts`

| 2 | useGroupMessageSender.ts |

### Locations of 'useGroupMessageSender.ts':
- `src/components/chat/groups/hooks/useGroupMessageSender.ts`
- `src/hooks/message/useMessageSender/useGroupMessageSender.ts`

| 2 | useGroupJoin.ts |

### Locations of 'useGroupJoin.ts':
- `src/components/chat/hooks/useGroupJoin.ts`
- `src/hooks/useGroupJoin.ts`

| 2 | useGroupInvites.ts |

### Locations of 'useGroupInvites.ts':
- `src/components/chat/hooks/useGroupInvites.ts`
- `src/features/groups/hooks/useGroupInvites.ts`

| 2 | useGroupFetching.ts |

### Locations of 'useGroupFetching.ts':
- `src/components/chat/hooks/useGroupFetching.ts`
- `src/hooks/useGroupFetching.ts`

| 2 | useGroupCreation.ts |

### Locations of 'useGroupCreation.ts':
- `src/components/chat/hooks/useGroupCreation.ts`
- `src/hooks/useGroupCreation.ts`

| 2 | useFriends.ts |

### Locations of 'useFriends.ts':
- `src/components/chat/hooks/useFriends.ts`
- `src/hooks/useFriends.ts`

| 2 | useDirectMessageSubmit.ts |

### Locations of 'useDirectMessageSubmit.ts':
- `src/components/chat/friends/hooks/useDirectMessageSubmit.ts`
- `src/hooks/useDirectMessageSubmit.ts`

| 2 | useDirectMessageState.ts |

### Locations of 'useDirectMessageState.ts':
- `src/components/chat/friends/hooks/useDirectMessageState.ts`
- `src/hooks/useDirectMessageState.ts`

| 2 | useDirectMessageSender.ts |

### Locations of 'useDirectMessageSender.ts':
- `src/components/chat/friends/hooks/useDirectMessageSender.ts`
- `src/hooks/useDirectMessageSender.ts`

| 2 | useDirectMessageConnection.ts |

### Locations of 'useDirectMessageConnection.ts':
- `src/components/chat/friends/hooks/useDirectMessageConnection.ts`
- `src/hooks/useDirectMessageConnection.ts`

| 2 | useDirectMessage.ts |

### Locations of 'useDirectMessage.ts':
- `src/components/chat/friends/hooks/useDirectMessage.ts`
- `src/hooks/useDirectMessage.ts`

| 2 | useChatCode.ts |

### Locations of 'useChatCode.ts':
- `src/features/chat/hooks/useChatCode.ts`
- `src/hooks/useChatCode.ts`

| 2 | useAuthState.ts |

### Locations of 'useAuthState.ts':
- `src/features/auth/hooks/useAuthState.ts`
- `src/hooks/useAuthState.ts`

| 2 | useAuth.tsx |

### Locations of 'useAuth.tsx':
- `src/hooks/useAuth.tsx`
- `src/pages/hooks/useAuth.tsx`

| 2 | useAuth.ts |

### Locations of 'useAuth.ts':
- `src/features/auth/hooks/useAuth.ts`
- `src/pages/hooks/useAuth.ts`

| 2 | useAuth.d.ts |

### Locations of 'useAuth.d.ts':
- `src/features/auth/hooks/useAuth.d.ts`
- `src/hooks/useAuth.d.ts`

| 2 | useAIChat.ts |

### Locations of 'useAIChat.ts':
- `src/components/chat/ai/hooks/useAIChat.ts`
- `src/pages/hooks/ai/useAIChat.ts`

| 2 | use-toast.ts |

### Locations of 'use-toast.ts':
- `src/components/ui/use-toast.ts`
- `src/hooks/use-toast.ts`

| 2 | themeService.ts |

### Locations of 'themeService.ts':
- `src/services/encryption/themeService.ts`
- `src/utils/themeService.ts`

| 2 | snakkazCspPlugin.ts |

### Locations of 'snakkazCspPlugin.ts':
- `src/plugins/snakkazCspPlugin.ts`
- `src/services/encryption/vitePlugins/snakkazCspPlugin.ts`

| 2 | simpleEncryption.ts |

### Locations of 'simpleEncryption.ts':
- `src/services/encryption/simpleEncryption.ts`
- `src/utils/encryption/simpleEncryption.ts`

| 2 | securityEnhancements.ts |

### Locations of 'securityEnhancements.ts':
- `src/services/encryption/securityEnhancements.ts`
- `src/services/security/securityEnhancements.ts`

| 2 | privateChatService.ts |

### Locations of 'privateChatService.ts':
- `src/services/api/privateChatService.ts`
- `src/services/encryption/privateChatService.ts`

| 2 | notification.ts |

### Locations of 'notification.ts':
- `src/services/notification.ts`
- `src/types/notification.ts`

| 2 | namecheapConfig.ts |

### Locations of 'namecheapConfig.ts':
- `src/services/dns/namecheapConfig.ts`
- `src/services/encryption/namecheapConfig.ts`

| 2 | namecheapApi.ts |

### Locations of 'namecheapApi.ts':
- `src/services/dns/namecheapApi.ts`
- `src/services/encryption/namecheapApi.ts`

| 2 | metaTagFixes.ts |

### Locations of 'metaTagFixes.ts':
- `src/services/encryption/metaTagFixes.ts`
- `src/utils/metaTagFixes.ts`

| 2 | message.ts |

### Locations of 'message.ts':
- `src/features/groups/types/message.ts`
- `src/types/message.ts`

| 2 | mediaUploadService.ts |

### Locations of 'mediaUploadService.ts':
- `src/services/api/mediaUploadService.ts`
- `src/services/encryption/mediaUploadService.ts`

| 2 | keyStorageService.ts |

### Locations of 'keyStorageService.ts':
- `src/services/encryption/keyStorageService.ts`
- `src/utils/encryption/keyStorageService.ts`

| 2 | initialize.ts |

### Locations of 'initialize.ts':
- `src/services/encryption/initialize.ts`
- `src/services/initialize.ts`

| 2 | groupChatService.ts |

### Locations of 'groupChatService.ts':
- `src/services/api/groupChatService.ts`
- `src/services/encryption/groupChatService.ts`

| 2 | encryption.ts |

### Locations of 'encryption.ts':
- `src/pages/lib/encryption.ts`
- `src/utils/encryption.ts`

| 2 | dnsManager.ts |

### Locations of 'dnsManager.ts':
- `src/services/dns/dnsManager.ts`
- `src/services/encryption/dnsManager.ts`

| 2 | diagnosticTest.ts |

### Locations of 'diagnosticTest.ts':
- `src/services/encryption/diagnosticTest.ts`
- `src/services/security/diagnosticTest.ts`

| 2 | cspReporting.ts |

### Locations of 'cspReporting.ts':
- `src/services/encryption/cspReporting.ts`
- `src/services/security/cspReporting.ts`

| 2 | cspFixes.ts |

### Locations of 'cspFixes.ts':
- `src/services/encryption/cspFixes.ts`
- `src/services/security/cspFixes.ts`

| 2 | cspConfig.ts |

### Locations of 'cspConfig.ts':
- `src/services/encryption/cspConfig.ts`
- `src/services/security/cspConfig.ts`

| 2 | browserFixes.ts |

### Locations of 'browserFixes.ts':
- `src/services/encryption/browserFixes.ts`
- `src/utils/browserFixes.ts`

| 2 | assetFallback.ts |

### Locations of 'assetFallback.ts':
- `src/services/encryption/assetFallback.ts`
- `src/utils/assetFallback.ts`

| 2 | UsersProfiles.tsx |

### Locations of 'UsersProfiles.tsx':
- `src/components/chat/UsersProfiles.tsx`
- `src/features/chat/components/UsersProfiles.tsx`

| 2 | UserNav.tsx |

### Locations of 'UserNav.tsx':
- `src/components/nav/UserNav.tsx`
- `src/pages/components/UserNav.tsx`

| 2 | UserController.ts |

### Locations of 'UserController.ts':
- `src/controllers/UserController.ts`
- `src/services/encryption/controllers/UserController.ts`

| 2 | User.ts |

### Locations of 'User.ts':
- `src/models/User.ts`
- `src/services/encryption/models/User.ts`

| 2 | SecureShareComponent.tsx |

### Locations of 'SecureShareComponent.tsx':
- `src/components/chat/SecureShareComponent.tsx`
- `src/services/encryption/SecureShareComponent.tsx`

| 2 | SecureMessageViewer.tsx |

### Locations of 'SecureMessageViewer.tsx':
- `src/components/chat/SecureMessageViewer.tsx`
- `src/services/encryption/SecureMessageViewer.tsx`

| 2 | ScrollStabilizer.tsx |

### Locations of 'ScrollStabilizer.tsx':
- `src/components/chat/ScrollStabilizer.tsx`
- `src/features/chat/components/ScrollStabilizer.tsx`

| 2 | RegisterHeader.tsx |

### Locations of 'RegisterHeader.tsx':
- `src/components/auth/RegisterHeader.tsx`
- `src/features/auth/components/RegisterHeader.tsx`

| 2 | RegisterFormInputs.tsx |

### Locations of 'RegisterFormInputs.tsx':
- `src/components/auth/RegisterFormInputs.tsx`
- `src/features/auth/components/RegisterFormInputs.tsx`

| 2 | ProtectedRoute.tsx |

### Locations of 'ProtectedRoute.tsx':
- `src/components/auth/ProtectedRoute.tsx`
- `src/features/auth/components/ProtectedRoute.tsx`

| 2 | PrivateConversations.tsx |

### Locations of 'PrivateConversations.tsx':
- `src/components/chat/PrivateConversations.tsx`
- `src/services/encryption/PrivateConversations.tsx`

| 2 | PrivateChats.tsx |

### Locations of 'PrivateChats.tsx':
- `src/components/chat/PrivateChats.tsx`
- `src/features/chat/components/PrivateChats.tsx`

| 2 | PrivateChatContainer.tsx |

### Locations of 'PrivateChatContainer.tsx':
- `src/components/chat/PrivateChatContainer.tsx`
- `src/services/encryption/PrivateChatContainer.tsx`

| 2 | PrivateChat.tsx |

### Locations of 'PrivateChat.tsx':
- `src/components/chat/PrivateChat.tsx`
- `src/services/encryption/PrivateChat.tsx`

| 2 | PinInput.tsx |

### Locations of 'PinInput.tsx':
- `src/components/mobile/pin/PinInput.tsx`
- `src/components/pin/PinInput.tsx`

| 2 | NewConversation.tsx |

### Locations of 'NewConversation.tsx':
- `src/components/chat/NewConversation.tsx`
- `src/services/encryption/NewConversation.tsx`

| 2 | MigrationHelper.tsx |

### Locations of 'MigrationHelper.tsx':
- `src/components/chat/MigrationHelper.tsx`
- `src/features/chat/components/MigrationHelper.tsx`

| 2 | MessageMedia.tsx |

### Locations of 'MessageMedia.tsx':
- `src/components/chat/message/MessageMedia.tsx`
- `src/components/message/MessageMedia.tsx`

| 2 | MessageList.tsx |

### Locations of 'MessageList.tsx':
- `src/components/chat/MessageList.tsx`
- `src/components/message-list/MessageList.tsx`

| 2 | MessageController.ts |

### Locations of 'MessageController.ts':
- `src/controllers/MessageController.ts`
- `src/services/encryption/controllers/MessageController.ts`

| 2 | MessageActions.tsx |

### Locations of 'MessageActions.tsx':
- `src/components/chat/message/MessageActions.tsx`
- `src/components/message/MessageActions.tsx`

| 2 | Message.ts |

### Locations of 'Message.ts':
- `src/models/Message.ts`
- `src/services/encryption/models/Message.ts`

| 2 | LoginLayout.tsx |

### Locations of 'LoginLayout.tsx':
- `src/components/auth/LoginLayout.tsx`
- `src/features/auth/components/LoginLayout.tsx`

| 2 | LoginButton.tsx |

### Locations of 'LoginButton.tsx':
- `src/components/chat/LoginButton.tsx`
- `src/services/encryption/LoginButton.tsx`

| 2 | Layout.tsx |

### Locations of 'Layout.tsx':
- `src/Layout.tsx`
- `src/pages/Layout.tsx`

| 2 | HeaderActionButton.tsx |

### Locations of 'HeaderActionButton.tsx':
- `src/components/chat/header/HeaderActionButton.tsx`
- `src/components/chat/header/buttons/HeaderActionButton.tsx`

| 2 | GroupSettingsPanel.tsx |

### Locations of 'GroupSettingsPanel.tsx':
- `src/components/chat/group/GroupSettingsPanel.tsx`
- `src/components/chat/groups/GroupSettingsPanel.tsx`

| 2 | GroupInviteDialog.tsx |

### Locations of 'GroupInviteDialog.tsx':
- `src/components/chat/groups/GroupInviteDialog.tsx`
- `src/features/groups/components/GroupInviteDialog.tsx`

| 2 | GlobalTab.tsx |

### Locations of 'GlobalTab.tsx':
- `src/components/chat/global/GlobalTab.tsx`
- `src/components/chat/tabs/GlobalTab.tsx`

| 2 | FirstTimeUserWelcome.tsx |

### Locations of 'FirstTimeUserWelcome.tsx':
- `src/components/FirstTimeUserWelcome.tsx`
- `src/components/onboarding/FirstTimeUserWelcome.tsx`

| 2 | ErrorBoundary.tsx |

### Locations of 'ErrorBoundary.tsx':
- `src/components/ErrorBoundary.tsx`
- `src/components/error/ErrorBoundary.tsx`

| 2 | EnhancedMediaUploader.tsx |

### Locations of 'EnhancedMediaUploader.tsx':
- `src/components/EnhancedMediaUploader.tsx`
- `src/components/media/EnhancedMediaUploader.tsx`

| 2 | EnhancedAudioRecorder.tsx |

### Locations of 'EnhancedAudioRecorder.tsx':
- `src/components/media/EnhancedAudioRecorder.tsx`
- `src/components/message-input/EnhancedAudioRecorder.tsx`

| 2 | DirectMessageHeader.tsx |

### Locations of 'DirectMessageHeader.tsx':
- `src/components/chat/direct-message/DirectMessageHeader.tsx`
- `src/components/chat/friends/DirectMessageHeader.tsx`

| 2 | DirectMessageForm.tsx |

### Locations of 'DirectMessageForm.tsx':
- `src/components/chat/direct-message/DirectMessageForm.tsx`
- `src/components/chat/friends/DirectMessageForm.tsx`

| 2 | CustomEmojiTest.tsx |

### Locations of 'CustomEmojiTest.tsx':
- `src/components/debug/CustomEmojiTest.tsx`
- `src/components/emoji/CustomEmojiTest.tsx`

| 2 | CustomEmojiManager.tsx |

### Locations of 'CustomEmojiManager.tsx':
- `src/components/chat/CustomEmojiManager.tsx`
- `src/components/emoji/CustomEmojiManager.tsx`

| 2 | CreateGroupModal.tsx |

### Locations of 'CreateGroupModal.tsx':
- `src/components/groups/CreateGroupModal.tsx`
- `src/features/groups/components/CreateGroupModal.tsx`

| 2 | CreateGroup.tsx |

### Locations of 'CreateGroup.tsx':
- `src/components/groups/CreateGroup.tsx`
- `src/features/groups/components/CreateGroup.tsx`

| 2 | CommandHandler.tsx |

### Locations of 'CommandHandler.tsx':
- `src/components/chat/CommandHandler.tsx`
- `src/features/chat/components/CommandHandler.tsx`

| 2 | ChatTabs.tsx |

### Locations of 'ChatTabs.tsx':
- `src/components/chat/ChatTabs.tsx`
- `src/features/chat/components/ChatTabs.tsx`

| 2 | ChatPresence.tsx |

### Locations of 'ChatPresence.tsx':
- `src/components/chat/ChatPresence.tsx`
- `src/features/chat/components/ChatPresence.tsx`

| 2 | ChatList.tsx |

### Locations of 'ChatList.tsx':
- `src/components/chat/ChatList.tsx`
- `src/features/chat/components/ChatList.tsx`

| 2 | ChatGlobal.tsx |

### Locations of 'ChatGlobal.tsx':
- `src/components/chat/ChatGlobal.tsx`
- `src/features/chat/components/ChatGlobal.tsx`

| 2 | ChatGlassPanel.tsx |

### Locations of 'ChatGlassPanel.tsx':
- `src/components/chat/ChatGlassPanel.tsx`
- `src/features/chat/components/ChatGlassPanel.tsx`

| 2 | ChatFriends.tsx |

### Locations of 'ChatFriends.tsx':
- `src/components/chat/ChatFriends.tsx`
- `src/features/chat/components/ChatFriends.tsx`

| 2 | ChatDialogs.tsx |

### Locations of 'ChatDialogs.tsx':
- `src/components/chat/ChatDialogs.tsx`
- `src/features/chat/components/ChatDialogs.tsx`

| 2 | ChatController.ts |

### Locations of 'ChatController.ts':
- `src/controllers/ChatController.ts`
- `src/services/encryption/controllers/ChatController.ts`

| 2 | ChatContext.tsx |

### Locations of 'ChatContext.tsx':
- `src/contexts/ChatContext.tsx`
- `src/services/encryption/ChatContext.tsx`

| 2 | Chat.ts |

### Locations of 'Chat.ts':
- `src/models/Chat.ts`
- `src/services/encryption/models/Chat.ts`

| 2 | AuthContext.d.ts |

### Locations of 'AuthContext.d.ts':
- `src/contexts/AuthContext.d.ts`
- `src/features/auth/AuthContext.d.ts`

| 2 | AppMessage.tsx |

### Locations of 'AppMessage.tsx':
- `src/components/chat/AppMessage.tsx`
- `src/components/message/AppMessage.tsx`

| 2 | App.tsx |

### Locations of 'App.tsx':
- `src/App.tsx`
- `src/pages/App.tsx`

| 2 | AdminButton.tsx |

### Locations of 'AdminButton.tsx':
- `src/components/chat/AdminButton.tsx`
- `src/features/chat/components/AdminButton.tsx`

| 2 | AIAgentChat.tsx |

### Locations of 'AIAgentChat.tsx':
- `src/components/chat/AIAgentChat.tsx`
- `src/features/chat/components/AIAgentChat.tsx`

## Component Prefix Analysis
Components with similar prefixes that could be grouped together:

| Prefix | Count | Example Components |
|--------|-------|-------------------|
| Chat | 44 | Chat.tsx,ChatCodeModal.tsx,ChatConnectionStatus.tsx |
| Message | 31 | MessageActions.tsx,MessageActions.tsx,MessageActionsMenu.tsx |
| Group | 29 | GroupAdministration.tsx,GroupChat.tsx,GroupChatCreator.tsx |
| Private | 14 | PrivateChat.tsx,PrivateChat.tsx,PrivateChatActions.tsx |
| Mobile | 13 | MobileChatContainer.tsx,MobileChatMessage.tsx,MobileChatMessageList.tsx |
| Enhanced | 11 | EnhancedAudioRecorder.tsx,EnhancedAudioRecorder.tsx,EnhancedEmojiPicker.tsx |
| Admin | 11 | Admin.tsx,AdminApiKeySection.tsx,AdminAuth.tsx |
| Secure | 10 | SecureChatPage.tsx,SecureImageViewer.tsx,SecureMediaDisplay.tsx |
| Pin | 10 | PinChangeModal.tsx,PinIcon.tsx,PinInput.tsx |
| Direct | 10 | DirectMessage.tsx,DirectMessageContainer.tsx,DirectMessageContent.tsx |
| User | 9 | UserAvatar.tsx,UserItem.tsx,UserList.tsx |
| App | 9 | App.tsx,App.tsx,AppChatInterface.tsx |
| Login | 8 | Login.tsx,LoginButton.tsx,LoginButton.tsx |
| Friends | 8 | FriendsContainer.tsx,FriendsList.tsx,FriendsList.tsx |
| Security | 7 | Security.tsx,SecurityBadge.tsx,SecurityLevelSelect.tsx |
| Register | 7 | Register.tsx,RegisterForm.tsx,RegisterForm.tsx |
| Profile | 7 | Profile.tsx,ProfileAvatar.tsx,ProfileCard.tsx |
| Create | 7 | CreateGroup.tsx,CreateGroup.tsx,CreateGroupComponent.tsx |
| File | 6 | FileDropdownMenu.tsx,FileInputs.tsx,FileMedia.tsx |
| Custom | 6 | CustomEmojiDisplay.tsx,CustomEmojiManager.tsx,CustomEmojiManager.tsx |
| Auth | 6 | AuthContext.tsx,AuthContext.tsx,AuthContext.tsx |
| Premium | 5 | Premium.tsx,PremiumEmailManager.fixed.tsx,PremiumEmailManager.tsx |
| Theme | 4 | ThemeContext.tsx,ThemeProvider.tsx,ThemeSwitcher.tsx |
| Status | 4 | StatusDropdown.tsx,StatusIcon.tsx,StatusIcons.tsx |
| Notification | 4 | NotificationCenter.tsx,NotificationContext.tsx,NotificationProvider.tsx |
| Media | 4 | MediaUploader.tsx,MediaUploader.tsx,MediaUploader.tsx |
| Main | 4 | MainHeader.tsx,MainNav.tsx,MainNav.tsx |
| Header | 4 | Header.tsx,HeaderActionButton.tsx,HeaderActionButton.tsx |
| Global | 4 | GlobalChatContainer.tsx,GlobalChatHeader.tsx,GlobalTab.tsx |
| Business | 4 | BusinessChatContainer.tsx,BusinessIndicator.tsx,BusinessSettings.tsx |
| Tab | 3 | TabBadge.tsx,TabContent.tsx,TabIndicator.tsx |
| Supabase | 3 | SupabaseConnectionTest.tsx,SupabaseError.tsx,SupabaseTest.tsx |
| Scroll | 3 | ScrollStabilizer.tsx,ScrollStabilizer.tsx,ScrollToBottomButton.tsx |
| Friend | 3 | FriendListItem.tsx,FriendRequests.tsx,FriendSearch.tsx |
| Emoji | 3 | EmojiAnalytics.tsx,EmojiPackBrowser.tsx,EmojiSearch.tsx |
| Command | 3 | CommandConfirmationDialog.tsx,CommandHandler.tsx,CommandHandler.tsx |
| usePin | 2 | usePinSecurity.tsx,usePinValidation.tsx |
| useAuth.tsx | 2 | useAuth.tsx,useAuth.tsx |
| Users | 2 | UsersProfiles.tsx,UsersProfiles.tsx |
| Unread | 2 | UnreadBadge.tsx,UnreadCounter.tsx |
| System | 2 | SystemHealthHeader.tsx,SystemLoadIndicator.tsx |
| Subscription | 2 | Subscription.tsx,SubscriptionPage.tsx,SubscriptionTiers.tsx |
| Safe | 2 | SafeChatPage.tsx,SafeLink.tsx |
| Recent | 2 | RecentChats.tsx,RecentChatsSection.tsx |
| Protected | 2 | ProtectedRoute.tsx,ProtectedRoute.tsx |
| Project | 2 | ProjectCard.tsx,ProjectGrid.tsx |
| Preview | 2 | PreviewIndicator.tsx,PreviewSwitcher.tsx |
| Optimized | 2 | OptimizedChat.tsx,OptimizedChatFriends.tsx |
| Online | 2 | OnlineUsers.tsx,OnlineUsersSection.tsx |
| Not | 2 | NotFound.tsx,NotFoundPage.tsx,NotificationCenter.tsx |
| New | 2 | NewConversation.tsx,NewConversation.tsx |
| Navigation | 2 | NavigationButtons.tsx,NavigationTabs.tsx |
| Migration | 2 | MigrationHelper.tsx,MigrationHelper.tsx |
| Loading | 2 | LoadingScreen.tsx,LoadingStates.tsx |
| Layout.tsx | 2 | Layout.tsx,Layout.tsx |
| Help | 2 | HelpDeskDialog.tsx,HelpDetails.tsx |
| First | 2 | FirstTimeUserWelcome.tsx,FirstTimeUserWelcome.tsx |
| Error | 2 | ErrorBoundary.tsx,ErrorBoundary.tsx |
| Empty | 2 | EmptyFriendView.tsx,EmptyFriendsList.tsx |
| Delete | 2 | DeleteMessageDialog.tsx,DeleteMessageHandler.tsx,DeletedMedia.tsx |
| Bitcoin | 2 | BitcoinPayment.tsx,BitcoinWallet.tsx |
| Auto | 2 | AutoGifCreator.tsx,AutoMessages.tsx |
| Audio | 2 | AudioMedia.tsx,AudioRecorder.tsx |
| App.tsx | 2 | App.tsx,App.tsx |

## Chat Component Analysis
Analyzing potential duplication in chat-related components:

### Chat-related Directories
The following directories contain chat-related components:

- `src/components/chat` (160 components)
- `src/components/chat/ChatMessageList.tsx` (1 components)
- `src/components/chat/ChatSidebar.tsx` (1 components)
- `src/components/chat/ai` (4 components)
- `src/components/chat/ai/features` (2 components)
- `src/components/chat/ai/hooks` (0 components)
- `src/components/chat/ChatDialogs.tsx` (1 components)
- `src/components/chat/ChatInputField.tsx` (1 components)
- `src/components/chat/direct-message` (4 components)
- `src/components/chat/ChatGlobal.tsx` (1 components)
- `src/components/chat/groups` (17 components)
- `src/components/chat/groups/hooks` (0 components)
- `src/components/chat/friends` (26 components)
- `src/components/chat/friends/utils` (0 components)
- `src/components/chat/friends/message` (5 components)
- `src/components/chat/friends/enhanced` (1 components)
- `src/components/chat/friends/hooks` (0 components)
- `src/components/chat/friends/list` (3 components)
- `src/components/chat/private` (6 components)
- `src/components/chat/group` (4 components)
- `src/components/chat/ChatPresence.tsx` (1 components)
- `src/components/chat/global` (8 components)
- `src/components/chat/global/ChatSidebar.tsx` (1 components)
- `src/components/chat/global/ChatInput.tsx` (1 components)
- `src/components/chat/global/ChatMessages.tsx` (1 components)
- `src/components/chat/notification` (1 components)
- `src/components/chat/message` (4 components)
- `src/components/chat/security` (4 components)
- `src/components/chat/ChatInterface.tsx` (1 components)
- `src/components/chat/business` (7 components)
- `src/components/chat/recent` (1 components)
- `src/components/chat/ChatConnectionStatus.tsx` (1 components)
- `src/components/chat/ChatList.tsx` (1 components)
- `src/components/chat/hooks` (0 components)
- `src/components/chat/ChatTabs.tsx` (1 components)
- `src/components/chat/ChatHeader.tsx` (1 components)
- `src/components/chat/ChatMessage.tsx` (1 components)
- `src/components/chat/header` (14 components)
- `src/components/chat/header/buttons` (3 components)
- `src/components/chat/header/ChatHeader.tsx` (1 components)
- `src/components/chat/ChatTypingIndicator.tsx` (1 components)
- `src/components/chat/tabs` (9 components)
- `src/components/chat/ChatFriends.tsx` (1 components)
- `src/components/chat/ChatGlassPanel.tsx` (1 components)
- `src/components/mobile/ChatCodeModal.tsx` (1 components)
- `src/features/chat` (24 components)
- `src/features/chat/components` (24 components)
- `src/features/chat/components/ChatMessageList.tsx` (1 components)
- `src/features/chat/components/ChatSidebar.tsx` (1 components)
- `src/features/chat/components/ChatDialogs.tsx` (1 components)
- `src/features/chat/components/common` (0 components)
- `src/features/chat/components/ChatInputField.tsx` (1 components)
- `src/features/chat/components/ChatGlobal.tsx` (1 components)
- `src/features/chat/components/interface` (0 components)
- `src/features/chat/components/private` (0 components)
- `src/features/chat/components/group` (0 components)
- `src/features/chat/components/ChatPresence.tsx` (1 components)
- `src/features/chat/components/global` (0 components)
- `src/features/chat/components/ChatInterface.tsx` (1 components)
- `src/features/chat/components/ChatList.tsx` (1 components)
- `src/features/chat/components/ChatTabs.tsx` (1 components)
- `src/features/chat/components/ChatHeader.tsx` (1 components)
- `src/features/chat/components/ChatMessage.tsx` (1 components)
- `src/features/chat/components/ChatFriends.tsx` (1 components)
- `src/features/chat/components/ChatGlassPanel.tsx` (1 components)
- `src/features/chat/utils` (0 components)
- `src/features/chat/services` (0 components)
- `src/features/chat/hooks` (0 components)
- `src/services/encryption/ChatContext.tsx` (1 components)
- `src/services/encryption/ChatInterface.tsx` (1 components)
- `src/services/encryption/presenters/ChatPresenter.ts` (0 components)
- `src/services/encryption/controllers/ChatController.ts` (0 components)
- `src/services/encryption/models/Chat.ts` (0 components)
- `src/services/chat` (0 components)
- `src/contexts/ChatContext.tsx` (1 components)
- `src/hooks/chat` (0 components)
- `src/app/chat` (1 components)
- `src/app/chat/group` (1 components)
- `src/app/chat/group/[id]` (1 components)
- `src/pages/components/ChatMessageList.tsx` (1 components)
- `src/pages/components/ChatInputField.tsx` (1 components)
- `src/pages/components/ChatInterface.tsx` (1 components)
- `src/pages/components/ChatMessage.tsx` (1 components)
- `src/pages/Chat.tsx` (1 components)
- `src/pages/ChatSettingsPage.tsx` (1 components)
- `src/pages/chat` (7 components)
- `src/pages/chat/components` (2 components)
- `src/pages/chat/components/ChatStateManager.tsx` (1 components)
- `src/pages/chat/components/ChatLayout.tsx` (1 components)
- `src/pages/chat/hooks` (1 components)
- `src/pages/chat/ChatPage.tsx` (1 components)
- `src/controllers/ChatController.ts` (0 components)
- `src/models/Chat.ts` (0 components)

### Potential Component Consolidation
Components with similar functionality that might be consolidated:

#### ChatInterface Components
- `src/components/chat/AppChatInterface.tsx`
- `src/components/chat/ChatInterface.tsx`
- `src/features/chat/components/ChatInterface.tsx`
- `src/pages/components/ChatInterface.tsx`
- `src/services/encryption/ChatInterface.tsx`

#### ChatMessage Components
- `src/components/chat/ChatMessage.tsx`
- `src/components/chat/ChatMessageList.tsx`
- `src/components/chat/global/ChatMessages.tsx`
- `src/components/mobile/pin/MobileChatMessage.tsx`
- `src/components/mobile/pin/MobileChatMessageList.tsx`
- `src/features/chat/components/ChatMessage.tsx`
- `src/features/chat/components/ChatMessageList.tsx`
- `src/pages/components/ChatMessage.tsx`
- `src/pages/components/ChatMessageList.tsx`

#### ChatList Components
- `src/components/chat/ChatList.tsx`
- `src/features/chat/components/ChatList.tsx`

#### ChatInput Components
- `src/components/chat/ChatInputField.tsx`
- `src/components/chat/global/ChatInput.tsx`
- `src/features/chat/components/ChatInputField.tsx`
- `src/pages/components/ChatInputField.tsx`

#### MessageList Components
- `src/components/chat/ChatMessageList.tsx`
- `src/components/chat/GroupMessageList.tsx`
- `src/components/chat/MessageList.tsx`
- `src/components/chat/ai/AIMessageList.tsx`
- `src/components/chat/friends/DirectMessageList.tsx`
- `src/components/chat/groups/GroupMessageList.tsx`
- `src/components/chat/message/ResponsiveMessageList.tsx`
- `src/components/message-list/MessageList.tsx`
- `src/components/message/AppMessageList.tsx`
- `src/components/message/MessageListContent.tsx`
- `src/components/message/MessageListHeader.tsx`
- `src/components/mobile/MobileMessageList.tsx`
- `src/components/mobile/pin/MobileChatMessageList.tsx`
- `src/features/chat/components/ChatMessageList.tsx`
- `src/features/chat/components/GroupMessageList.tsx`
- `src/pages/components/ChatMessageList.tsx`

## Emoji System Analysis
The emoji system appears more organized. This analyzes its structure as a potential model:

### Emoji System Components
- `src/components/emoji/CustomEmojiDisplay.tsx`
- `src/components/emoji/CustomEmojiManager.tsx`
- `src/components/emoji/CustomEmojiTest.tsx`
- `src/components/emoji/CustomEmojiUploader.tsx`
- `src/components/emoji/EmojiAnalytics.tsx`
- `src/components/emoji/EmojiPackBrowser.tsx`
- `src/components/emoji/EmojiSearch.tsx`
- `src/components/emoji/MessageTextWithEmojis.tsx`

### Emoji System Utils
- `src/utils/emojiAnalyticsUtils.ts`
- `src/utils/emojiPackUtils.ts`
- `src/utils/emojiSearchUtils.ts`

### Proposed Feature-based Structure for Emoji System
```
src/features/emoji/
├── components/
│   ├── EmojiSearch.tsx
│   ├── EmojiAnalytics.tsx
│   ├── EmojiPackBrowser.tsx
│   ├── CustomEmojiManager.tsx
│   └── CustomEmojiUploader.tsx
├── hooks/
│   └── useCustomEmojis.ts
├── utils/
│   ├── emojiSearchUtils.ts
│   ├── emojiAnalyticsUtils.ts
│   ├── emojiPackUtils.ts
│   └── customEmojiUtils.ts
├── types.ts
└── index.ts
```

## Scripts and Documentation Analysis
Analysis of scripts and documentation files that could be better organized:

### Documentation Files
There are 61 documentation (.md) files in the root directory.

#### Documentation Categories
Suggested categories for documentation organization:

| Category | Files |
|----------|-------|
| Emoji System | 8 files |
| Deployment | 6 files |

### Scripts Analysis
There are 24 shell scripts (.sh) in the root directory.

#### Script Categories
Suggested categories for script organization:

| Category | Files |
|----------|-------|
| Deployment | 6 files |
| Verification | 8 files |
| Migration | 4 files |
## Recommendations
Based on the analysis, here are the recommended steps for restructuring:

### 1. Consolidate Chat Components
Move all chat-related components into a unified structure:
```
src/features/chat/
├── components/
│   ├── global/      # Global chat components
│   ├── private/     # Private chat components
│   ├── group/       # Group chat components
│   └── common/      # Shared components
├── hooks/
├── services/
└── utils/
```

### 2. Organize Documentation
Move documentation to categorized folders:
```
docs/
├── architecture/     # System design docs
├── deployment/       # Deployment guides
├── features/         # Feature documentation
│   └── emoji/        # Emoji system docs
└── troubleshooting/  # Error resolution guides
```

### 3. Restructure Scripts
Organize scripts by their purpose:
```
scripts/
├── deployment/      # Deployment scripts
├── migration/       # Database migration scripts
├── verification/    # Verification and testing scripts
└── development/     # Development utility scripts
```

### 4. Use the Emoji System as a Model
The emoji system's organization can serve as a model for other features:
- Clear separation of components, utilities, and hooks
- Consistent naming conventions
- Feature-based organization

### 5. Update Import Paths
After restructuring, update import paths throughout the codebase:
1. Create a script to handle common path updates
2. Test incrementally to avoid breaking functionality

