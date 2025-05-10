import React, { useState, useRef, useEffect } from 'react';
import { Send, Clock, Paperclip, X, Image as ImageIcon, Smile } from 'lucide-react';
import { cx, theme } from '../lib/theme';
import { MediaUploader } from './MediaUploader';
import type { Message as DecryptedMessage } from '@/types/message';
import { useIsMobile } from '@/hooks/use-mobile';

export interface MediaUploaderProps {
  onFileSelect: (file: File) => void;
  onCancel: () => void;
  selectedFile: File | null;
  isUploading?: boolean;
  maxSizeMB?: number;
  buttonText?: string;
  isMobile?: boolean;
}

interface ChatInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (text: string, mediaFile?: File) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  ttl?: number;
  onTtlChange?: (ttl: number) => void;
  onCancelEdit?: () => void;
  isEditing?: boolean;
  className?: string;
  isUploading?: boolean;
  maxMediaSizeMB?: number;
  replyToMessage?: DecryptedMessage | null;
  onCancelReply?: () => void;
}

export const ChatInputField: React.FC<ChatInputFieldProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Skriv en melding...',
  disabled = false,
  ttl = 0,
  onTtlChange,
  onCancelEdit,
  isEditing = false,
  className = '',
  isUploading = false,
  maxMediaSizeMB = 5,
  replyToMessage,
  onCancelReply
}) => {
  const isMobile = useIsMobile();
  const [isFocused, setIsFocused] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-resize the textarea as the user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);
  
  // Auto-focus the textarea when editing begins
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);
  
  // Scroll to input when focused on mobile
  useEffect(() => {
    if (isFocused && isMobile && inputContainerRef.current) {
      // Short delay to allow the keyboard to appear
      setTimeout(() => {
        inputContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [isFocused, isMobile]);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Only use Enter to submit on desktop - on mobile, users need Enter for newlines
    if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  const handleSubmit = async () => {
    if (disabled || (!value.trim() && !selectedMedia)) return;
    
    try {
      await onSubmit(value, selectedMedia || undefined);
      onChange('');
      setSelectedMedia(null);
      setIsMediaPickerOpen(false);
      
      // Defocus input after sending on mobile
      if (isMobile && textareaRef.current) {
        textareaRef.current.blur();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  const handleMediaSelect = (file: File) => {
    setSelectedMedia(file);
    if (isMobile) {
      // Auto-close media picker on mobile after selection
      setIsMediaPickerOpen(false);
    }
  };
  
  const handleCancelMedia = () => {
    setSelectedMedia(null);
  };
  
  const toggleMediaPicker = () => {
    setIsMediaPickerOpen(prev => !prev);
  };

  // Show reply message preview
  const replyPreview = replyToMessage && (
    <div className="flex items-center justify-between px-3 py-2 border-b border-cyberdark-700 bg-cyberdark-800/50">
      <div className="flex items-center space-x-2">
        <div className="w-1 h-12 bg-cybergold-500 rounded-full"></div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-cybergold-400">
            Svar til {replyToMessage.sender?.username || 'Bruker'}
          </p>
          <p className="text-xs text-cybergold-500 truncate">
            {replyToMessage.content || ''}
          </p>
        </div>
      </div>
      <button 
        onClick={onCancelReply}
        className="text-cybergold-400 hover:text-cybergold-300 mobile-touch-target"
      >
        <X className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
      </button>
    </div>
  );

  return (
    <div 
      ref={inputContainerRef}
      className={cx(
        'relative bg-cyberdark-900 rounded-md',
        isMobile ? 'shadow-lg' : theme.shadows.md,
        className
      )}
    >
      {/* TTL Selector - vises bare hvis onTtlChange er gitt */}
      {onTtlChange && (
        <div className={cx(
          'flex items-center px-3 py-2 border-b',
          theme.colors.border.medium
        )}>
          <Clock className="h-4 w-4 mr-2 text-cybergold-500" />
          <span className="text-xs text-cybergold-500 mr-2">Meldingen slettes etter:</span>
          <select
            value={ttl}
            onChange={(e) => onTtlChange(parseInt(e.target.value))}
            className={cx(
              'bg-cyberdark-950 text-cybergold-400 text-xs rounded-md px-2 py-1 border',
              isMobile && 'mobile-touch-target',
              theme.colors.border.medium
            )}
          >
            <option value={0}>Aldri</option>
            <option value={300}>5 minutter</option>
            <option value={3600}>1 time</option>
            <option value={86400}>1 dag</option>
            <option value={604800}>1 uke</option>
          </select>
        </div>
      )}
      
      {/* Edit mode indicator */}
      {isEditing && onCancelEdit && (
        <div className={cx(
          'flex items-center justify-between px-3 py-2 border-b',
          theme.colors.border.medium,
          'bg-cyberblue-900/20'
        )}>
          <span className="text-xs text-cyberblue-400">Redigerer melding</span>
          <button 
            onClick={onCancelEdit}
            className={`text-cyberblue-400 hover:text-cyberblue-300 ${isMobile ? 'mobile-touch-target' : ''}`}
          >
            <X className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
          </button>
        </div>
      )}
      
      {/* Reply preview */}
      {replyPreview}
      
      {/* Media preview if a file is selected */}
      {selectedMedia && (
        <div className="p-2 border-b border-cyberdark-700">
          <div className="flex items-center space-x-2">
            <ImageIcon className="h-4 w-4 text-cybergold-400" />
            <span className="text-xs text-cybergold-400 truncate">
              {selectedMedia.name}
            </span>
            <button 
              onClick={handleCancelMedia}
              className={`ml-auto text-red-400 hover:text-red-300 ${isMobile ? 'mobile-touch-target' : ''}`}
            >
              <X className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
            </button>
          </div>
        </div>
      )}
      
      {/* Message input area */}
      <div className={cx(
        'flex items-end p-2 gap-2',
        isMobile && 'py-3',
        isFocused ? 'border-cybergold-600' : ''
      )}>
        {/* Media attachment button */}
        <button
          type="button"
          onClick={toggleMediaPicker}
          disabled={disabled}
          className={cx(
            'flex-shrink-0',
            isMobile ? 'p-3 rounded-full mobile-touch-target' : 'p-2 rounded-full',
            isMediaPickerOpen ? 'bg-cybergold-600/20' : '',
            theme.colors.text.secondary,
            'hover:bg-cyberdark-800'
          )}
        >
          <Paperclip className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} />
        </button>
        
        {/* Emoji selector placeholder - kunne implementeres senere */}
        <button
          type="button"
          className={cx(
            'flex-shrink-0',
            isMobile ? 'p-3 rounded-full mobile-touch-target' : 'p-2 rounded-full',
            theme.colors.text.secondary,
            'hover:bg-cyberdark-800'
          )}
        >
          <Smile className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} />
        </button>
        
        {/* The textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={cx(
            'flex-grow min-h-[40px] max-h-[200px] bg-cyberdark-950 rounded-md px-3 py-2 resize-none',
            isMobile && 'py-3 text-base min-h-[50px]',
            'text-cybergold-200 placeholder:text-cybergold-600',
            theme.colors.border.medium,
            'focus:outline-none focus:ring-1 focus:ring-cybergold-600'
          )}
          rows={1}
        />
        
        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={disabled || (!value.trim() && !selectedMedia)}
          className={cx(
            'flex-shrink-0',
            isMobile ? 'p-3 rounded-full mobile-touch-target' : 'p-2 rounded-full',
            (!value.trim() && !selectedMedia) ? 'opacity-50 cursor-not-allowed' : '',
            theme.colors.button.primary.bg,
            theme.colors.button.primary.text,
            theme.colors.button.primary.hover
          )}
        >
          <Send className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} />
        </button>
      </div>
      
      {/* Media picker panel */}
      {isMediaPickerOpen && (
        <div className={cx(
          'p-3 border-t',
          theme.colors.border.medium,
          theme.colors.background.secondary,
        )}>
          <MediaUploader
            onFileSelect={handleMediaSelect}
            onCancel={handleCancelMedia}
            selectedFile={selectedMedia}
            isUploading={isUploading}
            maxSizeMB={maxMediaSizeMB}
            buttonText={isMobile ? "Velg bilde" : "Legg ved bilde eller fil"}
            isMobile={isMobile}
          />
        </div>
      )}
    </div>
  );
};
