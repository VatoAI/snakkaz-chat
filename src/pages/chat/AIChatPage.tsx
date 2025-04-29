import React, { useState, useEffect, useRef } from 'react';
import { useAIChat, type AIMessage } from '../hooks/ai/useAIChat';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Avatar, Spinner, Card, Badge } from 'some-ui-library'; // Erstatt med din faktiske UI-bibliotek

const AIChatPage: React.FC = () => {
  const {
    currentChat,
    chatHistory,
    isLoading,
    error,
    sendMessage,
    createNewChat,
    selectChat,
    deleteChat
  } = useAIChat();
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll ned når nye meldinger kommer
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  // Håndter sending av melding
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    await sendMessage(inputValue);
    setInputValue('');
  };

  // Formater tid
  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return '';
    }
  };

  // Chat-melding komponent
  const ChatMessage: React.FC<{ message: AIMessage }> = ({ message }) => {
    const isUser = message.role === 'user';
    
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
        <div className={`max-w-3/4 rounded-lg p-3 ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
        }`}>
          {!isUser && (
            <div className="flex items-center mb-1">
              <Avatar size="sm" name="AI Assistant" src="/ai-avatar.png" />
              <span className="ml-2 font-medium">AI-Assistent</span>
            </div>
          )}
          
          {message.isProcessing ? (
            <div className="flex items-center">
              <Spinner size="sm" />
              <span className="ml-2">Tenker...</span>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
          
          <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    );
  };

  // Chat-valg-komponent for mobilvisning
  const ChatSelector: React.FC = () => (
    <div className="mb-4 overflow-x-auto flex md:hidden">
      <Button variant="ghost" onClick={createNewChat} className="whitespace-nowrap">
        + Ny Chat
      </Button>
      
      {chatHistory.map(chat => (
        <Button 
          key={chat.id}
          variant={currentChat?.id === chat.id ? 'solid' : 'ghost'}
          onClick={() => selectChat(chat.id)}
          className="whitespace-nowrap ml-2"
        >
          {chat.title.substring(0, 15)}{chat.title.length > 15 ? '...' : ''}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="flex h-full">
      {/* Sidekolonne med chat-historikk (desktop-visning) */}
      <div className="hidden md:flex flex-col w-64 bg-gray-50 p-4 border-r">
        <Button 
          colorScheme="blue" 
          leftIcon={<span>+</span>} 
          className="mb-4"
          onClick={createNewChat}
        >
          Ny Chat
        </Button>
        
        <div className="flex-1 overflow-y-auto">
          {chatHistory.length === 0 ? (
            <p className="text-gray-500 text-center">Ingen chat-historikk ennå</p>
          ) : (
            chatHistory.map(chat => (
              <Card 
                key={chat.id}
                className={`mb-2 cursor-pointer hover:bg-gray-100 transition ${
                  currentChat?.id === chat.id ? 'border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => selectChat(chat.id)}
              >
                <div className="p-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate">
                      {chat.title || 'Ny samtale'}
                    </h3>
                    <Button 
                      size="xs" 
                      variant="ghost" 
                      colorScheme="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                    >
                      X
                    </Button>
                  </div>
                  
                  {chat.messages.length > 0 && (
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {chat.messages[chat.messages.length - 1].content}
                    </p>
                  )}
                  
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(chat.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* Hovedchat-område */}
      <div className="flex-1 flex flex-col h-full">
        {/* Topprad med tittel */}
        <div className="bg-white border-b p-4">
          <h2 className="text-xl font-medium">
            {currentChat?.title || 'AI-Assistent'}
            {isLoading && <Spinner size="sm" className="ml-2" />}
          </h2>
          
          {/* Vis chat-velger for mobilvisning */}
          <ChatSelector />
        </div>
        
        {/* Chat-meldingsområde */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {!currentChat || currentChat.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <Avatar size="xl" name="AI Assistant" src="/ai-avatar.png" className="mb-4" />
              <h3 className="text-xl font-medium mb-2">AI-Assistent</h3>
              <p className="text-gray-500 max-w-md mb-4">
                Hei! Jeg er din personlige assistent. Still meg et spørsmål
                eller be meg om hjelp med noe.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-md">
                <Button onClick={() => sendMessage('Hva kan du hjelpe meg med?')}>
                  Hva kan du hjelpe meg med?
                </Button>
                <Button onClick={() => sendMessage('Hvordan fungerer Snakkaz?')}>
                  Hvordan fungerer Snakkaz?
                </Button>
                <Button onClick={() => sendMessage('Fortell meg om kryptering')}>
                  Fortell meg om kryptering
                </Button>
                <Button onClick={() => sendMessage('Hva er nye funksjoner i Snakkaz?')}>
                  Nye funksjoner
                </Button>
              </div>
            </div>
          ) : (
            <>
              {currentChat.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        
        {/* Feilmelding */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <p>{error}</p>
          </div>
        )}
        
        {/* Inputområde */}
        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSendMessage} className="flex">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Skriv en melding..."
              disabled={isLoading}
              className="flex-1"
              autoFocus
            />
            <Button 
              type="submit" 
              colorScheme="blue" 
              ml={2} 
              isLoading={isLoading}
              disabled={!inputValue.trim()}
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;