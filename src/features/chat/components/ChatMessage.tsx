import React, { useState, useEffect, useCallback } from 'react';
import { formatDistance, format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { cx, theme } from '@/lib/theme';
import { 
  Clock, 
  Download, 
  Edit, 
  Trash2, 
  ExternalLink, 
  X, 
  CheckCheck, 
  Check, 
  Shield, 
  Reply,
  FileIcon,
  Film,
  Music,
  FileText,
  Image as ImageIcon,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ReplyToMessage {
  content: string;
  sender_id: string;
}

interface MediaInfo {
  url: string;
  type?: string;
  filename?: string;
  size?: number;
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
  username?: string;
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
  onDownload?: (url: string, filename: string) => Promise<void>;
  securityLevel?: 'standard' | 'server_e2ee' | 'p2p_e2ee';
}

// Define the MessageOptionButton component
interface MessageOptionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  size?: 'sm' | 'md';
}

const MessageOptionButton: React.FC<MessageOptionButtonProps> = ({ 
  onClick, 
  icon, 
  title, 
  variant = 'default', 
  disabled = false,
  size = 'md'
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        'rounded-full flex items-center justify-center transition-colors',
        size === 'sm' ? 'p-1 h-6 w-6' : 'p-1.5 h-8 w-8',
        variant === 'danger' 
          ? 'hover:bg-red-500/20 text-red-400' 
          : 'hover:bg-cyberdark-700 text-cybergold-400',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {icon}
    </button>
  );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isCurrentUser,
  userProfiles = {},
  onEdit,
  onDelete,
  onReply,
  isEncrypted = false,
  onDownload,
  securityLevel = 'standard'
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState<'relative' | 'absolute'>('relative');
  const [isExpiring, setIsExpiring] = useState(false);
  const [remainingTime, setRemainingTime] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

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
    username: 'Ukjent',
    avatar_url: null
  };

  const displayName = senderProfile.display_name || senderProfile.username || 'Ukjent bruker';
  const isImage = media?.type?.startsWith('image/');
  const isVideo = media?.type?.startsWith('video/');
  const isAudio = media?.type?.startsWith('audio/');

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

  const getSecurityColors = () => {
    switch(securityLevel) {
      case 'p2p_e2ee':
        return {
          textColor: 'text-emerald-400',
          bgColor: 'bg-emerald-900/30',
          borderColor: 'border-emerald-500/50',
          icon: <Shield className="h-3 w-3" />
        };
      case 'server_e2ee': 
        return {
          textColor: 'text-blue-400',
          bgColor: 'bg-blue-900/30',
          borderColor: 'border-blue-500/50',
          icon: <Shield className="h-3 w-3" />
        };
      default:
        return {
          textColor: 'text-gray-400',
          bgColor: 'bg-gray-900/20',
          borderColor: 'border-gray-500/30',
          icon: null
        };
    }
  };

  const securityColors = getSecurityColors();

  const formatFileSize = (sizeInBytes: number | undefined) => {
    if (!sizeInBytes) return '';
    
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else if (sizeInBytes < 1024 * 1024 * 1024) {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };

  const getFileIcon = () => {
    if (!media?.type) return <FileIcon className="h-5 w-5 text-cybergold-400" />;

    if (media.type.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5 text-blue-400" />;
    } else if (media.type.startsWith('video/')) {
      return <Film className="h-5 w-5 text-purple-400" />;
    } else if (media.type.startsWith('audio/')) {
      return <Music className="h-5 w-5 text-green-400" />;
    } else if (media.type.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-400" />;
    } else if (media.type.includes('word') || media.type.includes('document')) {
      return <FileText className="h-5 w-5 text-blue-400" />;
    } else if (media.type.includes('spreadsheet') || media.type.includes('excel')) {
      return <FileText className="h-5 w-5 text-green-400" />;
    } else if (media.type.includes('presentation') || media.type.includes('powerpoint')) {
      return <FileText className="h-5 w-5 text-orange-400" />;
    } else {
      return <FileIcon className="h-5 w-5 text-cybergold-400" />;
    }
  };
  
  const fileIcon = getFileIcon();
  const fileName = media?.filename || media?.url?.split('/').pop() || 'fil';

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

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!media?.url || isDownloading) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadError(null);
    
    try {
      if (onDownload) {
        await onDownload(media.url, fileName);
      } else {
        const response = await fetch(media.url);
        if (!response.ok) {
          throw new Error(`Failed to download: ${response.statusText}`);
        }
        
        const contentLength = parseInt(response.headers.get('Content-Length') || '0');
        const reader = response.body?.getReader();
        
        if (reader) {
          let receivedLength = 0;
          const chunks: Uint8Array[] = [];
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            chunks.push(value);
            receivedLength += value.length;
            
            if (contentLength > 0) {
              setDownloadProgress(Math.round((receivedLength / contentLength) * 100));
            }
          }
          
          const allChunks = new Uint8Array(receivedLength);
          let position = 0;
          for (const chunk of chunks) {
            allChunks.set(chunk, position);
            position += chunk.length;
          }
          
          const blob = new Blob(chunks);
          const url = URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          URL.revokeObjectURL(url);
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      setDownloadError(error instanceof Error ? error.message : 'Nedlastingsfeil');
    } finally {
      setIsDownloading(false);
    }
  };

  const copyMessageContent = () => {
    if (content) {
      navigator.clipboard.writeText(content)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(err => console.error('Failed to copy:', err));
    }
  };

  const handleDeleteClick = () => {
    setConfirmDelete(true);
  };

  const confirmDeleteMessage = () => {
    if (onDelete) {
      onDelete(id);
    }
    setConfirmDelete(false);
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
            <TooltipContent side="top" className="bg-cyberdark-800 border border-cyberdark-700 text-xs py-1 px-2">
              <p>Lest av {readBy.length} {readBy.length === 1 ? 'person' : 'personer'}</p>
              {readBy.length <= 5 && (
                <ul className="mt-1 text-[10px]">
                  {readBy.map(id => (
                    <li key={id}>
                      {userProfiles[id]?.display_name || 
                       userProfiles[id]?.username || 
                       id.substring(0, 8)}
                    </li>
                  ))}
                </ul>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    switch (status) {
      case 'read':
        return (
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <div className="flex items-center text-cyberblue-400" title="Lest">
                  <CheckCheck className="h-3 w-3" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-cyberdark-800 border border-cyberdark-700 text-xs py-1 px-2">
                <p>Meldingen er lest</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'delivered':
        return (
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <div className="flex items-center text-cybergold-400" title="Levert">
                  <CheckCheck className="h-3 w-3" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-cyberdark-800 border border-cyberdark-700 text-xs py-1 px-2">
                <p>Meldingen er levert</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'sent':
      default:
        return (
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <div className="flex items-center text-cybergold-600" title="Sendt">
                  <Check className="h-3 w-3" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-cyberdark-800 border border-cyberdark-700 text-xs py-1 px-2">
                <p>Meldingen er sendt</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
    }
  };

  return (
    <div className={cn(
      'relative py-1',
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
              {userProfiles[replyToMessage.sender_id]?.display_name || 
                userProfiles[replyToMessage.sender_id]?.username || 
                'Ukjent bruker'}:
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
          <div className="h-8 w-8 rounded-full overflow-hidden bg-cyberdark-700 flex-shrink-0 border border-cyberdark-800">
            {senderProfile.avatar_url ? (
              <img 
                src={senderProfile.avatar_url} 
                alt={displayName} 
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23ffd54d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>`;
                }}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-cybergold-400">
                {displayName[0].toUpperCase()}
              </div>
            )}
          </div>
        )}

        <div 
          className={cn(
            'group relative max-w-[85%] rounded-xl py-2 px-3',
            isCurrentUser 
              ? 'rounded-tr-sm bg-gradient-to-br from-cybergold-900/40 to-cybergold-900/30 border border-cybergold-800/30' 
              : 'rounded-tl-sm bg-cyberdark-800/90 border border-cyberdark-700/50',
            message.ttl ? 'border border-amber-700/30' : '',
            securityLevel !== 'standard' ? `border-l-2 ${securityColors.borderColor}` : '',
            isExpiring && 'animate-pulse'
          )}
          onMouseEnter={() => setShowOptions(true)}
          onMouseLeave={() => setShowOptions(false)}
        >
          {securityLevel !== 'standard' && (
            <div className={`absolute top-0 right-0 rounded-tl-lg rounded-br-lg ${securityColors.bgColor} py-0.5 px-1 flex items-center gap-1 text-[9px] ${securityColors.textColor}`}>
              {securityColors.icon}
              {securityLevel === 'p2p_e2ee' ? 'E2E' : 'E2E-S'}
            </div>
          )}

          {!isCurrentUser && (
            <div className="flex items-center mb-1">
              <span className="text-xs font-medium text-cybergold-400">{displayName}</span>
            </div>
          )}

          {media?.url && isImage && (
            <div 
              className="relative rounded-md overflow-hidden mb-2 cursor-pointer group"
              onClick={handleMediaClick}
            >
              <img 
                src={media.url} 
                alt="Vedlagt bilde" 
                className="w-full max-h-60 object-contain bg-cyberdark-900"
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cyberdark-950/70 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="absolute top-2 left-2 flex gap-1">
                {securityLevel !== 'standard' && (
                  <div className={`${securityColors.bgColor} rounded-full p-1`}>
                    {securityColors.icon}
                  </div>
                )}
                {message.ttl && (
                  <div className="bg-amber-900/60 rounded-full p-1">
                    <Clock className="h-3 w-3 text-amber-400" />
                  </div>
                )}
              </div>
              
              <div className="absolute bottom-2 right-2 bg-cyberdark-950/70 rounded-full p-1">
                <ExternalLink className="h-4 w-4 text-cybergold-400" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-2 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-cybergold-400 truncate max-w-[60%]">
                  {media.filename || 'Bilde'}
                </span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-1 rounded-full bg-cyberdark-900/80 hover:bg-cyberdark-800"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <div className="h-4 w-4 border-2 border-t-transparent border-cybergold-400 rounded-full animate-spin"></div>
                  ) : (
                    <Download className="h-4 w-4 text-cybergold-400" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {media?.url && isVideo && (
            <div className="relative rounded-md overflow-hidden mb-2 bg-cyberdark-900 border border-cyberdark-700">
              <video 
                className="w-full max-h-60" 
                controls
                controlsList="nodownload"
                poster={media.url + '?poster=true'}
              >
                <source src={media.url} type={media.type} />
                Din nettleser støtter ikke videoavspilling.
              </video>
              
              <div className="absolute right-2 top-2 flex gap-1">
                {securityLevel !== 'standard' && (
                  <div className={`${securityColors.bgColor} rounded-full p-1`}>
                    {securityColors.icon}
                  </div>
                )}
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-1 rounded-full bg-cyberdark-900/80 hover:bg-cyberdark-800"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <div className="h-4 w-4 border-2 border-t-transparent border-cybergold-400 rounded-full animate-spin"></div>
                  ) : (
                    <Download className="h-4 w-4 text-cybergold-400" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {media?.url && isAudio && (
            <div className="relative rounded-md mb-2 bg-cyberdark-900 border border-cyberdark-700 p-2">
              <div className="flex items-center gap-2 mb-1">
                <Music className="h-4 w-4 text-cybergold-400" />
                <span className="text-xs text-cybergold-300 truncate">
                  {media.filename || 'Lydklipp'}
                </span>
                {securityLevel !== 'standard' && securityColors.icon}
              </div>
              <audio controls className="w-full">
                <source src={media.url} type={media.type} />
                Din nettleser støtter ikke lydavspilling.
              </audio>
              <div className="absolute right-2 top-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0.5 rounded-full bg-cyberdark-800/80 hover:bg-cyberdark-700"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <div className="h-3 w-3 border-2 border-t-transparent border-cybergold-400 rounded-full animate-spin"></div>
                  ) : (
                    <Download className="h-3 w-3 text-cybergold-400" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {media?.url && !isImage && !isVideo && !isAudio && (
            <div 
              className="flex items-center bg-cyberdark-900 rounded-md p-2 mb-2 cursor-pointer hover:bg-cyberdark-800 transition-colors"
              onClick={handleMediaClick}
            >
              <div className="mr-2">{fileIcon}</div>
              <div className="flex-grow overflow-hidden">
                <div className="text-sm text-cybergold-300 truncate">
                  {fileName}
                </div>
                <div className="flex items-center text-xs text-cybergold-600">
                  <span>{media.type?.split('/')[1] || 'Fil'}</span>
                  {media.size && (
                    <span className="ml-1">({formatFileSize(media.size)})</span>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center">
                {securityLevel !== 'standard' && securityColors.icon}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-1 rounded-full hover:bg-cyberdark-700"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <div className="h-4 w-4 border-2 border-t-transparent border-cybergold-400 rounded-full animate-spin"></div>
                  ) : (
                    <Download className="h-4 w-4 text-cybergold-400" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {isDownloading && downloadProgress > 0 && (
            <div className="mb-2">
              <div className="flex justify-between items-center text-xs text-cybergold-500 mb-1">
                <span>Laster ned...</span>
                <span>{downloadProgress}%</span>
              </div>
              <div className="h-1 bg-cyberdark-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cybergold-500" 
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {downloadError && (
            <div className="flex items-center gap-1 text-xs text-red-400 mb-2">
              <AlertCircle className="h-3 w-3" />
              <span>{downloadError}</span>
            </div>
          )}

          {content && (
            <div className={cn(
              'text-sm whitespace-pre-wrap break-words',
              isCurrentUser ? 'text-cybergold-200' : 'text-cybergold-300'
            )}>
              {content}
            </div>
          )}

          <div className={cn(
            'flex items-center mt-1 gap-1.5 text-[10px]',
            isCurrentUser ? 'justify-start flex-row-reverse' : 'justify-end'
          )}>
            {renderMessageStatus()}

            <span 
              className="text-cybergold-600 cursor-pointer hover:text-cybergold-500"
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

            {securityLevel !== 'standard' && (
              <div className={`flex items-center ${securityColors.textColor}`}>
                {securityColors.icon}
              </div>
            )}
          </div>

          {showOptions && (
            <div className={cn(
              'absolute top-1 flex gap-1 bg-cyberdark-950/70 backdrop-blur-sm rounded-full p-0.5',
              isCurrentUser ? 'left-1' : 'right-1'
            )}>
              {content && (
                <MessageOptionButton 
                  onClick={copyMessageContent}
                  icon={isCopied ? <CheckCircle className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3 text-cybergold-400" />}
                  title="Kopier tekst"
                />
              )}
              
              {onReply && (
                <MessageOptionButton 
                  onClick={() => onReply(message)}
                  icon={<Reply className="h-3 w-3 text-cybergold-400" />}
                  title="Svar på melding"
                />
              )}

              {onEdit && isCurrentUser && !message.ttl && (
                <MessageOptionButton 
                  onClick={() => onEdit(message)}
                  icon={<Edit className="h-3 w-3 text-cybergold-400" />}
                  title="Rediger melding"
                />
              )}

              {onDelete && isCurrentUser && (
                <MessageOptionButton 
                  onClick={handleDeleteClick}
                  icon={<Trash2 className="h-3 w-3 text-red-400" />}
                  title="Slett melding"
                  variant="danger"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {showFullImage && media?.url && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-cyberdark-950/95 p-4 backdrop-blur-sm"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button 
              className="absolute top-2 right-2 bg-cyberdark-900/80 p-2 rounded-full z-10 hover:bg-cyberdark-800"
              onClick={(e) => {
                e.stopPropagation();
                setShowFullImage(false);
              }}
            >
              <X className="h-5 w-5 text-white" />
            </button>

            <img 
              src={media.url} 
              alt="Forstørret bilde"
              className="w-full h-full object-contain"
            />

            <div className="absolute bottom-4 left-0 right-0 mx-auto max-w-md bg-cyberdark-900/80 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
                  <div className="flex items-center">
                    <span className="text-cybergold-400 mr-1">Fra:</span>
                    <span className="text-cybergold-300">{displayName}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-cybergold-400 mr-1">Dato:</span>
                    <span className="text-cybergold-300">{absoluteTime}</span>
                  </div>
                  {securityLevel !== 'standard' && (
                    <div className={`flex items-center ${securityColors.textColor}`}>
                      {securityColors.icon}
                      <span className="ml-1">
                        {securityLevel === 'p2p_e2ee' ? 'E2E-kryptert' : 'Server-kryptert'}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="bg-transparent border-cybergold-500/50 hover:bg-cybergold-900/30"
                >
                  {isDownloading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-t-transparent border-cybergold-400 rounded-full animate-spin mr-1"></div>
                      <span className="text-cybergold-300">{downloadProgress}%</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-1 text-cybergold-400" />
                      <span className="text-cybergold-300">Last ned</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent className="bg-cyberdark-900 border border-cybergold-500/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-cybergold-400">Slett melding</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Er du sikker på at du vil slette denne meldingen? Denne handlingen kan ikke angres.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-cyberdark-800 text-white border border-cyberdark-600 hover:bg-cyberdark-700">
              Avbryt
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-800 text-white hover:bg-red-700"
              onClick={confirmDeleteMessage}
            >
              Slett
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};