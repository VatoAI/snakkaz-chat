import React, { useState } from 'react';
import { ChatInputField } from './ChatInputField';
import ChatMessageList from './ChatMessageList';
import { ChatHeader } from './header/ChatHeader';
import { UploadProgress } from './message/UploadProgress';
import { UserStatus } from '@/types/presence';
import PinnedMessages from './PinnedMessages';
import { DecryptedMessage } from '@/types/message.d';
import { MobileChatMessageList } from '../mobile/pin/MobileChatMessageList';
import { useIsMobile } from '@/hooks/useIsMobile';

// Define UserProfile directly in the file to avoid import issues
interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  [key: string]: unknown;
}

interface ChatInterfaceProps {
  messages: Array<DecryptedMessage>;
  currentUserId: string;
  userProfiles?: Record<string, UserProfile>;
  newMessage: string;
  onNewMessageChange: (message: string) => void;
  onSendMessage: (text: string, mediaFile?: File) => Promise<void>;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
  onPinMessage?: (messageId: string) => Promise<void>;
  onUnpinMessage?: (messageId: string) => Promise<void>;
  pinnedMessages?: Array<DecryptedMessage>;
  showPinnedMessages?: boolean;
  chatId?: string;
  chatType?: 'private' | 'group' | 'global';
  encryptionKey?: string;
  isLoading?: boolean;
  recipientInfo?: {
    name: string;
    avatar?: string;
    isOnline?: boolean;
    status?: UserStatus;
  };
  isDirectMessage?: boolean;
  onBackToList?: () => void;
  ttl?: number;
  onTtlChange?: (ttl: number) => void;
  editingMessage?: DecryptedMessage | null;
  onCancelEdit?: () => void;
  uploadingMedia?: {
    file: File;
    progress: number;
    status: 'uploading' | 'error' | 'success';
  } | null;
  hasMoreMessages?: boolean;
  isLoadingMoreMessages?: boolean;
  onLoadMoreMessages?: () => void;
  canPin?: boolean;
  pinnedMessageIds?: Set<string>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  currentUserId,
  userProfiles,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onPinMessage,
  onUnpinMessage,
  pinnedMessages = [],
  showPinnedMessages = true,
  chatId,
  chatType = 'private',
  encryptionKey,
  isLoading = false,
  recipientInfo,
  isDirectMessage = false,
  onBackToList,
  ttl = 0,
  onTtlChange,
  editingMessage,
  onCancelEdit,
  uploadingMedia,
  hasMoreMessages = false,
  isLoadingMoreMessages = false,
  onLoadMoreMessages,
  canPin = true,
  pinnedMessageIds = new Set<string>()
}) => {
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [pinnedSectionVisible, setPinnedSectionVisible] = useState(true);
  const isMobile = useIsMobile();
  
  const handleSendMessage = async (text: string, mediaFile?: File) => {
    if (mediaFile) {
      setIsUploadingMedia(true);
    }
    
    try {
      await onSendMessage(text, mediaFile);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  // Handle message pin/unpin actions
  const handlePinMessage = async (messageId: string) => {
    if (onPinMessage) {
      await onPinMessage(messageId);
    }
  };

  const handleUnpinMessage = async (messageId: string) => {
    if (onUnpinMessage) {
      await onUnpinMessage(messageId);
    }
  };

  // Toggle pinned messages visibility
  const togglePinnedMessages = () => {
    setPinnedSectionVisible(!pinnedSectionVisible);
  };
  
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat header */}
      {recipientInfo && (
        <ChatHeader 
          recipientInfo={recipientInfo}
          isDirectMessage={isDirectMessage}
          onBackToList={onBackToList}
          pinnedCount={pinnedMessages.length}
          onTogglePinnedMessages={togglePinnedMessages}
          showPinnedBadge={showPinnedMessages && pinnedMessages.length > 0}
        />
      )}

      {/* Pinned messages section */}
      {showPinnedMessages && pinnedSectionVisible && pinnedMessages.length > 0 && (
        <PinnedMessages
          chatId={chatId || ''}
          chatType={chatType}
          encryptionKey={encryptionKey}
          onUnpin={canPin ? handleUnpinMessage : undefined}
          canUnpin={canPin}
        />
      )}
      
      {/* Messages area - conditionally render mobile or desktop version */}
      {isMobile ? (
        <MobileChatMessageList
          messages={messages}
          currentUserId={currentUserId}
          userProfiles={userProfiles}
          onEdit={onEditMessage}
          onDelete={onDeleteMessage}
          onPin={canPin ? handlePinMessage : undefined}
          onUnpin={canPin ? handleUnpinMessage : undefined}
          onCopy={(content) => navigator.clipboard.writeText(content)}
          onShare={(message) => console.log('share', message)}
          chatType={chatType}
          isLoading={isLoading}
          hasMoreMessages={hasMoreMessages}
          isLoadingMoreMessages={isLoadingMoreMessages}
          onLoadMore={onLoadMoreMessages}
          className="flex-grow"
          pinnedMessageIds={pinnedMessageIds}
          canPin={canPin}
          chatId={chatId}
        />
      ) : (
        <ChatMessageList
          messages={messages}
          currentUserId={currentUserId}
          userProfiles={userProfiles}
          onEdit={onEditMessage}
          onDelete={onDeleteMessage}
          onPin={canPin ? handlePinMessage : undefined}
          chatType={chatType}
          isLoading={isLoading}
          hasMoreMessages={hasMoreMessages}
          isLoadingMore={isLoadingMoreMessages}
          onLoadMore={onLoadMoreMessages}
          className="flex-grow"
          pinnedMessageIds={pinnedMessageIds}
          canPin={canPin}
        />
      )}
      
      {/* Input area */}
      <div className="px-2 py-1.5 border-t border-border">
        <ChatInputField
          value={newMessage}
          onChange={onNewMessageChange}
          onSubmit={handleSendMessage}
          placeholder={isDirectMessage ? "Melding..." : "Melding..."}
          disabled={isLoading || (!!uploadingMedia && uploadingMedia.status === 'uploading')}
          ttl={ttl}
          onTtlChange={onTtlChange}
          isEditing={!!editingMessage}
          onCancelEdit={onCancelEdit}
          isUploading={!!uploadingMedia && uploadingMedia.status === 'uploading'}
        />
        
        {/* Upload progress - now using the extracted UploadProgress component */}
        {uploadingMedia && (
          <UploadProgress 
            progress={uploadingMedia.progress}
            status={uploadingMedia.status}
          />
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
