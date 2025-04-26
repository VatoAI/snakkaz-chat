import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { useFileInput } from '@/hooks/useFileInput';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { Button } from '@/components/ui/button';
import { Loader2, Paperclip, Send, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const TTL_OPTIONS = [
  { label: '1 time', value: 3600 },
  { label: '1 dag', value: 86400 },
  { label: '3 dager', value: 259200 },
  { label: '7 dager', value: 604800 },
];

interface MessageInputProps {
  onSendMessage: (text: string, attachments?: Array<{ url: string; type: string; }>, ttl?: number) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  newMessage?: string;
  setNewMessage?: (message: string) => void;
  isLoading?: boolean;
  ttl?: number;
  setTtl?: (ttl: number) => void;
  editingMessage?: any;
  onCancelEdit?: () => void;
  onSubmit?: (e: FormEvent) => Promise<void>;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Skriv en melding...',
  className,
  newMessage: externalMessage,
  setNewMessage: externalSetMessage,
  isLoading = false,
  editingMessage,
  onCancelEdit,
}) => {
  const [internalMessage, setInternalMessage] = useState('');
  const message = externalMessage !== undefined ? externalMessage : internalMessage;
  const setMessage = externalSetMessage || setInternalMessage;

  const [attachments, setAttachments] = useState<Array<{ url: string; type: string; name: string }>>([]);
  const [ttl, setTtl] = useState(604800); // default 7 dager
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { uploadFile, cancelUpload, uploadState } = useMediaUpload();
  const { getRootProps, getInputProps, open } = useFileInput({
    onFilesSelected: handleFilesSelected,
    accept: 'image/*,video/*,audio/*,application/pdf',
    multiple: true,
  });

  // Auto resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  // Auto focus input when component mounts
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Handle editing message
  useEffect(() => {
    if (editingMessage && editingMessage.content) {
      setMessage(editingMessage.content);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [editingMessage, setMessage]);

  async function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      try {
        const result = await uploadFile(file, { ttlSeconds: ttl });
        
        if (result) {
          const fileType = file.type.split('/')[0] || 'application';
          
          setAttachments(prev => [
            ...prev,
            {
              url: result.publicUrl,
              type: fileType,
              name: file.name
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to upload file:', error);
      }
    }
  }

  function handleRemoveAttachment(index: number) {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }

  function handleSendMessage() {
    // Allow sending either text OR attachments (or both)
    const hasContent = message.trim().length > 0 || attachments.length > 0;
    
    if (hasContent && !uploadState.isUploading && !isLoading) {
      onSendMessage(
        message,
        attachments.map(att => ({ url: att.url, type: att.type })),
        ttl
      );
      setMessage('');
      setAttachments([]);
      
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  // Calculate if send button should be enabled
  const sendButtonEnabled = 
    !disabled && 
    ((message.trim() !== '' || attachments.length > 0)) && 
    !uploadState.isUploading && 
    !isLoading;

  return (
    <div 
      className={cn(
        "relative flex flex-col w-full border rounded-lg bg-background",
        className
      )}
    >
      {editingMessage && (
        <div className="flex justify-between items-center bg-muted px-3 py-1.5 text-xs">
          <span>Redigerer melding</span>
          {onCancelEdit && (
            <button 
              onClick={onCancelEdit}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Avbryt
            </button>
          )}
        </div>
      )}
      
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 border-b">
          {attachments.map((attachment, index) => (
            <div 
              key={index} 
              className="relative group bg-muted rounded-md p-1 flex items-center gap-2"
            >
              <span className="text-xs max-w-[120px] truncate">{attachment.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveAttachment(index)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {uploadState.isUploading && (
        <div className="p-2 border-b">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium">
              Laster opp... ({uploadState.progress.toFixed(0)}%)
            </span>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={cancelUpload}
              className="h-6 px-2 text-xs"
            >
              Avbryt
            </Button>
          </div>
          <Progress value={uploadState.progress} className="h-1.5" />
        </div>
      )}

      <div className="flex items-center gap-2 px-2 pt-2">
        <label className="text-xs text-muted-foreground">Slett etter:</label>
        <select
          value={ttl}
          onChange={e => setTtl(Number(e.target.value))}
          className="text-xs rounded bg-muted px-2 py-1 border border-muted-foreground"
        >
          {TTL_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="flex items-end p-2 gap-1.5">
        <div 
          {...getRootProps()}
          className="flex-shrink-0"
        >
          <input {...getInputProps()} />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled || uploadState.isUploading || isLoading}
            onClick={open}
            className="h-9 w-9 rounded-full"
          >
            <Paperclip size={18} />
          </Button>
        </div>

        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={attachments.length > 0 ? 'Send med eller uten tekst...' : placeholder}
          disabled={disabled || isLoading}
          rows={1}
          className="flex-1 resize-none bg-transparent outline-none placeholder:text-muted-foreground py-2.5 px-3 max-h-[150px]"
        />

        <Button
          type="button"
          disabled={!sendButtonEnabled}
          onClick={handleSendMessage}
          size="icon"
          className={cn(
            "flex-shrink-0 h-9 w-9 rounded-full",
            attachments.length > 0 && !message.trim() ? "bg-green-600 hover:bg-green-700" : ""
          )}
        >
          {isLoading || uploadState.isUploading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
