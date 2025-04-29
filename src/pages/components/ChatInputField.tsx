import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, Clock } from 'lucide-react';
import { cx, theme } from '../lib/theme';
import { MediaUploader } from './MediaUploader';

interface ChatInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (text: string, mediaFile?: File) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  ttl?: number;
  onTtlChange?: (ttl: number) => void;
  isEditing?: boolean;
  onCancelEdit?: () => void;
  isUploading?: boolean;
}

export const ChatInputField: React.FC<ChatInputFieldProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Skriv en melding...',
  disabled = false,
  autoFocus = false,
  ttl = 0,
  onTtlChange,
  isEditing = false,
  onCancelEdit,
  isUploading = false
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showMediaUploader, setShowMediaUploader] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Juster tekstområdets høyde basert på innhold
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [value]);
  
  // Fokuser textarea automatisk når komponenten lastes eller når redigering starter
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus, isEditing]);
  
  // Håndter Enter-tast for å sende melding
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  // Håndter innsending av melding
  const handleSubmit = () => {
    if (disabled || (!value.trim() && !selectedFile)) return;
    
    onSubmit(value, selectedFile || undefined);
    onChange(''); // Tøm input-feltet
    setSelectedFile(null); // Fjern valgt fil
    setShowMediaUploader(false); // Skjul medieopplaster
  };
  
  // TTL-alternativer (meldinger som slettes etter en viss tid)
  const ttlOptions = [
    { label: 'Aldri', value: 0 },
    { label: '1 time', value: 60 },
    { label: '8 timer', value: 480 },
    { label: '1 dag', value: 1440 },
    { label: '3 dager', value: 4320 },
    { label: '1 uke', value: 10080 }
  ];
  
  return (
    <div className="w-full">
      {/* Media uploader */}
      {showMediaUploader && (
        <div className="mb-2">
          <MediaUploader
            onFileSelect={setSelectedFile}
            onCancel={() => {
              setSelectedFile(null);
              setShowMediaUploader(false);
            }}
            selectedFile={selectedFile}
            isUploading={isUploading}
          />
        </div>
      )}
      
      <div className={cx(
        'flex items-end gap-2 rounded-lg p-2',
        theme.colors.background.tertiary,
        theme.shadows.sm
      )}>
        {/* Media button */}
        <button
          type="button"
          onClick={() => setShowMediaUploader(!showMediaUploader)}
          disabled={disabled || isEditing}
          className={cx(
            'p-2 rounded-full',
            !showMediaUploader ? theme.colors.button.secondary.bg : 'bg-cybergold-900/30',
            theme.colors.button.secondary.text,
            'hover:bg-cyberdark-700'
          )}
        >
          <ImageIcon className="h-5 w-5" />
        </button>
        
        {/* Text input */}
        <div className={cx(
          'flex-grow min-h-[40px] rounded-md px-3 py-2',
          theme.colors.background.secondary
        )}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full bg-transparent outline-none resize-none text-sm text-white placeholder-cyberdark-500"
          />
        </div>
        
        {/* Cancel edit button */}
        {isEditing && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className={cx(
              'p-2 rounded-full',
              theme.colors.button.danger.bg,
              theme.colors.button.danger.text,
              theme.colors.button.danger.hover
            )}
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        {/* TTL selector */}
        {onTtlChange && !isEditing && (
          <div className="relative">
            <button
              type="button"
              className={cx(
                'p-2 rounded-full flex items-center justify-center',
                ttl > 0 ? 'bg-cybergold-900/40 text-cybergold-400 ring-1 ring-cybergold-500/50' : theme.colors.button.secondary.bg,
                'hover:bg-cyberdark-700'
              )}
              title="Meldingen vil slettes automatisk"
            >
              <Clock className="h-5 w-5" />
              {ttl > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cybergold-500 animate-pulse"></span>
              )}
            </button>
            
            <select
              value={ttl}
              onChange={(e) => onTtlChange(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-pointer"
            >
              {ttlOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Send button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || (!value.trim() && !selectedFile)}
          className={cx(
            'p-2 rounded-full',
            (value.trim() || selectedFile) ? theme.colors.button.primary.bg : theme.colors.button.secondary.bg,
            (value.trim() || selectedFile) ? theme.colors.button.primary.text : theme.colors.button.secondary.text,
            (value.trim() || selectedFile) ? theme.colors.button.primary.hover : 'cursor-not-allowed',
            theme.animation.normal
          )}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
      
      {/* Preview indicator if file is selected */}
      {selectedFile && !showMediaUploader && (
        <div className="mt-2 flex items-center text-xs text-cybergold-500">
          <div className="flex items-center bg-cyberdark-900 rounded-md p-1 pr-2">
            <ImageIcon className="h-3 w-3 mr-1" />
            <span className="truncate max-w-[200px]">{selectedFile.name}</span>
            <button
              onClick={() => setSelectedFile(null)}
              className="ml-2 text-cybergold-600 hover:text-red-400"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};