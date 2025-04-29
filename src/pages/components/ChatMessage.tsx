import React, { useState } from 'react';
import { MoreVertical, Edit, Trash, X, Download, Copy, Eye } from 'lucide-react';
import { cx, theme } from '../lib/theme';

interface ChatMessageProps {
  message: any; // Message object with at least id, content, sender_id
  isCurrentUser: boolean;
  userProfiles?: Record<string, any>;
  onEdit?: (message: any) => void;
  onDelete?: (messageId: string) => void;
  showActions?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isCurrentUser,
  userProfiles = {},
  onEdit,
  onDelete,
  showActions = true
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  
  // Get user display information
  const sender = userProfiles[message.sender_id] || { 
    display_name: 'Ukjent bruker',
    avatar_url: null
  };
  
  // Format timestamp
  const formattedTime = new Date(message.created_at).toLocaleTimeString('nb-NO', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Handle media content
  const hasMedia = message.media_url || message.mediaUrl;
  const mediaUrl = message.media_url || message.mediaUrl;
  const mediaType = message.media_type || message.mediaType || (mediaUrl && getMediaTypeFromUrl(mediaUrl));
  const isImage = mediaType?.startsWith('image/') || (mediaUrl && isImageUrl(mediaUrl));
  
  // Toggle action menu
  const toggleMenu = () => setShowMenu(!showMenu);
  
  // Handle edit
  const handleEdit = () => {
    setShowMenu(false);
    if (onEdit) onEdit(message);
  };
  
  // Handle delete
  const handleDelete = () => {
    setShowMenu(false);
    if (onDelete) onDelete(message.id);
  };
  
  // Helper function to get media type from URL
  function getMediaTypeFromUrl(url: string): string | null {
    const extension = url.split('.').pop()?.toLowerCase();
    if (!extension) return null;
    
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const documentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
    
    if (imageTypes.includes(extension)) return 'image/' + extension;
    if (documentTypes.includes(extension)) return 'application/' + extension;
    
    return null;
  }
  
  // Helper function to check if URL points to an image
  function isImageUrl(url: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const extension = url.split('.').pop()?.toLowerCase();
    return !!extension && imageExtensions.includes(extension);
  }
  
  return (
    <div className={cx(
      'flex mb-3',
      isCurrentUser ? 'justify-end' : 'justify-start'
    )}>
      {/* Message bubble */}
      <div className={cx(
        'max-w-[75%] rounded-lg p-3',
        isCurrentUser 
          ? 'bg-cybergold-900/20 text-white rounded-tr-none' 
          : 'bg-cyberdark-800 text-white rounded-tl-none',
        theme.shadows.sm
      )}>
        {/* Sender info */}
        {!isCurrentUser && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-full overflow-hidden bg-cyberdark-700">
              {sender.avatar_url ? (
                <img 
                  src={sender.avatar_url} 
                  alt={sender.display_name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-cybergold-400">
                  {sender.display_name.charAt(0)}
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-cybergold-400">{sender.display_name}</span>
          </div>
        )}
        
        {/* Message content */}
        {message.content && (
          <div className="text-sm whitespace-pre-wrap break-words mb-2">
            {message.content}
          </div>
        )}
        
        {/* Media content */}
        {hasMedia && (
          <div className={cx(
            'rounded overflow-hidden mt-1',
            !message.content && 'mt-0'
          )}>
            {isImage ? (
              // Image preview
              <div 
                className="relative cursor-pointer"
                onClick={() => setShowMediaModal(true)}
              >
                <img 
                  src={mediaUrl} 
                  alt="Bilde" 
                  className="max-h-60 w-auto rounded"
                />
                <div className={cx(
                  'absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0',
                  'hover:opacity-100 transition-opacity flex items-end justify-center pb-2'
                )}>
                  <Eye className="w-5 h-5 text-white mr-2" />
                  <span className="text-xs text-white">Vis bilde</span>
                </div>
              </div>
            ) : (
              // Other file types
              <div className={cx(
                'flex items-center gap-2 p-2 rounded',
                theme.colors.background.secondary
              )}>
                <div className={cx(
                  'w-8 h-8 rounded flex items-center justify-center',
                  theme.colors.background.tertiary
                )}>
                  <Download className="w-4 h-4 text-cybergold-400" />
                </div>
                <div className="flex-grow overflow-hidden">
                  <div className="text-xs font-medium truncate">
                    {getFileNameFromUrl(mediaUrl)}
                  </div>
                  <div className="text-xs text-cybergold-600">
                    {mediaType || 'Ukjent filtype'}
                  </div>
                </div>
                <a 
                  href={mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cx(
                    'p-1.5 rounded-full',
                    theme.colors.button.secondary.bg,
                    theme.colors.button.secondary.hover
                  )}
                >
                  <Download className="w-4 h-4 text-cybergold-400" />
                </a>
              </div>
            )}
          </div>
        )}
        
        {/* Footer with timestamp and actions */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-cybergold-600">{formattedTime}</span>
          
          {/* Message actions */}
          {showActions && isCurrentUser && (
            <div className="relative">
              <button
                onClick={toggleMenu}
                className={cx(
                  'p-1 rounded-full',
                  showMenu ? theme.colors.background.tertiary : 'hover:bg-cyberdark-800'
                )}
              >
                <MoreVertical className="w-3 h-3 text-cybergold-600" />
              </button>
              
              {/* Action menu */}
              {showMenu && (
                <div className={cx(
                  'absolute bottom-full right-0 mb-1 w-32 rounded-md overflow-hidden',
                  theme.colors.background.tertiary,
                  theme.shadows.md,
                  'z-10'
                )}>
                  {onEdit && (
                    <button
                      onClick={handleEdit}
                      className={cx(
                        'flex items-center w-full px-3 py-2 text-xs text-left',
                        'hover:bg-cyberdark-800'
                      )}
                    >
                      <Edit className="w-3 h-3 mr-2 text-cybergold-400" />
                      <span>Rediger</span>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={handleDelete}
                      className={cx(
                        'flex items-center w-full px-3 py-2 text-xs text-left',
                        'hover:bg-red-900/30 text-red-400'
                      )}
                    >
                      <Trash className="w-3 h-3 mr-2" />
                      <span>Slett</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Image modal */}
      {showMediaModal && isImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh]">
            <img 
              src={mediaUrl} 
              alt="Bilde" 
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button 
              onClick={() => setShowMediaModal(false)}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex justify-between items-center">
                <span className="text-white text-sm">{getFileNameFromUrl(mediaUrl)}</span>
                <a 
                  href={mediaUrl}
                  download
                  className="p-2 rounded-full bg-cyberdark-800 hover:bg-cyberdark-700"
                >
                  <Download className="w-5 h-5 text-cybergold-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get filename from URL
function getFileNameFromUrl(url: string): string {
  if (!url) return 'Ukjent fil';
  const parts = url.split('/');
  let fileName = parts[parts.length - 1];
  
  // Remove query parameters if they exist
  fileName = fileName.split('?')[0];
  
  // Decode URL-encoded characters
  try {
    fileName = decodeURIComponent(fileName);
  } catch (e) {
    // If decoding fails, use the encoded version
  }
  
  return fileName;
}