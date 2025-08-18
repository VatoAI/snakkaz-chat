import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, Plus, UserPlus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';

interface Contact {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
  status: string;
  isOnline: boolean;
}

interface MobileContactListProps {
  onContactSelect?: (contactId: string) => void;
  showBackButton?: boolean;
}

export const MobileContactList: React.FC<MobileContactListProps> = ({
  onContactSelect,
  showBackButton = true
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const user = useUser();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  
  // Fetch real contacts from Supabase
  useEffect(() => {
    const fetchContacts = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // First, get user's friends
        const { data: friendships, error: friendshipsError } = await supabase
          .from('friendships')
          .select(`
            user_id,
            friend_id,
            status
          `)
          .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
          .eq('status', 'accepted');
          
        if (friendshipsError) throw friendshipsError;
        
        if (friendships && friendships.length > 0) {
          const friendIds = friendships.map(f => 
            f.user_id === user.id ? f.friend_id : f.user_id
          );
          
          // Fetch friend profiles
          const { data: friendProfiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .in('id', friendIds);
            
          if (profilesError) throw profilesError;
          
          if (friendProfiles) {
            // Get presence status for each friend
            const { data: presenceData, error: presenceError } = await supabase
              .from('user_presence')
              .select('user_id, status')
              .in('user_id', friendIds);
            
            const presenceMap = presenceData?.reduce((acc, p) => {
              acc[p.user_id] = p.status;
              return acc;
            }, {} as Record<string, string>) || {};
            
            const contactList: Contact[] = friendProfiles.map(profile => ({
              id: profile.id,
              name: profile.full_name || profile.username || 'Unknown User',
              username: profile.username || 'unknown',
              avatar_url: profile.avatar_url || undefined,
              status: getStatusText(presenceMap[profile.id] || 'offline'),
              isOnline: presenceMap[profile.id] === 'online'
            }));
            
            setContacts(contactList);
          }
        } else {
          // No friends yet, show empty state
          setContacts([]);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
        toast({
          title: "Error",
          description: "Failed to load contacts. Please try again.",
          variant: "destructive",
        });
        setContacts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [user?.id, supabase, toast]);
  
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'online': return 'Tilgjengelig';
      case 'away': return 'Borte';
      case 'dnd': return 'Ikke forstyrr';
      case 'offline': return 'Offline';
      default: return 'Ukjent status';
    }
  };
  
  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle contact selection
  const handleContactSelect = (contactId: string) => {
    if (onContactSelect) {
      onContactSelect(contactId);
    } else {
      // Create new chat with this contact
      navigate(`/chat/${contactId.replace('contact-', 'chat-')}`);
    }
  };
  
  // Go back to previous screen
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-[100svh] bg-cyberdark-950 mobile-dynamic-height">
      {/* Header */}
      <div className="bg-cyberdark-900 border-b border-cyberdark-700 p-4 flex items-center gap-3 mobile-top-safe">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="mobile-touch-target"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Tilbake</span>
          </Button>
        )}
        
        <h1 className="text-xl font-semibold text-cybergold-300 flex-1">Kontakter</h1>
        
        <Button
          variant="ghost"
          size="icon"
          className="mobile-touch-target"
        >
          <UserPlus className="h-5 w-5" />
          <span className="sr-only">Legg til kontakt</span>
        </Button>
      </div>
      
      {/* Search input */}
      <div className="p-4 bg-cyberdark-950">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cybergold-500" />
          <Input
            placeholder="Søk etter kontakter..."
            className="bg-cyberdark-800 border-cyberdark-700 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Contact list */}
      <ScrollArea className="flex-1 px-4 pb-4">
        {isLoading ? (
          <div className="space-y-3 pt-3">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="h-16 bg-cyberdark-800/30 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredContacts.length > 0 ? (
          <div className="space-y-3 pt-3">
            {filteredContacts.map(contact => (
              <Card
                key={contact.id}
                className="p-3 bg-cyberdark-800/50 border-cyberdark-700 flex items-center cursor-pointer hover:bg-cyberdark-800/80 transition-colors"
                onClick={() => handleContactSelect(contact.id)}
              >
                <div className="relative h-10 w-10 rounded-full bg-cyberdark-700 flex items-center justify-center mr-3 overflow-hidden">
                  {contact.avatar_url ? (
                    <img 
                      src={contact.avatar_url} 
                      alt={contact.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-cybergold-300 font-bold text-sm">
                      {contact.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-cyberdark-800" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-cybergold-300">{contact.name}</h3>
                  {contact.status && (
                    <p className="text-xs text-cybergold-500 truncate">{contact.status}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-cyberdark-800 flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-cybergold-500/70" />
            </div>
            <h3 className="text-lg font-medium text-cybergold-400 mb-1">Ingen kontakter funnet</h3>
            <p className="text-sm text-cybergold-500">
              {searchQuery 
                ? `Ingen kontakter matcher "${searchQuery}"`
                : "Legg til kontakter for å starte en samtale"}
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default MobileContactList;