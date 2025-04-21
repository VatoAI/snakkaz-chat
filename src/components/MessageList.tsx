
import { DecryptedMessage } from "@/types/message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { DeleteMessageDialog } from "./message/DeleteMessageDialog";
import { MessageGroups } from "./message/MessageGroups";
import { MessageListHeader } from "./message/MessageListHeader";
import { ScrollToBottomButton } from "./message/ScrollToBottomButton";
import { groupMessages } from "@/utils/message-grouping";
import { useIsMobile } from "@/hooks/use-mobile";
import { playNotificationSound } from "@/utils/sound-manager";

interface MessageListProps {
  messages: DecryptedMessage[];
  onMessageExpired?: (messageId: string) => void;
  currentUserId?: string | null;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
}

export const MessageList = ({ 
  messages: initialMessages, 
  onMessageExpired,
  currentUserId,
  onEditMessage,
  onDeleteMessage
}: MessageListProps) => {
  const [messages, setMessages] = useState(initialMessages);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [wasScrolledToBottom, setWasScrolledToBottom] = useState(true);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const isMobile = useIsMobile();
  const lastMessageCountRef = useRef(initialMessages.length);

  // Handle new messages and scroll behavior
  useEffect(() => {
    const messagesChanged = initialMessages.length !== lastMessageCountRef.current;
    const newMessages = initialMessages.length > lastMessageCountRef.current;
    
    if (messagesChanged) {
      setMessages(initialMessages);
      lastMessageCountRef.current = initialMessages.length;
      
      // Check if we were at the bottom before new messages came in
      if (newMessages) {
        if (autoScroll) {
          // Auto-scroll if we were already at the bottom
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: isMobile ? 'auto' : 'smooth' });
          }, 100);
        } else {
          // Increment unread counter if we weren't at the bottom
          setNewMessageCount(prev => prev + (initialMessages.length - lastMessageCountRef.current));
          
          // Play notification sound for new messages when not scrolled to bottom
          if (!wasScrolledToBottom) {
            playNotificationSound();
          }
        }
      }
    }
  }, [initialMessages, autoScroll, wasScrolledToBottom, isMobile]);

  // Scroll handling
  const handleScroll = useCallback(() => {
    if (!scrollAreaRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const scrolledToBottom = scrollHeight - scrollTop - clientHeight < 50; // 50px margin
    
    if (scrolledToBottom !== wasScrolledToBottom) {
      setWasScrolledToBottom(scrolledToBottom);
      setAutoScroll(scrolledToBottom);
      
      // Reset unread counter when scrolled to bottom
      if (scrolledToBottom) {
        setNewMessageCount(0);
      }
    }
  }, [wasScrolledToBottom]);

  // Touch events for mobile pull-to-refresh behavior
  const [touchStartY, setTouchStartY] = useState(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    const touchY = e.touches[0].clientY;
    const scrollTop = scrollAreaRef.current?.scrollTop || 0;
    
    // Only handle pull-to-refresh when at the top of the scroll area
    if (scrollTop <= 0 && touchY - touchStartY > 70) {
      e.preventDefault();
      // Show visual pull indicator...
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    const scrollTop = scrollAreaRef.current?.scrollTop || 0;
    const pullDistance = e.changedTouches[0].clientY - touchStartY;
    
    // If pulled down enough and at the top, trigger refresh
    if (scrollTop <= 0 && pullDistance > 100) {
      // Refresh messages
      if (onMessageExpired) {
        onMessageExpired('refresh');
      }
    }
  };

  const handleMessageExpired = (messageId: string) => {
    console.log('Message expired:', messageId);
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    if (onMessageExpired) {
      onMessageExpired(messageId);
    }
  };

  const handleEdit = (message: DecryptedMessage) => {
    if (onEditMessage) {
      console.log("Editing message:", message.id);
      onEditMessage(message);
    }
  };

  const handleDelete = async () => {
    if (confirmDelete && onDeleteMessage) {
      console.log("Confirming deletion of message:", confirmDelete);
      try {
        await onDeleteMessage(confirmDelete);
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === confirmDelete 
              ? {...msg, is_deleted: true, deleted_at: new Date().toISOString()} 
              : msg
          )
        );
        
        toast({
          title: "Melding slettet",
          description: "Meldingen ble slettet",
        });
      } catch (error) {
        console.error("Error deleting message:", error);
        toast({
          title: "Feil",
          description: "Kunne ikke slette meldingen",
          variant: "destructive",
        });
      }
      setConfirmDelete(null);
    }
  };

  const isUserMessage = (message: DecryptedMessage) => {
    return message?.sender && currentUserId ? message.sender.id === currentUserId : false;
  };

  const handleScrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: isMobile ? 'auto' : 'smooth' });
    setAutoScroll(true);
    setNewMessageCount(0);
  };

  // Filter out any messages with undefined/null properties before grouping
  const validMessages = messages.filter(msg => {
    if (!msg || !msg.sender) {
      console.warn('Invalid message found:', msg);
      return false;
    }
    return true;
  });
  
  const messageGroups = groupMessages(validMessages);

  return (
    <ScrollArea 
      className="h-full px-2 sm:px-4 py-2 sm:py-4 overscroll-contain"
      onScrollCapture={handleScroll}
      ref={scrollAreaRef}
    >
      <div 
        className="touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <MessageListHeader />
        
        <MessageGroups 
          messageGroups={messageGroups}
          isUserMessage={isUserMessage}
          onMessageExpired={handleMessageExpired}
          onEdit={handleEdit}
          onDelete={setConfirmDelete}
          messagesEndRef={messagesEndRef}
          isMobile={isMobile}
        />
      </div>
      
      <ScrollToBottomButton 
        show={!autoScroll}
        onClick={handleScrollToBottom}
        unreadCount={newMessageCount}
      />
      
      <DeleteMessageDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
      />
    </ScrollArea>
  );
};
