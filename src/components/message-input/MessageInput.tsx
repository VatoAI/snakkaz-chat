
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SendHorizontal, Paperclip, Smile, X } from 'lucide-react';
import { SecurityLevel } from '@/types/group';

interface MessageInputProps {
  placeholder?: string;
  onSendMessage: (text: string) => Promise<void>;
  onSendMedia?: (media: {
    url: string;
    thumbnailUrl?: string;
    ttl?: number;
    isEncrypted?: boolean;
  }) => Promise<void>;
  securityLevel?: SecurityLevel;
  showSecurityIndicator?: boolean;
  editingMessage?: {
    id: string;
    content: string;
  } | null;
  onCancelEdit?: () => void;
  autoFocus?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  placeholder = 'Skriv en melding...',
  onSendMessage,
  onSendMedia,
  securityLevel = 'standard',
  showSecurityIndicator = false,
  editingMessage = null,
  onCancelEdit,
  autoFocus = false,
  isLoading = false,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Set initial message content if editing
  useEffect(() => {
    if (editingMessage && editingMessage.content) {
      setMessage(editingMessage.content);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [editingMessage]);
  
  // Auto-focus setup
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading || disabled) return;
    
    try {
      await onSendMessage(trimmedMessage);
      setMessage('');
      
      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 border-t border-cyberdark-700">
      <div className="relative flex items-end bg-cyberdark-800 rounded-lg overflow-hidden">
        {/* Editing indicator */}
        {editingMessage && (
          <div className="absolute top-0 left-0 right-0 bg-amber-900/30 text-amber-300 text-xs py-1 px-3 flex items-center justify-between">
            <span>Redigerer melding</span>
            {onCancelEdit && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-5 w-5 p-0 text-amber-300 hover:text-amber-100 hover:bg-transparent"
                onClick={onCancelEdit}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
        
        {/* Input container */}
        <div className="flex-1 flex items-end">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full resize-none max-h-32 bg-transparent border-0 py-3 px-4 text-cybergold-100 outline-none focus:ring-0 ${editingMessage ? 'pt-6' : ''}`}
            rows={1}
            disabled={isLoading || disabled}
          />
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center pr-2 pb-2">
          {onSendMedia && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-cybergold-500 hover:text-cybergold-300"
              onClick={() => {
                // This would normally open media selection
                // For simplicity, we're not implementing full functionality
                console.log('Media button clicked');
              }}
              disabled={isLoading || disabled}
            >
              <Paperclip className="h-4.5 w-4.5" />
            </Button>
          )}
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-cybergold-500 hover:text-cybergold-300"
            disabled={isLoading || disabled}
          >
            <Smile className="h-4.5 w-4.5" />
          </Button>
          
          <Button
            type="submit"
            variant={message.trim() ? "default" : "ghost"}
            size="icon"
            className={`h-8 w-8 rounded-full ${
              message.trim() 
                ? 'bg-cybergold-600 hover:bg-cybergold-500 text-black' 
                : 'text-cybergold-500 hover:text-cybergold-300'
            }`}
            disabled={!message.trim() || isLoading || disabled}
          >
            <SendHorizontal className="h-4.5 w-4.5" />
          </Button>
        </div>
      </div>
      
      {/* Security indicator */}
      {showSecurityIndicator && (
        <div className="mt-1 px-1 flex justify-end">
          <span className="text-xs text-cybergold-600">
            {securityLevel === 'high' || securityLevel === 'premium' 
              ? 'Ende-til-ende kryptert' 
              : 'Standard sikkerhet'}
          </span>
        </div>
      )}
    </form>
  );
};

export default MessageInput;
