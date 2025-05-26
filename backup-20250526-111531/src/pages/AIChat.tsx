import React, { useState, useRef, useEffect } from 'react';
import { useAIChat } from './hooks/ai/useAIChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Bot, User, Plus, Trash2, Settings, Loader2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const AIChat: React.FC = () => {
  const {
    currentChat,
    chatHistory,
    isLoading,
    error,
    sendMessage,
    createNewChat,
    selectChat,
    deleteChat,
    apiConfig,
    setApiConfig,
  } = useAIChat();

  const [inputValue, setInputValue] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState(apiConfig.endpoint);
  const [apiKey, setApiKey] = useState(apiConfig.apiKey);
  const [enabled, setEnabled] = useState(apiConfig.isEnabled);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentChat?.messages]);

  const handleSubmitApiSettings = () => {
    setApiConfig({
      endpoint: apiEndpoint,
      apiKey: apiKey,
      isEnabled: enabled
    });
    setShowSettings(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-cyberdark-950">
      {/* Sidebar with chat history */}
      <div className="w-64 bg-cyberdark-900 border-r border-cyberdark-700 p-4 flex flex-col hidden md:block">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-cybergold-400">AI-Chat</h2>
          <div className="flex gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={createNewChat}
              className="h-8 w-8 text-cybergold-500 hover:text-cybergold-300"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Ny chat</span>
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => setShowSettings(true)}
              className="h-8 w-8 text-cybergold-500 hover:text-cybergold-300"
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Innstillinger</span>
            </Button>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {chatHistory.length === 0 ? (
            <div className="text-center py-8 text-cybergold-600">
              Ingen tidligere samtaler.
            </div>
          ) : (
            <div className="space-y-2">
              {chatHistory.map(chat => (
                <Card 
                  key={chat.id} 
                  className={`cursor-pointer hover:bg-cyberdark-800 transition-colors ${
                    currentChat?.id === chat.id ? 'border-cybergold-500 bg-cyberdark-800' : 'border-cyberdark-700'
                  }`}
                  onClick={() => selectChat(chat.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-cybergold-300 truncate">
                        {chat.title || 'Ny samtale'}
                      </h3>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-cybergold-600 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(chat.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-cybergold-600 mt-1 truncate">
                      {chat.messages.length > 0 
                        ? chat.messages[chat.messages.length - 1].content.slice(0, 40) + (chat.messages[chat.messages.length - 1].content.length > 40 ? '...' : '') 
                        : 'Ingen meldinger'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header for mobile */}
        <div className="md:hidden bg-cyberdark-900 border-b border-cyberdark-700 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-cybergold-400">AI-Chat</h2>
          <div className="flex gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={createNewChat}
              className="h-8 w-8 text-cybergold-500 hover:text-cybergold-300"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => setShowSettings(true)}
              className="h-8 w-8 text-cybergold-500 hover:text-cybergold-300"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 bg-cyberdark-950">
          {!currentChat || currentChat.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-cybergold-500/10 flex items-center justify-center mb-4">
                <Bot className="h-8 w-8 text-cybergold-400" />
              </div>
              <h3 className="text-xl font-medium text-cybergold-300 mb-2">AI-Assistent</h3>
              <p className="text-cybergold-500 max-w-md mb-6">
                Få hjelp, still spørsmål eller be om informasjon fra din personlige AI-assistent.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md">
                <Button 
                  variant="outline" 
                  className="border-cybergold-500/30 text-cybergold-400 hover:bg-cyberdark-800"
                  onClick={() => sendMessage('Fortell meg om Snakkaz sine sikkerhetsfunksjoner')}
                >
                  Sikkerhetsfunksjoner
                </Button>
                <Button 
                  variant="outline"
                  className="border-cybergold-500/30 text-cybergold-400 hover:bg-cyberdark-800"
                  onClick={() => sendMessage('Sammenlign Snakkaz med andre meldingsapper')}
                >
                  Sammenlign med andre
                </Button>
                <Button 
                  variant="outline"
                  className="border-cybergold-500/30 text-cybergold-400 hover:bg-cyberdark-800"
                  onClick={() => sendMessage('Hvordan sender jeg krypterte meldinger?')}
                >
                  Krypterte meldinger
                </Button>
                <Button 
                  variant="outline"
                  className="border-cybergold-500/30 text-cybergold-400 hover:bg-cyberdark-800"
                  onClick={() => sendMessage('Hvordan bruker jeg gruppechat-funksjonene?')}
                >
                  Gruppechat guide
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {currentChat.messages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-cybergold-600 text-black ml-auto' 
                      : 'bg-cyberdark-800 text-cybergold-300'
                  }`}>
                    <div className="flex items-center mb-1">
                      {message.role === 'user' ? (
                        <User className="h-4 w-4 mr-2" />
                      ) : (
                        <Bot className="h-4 w-4 mr-2" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.role === 'user' ? 'Deg' : 'AI-Assistent'} • {formatTime(message.timestamp)}
                      </span>
                    </div>
                    
                    {message.isProcessing ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Tenker...</span>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-900/20 border-t border-red-900/30 px-4 py-2">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {/* Input area */}
        <div className="border-t border-cyberdark-700 bg-cyberdark-900 p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Skriv en melding..."
              className="flex-1 bg-cyberdark-800 border-cyberdark-700 text-cybergold-300"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !inputValue.trim()}
              className="bg-cybergold-600 hover:bg-cybergold-700 text-black"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
            </Button>
          </form>
        </div>
      </div>
      
      {/* API Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-cyberdark-900 border-cyberdark-700">
          <DialogHeader>
            <DialogTitle className="text-cybergold-300">API Innstillinger</DialogTitle>
            <DialogDescription className="text-cybergold-500">
              Konfigurer tilkoblingen til din foretrukne AI-tjeneste
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="api-toggle" className="text-cybergold-300">Bruk egendefinert API</Label>
              <Switch 
                id="api-toggle" 
                checked={enabled} 
                onCheckedChange={setEnabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-endpoint" className="text-cybergold-300">API Endpoint</Label>
              <Input 
                id="api-endpoint" 
                value={apiEndpoint} 
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="f.eks. https://api.openai.com/v1/chat/completions"
                className="bg-cyberdark-800 border-cyberdark-700 text-cybergold-300"
                disabled={!enabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-cybergold-300">API Nøkkel</Label>
              <Input 
                id="api-key" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="din-api-nøkkel"
                type="password"
                className="bg-cyberdark-800 border-cyberdark-700 text-cybergold-300"
                disabled={!enabled}
              />
              <p className="text-xs text-cybergold-600">
                Din API-nøkkel lagres lokalt på din enhet
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-cyberdark-700 text-cybergold-400"
              onClick={() => setShowSettings(false)}
            >
              Avbryt
            </Button>
            <Button 
              className="bg-cybergold-600 hover:bg-cybergold-700 text-black"
              onClick={handleSubmitApiSettings}
            >
              Lagre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIChat;