import React, { useState, useRef, useEffect } from 'react';
import { useFileInput } from '@/hooks/useFileInput';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { Button } from '@/components/ui/button';
import { Loader2, Paperclip, Send, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (text: string, attachments?: Array<{ url: string; type: string; }>) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Skriv en melding...',
  className,
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Array<{ url: string; type: string; name: string }>>([]);
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

  async function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    
    // Convert FileList to Array for easier handling
    const fileArray = Array.from(files);
    
    // Process each file one at a time
    for (const file of fileArray) {
      try {
        const result = await uploadFile(file);
        
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
    if ((message.trim() || attachments.length > 0) && !uploadState.isUploading) {
      onSendMessage(
        message,
        attachments.map(att => ({ url: att.url, type: att.type }))
      );
      setMessage('');
      setAttachments([]);
      
      // Reset height
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

  return (
    <div 
      className={cn(
        "relative flex flex-col w-full border rounded-lg bg-background",
        className
      )}
    >
      {/* Attachments preview */}
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

      {/* Upload progress */}
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

      {/* Input area */}
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
            disabled={disabled || uploadState.isUploading}
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
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent outline-none placeholder:text-muted-foreground py-2.5 px-3 max-h-[150px]"
        />

        <Button
          type="button"
          disabled={disabled || (message.trim() === '' && attachments.length === 0) || uploadState.isUploading}
          onClick={handleSendMessage}
          size="icon"
          className="flex-shrink-0 h-9 w-9 rounded-full"
        >
          {uploadState.isUploading ? (
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
