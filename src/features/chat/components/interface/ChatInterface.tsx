import React, { useState } from 'react';
import { cx, theme } from '../lib/theme';
import { ChatMessageList } from './ChatMessageList';
import { ChatInputField } from './ChatInputField';
import { ArrowLeft, User, Users, Info } from 'lucide-react';

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
  // Paginering
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
    <div className="flex flex-col h-full">
      {/* Chat header */}
      {recipientInfo && (
        <div className={cx(
          'flex items-center px-4 py-3 border-b',
          theme.colors.border.medium
        )}>
          {/* Back button for mobile */}
          {onBackToList && (
            <button
              className="mr-2 p-2 rounded-full hover:bg-cyberdark-800"
              onClick={onBackToList}
            >
              <ArrowLeft className="h-4 w-4 text-cybergold-400" />
            </button>
          )}
          
          {/* Avatar */}
          <div className="relative h-8 w-8 rounded-full overflow-hidden bg-cyberdark-800 mr-3">
            {recipientInfo.avatar ? (
              <img
                src={recipientInfo.avatar}
                alt={recipientInfo.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                {isDirectMessage ? (
                  <User className="h-4 w-4 text-cybergold-400" />
                ) : (
                  <Users className="h-4 w-4 text-cybergold-400" />
                )}
              </div>
            )}
            
            {/* Online indicator */}
            {recipientInfo.isOnline !== undefined && (
              <div className={cx(
                'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-cyberdark-950',
                recipientInfo.isOnline ? 'bg-green-500' : 'bg-gray-500'
              )}></div>
            )}
          </div>
          
          {/* Name and status */}
          <div className="flex-grow">
            <div className="font-medium text-cybergold-300">
              {recipientInfo.name}
            </div>
            {recipientInfo.isOnline !== undefined && (
              <div className="text-xs text-cybergold-600">
                {recipientInfo.isOnline ? 'Online' : 'Offline'}
              </div>
            )}
          </div>
          
          {/* Info button */}
          <button
            className="p-2 rounded-full hover:bg-cyberdark-800"
          >
            <Info className="h-4 w-4 text-cybergold-500" />
          </button>
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
      
      {/* Input area */}
      <div className="p-3">
        <ChatInputField
          value={newMessage}
          onChange={onNewMessageChange}
          onSubmit={handleSendMessage}
          placeholder={isDirectMessage ? "Skriv en privat melding..." : "Skriv en melding..."}
          disabled={isLoading || (!!uploadingMedia && uploadingMedia.status === 'uploading')}
          ttl={ttl}
          onTtlChange={onTtlChange}
          isEditing={!!editingMessage}
          onCancelEdit={onCancelEdit}
          isUploading={!!uploadingMedia && uploadingMedia.status === 'uploading'}
        />
        
        {/* Upload progress */}
        {uploadingMedia && uploadingMedia.status === 'uploading' && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-cybergold-500 mb-1">
              <span>Laster opp {uploadingMedia.file.name}...</span>
              <span>{uploadingMedia.progress}%</span>
            </div>
            <div className="h-1 w-full bg-cyberdark-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cybergold-500 transition-all duration-300"
                style={{ width: `${uploadingMedia.progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Upload error */}
        {uploadingMedia && uploadingMedia.status === 'error' && (
          <div className="mt-2 px-3 py-2 bg-red-900/20 border border-red-900/30 rounded-md text-sm text-red-400">
            Det oppstod en feil under opplasting av filen. Vennligst prøv igjen.
          </div>
        )}
      </div>
    </div>
  );
};