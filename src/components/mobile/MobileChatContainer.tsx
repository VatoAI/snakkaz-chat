import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileMessageList from './MobileMessageList';
import { ChatInputField } from '@/components/chat/ChatInputField';
import { ChevronLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { DecryptedMessage } from '@/types/message';
import MobileImageViewer from './MobileImageViewer';
import { UserPresence } from '@/types/presence';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface MobileChatContainerProps {
  messages: DecryptedMessage[];
  currentUserId: string | null;
  conversationId: string;
  onSendMessage: (content: string, mediaFile?: File) => Promise<void>;
  onDeleteMessage?: (messageId: string) => void;
  onLoadMoreMessages?: () => Promise<void>;
  hasMoreMessages?: boolean;
  isLoadingMoreMessages?: boolean;
  chatPartner: {
    id: string;
    username: string;
    avatarUrl?: string;
    presence?: UserPresence;
    isOnline?: boolean;
  };
  isTyping?: boolean;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

export const MobileChatContainer: React.FC<MobileChatContainerProps> = ({
  messages,
  currentUserId,
  conversationId,
  onSendMessage,
  onDeleteMessage,
  onLoadMoreMessages,
  hasMoreMessages = false,
  isLoadingMoreMessages = false,
  chatPartner,
  isTyping = false,
  onBackClick,
  showBackButton = true
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<DecryptedMessage | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  // Only render this component on mobile devices
  if (!isMobile) {
    return null;
  }

  const handleSendMessage = async (text: string, mediaFile?: File) => {
    try {
      await onSendMessage(text, mediaFile);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleReplyMessage = (message: DecryptedMessage) => {
    setReplyToMessage(message);
  };

  const handleMediaClick = (mediaUrl: string) => {
    setViewingImage(mediaUrl);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-cyberdark-950 mobile-dynamic-height">
      {/* Chat header */}
      <div className="bg-cyberdark-900 border-b border-cyberdark-700 py-3 px-4 flex items-center justify-between shadow-sm mobile-top-safe">
        <div className="flex items-center">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBackClick || (() => navigate(-1))}
              className="mr-3 mobile-touch-target"
            >
              <ChevronLeft size={20} />
              <span className="sr-only">Tilbake</span>
            </Button>
          )}
          <Avatar className="h-8 w-8 mr-3">
            {chatPartner.avatarUrl ? (
              <img src={chatPartner.avatarUrl} alt={chatPartner.username} />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-cyberdark-800 text-cybergold-400 text-sm">
                {chatPartner.username.charAt(0).toUpperCase()}
              </div>
            )}
          </Avatar>
          <div>
            <h2 className="font-medium text-sm">{chatPartner.username}</h2>
            <p className="text-xs text-cybergold-500">
              {isTyping 
                ? 'Skriver...' 
                : chatPartner.isOnline 
                  ? 'Pålogget' 
                  : 'Ikke pålogget'}
            </p>
          </div>
        </div>
        <div className="flex">
          <Button variant="ghost" size="icon" className="mobile-touch-target">
            <Phone size={18} />
            <span className="sr-only">Ring</span>
          </Button>
          <Button variant="ghost" size="icon" className="mobile-touch-target">
            <Video size={18} />
            <span className="sr-only">Video</span>
          </Button>
          <Button variant="ghost" size="icon" className="mobile-touch-target">
            <MoreVertical size={18} />
            <span className="sr-only">Mer</span>
          </Button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-hidden">
        <MobileMessageList
          messages={messages}
          currentUserId={currentUserId}
          onDeleteMessage={onDeleteMessage}
          onReplyMessage={handleReplyMessage}
          onLoadMore={onLoadMoreMessages}
          hasMoreMessages={hasMoreMessages}
          isLoadingMoreMessages={isLoadingMoreMessages}
        />
      </div>

      {/* Message input */}
      <div className="border-t border-cyberdark-800 bg-cyberdark-900 py-2 px-2 mobile-bottom-safe">
        <ChatInputField
          value={messageText}
          onChange={setMessageText}
          onSubmit={handleSendMessage}
          placeholder="Skriv en melding..."
          isUploading={isUploading}
          maxMediaSizeMB={10}
          replyToMessage={replyToMessage}
          onCancelReply={() => setReplyToMessage(null)}
        />
      </div>

      {/* Image viewer modal */}
      <AnimatePresence>
        {viewingImage && (
          <MobileImageViewer
            src={viewingImage}
            onClose={() => setViewingImage(null)}
            onDownload={() => {
              // Implement download functionality
              const link = document.createElement('a');
              link.href = viewingImage;
              link.download = viewingImage.split('/').pop() || 'image';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileChatContainer;