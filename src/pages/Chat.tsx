import React, { useState, useEffect } from 'react';
import MainNav from '@/components/navigation/MainNav';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { MessagesSquare, Users, Bell, Settings } from 'lucide-react';

// Dette er en placeholder Chat-side som viser grunnleggende struktur
// Den faktiske implementasjonen vil kreve flere komponenter og integrasjoner

const Chat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('messages');
  const username = user?.user_metadata?.username || 'bruker';

  useEffect(() => {
    // Simuler lasting av meldinger
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(loadingTimeout);
  }, []);

  const handleNewChat = () => {
    toast({
      title: 'Ny chat',
      description: 'Funksjonen for å starte ny chat er under utvikling.',
    });
  };

  return (
    <div className="min-h-screen bg-cyberdark-950 text-cybergold-300 pb-16 md:pb-0 md:pt-16">
      <MainNav />
      <main className="container max-w-4xl py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 text-cybergold-400">Chat</h1>
        <div className="bg-cyberdark-900 border border-cyberdark-700 rounded-lg p-4">
          <p>Velkommen til Snakkaz Chat, {username}!</p>
          <p className="mt-4">Vi arbeider med å implementere chatfunksjonaliteten. Denne vil snart være klar.</p>
        </div>
        <div className="h-full flex flex-col bg-cyberdark-950 text-cybergold-200 mt-8">
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
                    <span className="hidden sm:inline">Meldinger</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="contacts" 
                    className={`data-[state=active]:border-b-2 data-[state=active]:border-cybergold-500 data-[state=active]:text-cybergold-400`}
                  >
                    <Users className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Kontakter</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className={`data-[state=active]:border-b-2 data-[state=active]:border-cybergold-500 data-[state=active]:text-cybergold-400`}
                  >
                    <Bell className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Varsler</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className={`data-[state=active]:border-b-2 data-[state=active]:border-cybergold-500 data-[state=active]:text-cybergold-400`}
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Innstillinger</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="messages" className="flex-1 overflow-hidden p-4">
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-cybergold-300">Dine samtaler</h2>
                  <Button 
                    onClick={handleNewChat}
                    className="bg-cybergold-600 hover:bg-cybergold-500 text-black"
                  >
                    Ny samtale
                  </Button>
                </div>

                <ScrollArea className="h-[calc(100vh-220px)]">
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
                      <Card className="p-4 bg-cyberdark-800/50 border-cyberdark-700 hover:bg-cyberdark-800 cursor-pointer">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cybergold-400 to-cybergold-600 flex items-center justify-center mr-3">
                            <span className="text-black font-bold">AS</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="font-medium text-cybergold-300">Alex Smith</p>
                              <span className="text-xs text-cybergold-500">14:22</span>
                            </div>
                            <p className="text-sm text-cybergold-400 truncate">Hei! Hvordan går det med Snakkaz-prosjektet?</p>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-4 bg-cyberdark-800/50 border-cyberdark-700 hover:bg-cyberdark-800 cursor-pointer">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mr-3">
                            <span className="text-black font-bold">MJ</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="font-medium text-cybergold-300">Maja Jensen</p>
                              <span className="text-xs text-cybergold-500">i går</span>
                            </div>
                            <p className="text-sm text-cybergold-400 truncate">Send meg de filene når du har tid!</p>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-4 bg-cyberdark-800/50 border-cyberdark-700 hover:bg-cyberdark-800 cursor-pointer">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-3">
                            <span className="text-black font-bold">TO</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="font-medium text-cybergold-300">Thomas Olsen</p>
                              <span className="text-xs text-cybergold-500">ons</span>
                            </div>
                            <p className="text-sm text-cybergold-400 truncate">Kan vi møtes for å diskutere designet?</p>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-4 bg-cyberdark-800/50 border-cyberdark-700 hover:bg-cyberdark-800 cursor-pointer">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mr-3">
                            <span className="text-black font-bold">LH</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="font-medium text-cybergold-300">Lise Hansen</p>
                              <span className="text-xs text-cybergold-500">tirs</span>
                            </div>
                            <p className="text-sm text-cybergold-400 truncate">Takk for hjelpen med koden!</p>
                          </div>
                        </div>
                      </Card>
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
