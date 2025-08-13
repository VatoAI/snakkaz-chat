import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import UserProfile from '../profile/UserProfile';
import VideoCall from '../video/VideoCall';
import FileDrop from '../upload/FileDrop';
import NotificationService from '../../services/NotificationService';
import '../../styles/epic-chat.css';
import {
  IconSend, IconUsers, IconHash, IconHeart, IconBolt,
  IconRobot, IconSettings, IconSearch, IconArrowBack,
  IconX, IconLock, IconShieldCheck, IconLogout, IconVideo,
  IconPhone, IconPaperclip, IconBell, IconBellOff, IconMenu2
} from '@tabler/icons-react';

interface Message {
  id: string;
  text: string;
  user: string;
  userId: string;
  timestamp: Date;
  type: 'text' | 'image' | 'voice' | 'file' | 'mcp';
  encrypted: boolean;
  edited?: boolean;
  editedAt?: Date;
  replyTo?: string;
  reactions?: { [emoji: string]: string[] };
  readBy?: string[];
  mcpAgent?: string;
  avatar?: string;
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'public' | 'private' | 'group' | 'mcp';
  memberCount: number;
  lastActivity: Date;
  encrypted: boolean;
  mcpEnabled?: boolean;
  avatar?: string;
}

const SnakkaZChatEpic: React.FC = () => {
  const { user } = useAuth();

  // 🛠️ UTILITY FUNCTIONS
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('nb-NO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // ALL HOOKS MUST BE AT THE TOP - NEVER CONDITIONAL
  // State management
  const [currentRoom, setCurrentRoom] = useState<string>('general');
  const [message, setMessage] = useState('');
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  // NEW: Enhanced chat features
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);

  // NEW: Video call state
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [videoCallTarget, setVideoCallTarget] = useState<string | undefined>();
  const [incomingCall, setIncomingCall] = useState<{
    from: string;
    offer: RTCSessionDescriptionInit;
  } | undefined>();

  // NEW: File upload state
  const [showFileDrop, setShowFileDrop] = useState(false);

  // NEW: Notification state
  const [notificationService, setNotificationService] = useState<NotificationService | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Mobile state management
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Messages state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Velkommen til SnakkaZ! 🎉 End-to-end kryptering er aktivert 🔒',
      user: 'SnakkaZ System',
      userId: 'system',
      timestamp: new Date(Date.now() - 120000),
      type: 'text',
      encrypted: true,
      avatar: '🛡️'
    },
    {
      id: '2',
      text: 'Hei! Jeg er Claude, din AI-assistent. Spør meg om hva som helst! 🤖 Prøv kommandoer som /ai eller /help',
      user: 'Claude AI',
      userId: 'mcp-claude',
      timestamp: new Date(Date.now() - 60000),
      type: 'mcp',
      encrypted: true,
      mcpAgent: 'claude',
      avatar: '🤖'
    },
    {
      id: '3',
      text: 'Så kul at vi har fått E2EE kryptering! 🔐',
      user: 'TestBruker',
      userId: 'test-user',
      timestamp: new Date(Date.now() - 30000),
      type: 'text',
      encrypted: true,
      reactions: { '👍': ['user1', 'user2'], '🔥': ['user3'] }
    },
    {
      id: '4',
      text: 'Ja! Og MCP-integrasjonen er fantastisk. Nå kan vi chatte direkte med AI-assistenter inne i chatten! 🚀',
      user: 'AnnenBruker',
      userId: 'another-user',
      timestamp: new Date(Date.now() - 15000),
      type: 'text',
      encrypted: true,
      replyTo: '3',
      reactions: { '💯': ['user1'], '🎉': ['user2', 'user3'] }
    }
  ]);

  // Rooms state
  const [rooms] = useState<ChatRoom[]>([
    {
      id: 'general',
      name: 'Generell',
      type: 'public',
      memberCount: 42,
      lastActivity: new Date(),
      encrypted: true,
      mcpEnabled: true,
      avatar: '💬'
    },
    {
      id: 'norsk',
      name: 'Norsk',
      type: 'public',
      memberCount: 23,
      lastActivity: new Date(),
      encrypted: true,
      avatar: '🇳🇴'
    },
    {
      id: 'tech',
      name: 'Teknologi',
      type: 'public',
      memberCount: 15,
      lastActivity: new Date(),
      encrypted: true,
      mcpEnabled: true,
      avatar: '⚡'
    },
    {
      id: 'mcp-ai',
      name: 'AI Assistenter',
      type: 'mcp',
      memberCount: 8,
      lastActivity: new Date(),
      encrypted: true,
      mcpEnabled: true,
      avatar: '🤖'
    },
  ]);

  // ALL REFS MUST BE AT THE TOP
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ALL USEEFFECTS MUST BE AT THE TOP
  // Enhanced mobile detection with better breakpoints
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      // Auto-close sidebar on mobile for better UX
      if (mobile) {
        setSidebarOpen(false);
      }

      // Auto-open sidebar on desktop for productivity
      if (window.innerWidth > 1024) {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize notification service
  useEffect(() => {
    const initNotifications = async () => {
      const service = NotificationService.getInstance();
      setNotificationService(service);

      // Check current permission status
      const permission = service.getPermissionStatus();
      setNotificationPermission(permission);

      // Request permission if needed
      if (permission === 'default') {
        try {
          const newPermission = await service.requestPermission();
          setNotificationPermission(newPermission);

          if (newPermission === 'granted') {
            service.showSystemNotification('🔔 Notifications enabled! You\'ll receive real-time alerts.', 'info');
          }
        } catch (error) {
          console.error('Failed to request notification permission:', error);
        }
      }
    };

    initNotifications();
  }, []);

  // Scroll to bottom effect
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    scrollToBottom();
  }, [messages]);

  // Initialize chat after user is loaded
  useEffect(() => {
    if (user) {
      const timeout = setTimeout(() => {
        setChatLoading(false);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [user]);

  // Filter messages based on search
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = messages.filter(msg =>
        msg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.user.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(messages);
    }
  }, [messages, searchQuery]);

  // Navigation items for sidebar
  const navigationItems = [
    {
      icon: IconUsers,
      label: 'Samtaler',
      active: true,
      unread: false
    },
    {
      icon: IconHash,
      label: 'Kanaler',
      active: false,
      unread: true
    },
    {
      icon: IconRobot,
      label: 'AI Assistenter',
      active: false,
      unread: false
    },
    {
      icon: IconSettings,
      label: 'Innstillinger',
      active: false,
      unread: false
    }
  ];

  // CONDITIONAL RENDERING AFTER ALL HOOKS

  // Initialize chat after user is loaded
  useEffect(() => {
    if (user) {
      const timeout = setTimeout(() => {
        setChatLoading(false);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [user]);

  // Message search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = messages.filter(msg =>
        msg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.user.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(messages);
    }
  }, [searchQuery, messages]);

  // Now conditional returns are safe, after all hooks
  if (chatLoading || !user) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Starter sikker chat...</p>
          <p className="text-sm text-gray-500 mt-1">E2EE aktiveres</p>
        </div>
      </div>
    );
  }

  const sendMessage = () => {
    if (message.trim() && user) {
      // Handle MCP commands
      if (message.trim().startsWith('/')) {
        handleMCPCommand(message.trim());
        setMessage('');
        return;
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        user: user.email?.split('@')[0] || 'Anonym',
        userId: user.id || user.email || 'anonymous',
        timestamp: new Date(),
        type: 'text',
        encrypted: true,
        replyTo: replyToMessage?.id
      };
      setMessages(prev => [...prev, newMessage]);

      // Show notification for others in the chat (simulate)
      if (notificationService && message.includes('@')) {
        // Extract mentioned users and send notifications
        const mentions = message.match(/@\w+/g);
        if (mentions) {
          mentions.forEach(mention => {
            // Send notification for mention
            console.log(`Notifying ${mention} about mention in message: ${message}`);
            notificationService.showChatMessage(
              user.email?.split('@')[0] || 'Someone',
              `Mentioned you: ${message}`,
              '/icons/snakkaz-icon-192.png'
            );
          });
        }
      }

      setMessage('');
      setReplyToMessage(null);
    }
  };

  const sendMCPMessage = (agent: string, response: string) => {
    const mcpMessage: Message = {
      id: Date.now().toString() + '-mcp',
      text: response,
      user: `${agent} AI`,
      userId: `mcp-${agent}`,
      timestamp: new Date(),
      type: 'mcp',
      encrypted: true,
      mcpAgent: agent,
      avatar: '🤖'
    };
    setMessages(prev => [...prev, mcpMessage]);
  };

  // Video call functions
  const startVideoCall = (targetUserId?: string) => {
    setVideoCallTarget(targetUserId);
    setShowVideoCall(true);
  };

  const startAudioCall = (targetUserId?: string) => {
    setVideoCallTarget(targetUserId);
    setShowVideoCall(true);
  };

  const handleIncomingVideoCall = (from: string, offer: RTCSessionDescriptionInit) => {
    console.log('Incoming video call from', from, offer); // Future: implement video call handling
    setIncomingCall({ from, offer });
    setShowVideoCall(true);
  };

  const closeVideoCall = () => {
    setShowVideoCall(false);
    setVideoCallTarget(undefined);
    setIncomingCall(undefined);
  };

  // Notification functions
  const toggleNotifications = async () => {
    if (!notificationService) return;

    if (notificationPermission === 'denied') {
      notificationService.showInAppNotification({
        title: '🔔 Notifications Blocked',
        body: 'Please enable notifications in your browser settings to receive alerts.',
        icon: '/icons/snakkaz-icon-192.png'
      });
      return;
    }

    if (notificationPermission === 'default') {
      try {
        const permission = await notificationService.requestPermission();
        setNotificationPermission(permission);

        if (permission === 'granted') {
          notificationService.showSystemNotification('🔔 Notifications enabled successfully!', 'info');
        }
      } catch (error) {
        console.error('Failed to enable notifications:', error);
      }
    } else {
      // Show current status
      notificationService.showInAppNotification({
        title: '🔔 Notifications Active',
        body: 'You will receive real-time alerts for messages and calls.',
        icon: '/icons/snakkaz-icon-192.png'
      });
    }
  };

  // File upload functions
  const handleSendFiles = async (files: File[], messageText?: string) => {
    if (!user) return;

    // Create message with files
    const fileMessage: Message = {
      id: Date.now().toString(),
      text: messageText || `📎 Sendte ${files.length} fil${files.length > 1 ? 'er' : ''}`,
      user: user.email?.split('@')[0] || 'Anonym',
      userId: user.id || user.email || 'anonymous',
      timestamp: new Date(),
      type: 'file',
      encrypted: true
    };

    setMessages(prev => [...prev, fileMessage]);

    // Simulate file upload to server
    console.log('Uploading files:', files);

    // Here you would upload files to your server/Supabase storage
    // For now, we'll just simulate it
    setTimeout(() => {
      const uploadedMessage: Message = {
        id: Date.now().toString() + '-uploaded',
        text: `✅ ${files.length} fil${files.length > 1 ? 'er' : ''} lastet opp`,
        user: 'System',
        userId: 'system',
        timestamp: new Date(),
        type: 'text',
        encrypted: true
      };
      setMessages(prev => [...prev, uploadedMessage]);
    }, 2000);
  };

  // Enhanced chat functions
  const handleTyping = (value: string) => {
    setMessage(value);

    // Send typing indicator
    if (!isTyping && value.trim()) {
      setIsTyping(true);
      // Simulate typing notification
      setTypingUsers(['ChatBot', 'Admin']);
      setTimeout(() => {
        setIsTyping(false);
        setTypingUsers([]);
      }, 3000);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || {};
        const userReactions = reactions[emoji] || [];
        const userId = user?.id || user?.email || 'anonymous';

        if (userReactions.includes(userId)) {
          // Remove reaction
          const newReactions = userReactions.filter(id => id !== userId);
          if (newReactions.length === 0) {
            delete reactions[emoji];
          } else {
            reactions[emoji] = newReactions;
          }
        } else {
          // Add reaction
          reactions[emoji] = [...userReactions, userId];
        }

        return { ...msg, reactions: { ...reactions } };
      }
      return msg;
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();

      // Check for MCP commands
      if (message.trim().startsWith('/ai') || message.trim().startsWith('/claude')) {
        const query = message.trim().substring(message.indexOf(' ') + 1);
        if (query && rooms.find(r => r.id === currentRoom)?.mcpEnabled) {
          setTimeout(() => {
            sendMCPMessage('claude', `🤖 Claude AI: ${query ? `Ang. "${query}" - ` : ''}Hei! Jeg er her for å hjelpe deg. Som en AI-assistent kan jeg hjelpe med koding, skriving, analyse, og mye mer. Hva kan jeg hjelpe deg med i dag?`);
          }, 500);
        }
      }
    }
  };

  const handleMCPCommand = (command: string) => {
    const currentRoomData = rooms.find(r => r.id === currentRoom);
    if (!currentRoomData?.mcpEnabled) return;

    switch (command) {
      case '/help':
        sendMCPMessage('system', '🆘 Tilgjengelige kommandoer:\n/ai [spørsmål] - Spør AI-assistent\n/claude [spørsmål] - Spør Claude AI\n/help - Vis denne hjelpen');
        break;
      case '/status':
        sendMCPMessage('system', `📊 Status:\n🔒 Kryptering: Aktivert\n🤖 AI-assistenter: ${currentRoomData.mcpEnabled ? 'Aktivert' : 'Deaktivert'}\n👥 Medlemmer: ${currentRoomData.memberCount}`);
        break;
      default:
        sendMCPMessage('claude', `🤖 Claude AI: Ukjent kommando "${command}". Skriv /help for å se tilgjengelige kommandoer.`);
    }
  };

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border">
          <IconBolt className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Logg inn for å chatte
          </h3>
          <p className="text-gray-600">
            Du må være logget inn for å bruke SnakkaZ Chat.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Quick Start Guide */}
      {showQuickStart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <IconBolt className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Velkommen til SnakkaZ Chat! 🎉</h3>
              <p className="text-gray-600 mt-2">Din avanserte, krypterte chat med AI-assistenter</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <IconShieldCheck className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">End-to-End Kryptering</p>
                  <p className="text-gray-600">Alle meldingene dine er krypterte og sikre 🔒</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <IconRobot className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">AI-Assistenter (MCP)</p>
                  <p className="text-gray-600">Bruk <code className="bg-gray-100 px-1 rounded">/ai</code> eller <code className="bg-gray-100 px-1 rounded">/claude</code> for å chatte med AI 🤖</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <IconHeart className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Avanserte Funksjoner</p>
                  <p className="text-gray-600">Reply, edit, reactions, og mer! Hover over meldinger for alternativer ✨</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowQuickStart(false)}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
            >
              Kom i gang! 🚀
            </button>
          </div>
        </div>
      )}

      {/* ✨ EPIC SNAKKAZ MAIN CONTAINER ✨ */}
      <div className="epic-chat-container flex">
        {/* 🔥 EPIC SIDEBAR OVERLAY FOR MOBILE 🔥 */}
        {isMobile && (
          <div
            className={`epic-sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 🎯 EPIC SIDEBAR 🎯 */}
        <div className={`epic-sidebar ${sidebarOpen ? 'open' : ''} epic-glassmorphism-dark epic-scrollbar`}>
          {/* Header with User Profile */}
          <div className="p-4 border-b border-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <IconBolt className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">SnakkaZ</h2>
                  <div className="flex items-center space-x-2">
                    <div className="epic-status-online"></div>
                    <span className="text-blue-300 text-xs">Online</span>
                  </div>
                </div>
              </div>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <IconX className="w-5 h-5 text-white" />
                </button>
              )}
            </div>

            {user && (
              <button
                onClick={() => setShowUserProfile(true)}
                className="epic-button secondary w-full"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center text-white font-medium text-sm">
                  {user.user_metadata?.full_name?.[0] || user.email?.[0] || '?'}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-medium text-sm truncate">
                    {user.user_metadata?.full_name || 'SnakkaZ User'}
                  </p>
                  <p className="text-blue-300 text-xs">Klikk for profil</p>
                </div>
                <IconSettings className="w-4 h-4 text-blue-300" />
              </button>
            )}
          </div>

          {/* Navigation Menu */}
          <div className="p-3 space-y-2">
            <div className="text-xs font-medium text-blue-300 uppercase tracking-wider px-2 py-2">
              Navigasjon
            </div>
            {navigationItems.map((item, index) => (
              <button
                key={index}
                className={`epic-button w-full ${item.active ? 'primary epic-glow' : 'secondary'}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.unread && (
                  <div className="ml-auto w-2 h-2 bg-red-500 rounded-full epic-glow"></div>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="p-3 border-b border-blue-500/20">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
              <input
                type="text"
                placeholder="Søk i samtaler..."
                className="epic-input pl-10 bg-white/10 border-blue-500/30 text-white placeholder-blue-300"
              />
            </div>
          </div>

          {/* Room List */}
          <div className="flex-1 overflow-y-auto epic-scrollbar">
            <div className="p-3">
              <div className="text-xs font-medium text-blue-300 uppercase tracking-wider px-2 py-2 flex items-center justify-between">
                <span>Kanaler</span>
                <IconLock className="w-3 h-3 text-green-400 epic-glow-green" title="Krypterte kanaler" />
              </div>
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setCurrentRoom(room.id)}
                  className={`epic-button w-full mb-2 ${currentRoom === room.id ? 'primary epic-glow' : 'secondary'}`}
                >
                  <div className="text-lg">{room.avatar}</div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center">
                      <IconHash className="w-4 h-4 mr-1 text-blue-400" />
                      <span className="font-medium truncate">{room.name}</span>
                      {room.mcpEnabled && (
                        <IconRobot className="w-3 h-3 ml-1 text-purple-400" title="AI-assistenter" />
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs opacity-70">{room.memberCount} medlemmer</span>
                      <div className="flex items-center space-x-1">
                        {room.encrypted && (
                          <IconLock className="w-3 h-3 text-green-400" title="Kryptert" />
                        )}
                        <IconUsers className="w-3 h-3 text-blue-400" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 🚀 EPIC MAIN CHAT AREA 🚀 */}
        <div className="epic-main-chat">
          {/* Enhanced Header */}
          <div className="epic-mobile-header bg-gradient-to-r from-blue-600 to-blue-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="epic-button secondary p-2"
                  >
                    <IconMenu2 className="w-5 h-5" />
                  </button>
                )}
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">⚡</span>
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg">SnakkaZ</h1>
                  <p className="text-blue-100 text-xs">Sikker chat</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => startVideoCall()} className="epic-button secondary p-2" title="Start videosamtale">
                  <IconVideo className="w-4 h-4" />
                </button>
                <button onClick={() => startAudioCall()} className="epic-button secondary p-2" title="Start lydsamtale">
                  <IconPhone className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleNotifications}
                  className={`epic-button p-2 ${notificationPermission === 'granted' ? 'epic-glow-green' : 'secondary'}`}
                  title={`Varslinger: ${notificationPermission === 'granted' ? 'Aktivert' : 'Klikk for å aktivere'}`}
                >
                  <IconBell className="w-4 h-4" />
                </button>
                <div className="epic-status-online"></div>
                <span className="text-white text-sm font-medium">ONLINE</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Søk i meldinger..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="epic-input bg-white/20 border-white/30 text-white placeholder-white/70"
              />
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                >
                  <IconX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Header with User Profile */}
          <div style={{
            padding: '1rem',
            borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
            background: 'rgba(59, 130, 246, 0.05)'
          }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <IconBolt className="w-5 h-5 mr-2 text-blue-600" />
                SnakkaZ Chat
              </h2>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setShowUserProfile(!showUserProfile)}
                  className="p-2 rounded-md transition-colors hover:bg-gray-100"
                >
                  <IconSettings className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 rounded-md transition-colors hover:bg-gray-100">
                  <IconLogout className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {user && (
              <button
                onClick={() => setShowUserProfile(true)}
                className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                  }}
                >
                  {user.user_metadata?.full_name?.[0] || user.email?.[0] || '?'}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {user.user_metadata?.full_name || 'SnakkaZ User'}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    Klikk for profil
                  </p>
                </div>
                <IconSettings className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 p-3 space-y-2 overflow-y-auto">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${item.active ? 'text-white' : 'text-blue-300'
                  }`}
                style={{
                  background: item.active
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(29, 78, 216, 0.4))'
                    : 'rgba(59, 130, 246, 0.1)',
                  border: `1px solid ${item.active ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.3)'}`,
                  boxShadow: item.active ? '0 4px 20px rgba(59, 130, 246, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!item.active) {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!item.active) {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.unread && (
                  <div className="ml-auto w-2 h-2 bg-red-500 rounded-full" style={{
                    boxShadow: '0 0 10px rgba(239, 68, 68, 0.8)'
                  }}></div>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="p-3" style={{
            borderBottom: '1px solid rgba(59, 130, 246, 0.3)'
          }}>
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
              <input
                type="text"
                placeholder="Søk i samtaler..."
                className="w-full pl-9 pr-3 py-2 rounded-lg text-sm text-white placeholder-blue-300 transition-all duration-200"
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}
                onFocus={(e) => {
                  e.target.style.background = 'rgba(59, 130, 246, 0.2)';
                  e.target.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Room List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs font-medium text-blue-300 uppercase tracking-wider px-2 py-2 flex items-center justify-between">
                <span>Kanaler</span>
                <IconLock className="w-3 h-3 text-green-400" title="Krypterte kanaler" />
              </div>
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setCurrentRoom(room.id)}
                  className="w-full text-left p-3 rounded-lg mb-1 transition-all duration-200 group"
                  style={currentRoom === room.id
                    ? {
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.5)',
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
                    }
                    : {
                      background: 'rgba(59, 130, 246, 0.05)',
                      border: '1px solid rgba(59, 130, 246, 0.1)'
                    }
                  }
                  onMouseEnter={(e) => {
                    if (currentRoom !== room.id) {
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentRoom !== room.id) {
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="text-lg mr-3">{room.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <IconHash className="w-4 h-4 mr-1 text-blue-400" />
                          <span className={`font-medium truncate ${currentRoom === room.id ? 'text-white' : 'text-blue-100'}`}>
                            {room.name}
                          </span>
                          {room.mcpEnabled && (
                            <IconRobot className="w-3 h-3 ml-1 text-blue-400" title="AI-assistenter" />
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs ${currentRoom === room.id ? 'text-blue-200' : 'text-blue-300'}`}>
                            {room.memberCount} medlemmer
                          </span>
                          <div className="flex items-center space-x-1">
                            {room.encrypted && (
                              <IconLock className="w-3 h-3 text-green-400" title="Kryptert" />
                            )}
                            <IconUsers className="w-3 h-3 text-blue-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 🚀 EPIC MAIN CHAT AREA 🚀 */}
        <div className="flex-1 flex flex-col">
          {/* Enhanced Header - with Search */}
          <div className="epic-mobile-header" style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(29, 78, 216, 0.98) 100%)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            padding: isMobile ? '0.75rem 1rem' : '1rem 1.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">⚡</span>
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg">SnakkaZ</h1>
                  <p className="text-blue-100 text-xs">Sikker chat</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Video Call Controls */}
                <button
                  onClick={() => startVideoCall()}
                  className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200"
                  title="Start videosamtale"
                >
                  <IconVideo className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => startAudioCall()}
                  className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200"
                  title="Start lydsamtale"
                >
                  <IconPhone className="w-4 h-4 text-white" />
                </button>

                {/* Notification Toggle */}
                <button
                  onClick={toggleNotifications}
                  className={`p-2 rounded-full transition-all duration-200 ${notificationPermission === 'granted'
                    ? 'bg-green-500 bg-opacity-30 hover:bg-opacity-40'
                    : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                    }`}
                  title={`Varslinger: ${notificationPermission === 'granted'
                    ? 'Aktivert'
                    : notificationPermission === 'denied'
                      ? 'Blokkert'
                      : 'Klikk for å aktivere'
                    }`}
                >
                  <IconBell className={`w-4 h-4 ${notificationPermission === 'granted' ? 'text-green-300' : 'text-white'
                    }`} />
                </button>

                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white text-sm font-medium">ONLINE</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Søk i meldinger..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-white placeholder-opacity-70 focus:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white opacity-70" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white opacity-70 hover:opacity-100"
                >
                  <IconX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 💬 EPIC MESSAGES AREA 💬 */}
          <div className="epic-message-area epic-scrollbar">
            {filteredMessages.map((msg) => {
              const isOwnMessage = msg.userId === (user?.id || user?.email);
              const isMCPMessage = msg.type === 'mcp';
              const isSystemMessage = msg.userId === 'system';
              const replyToMsg = msg.replyTo ? messages.find(m => m.id === msg.replyTo) : null;

              return (
                <div key={msg.id} className="epic-fade-in mb-4">
                  {/* Reply Preview */}
                  {replyToMsg && (
                    <div className="ml-12 mb-2 pl-3 border-l-2 border-blue-400 bg-blue-50 rounded-lg p-2">
                      <div className="text-xs text-blue-600 flex items-center">
                        <IconArrowBack className="w-3 h-3 mr-1" />
                        Svar til {replyToMsg.user}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{replyToMsg.text}</p>
                    </div>
                  )}

                  {/* Epic Message Bubble */}
                  <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`epic-message-bubble ${isOwnMessage ? 'own' :
                        isMCPMessage ? 'mcp' :
                          isSystemMessage ? 'system' :
                            'other'
                        }`}
                    >
                      {/* Message Sender (for non-own messages) */}
                      {!isOwnMessage && (
                        <div className="text-xs font-medium mb-1 opacity-80 flex items-center">
                          {msg.avatar && <span className="mr-1">{msg.avatar}</span>}
                          {msg.user}
                          {isMCPMessage && <span className="ml-1">🤖</span>}
                          {msg.encrypted && <span className="ml-1">🔒</span>}
                        </div>
                      )}

                      {/* Message Text */}
                      <div className="text-sm leading-relaxed">
                        {msg.text}
                        {msg.edited && (
                          <span className="text-xs opacity-60 ml-2">(redigert)</span>
                        )}
                      </div>

                      {/* Message Time */}
                      <div className="text-xs opacity-60 mt-1">
                        {formatTime(msg.timestamp)}
                      </div>

                      {/* Reactions */}
                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Object.entries(msg.reactions).map(([emoji, users]) => (
                            <button
                              key={emoji}
                              onClick={() => addReaction(msg.id, emoji)}
                              className="px-2 py-1 rounded-full text-xs bg-white bg-opacity-20 border border-white border-opacity-30 hover:bg-opacity-30 transition-all"
                            >
                              {emoji} {users.length}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="px-4 py-2 text-sm text-gray-500 italic flex items-center space-x-2">
                <span>
                  {typingUsers.length === 1
                    ? `${typingUsers[0]} skriver...`
                    : `${typingUsers.length} personer skriver...`
                  }
                </span>
                <div className="epic-status-typing">
                  <div className="epic-typing-dot"></div>
                  <div className="epic-typing-dot"></div>
                  <div className="epic-typing-dot"></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 📱 EPIC INPUT AREA 📱 */}
          <div className="epic-input-area">
            {/* Reply Preview */}
            {replyToMessage && (
              <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconArrowBack className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700 font-medium">
                      Svarer til {replyToMessage.user}
                    </span>
                  </div>
                  <button
                    onClick={() => setReplyToMessage(null)}
                    className="p-1 hover:bg-blue-100 rounded transition-colors"
                  >
                    <IconX className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 truncate mt-1">{replyToMessage.text}</p>
              </div>
            )}

            {/* Enhanced Input Controls */}
            <div className="flex items-center space-x-3">
              {/* Emoji Picker Button */}
              <div className="relative">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="epic-button secondary w-10 h-10 text-lg"
                  title="Legg til emoji"
                >
                  😀
                </button>

                {/* Emoji Picker Popup */}
                {showEmojiPicker && (
                  <div className="absolute bottom-12 left-0 bg-white border rounded-lg shadow-lg p-2 grid grid-cols-6 gap-1 z-50">
                    {['😀', '😂', '😍', '🤔', '👍', '❤️', '🎉', '🔥', '💯', '🚀', '💪', '✨'].map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => handleEmojiSelect(emoji)}
                        className="w-8 h-8 text-lg hover:bg-gray-100 rounded transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => handleTyping(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Skriv en melding..."
                  className="epic-input pr-20"
                />

                {/* File Upload Button */}
                <button
                  onClick={() => setShowFileDrop(!showFileDrop)}
                  className={`absolute right-12 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${showFileDrop ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  title="Legg ved filer"
                >
                  <IconPaperclip className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={sendMessage}
                className="epic-button primary w-10 h-10"
                disabled={!message.trim()}
              >
                <IconSend className="w-4 h-4" />
              </button>
            </div>

            {/* File Drop Area */}
            {showFileDrop && (
              <FileDrop
                onSendFiles={handleSendFiles}
                className="mt-4"
              />
            )}

            {/* Status Bar */}
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <IconLock className="w-3 h-3 mr-1 text-green-500 epic-glow-green" />
                  E2EE Aktivert
                </span>
                {rooms.find(r => r.id === currentRoom)?.mcpEnabled && (
                  <span className="flex items-center">
                    <IconRobot className="w-3 h-3 mr-1 text-purple-500 epic-glow-purple" />
                    AI-assistenter tilgjengelig
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <span>Enter for å sende</span>
                <span>Shift+Enter for ny linje</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfile
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />

      {/* Video Call Modal */}
      <VideoCall
        isOpen={showVideoCall}
        onClose={closeVideoCall}
        targetUserId={videoCallTarget}
        incomingCall={incomingCall}
      />
    </>
  );
};

export default SnakkaZChatEpic;
