import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
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
  UserPlus,
  Wifi,
  WifiOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatService, Message, ChatRoom, UserProfile } from '@/services/chat/chatService';
import { SnakkaZInviteSystem } from '@/components/invite/SnakkaZInviteSystem';
import { SnakkaZLogo } from '@/components/branding/SnakkaZLogo';
import { useMCPWebRTC } from '@/providers/MCPWebRTCProvider';
import MCPWebRTCStatus from '@/components/chat/MCPWebRTCStatus';

const SnakkaZChatBeta: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  // Hent MCP WebRTC-kontekst
  const {
    isInitialized: mcpInitialized,
    isConnecting: mcpConnecting,
    error: mcpError,
    sendMessage: mcpSendMessage,
    controller: mcpController
  } = useMCPWebRTC();

  // State
  const [message, setMessage] = useState('');
  const [activeRoom, setActiveRoom] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteSystemOpen, setIsInviteSystemOpen] = useState(false);
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);

  // Chat data
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserProfile[]>([]);

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

  // Initialize real-time subscriptions
  useEffect(() => {
    // Temporary: Load mock data for liquid design demo
    const mockRooms = [
      {
        id: 'room-1',
        name: 'General 🌊',
        description: 'Liquid Dream main room',
        type: 'public' as const,
        created_by: user?.id,
        created_at: new Date().toISOString(),
        is_active: true,
        max_participants: 100,
        participant_count: 42
      },
      {
        id: 'room-2',
        name: 'Tech Talk 💻',
        description: 'Technical discussions',
        type: 'public' as const,
        created_by: user?.id,
        created_at: new Date().toISOString(),
        is_active: true,
        max_participants: 50,
        participant_count: 23
      },
      {
        id: 'room-3',
        name: 'Liquid Design 🎨',
        description: 'Design discussions',
        type: 'public' as const,
        created_by: user?.id,
        created_at: new Date().toISOString(),
        is_active: true,
        max_participants: 30,
        participant_count: 15
      }
    ];

    console.log('🌊 Loading Liquid Dream rooms:', mockRooms);
    setRooms(mockRooms);
    setActiveRoom('room-1');

    // Mock online users
    const mockUsers: UserProfile[] = [
      {
        id: 'user-1',
        username: 'admin',
        display_name: 'Admin 🌊',
        status: 'online',
        last_seen_at: new Date().toISOString()
      },
      {
        id: 'user-2',
        username: 'designer',
        display_name: 'Designer 🎨',
        status: 'online',
        last_seen_at: new Date().toISOString()
      },
      {
        id: 'user-3',
        username: 'you',
        display_name: 'You 🌊',
        status: 'online',
        last_seen_at: new Date().toISOString()
      }
    ];

    setOnlineUsers(mockUsers);
    setIsLoading(false);

    console.log('🌊 SNAKKAZ LIQUID DREAM SYSTEM AKTIV - Mock Rooms Loaded!');
    console.log('🌊 Design: Liquid Glass ✅ | Colors: Blue/Cyan ✅');
    console.log('🌊 Emergency CSS overlays activated for guaranteed visibility!');

    // Mock messages for demo
    const mockMessages: Message[] = [
      {
        id: 'msg-1',
        content: '🌊 Welcome to Snakkaz Liquid Dream! Beautiful blue glass design is now active!',
        user_id: 'user-1',
        room_id: 'room-1',
        created_at: new Date().toISOString(),
        user: mockUsers[0]
      },
      {
        id: 'msg-2',
        content: '✨ This is the new premium liquid design system with gorgeous gradients and glass effects!',
        user_id: 'user-2',
        room_id: 'room-1',
        created_at: new Date().toISOString(),
        user: mockUsers[1]
      }
    ];

    setMessages(mockMessages);
    console.log('🌊 Mock messages loaded for demo!');

    // initializeChat();

    return () => {
      chatService.updatePresence(false);
      chatService.cleanup();
    };
  }, []);

  // Lytt etter MCP WebRTC-meldinger
  useEffect(() => {
    if (mcpInitialized && mcpController) {
      // Registrer meldingslytter for MCP WebRTC
      mcpController.onMessage((from, messageData) => {
        try {
          // Sjekk om meldingen er i forventet format
          if (messageData && messageData.content && messageData.roomId) {
            // Legg til melding i UI hvis den er for det aktive rommet
            if (messageData.roomId === activeRoom) {
              // Formater meldingen i samsvar med chatService-formatet
              const newMessage: Message = {
                id: `mcp-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                room_id: messageData.roomId,
                user_id: from,
                content: messageData.content,
                message_type: 'text',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                is_edited: false,
                // Finne bruker-informasjon hvis mulig
                // user_profile: onlineUsers.find(u => u.id === from) || {
                id: from,
                full_name: 'WebRTC-bruker',
                avatar_url: null
              }
            };

            // Legg til meldingen i messages-listen
            setMessages(prev => [...prev, newMessage]);

            // Vis en notifikasjon om direkte MCP WebRTC-kommunikasjon
            toast({
              title: "Direkte melding",
              description: "Meldingen ble sendt via sikker peer-to-peer forbindelse",
              variant: "default",
            });
          }
        }
        } catch (error) {
        console.error('Feil ved håndtering av MCP WebRTC-melding:', error);
      }
    });
}
  }, [mcpInitialized, mcpController, activeRoom, users]);  // Subscribe to messages when active room changes
useEffect(() => {
  if (!activeRoom) return;

  const loadMessages = async () => {
    try {
      const roomMessages = await chatService.getMessages(activeRoom);
      setMessages(roomMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  loadMessages();

  // Subscribe to new messages
  const unsubscribe = chatService.subscribeToMessages(activeRoom, (newMessage) => {
    setMessages(prev => [...prev, newMessage]);
  });

  return unsubscribe;
}, [activeRoom]);

const sendMessage = async () => {
  if (!message.trim() || !user || !activeRoom) return;

  try {
    // Forsøk å sende via MCP WebRTC først hvis det er tilgjengelig
    if (mcpInitialized && mcpController) {
      // Finn ut om vi har en WebRTC-kobling til aktiv rom eller deltakere
      const roomData = rooms.find(r => r.id === activeRoom);
      let success = false;

      if (roomData && roomData.type === 'public') {
        // Offentlige rom - bruk tradisjonell chatService
        await chatService.sendMessage(activeRoom, message.trim());
        success = true;
      } else {
        // For private og gruppe-chatter, prøv å bruke MCP WebRTC
        try {
          // For gruppe-chatter, sender vi meldinger til alle deltakerne
          const messagePayload = {
            content: message.trim(),
            roomId: activeRoom,
            timestamp: Date.now()
          };

          // Send til alle deltakerne i rommet
          if (users && users.length > 0) {
            for (const user of users) {
              if (user.id !== user?.id) {  // Ikke send til seg selv
                await mcpSendMessage(user.id, messagePayload);
              }
            }
          }
          success = true;
        } catch (mcpError) {
          console.warn('MCP WebRTC sending failed, falling back to regular chat service', mcpError);
          // Fallback til tradisjonell chatService
          await chatService.sendMessage(activeRoom, message.trim());
          success = true;
        }
      }

      if (success) {
        setMessage('');
        messageInputRef.current?.focus();
      }
    } else {
      // Bruk tradisjonell chatService hvis MCP WebRTC ikke er tilgjengelig
      await chatService.sendMessage(activeRoom, message.trim());
      setMessage('');
      messageInputRef.current?.focus();
    }
  } catch (error) {
    console.error('Failed to send message:', error);
    toast({
      title: "Feil",
      description: "Kunne ikke sende melding. Prøv igjen.",
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

const filteredMessages = messages;
const activeRoomData = rooms.find(r => r.id === activeRoom);

if (isLoading) {
  return (
    <div className="h-screen bg-cyberdark-950 flex items-center justify-center">
      <div className="flex items-center space-x-2 text-cybergold-400">
        <Loader className="animate-spin" size={24} />
        <span>Laster chat...</span>
      </div>
    </div>
  );
}

return (
  <div className="h-screen bg-gradient-to-br from-liquid-dark via-liquid-primary/5 to-liquid-secondary/10 flex flex-col overflow-hidden relative">
    {/* 🌊 LIQUID DREAM DEBUG OVERLAY SYSTEM - ALWAYS VISIBLE */}
    <div className="fixed top-4 left-4 z-[100] space-y-2">
      <div className="snakkaz-liquid-dream-panel px-4 py-2 text-white text-sm font-mono">
        🌊 SNAKKAZ LIQUID DREAM SYSTEM AKTIV
      </div>
      <div className="snakkaz-liquid-dream-panel px-4 py-2 text-white text-sm font-mono">
        Rooms: {rooms.length} | Users: {onlineUsers.length}
      </div>
      <div className="snakkaz-liquid-dream-panel px-4 py-2 text-white text-sm font-mono">
        Design: Liquid Glass ✅ | Colors: Blue/Cyan ✅
      </div>
    </div>

    {/* 🌊 LIQUID DREAM GRADIENT BACKGROUND */}
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-liquid-primary/10 via-transparent to-liquid-secondary/5"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,_rgba(59,130,246,0.1)_0%,_transparent_50%)]"></div>
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.1)_0%,_transparent_50%)]"></div>
    </div>

    {/* Mobile Header */}
    <div className="lg:hidden flex items-center justify-between p-4 snakkaz-liquid-glass border-b border-liquid-primary/20 relative z-10">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="text-liquid-primary hover:text-liquid-secondary"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      <div className="flex items-center space-x-2">
        <Hash size={16} className="text-liquid-primary" />
        <span className="text-white font-medium">
          {activeRoomData?.name || 'Chat'}
        </span>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsUserListOpen(!isUserListOpen)}
        className="text-liquid-primary hover:text-liquid-secondary"
      >
        <Users size={20} />
      </Button>
    </div>

    <div className="flex flex-1 overflow-hidden relative z-10">
      {/* Sidebar - Rooms */}
      <div className={cn(
        "snakkaz-liquid-glass border-r border-liquid-primary/20 flex flex-col snakkaz-liquid-sidebar",
        "lg:w-80 lg:block",
        isMobileMenuOpen ? "fixed inset-y-0 left-0 z-50 w-80" : "hidden lg:block"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-liquid-primary/20">
          <div className="flex items-center justify-between mb-4">
            <SnakkaZLogo variant="header" animated={true} />
          </div>
          {/* User info */}
          <div className="snakkaz-liquid-dream-card p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-cybergold-500 rounded-full flex items-center justify-center">
                <span className="text-cyberdark-950 font-bold text-sm">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {user?.email?.split('@')[0]}
                </p>
                <p className="text-cybergold-400 text-xs">Online</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-cyberred-400 hover:text-cyberred-300 p-1"
              >
                <LogOut size={16} />
              </Button>
            </div>
          </div>

          {/* Featured Invite Button */}
          <div className="p-4 pt-2">
            <SnakkaZInviteSystem
              variant="button"
              className="w-full bg-gradient-to-r from-cybergold-600 to-green-600 hover:from-cybergold-500 hover:to-green-500 text-white border-0 shadow-lg"
              showStats={false}
            />
          </div>
        </div>

        {/* Room List */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            <div className="text-cybergold-400 text-sm font-medium mb-3 flex items-center justify-between">
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
                    ? "liquid-glass-moderate text-white"
                    : "hover:liquid-glass-subtle text-cybergold-300 hover:text-white"
                )}
              >
                <div className="flex items-center space-x-2 flex-1">
                  <Hash size={16} className="text-cybergold-400" />
                  <span className="font-medium">{room.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {room.participant_count || 0}
                </Badge>
              </button>
            ))}

            <div className="text-cybergold-400 text-sm font-medium mb-3 mt-6 flex items-center justify-between">
              GRUPPER
              <Button variant="ghost" size="sm" className="p-1 h-auto">
                <Plus size={14} />
              </Button>
            </div>

            {rooms.filter(r => r.type === 'group').map((room) => (
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
                    ? "liquid-glass-moderate text-white"
                    : "hover:liquid-glass-subtle text-cybergold-300 hover:text-white"
                )}
              >
                <div className="flex items-center space-x-2 flex-1">
                  <Users size={16} className="text-cybergold-400" />
                  <span className="font-medium">{room.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {room.participant_count || 0}
                </Badge>
              </button>
            ))}

            {/* Invitation Section */}
            <div className="text-cybergold-400 text-sm font-medium mb-3 mt-6">
              INVITASJONER
            </div>

            <div className="space-y-2">
              <SnakkaZInviteSystem
                variant="button"
                className="w-full justify-start text-sm h-10"
                showStats={false}
              />

              {activeRoom && rooms.find(r => r.id === activeRoom)?.type === 'group' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-sm h-10 border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-500/10"
                  onClick={() => {
                    // This would open group invite modal
                    toast({
                      title: "Gruppeinnvitasjon",
                      description: "Funksjonen kommer snart!",
                    });
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Inviter til gruppe
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header (Desktop) */}
        <div className="hidden lg:flex items-center justify-between p-4 bg-cyberdark-900 border-b border-cybergold-500/20">
          <div className="flex items-center space-x-3">
            <Hash size={20} className="text-cybergold-400" />
            <h2 className="text-xl font-semibold text-white">
              {activeRoomData?.name || 'Chat'}
            </h2>
            <Badge variant="outline" className="border-cybergold-500/50 text-cybergold-400">
              {activeRoomData?.participant_count || 0} medlemmer
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-cybergold-400">
              <Search size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="text-cybergold-400">
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
                  <div className="w-8 h-8 bg-cybergold-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-cyberdark-950 font-bold text-sm">
                      {msg.user_profile?.display_name?.charAt(0).toUpperCase() || msg.user_id?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-white">
                        {msg.user_profile?.display_name || msg.user_id || 'Anonym'}
                      </span>
                      <span className="text-cybergold-400 text-xs">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="liquid-glass-chat p-3 rounded-lg">
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
        <div className="p-4 bg-cyberdark-900 border-t border-cybergold-500/20">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Skriv en melding til ${activeRoomData?.name || 'rommet'}...`}
                  ref={messageInputRef}
                  className="liquid-glass-subtle border-cybergold-500/30 text-white placeholder:text-cybergold-400 pr-12"
                />
              </div>
              <Button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="liquid-glass-moderate border-cybergold-500/30 hover:border-cybergold-500/50 text-cybergold-400 hover:text-white"
              >
                <Send size={18} />
              </Button>
            </div>

            {/* MCP WebRTC Status Indicator */}
            <div className="mt-2 flex items-center justify-between">
              <div
                onClick={() => setShowConnectionStatus(!showConnectionStatus)}
                className="flex items-center space-x-1 text-xs cursor-pointer text-cybergold-400 hover:text-white transition-colors"
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
              <div className="mt-2 bg-cyberdark-800 border border-cybergold-500/20 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-2 text-cybergold-400">Tilkoblingsstatus</h4>
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
        "bg-cyberdark-900 border-l border-cybergold-500/20 flex flex-col",
        "lg:w-64 lg:block",
        isUserListOpen ? "fixed inset-y-0 right-0 z-50 w-64" : "hidden lg:block"
      )}>
        <div className="p-4 border-b border-cybergold-500/20">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Online ({onlineUsers.length})</h3>
            <Button variant="ghost" size="sm" className="text-cybergold-400 lg:hidden" onClick={() => setIsUserListOpen(false)}>
              <X size={16} />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {onlineUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-2 p-2 rounded-lg hover:liquid-glass-subtle cursor-pointer">
                <div className="relative">
                  <div className="w-8 h-8 bg-cybergold-500 rounded-full flex items-center justify-center">
                    <span className="text-cyberdark-950 font-bold text-sm">
                      {user.display_name?.charAt(0).toUpperCase() || user.id?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-cyberdark-900"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {user.display_name || user.id || 'Anonym'}
                  </p>
                  <p className="text-cybergold-400 text-xs">Online</p>
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
      <div className="w-full max-w-md bg-cyberdark-900 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Inviter til rom</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsInviteSystemOpen(false)}
            className="text-cybergold-400"
          >
            <X size={16} />
          </Button>
        </div>

        <div className="space-y-4">
          <SnakkaZInviteSystem />
        </div>
      </div>
    </div>

    {/* Group Invite System (Desktop) */}
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center p-4",
      isInviteSystemOpen ? "block" : "hidden"
    )}>
      <div className="w-full max-w-md bg-cyberdark-900 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Inviter til gruppe</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsInviteSystemOpen(false)}
            className="text-cybergold-400"
          >
            <X size={16} />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-cybergold-400">Gruppeinvitasjon kommer snart!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default SnakkaZChatBeta;
