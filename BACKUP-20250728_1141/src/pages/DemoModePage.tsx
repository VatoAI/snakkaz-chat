import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Users,
  Settings,
  Video,
  Phone,
  Smile,
  Paperclip,
  Mic,
  Search,
  Bell,
  Crown,
  Zap,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import { SystemStatus } from '../components/SystemStatus';
import '../styles/MASTER-DESIGN-SYSTEM.css';

const DemoModePage: React.FC = () => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');

  const handleSend = async () => {
    if (!input.trim()) {
      setError('Du må skrive en melding!');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setSending(true);
    setError('');

    // Simuler sending (i ekte app vil dette være MCP/SupaBase kall)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Melding sendt!');
      setInput('');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Kunne ikke sende melding. Prøv igjen.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Demo Banner with Status */}
      <motion.div
        className="liquid-glass p-4 text-center m-4 mb-0"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-3">
          <Crown className="w-6 h-6 text-yellow-400" />
          <h1 className="text-xl font-bold text-white">SnakkaZ Beta 2025 - DEMO MODE</h1>
          <Zap className="w-6 h-6 text-blue-400" />
        </div>
        <p className="text-sm text-gray-300 mt-2">
          Professional Chat Experience - Moderne Design med Glassmorphism
        </p>

        {/* Connection Status */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400' :
              connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
            }`} />
          <span className="text-xs text-gray-400">
            {connectionStatus === 'connected' ? 'Tilkoblet demo-server' :
              connectionStatus === 'connecting' ? 'Kobler til...' : 'Ikke tilkoblet'}
          </span>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <motion.div
            className="mt-3 p-3 bg-red-500/20 border border-red-400/50 rounded-lg flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            className="mt-3 p-3 bg-green-500/20 border border-green-400/50 rounded-lg flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">{success}</span>
          </motion.div>
        )}
      </motion.div>

      <div className="flex h-screen flex-col md:flex-row">
        {/* Sidebar - Hidden on mobile, can be toggled */}
        <motion.div
          className="glass-morphism w-full md:w-80 m-4 mr-2 p-6 hidden md:block"
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">SnakkaZ Chat</h2>
              <p className="text-sm text-gray-400">Professional Beta</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="liquid-glass p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Online Users (4)
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Du', status: 'online', avatar: '👤' },
                  { name: 'Beta Tester', status: 'online', avatar: '🧪', typing: true },
                  { name: 'Design Lead', status: 'away', avatar: '🎨' },
                  { name: 'Developer', status: 'online', avatar: '👨‍💻' }
                ].map((user, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                        {user.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-800 ${user.status === 'online' ? 'bg-green-400' : 'bg-yellow-400'
                        }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{user.name}</p>
                      {user.typing && <p className="text-blue-400 text-xs">typing...</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass-morphism p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-3">Features</h3>
              <div className="space-y-2">
                {[
                  { icon: Video, label: 'Video Chat', active: true },
                  { icon: Phone, label: 'Voice Calls', active: true },
                  { icon: Crown, label: 'Premium Features', active: false },
                  { icon: Zap, label: 'Real-time Sync', active: true }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <feature.icon className={`w-4 h-4 ${feature.active ? 'text-green-400' : 'text-gray-400'}`} />
                    <span className={feature.active ? 'text-white' : 'text-gray-400'}>
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Chat Area */}
        <motion.div
          className="flex-1 flex flex-col m-4 ml-2"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Chat Header */}
          <div className="glass-morphism p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-white">General Chat</h3>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>4 online</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Video className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Phone className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Messages Area */}
          <div className="liquid-glass flex-1 p-6 mb-4 overflow-y-auto">
            <div className="space-y-4">
              {[
                {
                  user: 'SnakkaZ System',
                  message: '🎉 Velkommen til SnakkaZ Beta 2025! Moderne chat med glassmorphism design.',
                  time: '14:30',
                  type: 'system'
                },
                {
                  user: 'Design Lead',
                  message: 'Wow! Dette nye designet ser fantastisk ut! 🎨 Glassmorphism effekten er perfekt.',
                  time: '14:32',
                  type: 'user'
                },
                {
                  user: 'Developer',
                  message: 'Responsive design fungerer flawlessly på alle enheter. Smooth animasjoner! 💯',
                  time: '14:33',
                  type: 'user'
                },
                {
                  user: 'Beta Tester',
                  message: 'Professional og moderne - dette kan konkurrere med Discord! 🚀',
                  time: '14:35',
                  type: 'user',
                  typing: true
                }
              ].map((msg, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {msg.user[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{msg.user}</span>
                      <span className="text-xs text-gray-400">{msg.time}</span>
                    </div>
                    <div className={`p-3 rounded-lg max-w-lg ${msg.type === 'system'
                        ? 'bg-blue-500/20 border border-blue-400/30'
                        : 'bg-white/10 border border-white/20'
                      }`}>
                      <p className="text-white">{msg.message}</p>
                    </div>
                    {msg.typing && (
                      <div className="flex items-center gap-1 mt-2 text-blue-400 text-sm">
                        <div className="flex gap-1">
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" />
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                        <span>typing...</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Message Input with Error Handling */}
          <div className="glass-morphism p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Smile className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (error) setError(''); // Clear error on typing
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Skriv en melding..."
                  className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-all ${error
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-white/20 focus:border-blue-400'
                    }`}
                  disabled={sending}
                />
              </div>
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <motion.button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className={`p-3 rounded-lg transition-all flex items-center justify-center ${!input.trim() || sending
                      ? 'bg-gray-600 cursor-not-allowed opacity-50'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105'
                    }`}
                  whileHover={!input.trim() || sending ? {} : { scale: 1.05 }}
                  whileTap={!input.trim() || sending ? {} : { scale: 0.95 }}
                >
                  {sending ? (
                    <Loader className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 text-white" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Input Error Message */}
            {error && (
              <motion.div
                className="mt-2 text-red-400 text-sm flex items-center gap-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            {/* Input Helper Text */}
            <div className="mt-2 text-xs text-gray-400">
              Trykk Enter for å sende • Shift+Enter for ny linje
            </div>

            {/* System Status */}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <SystemStatus />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DemoModePage;
