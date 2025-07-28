import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import {
  Send,
  Users,
  Plus,
  Search,
  Settings,
  LogOut,
  Hash,
  Menu,
  X,
  Loader,
  Wifi,
  WifiOff,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SnakkaZLogo } from '@/components/branding/SnakkaZLogo';

// 🚀 SAFE LAZY LOAD WITH ERROR HANDLING
const MCPDashboard = lazy(() => 
  import('@/components/dashboard/MCPDashboard').catch(() => ({ 
    default: () => <div className="text-white p-4">Dashboard ikke tilgjengelig</div> 
  }))
);
const SystemArchitecture = lazy(() => 
  import('@/components/system/SystemArchitecture').catch(() => ({ 
    default: () => <div className="text-white p-4">System arkitektur ikke tilgjengelig</div> 
  }))
);
const SnakkaZAI = lazy(() => 
  import('@/components/ai/SnakkaZAI').catch(() => ({ 
    default: () => <div className="text-white p-4">AI ikke tilgjengelig</div> 
  }))
);
const SnakkaZInviteSystem = lazy(() => 
  import('@/components/invite/SnakkaZInviteSystem').catch(() => ({ 
    default: () => <div className="text-white p-4">Invite system ikke tilgjengelig</div> 
  }))
);

// Loading fallback component
const ComponentLoader = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center h-32">
    <div className="flex flex-col items-center gap-2 text-white/70">
      <Loader className="h-6 w-6 animate-spin" />
      <span className="text-sm">Laster {name}...</span>
    </div>
  </div>
);

// Type definitions for MCP compatibility
interface ChatRoom {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  member_count: number;
  type?: 'public' | 'private';
  participant_count?: number;
}

interface UserProfile {
  id: string;
  email?: string;
  username: string;
  avatar_url?: string;
  status: 'online' | 'offline' | 'away';
  last_seen: string;
  display_name?: string;
}

import { useMCPWebRTC } from '@/providers/MCPWebRTCProvider';
import MCPWebRTCStatus from '@/components/chat/MCPWebRTCStatus';
import { useMCPChatService } from '@/hooks/useMCPChatService';
import { MCPAdminDashboard } from '@/components/admin/MCPAdminDashboard';

