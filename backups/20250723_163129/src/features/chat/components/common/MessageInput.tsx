import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Send, Paperclip, Shield, X, Mic, Camera, Smile, Clock, PaperclipIcon, AlertTriangle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useSecureMessageKeys } from '@/hooks/useSecureMessageKeys';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useEnhancedMediaUpload, ResizeMode } from '@/hooks/useEnhancedMediaUpload';
import { useToast } from '@/hooks/use-toast';
import { useAppEncryption } from '@/contexts/AppEncryptionContext';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define a simplified message type that can represent any message format
export type MessageType = {
  id: string;
  content: string;
  sender?: any;
  createdAt?: Date | string;
  attachments?: any[];
  isEncrypted?: boolean;
  ttl?: number;
};

export interface MessageInputProps {
  // Core functionality
  onSendMessage: (text: string, options?: {
    ttl?: number;
    isEncrypted?: boolean;
    replyToId?: string;
    attachments?: any[];
  }) => Promise<void> | void;
  
  // Optional callbacks
  onAttachFile?: (file: File) => Promise<{ url: string; thumbnailUrl?: string }> | void;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  
  // Editing state
  editingMessage?: MessageType | null;
  onCancelEdit?: () => void;
  
  // Reply state
  replyToMessage?: MessageType | null;
  onCancelReply?: () => void;
  
  // Configuration
  ttl?: number;
  onChangeTtl?: (ttl: number) => void;
  isEncrypted?: boolean;
  onToggleEncryption?: (encrypted: boolean) => void;
  securityLevel?: 'p2p_e2ee' | 'server_e2ee' | 'standard';
  
