import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Paperclip, Shield, Image, X, Mic, Camera, Smile, ShoppingBag, Loader2, Edit, CornerUpLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSecureMessageKeys } from '@/hooks/useSecureMessageKeys';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useEnhancedMediaUpload } from '@/hooks/useEnhancedMediaUpload';
import { useMessageReply } from '@/hooks/useMessageReply';
import { EnhancedAudioRecorder } from '@/components/media/EnhancedAudioRecorder';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  onSendFile?: (file: File) => Promise<void>;
  onSendEnhancedMedia?: (mediaData: { url: string, thumbnailUrl?: string, ttl?: number, isEncrypted?: boolean }) => Promise<void>;
  onSendAudio?: (blob: Blob) => Promise<void>;
  onSendProduct?: (productData: ProductData) => Promise<void>;
  onUpdateMessage?: (messageId: string, newContent: string) => Promise<void>;
  onCancelEdit?: () => void;
  editingMessage?: { id: string; content: string } | null;
  placeholder?: string;
  disabled?: boolean;
  securityLevel?: 'p2p_e2ee' | 'server_e2ee' | 'standard';
  showSecurityIndicator?: boolean;
  autoFocus?: boolean;
  isPremiumGroup?: boolean;
  allowMarketplace?: boolean;
  onStartTyping?: () => void;
  onStopTyping?: () => void;
}

// Nytt produkt-datagrensesnitt for markedsplass-funksjonalitet
interface ProductData {
  title: string;
  description: string;
  price: number;
  currency?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  inStock?: boolean;
  quantity?: number;
  contactInfo?: string;
}

interface EditingMessageProps {
  content: string;
  onCancel: () => void;
}