const SnakkaZChatBeta: React.FC = () => {
  // 🚨 SUPER AGGRESSIVE DEBUGGING
  console.log('%c🌊 SnakkaZChatBeta COMPONENT IS EXECUTING!', 'background: #00ff00; color: #000; font-size: 20px; padding: 10px;');
  console.log('%c🎨 MASTER DESIGN SYSTEM ACTIVE!', 'background: #0066ff; color: #fff; font-size: 16px; padding: 5px;');
  console.log('%c🚨 EMERGENCY MODE ACTIVATED!', 'background: #ff0000; color: #fff; font-size: 16px; padding: 5px;');

  // 🚨 EMERGENCY FIX FOR VISIBILITY
  console.log('🚨 EMERGENCY: SnakkaZChatBeta FORCE LOADING!');  // Add emergency CSS to guarantee visibility
  const emergencyStyle = `
    .emergency-snakkaz-visible {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      position: relative !important;
      z-index: 9999 !important;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      min-height: 100vh !important;
      color: white !important;
    }
    .emergency-debug-indicator {
      position: fixed !important;
      top: 10px !important;
      right: 10px !important;
      background: #4CAF50 !important;
      color: white !important;
      padding: 8px 16px !important;
      border-radius: 8px !important;
      z-index: 99999 !important;
      font-weight: bold !important;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3) !important;
    }
  `;

  // Insert emergency CSS
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = emergencyStyle;
    document.head.appendChild(styleElement);

    console.log('🚨 EMERGENCY CSS APPLIED - SnakkaZChatBeta SHOULD BE VISIBLE!');

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const { user, signOut } = useAuth();
  const { toast } = useToast();

  // Hent MCP WebRTC-kontekst
  const {
    isInitialized: mcpInitialized,
    isConnecting: mcpConnecting,
    error: mcpError
  } = useMCPWebRTC();

  // 🚀 MCP Chat Service - LIVE CHAT FUNKSJONALITET
  const {
    isConnected: mcpConnected,
    isLoading: mcpLoading,
    error: mcpChatError,
    rooms: mcpRooms,
    messages: mcpMessages,
    systemMetrics,
    sendMessage: sendMCPMessage
  } = useMCPChatService();

  // State
  const [message, setMessage] = useState('');
  const [activeRoom, setActiveRoom] = useState('mcp-main-room');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // NEVER LOADING - FORCE VISIBLE
  const [isInviteSystemOpen, setIsInviteSystemOpen] = useState(false);
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);
  const [showMCPDashboard, setShowMCPDashboard] = useState(false);
  const [showSystemArchitecture, setShowSystemArchitecture] = useState(false);
  const [showAIInterface, setShowAIInterface] = useState(false);
  const [aiMood, setAiMood] = useState<'happy' | 'neutral' | 'curious' | 'focused' | 'sleepy'>('neutral');

  // 🤖 NEW: Ollama AI Integration
  const {
    isConnected: ollamaConnected,
    models: ollamaModels,
    generateNorwegian,
    error: ollamaError
  } = useOllama();

  // 🚀 EMERGENCY: SKIP OLD CHAT SERVICE - USE ONLY MCP!
  // Chat data - Use ONLY MCP rooms and messages
  const rooms: ChatRoom[] = mcpRooms.map(room => ({
    id: room.id,
    name: room.name,
    description: room.description || 'MCP Chat Room',
    created_by: 'mcp-system',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    member_count: 1,
    type: 'public' as const,
    participant_count: 1
  }));

  const onlineUsers: UserProfile[] = [
    {
      id: 'snakkaz-user-1',
      email: 'user@snakkaz.com',
      username: 'SnakkaZ User',
      avatar_url: '',
      status: 'online',
      last_seen: new Date().toISOString(),
      display_name: 'SnakkaZ User'
    }
  ];

  // 🌊 BRUK MCP MESSAGES SOM HISTORIKK!
  const messages = mcpMessages.map(mcpMsg => ({
    id: mcpMsg.id,
    content: mcpMsg.content,
    user_id: mcpMsg.sender,
    room_id: mcpMsg.room || activeRoom,
    created_at: mcpMsg.timestamp,
    message_type: 'text' as const,
    updated_at: mcpMsg.timestamp,
    is_edited: false
  }));

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🚀 EMERGENCY: SKIP ALL OLD CHAT SERVICE - USE ONLY MCP!
  useEffect(() => {
    console.log('🌊 SNAKKAZ MCP SYSTEM LOADING...');
    console.log('🎨 MASTER Design System Active - Crystal Blue Theme!');
    console.log('🚀 EMERGENCY MODE: Skipping old chatService, using only MCP');

    // Set active room to first available MCP room
    if (mcpRooms.length > 0 && !activeRoom) {
      setActiveRoom(mcpRooms[0].id);
    }

    // Force loading off
    setIsLoading(false);

    console.log('🌊 MCP SYSTEM READY!');
    console.log('� Design: Liquid Glass ✅ | Colors: Blue/Cyan ✅');
    console.log('🚀 Emergency skip of legacy chatService ✅');

    return () => {
      // No cleanup needed for MCP (handled elsewhere)
      console.log('🌊 SnakkaZChatBeta cleanup');
    };
  }, [mcpRooms, activeRoom]);

  // Subscribe to messages when active room changes
  useEffect(() => {
    if (!activeRoom) return;

    console.log('🌊 Active room changed to:', activeRoom);
    console.log('🌊 Using MCP messages only');

    return () => {
      // No cleanup needed - MCP handles this
    };
  }, [activeRoom]);

  // 🌊 MCP SEND MESSAGE FUNCTION!
  const sendMessage = async () => {
    if (!message.trim() || !user || !activeRoom) return;

    try {
      console.log('📤 Sending MCP message:', message.trim());
      await sendMCPMessage(message.trim(), activeRoom, {
        encrypt: true,
        priority: 'normal'
      });
      setMessage('');
      messageInputRef.current?.focus();

      toast({
        title: "✅ Melding sendt!",
        description: "Din melding ble sendt via MCP system",
      });
    } catch (error) {
      console.error('Failed to send MCP message:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke sende melding via MCP. Prøv igjen.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 🌊 FILTRER MELDINGER (MCP HISTORIKK!)
  const filteredMessages = messages;
  const activeRoomData = rooms.find(r => r.id === activeRoom);

  // 🚀 MCP STATUS DEBUG
  useEffect(() => {
    console.log('🔍 MCP CHAT STATUS:', {
      mcpConnected,
      mcpLoading,
      mcpMessages: mcpMessages.length,
      mcpRooms: mcpRooms.length,
      systemMetrics,
      mcpChatError
    });
  }, [mcpConnected, mcpMessages, mcpRooms, systemMetrics]);

  if (isLoading) {
    return (
      <div className="snakkaz-loading">
        <div className="snakkaz-loading-content">
          <div className="snakkaz-spinner" />
          <h2 className="text-2xl font-bold text-gradient mb-2">SnakkaZ 🌊</h2>
          <p className="text-white/60">Laster MCP Chat System...</p>
          <div className="mt-4 text-sm text-cyan-300/70">
            MCP: {mcpConnected ? '🟢 Tilkoblet' : '🔴 Kobler til...'}
          </div>
          <h2>SnakkaZ</h2>
          <p>Loading Crystal Blue Theme...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container emergency-snakkaz-visible">
      {/* 🚨 EMERGENCY DEBUG INDICATOR */}
      <div className="emergency-debug-indicator">
        🚨 SnakkaZChatBeta AKTIV! 🌊
      </div>

      {/* Debug overlay with MASTER design + MCP STATUS */}
      <div className="fixed top-4 left-4 z-[100] space-y-2">
        <div className="glass-card px-4 py-2 text-white text-sm font-mono">
          🌊 SNAKKAZ MASTER DESIGN SYSTEM AKTIV
        </div>
        <div className="glass-card px-4 py-2 text-white text-sm font-mono">
          Rooms: {rooms.length} | Messages: {mcpMessages.length}
        </div>
        <div className="glass-card px-4 py-2 text-white text-sm font-mono">
          🚀 MCP: {mcpConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
        <div className="glass-card px-4 py-2 text-white text-sm font-mono">
          Design: Crystal Blue ✅ | Theme: Master ✅
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMCPDashboard(!showMCPDashboard)}
          className="glass-button text-xs"
        >
          {showMCPDashboard ? '❌ Hide' : '🚀 MCP Dashboard'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSystemArchitecture(!showSystemArchitecture)}
          className="glass-button text-xs"
        >
          {showSystemArchitecture ? '❌ Hide' : '🏗️ System'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAIInterface(!showAIInterface)}
          className="glass-button text-xs"
        >
          {showAIInterface ? '❌ Hide' : '🤖 AI'}
        </Button>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 glass-panel border-b relative z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-primary hover:text-secondary"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>

        <div className="flex items-center space-x-2">
          <Hash size={16} className="text-primary" />
          <span className="text-white font-medium">
            {activeRoomData?.name || 'Chat'}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsUserListOpen(!isUserListOpen)}
          className="text-primary hover:text-secondary"
        >
          <Users size={20} />
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Sidebar - Rooms */}
        <div className={cn(
          "chat-sidebar",
          isMobileMenuOpen ? "fixed inset-y-0 left-0 z-50 w-80" : "hidden lg:block"
        )}>
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <SnakkaZLogo variant="header" animated={true} />
            </div>
            {/* User info */}
            <div className="glass-card p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {user?.email?.split('@')[0]}
                  </p>
                  <p className="text-blue-500 text-xs">Online</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-cyan-400 hover:text-cyan-300 p-1"
                    title="Admin Dashboard"
                  >
                    <Link to="/admin">
                      <Shield size={16} />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="text-cyan-500 hover:text-blue-500 p-1"
                    title="Logg ut"
                  >
                    <LogOut size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Room List */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              <div className="text-blue-400 text-sm font-medium mb-3 flex items-center justify-between">
                OFFENTLIGE ROM
                <Button variant="ghost" size="sm" className="p-1 h-auto">
                  <Plus size={14} />
                </Button>
              </div>

              {rooms.filter(r => r.type === 'public').map((room) => (
                <button
                  key={room.id}
                  onClick={() => {
                    setActiveRoom(room.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all duration-200",
                    "flex items-center justify-between group",
                    activeRoom === room.id
                      ? "bg-slate-800/60 backdrop-blur-lg text-white"
                      : "hover:bg-slate-800/60 backdrop-blur-lg text-liquid-secondary hover:text-white"
                  )}
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <Hash size={16} className="text-blue-400" />
                    <span className="font-medium">{room.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {room.participant_count || 0}
                  </Badge>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header (Desktop) */}
          <div className="hidden lg:flex items-center justify-between p-4 bg-slate-800/60 backdrop-blur-lg border-b border-blue-400/20">
            <div className="flex items-center space-x-3">
              <Hash size={20} className="text-blue-400" />
              <h2 className="text-xl font-semibold text-white">
                {activeRoomData?.name || 'Chat'}
              </h2>
              <Badge variant="outline" className="border-blue-400/50 text-blue-400">
                {activeRoomData?.participant_count || 0} medlemmer
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-blue-400">
                <Search size={16} />
              </Button>
              <Button variant="ghost" size="sm" className="text-blue-400">
                <Settings size={16} />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 max-w-4xl mx-auto">
              {filteredMessages.map((msg) => (
                <div key={msg.id} className="group">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {msg.user_id?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-white">
                          {msg.user_id === 'user-1' ? 'Admin 🌊' :
                            msg.user_id === 'user-2' ? 'Designer 🎨' :
                              'You 🌊'}
                        </span>
                        <span className="text-blue-400 text-xs">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="snakkaz-liquid-message p-3 rounded-lg">
                        <p className="text-white">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 bg-slate-800/60 backdrop-blur-lg border-t border-blue-400/20">
            <div className="max-w-4xl mx-auto">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Skriv en melding til ${activeRoomData?.name || 'rommet'}...`}
                    ref={messageInputRef}
                    className="bg-slate-800/60 backdrop-blur-lg border-blue-400/30 text-white placeholder:text-blue-400 pr-12"
                  />
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="bg-slate-800/60 backdrop-blur-lg border-blue-400/30 hover:border-blue-400/50 text-blue-400 hover:text-white"
                >
                  <Send size={18} />
                </Button>
              </div>

              {/* MCP WebRTC Status Indicator */}
              <div className="mt-2 flex items-center justify-between">
                <div
                  onClick={() => setShowConnectionStatus(!showConnectionStatus)}
                  className="flex items-center space-x-1 text-xs cursor-pointer text-blue-400 hover:text-white transition-colors"
                >
                  {mcpInitialized ? (
                    <>
                      <Wifi size={14} className="text-green-500" />
                      <span>Sikker P2P-tilkobling aktiv</span>
                    </>
                  ) : mcpConnecting ? (
                    <>
                      <Loader size={14} className="animate-spin text-yellow-500" />
                      <span>Kobler til P2P-nettverk...</span>
                    </>
                  ) : (
                    <>
                      <WifiOff size={14} className="text-red-500" />
                      <span>Standard tilkobling</span>
                    </>
                  )}
                </div>

                {mcpError && (
                  <div className="text-xs text-red-400">
                    Tilkoblingsfeil: {mcpError}
                  </div>
                )}
              </div>

              {/* Detailed MCP WebRTC Status */}
              {showConnectionStatus && (
                <div className="mt-2 bg-slate-800/60 backdrop-blur-lg border border-blue-400/20 rounded-lg p-3">
                  <h4 className="text-sm font-medium mb-2 text-blue-400">Tilkoblingsstatus</h4>
                  <MCPWebRTCStatus
                    userId={user?.id || ''}
                    serverUrl={process.env.REACT_APP_MCP_SERVER_URL || 'wss://mcp.snakkaz.com'}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User List (Desktop & Mobile) */}
        <div className={cn(
          "bg-slate-800/60 backdrop-blur-lg border-l border-blue-400/20 flex flex-col",
          "lg:w-64 lg:block",
          isUserListOpen ? "fixed inset-y-0 right-0 z-50 w-64" : "hidden lg:block"
        )}>
          <div className="p-4 border-b border-blue-400/20">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Online ({onlineUsers.length})</h3>
              <Button variant="ghost" size="sm" className="text-blue-400 lg:hidden" onClick={() => setIsUserListOpen(false)}>
                <X size={16} />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              {onlineUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-800/60 backdrop-blur-lg cursor-pointer">
                  <div className="relative">
                    <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user.display_name?.charAt(0).toUpperCase() || user.id?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-liquid-dark"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {user.display_name || user.id || 'Anonym'}
                    </p>
                    <p className="text-blue-400 text-xs">Online</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Mobile overlay */}
      {(isMobileMenuOpen || isUserListOpen) && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsUserListOpen(false);
          }}
        />
      )}

      {/* Invite System (Desktop) */}
      <div className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        isInviteSystemOpen ? "block" : "hidden"
      )}>
        <div className="w-full max-w-md bg-slate-800/60 backdrop-blur-lg rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Inviter til rom</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsInviteSystemOpen(false)}
              className="text-blue-400"
            >
              <X size={16} />
            </Button>
          </div>

          <div className="space-y-4">
            <SnakkaZInviteSystem />
          </div>
        </div>
      </div>

      {/* 🚀 MCP ADMIN DASHBOARD OVERLAY */}
      {showMCPDashboard && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="glass-crystal rounded-lg shadow-2xl p-6 relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMCPDashboard(false)}
                className="absolute top-4 right-4 text-cyan-200 hover:text-white z-10"
              >
                <X size={20} />
              </Button>

              <Suspense fallback={<ComponentLoader name="MCP Dashboard" />}>
                <MCPDashboard />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {/* 🏗️ SYSTEM ARCHITECTURE OVERLAY */}
      {showSystemArchitecture && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-7xl max-h-[90vh] overflow-y-auto">
            <div className="glass-crystal rounded-lg shadow-2xl p-6 relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSystemArchitecture(false)}
                className="absolute top-4 right-4 text-cyan-200 hover:text-white z-10"
              >
                <X size={20} />
              </Button>

              <Suspense fallback={<ComponentLoader name="System Architecture" />}>
                <SystemArchitecture />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {/* 🤖 AI INTERFACE OVERLAY */}
      {showAIInterface && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="glass-crystal rounded-lg shadow-2xl p-6 relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIInterface(false)}
                className="absolute top-4 right-4 text-cyan-200 hover:text-white z-10"
              >
                <X size={20} />
              </Button>

              <Suspense fallback={<ComponentLoader name="SnakkaZ AI" />}>
                <SnakkaZAI isActive={true} />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {/* 🤖 AI INTERFACE OVERLAY */}
      {showAIInterface && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="glass-crystal rounded-lg shadow-2xl p-6 relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIInterface(false)}
                className="absolute top-4 right-4 text-cyan-200 hover:text-white z-10"
              >
                <X size={20} />
              </Button>

              <Suspense fallback={<ComponentLoader name="SnakkaZ AI" />}>
                <SnakkaZAI isActive={true} />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {/* 📨 INVITE SYSTEM OVERLAY */}
      {showInviteSystem && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="glass-crystal rounded-lg shadow-2xl p-6 relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInviteSystem(false)}
                className="absolute top-4 right-4 text-cyan-200 hover:text-white z-10"
              >
                <X size={20} />
              </Button>

              <Suspense fallback={<ComponentLoader name="Invite System" />}>
                <SnakkaZInviteSystem />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakkaZChatBeta;
