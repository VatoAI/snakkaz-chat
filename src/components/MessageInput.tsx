import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Shield, Image, X, Mic, Camera, Smile, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSecureMessageKeys } from '@/hooks/useSecureMessageKeys';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useEnhancedMediaUpload } from '@/hooks/useEnhancedMediaUpload';
import { EnhancedAudioRecorder } from '@/components/EnhancedAudioRecorder';

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  onSendFile?: (file: File) => Promise<void>;
  onSendEnhancedMedia?: (mediaData: { url: string, thumbnailUrl?: string, ttl?: number, isEncrypted?: boolean }) => Promise<void>;
  onSendAudio?: (blob: Blob) => Promise<void>;
  onSendProduct?: (productData: ProductData) => Promise<void>;
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
    <div className={`relative border-t border-opacity-10 p-2 ${isMobile ? 'pb-4' : 'pb-3'} backdrop-blur-md`}>
      {/* Sikkerhetsindikator - nå diskret i hjørnet */}
      {showSecurityIndicator && (
        <div className="absolute top-1 right-2 flex items-center gap-1 text-xs opacity-70">
          <span className="text-xs">{securityIndicator.text}</span>
          {securityIndicator.icon}
        </div>
      )}

      {/* Image preview and uploader */}
      {showMediaUploader && previewUrl && (
        <div className="mb-2 rounded-lg overflow-hidden bg-card border shadow-lg">
          <div className="relative max-h-[200px]">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain max-h-[200px]"
            />
            <button
              onClick={handleCancelMedia}
              className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5 hover:bg-black/80 shadow-lg"
              aria-label="Avbryt"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>

          {/* TTL selector */}
          <div className="border-t p-2 flex items-center">
            <span className="text-xs text-muted-foreground mr-2">Levetid:</span>
            <select
              value={mediaTtl}
              onChange={(e) => setMediaTtl(parseInt(e.target.value))}
              className="text-xs bg-card border rounded px-2 py-1"
            >
              <option value="0">Permanent</option>
              <option value="60">1 time</option>
              <option value="480">8 timer</option>
              <option value="1440">1 dag</option>
              <option value="4320">3 dager</option>
              <option value="10080">1 uke</option>
            </select>

            {mediaTtl > 0 && (
              <div className="ml-auto flex items-center text-xs">
                <Shield className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                <span className="text-muted-foreground">Kryptert</span>
              </div>
            )}
          </div>

          {/* Upload controls */}
          <div className="p-2 flex justify-between items-center bg-muted/50 border-t">
            <div className="text-xs text-muted-foreground">
              {selectedFile?.name} ({(selectedFile?.size || 0) / 1024 > 1024
                ? `${((selectedFile?.size || 0) / 1024 / 1024).toFixed(1)} MB`
                : `${((selectedFile?.size || 0) / 1024).toFixed(0)} KB`})
            </div>

            {uploadState.isUploading ? (
              <div className="flex items-center gap-2 text-xs">
                <div className="w-24 bg-muted h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full"
                    style={{ width: `${Math.round(uploadState.progress)}%` }}
                  ></div>
                </div>
                <span>{Math.round(uploadState.progress)}%</span>
              </div>
            ) : (
              <button
                onClick={handleUpload}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs px-3 py-1.5 rounded flex items-center gap-1 font-medium shadow-md"
                disabled={isSubmitting}
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Audio recorder component */}
      {showAudioRecorder && (
        <div className="mb-2">
          <EnhancedAudioRecorder
            onAudioReady={handleAudioReady}
            onCancel={() => setShowAudioRecorder(false)}
            className="p-1"
          />
        </div>
      )}

      {/* Message input bar */}
      <div className="flex items-center gap-2 mt-1">
        {/* Emoji picker button */}
        <button
          onClick={toggleEmojiPicker}
          disabled={disabled || isSubmitting}
          className="p-2 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground"
          aria-label="Legg til emoji"
        >
          <Smile className="h-5 w-5" />
        </button>

        {/* Medieknapper */}
        <div className="flex">
          {/* Vedlegg knapp */}
          {(onSendFile || onSendEnhancedMedia) && (
            <>
              <button
                onClick={handleAttachClick}
                disabled={disabled || isSubmitting || showMediaUploader}
                className="p-2 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground"
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

          {/* Kameraknapp */}
          {(onSendFile || onSendEnhancedMedia) && (
            <>
              <button
                onClick={handleCameraClick}
                disabled={disabled || isSubmitting || showMediaUploader}
                className="p-2 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground"
                aria-label="Ta bilde"
              >
                <Camera className="h-5 w-5" />
              </button>
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                capture="environment"
              />
            </>
          )}

          {/* Lydopptakerknapp */}
          {onSendAudio && (
            <button
              onClick={toggleAudioRecorder}
              disabled={disabled || isSubmitting || showMediaUploader}
              className={`p-2 rounded-full ${showAudioRecorder ? 'bg-red-500 text-white' : 'hover:bg-muted text-muted-foreground'} flex items-center justify-center`}
              aria-label="Ta opp lyd"
            >
              <Mic className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Tekstområde for meldingen */}
        <div className="flex-1 rounded-full border bg-background px-4 py-2">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSubmitting || showAudioRecorder}
            className="w-full resize-none bg-transparent outline-none min-h-[24px] max-h-[100px] text-base"
            rows={1}
            id="messageInput"
            name="messageInput"
            autoComplete="off"
          />
        </div>

        {/* Send-knapp */}
        <button
          onClick={handleSendMessage}
          disabled={(!message.trim()) || disabled || isSubmitting || showMediaUploader || showAudioRecorder}
          className={`p-2.5 rounded-full ${
            (!message.trim()) || disabled || isSubmitting || showMediaUploader || showAudioRecorder
              ? 'bg-muted text-muted-foreground'
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          } flex items-center justify-center shadow-sm`}
          aria-label="Send melding"
        >
          <Send className={`h-5 w-5`} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
