import React, { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DecryptedMessage } from "@/types/message";
import { UserPresence, UserStatus } from "@/types/presence";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatRelativeTime } from "@/utils/date-formatter";
import { MessageActions } from "../message/MessageActions";
import { StatusIndicator } from "@/components/online-users/StatusIndicator";
import { Smile, Send, Paperclip, MoreVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";

interface ResponsiveMessageListProps {
  messages: DecryptedMessage[];
  currentUserId: string | null;
  isLoading?: boolean;
  onSendMessage: (text: string) => void;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
  userPresence?: Record<string, UserPresence>;
  isMobile?: boolean;
  onGoBack?: () => void;
  chatTitle?: string;
  chatAvatar?: string | null;
  recipientId?: string;
  loadMoreMessages?: () => Promise<void>;
  hasMoreMessages?: boolean;
  isLoadingMoreMessages?: boolean;
}

export function ResponsiveMessageList({
  messages,
  currentUserId,
  isLoading = false,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  userPresence = {},
  isMobile = false,
  onGoBack,
  chatTitle = "Chat",
  chatAvatar = null,
  recipientId,
  loadMoreMessages,
  hasMoreMessages = false,
  isLoadingMoreMessages = false
}: ResponsiveMessageListProps) {
  const [messageText, setMessageText] = useState("");
  const [editingMessage, setEditingMessage] = useState<DecryptedMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const isLandscape = useMediaQuery("(orientation: landscape)");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // For infinite scrolling
  const { ref: topRef, inView: topInView } = useInView({
    threshold: 0.1,
    rootMargin: "400px 0px 0px 0px"
  });
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && !editingMessage) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, editingMessage]);
  
  // Handle load more messages when scrolling to top
  useEffect(() => {
    if (topInView && hasMoreMessages && !isLoadingMoreMessages && loadMoreMessages) {
      loadMoreMessages();
    }
  }, [topInView, hasMoreMessages, isLoadingMoreMessages, loadMoreMessages]);
  
  // Handle message submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    
    if (editingMessage) {
      // Handle edit
      if (onEditMessage) {
        onEditMessage({
          ...editingMessage,
          content: messageText
        });
      }
      setEditingMessage(null);
    } else {
      // Send new message
      onSendMessage(messageText);
    }
    
    setMessageText("");
    
    // Focus back on input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Start editing a message
  const handleStartEdit = (message: DecryptedMessage) => {
    setEditingMessage(message);
    setMessageText(message.content);
    
    // Focus on input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingMessage(null);
    setMessageText("");
  };
  
  // Get recipient's online status
  const recipientStatus = recipientId ? (
    userPresence[recipientId]?.status || "offline"
  ) as UserStatus : "offline";
  
  return (
    <div className={cn(
      "flex flex-col h-full",
      isMobile ? "bg-background/95" : "bg-background/80 rounded-lg border shadow-md"
    )}>
      {/* Chat header */}
      <div className={cn(
        "flex items-center justify-between p-3 border-b",
        isMobile ? "bg-card" : "rounded-t-lg bg-card/80"
      )}>
        <div className="flex items-center">
          {isMobile && onGoBack && (
            <Button variant="ghost" size="icon" onClick={onGoBack} className="mr-2">
              <X size={18} />
              <span className="sr-only">Go back</span>
            </Button>
          )}
          
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <img src={chatAvatar || "/placeholder-avatar.png"} alt={chatTitle} className="object-cover" />
            </Avatar>
            
            <div>
              <h3 className="text-sm font-medium">{chatTitle}</h3>
              {recipientId && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <StatusIndicator status={recipientStatus} size="sm" className="mr-1" />
                  <span>{recipientStatus}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <Button variant="ghost" size="icon">
            <MoreVertical size={18} />
            <span className="sr-only">More options</span>
          </Button>
        </div>
      </div>
      
      {/* Messages area */}
      <ScrollArea className="flex-1 p-4">
        <div ref={messageListRef} className="space-y-4">
          {/* Load more indicator */}
          {hasMoreMessages && (
            <div ref={topRef} className="py-2 text-center">
              {isLoadingMoreMessages ? (
                <span className="text-xs text-muted-foreground">Laster flere meldinger...</span>
              ) : (
                <span className="text-xs text-muted-foreground">Scroll for flere meldinger</span>
              )}
            </div>
          )}
          
          {/* Message bubbles */}
          {messages.map((message, index) => {
            const isOwn = message.sender?.id === currentUserId;
            const showAvatar = !isOwn && (
              index === 0 || 
              messages[index - 1].sender?.id !== message.sender?.id
            );
            
            return (
              <div
                key={message.id}
                className={cn(
                  "flex items-end",
                  isOwn ? "justify-end" : "justify-start"
                )}
              >
                {!isOwn && showAvatar && (
                  <Avatar className="h-7 w-7 mr-2">
                    <img 
                      src={message.sender?.avatar_url || "/placeholder-avatar.png"} 
                      alt={message.sender?.username || "User"} 
                      className="object-cover" 
                    />
                  </Avatar>
                )}
                
                <div className={cn(
                  "max-w-[85%]",
                  !isOwn && !showAvatar && "ml-9" // Indentation for consecutive messages
                )}>
                  {/* Sender name for group chats (not shown for direct messages) */}
                  {!isOwn && showAvatar && message.sender?.username && (
                    <p className="text-xs text-muted-foreground mb-1 ml-1">
                      {message.sender.username}
                    </p>
                  )}
                  
                  {/* Message bubble */}
                  <div
                    className={cn(
                      "rounded-lg p-3",
                      isOwn 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-foreground"
                    )}
                  >
                    {message.content}
                    
                    {/* Message timestamp */}
                    <div className={cn(
                      "text-[10px] mt-1",
                      isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {formatRelativeTime(message.created_at)}
                    </div>
                  </div>
                  
                  {/* Message actions */}
                  {isOwn && onEditMessage && onDeleteMessage && (
                    <div className="flex justify-end mt-1">
                      <MessageActions 
                        message={message}
                        onEdit={() => handleStartEdit(message)}
                        onDelete={() => onDeleteMessage(message.id)}
                        size="xs"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-pulse bg-muted rounded-full h-2 w-16"></div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Message input */}
      <Card className="m-3 p-2">
        <form onSubmit={handleSubmit} className="flex items-center">
          <Button type="button" size="icon" variant="ghost">
            <Smile size={20} />
            <span className="sr-only">Add emoji</span>
          </Button>
          
          <Button type="button" size="icon" variant="ghost">
            <Paperclip size={20} />
            <span className="sr-only">Attach file</span>
          </Button>
          
          <div className="flex-1 mx-2">
            <textarea
              ref={inputRef}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Send en melding..."
              className="w-full resize-none bg-transparent border-none focus:ring-0 focus:outline-none"
              rows={1}
              style={{ minHeight: "36px", maxHeight: "120px" }}
            />
          </div>
          
          {editingMessage && (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={handleCancelEdit}
              className="mr-1"
            >
              <X size={18} />
              <span className="sr-only">Avbryt redigering</span>
            </Button>
          )}
          
          <Button 
            type="submit" 
            size="icon" 
            variant="default"
            disabled={!messageText.trim()}
          >
            <Send size={18} />
            <span className="sr-only">
              {editingMessage ? "Oppdater melding" : "Send melding"}
            </span>
          </Button>
        </form>
      </Card>
    </div>
  );
}
