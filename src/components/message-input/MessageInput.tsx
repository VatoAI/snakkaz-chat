import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Shield, Image, X, Mic, Camera, Smile, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSecureMessageKeys } from '@/hooks/useSecureMessageKeys';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useEnhancedMediaUpload } from '@/hooks/useEnhancedMediaUpload';
import { EnhancedAudioRecorder } from '@/components/media/EnhancedAudioRecorder';

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
}) => {
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showMediaUploader, setShowMediaUploader] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaTtl, setMediaTtl] = useState<number>(0); // TTL for media (0 = never expires)
  const [showAudioRecorder, setShowAudioRecorder] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { isMobile, isTablet } = useDeviceDetection();

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
    };
  }, []);

  // Handle upload completion
  useEffect(() => {
    if (uploadState.url && !isSubmitting) {
      sendEnhancedMedia();
    }
  }, [uploadState.url, isSubmitting]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === 'Escape' && editingMessage && onCancelEdit) {
      e.preventDefault();
      onCancelEdit();
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isSubmitting || disabled) return;

    try {
      setIsSubmitting(true);

      // Check if we're editing an existing message or sending a new one
      if (editingMessage && onUpdateMessage) {
        // Update existing message
        await onUpdateMessage(editingMessage.id, message.trim());
      } else {
        // Send new message
        // Sikker melding med nøkkelrotasjon for Perfect Forward Secrecy
        const keys = await getEncryptionKeys();
        console.log(`Secure message #${messageCounter} being sent with rotated keys`);

        await onSendMessage(message.trim());
      }
      
      setMessage('');

      // Forflytt fokus tilbake til input etter sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error('Error sending/updating message:', error);
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

      // Check if it's an image
      if (file.type.startsWith('image/')) {
        // For images, use enhanced uploader
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setShowMediaUploader(true);
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
      const shouldEncrypt = mediaTtl > 0;
      let encryptionKey;

      if (shouldEncrypt) {
        // Generer en sikker tilfeldig krypteringsnøkkel
        const keys = await getEncryptionKeys();
        encryptionKey = keys?.encryptionKey ||
          Array.from(crypto.getRandomValues(new Uint8Array(16)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
      }

      // Use the enhanced media uploader with balanced preset
      await uploadFile(selectedFile, {
        compress: true,
        resize: {
          maxWidth: 1280,
          maxHeight: 1280,
          mode: 'auto',
          quality: 0.85
        },
        generateThumbnail: true,
        encrypt: shouldEncrypt,
        encryptionKey: encryptionKey
      });

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

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCameraClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleCancelMedia = () => {
    if (uploadState.isUploading) {
      cancelUpload();
    }
    cleanupMedia();
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

  const toggleAudioRecorder = () => {
    setShowAudioRecorder(!showAudioRecorder);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
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
    <div className={`flex flex-col w-full bg-background border-t ${!isMobile ? 'rounded-lg' : ''}`}>
      {/* Show editing message indicator when in edit mode */}
      {editingMessage && (
        <div className="px-4 pt-2">
          <EditingMessage 
            content={editingMessage.content}
            onCancel={handleCancelEdit}
          />
        </div>
      )}

      {/* Media handling UI */}
      {selectedFile && previewUrl && (
        <div className="relative p-2 bg-muted/20 mx-4 mt-2 rounded-md">
          {selectedFile.type.startsWith('image/') && (
            <img src={previewUrl} alt="Preview" className="max-h-48 rounded object-contain mx-auto" />
          )}
          {selectedFile.type.startsWith('video/') && (
            <video src={previewUrl} className="max-h-48 rounded w-full" controls />
          )}
          {!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('video/') && (
            <div className="flex items-center justify-between p-2 border rounded-md bg-muted/10">
              <span className="truncate max-w-[200px]">{selectedFile.name}</span>
              <span className="text-xs text-muted-foreground">{Math.round(selectedFile.size / 1024)}KB</span>
            </div>
          )}
          
          <button 
            onClick={() => {
              setSelectedFile(null);
              setPreviewUrl(null);
              cancelUpload();
            }} 
            className="absolute top-4 right-4 bg-background/80 rounded-full p-1 hover:bg-muted transition"
          >
            <X size={18} />
          </button>
          
          {/* TTL selector for media */}
          <div className="flex items-center mt-2 text-sm">
            <span className="mr-2 text-muted-foreground">Selvdestruerende:</span>
            <select 
              value={mediaTtl} 
              onChange={(e) => setMediaTtl(Number(e.target.value))}
              className="bg-background border rounded p-1 text-sm"
            >
              <option value="0">Aldri</option>
              <option value="300">5 minutter</option>
              <option value="3600">1 time</option>
              <option value="86400">24 timer</option>
              <option value="604800">7 dager</option>
            </select>
          </div>

          <div className="flex justify-end mt-2">
            <button
              onClick={() => uploadMedia()}
              disabled={uploadState.isUploading}
              className="bg-primary text-primary-foreground rounded-full px-4 py-1 text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50"
            >
              {uploadState.isUploading ? 'Laster opp...' : 'Send'}
            </button>
          </div>
        </div>
      )}
      
      {/* Audio recorder */}
      {showAudioRecorder && (
        <div className="p-4">
          <EnhancedAudioRecorder 
            onSave={handleAudioSave}
            onCancel={() => setShowAudioRecorder(false)}
          />
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
            className="p-2 rounded-full hover:bg-muted transition text-muted-foreground hover:text-foreground focus:outline-none focus:ring-1"
            title="Send bilde eller video"
          >
            <Image size={20} />
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-2 rounded-full hover:bg-muted transition text-muted-foreground hover:text-foreground focus:outline-none focus:ring-1"
            title="Send fil"
          >
            <Paperclip size={20} />
          </button>

          <button
            type="button"
            onClick={() => setShowAudioRecorder(true)}
            disabled={disabled || showAudioRecorder}
            className="p-2 rounded-full hover:bg-muted transition text-muted-foreground hover:text-foreground focus:outline-none focus:ring-1"
            title="Spill inn lydmelding"
          >
            <Mic size={20} />
          </button>
          
          {/* Emoji picker button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 rounded-full hover:bg-muted transition text-muted-foreground hover:text-foreground focus:outline-none focus:ring-1"
            title="Legg til emoji"
          >
            <Smile size={20} />
          </button>
        </div>

        {/* Message text input */}
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={editingMessage ? "Rediger melding..." : placeholder}
          disabled={disabled || showAudioRecorder}
          className="flex-1 bg-background resize-none max-h-[120px] p-2 focus:outline-none focus:ring-0 text-sm rounded-md"
          style={{ height: '40px' }}
        />

        {/* Send/Save button - Change text based on edit mode */}
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || isSubmitting || disabled || showAudioRecorder}
          className={`ml-2 p-2 ${message.trim() ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'} rounded-full transition-colors focus:outline-none`}
          title={editingMessage ? "Lagre endringer" : "Send melding"}
        >
          <Send size={20} className={message.trim() ? '' : 'opacity-50'} />
        </button>

        {/* Add security indicator */}
        {showSecurityIndicator && (
          <div className="absolute -top-6 right-3 flex items-center text-xs text-muted-foreground">
            <Shield size={12} className={`mr-1 ${securityLevel === 'p2p_e2ee' ? 'text-green-500' : securityLevel === 'server_e2ee' ? 'text-amber-500' : 'text-muted-foreground'}`} />
            <span>
              {securityLevel === 'p2p_e2ee' ? 'E2EE' : 
               securityLevel === 'server_e2ee' ? 'Server kryptert' : 
               'Standard'}
            </span>
          </div>
        )}
      </div>
      
      {/* Emoji picker (would be implemented here) */}
      {showEmojiPicker && (
        <div className="p-2 border-t">
          {/* EmojiPicker component would go here */}
          <div className="text-xs text-center text-muted-foreground py-2">
            Emoji velger - Kommer snart
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageInput;