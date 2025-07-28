import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getEmojiPacks, getPackEmojis, installEmojiPack, EmojiPack } from '@/utils/emojiPackUtils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Package, Download, Filter, Star, Clock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface EmojiPackBrowserProps {
  onClose?: () => void;
  className?: string;
}

const EmojiPackBrowser: React.FC<EmojiPackBrowserProps> = ({ onClose, className }) => {
  const { user } = useAuth();
  const [packs, setPacks] = useState<EmojiPack[]>([]);
  const [filteredPacks, setFilteredPacks] = useState<EmojiPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPack, setSelectedPack] = useState<EmojiPack | null>(null);
  const [packEmojis, setPackEmojis] = useState<any[]>([]);
  const [installing, setInstalling] = useState(false);

  // Load packs on mount
  useEffect(() => {
    loadPacks();
  }, []);

  // Filter packs when search query changes
  useEffect(() => {
    filterPacks();
  }, [searchQuery, packs, activeTab]);

  // Load emoji packs
  const loadPacks = async () => {
    setLoading(true);
    try {
      // Get all public packs, plus user's private packs if authenticated
      const includePrivate = !!user;
      const data = await getEmojiPacks(includePrivate);
      setPacks(data);
      setFilteredPacks(data);
    } catch (error) {
      console.error('Failed to load emoji packs:', error);
      toast({
        variant: "destructive",
        title: "Feil ved lasting av emoji-pakker",
        description: "Kunne ikke laste emoji-pakker. Prøv igjen senere.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter packs based on search query and tab
  const filterPacks = () => {
    let filtered = [...packs];
    
    // Filter by tab
    if (activeTab === 'animated') {
      filtered = filtered.filter(pack => pack.is_animated);
    } else if (activeTab === 'static') {
      filtered = filtered.filter(pack => !pack.is_animated);
    }
    
    // Then filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pack => 
        pack.name.toLowerCase().includes(query) || 
        pack.description?.toLowerCase().includes(query) ||
        pack.category?.toLowerCase().includes(query)
      );
    }
    
    setFilteredPacks(filtered);
  };

  // Load emojis for a specific pack
  const loadPackEmojis = async (pack: EmojiPack) => {
    setSelectedPack(pack);
    try {
      const emojis = await getPackEmojis(pack.id);
      setPackEmojis(emojis);
    } catch (error) {
      console.error('Failed to load pack emojis:', error);
      setPackEmojis([]);
    }
  };

  // Install an emoji pack
  const handleInstallPack = async () => {
    if (!selectedPack || !user) return;
    
    setInstalling(true);
    try {
      const installedIds = await installEmojiPack(selectedPack.id, user.id);
      
      if (installedIds.length > 0) {
        toast({
          title: "Emoji-pakke installert!",
          description: `${installedIds.length} emojier er nå lagt til i din samling.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Installasjon feilet",
          description: "Kunne ikke installere emoji-pakken.",
        });
      }
    } catch (error) {
      console.error('Failed to install emoji pack:', error);
      toast({
        variant: "destructive",
        title: "Installasjon feilet",
        description: "En feil oppstod under installasjonen av emoji-pakken.",
      });
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className={`${className || ''}`}>
      <Card className="w-full shadow-xl border border-cyberdark-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Emoji-pakker</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Søk etter pakker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-[200px] h-8 text-sm bg-cyberdark-800"
              />
            </div>
          </div>
          <CardDescription>
            Utforsk og installer emoji-pakker for å utvide din samling
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px]">
            {/* Left panel - Pack browser */}
            <div className="flex flex-col h-full border border-cyberdark-700 rounded-md overflow-hidden">
              <div className="p-2 border-b border-cyberdark-700 bg-cyberdark-900">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 h-8">
                    <TabsTrigger value="all" className="text-xs">Alle</TabsTrigger>
                    <TabsTrigger value="animated" className="text-xs">Animerte</TabsTrigger>
                    <TabsTrigger value="static" className="text-xs">Statiske</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <ScrollArea className="flex-1">
                {loading ? (
                  <div className="space-y-4 p-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex flex-col space-y-2">
                        <Skeleton className="h-24 w-full rounded-md" />
                      </div>
                    ))}
                  </div>
                ) : filteredPacks.length > 0 ? (
                  <div className="p-2">
                    {filteredPacks.map(pack => (
                      <div
                        key={pack.id}
                        className={`mb-2 p-3 rounded-md cursor-pointer transition-colors ${
                          selectedPack?.id === pack.id 
                            ? 'bg-cyberblue-900/20 border border-cyberblue-800/30' 
                            : 'hover:bg-cyberdark-900 border border-transparent'
                        }`}
                        onClick={() => loadPackEmojis(pack)}
                      >
                        <div className="flex justify-between">
                          <h3 className="font-medium">{pack.name}</h3>
                          <Badge variant={pack.is_animated ? 'default' : 'secondary'} className="text-xs">
                            {pack.emoji_count} emojis
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {pack.description || 'Ingen beskrivelse'}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <span>Av: {pack.author}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(pack.created_at).toLocaleDateString('no')}</span>
                          {pack.category && (
                            <>
                              <span className="mx-2">•</span>
                              <Badge variant="outline" className="text-xs font-normal">
                                {pack.category}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
                    <Package className="mb-2" size={32} />
                    <p>Ingen emoji-pakker funnet</p>
                    <p className="text-sm mt-1">
                      {searchQuery ? `Prøv et annet søkeord` : `Det finnes ingen emoji-pakker i denne kategorien`}
                    </p>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Right panel - Pack preview */}
            <div className="flex flex-col h-full border border-cyberdark-700 rounded-md overflow-hidden">
              {selectedPack ? (
                <>
                  <div className="p-4 border-b border-cyberdark-700 bg-cyberdark-900">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="font-semibold text-lg">{selectedPack.name}</h2>
                        <p className="text-sm text-gray-400 mt-1">{selectedPack.description}</p>
                      </div>
                      <Badge variant={selectedPack.is_animated ? 'default' : 'secondary'} className="text-xs">
                        {selectedPack.is_animated ? 'Animert' : 'Statisk'}
                      </Badge>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    <div className="grid grid-cols-5 gap-2">
                      {packEmojis.length > 0 ? (
                        packEmojis.map(emoji => (
                          <div key={emoji.id} className="flex flex-col items-center">
                            <img 
                              src={emoji.url} 
                              alt={emoji.name}
                              className="w-12 h-12 object-contain" 
                              onError={(e) => {
                                e.currentTarget.src = '/assets/emoji-placeholder.png';
                              }}
                            />
                            <span className="text-xs text-gray-400 mt-1 truncate w-full text-center">
                              :{emoji.shortcode}:
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-5 flex flex-col items-center justify-center p-8 text-gray-400">
                          <p>Ingen emojier funnet i denne pakken</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  <div className="p-4 border-t border-cyberdark-700 bg-cyberdark-900">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        <span>Versjon: {selectedPack.version || '1.0'}</span>
                        <span className="mx-2">•</span>
                        <span>{selectedPack.emoji_count} emojier</span>
                      </div>
                      <Button 
                        onClick={handleInstallPack}
                        disabled={installing || !user}
                        className="bg-cyberblue-600 hover:bg-cyberblue-500"
                      >
                        <Download className="mr-2" size={16} />
                        {installing ? 'Installerer...' : 'Installer pakke'}
                      </Button>
                    </div>
                    {!user && (
                      <p className="text-xs text-amber-500 mt-2">
                        Du må være logget inn for å installere emoji-pakker.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
                  <Package className="mb-4" size={48} />
                  <h3 className="text-lg font-medium mb-2">Ingen pakke valgt</h3>
                  <p className="text-center">
                    Velg en emoji-pakke fra listen til venstre for å se innholdet og installere den.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-cyberdark-800 p-4">
          <p className="text-xs text-gray-500">
            Emoji-pakker lar deg raskt legge til mange emojier på én gang. {user ? 'Du kan også lage dine egne pakker fra dine egendefinerte emojier.' : ''}
          </p>
          <Button variant="ghost" onClick={onClose}>Lukk</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmojiPackBrowser;
