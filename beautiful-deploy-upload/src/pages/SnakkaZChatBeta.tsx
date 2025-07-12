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
  UserPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatService, Message, ChatRoom, UserProfile } from '@/services/chat/chatService';
import { SnakkaZInviteSystem } from '@/components/invite/SnakkaZInviteSystem';
import { GroupInviteSystem } from '@/components/chat/GroupInviteSystem';

const SnakkaZChatBeta: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  // State
  const [message, setMessage] = useState('');
  const [activeRoom, setActiveRoom] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteSystemOpen, setIsInviteSystemOpen] = useState(false);
  
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

  // Initialize chat service
  useEffect(() => {
    if (!user) return;

    const initializeChat = async () => {
      try {
        setIsLoading(true);
        
        // Load rooms
        const roomsList = await chatService.getChatRooms();
        setRooms(roomsList);
        
        // Set default active room (first public room or general)
        const defaultRoom = roomsList.find(r => r.name === 'General') || roomsList[0];
        if (defaultRoom) {
          setActiveRoom(defaultRoom.id);
        }
        
        // Load online users
        const users = await chatService.getOnlineUsers();
        setOnlineUsers(users);
        
        // Start presence
        await chatService.updatePresence(true);
        
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        toast({
          title: "Feil",
          description: "Kunne ikke koble til chat. Prøv å laste siden på nytt.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();

    // Cleanup on unmount
    return () => {
      chatService.updatePresence(false);
      chatService.cleanup();
    };
  }, [user, toast]);

  // Subscribe to messages when active room changes
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
      await chatService.sendMessage(activeRoom, message.trim());
      setMessage('');
      messageInputRef.current?.focus();
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
    <div className="h-screen bg-cyberdark-950 flex flex-col overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-cyberdark-900 border-b border-cybergold-500/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-cybergold-400"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
        
        <div className="flex items-center space-x-2">
          <Hash size={16} className="text-cybergold-400" />
          <span className="text-white font-medium">
            {activeRoomData?.name || 'Chat'}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsUserListOpen(!isUserListOpen)}
          className="text-cybergold-400"
        >
          <Users size={20} />
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Rooms */}
        <div className={cn(
          "bg-cyberdark-900 border-r border-cybergold-500/20 flex flex-col",
          "lg:w-80 lg:block",
          isMobileMenuOpen ? "fixed inset-y-0 left-0 z-50 w-80" : "hidden lg:block"
        )}>
          {/* Header */}
          <div className="p-4 border-b border-cybergold-500/20">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold liquid-text">SnakkaZ Beta</h1>
              <Badge variant="outline" className="border-cybergold-500/50 text-cybergold-400">
                BETA
              </Badge>
            </div>
            
            {/* User info */}
            <div className="liquid-glass-subtle p-3 rounded-lg">
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
            <GroupInviteSystem />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakkaZChatBeta;