const EditingMessage: React.FC<EditingMessageProps> = ({ content, onCancel }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-cyberdark-800 rounded-md mb-2 text-xs">
      <Edit className="h-3 w-3 text-cybergold-500" />
      <span className="flex-1 truncate">Redigerer: {content}</span>
      <button 
        onClick={onCancel}
        className="text-cybergold-400 hover:text-cybergold-300"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

interface ReplyPreviewProps {
  message: {
    id: string;
    content: string;
    sender: {
      displayName: string;
    };
  };
  onCancel: () => void;
}

const ReplyPreview: React.FC<ReplyPreviewProps> = ({ message, onCancel }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-cyberdark-800 rounded-md mb-2 text-xs border-l-2 border-cyberblue-500">
      <CornerUpLeft className="h-3 w-3 text-cyberblue-400" />
      <div className="flex-1 truncate">
        <span className="font-medium text-cyberblue-400">{message.sender.displayName}</span>
        <span className="ml-2 opacity-75 truncate">{message.content}</span>
      </div>
      <button 
        onClick={onCancel}
        className="text-cybergold-400 hover:text-cybergold-300"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onSendFile,
  onSendEnhancedMedia,
  onSendAudio,
  onUpdateMessage,
  onCancelEdit,
  editingMessage,
  placeholder = "Skriv en melding...",
  disabled = false,
  securityLevel = 'standard',
  showSecurityIndicator = true,
  autoFocus = false,
  isPremiumGroup = false,
  allowMarketplace = false,
  onStartTyping,
  onStopTyping,
}) => {
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showMediaUploader, setShowMediaUploader] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaTtl, setMediaTtl] = useState<number>(0); // TTL for media (0 = never expires)
  const [showAudioRecorder, setShowAudioRecorder] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [typingTimeoutId, setTypingTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [isMediaUploaderExpanded, setIsMediaUploaderExpanded] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [captionText, setCaptionText] = useState<string>('');
  const [activeMediaTab, setActiveMediaTab] = useState<'recent' | 'camera' | 'gallery'>('recent');
  const [mediaQuality, setMediaQuality] = useState<'standard' | 'high' | 'raw'>('standard');

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { isMobile, isTablet } = useDeviceDetection();
  const { replyingTo, clearReply } = useMessageReply();

  // Use our enhanced media upload hook
  const { uploadFile, cancelUpload, uploadState } = useEnhancedMediaUpload();

  // Sikker meldingsnøkkelrotasjon via Double Ratchet
  const conversationId = user?.id || 'default'; // Bør være en faktisk samtale-ID i produksjon
  const { getEncryptionKeys, messageCounter } = useSecureMessageKeys({
    conversationId,
    onError: (error) => console.error("Secure message key error:", error)
  });

  // Populate message input when entering edit mode
  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.content);
      
      // Focus on the input when editing starts
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      // Reset message when exiting edit mode without submitting
      if (!isSubmitting) {
        setMessage('');
      }
    }
  }, [editingMessage]);

  // Automatisk juster høyden på tekstområdet basert på innhold
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Autofokus på desktop, men ikke på mobile
  useEffect(() => {
    if (autoFocus && !isMobile && inputRef.current && !editingMessage) {
      inputRef.current.focus();
    }
  }, [autoFocus, isMobile, editingMessage]);

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      // Clean up typing timeout
      if (typingTimeoutId) {
        clearTimeout(typingTimeoutId);
      }
    };
  }, []);

  // Handle upload completion
  useEffect(() => {
    if (uploadState.url && !isSubmitting) {
      sendEnhancedMedia();
    }
  }, [uploadState.url, isSubmitting]);

  // Typing indicator handling
  const handleTypingStart = useCallback(() => {
    if (onStartTyping) {
      onStartTyping();
    }
    
    // Clear existing timeout if any
    if (typingTimeoutId) {
      clearTimeout(typingTimeoutId);
    }
    
    // Set new timeout for typing stop
    const newTimeoutId = setTimeout(() => {
      if (onStopTyping) {
        onStopTyping();
      }
    }, 3000); // Stop typing indicator after 3 seconds of inactivity
    
    setTypingTimeoutId(newTimeoutId);
  }, [onStartTyping, onStopTyping, typingTimeoutId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === 'Escape' && editingMessage && onCancelEdit) {
      e.preventDefault();
      onCancelEdit();
    } else {
      // Trigger typing indicator for any other keypress
      handleTypingStart();
    }
  };

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    
    if (disabled || (!trimmedMessage && !selectedFile && !uploadState.url)) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // If we're editing an existing message
      if (editingMessage && onUpdateMessage) {
        await onUpdateMessage(editingMessage.id, trimmedMessage);
        if (onCancelEdit) onCancelEdit();
      } 
      // If we're sending a new message
      else if (trimmedMessage) {
        await onSendMessage(trimmedMessage);
        
        // Clear reply after sending
        if (replyingTo) {
          clearReply();
        }
      }
      
      setMessage('');
      if (typingTimeoutId) {
        clearTimeout(typingTimeoutId);
        if (onStopTyping) onStopTyping();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check if it's an image or video
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        // For images and videos, use enhanced uploader
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setShowMediaUploader(true);
        setCaptionText(''); // Clear any previous caption
      } else if (onSendFile) {
        // For other file types, use regular uploader
        try {
          setIsSubmitting(true);
          await onSendFile(file);
        } catch (error) {
          console.error('Error uploading file:', error);
        } finally {
          setIsSubmitting(false);
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsSubmitting(true);

      // Generer en krypteringsnøkkel hvis TTL er satt
      const shouldEncrypt = mediaTtl > 0 || securityLevel !== 'standard';
      let encryptionKey;

      if (shouldEncrypt) {
        // Generer en sikker tilfeldig krypteringsnøkkel
        const keys = await getEncryptionKeys();
        encryptionKey = keys?.encryptionKey ||
          Array.from(crypto.getRandomValues(new Uint8Array(16)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
      }

      // Build compression options based on media quality setting
      const compressionOptions = {
        compress: mediaQuality !== 'raw',
        resize: mediaQuality === 'standard' ? {
          maxWidth: 1280,
          maxHeight: 1280,
          mode: 'auto',
          quality: 0.85
        } : mediaQuality === 'high' ? {
          maxWidth: 1920,
          maxHeight: 1920,
          mode: 'auto',
          quality: 0.92
        } : undefined,
        generateThumbnail: true,
        encrypt: shouldEncrypt,
        encryptionKey: encryptionKey
      };

      // Use the enhanced media uploader with selected preset
      await uploadFile(selectedFile, compressionOptions);

      // If user has added a caption, send it with the image
      if (captionText.trim()) {
        // Will be sent after the media is uploaded and sent
        setMessage(captionText);
      }

    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const sendEnhancedMedia = async () => {
    if (uploadState.url && onSendEnhancedMedia) {
      try {
        await onSendEnhancedMedia({
          url: uploadState.url,
          thumbnailUrl: uploadState.thumbnailUrl || undefined,
          ttl: mediaTtl > 0 ? mediaTtl : undefined,
          isEncrypted: uploadState.isEncrypted || mediaTtl > 0
        });

        // Send the caption as a follow-up message if provided
        if (captionText.trim() && onSendMessage) {
          await onSendMessage(captionText.trim());
          setCaptionText('');
        }

        // Clean up
        cleanupMedia();
      } catch (error) {
        console.error('Error sending enhanced media:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const cleanupMedia = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl(null);
    setShowMediaUploader(false);
    setCaptionText('');

    // Reset file inputs
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  // Handle drag and drop for images
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Only accept images and videos
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setShowMediaUploader(true);
      }
    }
  };

  const handleAudioReady = async (audioBlob: Blob) => {
    if (onSendAudio) {
      try {
        setIsSubmitting(true);
        await onSendAudio(audioBlob);
      } catch (error) {
        console.error('Error sending audio:', error);
      } finally {
        setIsSubmitting(false);
        setShowAudioRecorder(false);
      }
    }
  };

  // Bestemmer sikkerhetsindikatorens ikon og tekst basert på sikkerhetsnivå
  const getSecurityIndicator = () => {
    switch (securityLevel) {
      case 'p2p_e2ee':
        return {
          icon: <Shield className="h-3 w-3 text-emerald-500" />,
          text: "E2EE (P2P)"
        };
      case 'server_e2ee':
        return {
          icon: <Shield className="h-3 w-3 text-blue-500" />,
          text: "E2EE"
        };
      default:
        return {
          icon: <Shield className="h-3 w-3 text-gray-400" />,
          text: "Standard"
        };
    }
  };

  const securityIndicator = getSecurityIndicator();

  return (
    <div 
      className={cn(
        "flex flex-col w-full bg-cyberdark-900 border-t border-cyberdark-700",
        showMediaUploader && "pb-2",
        !isMobile && "rounded-lg",
        dragActive && "border-2 border-dashed border-cybergold-500"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      ref={dropAreaRef}
    >
      {/* Show editing message indicator when in edit mode */}
      {editingMessage && (
        <div className="px-4 pt-2">
          <EditingMessage 
            content={editingMessage.content}
            onCancel={handleCancelEdit}
          />
        </div>
      )}

      {/* Show reply preview */}
      {replyingTo && !editingMessage && (
        <div className="px-4 pt-2">
          <ReplyPreview 
            message={replyingTo}
            onCancel={clearReply}
          />
        </div>
      )}

      {/* Media upload UI */}
      {showMediaUploader && selectedFile && previewUrl && (
        <div className="px-4 pt-3 pb-2">
          <div className="bg-cyberdark-800 rounded-lg overflow-hidden border border-cyberdark-700">
            {/* Media preview header */}
            <div className="flex items-center justify-between bg-cyberdark-950 p-2 border-b border-cyberdark-700">
              <div className="flex items-center text-sm text-cybergold-300">
                <span className="font-medium">
                  {selectedFile.type.startsWith('image/') ? 'Bildeopplasting' : 'Videoopplasting'}
                </span>
                <span className="ml-2 text-xs text-cybergold-600">
                  {Math.round(selectedFile.size / 1024)} KB
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={handleCancelMedia}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Media content */}
            <div className="p-3">
              {/* Preview */}
              <div className="relative mb-3 bg-cyberdark-950 rounded overflow-hidden flex items-center justify-center">
                {selectedFile.type.startsWith('image/') && (
                  <img src={previewUrl} alt="Preview" className="max-h-64 object-contain mx-auto" />
                )}
                {selectedFile.type.startsWith('video/') && (
                  <video src={previewUrl} className="max-h-64 w-full" controls />
                )}
                
                {/* Upload progress overlay */}
                {uploadState.isUploading && (
                  <div className="absolute inset-0 bg-cyberdark-950/70 flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-cybergold-400 mb-2" />
                    <div className="w-3/4 max-w-xs">
                      <Progress value={uploadState.progress} className="h-1.5" />
                    </div>
                    <p className="text-sm text-cybergold-300 mt-2">
                      {uploadState.progress}% opplastet...
                    </p>
                  </div>
                )}
              </div>
              
              {/* Caption input */}
              <div className="mb-3">
                <input
                  type="text"
                  value={captionText}
                  onChange={(e) => setCaptionText(e.target.value)}
                  placeholder="Legg til bildetekst..."
                  className="w-full bg-cyberdark-950 border border-cyberdark-700 rounded p-2 text-sm text-cybergold-300 placeholder:text-cybergold-600"
                />
              </div>
              
              {/* Media options */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                {/* TTL selector */}
                <div>
                  <label className="block text-xs text-cybergold-400 mb-1">
                    Selvdestruerende
                  </label>
                  <select 
                    value={mediaTtl} 
                    onChange={(e) => setMediaTtl(Number(e.target.value))}
                    className="w-full bg-cyberdark-950 border border-cyberdark-700 rounded p-2 text-sm text-cybergold-300"
                  >
                    <option value="0">Aldri</option>
                    <option value="300">5 minutter</option>
                    <option value="3600">1 time</option>
                    <option value="86400">24 timer</option>
                    <option value="604800">7 dager</option>
                  </select>
                </div>
                
                {/* Quality selector */}
                <div>
                  <label className="block text-xs text-cybergold-400 mb-1">
                    Kvalitet
                  </label>
                  <select 
                    value={mediaQuality} 
                    onChange={(e) => setMediaQuality(e.target.value as any)}
                    className="w-full bg-cyberdark-950 border border-cyberdark-700 rounded p-2 text-sm text-cybergold-300"
                  >
                    <option value="standard">Standard</option>
                    <option value="high">Høy</option>
                    <option value="raw">Original</option>
                  </select>
                </div>
              </div>
              
              {/* Security note */}
              {securityLevel !== 'standard' && (
                <div className="flex items-center bg-green-900/20 rounded p-2 mb-3 text-xs">
                  <Shield className="h-3.5 w-3.5 text-green-500 mr-1.5 flex-shrink-0" />
                  <span className="text-green-400">
                    Dette {selectedFile.type.startsWith('image/') ? 'bildet' : 'videoklippet'} vil bli kryptert før opplasting
                  </span>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancelMedia}
                  disabled={uploadState.isUploading}
                  className="border-cybergold-500/30 text-cybergold-400"
                >
                  Avbryt
                </Button>
                
                <Button 
                  size="sm"
                  onClick={handleUpload}
                  disabled={uploadState.isUploading}
                  className="bg-cybergold-600 text-black hover:bg-cybergold-700"
                >
                  {uploadState.isUploading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                      Laster opp...
                    </div>
                  ) : 'Send'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Audio recorder */}
      {showAudioRecorder && (
        <div className="p-4">
          {/* EnhancedAudioRecorder-komponenten ville gå her */}
          <div className="text-center p-4 bg-cyberdark-800 rounded-lg">
            <Mic className="h-6 w-6 text-cybergold-400 mx-auto mb-2 animate-pulse" />
            <p className="text-cybergold-300 text-sm mb-3">Opptak pågår...</p>
            <div className="flex justify-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAudioRecorder(false)}
              >
                Avbryt
              </Button>
              <Button size="sm" className="bg-cybergold-600 text-black">
                Send
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* File input fields - hidden */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
      />
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*,video/*"
      />

      {/* Main message input area */}
      <div className="flex items-end p-2 relative">
        {/* Media action buttons */}
        <div className="flex space-x-1 mb-1 mr-2">
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            disabled={disabled}
            className="p-2 rounded-full hover:bg-cyberdark-800 transition text-cybergold-500 hover:text-cybergold-300"
            title="Send bilde eller video"
          >
            <Image size={20} />
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-2 rounded-full hover:bg-cyberdark-800 transition text-cybergold-500 hover:text-cybergold-300"
            title="Send fil"
          >
            <Paperclip size={20} />
          </button>

          <button
            type="button"
            onClick={() => setShowAudioRecorder(true)}
            disabled={disabled || showAudioRecorder}
            className="p-2 rounded-full hover:bg-cyberdark-800 transition text-cybergold-500 hover:text-cybergold-300"
            title="Spill inn lydmelding"
          >
            <Mic size={20} />
          </button>
          
          {/* Emoji picker button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 rounded-full hover:bg-cyberdark-800 transition text-cybergold-500 hover:text-cybergold-300"
            title="Legg til emoji"
          >
            <Smile size={20} />
          </button>
        </div>

        {/* Message text input */}
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTypingStart();
          }}
          onKeyDown={handleKeyDown}
          placeholder={editingMessage ? "Rediger melding..." : placeholder}
          disabled={disabled || showAudioRecorder}
          className="flex-1 bg-cyberdark-800 border border-cyberdark-700 resize-none max-h-[120px] p-2 focus:outline-none focus:ring-0 rounded-md text-sm text-cybergold-300 placeholder:text-cybergold-600"
          style={{ height: '40px' }}
        />

        {/* Send/Save button - Change text based on edit mode */}
        <button
          onClick={handleSendMessage}
          disabled={(!message.trim() && !selectedFile) || isSubmitting || disabled || showAudioRecorder}
          className={cn(
            "ml-2 p-2 rounded-full transition-colors", 
            message.trim() ? "bg-cybergold-600 text-black hover:bg-cybergold-700" : "bg-cyberdark-800 text-cybergold-600"
          )}
          title={editingMessage ? "Lagre endringer" : "Send melding"}
        >
          <Send size={20} className={message.trim() ? '' : 'opacity-50'} />
        </button>

        {/* Add security indicator */}
        {showSecurityIndicator && (
          <div className="absolute -top-6 right-3 flex items-center text-xs text-cybergold-600">
            <Shield size={12} className={cn(
              "mr-1",
              securityLevel === 'p2p_e2ee' ? "text-green-500" : 
              securityLevel === 'server_e2ee' ? "text-cybergold-400" : 
              "text-cybergold-600"
            )} />
            <span>
              {securityLevel === 'p2p_e2ee' ? 'E2EE' : 
               securityLevel === 'server_e2ee' ? 'Server kryptert' : 
               'Standard'}
            </span>
          </div>
        )}
      </div>
      
      {/* Emoji picker */}
      {showEmojiPicker && (
        <div className="p-2 border-t border-cyberdark-700 bg-cyberdark-800">
          {/* Emoji picker would be implemented here */}
          <div className="grid grid-cols-8 gap-2 p-2">
            {['😀', '😂', '❤️', '👍', '🎉', '🔥', '⚡', '✨', '🙏', '👀', '💯', '🤷‍♂️', '🤔', '😊', '🥰', '😎'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setMessage(prev => prev + emoji);
                  setShowEmojiPicker(false);
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
                className="text-xl p-2 hover:bg-cyberdark-700 rounded"
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="text-center text-xs text-cybergold-600 pt-1">
            Flere emojier kommer snart
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageInput;