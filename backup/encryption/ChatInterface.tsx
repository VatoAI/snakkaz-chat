/**
 * Main Chat Interface Component
 * 
 * This component provides the main UI for the chat functionality,
 * including messages, input, and media uploads.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../services/encryption/ChatContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Loader2, Send, Image, Paperclip, Smile, X, Check, CheckCheck } from 'lucide-react';
import { Avatar } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import { Dialog, DialogContent } from '../../components/ui/dialog';
import { format } from 'date-fns';

// Message interface
interface MessageProps {
  id: string;
  sender: {
    id: string;
    displayName?: string;
  };
  content: string;
  timestamp: Date;
  isEncrypted?: boolean;
  mediaAttachments?: Array<{
    url: string;
    type: string;
    name: string;
    thumbnailUrl?: string;
  }>;
  isDeleted?: boolean;
  isOwn: boolean;
}

// CSS Animasjoner
const animations = {
  fadeIn: `animate-[fadeIn_0.3s_ease-in-out]`,
  slideIn: `animate-[slideIn_0.3s_ease-in-out]`,
  pulse: `animate-[pulse_2s_ease-in-out_infinite]`,
  popIn: `animate-[popIn_0.2s_cubic-bezier(0.175,0.885,0.32,1.275)]`,
  slideUp: `animate-[slideUp_0.25s_cubic-bezier(0.22,1,0.36,1)]`, 
  glow: `animate-[glow_2s_ease-in-out_infinite_alternate]`
};

// Hover effekt for meldinger
const messageHoverEffect = `
  transition-all duration-300 
  hover:bg-opacity-15 hover:bg-primary 
  hover:shadow-lg
  hover:scale-[1.02]
  hover:translate-y-[-1px]
`;

// Keyframes for animasjoner (legg til i global CSS)
const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideIn {
    from { transform: translateY(10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(4px); opacity: 0.8; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes popIn {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes glow {
    from { box-shadow: 0 0 5px rgba(80, 200, 255, 0.3); }
    to { box-shadow: 0 0 15px rgba(80, 200, 255, 0.6); }
  }
`;

// Message component
const Message: React.FC<MessageProps> = ({
  id,
  sender,
  content,
  timestamp,
  isEncrypted,
  mediaAttachments,
  isDeleted,
  isOwn
}) => {
  const { markAsRead, getReadStatus } = useChat();
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const readStatus = getReadStatus(id);
  
  // Mark as read when rendered
  useEffect(() => {
    if (!isOwn) {
      markAsRead(id);
    }
  }, [id, isOwn, markAsRead]);
  
  return (
    <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'} ${animations.slideIn}`} style={{ animationDelay: '75ms' }}>
      <TooltipProvider>
        <div className={`relative max-w-[80%] ${isOwn ? 'order-2' : 'order-1'}`}>
          {/* Sender avatar for non-own messages */}
          {!isOwn && (
            <div className="absolute -left-10 bottom-0">
              <Avatar className="w-8 h-8 ring-2 ring-offset-2 ring-offset-background ring-primary-500 transition-all hover:scale-110">
                <div className="bg-gradient-to-br from-cyberdark-800 to-cyberdark-700 w-full h-full flex items-center justify-center text-cybergold-300 font-medium">
                  {sender.displayName?.charAt(0) || '?'}
                </div>
              </Avatar>
            </div>
          )}
          
          {/* Message content */}
          <div 
            className={`rounded-2xl p-4 shadow-lg backdrop-blur-sm ${messageHoverEffect} ${
              isOwn 
                ? 'bg-gradient-to-br from-cyberblue-900 to-cyberblue-800 text-white border-l-4 border-cyberblue-600 shadow-cyberblue-900/20' 
                : 'bg-gradient-to-br from-cyberdark-800 to-cyberdark-700 text-cybergold-50 border-l-4 border-cybergold-700'
            } ${isDeleted ? 'italic opacity-70' : ''} ${isEncrypted && isOwn ? animations.glow : ''}`}
          >
            {/* Sender name for non-own messages */}
            {!isOwn && (
              <div className="text-xs text-cybergold-400 mb-1">
                <span className="font-medium">{sender.displayName || 'Unknown'}</span>
                {isEncrypted && (
                  <span className="ml-2 text-green-400 text-xs flex items-center">
                    <span className="mr-1">🔒</span> Kryptert
                  </span>
                )}
              </div>
            )}
            
            {/* Message text */}
            <div className="break-words font-normal leading-relaxed">{content}</div>
            
            {/* Media attachments */}
            {mediaAttachments && mediaAttachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {mediaAttachments.map((media, index) => (
                  <div key={index} className="relative">
                    {media.type.startsWith('image/') ? (
                      <div className={`relative overflow-hidden rounded-lg ${animations.popIn}`} style={{ animationDelay: `${index * 100}ms` }}>
                        <img 
                          src={media.thumbnailUrl || media.url} 
                          alt={media.name}
                          className="rounded-lg w-full max-h-60 object-cover cursor-pointer hover:opacity-95 transition-all hover:scale-[1.03] hover:shadow-xl border border-cyberdark-700 shadow-lg"
                          onClick={() => setMediaPreview(media.url)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-2 left-2 text-xs text-white py-1 px-2 rounded-full bg-black/40 backdrop-blur-sm flex items-center">
                          <Image size={12} className="mr-1 text-cyberblue-300" />
                          {media.name.length > 18 ? media.name.substring(0, 15) + '...' : media.name}
                        </div>
                      </div>
                    ) : (
                      <div className={`flex items-center p-3 rounded-md border border-cyberdark-700 bg-gradient-to-r from-cyberdark-900 to-cyberdark-800 hover:from-cyberdark-800 hover:to-cyberdark-700 transition-all cursor-pointer shadow-md hover:shadow-lg ${animations.fadeIn}`}>
                        <div className="mr-3 bg-cyberdark-700/70 p-2 rounded-full">
                          <Paperclip size={18} className="text-cybergold-300" />
                        </div>
                        <div className="flex-grow">
                          <div className="text-sm font-medium truncate">{media.name}</div>
                          <div className="text-xs text-cybergold-400">
                            {media.type.split('/')[1].toUpperCase()} fil
                          </div>
                        </div>
                        <a 
                          href={media.url} 
                          download={media.name}
                          className="ml-3 p-2 bg-cybergold-900 rounded-lg hover:bg-cybergold-800 transition-colors duration-200 flex items-center"
                        >
                          <Button variant="ghost" size="sm" className="text-white flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Last ned
                          </Button>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Timestamp and read status */}
            <div className="flex items-center justify-end mt-2 space-x-2">
              <span className="text-xs opacity-70 bg-black bg-opacity-20 py-1 px-2 rounded-full">
                {format(timestamp, 'HH:mm')}
              </span>
              
              {/* Read receipts for own messages */}
              {isOwn && (
                <div className="text-xs">
                  {readStatus.readByCount > 1 ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span><CheckCheck size={14} className="text-cybergold-400" /></span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Read by {readStatus.readByCount - 1} people</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : readStatus.deliveredToCount > 1 ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span><Check size={14} className="text-gray-400" /></span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delivered</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </TooltipProvider>
      
      {/* Media preview dialog */}
      <Dialog open={!!mediaPreview} onOpenChange={() => setMediaPreview(null)}>
        <DialogContent className="max-w-4xl bg-cyberdark-950 border-cybergold-800/30 p-1 rounded-xl backdrop-blur-md">
          <div className="relative">
            {mediaPreview && (
              <>
                <div className="absolute top-2 right-2 z-10">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setMediaPreview(null)}
                    className="bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8"
                  >
                    <X size={16} />
                  </Button>
                </div>
                <div className="overflow-hidden rounded-lg relative bg-gradient-to-b from-cyberdark-900/50 to-cyberdark-950/50 p-1">
                  <img 
                    src={mediaPreview} 
                    alt="Media preview" 
                    className={`max-h-[80vh] max-w-full mx-auto rounded-md object-contain shadow-2xl ${animations.fadeIn}`}
                  />
                  <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/70 to-transparent"></div>
                </div>
                <div className="absolute bottom-4 right-4">
                  <a 
                    href={mediaPreview} 
                    download
                    target="_blank"
                    className="bg-cybergold-700 hover:bg-cybergold-600 text-cyberdark-900 py-1 px-3 rounded-md text-sm font-medium flex items-center gap-2 transition-all hover:shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Last ned
                  </a>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Main ChatInterface component
export const ChatInterface: React.FC = () => {
  // Context
  const { 
    currentGroup, 
    currentUser,
    sendMessage, 
    messages, 
    loadingMessages,
    uploadingMedia,
    uploadProgress
  } = useChat();
  
  // State
  const [messageText, setMessageText] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && currentGroup) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, currentGroup]);
  
  // Focus input when group changes
  useEffect(() => {
    if (messageInputRef.current && currentGroup) {
      messageInputRef.current.focus();
    }
  }, [currentGroup]);
  
  // Render login prompt if not authenticated
  if (!currentUser) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-cyberdark-950">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-cybergold-100 mb-4">Logg inn for å chatte</h2>
          <p className="text-cybergold-300 mb-6">
            Du må logge inn for å få tilgang til chatteområdet.
          </p>
        </div>
      </div>
    );
  }
  
  // If no group is selected
  if (!currentGroup) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-cyberdark-950">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-cybergold-100 mb-4">Ingen samtale valgt</h2>
          <p className="text-cybergold-300 mb-6">
            Velg en eksisterende samtale eller opprett en ny for å begynne å chatte.
          </p>
        </div>
      </div>
    );
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMediaFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };
  
  // Remove a file
  const removeFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() && mediaFiles.length === 0) return;
    if (!currentGroup) return;
    
    try {
      setIsSubmitting(true);
      await sendMessage(messageText, mediaFiles);
      setMessageText('');
      setMediaFiles([]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Group header */}
      <div className="flex items-center justify-between p-4 border-b border-cyberdark-700 bg-gradient-to-r from-cyberdark-900 to-cyberdark-800 shadow-md">
        <div className="flex items-center">
          <Avatar className="w-10 h-10 mr-3 ring-2 ring-offset-2 ring-offset-background ring-cyberblue-600 transition-all hover:scale-110">
            <div className="bg-gradient-to-br from-cyberblue-800 to-cyberblue-600 w-full h-full flex items-center justify-center text-white font-bold">
              {currentGroup.settings.name.charAt(0)}
            </div>
          </Avatar>
          <div>
            <h3 className="font-medium text-cybergold-50 flex items-center">
              {currentGroup.settings.name}
              {currentGroup.settings.securityLevel === 'premium' && (
                <span className="ml-2 bg-gradient-to-r from-cybergold-500 to-cybergold-300 text-cyberdark-900 text-xs py-1 px-2 rounded-full font-semibold">Premium</span>
              )}
            </h3>
            <p className="text-xs text-cybergold-400 flex items-center gap-1">
              <span>{currentGroup.members.length} medlemmer</span>
              <span>•</span>
              <span className="flex items-center">
                {currentGroup.settings.securityLevel === 'premium' 
                  ? <span className="flex items-center">🔒 Premium E2EE</span> 
                  : currentGroup.settings.securityLevel === 'enhanced' 
                    ? <span className="flex items-center">🔒 Forbedret sikkerhet</span>
                    : <span className="flex items-center">🔓 Standard</span>}
              </span>
            </p>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" className="bg-cyberdark-700 hover:bg-cyberdark-600">
          Detaljer
        </Button>
      </div>
      
      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4">
        {loadingMessages ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="relative">
              <Loader2 size={36} className={`text-cybergold-400 ${animations.pulse}`} />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cybergold-500 to-transparent opacity-30 blur-md animate-spin"></div>
            </div>
            <p className="text-cybergold-400 animate-pulse">Laster meldinger...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-cyberdark-900 bg-opacity-40 rounded-xl shadow-inner">
            <div className={`max-w-md ${animations.fadeIn}`}>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyberdark-800 to-cyberdark-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cybergold-500">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  <path d="M8 9h8"></path>
                  <path d="M8 13h6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-cybergold-100 mb-3">
                Ingen meldinger ennå
              </h3>
              <p className="text-cybergold-400 mb-6">
                Start samtalen ved å sende den første meldingen!
              </p>
              <Button
                onClick={() => messageInputRef.current?.focus()}
                className="bg-cybergold-700 hover:bg-cybergold-600 text-cyberdark-900 hover:text-cyberdark-900"
              >
                Skriv melding
              </Button>
            </div>
          </div>
        ) : (
          <div className={animations.fadeIn}>
            {/* Date header */}
            <div className="flex justify-center my-6">
              <div className="bg-cyberdark-800 bg-opacity-70 text-cybergold-300 text-xs py-1 px-3 rounded-full">
                I dag
              </div>
            </div>
            
            {/* Messages list */}
            {messages.map((msg, index) => (
              <Message
                key={msg.id}
                id={msg.id}
                sender={msg.sender}
                content={msg.content}
                timestamp={msg.timestamp}
                isEncrypted={!!msg.encryptionInfo}
                mediaAttachments={msg.mediaAttachments}
                isDeleted={msg.isDeleted}
                isOwn={msg.sender.id === 'user123'} // Replace with actual user ID comparison
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Media preview */}
      {mediaFiles.length > 0 && (
        <div className="p-2 border-t border-cyberdark-700 bg-cyberdark-800">
          <div className="flex flex-wrap gap-2">
            {mediaFiles.map((file, index) => (
              <div 
                key={index} 
                className="relative bg-cyberdark-700 rounded-md overflow-hidden"
              >
                {file.type.startsWith('image/') ? (
                  <div className="w-20 h-20 relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="w-5 h-5 absolute top-1 right-1 rounded-full p-0"
                      onClick={() => removeFile(index)}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                ) : (
                  <div className="p-2 pr-6 w-24 relative">
                    <div className="truncate text-xs">{file.name}</div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="w-5 h-5 absolute top-1 right-1 rounded-full p-0"
                      onClick={() => removeFile(index)}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Upload progress */}
      {uploadingMedia && (
        <div className="px-4 py-2 bg-cyberdark-800">
          <div className="flex items-center">
            <div className="flex-grow mr-2">
              <Progress value={uploadProgress} className="h-2" />
            </div>
            <div className="text-xs text-cybergold-400">
              {Math.round(uploadProgress)}%
            </div>
          </div>
        </div>
      )}
      
      {/* Message input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-cyberdark-700 bg-gradient-to-r from-cyberdark-900 to-cyberdark-800 backdrop-blur-md">
        <div className={`flex items-center relative bg-cyberdark-800/90 rounded-xl border border-cyberdark-600 hover:border-cybergold-900 focus-within:border-cybergold-700 transition-all ${messageText.trim() || mediaFiles.length > 0 ? 'shadow-md shadow-cybergold-900/10' : ''}`}>
          <div className="flex items-center space-x-1 px-2">
            {/* File attachment button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting || uploadingMedia}
              className="h-8 w-8 rounded-full text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-700 transition-all duration-200"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                hidden
              />
              <Paperclip size={18} />
            </Button>
            
            {/* Image upload button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = "image/*";
                  fileInputRef.current.click();
                  fileInputRef.current.accept = "";
                }
              }}
              disabled={isSubmitting || uploadingMedia}
              className="h-8 w-8 rounded-full text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-700 transition-all duration-200"
            >
              <Image size={18} />
            </Button>
          </div>
          
          {/* Message input */}
          <Input
            ref={messageInputRef}
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            placeholder="Skriv en melding..."
            disabled={isSubmitting || uploadingMedia}
            className="flex-grow border-0 bg-transparent text-cybergold-100 placeholder-cybergold-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          
          <div className="flex items-center pr-2">
            {/* Emoji button (would integrate with an emoji picker) */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-700 hover:rotate-6 transition-all duration-200"
            >
              <Smile size={18} />
            </Button>
            
            {/* Send button */}
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || uploadingMedia || (!messageText.trim() && mediaFiles.length === 0)}
              className={`ml-2 rounded-full ${messageText.trim() || mediaFiles.length > 0 
                ? 'bg-gradient-to-r from-cybergold-700 to-cybergold-600 hover:from-cybergold-600 hover:to-cybergold-500 text-cyberdark-900 hover:scale-105' 
                : 'bg-cyberdark-700 text-cybergold-500'} transition-all duration-200 shadow`}
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin mr-1" />
              ) : (
                <Send size={16} className={messageText.trim() ? animations.slideUp : ''} />
              )}
              {messageText.trim() && <span className="ml-1">Send</span>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
