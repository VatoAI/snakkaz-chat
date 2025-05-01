import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Users, Bot, Bell, UserPlus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';

const WelcomeDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('chat');

  // Handler for navigating to different sections
  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-cybergold-400 mb-2">
          Velkommen til Snakkaz Chat
        </h1>
        <p className="text-cybergold-500">
          Din sikre kommunikasjonsplattform med ende-til-ende kryptering
        </p>
      </div>

      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="groups">Grupper</TabsTrigger>
          <TabsTrigger value="ai">AI Assistent</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-cyberdark-900 border-cybergold-500/30 hover:border-cybergold-500/50 transition-all cursor-pointer" 
                  onClick={() => navigateTo('/chat')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-cybergold-900/20 p-3 rounded-full">
                    <MessageSquare className="h-8 w-8 text-cybergold-500" />
                  </div>
                  <Button variant="ghost" size="sm" className="text-cybergold-400">
                    Start
                  </Button>
                </div>
                <h3 className="text-xl font-medium text-cybergold-300 mb-2">Private Meldinger</h3>
                <p className="text-sm text-cybergold-500">
                  Chat privat med venner med ende-til-ende kryptering. Ingen kan lese meldingene dine, ikke engang vi.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-cyberdark-900 border-cybergold-500/30 hover:border-cybergold-500/50 transition-all cursor-pointer" 
                  onClick={() => navigateTo('/profile')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-cybergold-900/20 p-3 rounded-full">
                    <UserPlus className="h-8 w-8 text-cybergold-500" />
                  </div>
                  <Button variant="ghost" size="sm" className="text-cybergold-400">
                    Administrer
                  </Button>
                </div>
                <h3 className="text-xl font-medium text-cybergold-300 mb-2">Venner & Kontakter</h3>
                <p className="text-sm text-cybergold-500">
                  Administrer din venneliste og kontakter. Søk etter nye venner og aksepter eller avslå forespørsler.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="groups" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-cyberdark-900 border-cybergold-500/30 hover:border-cybergold-500/50 transition-all cursor-pointer" 
                  onClick={() => navigateTo('/group-chat')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-cybergold-900/20 p-3 rounded-full">
                    <Users className="h-8 w-8 text-cybergold-500" />
                  </div>
                  <Button variant="ghost" size="sm" className="text-cybergold-400">
                    Utforsk
                  </Button>
                </div>
                <h3 className="text-xl font-medium text-cybergold-300 mb-2">Gruppechatter</h3>
                <p className="text-sm text-cybergold-500">
                  Delta i gruppediskusjoner med sikker kryptering. Opprett nye grupper eller bli med i eksisterende.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-cyberdark-900 border-cybergold-500/30 hover:border-cybergold-500/50 transition-all cursor-pointer" 
                  onClick={() => navigateTo('/group-chat')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-cybergold-900/20 p-3 rounded-full">
                    <Bell className="h-8 w-8 text-cybergold-500" />
                  </div>
                  <Button variant="ghost" size="sm" className="text-cybergold-400">
                    Vis
                  </Button>
                </div>
                <h3 className="text-xl font-medium text-cybergold-300 mb-2">Invitasjoner</h3>
                <p className="text-sm text-cybergold-500">
                  Se dine ventende gruppeinvitasjoner og inviter venner til dine gruppechatter.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-cyberdark-900 border-cybergold-500/30 hover:border-cybergold-500/50 transition-all cursor-pointer" 
                  onClick={() => navigateTo('/ai-chat')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-cybergold-900/20 p-3 rounded-full">
                    <Bot className="h-8 w-8 text-cybergold-500" />
                  </div>
                  <Button variant="ghost" size="sm" className="text-cybergold-400">
                    Start
                  </Button>
                </div>
                <h3 className="text-xl font-medium text-cybergold-300 mb-2">AI Assistent</h3>
                <p className="text-sm text-cybergold-500">
                  Chat med vår AI-assistent for å få hjelp og svar på spørsmål om Snakkaz Chat og dens funksjoner.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-cyberdark-900 border-cybergold-500/30 hover:border-cybergold-500/50 transition-all cursor-pointer" 
                  onClick={() => navigateTo('/settings')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-cybergold-900/20 p-3 rounded-full">
                    <Settings className="h-8 w-8 text-cybergold-500" />
                  </div>
                  <Button variant="ghost" size="sm" className="text-cybergold-400">
                    Konfigurer
                  </Button>
                </div>
                <h3 className="text-xl font-medium text-cybergold-300 mb-2">AI Innstillinger</h3>
                <p className="text-sm text-cybergold-500">
                  Konfigurer AI-assistenten, juster personverninnstillinger, og sett opp din egen API-nøkkel for Chat AI.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-12 bg-gradient-to-r from-cyberdark-800 via-cyberdark-900 to-cyberdark-800 border border-cybergold-500/30 rounded-lg p-6">
        <h3 className="text-xl font-medium text-cybergold-300 mb-4">Sikkerhetsstatus</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-cybergold-400">Ende-til-ende kryptering aktiv</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-cybergold-400">Perfect Forward Secrecy</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-cybergold-400">Sertifikat-pinning aktivert</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeDashboard;