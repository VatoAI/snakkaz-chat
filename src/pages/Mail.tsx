import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { UnifiedNavigation } from '@/components/navigation/UnifiedNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Mail, 
  Send, 
  Inbox, 
  Edit, 
  Trash2, 
  Archive, 
  Reply, 
  Forward,
  Star,
  Search,
  Plus,
  AlertCircle
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface MailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  folder: 'inbox' | 'sent' | 'archive' | 'trash';
}

const Mail = () => {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState<MailMessage | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock mail data - would be fetched from database
  const [messages, setMessages] = useState<MailMessage[]>([
    {
      id: '1',
      from: 'admin@snakkaz.chat',
      to: user?.email || '',
      subject: 'Velkommen til Snakkaz Chat Mail',
      content: 'Velkommen til det nye mail-systemet! Her kan du sende og motta meldinger fra andre brukere.',
      timestamp: new Date('2025-06-01T10:00:00'),
      read: false,
      starred: false,
      folder: 'inbox'
    },
    {
      id: '2',
      from: 'system@snakkaz.chat',
      to: user?.email || '',
      subject: 'Ditt Premium-abonnement',
      content: `Hei! ${isPremium ? 'Takk for at du bruker Snakkaz Premium!' : 'Oppgrader til Premium for flere funksjoner.'}`,
      timestamp: new Date('2025-06-01T09:30:00'),
      read: true,
      starred: true,
      folder: 'inbox'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    content: ''
  });

  const filteredMessages = messages.filter(msg => {
    const matchesFolder = msg.folder === activeTab;
    const matchesSearch = !searchTerm || 
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleSendMessage = () => {
    if (!newMessage.to || !newMessage.subject || !newMessage.content) {
      toast({
        title: "Feil",
        description: "Vennligst fyll ut alle feltene.",
        variant: "destructive"
      });
      return;
    }

    const message: MailMessage = {
      id: Date.now().toString(),
      from: user?.email || '',
      to: newMessage.to,
      subject: newMessage.subject,
      content: newMessage.content,
      timestamp: new Date(),
      read: true,
      starred: false,
      folder: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage({ to: '', subject: '', content: '' });
    setIsComposing(false);
    
    toast({
      title: "Melding sendt",
      description: `Din melding til ${newMessage.to} er sendt!`,
    });
  };

  const handleMarkAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const handleToggleStar = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
    ));
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, folder: 'trash' } : msg
    ));
    setSelectedMessage(null);
    toast({
      title: "Melding slettet",
      description: "Meldingen er flyttet til papirkurven.",
    });
  };

  return (
    <div className="min-h-screen bg-cyberdark-950 text-cybergold-300 pb-16 md:pb-0 md:pt-16">
      <UnifiedNavigation variant="horizontal" />
      
      <main className="container max-w-7xl py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-cybergold-400" />
            <h1 className="text-2xl font-bold text-cybergold-400">Snakkaz Mail</h1>
            {isPremium && (
              <Badge className="bg-gradient-to-r from-cybergold-600 to-cybergold-400 text-cyberdark-900">
                Premium
              </Badge>
            )}
          </div>
          
          <Button 
            onClick={() => setIsComposing(true)}
            className="bg-cybergold-600 hover:bg-cybergold-500 text-black"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ny melding
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 bg-cyberdark-900 border-cyberdark-700">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cybergold-600" />
              <Input
                placeholder="Søk i meldinger..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-cyberdark-800 border-cyberdark-700"
              />
            </div>
          </CardContent>
        </Card>

        {/* Mail Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar and Message List */}
          <div className="lg:col-span-1">
            <Card className="bg-cyberdark-900 border-cyberdark-700">
              <CardHeader>
                <CardTitle className="text-cybergold-400">Mapper</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
                  <TabsList className="grid grid-cols-1 gap-2 bg-cyberdark-800 p-1">
                    <TabsTrigger 
                      value="inbox" 
                      className="flex items-center gap-2 data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400"
                    >
                      <Inbox className="h-4 w-4" />
                      Innboks ({messages.filter(m => m.folder === 'inbox').length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="sent"
                      className="flex items-center gap-2 data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400"
                    >
                      <Send className="h-4 w-4" />
                      Sendt ({messages.filter(m => m.folder === 'sent').length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="archive"
                      className="flex items-center gap-2 data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400"
                    >
                      <Archive className="h-4 w-4" />
                      Arkiv ({messages.filter(m => m.folder === 'archive').length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="trash"
                      className="flex items-center gap-2 data-[state=active]:bg-cybergold-600/20 data-[state=active]:text-cybergold-400"
                    >
                      <Trash2 className="h-4 w-4" />
                      Papirkurv ({messages.filter(m => m.folder === 'trash').length})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {/* Message List */}
            <Card className="mt-4 bg-cyberdark-900 border-cyberdark-700">
              <CardHeader>
                <CardTitle className="text-cybergold-400">Meldinger</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {filteredMessages.length === 0 ? (
                    <div className="p-6 text-center text-cybergold-600">
                      <Mail className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Ingen meldinger i denne mappen</p>
                    </div>
                  ) : (
                    filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 border-b border-cyberdark-700 cursor-pointer hover:bg-cyberdark-800/50 transition-colors ${
                          selectedMessage?.id === message.id ? 'bg-cyberdark-800' : ''
                        }`}
                        onClick={() => {
                          setSelectedMessage(message);
                          if (!message.read) {
                            handleMarkAsRead(message.id);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-cyberdark-700 text-cybergold-400 text-xs">
                                {message.from.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className={`font-medium ${!message.read ? 'text-cybergold-400' : 'text-cybergold-500'}`}>
                              {activeTab === 'sent' ? `Til: ${message.to}` : message.from}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {message.starred && (
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            )}
                            {!message.read && (
                              <div className="h-2 w-2 bg-cybergold-400 rounded-full" />
                            )}
                          </div>
                        </div>
                        <h3 className={`font-medium mb-1 ${!message.read ? 'text-cybergold-300' : 'text-cybergold-500'}`}>
                          {message.subject}
                        </h3>
                        <p className="text-sm text-cybergold-600 truncate">
                          {message.content}
                        </p>
                        <p className="text-xs text-cybergold-700 mt-2">
                          {message.timestamp.toLocaleDateString('nb-NO')} {message.timestamp.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Content or Compose */}
          <div className="lg:col-span-2">
            {isComposing ? (
              <Card className="bg-cyberdark-900 border-cyberdark-700">
                <CardHeader>
                  <CardTitle className="text-cybergold-400 flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Ny melding
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="to">Til</Label>
                    <Input
                      id="to"
                      type="email"
                      placeholder="mottaker@snakkaz.chat"
                      value={newMessage.to}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, to: e.target.value }))}
                      className="mt-1 bg-cyberdark-800 border-cyberdark-700"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Emne</Label>
                    <Input
                      id="subject"
                      placeholder="Skriv emnet her..."
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                      className="mt-1 bg-cyberdark-800 border-cyberdark-700"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="content">Melding</Label>
                    <Textarea
                      id="content"
                      placeholder="Skriv meldingen din her..."
                      value={newMessage.content}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                      className="mt-1 bg-cyberdark-800 border-cyberdark-700 min-h-[200px]"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-cybergold-600 hover:bg-cybergold-500 text-black"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send melding
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setIsComposing(false)}
                      className="border-cyberdark-600 text-cybergold-400 hover:bg-cyberdark-800"
                    >
                      Avbryt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : selectedMessage ? (
              <Card className="bg-cyberdark-900 border-cyberdark-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-cybergold-400">{selectedMessage.subject}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-cyberdark-700 text-cybergold-400 text-xs">
                            {selectedMessage.from.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm text-cybergold-400">
                            Fra: {selectedMessage.from}
                          </p>
                          <p className="text-xs text-cybergold-600">
                            {selectedMessage.timestamp.toLocaleDateString('nb-NO')} {selectedMessage.timestamp.toLocaleTimeString('nb-NO')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleToggleStar(selectedMessage.id)}
                        className={`border-cyberdark-600 ${selectedMessage.starred ? 'text-yellow-400' : 'text-cybergold-600'} hover:bg-cyberdark-800`}
                      >
                        <Star className={`h-4 w-4 ${selectedMessage.starred ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                        className="border-red-600 text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-cybergold-300 whitespace-pre-wrap">
                      {selectedMessage.content}
                    </p>
                  </div>
                  
                  <Separator className="my-6 bg-cyberdark-700" />
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        setNewMessage({
                          to: selectedMessage.from,
                          subject: `Re: ${selectedMessage.subject}`,
                          content: `\n\n--- Original melding ---\nFra: ${selectedMessage.from}\nEmne: ${selectedMessage.subject}\n\n${selectedMessage.content}`
                        });
                        setIsComposing(true);
                      }}
                      variant="outline"
                      className="border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/20"
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Svar
                    </Button>
                    <Button 
                      onClick={() => {
                        setNewMessage({
                          to: '',
                          subject: `Fwd: ${selectedMessage.subject}`,
                          content: `\n\n--- Videresendt melding ---\nFra: ${selectedMessage.from}\nEmne: ${selectedMessage.subject}\n\n${selectedMessage.content}`
                        });
                        setIsComposing(true);
                      }}
                      variant="outline"
                      className="border-cybergold-600 text-cybergold-400 hover:bg-cybergold-600/20"
                    >
                      <Forward className="h-4 w-4 mr-2" />
                      Videresend
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-cyberdark-900 border-cyberdark-700">
                <CardContent className="p-12 text-center">
                  <Mail className="h-16 w-16 mx-auto mb-4 text-cybergold-600 opacity-50" />
                  <h3 className="text-xl font-medium text-cybergold-400 mb-2">
                    Velg en melding
                  </h3>
                  <p className="text-cybergold-600">
                    Klikk på en melding fra listen for å lese den, eller opprett en ny melding.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Info Card for non-premium users */}
        {!isPremium && (
          <Card className="mt-6 bg-gradient-to-r from-cybergold-900/20 to-cyberdark-800 border-cybergold-600">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-cybergold-400" />
                <div>
                  <h3 className="font-medium text-cybergold-400">Oppgrader til Premium</h3>
                  <p className="text-cybergold-300 text-sm">
                    Få tilgang til avanserte mail-funksjoner som filvedlegg, e-post-viderekobling og mer lagringsplass.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Mail;
