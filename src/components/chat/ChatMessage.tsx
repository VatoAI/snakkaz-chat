import React, { useState, useEffect } from 'react';
import { formatDistance, format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { cx, theme } from '@/lib/theme';
import { Clock, Download, Edit, Trash2, ExternalLink, X, CheckCheck, Check, Shield, Reply } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ReplyToMessage {
  content: string;
  sender_id: string;
}

interface MediaInfo {
  url: string;
  type?: string;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  media?: MediaInfo | null;
  ttl?: number | null;
  status?: 'sent' | 'delivered' | 'read';
  readBy?: string[];
  replyTo?: string;
  replyToMessage?: ReplyToMessage;
}

interface UserProfile {
  displayName?: string;
  photoURL?: string;
  avatar_url?: string;
  display_name?: string;
  [key: string]: unknown;
}

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  userProfiles?: Record<string, UserProfile>;
  onEdit?: (message: Message) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (message: Message) => void;
  isEncrypted?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isCurrentUser,
  userProfiles = {},
  onEdit,
  onDelete,
  onReply,
  isEncrypted = false,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState<'relative' | 'absolute'>('relative');
  const [isExpiring, setIsExpiring] = useState(false);
  const [remainingTime, setRemainingTime] = useState<string | null>(null);

  const { id, content, sender_id, created_at, media, status, readBy, replyTo, replyToMessage } = message;

  const timeAgo = formatDistance(new Date(created_at), new Date(), { 
    addSuffix: true,
    locale: nb 
  });

  const absoluteTime = format(new Date(created_at), 'HH:mm - d. MMM yyyy', {
    locale: nb
  });

  const senderProfile = userProfiles[sender_id] || { 
    display_name: 'Ukjent bruker',
    avatar_url: null
  };

  const isImage = media?.type?.startsWith('image/');

  useEffect(() => {
    if (!message.ttl) return;

    const expirationTime = new Date(created_at).getTime() + message.ttl * 1000;
    const now = Date.now();
    const timeLeft = expirationTime - now;

    if (timeLeft <= 0) {
      setRemainingTime('Utløpt');
      return;
    }

    if (timeLeft < 30000) {
      setIsExpiring(true);
    }

    const updateRemainingTime = () => {
      const now = Date.now();
      const timeLeft = expirationTime - now;

      if (timeLeft <= 0) {
        setRemainingTime('Utløpt');
        return;
      }

      if (timeLeft < 60000) {
        setRemainingTime(`${Math.floor(timeLeft / 1000)}s`);
      } else if (timeLeft < 3600000) {
        setRemainingTime(`${Math.floor(timeLeft / 60000)}m`);
      } else {
        setRemainingTime(`${Math.floor(timeLeft / 3600000)}t`);
      }
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [message.ttl, created_at]);

  const getFileIcon = () => {
    if (!media?.type) return null;

    if (media.type.startsWith('image/')) {
      return null;
    } else if (media.type.startsWith('video/')) {
      return '🎬';
    } else if (media.type.startsWith('audio/')) {
      return '🎵';
    } else if (media.type.includes('pdf')) {
      return '📄';
    } else if (media.type.includes('word') || media.type.includes('document')) {
      return '📝';
    } else if (media.type.includes('spreadsheet') || media.type.includes('excel')) {
      return '📊';
    } else if (media.type.includes('presentation') || media.type.includes('powerpoint')) {
      return '📊';
    } else {
      return '📎';
    }
  };

  const fileIcon = getFileIcon();

  const handleMediaClick = () => {
    if (isImage) {
      setShowFullImage(true);
    } else if (media?.url) {
      window.open(media.url, '_blank');
    }
  };

  const toggleTimeDisplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTimeDisplay(prev => prev === 'relative' ? 'absolute' : 'relative');
  };

  const renderMessageStatus = () => {
    if (!isCurrentUser) return null;

    if (status === 'read' && readBy && readBy.length > 0) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <div className="flex items-center text-cyberblue-400" title="Lest">
                <CheckCheck className="h-3 w-3" />
                {readBy.length > 1 && (
                  <span className="text-[10px] ml-0.5">{readBy.length}</span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-cyberdark-800 border-cyberdark-700 text-xs py-1 px-2">
              <p>Lest av {readBy.length} {readBy.length === 1 ? 'person' : 'personer'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    switch (status) {
      case 'read':
        return (
          <div className="flex items-center text-cyberblue-400" title="Lest">
            <CheckCheck className="h-3 w-3" />
          </div>
        );
      case 'delivered':
        return (
          <div className="flex items-center text-cybergold-400" title="Levert">
            <CheckCheck className="h-3 w-3" />
          </div>
        );
      case 'sent':
      default:
        return (
          <div className="flex items-center text-cybergold-600" title="Sendt">
            <Check className="h-3 w-3" />
          </div>
        );
    }
  };

  return (
    <div className={cn(
      'relative py-1 animate-slide-up',
      replyToMessage ? 'mt-6' : 'mt-1'
    )}>
      {replyToMessage && (
        <div className={cn(
          'absolute top-0 transform -translate-y-full',
          isCurrentUser ? 'right-4' : 'left-11',
          'max-w-[80%] opacity-80 hover:opacity-100 transition-opacity'
        )}>
          <div className={cn(
            'flex items-center gap-1 p-1 px-2 rounded-t-md text-xs',
            'bg-cyberdark-800/80 border-l-2 border-cybergold-500',
            'max-w-full overflow-hidden'
          )}>
            <Reply className="h-3 w-3 text-cybergold-400" />
            <span className="font-medium text-cybergold-400 truncate">
              {userProfiles[replyToMessage.sender_id]?.display_name || 'Ukjent bruker'}:
            </span>
            <span className="text-cybergold-500 truncate">
              {replyToMessage.content || '[media]'}
            </span>
          </div>
        </div>
      )}

      <div className={cn(
        'flex items-end gap-2',
        isCurrentUser && 'flex-row-reverse'
      )}>
        {!isCurrentUser && (
          <div className="h-8 w-8 rounded-full overflow-hidden bg-cyberdark-700 flex-shrink-0 border border-cyberdark-600 shadow-sm">
            {senderProfile.avatar_url ? (
              <img 
                src={senderProfile.avatar_url} 
                alt={senderProfile.display_name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs font-medium text-cybergold-400 bg-gradient-to-br from-cyberdark-700 to-cyberdark-800">
                {senderProfile.display_name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
        )}

        <div 
          className={cn(
            'group relative max-w-[85%] rounded-xl py-2 px-3 transition-all duration-200',
            'shadow-sm hover:shadow-md',
            isCurrentUser ? 
              'rounded-tr-sm bg-gradient-to-br from-cybergold-900/50 to-cyberdark-900 border-b border-r border-cybergold-700/30' : 
              'rounded-tl-sm bg-gradient-to-br from-cyberdark-800 to-cyberdark-900 border-b border-l border-cyberdark-700',
            message.ttl ? 'border border-amber-700/40' : '',
            isEncrypted ? 'border-l-2 border-l-green-500/50' : '',
            isExpiring && 'animate-pulse'
          )}
          onMouseEnter={() => setShowOptions(true)}
          onMouseLeave={() => setShowOptions(false)}
        >
          {!isCurrentUser && (
            <div className="flex items-center mb-1">
              <span className="text-xs font-medium text-cybergold-400">{senderProfile.display_name}</span>
            </div>
          )}

          {media?.url && isImage && (
            <div 
              className="relative rounded-md overflow-hidden mb-2 cursor-pointer group/image"
              onClick={handleMediaClick}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
              <img 
                src={media.url} 
                alt="Vedlagt bilde" 
                className="w-full max-h-60 object-contain bg-cyberdark-900 transition-transform duration-300 group-hover/image:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute bottom-2 right-2 bg-cyberdark-950/80 rounded-full p-1 transition-opacity duration-200 opacity-50 group-hover/image:opacity-100">
                <ExternalLink className="h-4 w-4 text-cybergold-400" />
              </div>
              
              {isEncrypted && (
                <div className="absolute top-2 left-2 bg-green-900/70 rounded-full p-1.5 shadow-sm">
                  <Shield className="h-3 w-3 text-green-300" />
                </div>
              )}
            </div>
          )}

          {media?.url && !isImage && (
            <div 
              className="flex items-center bg-gradient-to-r from-cyberdark-900 to-cyberdark-850 rounded-md p-2 mb-2 cursor-pointer hover:bg-cyberdark-800 transition-all duration-200 border border-cyberdark-700 hover:border-cybergold-900/30"
              onClick={handleMediaClick}
            >
              <div className="text-2xl mr-2">{fileIcon}</div>
              <div className="flex-grow overflow-hidden">
                <div className="text-sm text-cybergold-300 truncate">
                  {media.url.split('/').pop()}
                </div>
                <div className="text-xs text-cybergold-600">
                  {media.type || 'Ukjent filtype'}
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center">
                {isEncrypted && <Shield className="h-3 w-3 text-green-400 mr-1.5" />}
                <Download className="h-4 w-4 text-cybergold-500 transition-transform duration-200 hover:scale-110 hover:text-cybergold-400" />
              </div>
            </div>
          )}

          {content && (
            <div className={cn(
              'text-sm whitespace-pre-wrap',
              isCurrentUser ? 'text-cybergold-100' : 'text-cybergold-200'
            )}>
              {content}
            </div>
          )}

          <div className={cn(
            'flex items-center mt-1.5 gap-1.5 text-[10px]',
            isCurrentUser ? 'justify-start flex-row-reverse' : 'justify-end'
          )}>
            {renderMessageStatus()}

            <span 
              className="text-cybergold-600 cursor-pointer hover:text-cybergold-500 transition-colors"
              onClick={toggleTimeDisplay}
              title="Klikk for å endre tidsformat"
            >
              {timeDisplay === 'relative' ? timeAgo : absoluteTime}
            </span>

            {message.ttl && remainingTime && (
              <div className={cn(
                'flex items-center',
                isExpiring ? 'text-red-400' : 'text-amber-400/80'
              )}>
                <Clock className="h-3 w-3 mr-0.5" />
                <span>{remainingTime}</span>
              </div>
            )}

            {isEncrypted && (
              <div className="flex items-center text-green-400/90">
                <Shield className="h-3 w-3" />
              </div>
            )}
          </div>

          {showOptions && (
            <div className={cn(
              'absolute top-1 flex gap-1 bg-cyberdark-950/85 backdrop-blur-sm rounded-full p-0.5 shadow-md border border-cyberdark-800',
              'opacity-0 animate-fade-in',
              isCurrentUser ? 'left-1' : 'right-1'
            )}>
              {onReply && (
                <button 
                  className="p-1.5 hover:bg-cybergold-500/20 rounded-full transition-colors"
                  onClick={() => onReply(message)}
                  title="Svar på melding"
                >
                  <Reply className="h-3 w-3 text-cybergold-400" />
                </button>
              )}

              {onEdit && isCurrentUser && (
                <button 
                  className="p-1.5 hover:bg-cybergold-500/20 rounded-full transition-colors"
                  onClick={() => onEdit(message)}
                  title="Rediger melding"
                >
                  <Edit className="h-3 w-3 text-cybergold-400" />
                </button>
              )}

              {onDelete && isCurrentUser && (
                <button 
                  className="p-1.5 hover:bg-red-500/20 rounded-full transition-colors"
                  onClick={() => onDelete(id)}
                  title="Slett melding"
                >
                  <Trash2 className="h-3 w-3 text-red-400" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showFullImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-cyberdark-950/95 p-4 animate-fade-in"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button 
              className="absolute top-2 right-2 bg-cyberdark-900/90 p-2 rounded-full z-10 hover:bg-cyberdark-800 transition-colors shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                setShowFullImage(false);
              }}
            >
              <X className="h-5 w-5 text-white" />
            </button>

            <img 
              src={media?.url} 
              alt="Forstørret bilde"
              className="w-full h-full object-contain rounded-md shadow-xl"
            />

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-cyberdark-900/90 backdrop-blur-sm rounded-lg px-4 py-2 text-sm border border-cyberdark-700 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <span className="text-cybergold-500 mr-1">Fra:</span>
                  <span className="text-cybergold-300 font-medium">{senderProfile.display_name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-cybergold-500 mr-1">Dato:</span>
                  <span className="text-cybergold-300">{absoluteTime}</span>
                </div>
                {isEncrypted && (
                  <div className="flex items-center text-green-400 bg-green-900/20 rounded-full px-2 py-0.5">
                    <Shield className="h-4 w-4 mr-1" />
                    <span>Kryptert</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};