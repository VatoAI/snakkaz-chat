import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import {
  IconSend, IconPhoto, IconMicrophone, IconUsers, IconHash, IconPlus, IconHeart, IconBolt,
  IconRobot, IconSettings, IconSearch, IconDots, IconArrowBack,
  IconEdit, IconTrash, IconX, IconLock, IconShieldCheck,
  IconCircle, IconMoodSmile, IconPaperclip, IconVideo, IconPhone, IconInfoCircle
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

const SnakkaZChat: React.FC = () => {
  const { user } = useAuth();
  const [currentRoom, setCurrentRoom] = useState<string>('general');
  const [message, setMessage] = useState('');
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(true);

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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const editMessage = (messageId: string, newText: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          text: newText,
          edited: true,
          editedAt: new Date()
        };
      }
      return msg;
    }));
    setEditingMessage(null);
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
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
      setMessage('');
      setReplyToMessage(null);
    }
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('no-NO', {
      hour: '2-digit',
      minute: '2-digit'
    });
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

      <div className="h-full flex bg-white">
        {/* Sidebar - Chat Rooms */}
        <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* Header with User Profile */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <IconBolt className="w-5 h-5 mr-2 text-blue-600" />
                SnakkaZ Chat
              </h2>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setShowUserProfile(!showUserProfile)}
                  className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <IconSettings className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                  <IconPlus className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* User Profile Bar */}
            <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
              <div className="relative">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-green-600 flex items-center">
                  <IconCircle className="w-2 h-2 mr-1 fill-current" />
                  Online
                </p>
              </div>
              <IconShieldCheck className="w-4 h-4 text-green-600" title="E2EE Aktivert" />
            </div>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Søk i samtaler..."
                className="w-full pl-9 pr-3 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Room List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-2 flex items-center justify-between">
                <span>Kanaler</span>
                <IconLock className="w-3 h-3" title="Krypterte kanaler" />
              </div>
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setCurrentRoom(room.id)}
                  className={`w-full text-left p-3 rounded-lg mb-1 transition-colors group ${currentRoom === room.id
                    ? 'bg-blue-100 text-blue-900 border border-blue-200'
                    : 'hover:bg-gray-100 text-gray-700'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="text-lg mr-3">{room.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <IconHash className="w-4 h-4 mr-1 text-gray-500" />
                          <span className="font-medium truncate">{room.name}</span>
                          {room.mcpEnabled && (
                            <IconRobot className="w-3 h-3 ml-1 text-blue-500" title="AI-assistenter" />
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">
                            {room.memberCount} medlemmer
                          </span>
                          <div className="flex items-center space-x-1">
                            {room.encrypted && (
                              <IconLock className="w-3 h-3 text-green-500" title="Kryptert" />
                            )}
                            <IconUsers className="w-3 h-3 text-gray-400" />
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

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {rooms.find(r => r.id === currentRoom)?.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <IconHash className="w-5 h-5 mr-2 text-gray-500" />
                    {rooms.find(r => r.id === currentRoom)?.name || 'Generell'}
                    {rooms.find(r => r.id === currentRoom)?.encrypted && (
                      <IconShieldCheck className="w-4 h-4 ml-2 text-green-500" title="End-to-end kryptert" />
                    )}
                    {rooms.find(r => r.id === currentRoom)?.mcpEnabled && (
                      <IconRobot className="w-4 h-4 ml-2 text-blue-500" title="AI-assistenter aktivert" />
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center">
                    <IconUsers className="w-4 h-4 mr-1" />
                    {rooms.find(r => r.id === currentRoom)?.memberCount} medlemmer
                    {rooms.find(r => r.id === currentRoom)?.encrypted && (
                      <span className="ml-2 text-green-600 text-xs flex items-center">
                        <IconLock className="w-3 h-3 mr-1" />
                        Kryptert
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Videosamtale">
                  <IconVideo className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Samtale">
                  <IconPhone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Kanalinformasjon">
                  <IconInfoCircle className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Flere alternativer">
                  <IconDots className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isOwnMessage = msg.userId === (user?.id || user?.email);
              const isMCPMessage = msg.type === 'mcp';
              const replyToMsg = msg.replyTo ? messages.find(m => m.id === msg.replyTo) : null;

              return (
                <div key={msg.id} className="group">
                  {/* Reply Preview */}
                  {replyToMsg && (
                    <div className="ml-12 mb-2 pl-3 border-l-2 border-gray-300 bg-gray-50 rounded p-2">
                      <div className="text-xs text-gray-500 flex items-center">
                        <IconArrowBack className="w-3 h-3 mr-1" />
                        Svar til {replyToMsg.user}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{replyToMsg.text}</p>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${isMCPMessage ? 'bg-gradient-to-r from-purple-500 to-blue-500' :
                          msg.userId === 'system' ? 'bg-gradient-to-r from-green-500 to-blue-500' :
                            'bg-blue-600'
                        }`}>
                        {msg.avatar || msg.user.charAt(0).toUpperCase()}
                      </div>
                      {isMCPMessage && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                          <IconRobot className="w-2 h-2 text-white" />
                        </div>
                      )}
                      {msg.encrypted && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <IconLock className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Message Header */}
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`font-medium ${isMCPMessage ? 'text-purple-700' :
                            msg.userId === 'system' ? 'text-green-700' :
                              'text-gray-900'
                          }`}>
                          {msg.user}
                        </span>
                        {isMCPMessage && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                            AI Assistant
                          </span>
                        )}
                        {msg.encrypted && (
                          <IconShieldCheck className="w-3 h-3 text-green-500" title="Kryptert melding" />
                        )}
                        <span className="text-xs text-gray-500">
                          {formatTime(msg.timestamp)}
                        </span>
                        {msg.edited && (
                          <span className="text-xs text-gray-400 italic">(redigert)</span>
                        )}
                      </div>

                      {/* Message Content */}
                      <div className="mt-1">
                        {editingMessage === msg.id ? (
                          <div className="space-y-2">
                            <textarea
                              defaultValue={msg.text}
                              className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                              rows={2}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  editMessage(msg.id, e.currentTarget.value);
                                }
                              }}
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => editMessage(msg.id, (document.querySelector('textarea') as HTMLTextAreaElement)?.value)}
                                className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                              >
                                Lagre
                              </button>
                              <button
                                onClick={() => setEditingMessage(null)}
                                className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                              >
                                Avbryt
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-700 break-words">
                            {msg.text}
                          </p>
                        )}
                      </div>

                      {/* Reactions */}
                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Object.entries(msg.reactions).map(([emoji, users]) => (
                            <button
                              key={emoji}
                              onClick={() => addReaction(msg.id, emoji)}
                              className={`text-xs px-2 py-1 rounded-full border transition-colors ${users.includes(user?.id || user?.email || 'anonymous')
                                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                              {emoji} {users.length}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Message Actions */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => addReaction(msg.id, '👍')}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Tommel opp"
                        >
                          <IconHeart className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => setReplyToMessage(msg)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Svar"
                        >
                          <IconArrowBack className="w-4 h-4 text-gray-500" />
                        </button>
                        {isOwnMessage && !isMCPMessage && (
                          <>
                            <button
                              onClick={() => setEditingMessage(msg.id)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title="Rediger"
                            >
                              <IconEdit className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              onClick={() => deleteMessage(msg.id)}
                              className="p-1 hover:bg-red-100 rounded transition-colors"
                              title="Slett"
                            >
                              <IconTrash className="w-4 h-4 text-red-500" />
                            </button>
                          </>
                        )}
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <IconDots className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 bg-white">
            {/* Reply Preview */}
            {replyToMessage && (
              <div className="p-3 bg-blue-50 border-b border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconArrowBack className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600 font-medium">
                      Svarer til {replyToMessage.user}
                    </span>
                  </div>
                  <button
                    onClick={() => setReplyToMessage(null)}
                    className="p-1 hover:bg-blue-200 rounded transition-colors"
                  >
                    <IconX className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1 truncate">
                  {replyToMessage.text}
                </p>
              </div>
            )}

            <div className="p-4">
              <div className="flex items-end space-x-2">
                {/* File Attachments */}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Legg ved fil">
                  <IconPaperclip className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Send bilde">
                  <IconPhoto className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Stemmeopptak">
                  <IconMicrophone className="w-5 h-5 text-gray-600" />
                </button>

                {/* Message Input */}
                <div className="flex-1">
                  <div className="relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`Send melding til #${rooms.find(r => r.id === currentRoom)?.name || 'generell'}...`}
                      className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      rows={1}
                      style={{
                        minHeight: '44px',
                        maxHeight: '120px'
                      }}
                    />
                    {/* Emoji Picker Button */}
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Emoji"
                    >
                      <IconMoodSmile className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Quick Emoji Picker */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                      <div className="flex space-x-1">
                        {['👍', '👎', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥', '💯'].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => {
                              setMessage(message + emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Send Button */}
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className={`p-3 rounded-lg transition-colors ${message.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  title="Send melding (Enter)"
                >
                  <IconSend className="w-5 h-5" />
                </button>

                {/* MCP AI Assistant Button */}
                {rooms.find(r => r.id === currentRoom)?.mcpEnabled && (
                  <button
                    onClick={() => {
                      if (message.trim()) {
                        // Simulate MCP response
                        setTimeout(() => {
                          sendMCPMessage('claude', `Takk for meldingen: "${message}". Jeg forstår at du trenger hjelp. Kan du utdype hva du ønsker å oppnå? 🤖`);
                        }, 1000);
                      }
                    }}
                    className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-colors"
                    title="Spør AI-assistent"
                  >
                    <IconRobot className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Encryption Status */}
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <IconShieldCheck className="w-3 h-3 mr-1 text-green-500" />
                    End-to-end kryptert
                  </span>
                  {rooms.find(r => r.id === currentRoom)?.mcpEnabled && (
                    <span className="flex items-center">
                      <IconRobot className="w-3 h-3 mr-1 text-blue-500" />
                      AI-assistenter tilgjengelig
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span>Enter for å sende</span>
                  <span>Shift+Enter for ny linje</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SnakkaZChat;
