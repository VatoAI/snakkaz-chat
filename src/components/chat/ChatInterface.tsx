import React, { useState } from 'react';
import { cx, theme } from '../lib/theme';
import { ChatMessageList } from './ChatMessageList';
import { ChatInputField } from './ChatInputField';
import { ArrowLeft, User, Users, MoreVertical, Phone, Video } from 'lucide-react';

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
      {/* Chat header - redesigned to match Telegram/Signal style */}
      {recipientInfo && (
        <div className="flex items-center px-4 py-3 bg-background border-b border-border h-14">
          {/* Back button for mobile */}
          {onBackToList && (
            <button
              className="mr-2 p-1.5 rounded-full hover:bg-muted"
              onClick={onBackToList}
              aria-label="Tilbake"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          
          {/* Avatar */}
          <div className="relative h-9 w-9 rounded-full overflow-hidden bg-muted mr-3 flex-shrink-0">
            {recipientInfo.avatar ? (
              <img
                src={recipientInfo.avatar}
                alt={recipientInfo.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-primary/10">
                {isDirectMessage ? (
                  <User className="h-5 w-5 text-primary" />
                ) : (
                  <Users className="h-5 w-5 text-primary" />
                )}
              </div>
            )}
            
            {/* Online indicator */}
            {recipientInfo.isOnline !== undefined && (
              <div className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background ${
                recipientInfo.isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`} />
            )}
          </div>
          
          {/* Name and status */}
          <div className="flex-grow min-w-0">
            <div className="font-medium text-foreground truncate">
              {recipientInfo.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {recipientInfo.isOnline ? 'Online nå' : 'Sist sett nylig'}
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {isDirectMessage && (
              <>
                <button
                  className="p-2 rounded-full hover:bg-muted"
                  aria-label="Lydsamtale"
                >
                  <Phone className="h-5 w-5 text-foreground" />
                </button>
                <button
                  className="p-2 rounded-full hover:bg-muted"
                  aria-label="Videosamtale"
                >
                  <Video className="h-5 w-5 text-foreground" />
                </button>
              </>
            )}
            <button
              className="p-2 rounded-full hover:bg-muted"
              aria-label="Flere alternativer"
            >
              <MoreVertical className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>
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
      
      {/* Input area - simplified and optimized for mobile */}
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
        
        {/* Upload progress - simplified */}
        {uploadingMedia && uploadingMedia.status === 'uploading' && (
          <div className="mt-1.5 px-2">
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${uploadingMedia.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};