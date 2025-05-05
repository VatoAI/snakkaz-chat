
import React, { useRef, useEffect } from 'react';
import { DecryptedMessage } from '@/types/message';
import { formatDistanceToNow, format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface AIMessageListProps {
  messages: DecryptedMessage[];
  currentUserId: string;
}

export const AIMessageList: React.FC<AIMessageListProps> = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-cyberdark-800 flex items-center justify-center">
          <span className="text-xl">🤖</span>
        </div>
        <h3 className="text-lg font-medium text-cybergold-400 mb-2">SnakkaZ Assistent</h3>
        <p className="text-sm text-cybergold-600 max-w-md">
          Hei! Jeg er SnakkaZ-assistenten. Jeg kan hjelpe deg med å navigere i appen, forstå funksjoner og løse problemer. Hva kan jeg hjelpe deg med i dag?
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col p-4 space-y-4 overflow-y-auto h-full">
      {messages.map((message) => {
        const isUser = message.sender.id === currentUserId;
        const timeAgo = formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: nb });
        
        return (
          <div 
            key={message.id} 
            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                isUser 
                  ? 'bg-cybergold-600 text-black rounded-tr-none' 
                  : 'bg-cyberdark-800 text-cybergold-300 rounded-tl-none'
              }`}
            >
              <div className="text-sm mb-1">
                {message.content}
              </div>
              <div className={`text-xs ${isUser ? 'text-black/60' : 'text-cybergold-500'}`}>
                {timeAgo}
              </div>
            </div>
          </div>
        );
      })}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
