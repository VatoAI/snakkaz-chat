import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { isMCPAvailable } from '@/config/mcp';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import NotificationSystem from '@/features/notifications/components/NotificationSystem';
import SendInviteModal from '@/features/groups/components/SendInviteModal';

import {
  Users,
  Settings,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Image,
  ArrowLeft,
  Bell,
  LogOut,
  UserPlus,
  Shield,
  Crown,
  Info,
  Camera,
  Mic,
  LucideIcon
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: {
    username: string;
    avatar_url?: string;
  };
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name?: string;
  }[];
}

interface Member {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'member';
  joined_at: string;
  user: {
    username: string;
    avatar_url?: string;
    online?: boolean;
  };
}

interface Group {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  created_at: string;
  created_by: string;
  is_private: boolean;
  member_count: number;
  members?: Member[];
}

const GroupChatPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [group, setGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const mcpAvailable = isMCPAvailable();

  // Check screen size for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch group data
  const fetchGroup = async () => {
    if (!groupId || !user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          id,
          name,
          description,
          avatar_url,
          created_at,
          created_by,
          is_private,
          member_count:members(count)
        `)
        .eq('id', groupId)
        .single();
      
      if (error) throw error;
      
      setGroup(data);
    } catch (err) {
      console.error('Error fetching group:', err);
      toast({
        title: 'Kunne ikke laste inn gruppe',
        description: 'Vennligst prøv igjen senere.',
        variant: 'destructive',
      });
    }
  };

  // Fetch group messages
  const fetchMessages = async () => {
    if (!groupId || !user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          user_id,
          user:user_id(username, avatar_url),
          attachments
        `)
        .eq('room_id', groupId)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      // Sort oldest first and transform attachments
      setMessages(
        (data || [])
          .map(msg => ({
            ...msg,
            attachments: msg.attachments 
              ? Array.isArray(msg.attachments) 
                ? msg.attachments 
                : [msg.attachments]
              : []
          }))
          .reverse()
      );
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch group members
  const fetchMembers = async () => {
    if (!groupId || !user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('members')
        .select(`
          id,
          user_id,
          role,
          joined_at,
          user:user_id(username, avatar_url)
        `)
        .eq('room_id', groupId);
      
      if (error) throw error;
      
      // Add online status (mock for demo)
      const membersWithStatus = (data || []).map(member => ({
        ...member,
        user: {
          ...member.user,
          online: Math.random() > 0.5 // Random online status
        }
      }));
      
      setGroup(prev => prev ? { ...prev, members: membersWithStatus } : null);
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!groupId || !user?.id || !messageText.trim()) return;
    
    setSending(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          room_id: groupId,
          user_id: user.id,
          content: messageText
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Add the message to the list with user details
      setMessages(prev => [...prev, {
        ...data,
        user: {
          username: user.username || 'User',
          avatar_url: user.avatar_url
        }
      }]);
      
      // Clear the input
      setMessageText('');
    } catch (err) {
      console.error('Error sending message:', err);
      toast({
        title: 'Kunne ikke sende melding',
        description: 'Vennligst prøv igjen senere.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  // Leave group
  const leaveGroup = async () => {
    if (!groupId || !user?.id) return;
    
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('room_id', groupId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: 'Forlatt gruppe',
        description: 'Du har forlatt gruppen.',
      });
      
      navigate('/chat');
    } catch (err) {
      console.error('Error leaving group:', err);
      toast({
        title: 'Kunne ikke forlate gruppen',
        description: 'Vennligst prøv igjen senere.',
        variant: 'destructive',
      });
    }
  };

  // Format date
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for day separators
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'I dag';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'I går';
    }
    
    return date.toLocaleDateString();
  };

  // Initialize
  useEffect(() => {
    if (user?.id && groupId) {
      fetchGroup();
      fetchMessages();
      fetchMembers();
      
      // Set up real-time subscription for new messages
      const messagesSubscription = supabase
        .channel('room_messages')
        .on('postgres_changes', 
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `room_id=eq.${groupId}`
          },
          async (payload) => {
            // Fetch user details for the new message
            const { data: userData } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', payload.new.user_id)
              .single();
            
            // Add message to list
            setMessages(prev => [...prev, {
              ...payload.new,
              user: userData || { username: 'User' }
            }]);
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(messagesSubscription);
      };
    }
  }, [groupId, user?.id]);

  // Group not found state
  if (!loading && !group) {
    return (
      <div className="min-h-screen bg-cyberdark-950 text-cybergold-100 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-cyberdark-800 rounded-full flex items-center justify-center mb-4">
          <Users className="h-8 w-8 text-cybergold-400/50" />
        </div>
        <h2 className="text-xl font-semibold text-cybergold-300 mb-2">Gruppen finnes ikke</h2>
        <p className="text-cybergold-400 text-center mb-4">
          Gruppen du leter etter ble ikke funnet eller du har ikke tilgang til den.
        </p>
        <Button onClick={() => navigate('/chat')} className="bg-cyberblue-600 hover:bg-cyberblue-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tilbake til chat
        </Button>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-cyberdark-950 text-cybergold-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-cybergold-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-cybergold-400">Laster gruppe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyberdark-950 text-cybergold-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-cyberdark-700 bg-cyberdark-900">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/chat')}
              className="md:hidden rounded-full p-1.5 text-cybergold-400 hover:bg-cyberdark-800/50 hover:text-cybergold-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-cyberdark-700">
                {group.avatar_url ? (
                  <AvatarImage src={group.avatar_url} alt={group.name} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-cyberblue-800 to-cyberblue-950 text-white">
                    {group.name.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-medium text-cybergold-100">{group.name}</h1>
                  {group.is_private && (
                    <Badge variant="outline" className="h-5 px-1.5 rounded-sm text-[10px] bg-cyberdark-800 border-cyberdark-600">
                      <Shield className="h-3 w-3 mr-1" /> 
                      Privat
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-cybergold-400">
                  {group.member_count} medlemmer
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowMembers(!showMembers)}
              className="rounded-full text-cybergold-400 hover:text-cybergold-100 hover:bg-cyberdark-800/50"
            >
              <Users className="h-5 w-5" />
            </Button>
            
            <NotificationSystem />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-cybergold-400 hover:text-cybergold-100 hover:bg-cyberdark-800/50">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-cyberdark-900 border-cyberdark-700">
                <DropdownMenuLabel className="text-cybergold-300">
                  Gruppe Handlinger
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-cyberdark-700" />
                <DropdownMenuGroup>
                  <DropdownMenuItem 
                    onClick={() => setShowInviteModal(true)}
                    className="text-cybergold-100 hover:bg-cyberdark-800"
                  >
                    <UserPlus className="mr-2 h-4 w-4 text-cybergold-400" />
                    <span>Inviter brukere</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-cybergold-100 hover:bg-cyberdark-800">
                    <Settings className="mr-2 h-4 w-4 text-cybergold-400" />
                    <span>Gruppeinnstillinger</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-cybergold-100 hover:bg-cyberdark-800">
                    <Bell className="mr-2 h-4 w-4 text-cybergold-400" />
                    <span>Varsler</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-cybergold-100 hover:bg-cyberdark-800">
                    <Info className="mr-2 h-4 w-4 text-cybergold-400" />
                    <span>Gruppeinfo</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-cyberdark-700" />
                <DropdownMenuItem 
                  onClick={leaveGroup}
                  className="text-red-500 hover:bg-cyberdark-800"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Forlat gruppe</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Main content - chat and members */}
      <div className="flex-1 flex overflow-hidden">
        {/* Messages */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Message list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-cyberdark-800 rounded-full flex items-center justify-center mb-4">
                  <MessageIcon className="h-8 w-8 text-cybergold-400/50" />
                </div>
                <h3 className="text-lg font-medium text-cybergold-300 mb-1">Ingen meldinger ennå</h3>
                <p className="text-cybergold-400 text-center max-w-md">
                  Vær den første til å sende en melding i denne gruppen!
                </p>
              </div>
            ) : (
              messages.map((message, index) => {
                const prevMessage = index > 0 ? messages[index - 1] : null;
                const showDayHeader = prevMessage && new Date(message.created_at).toDateString() !== new Date(prevMessage.created_at).toDateString();
                const isCurrentUser = message.user_id === user?.id;
                
                return (
                  <React.Fragment key={message.id}>
                    {showDayHeader && (
                      <div className="flex items-center my-4">
                        <div className="flex-1 border-t border-cyberdark-700"></div>
                        <span className="px-3 text-xs text-cybergold-500">{formatMessageDate(message.created_at)}</span>
                        <div className="flex-1 border-t border-cyberdark-700"></div>
                      </div>
                    )}
                    
                    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-3 max-w-[85%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="bg-cyberdark-800 text-cybergold-400">
                            {message.user.username?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className={`space-y-1 ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium ${isCurrentUser ? 'text-cybergold-300 order-2' : 'text-cybergold-400'}`}>
                              {isCurrentUser ? 'Du' : message.user.username}
                            </span>
                            <span className="text-xs text-cybergold-500">
                              {formatMessageTime(message.created_at)}
                            </span>
                          </div>
                          
                          <div 
                            className={`px-3 py-2 rounded-lg max-w-md break-words ${
                              isCurrentUser 
                                ? 'bg-gradient-to-r from-cyberblue-900/80 to-cyberblue-800/80 border border-cyberblue-700/40' 
                                : 'bg-cyberdark-800 border border-cyberdark-700'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 grid gap-2">
                                {message.attachments.map((attachment, i) => (
                                  <div key={i}>
                                    {attachment.type === 'image' ? (
                                      <img 
                                        src={attachment.url} 
                                        alt="Attachment" 
                                        className="rounded-md max-h-52 max-w-full object-cover"
                                      />
                                    ) : (
                                      <div className="flex items-center gap-2 p-2 rounded bg-cyberdark-900">
                                        <Paperclip className="h-4 w-4 text-cybergold-400" />
                                        <span className="text-xs text-cybergold-300 truncate">{attachment.name}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            )}
          </div>
          
          {/* Message input */}
          <div className="border-t border-cyberdark-700 p-3">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Skriv en melding..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="pr-12 py-6 bg-cyberdark-800 border-cyberdark-700 text-cybergold-100 placeholder-cybergold-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full text-cybergold-400 hover:text-cybergold-100"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full text-cybergold-400 hover:text-cybergold-100"
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full text-cybergold-400 hover:text-cybergold-100"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Button
                onClick={sendMessage}
                disabled={!messageText.trim() || sending}
                className="h-11 w-11 rounded-full bg-gradient-to-r from-cyberblue-600 to-cyberblue-800 hover:from-cyberblue-700 hover:to-cyberblue-900"
              >
                {sending ? (
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
            
            {/* MCP Status indicator */}
            {mcpAvailable && (
              <div className="flex items-center mt-2 px-2">
                <div className="flex items-center gap-1.5 text-xs text-cybergold-500">
                  <div className="h-1.5 w-1.5 rounded-full bg-cybergreen-500"></div>
                  <span>SnakkaZ MCP koblet til</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Members list (desktop) */}
        {!isMobile && showMembers && (
          <div className="w-64 border-l border-cyberdark-700 overflow-y-auto">
            <div className="p-3 border-b border-cyberdark-700 sticky top-0 bg-cyberdark-900 z-10">
              <h3 className="font-medium text-cybergold-100 flex items-center gap-2">
                <Users className="h-4 w-4" /> Medlemmer ({group.members?.length || 0})
              </h3>
            </div>
            
            <div className="p-2">
              {group.members?.map(member => (
                <div key={member.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-cyberdark-800">
                  <div className="relative">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-cyberdark-800 text-cybergold-400 text-xs">
                        {member.user.username?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span 
                      className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-cyberdark-900 ${
                        member.user.online ? 'bg-cybergreen-500' : 'bg-cyberdark-600'
                      }`}>
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-cybergold-100 truncate">{member.user.username}</span>
                      {member.role === 'admin' && <Crown className="h-3 w-3 text-cybergold-500" />}
                      {member.role === 'moderator' && <Shield className="h-3 w-3 text-cybergold-400" />}
                    </div>
                    <span className="text-xs text-cybergold-500">
                      {member.user.online ? 'Pålogget' : 'Avlogget'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Members list (mobile) */}
        {isMobile && showMembers && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
            <div className="bg-cyberdark-900 rounded-t-2xl w-full max-h-[80vh] overflow-y-auto animate-slide-up">
              <div className="p-4 border-b border-cyberdark-700 flex items-center justify-between sticky top-0 bg-cyberdark-900">
                <h3 className="font-medium text-cybergold-100">Medlemmer ({group.members?.length || 0})</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 rounded-full" 
                  onClick={() => setShowMembers(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-3 space-y-1">
                {group.members?.map(member => (
                  <div key={member.id} className="flex items-center gap-3 p-3 rounded-md">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-cyberdark-800 text-cybergold-400">
                          {member.user.username?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span 
                        className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-cyberdark-900 ${
                          member.user.online ? 'bg-cybergreen-500' : 'bg-cyberdark-600'
                        }`}>
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-cybergold-100 truncate">{member.user.username}</span>
                        {member.role === 'admin' && (
                          <Badge className="bg-cybergold-900/30 text-cybergold-500 border-cybergold-600/30 text-[10px]">
                            <Crown className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                        {member.role === 'moderator' && (
                          <Badge className="bg-cyberblue-900/30 text-cyberblue-400 border-cyberblue-700/30 text-[10px]">
                            <Shield className="h-3 w-3 mr-1" />
                            Mod
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-cybergold-500">
                        {member.user.online ? 'Pålogget nå' : 'Avlogget'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="sticky bottom-0 p-3 border-t border-cyberdark-700 bg-cyberdark-900">
                <Button 
                  onClick={() => {
                    setShowMembers(false);
                    setShowInviteModal(true);
                  }}
                  className="w-full bg-gradient-to-r from-cyberblue-600 to-cyberblue-800 text-white"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Inviter flere
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile quick actions */}
      {isMobile && (
        <div className="fixed bottom-20 right-4 flex flex-col gap-3">
          <Button 
            className="h-12 w-12 rounded-full bg-gradient-to-r from-cyberblue-600 to-cyberblue-800 shadow-lg"
            onClick={() => setShowInviteModal(true)}
          >
            <UserPlus className="h-5 w-5" />
          </Button>
          
          <Button 
            className="h-12 w-12 rounded-full bg-cyberdark-800 border border-cyberdark-700 shadow-lg"
          >
            <Camera className="h-5 w-5" />
          </Button>
          
          <Button 
            className="h-12 w-12 rounded-full bg-cyberdark-800 border border-cyberdark-700 shadow-lg"
          >
            <Mic className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      {/* Invite Modal */}
      {showInviteModal && (
        <SendInviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          groupId={groupId || ''}
          groupName={group?.name || ''}
        />
      )}
    </div>
  );
};

// Helper component for message icon
const MessageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className}
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default GroupChatPage;
