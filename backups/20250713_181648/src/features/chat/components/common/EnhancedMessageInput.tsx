import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Send, 
  Paperclip, 
  Smile, 
  X, 
  Reply, 
  Clock,
  Image as ImageIcon,
  Mic,
  MicOff,
  Plus,
  AtSign
} from 'lucide-react';
import { FileUploadButton } from './FileUploadZone';
import { MessageReactions } from './MessageReactions';
import { TouchFeedback } from './MobileGestures';

interface MentionUser {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
}

interface ReplyToMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    username: string;
    displayName?: string;
  };
  timestamp: Date;
}

interface EnhancedMessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (message: {
    text: string;
    files?: File[];
    replyTo?: string;
    mentions?: string[];
    isVoiceMessage?: boolean;
  }) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  replyToMessage?: ReplyToMessage | null;
  onCancelReply?: () => void;
  mentions?: MentionUser[];
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  enableVoiceMessages?: boolean;
  enableFileUpload?: boolean;
  enableEmojis?: boolean;
  enableMentions?: boolean;
  autoFocus?: boolean;
  className?: string;
}

const MENTION_TRIGGER = '@';
const EMOJI_SHORTCUTS: Record<string, string> = {
  ':)': '😊',
  ':D': '😃',
  ':(': '😢',
  ':P': '😛',
  ':o': '😮',
  '<3': '❤️',
  ':thumbsup:': '👍',
  ':thumbsdown:': '👎',
  ':fire:': '🔥',
  ':heart:': '❤️',
  ':laugh:': '😂',
  ':cry:': '😢',
  ':angry:': '😠',
  ':love:': '🥰',
  ':party:': '🎉',
  ':check:': '✅',
  ':cross:': '❌',
};

const QUICK_EMOJIS = ['😊', '😂', '❤️', '👍', '👎', '🔥', '🎉', '😢'];

export const EnhancedMessageInput: React.FC<EnhancedMessageInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Skriv en melding...',
  disabled = false,
  maxLength = 2000,
  replyToMessage,
  onCancelReply,
  mentions = [],
  onTypingStart,
  onTypingStop,
  enableVoiceMessages = true,
  enableFileUpload = true,
  enableEmojis = true,
  enableMentions = true,
  autoFocus = false,
  className
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMentionsList, setShowMentionsList] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [filteredMentions, setFilteredMentions] = useState<MentionUser[]>([]);
  const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  // Auto-focus
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Handle typing indicators
  const handleTypingIndicator = useCallback(() => {
    if (onTypingStart && !typingTimer) {
      onTypingStart();
    }

    if (typingTimer) {
      clearTimeout(typingTimer);
    }

    const timer = setTimeout(() => {
      onTypingStop?.();
      setTypingTimer(null);
    }, 2000);

    setTypingTimer(timer);
  }, [onTypingStart, onTypingStop, typingTimer]);

  // Handle text change with emoji shortcuts and mentions
  const handleTextChange = (newValue: string) => {
    // Auto-replace emoji shortcuts
    let processedValue = newValue;
    Object.entries(EMOJI_SHORTCUTS).forEach(([shortcut, emoji]) => {
      const regex = new RegExp(shortcut.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      processedValue = processedValue.replace(regex, emoji);
    });

    // Handle mentions
    if (enableMentions) {
      const lastAtIndex = processedValue.lastIndexOf(MENTION_TRIGGER);
      const cursorPos = textareaRef.current?.selectionStart || 0;
      
      if (lastAtIndex !== -1 && lastAtIndex < cursorPos) {
        const afterAt = processedValue.substring(lastAtIndex + 1, cursorPos);
        if (!afterAt.includes(' ') && afterAt.length >= 0) {
          setMentionQuery(afterAt);
          setMentionPosition(lastAtIndex);
          setShowMentionsList(true);
          
          // Filter mentions based on query
          const filtered = mentions.filter(user => 
            user.username.toLowerCase().includes(afterAt.toLowerCase()) ||
            user.displayName.toLowerCase().includes(afterAt.toLowerCase())
          );
          setFilteredMentions(filtered);
        } else {
          setShowMentionsList(false);
        }
      } else {
        setShowMentionsList(false);
      }
    }

    onChange(processedValue);
    handleTypingIndicator();
  };

  // Handle mention selection
  const handleMentionSelect = (user: MentionUser) => {
    const beforeMention = value.substring(0, mentionPosition);
    const afterMention = value.substring(textareaRef.current?.selectionStart || 0);
    const newValue = `${beforeMention}@${user.username} ${afterMention}`;
    
    onChange(newValue);
    setShowMentionsList(false);
    setMentionQuery('');
    
    // Focus back to textarea
    setTimeout(() => {
      textareaRef.current?.focus();
      const newPosition = beforeMention.length + user.username.length + 2;
      textareaRef.current?.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  // Handle key down
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showMentionsList && filteredMentions.length > 0) {
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        handleMentionSelect(filteredMentions[0]);
        return;
      }
      if (e.key === 'Escape') {
        setShowMentionsList(false);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Handle file selection
  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
  };

  // Remove file
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    const cursorPos = textareaRef.current?.selectionStart || value.length;
    const newValue = value.slice(0, cursorPos) + emoji + value.slice(cursorPos);
    onChange(newValue);
    setShowEmojiPicker(false);
    
    // Move cursor after emoji
    setTimeout(() => {
      textareaRef.current?.focus();
      const newPosition = cursorPos + emoji.length;
      textareaRef.current?.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  // Voice recording functions
  const startRecording = async () => {
    if (!enableVoiceMessages) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      recordedChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        recordedChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: 'audio/webm' });
        const file = new File([blob], `voice_message_${Date.now()}.webm`, { type: 'audio/webm' });
        setSelectedFiles(prev => [...prev, file]);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimer.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: 'Opptak startet',
        description: 'Snakk inn i mikrofonen...',
      });
    } catch (error) {
      toast({
        title: 'Mikrofon ikke tilgjengelig',
        description: 'Kan ikke starte lydopptak.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
      recordedChunks.current = [];
      
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    if (disabled || (!value.trim() && selectedFiles.length === 0)) return;

    const extractedMentions = enableMentions 
      ? Array.from(value.matchAll(/@(\w+)/g)).map(match => match[1])
      : [];

    try {
      await onSubmit({
        text: value.trim(),
        files: selectedFiles.length > 0 ? selectedFiles : undefined,
        replyTo: replyToMessage?.id,
        mentions: extractedMentions.length > 0 ? extractedMentions : undefined,
        isVoiceMessage: selectedFiles.some(file => file.type.startsWith('audio/'))
      });

      // Clear form
      onChange('');
      setSelectedFiles([]);
      onCancelReply?.();
      
      // Clear typing indicator
      if (typingTimer) {
        clearTimeout(typingTimer);
        setTypingTimer(null);
      }
      onTypingStop?.();

    } catch (error) {
      toast({
        title: 'Kunne ikke sende melding',
        description: 'Prøv igjen senere.',
        variant: 'destructive',
      });
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const canSubmit = (value.trim() || selectedFiles.length > 0) && !disabled;

  return (
    <div className={cn('relative bg-cyberdark-900 border-t border-cyberdark-700', className)}>
      {/* Reply preview */}
      {replyToMessage && (
        <div className="flex items-center gap-2 px-4 py-2 bg-cyberdark-800/50 border-b border-cyberdark-700">
          <Reply className="w-4 h-4 text-cybergold-400" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-cybergold-400">
              Svarer til {replyToMessage.sender.displayName || replyToMessage.sender.username}
            </p>
            <p className="text-sm text-cybergold-300 truncate">
              {replyToMessage.content}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelReply}
            className="w-6 h-6 p-0 text-cybergold-400 hover:text-cybergold-300"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* File preview */}
      {selectedFiles.length > 0 && (
        <div className="px-4 py-2 border-b border-cyberdark-700">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-cyberdark-800 rounded-lg px-3 py-2"
              >
                <div className="w-4 h-4 text-cybergold-400">
                  {file.type.startsWith('image/') ? <ImageIcon className="w-4 h-4" /> :
                   file.type.startsWith('audio/') ? <Mic className="w-4 h-4" /> :
                   <Paperclip className="w-4 h-4" />}
                </div>
                <span className="text-sm text-cybergold-300 truncate max-w-32">
                  {file.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="w-4 h-4 p-0 text-red-400 hover:text-red-300"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recording indicator */}
      {isRecording && (
        <div className="px-4 py-2 bg-red-500/20 border-b border-red-500/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-sm">
              Tar opp... {formatRecordingTime(recordingTime)}
            </span>
            <div className="flex gap-2 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelRecording}
                className="text-red-400 hover:text-red-300"
              >
                Avbryt
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={stopRecording}
                className="text-green-400 hover:text-green-300"
              >
                Ferdig
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mentions dropdown */}
      {showMentionsList && filteredMentions.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 bg-cyberdark-800 border border-cyberdark-700 rounded-t-lg max-h-40 overflow-y-auto z-50">
          {filteredMentions.map((user) => (
            <button
              key={user.id}
              onClick={() => handleMentionSelect(user)}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-cyberdark-700 text-left"
            >
              <div className="w-6 h-6 rounded-full bg-cybergold-600 flex items-center justify-center text-xs font-medium text-black">
                {user.displayName?.charAt(0) || user.username.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-cybergold-300">{user.displayName || user.username}</p>
                <p className="text-xs text-cybergold-500">@{user.username}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main input area */}
      <div className="flex items-end gap-2 p-4">
        {/* Action buttons - left side */}
        <div className="flex items-center gap-1">
          {enableFileUpload && (
            <FileUploadButton
              onFileSelect={handleFileSelect}
              variant="icon"
              disabled={disabled}
              className="text-cybergold-400 hover:text-cybergold-300"
            />
          )}
          
          {enableVoiceMessages && !isRecording && (
            <TouchFeedback onPress={startRecording}>
              <Button
                variant="ghost"
                size="sm"
                disabled={disabled}
                className="w-8 h-8 p-0 rounded-full text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-700"
              >
                <Mic className="w-4 h-4" />
              </Button>
            </TouchFeedback>
          )}
        </div>

        {/* Text input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isRecording}
            maxLength={maxLength}
            className={cn(
              'min-h-[40px] max-h-[120px] resize-none bg-cyberdark-800 border-cyberdark-600 text-cybergold-100',
              'focus:border-cybergold-500 focus:ring-1 focus:ring-cybergold-500',
              'placeholder:text-cybergold-400'
            )}
            onSelectionChange={(e) => {
              setCursorPosition((e.target as HTMLTextAreaElement).selectionStart);
            }}
          />
          
          {/* Character counter */}
          {maxLength && value.length > maxLength * 0.8 && (
            <div className={cn(
              'absolute bottom-1 right-2 text-xs',
              value.length > maxLength * 0.9 ? 'text-red-400' : 'text-cybergold-500'
            )}>
              {value.length}/{maxLength}
            </div>
          )}
        </div>

        {/* Action buttons - right side */}
        <div className="flex items-center gap-1">
          {enableEmojis && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={disabled}
              className="w-8 h-8 p-0 rounded-full text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-700"
            >
              <Smile className="w-4 h-4" />
            </Button>
          )}

          <TouchFeedback onPress={handleSubmit}>
            <Button
              size="sm"
              disabled={!canSubmit}
              className={cn(
                'rounded-full px-3 transition-all',
                canSubmit 
                  ? 'bg-cybergold-600 hover:bg-cybergold-500 text-black' 
                  : 'bg-cyberdark-700 text-cybergold-500'
              )}
            >
              <Send className="w-4 h-4" />
            </Button>
          </TouchFeedback>
        </div>
      </div>

      {/* Quick emoji picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full right-4 bg-cyberdark-800 border border-cyberdark-700 rounded-lg p-2 flex gap-1 z-50">
          {QUICK_EMOJIS.map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              size="sm"
              onClick={() => handleEmojiSelect(emoji)}
              className="w-8 h-8 p-0 text-lg hover:bg-cyberdark-700"
            >
              {emoji}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEmojiPicker(false)}
            className="w-8 h-8 p-0 text-cybergold-400 hover:bg-cyberdark-700"
          >
            <Plus className="w-4 h-4 rotate-45" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnhancedMessageInput;
