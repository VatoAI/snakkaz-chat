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
    Share2,
    UserPlus,
    Wifi,
    WifiOff,
    Server,
    TestTube,
    Sparkles,
    MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatService, Message, ChatRoom, UserProfile } from '@/services/chat/chatService';
import { SnakkaZInviteSystem } from '@/components/invite/SnakkaZInviteSystem';
import { SnakkaZLogo } from '@/components/branding/SnakkaZLogo';
import { useMCPWebRTC } from '@/providers/MCPWebRTCProvider';
import MCPWebRTCStatus from '@/components/chat/MCPWebRTCStatus';
import { Link } from 'react-router-dom';

const SnakkaZChatBeta: React.FC = () => {
    const { user, signOut } = useAuth();
    const { toast } = useToast();

    // Hent MCP WebRTC-kontekst
    const {
        isInitialized: mcpInitialized,
        isConnecting: mcpConnecting,
        error: mcpError,
        stats: mcpStats,
        connectTo: mcpConnectTo,
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

    // Mock data for demo
    const mockRooms: ChatRoom[] = [
        { id: '1', name: 'Generell', type: 'public', participant_count: 12 },
        { id: '2', name: 'Tech Talk', type: 'public', participant_count: 8 },
        { id: '3', name: 'Random', type: 'public', participant_count: 5 },
        { id: '4', name: 'Development Team', type: 'group', participant_count: 4 },
    ];

    const mockMessages: Message[] = [
        {
            id: '1',
            room_id: '1',
            user_id: 'user1',
            content: 'Velkommen til SnakkaZ Beta! 🚀',
            created_at: new Date().toISOString(),
            user: { email: 'admin@snakkaz.com', avatar: null }
        },
        {
            id: '2',
            room_id: '1',
            user_id: 'user2',
            content: 'Ser fantastisk ut med det nye designet!',
            created_at: new Date().toISOString(),
            user: { email: 'user@example.com', avatar: null }
        }
    ];

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize chat with mock data
    useEffect(() => {
        setRooms(mockRooms);
        setMessages(mockMessages);
        setActiveRoom('1');
        setIsLoading(false);
    }, []);

    const handleSendMessage = async () => {
        if (!message.trim() || !activeRoom) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            room_id: activeRoom,
            user_id: user?.id || 'current-user',
            content: message,
            created_at: new Date().toISOString(),
            user: { email: user?.email || 'you@snakkaz.com', avatar: null }
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');
        messageInputRef.current?.focus();
    };

    const activeRoomData = rooms.find(room => room.id === activeRoom);

    if (isLoading) {
        return (
            <div className="h-screen bg-cyber-void flex items-center justify-center">
                <div className="card-cyber text-center p-8">
                    <Loader className="animate-spin text-cyber-gold mx-auto mb-4" size={32} />
                    <span className="text-cyber-body">Laster chat...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-cyber-void flex flex-col overflow-hidden">
            {/* PREMIUM MOBILE HEADER */}
            <div className="lg:hidden flex items-center justify-between p-4 glass-premium border-b border-glass-gold-intense">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="btn-glass text-cyber-gold hover:text-cyber-gold-bright"
                >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </Button>

                <div className="flex items-center space-x-2">
                    <Hash size={16} className="text-cyber-gold" />
                    <span className="text-cyber-heading">
                        {activeRoomData?.name || 'SnakkaZ Chat'}
                    </span>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsUserListOpen(!isUserListOpen)}
                    className="btn-glass text-cyber-gold hover:text-cyber-gold-bright"
                >
                    <Users size={20} />
                </Button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* PREMIUM SIDEBAR - REVOLUTIONARY GLASSMORPHISM */}
                <div className={cn(
                    "glass-premium border-r border-glass-gold-intense flex flex-col backdrop-blur-strong",
                    "lg:w-80 lg:block shadow-strong",
                    isMobileMenuOpen ? "fixed inset-y-0 left-0 z-50 w-80" : "hidden lg:block"
                )}>
                    {/* PREMIUM HEADER */}
                    <div className="p-6 border-b border-glass-gold-soft">
                        <div className="flex items-center justify-between mb-6">
                            <SnakkaZLogo variant="header" animated={true} />
                            <div className="floating-element">
                                <Sparkles className="text-cyber-gold" size={24} />
                            </div>
                        </div>

                        {/* PREMIUM USER CARD */}
                        <div className="card-cyber-premium p-4 rounded-xl glow-pulse">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-cyber-main rounded-full flex items-center justify-center shadow-float">
                                    <span className="text-cyber-void font-bold text-lg">
                                        {user?.email?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-cyber-heading text-base font-semibold truncate">
                                        {user?.email?.split('@')[0]}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
                                        <p className="text-cyber-caption">Online & Ready</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={signOut}
                                    className="btn-glass text-neon-pink hover:text-neon-pink/80 p-2"
                                >
                                    <LogOut size={18} />
                                </Button>
                            </div>
                        </div>

                        {/* PREMIUM INVITE BUTTON */}
                        <div className="mt-4">
                            <SnakkaZInviteSystem
                                variant="button"
                                className="w-full btn-cyber-primary text-cyber-void font-semibold"
                                showStats={false}
                            />
                        </div>
                    </div>

                    {/* PREMIUM ROOM LIST */}
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            <div className="text-cyber-heading text-sm font-bold mb-4 flex items-center justify-between">
                                <span className="flex items-center space-x-2">
                                    <Server size={16} className="text-electric-blue" />
                                    <span>OFFENTLIGE ROM</span>
                                </span>
                                <Button variant="ghost" size="sm" className="btn-glass p-2">
                                    <Plus size={16} />
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
                                        "w-full text-left p-4 rounded-xl transition-smooth",
                                        "flex items-center justify-between group",
                                        activeRoom === room.id
                                            ? "card-cyber-premium text-cyber-void shadow-float"
                                            : "glass-subtle hover:glass-medium text-white hover:shadow-whisper"
                                    )}
                                >
                                    <div className="flex items-center space-x-3 flex-1">
                                        <Hash size={18} className="text-cyber-gold" />
                                        <span className="font-medium text-base">{room.name}</span>
                                    </div>
                                    <Badge
                                        className="bg-glass-gold-soft text-cyber-void font-semibold px-2 py-1"
                                    >
                                        {room.participant_count || 0}
                                    </Badge>
                                </button>
                            ))}

                            <div className="text-cyber-heading text-sm font-bold mb-4 mt-8 flex items-center justify-between">
                                <span className="flex items-center space-x-2">
                                    <Users size={16} className="text-neon-purple" />
                                    <span>PRIVATE GRUPPER</span>
                                </span>
                                <Button variant="ghost" size="sm" className="btn-glass p-2">
                                    <Plus size={16} />
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
                                        "w-full text-left p-4 rounded-xl transition-smooth",
                                        "flex items-center justify-between group",
                                        activeRoom === room.id
                                            ? "card-cyber-premium text-cyber-void shadow-float"
                                            : "glass-subtle hover:glass-medium text-white hover:shadow-whisper"
                                    )}
                                >
                                    <div className="flex items-center space-x-3 flex-1">
                                        <Users size={18} className="text-neon-purple" />
                                        <span className="font-medium text-base">{room.name}</span>
                                    </div>
                                    <Badge
                                        className="bg-glass-electric-soft text-white font-semibold px-2 py-1"
                                    >
                                        {room.participant_count || 0}
                                    </Badge>
                                </button>
                            ))}

                            {/* MCP Dashboard Links */}
                            <div className="mt-8 space-y-2">
                                <div className="text-cyber-heading text-sm font-bold mb-4">
                                    <span className="flex items-center space-x-2">
                                        <TestTube size={16} className="text-cyber-gold" />
                                        <span>MCP SYSTEM</span>
                                    </span>
                                </div>

                                <Link
                                    to="/mcp-dashboard"
                                    className="block w-full p-3 rounded-xl glass-subtle hover:glass-medium transition-smooth text-center"
                                >
                                    <Server className="mx-auto mb-2 text-electric-blue" size={20} />
                                    <span className="text-cyber-caption font-medium">MCP Dashboard</span>
                                </Link>

                                <Link
                                    to="/mcp-test"
                                    className="block w-full p-3 rounded-xl glass-subtle hover:glass-medium transition-smooth text-center"
                                >
                                    <TestTube className="mx-auto mb-2 text-neon-purple" size={20} />
                                    <span className="text-cyber-caption font-medium">MCP Test Suite</span>
                                </Link>
                            </div>
                        </div>
                    </ScrollArea>
                </div>

                {/* MAIN CHAT AREA - PREMIUM DESIGN */}
                <div className="flex-1 flex flex-col">
                    {/* PREMIUM CHAT HEADER */}
                    <div className="hidden lg:flex items-center justify-between p-6 glass-premium border-b border-glass-gold-soft">
                        <div className="flex items-center space-x-4">
                            <Hash size={24} className="text-cyber-gold" />
                            <h2 className="text-cyber-title">
                                {activeRoomData?.name || 'Velg et rom'}
                            </h2>
                            <Badge className="bg-glass-gold-soft text-cyber-void font-semibold">
                                {activeRoomData?.participant_count || 0} medlemmer
                            </Badge>
                        </div>

                        <div className="flex items-center space-x-2">
                            <MCPWebRTCStatus />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="btn-glass"
                                onClick={() => setShowConnectionStatus(!showConnectionStatus)}
                            >
                                {mcpInitialized ? <Wifi className="text-cyber-green" /> : <WifiOff className="text-neon-pink" />}
                            </Button>
                            <Button variant="ghost" size="sm" className="btn-glass">
                                <Search size={18} />
                            </Button>
                            <Button variant="ghost" size="sm" className="btn-glass">
                                <Settings size={18} />
                            </Button>
                        </div>
                    </div>

                    {/* PREMIUM MESSAGES AREA */}
                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-4">
                            {messages.filter(msg => msg.room_id === activeRoom).map((msg) => (
                                <div
                                    key={msg.id}
                                    className="flex items-start space-x-3 group"
                                >
                                    <div className="w-10 h-10 bg-gradient-cyber-main rounded-full flex items-center justify-center shadow-soft">
                                        <span className="text-cyber-void font-bold">
                                            {msg.user?.email?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="text-cyber-heading font-semibold">
                                                {msg.user?.email?.split('@')[0]}
                                            </span>
                                            <span className="text-cyber-caption text-xs">
                                                {new Date(msg.created_at).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <div className="glass-subtle p-3 rounded-xl">
                                            <p className="text-cyber-body">{msg.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>

                    {/* PREMIUM MESSAGE INPUT */}
                    <div className="p-6 glass-premium border-t border-glass-gold-soft">
                        <div className="flex items-center space-x-4">
                            <div className="flex-1">
                                <Input
                                    ref={messageInputRef}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Skriv en melding..."
                                    className="input-cyber"
                                />
                            </div>
                            <Button
                                onClick={handleSendMessage}
                                disabled={!message.trim()}
                                className="btn-cyber-primary p-3"
                            >
                                <Send size={18} />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* PREMIUM USER LIST SIDEBAR */}
                <div className={cn(
                    "glass-premium border-l border-glass-gold-intense flex flex-col",
                    "lg:w-64 lg:block",
                    isUserListOpen ? "fixed inset-y-0 right-0 z-50 w-64" : "hidden lg:block"
                )}>
                    <div className="p-4 border-b border-glass-gold-soft">
                        <h3 className="text-cyber-heading font-bold flex items-center space-x-2">
                            <Users size={18} className="text-cyber-gold" />
                            <span>Online Now</span>
                        </h3>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-2">
                            {onlineUsers.map((user, index) => (
                                <div key={index} className="flex items-center space-x-3 p-2 rounded-lg glass-subtle">
                                    <div className="w-8 h-8 bg-gradient-cyber-main rounded-full flex items-center justify-center">
                                        <span className="text-cyber-void font-bold text-sm">
                                            {user.email?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-cyber-body text-sm font-medium">
                                            {user.email?.split('@')[0]}
                                        </p>
                                        <p className="text-cyber-caption text-xs">Active</p>
                                    </div>
                                    <div className="w-2 h-2 bg-cyber-green rounded-full"></div>
                                </div>
                            ))}

                            {/* Mock users for demo */}
                            <div className="flex items-center space-x-3 p-2 rounded-lg glass-subtle">
                                <div className="w-8 h-8 bg-gradient-cyber-main rounded-full flex items-center justify-center">
                                    <span className="text-cyber-void font-bold text-sm">A</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-cyber-body text-sm font-medium">Admin</p>
                                    <p className="text-cyber-caption text-xs">Active</p>
                                </div>
                                <div className="w-2 h-2 bg-cyber-green rounded-full"></div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
};

export default SnakkaZChatBeta;
