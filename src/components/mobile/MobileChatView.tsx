import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MessageCircle, SendHorizonal, Paperclip, Smile, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';
import { useMessageSend } from '@/hooks/useMessageSend';
import { Spinner } from '@/components/ui/spinner';

interface MobileChatViewProps {
  conversationId: string;
  otherUserName?: string;
  otherUserAvatar?: string;
  onBackClick?: () => void;
}

export const MobileChatView: React.FC<MobileChatViewProps> = ({
  conversationId,
  otherUserName = 'Chat',
  otherUserAvatar,
  onBackClick
}) => {
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messageText, setMessageText] = useState('');
  const [isAttaching, setIsAttaching] = useState(false);
  const { user } = useAuth();
  const { messages, loading } = useMessages(conversationId);
  const { sendMessage, sending } = useMessageSend();

  const handleSend = async () => {
    if (!messageText.trim() || sending) return;
    
    try {
      await sendMessage({
        conversationId,
        text: messageText,
        ttl: 0 // Ingen automatisk sletting
      });
      setMessageText('');
    } catch (error) {
      console.error('Feil ved sending av melding:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    // Scroll til bunnen ved nye meldinger
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Fokuser på input når komponenten monteres
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Hvis ikke mobil, ikke vis denne komponenten
  if (!isMobile) return null;

  return (
    <div className="flex flex-col h-[100svh] bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b shadow-sm bg-card">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBackClick} className="mr-2">
            <span className="sr-only">Tilbake</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </Button>
          <Avatar className="h-9 w-9 mr-2">
            {otherUserAvatar ? (
              <img src={otherUserAvatar} alt={otherUserName} />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                {otherUserName.charAt(0).toUpperCase()}
              </span>
            )}
          </Avatar>
          <div>
            <h2 className="text-sm font-medium">{otherUserName}</h2>
            <p className="text-xs text-muted-foreground">
              {Math.random() > 0.5 ? 'Online' : 'Aktiv nylig'}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical size={20} />
          <span className="sr-only">Meny</span>
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <MessageCircle className="mb-2" size={40} />
                <p>Ingen meldinger ennå</p>
                <p className="text-sm">Start samtalen ved å sende en melding</p>
              </div>
            ) : (
              messages.map((message, i) => {
                const isOwn = message.senderId === user?.id;
                return (
                  <div 
                    key={message.id || i} 
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        isOwn 
                          ? 'bg-primary text-primary-foreground rounded-tr-none' 
                          : 'bg-muted rounded-tl-none'
                      }`}
                    >
                      <p>{message.text}</p>
                      <div className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {new Date(message.timestamp || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t p-2">
        <div className="flex items-center bg-muted rounded-full pr-2">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsAttaching(!isAttaching)}>
            <Paperclip size={20} />
            <span className="sr-only">Legg til vedlegg</span>
          </Button>
          <input
            ref={inputRef}
            type="text"
            placeholder="Skriv en melding..."
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 py-2 px-1 text-sm"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button variant="ghost" size="icon" className="rounded-full mr-1">
            <Smile size={20} />
            <span className="sr-only">Legg til emoji</span>
          </Button>
          <Button 
            disabled={!messageText.trim() || sending}
            size="icon"
            className="rounded-full"
            onClick={handleSend}
          >
            {sending ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <SendHorizonal size={18} />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileChatView;