import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Crown, 
  Bitcoin, 
  Settings, 
  Users, 
  Shield,
  Zap,
  Home,
  LogOut,
  Smile,
  Paperclip,
  Mic,
  Video,
  Phone,
  MoreHorizontal,
  Search,
  Bell
} from 'lucide-react';
import '../styles/professional-modern-2025.css';
import FreeUserNavigation from '@/components/navigation/FreeUserNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import VoiceMessageRecorder from '@/components/chat/VoiceMessageRecorder';
import VoiceMessagePlayer from '@/components/chat/VoiceMessagePlayer';

interface Message {
  id: string;
  text?: string;
  user: string;
  timestamp: Date;
  type: 'user' | 'welcome' | 'community' | 'voice';
  audioUrl?: string;
  duration?: number;
  waveformData?: number[];
}

const BasicChatPage: React.FC = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Velkommen til Snakkaz Chat! 🚀',
      user: 'Velkommen',
      timestamp: new Date(),
      type: 'welcome'
    },
    {
      id: '2',
      text: 'Del dine tanker, møt nye venner og bygg ekte forbindelser her! 💬',
      user: 'Fellesskap',
      timestamp: new Date(),
      type: 'community'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

      // Encourage community interaction instead of bot responses
      if (message.toLowerCase().includes('hei') || message.toLowerCase().includes('hallo')) {
        setTimeout(() => {
          const encouragementMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: '👋 Flott at du vil chatte! Inviter venner til å bli med - desto flere, desto morsommere blir det!',
            user: 'Fellesskap',
            timestamp: new Date(),
            type: 'community'
          };
          setMessages(prev => [...prev, encouragementMessage]);
        }, 1000);
      }
    }
  };

  const sendVoiceMessage = (audioBlob: Blob, duration: number, waveformData: number[]) => {
    if (user) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const newMessage: Message = {
        id: Date.now().toString(),
        user: user.email?.split('@')[0] || 'Anonym',
        timestamp: new Date(),
        type: 'voice',
        audioUrl,
        duration,
        waveformData
      };
      setMessages(prev => [...prev, newMessage]);
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
                  <h4 className="font-semibold text-cyberprimary-200">Avanserte Features:</h4>
                </div>
                <ul className="text-sm text-cyberdark-300 space-y-1">
                  <li>• Krypterte private meldinger</li>
                  <li>• Avanserte BTC analyser</li>
                  <li>• Direktehandel funksjoner</li>
                  <li>• Utvidede trading signaler</li>
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
                          msg.type === 'welcome' ? 'text-cybergold-400' :
                          msg.type === 'community' ? 'text-green-400' :
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
                          msg.type === 'welcome'
                            ? 'bg-cybergold-900/20 text-cybergold-200 border border-cybergold-500/20' :
                          msg.type === 'community'
                            ? 'bg-green-900/20 text-green-200 border border-green-500/20' :
                          msg.type === 'voice'
                            ? 'bg-purple-900/20 border border-purple-500/20 p-2' :
                            'bg-cyberdark-700 text-cyberdark-200'
                        }`}
                      >
                        {msg.type === 'voice' && msg.audioUrl ? (
                          <VoiceMessagePlayer
                            audioUrl={msg.audioUrl}
                            duration={msg.duration || 0}
                            waveformData={msg.waveformData || []}
                            isFromSelf={msg.user === (user?.email?.split('@')[0] || 'Anonym')}
                          />
                        ) : (
                          msg.text
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div ref={messagesEndRef} />
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
                    onClick={() => setShowVoiceRecorder(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    title="Send voice message"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="bg-cyberprimary-600 hover:bg-cyberprimary-700 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-cyberdark-400 mt-2">
                  💡 Tip: Skriv "BTC" for trading-tips! Få utvidet tilgang for avanserte funksjoner.
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

      {/* Voice Message Recorder Modal */}
      {showVoiceRecorder && (
        <VoiceMessageRecorder
          onSendVoiceMessage={sendVoiceMessage}
          onClose={() => setShowVoiceRecorder(false)}
        />
      )}
    </div>
  );
};

export default BasicChatPage;