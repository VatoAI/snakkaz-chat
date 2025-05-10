import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Share, Plus, Settings, Send } from 'lucide-react';

const GroupChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    // Simuler lasting av gruppe-informasjon
    const loadGroupData = async () => {
      try {
        // I en ekte implementasjon ville vi hente gruppedata fra Supabase her
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setGroupName(id ? `Gruppe #${id}` : 'Ny gruppe');
        setIsLoading(false);
      } catch (error) {
        console.error('Feil ved lasting av gruppedata:', error);
        toast({
          variant: 'destructive',
          title: 'Feil ved lasting',
          description: 'Kunne ikke laste gruppedata. Prøv igjen senere.'
        });
      }
    };

    loadGroupData();
  }, [id, toast]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // I en ekte implementasjon ville dette sende meldingen til Supabase
    toast({
      title: 'Melding sendt',
      description: 'Meldingsfunksjonalitet er under utvikling.'
    });
    
    setMessage('');
  };

  const handleShareGroup = () => {
    // Generer en invitasjonslenke (i virkeligheten ville dette komme fra backend)
    const inviteLink = `https://snakkaz.com/invite?code=GRP${Math.floor(Math.random() * 1000000)}`;
    
    // Kopier til utklippstavle
    navigator.clipboard.writeText(inviteLink).then(() => {
      toast({
        title: 'Invitasjonslenke kopiert',
        description: 'Lenken er kopiert til utklippstavlen.'
      });
    }).catch(err => {
      console.error('Kunne ikke kopiere lenke:', err);
      toast({
        variant: 'destructive',
        title: 'Kunne ikke kopiere',
        description: 'Prøv å kopiere lenken manuelt.'
      });
    });
  };

  return (
    <div className="h-full flex flex-col bg-cyberdark-950 text-cybergold-200">
      {/* Gruppe header */}
      <div className="border-b border-cyberdark-800 p-4">
        <div className="flex justify-between items-center">
          {isLoading ? (
            <Skeleton className="h-8 w-1/3 bg-cyberdark-800" />
          ) : (
            <div>
              <h1 className="text-xl font-bold text-cybergold-300">{groupName}</h1>
              <p className="text-sm text-cybergold-500">5 medlemmer</p>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-cyberdark-700 bg-cyberdark-800 hover:bg-cyberdark-700"
              onClick={handleShareGroup}
            >
              <Share className="h-4 w-4 mr-1" />
              Del
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-cyberdark-700 bg-cyberdark-800 hover:bg-cyberdark-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Legg til
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-cyberdark-700 bg-cyberdark-800 hover:bg-cyberdark-700"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Meldingsområdet */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="space-y-6">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <Card className={`max-w-[80%] p-3 ${i % 2 === 0 ? 'bg-cyberdark-800' : 'bg-cyberdark-700'} border-none`}>
                  <div className="flex items-center mb-2">
                    <Skeleton className="h-6 w-20 bg-cyberdark-700" />
                    <Skeleton className="h-3 w-10 bg-cyberdark-700 ml-2" />
                  </div>
                  <Skeleton className="h-4 w-full bg-cyberdark-700 mb-1" />
                  <Skeleton className="h-4 w-4/5 bg-cyberdark-700" />
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Her vil vi normalt mappe over faktiske meldinger, men dette er bare placeholders */}
            <div className="flex justify-start">
              <Card className="max-w-[80%] p-3 bg-cyberdark-800 border-cyberdark-700">
                <div className="flex items-center mb-1">
                  <span className="font-medium text-cybergold-300">Maja Jensen</span>
                  <span className="text-xs text-cybergold-500 ml-2">10:15</span>
                </div>
                <p className="text-cybergold-200">Velkommen alle sammen til vår nye gruppesamtale! 👋</p>
              </Card>
            </div>
            
            <div className="flex justify-start">
              <Card className="max-w-[80%] p-3 bg-cyberdark-800 border-cyberdark-700">
                <div className="flex items-center mb-1">
                  <span className="font-medium text-cybergold-300">Alex Smith</span>
                  <span className="text-xs text-cybergold-500 ml-2">10:17</span>
                </div>
                <p className="text-cybergold-200">Hei! Takk for invitasjonen til gruppen.</p>
              </Card>
            </div>
            
            <div className="flex justify-end">
              <Card className="max-w-[80%] p-3 bg-cyberdark-900/30 border-cybergold-800/30">
                <div className="flex items-center justify-end mb-1">
                  <span className="text-xs text-cybergold-500 mr-2">10:20</span>
                  <span className="font-medium text-cybergold-300">Deg</span>
                </div>
                <p className="text-cybergold-200">Hei alle sammen! Skal vi diskutere prosjektet her?</p>
              </Card>
            </div>
            
            <div className="flex justify-start">
              <Card className="max-w-[80%] p-3 bg-cyberdark-800 border-cyberdark-700">
                <div className="flex items-center mb-1">
                  <span className="font-medium text-cybergold-300">Thomas Olsen</span>
                  <span className="text-xs text-cybergold-500 ml-2">10:22</span>
                </div>
                <p className="text-cybergold-200">Ja, det høres bra ut! Jeg har allerede noen ideer jeg vil dele med dere alle.</p>
              </Card>
            </div>
            
            <div className="flex justify-start">
              <Card className="max-w-[80%] p-3 bg-cyberdark-800 border-cyberdark-700">
                <div className="flex items-center mb-1">
                  <span className="font-medium text-cybergold-300">Lise Hansen</span>
                  <span className="text-xs text-cybergold-500 ml-2">10:25</span>
                </div>
                <p className="text-cybergold-200">Flott! Kan vi planlegge et møte neste uke for å gå gjennom alt sammen?</p>
              </Card>
            </div>
          </div>
        )}
      </ScrollArea>
      
      {/* Meldingsinput */}
      <div className="border-t border-cyberdark-800 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Skriv en melding..."
            className="flex-1 bg-cyberdark-800 border-cyberdark-700 text-cybergold-200 focus:border-cybergold-500"
          />
          <Button 
            type="submit" 
            disabled={!message.trim()}
            className="bg-cybergold-600 hover:bg-cybergold-500 text-black"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default GroupChatPage;