  // UI customization
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
  showAttachButton?: boolean;
  showEmojiButton?: boolean;
  className?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onAttachFile,
  onTypingStart,
  onTypingEnd,
  editingMessage,
  onCancelEdit,
  replyToMessage,
  onCancelReply,
  ttl = 0,
  onChangeTtl,
  isEncrypted = false,
  onToggleEncryption,
  securityLevel = 'standard',
  placeholder = "Skriv en melding...",
  disabled = false,
  maxLength = 2000,
  autoFocus = false,
  showAttachButton = true,
  showEmojiButton = true,
  className,
}) => {
  // Local state
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const [attachmentData, setAttachmentData] = useState<File | null>(null);
  const [showEncryptionWarning, setShowEncryptionWarning] = useState(false);
  const [showTtlDialog, setShowTtlDialog] = useState(false);
  const [customTtl, setCustomTtl] = useState<number | null>(null);
  
  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Hooks
  const { toast } = useToast();
  const { state: encryptionState } = useAppEncryption();
  const { isMobile, isTablet } = useDeviceDetection();
  
  // Set initial value when editing
  useEffect(() => {
    if (editingMessage) {
      setText(editingMessage.content || '');
      textareaRef.current?.focus();
    } else {
      setText('');
    }
  }, [editingMessage]);

  // Handle autoFocus
  useEffect(() => {
    if (autoFocus && !disabled) {
      textareaRef.current?.focus();
    }
  }, [autoFocus, disabled]);

  // Handle typing status
  useEffect(() => {
    if (text.trim().length > 0 && !isTyping) {
      setIsTyping(true);
      if (onTypingStart) {
        onTypingStart();
      }
    }
    
    // Clear any existing timer
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    
    // Set new timer for typing end
    typingTimerRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        if (onTypingEnd) {
          onTypingEnd();
        }
      }
    }, 2000);
    
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [text, isTyping, onTypingStart, onTypingEnd]);

  // Reset input after sending
  const resetInput = () => {
    setText('');
    setAttachmentPreview(null);
    setAttachmentData(null);
  };

  // Handle send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if ((!text.trim() && !attachmentData) || disabled) return;
    
    try {
      const attachments = [];
      
      // Handle attachment if present
      if (attachmentData && onAttachFile) {
        try {
          const attachmentResult = await onAttachFile(attachmentData);
          if (attachmentResult) {
            attachments.push(attachmentResult);
          }
        } catch (error) {
          console.error("Failed to attach file:", error);
          toast({
            variant: "destructive",
            title: "Feil ved vedlegg",
            description: "Kunne ikke legge ved filen. Prøv igjen senere.",
          });
          return;
        }
      }
      
      // Send message with options
      await onSendMessage(text, {
        ttl,
        isEncrypted,
        replyToId: replyToMessage?.id,
        attachments: attachments.length > 0 ? attachments : undefined,
      });
      
      // Reset input
      resetInput();
      
      // Cancel reply mode if active
      if (replyToMessage && onCancelReply) {
        onCancelReply();
      }
      
      // Cancel edit mode if active
      if (editingMessage && onCancelEdit) {
        onCancelEdit();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        variant: "destructive",
        title: "Feil ved sending",
        description: "Kunne ikke sende melding. Sjekk nettverkstilkoblingen din.",
      });
    }
  };

  // Handle key press (Ctrl+Enter or Enter to send)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Don't trigger send if Shift is pressed (for multiline)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (maxLength && value.length <= maxLength) {
      setText(value);
    } else if (!maxLength) {
      setText(value);
    }
  };

  // Handle TTL change
  const handleTtlChange = (newTtl: number) => {
    if (onChangeTtl) {
      onChangeTtl(newTtl);
      setShowTtlDialog(false);
    }
  };

  // Handle custom TTL input
  const handleCustomTtlSubmit = () => {
    if (customTtl !== null && customTtl >= 0 && onChangeTtl) {
      onChangeTtl(customTtl);
      setShowTtlDialog(false);
    }
  };

  // Handle encryption toggle
  const handleToggleEncryption = () => {
    if (onToggleEncryption) {
      if (!isEncrypted && !encryptionState.isInitialized) {
        // Show encryption setup warning
        setShowEncryptionWarning(true);
      } else {
        onToggleEncryption(!isEncrypted);
      }
    }
  };

  // Handle file selection
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Fil for stor",
          description: "Filen kan ikke være større enn 10MB.",
        });
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachmentPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Store file
      setAttachmentData(file);
    }
  };
  
  // Remove attachment
  const handleRemoveAttachment = () => {
    setAttachmentPreview(null);
    setAttachmentData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Render TTL options
  const getTtlLabel = (seconds: number): string => {
    if (seconds === 0) return "Aldri";
    if (seconds < 60) return `${seconds} sekunder`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutter`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} timer`;
    return `${Math.floor(seconds / 86400)} dager`;
  };

  // Security indicator based on current settings
  const SecurityIndicator = () => {
    if (!isEncrypted) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-xs text-amber-500">
                <AlertTriangle className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Ikke kryptert</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Meldinger er ikke ende-til-ende-kryptert</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    if (securityLevel === 'p2p_e2ee') {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-xs text-green-500">
                <Shield className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">P2P E2EE</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Peer-to-peer, ende-til-ende kryptert</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    if (securityLevel === 'server_e2ee') {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-xs text-blue-500">
                <Lock className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">E2EE</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ende-til-ende kryptert</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return null;
  };

  // Dynamic container class combining defaults with any custom classes
  const containerClassName = useMemo(() => {
    return cn(
      "bg-cyberdark-900 border-t border-cyberdark-700 p-3",
      className
    );
  }, [className]);

  return (
    <div className={containerClassName}>
      {/* Reply info if replying to a message */}
      {replyToMessage && (
        <div className="flex items-center bg-cyberdark-800 p-2 mb-2 rounded border-l-2 border-cybergold-600">
          <div className="flex-1 overflow-hidden">
            <div className="text-xs text-cybergold-500">Svar til</div>
            <div className="text-sm text-cybergold-300 truncate">
              {replyToMessage.content || ""}
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
      {editingMessage && (
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
      
      {/* Attachment preview */}
      {attachmentPreview && (
        <div className="relative mb-2 inline-block">
          <div className="relative border border-cyberdark-700 rounded overflow-hidden">
            <img 
              src={attachmentPreview} 
              alt="Attachment preview" 
              className="max-h-32 max-w-full object-contain"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 rounded-full"
              onClick={handleRemoveAttachment}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="min-h-[60px] max-h-[200px] bg-cyberdark-800 border-cyberdark-700 text-cybergold-100 resize-none pr-16"
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
                  <DropdownMenuLabel>Selvdestruerende melding</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleTtlChange(0)}>
                    Ikke selvdestruerende
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowTtlDialog(true)}>
                    Egendefinert tid...
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* Encryption toggle */}
            {onToggleEncryption && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={isEncrypted ? "secondary" : "ghost"}
                      size="icon"
                      onClick={handleToggleEncryption}
                      className="h-10 w-10 rounded-full"
                      disabled={disabled}
                    >
                      <Shield className={`h-5 w-5 ${isEncrypted ? 'text-green-400' : 'text-cybergold-600'}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isEncrypted ? 'Kryptering aktivert' : 'Kryptering deaktivert'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {/* Media upload button */}
            {showAttachButton && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleFileSelect}
                      className="h-10 w-10 rounded-full"
                      disabled={disabled}
                    >
                      <PaperclipIcon className="h-5 w-5 text-cybergold-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Legg ved fil</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {/* Send button */}
            <Button
              type="submit"
              variant="default"
              size="icon"
              disabled={((!text.trim() && !attachmentData) || disabled)}
              className="h-10 w-10 rounded-full bg-cybergold-600 hover:bg-cybergold-500"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Status indicators */}
        <div className="flex items-center mt-1 pl-1 gap-2 text-xs">
          {/* TTL indicator */}
          {ttl > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-xs text-cybergold-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {getTtlLabel(ttl)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Meldingen vil slettes automatisk etter {getTtlLabel(ttl)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {/* Security indicator */}
          <SecurityIndicator />
        </div>
      </form>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        onChange={handleFileChange}
      />
      
      {/* Custom TTL Dialog */}
      <Dialog open={showTtlDialog} onOpenChange={setShowTtlDialog}>
        <DialogContent className="bg-cyberdark-900 border-cyberdark-700">
          <DialogHeader>
            <DialogTitle className="text-cybergold-300">Egendefinert tid for selvdestruksjon</DialogTitle>
            <DialogDescription className="text-cybergold-500">
              Angi hvor lang tid (i sekunder) før meldingen slettes automatisk.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              type="number"
              min="5"
              value={customTtl !== null ? customTtl : ''}
              onChange={(e) => setCustomTtl(parseInt(e.target.value) || 0)}
              className="w-full p-2 bg-cyberdark-800 border border-cyberdark-600 rounded text-cybergold-200 focus:border-cybergold-400 focus:outline-none"
              placeholder="Tid i sekunder"
            />
            {customTtl !== null && customTtl > 0 && (
              <p className="mt-2 text-sm text-cybergold-400">
                {getTtlLabel(customTtl)}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTtlDialog(false)}
              className="border-cyberdark-600"
            >
              Avbryt
            </Button>
            <Button
              variant="default"
              onClick={handleCustomTtlSubmit}
              disabled={customTtl === null || customTtl < 0}
              className="bg-cybergold-600 hover:bg-cybergold-500"
            >
              Bruk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Encryption Warning Dialog */}
      <Dialog open={showEncryptionWarning} onOpenChange={setShowEncryptionWarning}>
        <DialogContent className="bg-cyberdark-900 border-cyberdark-700">
          <DialogHeader>
            <DialogTitle className="text-amber-400">Kryptering er ikke konfigurert</DialogTitle>
            <DialogDescription className="text-cybergold-500">
              Du må konfigurere ende-til-ende-kryptering før du kan sende krypterte meldinger. Dette gjøres i sikkerhetsinnstillingene.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEncryptionWarning(false)}
              className="border-cyberdark-600"
            >
              Lukk
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setShowEncryptionWarning(false);
                // Redirect to security settings
                window.location.href = '/settings/security';
              }}
              className="bg-cybergold-600 hover:bg-cybergold-500"
            >
              Gå til innstillinger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
