import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Crown, Bitcoin } from 'lucide-react';
import FreeUserNavigation from '@/components/navigation/FreeUserNavigation';

interface Message {
  id: string;
  text: string;
  user: string;
  timestamp: Date;
  type: 'user' | 'system' | 'btc';
}

const BasicChatPage: React.FC = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Velkommen til Snakkaz Chat! 🚀',
      user: 'System',
      timestamp: new Date(),
      type: 'system'
    },
    {
      id: '2',
      text: 'Her kan du chatte med andre om BTC/NOK trading og mer!',
      user: 'System',
      timestamp: new Date(),
      type: 'system'
    },
    {
      id: '3',
      text: 'BTC/NOK rate: 1 BTC = 950,000 NOK 📈',
      user: 'Trading Bot',
      timestamp: new Date(),
      type: 'btc'
    }
  ]);

  const sendMessage = () => {
    if (message.trim() && user) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        user: user.email?.split('@')[0] || 'Anonym',
        timestamp: new Date(),
        type: 'user'
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      // Simple bot response for BTC mentions
      if (message.toLowerCase().includes('btc') || message.toLowerCase().includes('bitcoin')) {
        setTimeout(() => {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: '🤖 Interessert i BTC trading? Oppgrader til Premium for avanserte analyser!',
            user: 'Trading Bot',
            timestamp: new Date(),
            type: 'btc'
          };
          setMessages(prev => [...prev, botMessage]);
        }, 1000);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyberdark-900 to-cyberdark-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-cyberdark-800/50 border-cyberprimary-500/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <MessageCircle className="h-12 w-12 text-cyberprimary-400" />
            </div>
            <CardTitle className="text-2xl text-cyberprimary-100">Snakkaz Chat</CardTitle>
            <p className="text-cyberdark-300">Logg inn for å begynne å chatte</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-cyberdark-700/30 rounded-lg">
                <h4 className="font-semibold text-cyberprimary-200 mb-2">Chat Features:</h4>
                <ul className="text-sm text-cyberdark-300 space-y-1">
                  <li>• Chat med andre brukere</li>
                  <li>• BTC/NOK diskusjoner</li>
                  <li>• Basis trading-tips</li>
                </ul>
              </div>
              <div className="p-4 bg-gradient-to-r from-cyberprimary-900/20 to-cybersecondary-900/20 rounded-lg border border-cyberprimary-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-4 w-4 text-cyberprimary-400" />
                  <h4 className="font-semibold text-cyberprimary-200">Premium Features:</h4>
                </div>
                <ul className="text-sm text-cyberdark-300 space-y-1">
                  <li>• Krypterte private meldinger</li>
                  <li>• Avanserte BTC analyser</li>
                  <li>• Direktehandel funksjoner</li>
                  <li>• Premium trading signaler</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyberdark-900 to-cyberdark-800 flex">
      {/* Sidebar Navigation */}
      <FreeUserNavigation />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="container mx-auto max-w-4xl p-4 h-screen flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-cyberprimary-100 flex items-center gap-2">
                  <MessageCircle className="h-8 w-8 text-cyberprimary-400" />
                  Snakkaz Chat
                </h1>
                <p className="text-cyberdark-300">BTC/NOK Trading & Chat Community</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-cyberprimary-500/30 text-cyberprimary-300">
                  <Bitcoin className="h-3 w-3 mr-1" />
                  Chat Medlem
                </Badge>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <Card className="bg-cyberdark-800/50 border-cyberprimary-500/20 h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-cyberprimary-200">Chat Room</CardTitle>
                <Badge variant="secondary" className="bg-cyberdark-700 text-cyberdark-300">
                  {messages.filter(m => m.type === 'user').length} meldinger
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col gap-1 ${
                        msg.type === 'user' && msg.user === (user.email?.split('@')[0] || 'Anonym')
                          ? 'items-end' 
                          : 'items-start'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs text-cyberdark-400">
                        <span className={`font-medium ${
                          msg.type === 'system' ? 'text-cyberprimary-400' :
                          msg.type === 'btc' ? 'text-amber-400' :
                          'text-cyberdark-300'
                        }`}>
                          {msg.user}
                        </span>
                        <span>{msg.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <div 
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.type === 'user' && msg.user === (user.email?.split('@')[0] || 'Anonym')
                            ? 'bg-cyberprimary-600 text-white ml-auto' :
                          msg.type === 'system'
                            ? 'bg-cyberdark-700 text-cyberdark-200 border border-cyberprimary-500/20' :
                          msg.type === 'btc'
                            ? 'bg-amber-900/20 text-amber-200 border border-amber-500/20' :
                            'bg-cyberdark-700 text-cyberdark-200'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t border-cyberdark-700">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Skriv en melding..."
                    className="flex-1 bg-cyberdark-700 border-cyberdark-600 text-cyberdark-100 placeholder:text-cyberdark-400"
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="bg-cyberprimary-600 hover:bg-cyberprimary-700 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-cyberdark-400 mt-2">
                  💡 Tip: Skriv "BTC" for trading-tips! Oppgrader til Premium for avanserte funksjoner.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade Banner */}
          <Card className="mt-4 bg-gradient-to-r from-cyberprimary-900/20 to-cybersecondary-900/20 border-cyberprimary-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-cyberprimary-200 mb-1">Få Utvidet Tilgang</h3>
                  <p className="text-sm text-cyberdark-300">Få tilgang til krypterte meldinger, avanserte BTC-analyser og mer!</p>
                </div>
                <Button variant="outline" className="border-cyberprimary-500 text-cyberprimary-300 hover:bg-cyberprimary-500/10">
                  <Crown className="h-4 w-4 mr-2" />
                  Oppgrader
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BasicChatPage;
