import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { useFirstInteractionCheck, AutoMessages } from './AutoMessages';
import { useEmptyChatCheck, StartPage } from './StartPage';
import { QuickReplies, useQuickReplyTrigger } from './QuickReplies';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DecryptedMessage } from '@/types/message';
import { Send, Clock, MapPin } from 'lucide-react';

interface BusinessChatContainerProps {
  chatId: string;
  friendId: string;
  messages: DecryptedMessage[];
  onSendMessage: (message: string) => void;
}

/**
 * En container-komponent som viser chat med business-funksjonalitet
 */
export const BusinessChatContainer: React.FC<BusinessChatContainerProps> = ({
  chatId,
  friendId,
  messages,
  onSendMessage
}) => {
  const { user } = useAuth();
  const { businessConfig, isBusinessOpen } = useBusiness(user?.id || null);
  const [newMessage, setNewMessage] = useState('');
  const [isQuickReplyOpen, setIsQuickReplyOpen] = useState(false);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Sjekk om dette er første interaksjon
  const isFirstInteraction = useFirstInteractionCheck(user?.id || '', friendId);
  
  // Sjekk om chatten er tom
  const isEmpty = useEmptyChatCheck(messages);
  
  // Sett opp lytter for hurtigsvar-trigger ('/')
  useQuickReplyTrigger(messageInputRef, setIsQuickReplyOpen);
  
  // Scroll til bunnen når meldinger endres
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Håndter sending av melding
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  // Håndter tastetrykk i meldingsfeltet
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Generer chat-bobler for meldinger
  const renderMessages = () => {
    return messages.map((message, index) => {
      const isOwnMessage = message.sender.id === user?.id;
      const showAvatar = index === 0 || 
        messages[index - 1]?.sender.id !== message.sender.id;
      
      return (
        <div
          key={message.id}
          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}
        >
          <div
            className={`max-w-[70%] px-4 py-2 rounded-lg ${
              isOwnMessage
                ? 'bg-primary text-primary-foreground ml-auto'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {!isOwnMessage && showAvatar && (
              <div className="font-semibold text-xs mb-1">
                {message.sender.username || message.sender.id}
              </div>
            )}
            <div>{message.content}</div>
            <div className="text-xs opacity-70 text-right mt-1">
              {new Date(message.created_at).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header med business-info */}
      {businessConfig.enabled && (
        <div className="bg-card border-b p-4">
          <div className="flex items-center">
            {businessConfig.logoUrl && (
              <div className="mr-3">
                <img
                  src={businessConfig.logoUrl}
                  alt={businessConfig.businessName}
                  className="h-10 w-10 rounded-full object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="font-medium text-lg">{businessConfig.businessName}</h2>
              {businessConfig.description && (
                <p className="text-sm text-muted-foreground">
                  {businessConfig.description}
                </p>
              )}
            </div>
          </div>
          
          {(businessConfig.businessHours || businessConfig.location) && (
            <div className="flex mt-2 text-sm text-muted-foreground">
              {businessConfig.businessHours && (
                <div className="flex items-center mr-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{isBusinessOpen() ? 'Åpen nå' : 'Stengt'}</span>
                </div>
              )}
              {businessConfig.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{businessConfig.location.address}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Meldingsområde */}
      <div className="flex-1 overflow-y-auto p-4">
        {isEmpty ? (
          <StartPage
            userId={user?.id || ''}
            onSendMessage={onSendMessage}
            isEmptyChat={isEmpty}
            onOpenWebsite={(url) => window.open(url, '_blank')}
          />
        ) : (
          <>
            {renderMessages()}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Meldingsinput */}
      <div className="p-4 border-t bg-background">
        <div className="flex items-center space-x-2">
          <Input
            ref={messageInputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Skriv en melding..."
            className="flex-1"
          />
          
          {/* Hurtigsvar-knapp og popover */}
          {businessConfig.enabled && (
            <QuickReplies
              userId={user?.id || ''}
              onSelectReply={(content) => {
                setNewMessage(content);
                setTimeout(() => messageInputRef.current?.focus(), 100);
              }}
            />
          )}
          
          {/* Send-knapp */}
          <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>

      {/* Automatiske meldinger - usynlig komponent */}
      {businessConfig.enabled && user && (
        <AutoMessages
          userId={user.id}
          chatId={chatId}
          isFirstInteraction={isFirstInteraction}
          onSendMessage={onSendMessage}
          messages={messages}
        />
      )}
    </div>
  );
};