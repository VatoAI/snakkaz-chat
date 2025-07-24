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
import VoiceMessageRecorder from '@/components/chat/VoiceMessageRecorder';
import VoiceMessagePlayer from '@/components/chat/VoiceMessagePlayer';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  type: 'text' | 'welcome' | 'community' | 'system' | 'voice';
  avatar?: string;
  status?: 'sending' | 'sent' | 'read';
  audioUrl?: string;
  duration?: number;
  waveformData?: number[];
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  isTyping?: boolean;
}

const ProfessionalChatPage: React.FC = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '🎉 Velkommen til SnakkaZ Beta 2025! Den ultimate chat-opplevelsen.',
      sender: 'SnakkaZ System',
      timestamp: new Date(),
      type: 'welcome',
      avatar: '/snakkaz-icon-192.png',
      status: 'read'
    },
    {
      id: '2',
      content: '💬 Moderne design, sanntids-chat og profesjonelle funksjoner venter på deg!',
      sender: 'Community Bot',
      timestamp: new Date(),
      type: 'community',
      avatar: '/snakkaz-icon-192.png',
      status: 'read'
    }
  ]);

  const [onlineUsers] = useState<User[]>([
    { id: '1', name: 'Du', status: 'online', avatar: '/snakkaz-icon-192.png' },
    { id: '2', name: 'Beta Tester', status: 'online', isTyping: true },
    { id: '3', name: 'SnakkaZ Dev', status: 'away' },
    { id: '4', name: 'Community Lead', status: 'online' }
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        content: message,
        sender: user.email?.split('@')[0] || 'Du',
        timestamp: new Date(),
        type: 'text',
        avatar: '/snakkaz-icon-192.png',
        status: 'sending'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Simulate message being sent
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'sent' as const }
              : msg
          )
        );
      }, 500);
    }
  };

  const sendVoiceMessage = (audioBlob: Blob, duration: number, waveformData: number[]) => {
    if (user) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const newMessage: Message = {
        id: Date.now().toString(),
        content: 'Voice message',
        sender: user.email?.split('@')[0] || 'Du',
        timestamp: new Date(),
        type: 'voice',
        avatar: '/snakkaz-icon-192.png',
        status: 'sending',
        audioUrl,
        duration,
        waveformData
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Simulate message being sent
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'sent' as const }
              : msg
          )
        );
      }, 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('no-NO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div 
          className="liquid-glass p-8 max-w-md w-full text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SnakkaZ Beta</h1>
          <p className="text-gray-400 mb-6">Logg inn for å begynne din profesjonelle chat-opplevelse</p>
          <div className="space-y-4">
            <div className="glass-morphism p-4">
              <h4 className="font-semibold text-blue-300 mb-2">Chat Features:</h4>
              <ul className="text-sm text-gray-300 space-y-1 text-left">
                <li>• Sanntids chat med moderne design</li>
                <li>• Profesjonelle animasjoner</li>
                <li>• Glassmorphism UI</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Professional Header */}
      <motion.div 
        className="chat-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">SnakkaZ Beta</h1>
              <p className="text-sm text-gray-400">Chat • {onlineUsers.length} online</p>
            </div>
          </motion.div>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button 
            className="glass-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search className="w-4 h-4" />
          </motion.button>
          <motion.button 
            className="glass-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Video className="w-4 h-4" />
          </motion.button>
          <motion.button 
            className="glass-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      <div className="flex flex-1">
        {/* Professional Sidebar */}
        <motion.div 
          className="sidebar"
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="sidebar-header">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white">SnakkaZ</h2>
              <p className="text-xs text-gray-400">Beta 2025</p>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-item active">
              <Home className="w-4 h-4" />
              <span>Hjem</span>
            </div>
            <div className="nav-item">
              <MessageCircle className="w-4 h-4" />
              <span>Meldinger</span>
            </div>
            <div className="nav-item">
              <Users className="w-4 h-4" />
              <span>Kontakter</span>
            </div>
            <div className="nav-item">
              <Crown className="w-4 h-4" />
              <span>Premium</span>
            </div>
            <div className="nav-item">
              <Shield className="w-4 h-4" />
              <span>Sikkerhet</span>
            </div>
          </nav>

          {/* Online Users */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Online Brukere</h3>
            <div className="space-y-2">
              <AnimatePresence>
                {onlineUsers.map((u, index) => (
                  <motion.div
                    key={u.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                        {u.name[0]}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${
                        u.status === 'online' ? 'bg-green-500' : 
                        u.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{u.name}</p>
                      {u.isTyping ? (
                        <motion.p 
                          className="text-xs text-blue-400"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          skriver...
                        </motion.p>
                      ) : (
                        <p className="text-xs text-gray-400 capitalize">{u.status}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <motion.div 
            className="chat-messages"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  className={`message-bubble ${msg.sender === (user?.email?.split('@')[0] || 'Du') ? 'own' : 'other'}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {msg.sender !== (user?.email?.split('@')[0] || 'Du') && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                        {msg.sender[0]}
                      </div>
                      <span className="text-xs font-medium text-gray-300">{msg.sender}</span>
                    </div>
                  )}
                  
                  {msg.type === 'voice' && msg.audioUrl && msg.duration && msg.waveformData ? (
                    <VoiceMessagePlayer 
                      audioUrl={msg.audioUrl}
                      duration={msg.duration}
                      waveformData={msg.waveformData}
                      isFromSelf={msg.sender === (user?.email?.split('@')[0] || 'Du')}
                    />
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">{formatTime(msg.timestamp)}</span>
                    {msg.sender === (user?.email?.split('@')[0] || 'Du') && (
                      <div className="flex items-center gap-1">
                        {msg.status === 'sending' && (
                          <motion.div 
                            className="w-2 h-2 bg-gray-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          />
                        )}
                        {msg.status === 'sent' && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        )}
                        {msg.status === 'read' && (
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </motion.div>

          {/* Professional Input */}
          <motion.div 
            className="chat-input"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.button 
              className="glass-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Paperclip className="w-4 h-4" />
            </motion.button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Skriv en melding..."
                className="w-full"
              />
              {isTyping && (
                <motion.div 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-blue-400 rounded-full" />
                    <div className="w-1 h-1 bg-blue-400 rounded-full" />
                    <div className="w-1 h-1 bg-blue-400 rounded-full" />
                  </div>
                </motion.div>
              )}
            </div>

            <motion.button 
              className="glass-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="w-4 h-4" />
            </motion.button>

            <motion.button 
              className="glass-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowVoiceRecorder(true)}
            >
              <Mic className="w-4 h-4" />
            </motion.button>

            <motion.button 
              className="glass-button primary"
              onClick={sendMessage}
              disabled={!message.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      <FreeUserNavigation />

      {/* Voice Message Recorder */}
      {showVoiceRecorder && (
        <VoiceMessageRecorder
          onSendVoiceMessage={sendVoiceMessage}
          onClose={() => setShowVoiceRecorder(false)}
        />
      )}
    </div>
  );
};

export default ProfessionalChatPage;
