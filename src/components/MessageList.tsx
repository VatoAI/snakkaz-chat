
import { DecryptedMessage } from "@/types/message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { DeleteMessageDialog } from "./message/DeleteMessageDialog";
import { MessageGroups } from "./message/MessageGroups";
import { MessageListHeader } from "./message/MessageListHeader";
import { ScrollToBottomButton } from "./message/ScrollToBottomButton";
import { groupMessages } from "@/utils/message-grouping";

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

  console.log('MessageList render:', {
    initialMessageCount: initialMessages.length,
    currentMessageCount: messages.length,
    currentUserId
  });

  useEffect(() => {
    console.log('Messages updated:', initialMessages.length);
    setMessages(initialMessages);
    
    // Auto-scroll to bottom when new messages come
    if (autoScroll && messagesEndRef.current) {
      console.log('Auto-scrolling to bottom');
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [initialMessages, autoScroll]);

  // Check if user has scrolled up (disable auto-scroll)
  const handleScroll = () => {
    if (!scrollAreaRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50; // 50px margin
    
    if (isAtBottom !== autoScroll) {
      console.log('Auto-scroll changed:', isAtBottom);
      setAutoScroll(isAtBottom);
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
    console.log('Checking if user message:', {
      messageId: message?.id,
      senderId: message?.sender?.id,
      currentUserId
    });
    return message?.sender && currentUserId ? message.sender.id === currentUserId : false;
  };

  const handleScrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setAutoScroll(true);
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
  console.log('Grouped messages:', messageGroups.length);

  return (
    <ScrollArea 
      className="h-full px-2 sm:px-4 py-2 sm:py-4"
      onScrollCapture={handleScroll}
      ref={scrollAreaRef}
    >
      <MessageListHeader />
      
      <MessageGroups 
        messageGroups={messageGroups}
        isUserMessage={isUserMessage}
        onMessageExpired={handleMessageExpired}
        onEdit={handleEdit}
        onDelete={setConfirmDelete}
        messagesEndRef={messagesEndRef}
      />
      
      <ScrollToBottomButton 
        show={!autoScroll}
        onClick={handleScrollToBottom}
      />
      
      <DeleteMessageDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
      />
    </ScrollArea>
  );
};
