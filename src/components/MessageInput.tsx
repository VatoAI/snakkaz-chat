import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Clock, Shield, Image, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSecureMessageKeys } from '@/hooks/useSecureMessageKeys';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useEnhancedMediaUpload, ResizeMode, UploadOptions } from '@/hooks/useEnhancedMediaUpload';
import { cx } from '@/lib/theme';

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  onSendFile?: (file: File) => Promise<void>;
  onSendEnhancedMedia?: (mediaData: { url: string, thumbnailUrl?: string }) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  securityLevel?: 'p2p_e2ee' | 'server_e2ee' | 'standard';
  showSecurityIndicator?: boolean;
  autoFocus?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onSendFile,
  onSendEnhancedMedia,
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
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Automatisk juster høyden på tekstområdet basert på innhold
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Autofokus på desktop, men ikke på mobile
  useEffect(() => {
    if (autoFocus && !isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, isMobile]);

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
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isSubmitting || disabled) return;

    try {
      setIsSubmitting(true);
      
      // Sikker melding med nøkkelrotasjon for Perfect Forward Secrecy
      const keys = await getEncryptionKeys();
      console.log(`Secure message #${messageCounter} being sent with rotated keys`);
      
      await onSendMessage(message.trim());
      setMessage('');
      
      // Forflytt fokus tilbake til input etter sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
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
      
      // Use the enhanced media uploader with balanced preset
      await uploadFile(selectedFile, {
        compress: true,
        resize: {
          maxWidth: 1280,
          maxHeight: 1280,
          mode: 'auto',
          quality: 0.85
        },
        generateThumbnail: true
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
          thumbnailUrl: uploadState.thumbnailUrl || undefined
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
  };

  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleCancelMedia = () => {
    if (uploadState.isUploading) {
      cancelUpload();
    }
    cleanupMedia();
  };

  // Bestemmer sikkerhetsindikatorens ikon og tekst basert på sikkerhetsnivå
  const getSecurityIndicator = () => {
    switch (securityLevel) {
      case 'p2p_e2ee':
        return {
          icon: <Shield className="h-4 w-4 text-emerald-500" />,
          text: "Ende-til-ende kryptert (P2P)"
        };
      case 'server_e2ee':
        return {
          icon: <Shield className="h-4 w-4 text-blue-500" />,
          text: "Ende-til-ende kryptert"
        };
      default:
        return {
          icon: <Clock className="h-4 w-4 text-gray-500" />,
          text: "Standard kryptering"
        };
    }
  };

  const securityIndicator = getSecurityIndicator();

  return (
    <div className={`relative border-t border-opacity-20 bg-opacity-90 p-2 ${isMobile ? 'pb-6' : 'pb-3'}`}>
      {/* Sikkerhetsindikator */}
      {showSecurityIndicator && (
        <div className="flex items-center gap-1 mb-1 ml-1 text-xs opacity-70">
          {securityIndicator.icon}
          <span className="text-xs">{securityIndicator.text}</span>
        </div>
      )}
      
      {/* Image preview and uploader */}
      {showMediaUploader && previewUrl && (
        <div className="mb-2 rounded-lg overflow-hidden bg-cyberdark-900">
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full max-h-48 object-contain"
            />
            <button
              onClick={handleCancelMedia}
              className="absolute top-2 right-2 bg-black/50 rounded-full p-1 hover:bg-black/70"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
          
          {/* Upload controls */}
          <div className="p-2 flex justify-between items-center bg-cyberdark-950">
            <div className="text-xs text-gray-400">
              {selectedFile?.name} ({(selectedFile?.size || 0) / 1024 > 1024 
                ? `${((selectedFile?.size || 0) / 1024 / 1024).toFixed(1)} MB` 
                : `${((selectedFile?.size || 0) / 1024).toFixed(0)} KB`})
            </div>
            
            {uploadState.isUploading ? (
              <div className="text-xs text-blue-400">
                Laster opp... {Math.round(uploadState.progress)}%
              </div>
            ) : (
              <button
                onClick={handleUpload}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded flex items-center gap-1"
              >
                <Image className="h-3 w-3" />
                <span>Optimaliser og last opp</span>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Vedlegg knapp - hvis vedlegg er støttet */}
        {(onSendFile || onSendEnhancedMedia) && (
          <>
            <button 
              onClick={handleAttachClick}
              disabled={disabled || isSubmitting || showMediaUploader}
              className="p-2 rounded-full hover:bg-opacity-10 hover:bg-white flex items-center justify-center"
              aria-label="Legg ved fil"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
            />
          </>
        )}

        {/* Tekstområde for meldingen */}
        <div className="flex-1 rounded-xl border bg-background px-3 py-2">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSubmitting}
            className="w-full resize-none bg-transparent outline-none min-h-[40px] max-h-[120px]"
            rows={1}
            id="messageInput"
            name="messageInput"
            autoComplete="off"
          />
        </div>

        {/* Send-knapp */}
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || disabled || isSubmitting || showMediaUploader}
          className={`p-3 rounded-full ${
            !message.trim() || disabled || isSubmitting || showMediaUploader
              ? 'opacity-50'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } flex items-center justify-center`}
          aria-label="Send melding"
        >
          <Send className={`h-5 w-5 ${isMobile ? 'h-6 w-6' : ''}`} />
        </button>
      </div>

      {/* Instruksjon for mobil */}
      {isMobile && (
        <div className="text-xs opacity-50 text-center mt-1">
          Trykk på send-knappen for å sende
        </div>
      )}
    </div>
  );
};

export default MessageInput;
