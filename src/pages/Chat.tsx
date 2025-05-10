import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainNav from '@/components/navigation/MainNav';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { MessagesSquare, Users, Bell, Settings, Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileChatContainer from '@/components/mobile/MobileChatContainer';
import { MobileContactList } from '@/components/mobile/MobileContactList';

// Dette er en Chat-side med forbedret mobiltilpasning
const Chat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('messages');
  const username = user?.user_metadata?.username || 'bruker';
  
  // Mock data for demonstration
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const currentUserId = user?.id || null;

  useEffect(() => {
    // Simuler lasting av meldinger
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
      
      // Generate some mock messages if in a conversation
      if (conversationId) {
        const mockMessages = generateMockMessages(conversationId);
        setMessages(mockMessages);
        
        // Set selected chat based on conversation ID
        const mockChat = mockChats.find(chat => chat.id === conversationId);
        if (mockChat) {
          setSelectedChat(mockChat);
        }
      }
    }, 1000);

    return () => clearTimeout(loadingTimeout);
  }, [conversationId]);

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
  
  // Mock data for demonstration
  const mockChats = [
    {
      id: "chat-1",
      username: "Alex Smith",
      avatarColor: "from-cybergold-400 to-cybergold-600",
      initials: "AS",
      lastMessage: "Hei! Hvordan går det med Snakkaz-prosjektet?",
      time: "14:22",
      isOnline: true
    },
    {
      id: "chat-2",
      username: "Maja Jensen",
      avatarColor: "from-purple-400 to-purple-600",
      initials: "MJ",
      lastMessage: "Send meg de filene når du har tid!",
      time: "i går",
      isOnline: false
    },
    {
      id: "chat-3",
      username: "Thomas Olsen",
      avatarColor: "from-blue-400 to-blue-600",
      initials: "TO",
      lastMessage: "Kan vi møtes for å diskutere designet?",
      time: "ons",
      isOnline: true
    },
    {
      id: "chat-4",
      username: "Lise Hansen",
      avatarColor: "from-green-400 to-green-600",
      initials: "LH",
      lastMessage: "Takk for hjelpen med koden!",
      time: "tirs",
      isOnline: false
    }
  ];
  
  function generateMockMessages(chatId: string) {
    const chat = mockChats.find(c => c.id === chatId);
    if (!chat) return [];
    
    return [
      {
        id: `${chatId}-msg-1`,
        sender: {
          id: chat.id,
          username: chat.username
        },
        content: "Hei! Hvordan går det med deg?",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        is_edited: false
      },
      {
        id: `${chatId}-msg-2`,
        sender: {
          id: currentUserId,
          username: username
        },
        content: "Det går bra takk! Jobber med Snakkaz-appen nå. Den begynner å ta form!",
        timestamp: new Date(Date.now() - 3500000).toISOString(),
        is_edited: false
      },
      {
        id: `${chatId}-msg-3`,
        sender: {
          id: chat.id,
          username: chat.username
        },
        content: "Høres spennende ut! Kan ikke vente med å se den ferdige appen.",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        is_edited: false
      },
      {
        id: `${chatId}-msg-4`,
        sender: {
          id: currentUserId,
          username: username
        },
        content: "Jeg jobber med å forbedre mobilvisningen akkurat nå. Det blir mye bedre med nye komponenter.",
        timestamp: new Date(Date.now() - 900000).toISOString(),
        is_edited: false
      },
      {
        id: `${chatId}-msg-5`,
        sender: {
          id: chat.id,
          username: chat.username
        },
        content: chat.lastMessage,
        timestamp: new Date(Date.now() - 300000).toISOString(),
        is_edited: false
      }
    ];
  }

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
      <MainNav />
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
                  ) : (
                    <div className="space-y-2">
                      {mockChats.map(chat => (
                        <Card 
                          key={chat.id}
                          className="p-4 bg-cyberdark-800/50 border-cyberdark-700 hover:bg-cyberdark-800 cursor-pointer transition-colors"
                          onClick={() => handleChatSelect(chat.id)}
                        >
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${chat.avatarColor} flex items-center justify-center mr-3 relative`}>
                              <span className="text-black font-bold">{chat.initials}</span>
                              {chat.isOnline && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-cyberdark-800"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <p className="font-medium text-cybergold-300">{chat.username}</p>
                                <span className="text-xs text-cybergold-500">{chat.time}</span>
                              </div>
                              <p className="text-sm text-cybergold-400 truncate">{chat.lastMessage}</p>
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
