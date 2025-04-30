import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Clock, Shield, Image, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSecureMessageKeys } from '@/hooks/useSecureMessageKeys';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useEnhancedMediaUpload, ResizeMode, UploadOptions } from '@/hooks/useEnhancedMediaUpload';
import { cx } from '@/lib/theme';
import { AudioRecorder } from '@/components/message-input/AudioRecorder';

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  onSendFile?: (file: File) => Promise<void>;
  onSendEnhancedMedia?: (mediaData: { url: string, thumbnailUrl?: string, ttl?: number, isEncrypted?: boolean }) => Promise<void>;
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
  const [mediaTtl, setMediaTtl] = useState<number>(0); // TTL for media (0 = never expires)
  const [isRecording, setIsRecording] = useState<boolean>(false);

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
    <div className={`relative border-t border-opacity-20 bg-opacity-90 p-2 ${isMobile ? 'pb-4' : 'pb-3'}`}>
      {/* Sikkerhetsindikator */}
      {showSecurityIndicator && !isRecording && (
        <div className="flex items-center gap-1 mb-1 ml-1 text-xs opacity-70">
          {securityIndicator.icon}
          <span className="text-xs">{securityIndicator.text}</span>
        </div>
      )}

      {/* Image preview and uploader */}
      {showMediaUploader && previewUrl && (
        <div className="mb-2 rounded-lg overflow-hidden bg-cyberdark-900 border border-cyberdark-700">
          <div className="relative max-h-[200px]">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain max-h-[200px]"
            />
            <button
              onClick={handleCancelMedia}
              className="absolute top-2 right-2 bg-cyberdark-900/80 rounded-full p-2 hover:bg-cyberdark-800 shadow-lg"
            >
              <X className="h-4 w-4 text-cybergold-400" />
            </button>
          </div>

          {/* TTL selector */}
          <div className="border-t border-cyberdark-700 bg-cyberdark-900 p-2 flex items-center">
            <Clock className="h-4 w-4 text-cybergold-500 mr-2" />
            <span className="text-xs text-cybergold-500 mr-2">Bildet slettes etter:</span>
            <select
              value={mediaTtl}
              onChange={(e) => setMediaTtl(parseInt(e.target.value))}
              className="text-xs bg-cyberdark-950 border border-cyberdark-700 rounded px-2 py-1 text-cybergold-400"
            >
              <option value="0">Aldri</option>
              <option value="60">1 time</option>
              <option value="480">8 timer</option>
              <option value="1440">1 dag</option>
              <option value="4320">3 dager</option>
              <option value="10080">1 uke</option>
            </select>

            {mediaTtl > 0 && (
              <div className="ml-auto flex items-center text-xs">
                <Shield className="h-3.5 w-3.5 mr-1 text-cybergold-500" />
                <span className="text-cybergold-500">Kryptert</span>
              </div>
            )}
          </div>

          {/* Upload controls */}
          <div className="p-3 flex justify-between items-center bg-cyberdark-950 border-t border-cyberdark-700">
            <div className="text-xs text-cybergold-500">
              {selectedFile?.name} ({(selectedFile?.size || 0) / 1024 > 1024
                ? `${((selectedFile?.size || 0) / 1024 / 1024).toFixed(1)} MB`
                : `${((selectedFile?.size || 0) / 1024).toFixed(0)} KB`})
            </div>

            {uploadState.isUploading ? (
              <div className="flex items-center gap-2 text-xs text-cybergold-400">
                <div className="w-24 bg-cyberdark-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-cybergold-500 h-full"
                    style={{ width: `${Math.round(uploadState.progress)}%` }}
                  ></div>
                </div>
                <span>{Math.round(uploadState.progress)}%</span>
              </div>
            ) : (
              <button
                onClick={handleUpload}
                className="bg-cybergold-600 hover:bg-cybergold-700 text-black text-xs px-3 py-1.5 rounded flex items-center gap-1 font-medium shadow-md"
              >
                <Image className="h-3.5 w-3.5" />
                <span>Send bilde</span>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Lydopptak-knapp */}
        <AudioRecorder
          isLoading={isSubmitting}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          setSelectedFile={setSelectedFile}
        />

        {/* Vedlegg knapp - hvis vedlegg er støttet */}
        {!isRecording && (onSendFile || onSendEnhancedMedia) && (
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
            placeholder={isRecording ? "Tar opp lyd..." : placeholder}
            disabled={disabled || isSubmitting || isRecording}
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
          disabled={(!message.trim() && !isRecording) || disabled || isSubmitting || showMediaUploader}
          className={`p-3 rounded-full ${
            (!message.trim() && !isRecording) || disabled || isSubmitting || showMediaUploader
              ? 'opacity-50 cursor-not-allowed'
              : 'bg-cybergold-600 hover:bg-cybergold-700 text-black shadow-md'
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
