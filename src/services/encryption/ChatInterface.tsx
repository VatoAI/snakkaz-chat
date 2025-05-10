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
    <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <TooltipProvider>
        <div className={`relative max-w-[80%] ${isOwn ? 'order-2' : 'order-1'}`}>
          {/* Sender avatar for non-own messages */}
          {!isOwn && (
            <div className="absolute -left-10 bottom-0">
              <Avatar className="w-8 h-8">
                <div className="bg-cyberdark-800 w-full h-full flex items-center justify-center text-cybergold-300">
                  {sender.displayName?.charAt(0) || '?'}
                </div>
              </Avatar>
            </div>
          )}
          
          {/* Message content */}
          <div 
            className={`rounded-lg p-3 ${
              isOwn 
                ? 'bg-cyberblue-900 text-white' 
                : 'bg-cyberdark-800 text-cybergold-50'
            } ${isDeleted ? 'italic opacity-70' : ''}`}
          >
            {/* Sender name for non-own messages */}
            {!isOwn && (
              <div className="text-xs text-cybergold-400 mb-1">
                {sender.displayName || 'Unknown'}
                {isEncrypted && (
                  <span className="ml-2 text-green-400 text-xs">
                    🔒 Encrypted
                  </span>
                )}
              </div>
            )}
            
            {/* Message text */}
            <div className="break-words">{content}</div>
            
            {/* Media attachments */}
            {mediaAttachments && mediaAttachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {mediaAttachments.map((media, index) => (
                  <div key={index} className="relative">
                    {media.type.startsWith('image/') ? (
                      <div className="relative">
                        <img 
                          src={media.thumbnailUrl || media.url} 
                          alt={media.name}
                          className="rounded-md max-h-60 max-w-full cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setMediaPreview(media.url)}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center p-2 bg-cyberdark-900 rounded-md">
                        <div className="mr-2">
                          <Paperclip size={16} className="text-cybergold-400" />
                        </div>
                        <div className="flex-grow">
                          <div className="text-sm truncate">{media.name}</div>
                          <div className="text-xs text-cybergold-400">
                            {media.type}
                          </div>
                        </div>
                        <a 
                          href={media.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-2 p-1 bg-cybergold-900 rounded hover:bg-cybergold-800"
                        >
                          <Button variant="link" size="sm">
                            Download
                          </Button>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Timestamp and read status */}
            <div className="flex items-center justify-end mt-1 space-x-1">
              <span className="text-xs opacity-70">
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
        <DialogContent className="max-w-4xl bg-cyberdark-950 border-cybergold-800">
          <div className="flex justify-end">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMediaPreview(null)}
            >
              <X size={18} />
            </Button>
          </div>
          {mediaPreview && (
            <img 
              src={mediaPreview} 
              alt="Media preview" 
              className="max-h-[80vh] max-w-full mx-auto rounded-md"
            />
          )}
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
    messages, 
    loadingMessages, 
    sendMessage, 
    uploadMedia,
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input when group changes
  useEffect(() => {
    if (currentGroup) {
      messageInputRef.current?.focus();
    }
  }, [currentGroup]);
  
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
  
  // No active group
  if (!currentGroup) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 text-center">
        <div className="text-cybergold-300 mb-4">
          <img 
            src="/snakkaz-logo.png" 
            alt="SnakkaZ Logo" 
            className="w-16 h-16 mx-auto mb-4 opacity-50" 
          />
        </div>
        <h3 className="text-xl font-medium text-cybergold-100 mb-2">
          Ingen aktiv samtale
        </h3>
        <p className="text-cybergold-400 max-w-md">
          Velg en eksisterende samtale fra listen til venstre, eller start en ny samtale 
          for å begynne å chatte.
        </p>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Group header */}
      <div className="flex items-center justify-between p-4 border-b border-cyberdark-700 bg-cyberdark-900">
        <div className="flex items-center">
          <Avatar className="w-10 h-10 mr-3">
            <div className="bg-gradient-to-br from-cyberblue-800 to-cyberblue-600 w-full h-full flex items-center justify-center text-white">
              {currentGroup.settings.name.charAt(0)}
            </div>
          </Avatar>
          <div>
            <h3 className="font-medium text-cybergold-50">
              {currentGroup.settings.name}
            </h3>
            <p className="text-xs text-cybergold-400">
              {currentGroup.members.length} medlemmer • 
              {currentGroup.settings.securityLevel === 'premium' 
                ? ' Premium sikkerhet 🔒' 
                : currentGroup.settings.securityLevel === 'enhanced' 
                  ? ' Forbedret sikkerhet 🔒' 
                  : ' Standard sikkerhet'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4">
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={24} className="animate-spin text-cybergold-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="max-w-md">
              <h3 className="text-lg font-medium text-cybergold-100 mb-2">
                Ingen meldinger ennå
              </h3>
              <p className="text-cybergold-400">
                Start samtalen ved å sende den første meldingen!
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Messages list */}
            {messages.map(msg => (
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
          </>
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
      <form onSubmit={handleSubmit} className="p-4 border-t border-cyberdark-700 bg-cyberdark-900">
        <div className="flex items-center">
          {/* File attachment button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting || uploadingMedia}
            className="mr-2 text-cybergold-400 hover:text-cybergold-200"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              hidden
            />
            <Paperclip size={20} />
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
            className="mr-2 text-cybergold-400 hover:text-cybergold-200"
          >
            <Image size={20} />
          </Button>
          
          {/* Message input */}
          <Input
            ref={messageInputRef}
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            placeholder="Skriv en melding..."
            disabled={isSubmitting || uploadingMedia}
            className="flex-grow border-cyberdark-600 bg-cyberdark-800 text-cybergold-100 placeholder-cybergold-500"
          />
          
          {/* Emoji button (would integrate with an emoji picker) */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="ml-2 text-cybergold-400 hover:text-cybergold-200"
          >
            <Smile size={20} />
          </Button>
          
          {/* Send button */}
          <Button
            type="submit"
            variant={isSubmitting || messageText.trim() || mediaFiles.length > 0 ? "default" : "ghost"}
            size="icon"
            disabled={isSubmitting || uploadingMedia || (!messageText.trim() && mediaFiles.length === 0)}
            className="ml-2"
          >
            {isSubmitting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
