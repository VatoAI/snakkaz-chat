import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UnifiedNavigation } from '@/components/navigation/UnifiedNavigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { MessagesSquare, Users, Bell, Settings, Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileChatContainer } from '@/features/chat/components/interface/MobileChatContainer';
import { MobileContactList } from '@/components/mobile/MobileContactList';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

interface ChatItem {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  lastMessage: string;
  time: string;
  isOnline: boolean;
  unreadCount?: number;
}

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    username: string;
  };
  timestamp: string;
  is_edited: boolean;
}

// Dette er en Chat-side med forbedret mobiltilpasning
const Chat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const isMobile = useIsMobile();
  const supabase = useSupabaseClient();
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('messages');
  const username = user?.user_metadata?.username || 'bruker';
  
  // State for real data
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [chats, setChats] = useState<ChatItem[]>([]);
  const currentUserId = user?.id || null;

  // Fetch messages for a specific chat
  const fetchMessagesForChat = useCallback(async (chatId: string) => {
    try {
      const { data: messagesData, error } = await supabase
        .from('private_chat_messages')
        .select(`
          id,
          content,
          sender_id,
          created_at,
          is_edited,
          profiles(username)
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      if (messagesData) {
        const formattedMessages: Message[] = messagesData.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender: {
            id: msg.sender_id,
            username: Array.isArray(msg.profiles) ? msg.profiles[0]?.username || 'Unknown' : 'Unknown'
          },
          timestamp: msg.created_at,
          is_edited: msg.is_edited || false
        }));

        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [supabase]);

  // Helper function to format time ago
  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'now';
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  // Fetch real conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUserId) return;
      
      setIsLoading(true);
      try {
        // Get user's recent conversations from private chats
        const { data: userParticipations, error: participationError } = await supabase
          .from('participants')
          .select('chat_id')
          .eq('user_id', currentUserId);

        if (participationError) {
          console.error('Error fetching participations:', participationError);
          setChats([]);
          return;
        }

        if (!userParticipations || userParticipations.length === 0) {
          setChats([]);
          return;
        }

        const chatIds = userParticipations.map(p => p.chat_id);

        // Get chat details
        const { data: privateChats, error: chatsError } = await supabase
          .from('private_chats')
          .select('id, created_at')
          .in('id', chatIds);

        if (chatsError) {
          console.error('Error fetching chats:', chatsError);
          setChats([]);
          return;
        }

        if (!privateChats || privateChats.length === 0) {
          setChats([]);
          return;
        }

        // For each chat, get the other participant and last message
        const conversationsData = await Promise.all(
          privateChats.map(async (chat) => {
            // Get other participants
            const { data: participants, error: participantsError } = await supabase
              .from('participants')
              .select(`
                user_id,
                profiles(
                  id,
                  username,
                  full_name,
                  avatar_url
                )
              `)
              .eq('chat_id', chat.id)
              .neq('user_id', currentUserId);

            if (participantsError || !participants || participants.length === 0) {
              return null;
            }

            const otherParticipant = participants[0];
            if (!otherParticipant.profiles || !Array.isArray(otherParticipant.profiles) || otherParticipant.profiles.length === 0) {
              return null;
            }

            const profile = otherParticipant.profiles[0];

            // Get last message
            const { data: lastMessageData } = await supabase
              .from('private_chat_messages')
              .select('content, created_at')
              .eq('chat_id', chat.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            // Get user presence
            const { data: presenceData } = await supabase
              .from('user_presence')
              .select('status')
              .eq('user_id', otherParticipant.user_id)
              .single();

            // Get unread count
            const { data: unreadData } = await supabase
              .from('private_chat_messages')
              .select('id')
              .eq('chat_id', chat.id)
              .neq('sender_id', currentUserId)
              .is('read_at', null);

            const conversation: ChatItem = {
              id: chat.id,
              username: profile.username || 'Unknown User',
              full_name: profile.full_name || undefined,
              avatar_url: profile.avatar_url || undefined,
              lastMessage: lastMessageData?.content || 'No messages yet',
              time: lastMessageData ? formatTimeAgo(lastMessageData.created_at) : 'New',
              isOnline: presenceData?.status === 'online',
              unreadCount: unreadData?.length || 0
            };

            return conversation;
          })
        );

        const validConversations = conversationsData
          .filter((conv): conv is ChatItem => conv !== null)
          .sort((a, b) => {
            // Sort by time - newest first
            return new Date(b.time).getTime() - new Date(a.time).getTime();
          });

        setChats(validConversations);
        
        // If we're in a specific conversation, set it as selected
        if (conversationId) {
          const selectedConversation = validConversations.find(chat => chat.id === conversationId);
          if (selectedConversation) {
            setSelectedChat(selectedConversation);
            await fetchMessagesForChat(conversationId);
          }
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        toast({
          title: "Error",
          description: "Failed to load conversations. Please try again.",
          variant: "destructive",
        });
        setChats([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [currentUserId, conversationId, supabase, toast, fetchMessagesForChat]);

  // Navigate to selected conversation
  const handleChatSelect = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  // Add a new message
  const handleSendMessage = async (text: string, mediaFile?: File) => {
    if (!text.trim() && !mediaFile) return;
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: {
        id: currentUserId,
        username: username
      },
      content: text,
      media_url: mediaFile ? URL.createObjectURL(mediaFile) : undefined,
      timestamp: new Date().toISOString(),
      is_edited: false
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // In a real app, you would send the message to your backend here
    toast({
      title: "Melding sendt",
      description: "Din melding ble sendt.",
      duration: 2000
    });
  };

  const handleNewChat = () => {
    if (isMobile) {
      navigate('/contacts');
    } else {
      toast({
        title: 'Ny chat',
        description: 'Funksjonen for å starte ny chat er under utvikling.',
      });
    }
  };

  // Mobile-specific layout when in a conversation
  if (isMobile && conversationId && selectedChat) {
    return (
      <MobileChatContainer
        messages={messages}
        currentUserId={currentUserId}
        conversationId={conversationId}
        onSendMessage={handleSendMessage}
        onDeleteMessage={(id) => {
          setMessages(prev => prev.filter(msg => msg.id !== id));
          toast({
            title: "Melding slettet",
            description: "Meldingen ble slettet.",
            duration: 2000
          });
        }}
        hasMoreMessages={false}
        chatPartner={{
          id: selectedChat.id,
          username: selectedChat.username,
          isOnline: selectedChat.isOnline
        }}
        showBackButton={true}
        onBackClick={() => navigate('/chat')}
      />
    );
  }

  // Mobile contacts list view
  if (isMobile && activeTab === 'contacts' && !conversationId) {
    return (
      <MobileContactList 
        onContactSelect={handleChatSelect}
        showBackButton={false}
      />
    );
  }

  // Regular desktop layout or mobile chat list
  return (
    <div className="min-h-screen bg-cyberdark-950 text-cybergold-300 pb-16 md:pb-0 md:pt-16">
      <UnifiedNavigation variant="horizontal" />
      <main className="container max-w-4xl py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-cybergold-400">Chat</h1>
          {isMobile && (
            <Button 
              onClick={handleNewChat}
              size="icon"
              className="rounded-full bg-cybergold-600 hover:bg-cybergold-500 text-black"
            >
              <Plus className="h-5 w-5" />
              <span className="sr-only">Ny chat</span>
            </Button>
          )}
        </div>
        
        <div className="h-full flex flex-col bg-cyberdark-950 text-cybergold-200">
          <div className="flex-1 overflow-hidden">
            <Tabs 
              defaultValue="messages" 
              className="h-full flex flex-col"
              onValueChange={setActiveTab}
            >
              <div className="border-b border-cyberdark-800 px-4">
                <TabsList className="bg-transparent border-b-0">
                  <TabsTrigger 
                    value="messages" 
                    className={`data-[state=active]:border-b-2 data-[state=active]:border-cybergold-500 data-[state=active]:text-cybergold-400`}
                  >
                    <MessagesSquare className="h-5 w-5 mr-2" />
                    <span className={isMobile ? "sr-only" : "inline"}>Meldinger</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="contacts" 
                    className={`data-[state=active]:border-b-2 data-[state=active]:border-cybergold-500 data-[state=active]:text-cybergold-400`}
                  >
                    <Users className="h-5 w-5 mr-2" />
                    <span className={isMobile ? "sr-only" : "inline"}>Kontakter</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className={`data-[state=active]:border-b-2 data-[state=active]:border-cybergold-500 data-[state=active]:text-cybergold-400`}
                  >
                    <Bell className="h-5 w-5 mr-2" />
                    <span className={isMobile ? "sr-only" : "inline"}>Varsler</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className={`data-[state=active]:border-b-2 data-[state=active]:border-cybergold-500 data-[state=active]:text-cybergold-400`}
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    <span className={isMobile ? "sr-only" : "inline"}>Innstillinger</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="messages" className="flex-1 overflow-hidden p-4">
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-cybergold-300">Dine samtaler</h2>
                  {!isMobile && (
                    <Button 
                      onClick={handleNewChat}
                      className="bg-cybergold-600 hover:bg-cybergold-500 text-black"
                    >
                      Ny samtale
                    </Button>
                  )}
                </div>

                <ScrollArea className={`${isMobile ? 'h-[calc(100vh-180px)]' : 'h-[calc(100vh-220px)]'}`}>
                  {isLoading ? (
                    <div className="space-y-4">
                      {Array(5).fill(0).map((_, i) => (
                        <Card key={i} className="p-4 bg-cyberdark-800 border-cyberdark-700">
                          <div className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-12 rounded-full bg-cyberdark-700" />
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-4 w-1/4 bg-cyberdark-700" />
                              <Skeleton className="h-3 w-3/4 bg-cyberdark-700" />
                            </div>
                            <Skeleton className="h-3 w-10 bg-cyberdark-700" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : chats.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-cybergold-400">Ingen samtaler ennå.</p>
                      <p className="text-sm text-cybergold-500 mt-2">Start en ny samtale for å komme i gang!</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {chats.map(chat => (
                        <Card 
                          key={chat.id}
                          className="p-4 bg-cyberdark-800/50 border-cyberdark-700 hover:bg-cyberdark-800 cursor-pointer transition-colors"
                          onClick={() => handleChatSelect(chat.id)}
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 relative overflow-hidden">
                              {chat.avatar_url ? (
                                <img 
                                  src={chat.avatar_url} 
                                  alt={chat.username}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-cybergold-400 to-cybergold-600 flex items-center justify-center">
                                  <span className="text-black font-bold text-sm">
                                    {chat.username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                  </span>
                                </div>
                              )}
                              {chat.isOnline && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-cyberdark-800"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-medium text-cybergold-300">{chat.full_name || chat.username}</p>
                                  <p className="text-sm text-cybergold-400 truncate">{chat.lastMessage}</p>
                                </div>
                                <div className="text-right ml-2">
                                  <span className="text-xs text-cybergold-500">{chat.time}</span>
                                  {chat.unreadCount && chat.unreadCount > 0 && (
                                    <div className="mt-1 bg-cybergold-600 text-black text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                      {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="contacts" className="flex-1 p-4">
                <h2 className="text-xl font-semibold text-cybergold-300 mb-4">Dine kontakter</h2>
                <p className="text-cybergold-400">Kontakter vil bli vist her...</p>
              </TabsContent>
              
              <TabsContent value="notifications" className="flex-1 p-4">
                <h2 className="text-xl font-semibold text-cybergold-300 mb-4">Varsler</h2>
                <p className="text-cybergold-400">Ingen nye varsler å vise.</p>
              </TabsContent>
              
              <TabsContent value="settings" className="flex-1 p-4">
                <h2 className="text-xl font-semibold text-cybergold-300 mb-4">Innstillinger</h2>
                <div className="grid gap-4">
                  <Card className="p-4 bg-cyberdark-800 border-cyberdark-700">
                    <h3 className="text-lg font-medium text-cybergold-300 mb-2">Personvern</h3>
                    <p className="text-sm text-cybergold-400">Administrer din personvernsinnstillinger og databehandling.</p>
                  </Card>
                  
                  <Card className="p-4 bg-cyberdark-800 border-cyberdark-700">
                    <h3 className="text-lg font-medium text-cybergold-300 mb-2">Varsler</h3>
                    <p className="text-sm text-cybergold-400">Konfigurer hvordan og når du mottar varsler.</p>
                  </Card>
                  
                  <Card className="p-4 bg-cyberdark-800 border-cyberdark-700">
                    <h3 className="text-lg font-medium text-cybergold-300 mb-2">Kryptering</h3>
                    <p className="text-sm text-cybergold-400">Administrer krypteringsnøkler og E2EE-innstillinger.</p>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
