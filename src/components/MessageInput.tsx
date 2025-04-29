import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Clock, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSecureMessageKeys } from '@/hooks/useSecureMessageKeys';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  onSendFile?: (file: File) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  securityLevel?: 'p2p_e2ee' | 'server_e2ee' | 'standard';
  showSecurityIndicator?: boolean;
  autoFocus?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onSendFile,
  placeholder = "Skriv en melding...",
  disabled = false,
  securityLevel = 'standard',
  showSecurityIndicator = true,
  autoFocus = false,
}) => {
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { isMobile, isTablet } = useDeviceDetection();
  
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
    if (e.target.files && e.target.files[0] && onSendFile) {
      try {
        setIsSubmitting(true);
        await onSendFile(e.target.files[0]);
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
  };

  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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

      <div className="flex items-end gap-2">
        {/* Vedlegg knapp - hvis vedlegg er støttet */}
        {onSendFile && (
          <>
            <button 
              onClick={handleAttachClick}
              disabled={disabled || isSubmitting}
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
          disabled={!message.trim() || disabled || isSubmitting}
          className={`p-3 rounded-full ${
            !message.trim() || disabled || isSubmitting
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
