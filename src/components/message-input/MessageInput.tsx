
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, X, Clock, Shield, PaperclipIcon } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MessageInputProps {
  onSendMessage: (text: string) => Promise<void> | void;
  editingMessageId?: string | null;
  editingContent?: string;
  onCancelEdit?: () => void;
  replyToMessage?: any;
  onCancelReply?: () => void;
  ttl?: number;
  onChangeTtl?: (ttl: number) => void;
  isEncrypted?: boolean;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  editingMessageId,
  editingContent,
  onCancelEdit,
  replyToMessage,
  onCancelReply,
  ttl = 0,
  onChangeTtl,
  isEncrypted = false,
  placeholder = "Skriv en melding...",
  disabled = false,
  maxLength = 2000,
}) => {
  const [text, setText] = useState(editingContent || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set initial value when editing
  useEffect(() => {
    if (editingContent) {
      setText(editingContent);
      textareaRef.current?.focus();
    }
  }, [editingContent, editingMessageId]);

  // Reset input after sending
  const resetInput = () => {
    setText('');
  };

  // Handle send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!text.trim() && !editingMessageId) return;
    
    try {
      await onSendMessage(text);
      resetInput();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Handle key press (Ctrl+Enter or Enter to send)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' && !e.shiftKey) || (e.key === 'Enter' && e.ctrlKey)) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setText(value);
    }
  };

  // Handle TTL change
  const handleTtlChange = (newTtl: number) => {
    if (onChangeTtl) {
      onChangeTtl(newTtl);
    }
  };

  // Handle file selection
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Render TTL options
  const getTtlLabel = (seconds: number): string => {
    if (seconds === 0) return "Aldri";
    if (seconds < 60) return `${seconds} sekunder`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutter`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} timer`;
    return `${Math.floor(seconds / 86400)} dager`;
  };

  return (
    <div className="bg-cyberdark-900 border-t border-cyberdark-700 p-3">
      {/* Reply info if replying to a message */}
      {replyToMessage && (
        <div className="flex items-center bg-cyberdark-800 p-2 mb-2 rounded border-l-2 border-cybergold-600">
          <div className="flex-1 overflow-hidden">
            <div className="text-xs text-cybergold-500">Svar til</div>
            <div className="text-sm text-cybergold-300 truncate">
              {replyToMessage.content || replyToMessage.text || ""}
            </div>
          </div>
          {onCancelReply && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              onClick={onCancelReply}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      
      {/* Edit mode info */}
      {editingMessageId && (
        <div className="flex items-center bg-cyberdark-800 p-2 mb-2 rounded border-l-2 border-cyberblue-600">
          <div className="flex-1 overflow-hidden">
            <div className="text-xs text-cyberblue-500">Redigerer melding</div>
          </div>
          {onCancelEdit && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              onClick={onCancelEdit}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      
      <form onSubmit={handleSendMessage} className="flex items-end gap-2">
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[60px] max-h-[200px] bg-cyberdark-800 border-cyberdark-700 text-cybergold-100 resize-none"
            rows={1}
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-cybergold-600">
            {text.length > 0 && maxLength && (
              <span>{text.length}/{maxLength}</span>
            )}
          </div>
        </div>
        
        <div className="flex gap-1 pb-1">
          {/* TTL dropdown */}
          {onChangeTtl && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  type="button" 
                  variant={ttl > 0 ? "secondary" : "ghost"} 
                  size="icon"
                  className="h-10 w-10 rounded-full"
                >
                  <Clock className={`h-5 w-5 ${ttl > 0 ? 'text-cybergold-400' : 'text-cybergold-600'}`} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-cyberdark-800 border-cyberdark-700">
                <DropdownMenuItem onClick={() => handleTtlChange(0)}>
                  Ikke selvslettende
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTtlChange(300)}>
                  5 minutter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTtlChange(3600)}>
                  1 time
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTtlChange(86400)}>
                  24 timer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTtlChange(604800)}>
                  7 dager
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {/* Media upload button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleFileSelect}
            className="h-10 w-10 rounded-full"
          >
            <PaperclipIcon className="h-5 w-5 text-cybergold-600" />
          </Button>
          
          {/* Send button */}
          <Button
            type="submit"
            variant="default"
            size="icon"
            disabled={(!text.trim() && !editingMessageId) || disabled}
            className="h-10 w-10 rounded-full bg-cybergold-600 hover:bg-cybergold-500"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,video/*,audio/*"
      />
      
      {/* Status indicators */}
      <div className="flex items-center mt-1 pl-1 gap-2">
        {/* TTL indicator */}
        {ttl > 0 && (
          <div className="flex items-center text-xs text-cybergold-500">
            <Clock className="h-3 w-3 mr-1" />
            {getTtlLabel(ttl)}
          </div>
        )}
        
        {/* Encryption indicator */}
        {isEncrypted && (
          <div className="flex items-center text-xs text-green-500">
            <Shield className="h-3 w-3 mr-1" />
            Kryptert
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
