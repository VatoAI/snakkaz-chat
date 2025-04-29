import React, { useState } from 'react';
import { formatDistance } from 'date-fns';
import { nb } from 'date-fns/locale';
import { cx, theme } from '../lib/theme';
import { Clock, Download, Edit, Trash2, ExternalLink, X } from 'lucide-react';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
    media?: {
      url: string;
      type?: string;
    } | null;
    ttl?: number | null;
  };
  isCurrentUser: boolean;
  userProfiles?: Record<string, any>;
  onEdit?: (message: any) => void;
  onDelete?: (messageId: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isCurrentUser,
  userProfiles = {},
  onEdit,
  onDelete
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  
  const { id, content, sender_id, created_at, media } = message;
  
  const timeAgo = formatDistance(new Date(created_at), new Date(), { 
    addSuffix: true,
    locale: nb 
  });
  
  const senderProfile = userProfiles[sender_id] || { 
    display_name: 'Ukjent bruker',
    avatar_url: null
  };
  
  const isImage = media?.type?.startsWith('image/');
  
  // Bestem filtypen basert på medietypen
  const getFileIcon = () => {
    if (!media?.type) return null;
    
    if (media.type.startsWith('image/')) {
      return null; // Vi viser selve bildet
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
  
  // Handler for å åpne/laste ned filen
  const handleMediaClick = () => {
    if (isImage) {
      setShowFullImage(true);
    } else if (media?.url) {
      window.open(media.url, '_blank');
    }
  };
  
  return (
    <div 
      className={cx(
        'group relative max-w-[80%] mb-2 rounded-lg py-2 px-3',
        isCurrentUser ? 'ml-auto' : 'mr-auto',
        isCurrentUser ? 'bg-cybergold-900/30' : 'bg-cyberdark-800',
        message.ttl ? 'border border-amber-700/30' : ''
      )}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      {/* Sender info (vises kun for meldinger fra andre) */}
      {!isCurrentUser && (
        <div className="flex items-center mb-1">
          <div className="h-5 w-5 rounded-full overflow-hidden bg-cyberdark-700 mr-2">
            {senderProfile.avatar_url ? (
              <img 
                src={senderProfile.avatar_url} 
                alt={senderProfile.display_name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-cybergold-400">
                {senderProfile.display_name[0].toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-xs font-medium text-cybergold-400">{senderProfile.display_name}</span>
        </div>
      )}
      
      {/* Media content */}
      {media?.url && isImage && (
        <div 
          className="relative rounded-md overflow-hidden mb-2 cursor-pointer"
          onClick={handleMediaClick}
        >
          <img 
            src={media.url} 
            alt="Vedlagt bilde" 
            className="w-full max-h-60 object-contain bg-cyberdark-900"
          />
          <div className="absolute bottom-2 right-2 bg-cyberdark-950/70 rounded-full p-1">
            <ExternalLink className="h-4 w-4 text-cybergold-400" />
          </div>
        </div>
      )}
      
      {/* Andre filtyper enn bilder */}
      {media?.url && !isImage && (
        <div 
          className="flex items-center bg-cyberdark-900 rounded-md p-2 mb-2 cursor-pointer hover:bg-cyberdark-800 transition-colors"
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
          <Download className="h-4 w-4 text-cybergold-500" />
        </div>
      )}
      
      {/* Tekst innhold */}
      <div className="text-sm whitespace-pre-wrap">
        {content}
      </div>
      
      {/* Footer med tid og TTL info */}
      <div className="flex justify-end mt-1">
        {message.ttl && (
          <div className="flex items-center text-amber-400/80 mr-2 text-[10px]">
            <Clock className="h-3 w-3 mr-0.5" />
            <span>Slettes automatisk</span>
          </div>
        )}
        <span className="text-[10px] text-cybergold-600">{timeAgo}</span>
      </div>
      
      {/* Handlinger for meldinger (vises ved hover) */}
      {isCurrentUser && showOptions && (onEdit || onDelete) && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button 
              className="p-1 hover:bg-cyberdark-700 rounded-full"
              onClick={() => onEdit(message)}
            >
              <Edit className="h-3 w-3 text-cybergold-400" />
            </button>
          )}
          
          {onDelete && (
            <button 
              className="p-1 hover:bg-red-500/20 rounded-full"
              onClick={() => onDelete(id)}
            >
              <Trash2 className="h-3 w-3 text-red-400" />
            </button>
          )}
        </div>
      )}
      
      {/* Modal for fullskjermsbilde */}
      {showFullImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-cyberdark-950/90 p-4"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button 
              className="absolute top-2 right-2 bg-cyberdark-900/80 p-2 rounded-full z-10"
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
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};