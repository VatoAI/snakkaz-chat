import React, { useState } from 'react';
import { ChatMessageList } from './ChatMessageList';
import { ChatInputField } from './ChatInputField';
import { ChatHeader } from './header/ChatHeader';
import { UploadProgress } from './message/UploadProgress';

interface ChatInterfaceProps {
  messages: Array<any>;
  currentUserId: string;
  userProfiles?: Record<string, any>;
  newMessage: string;
  onNewMessageChange: (message: string) => void;
  onSendMessage: (text: string, mediaFile?: File) => Promise<void>;
  onEditMessage?: (message: any) => void;
  onDeleteMessage?: (messageId: string) => void;
  isLoading?: boolean;
  recipientInfo?: {
    name: string;
    avatar?: string;
    isOnline?: boolean;
  };
  isDirectMessage?: boolean;
  onBackToList?: () => void;
  ttl?: number;
  onTtlChange?: (ttl: number) => void;
  editingMessage?: any;
  onCancelEdit?: () => void;
  uploadingMedia?: {
    file: File;
    progress: number;
    status: 'uploading' | 'error' | 'success';
  } | null;
  hasMoreMessages?: boolean;
  isLoadingMoreMessages?: boolean;
  onLoadMoreMessages?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  currentUserId,
  userProfiles,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
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
  onLoadMoreMessages
}) => {
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  
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
  
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat header - now using the extracted ChatHeader component */}
      {recipientInfo && (
        <ChatHeader 
          recipientInfo={recipientInfo}
          isDirectMessage={isDirectMessage}
          onBackToList={onBackToList}
        />
      )}
      
      {/* Messages area */}
      <ChatMessageList
        messages={messages}
        currentUserId={currentUserId}
        userProfiles={userProfiles}
        onEdit={onEditMessage}
        onDelete={onDeleteMessage}
        isLoading={isLoading}
        hasMoreMessages={hasMoreMessages}
        isLoadingMoreMessages={isLoadingMoreMessages}
        onLoadMore={onLoadMoreMessages}
        className="flex-grow"
      />
      
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