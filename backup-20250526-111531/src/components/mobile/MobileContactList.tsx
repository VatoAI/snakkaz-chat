import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, Plus, UserPlus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock contacts data - replace with actual data in real implementation
  const mockContacts = [
    {
      id: 'contact-1',
      name: 'Alex Smith',
      avatarColor: 'from-cybergold-400 to-cybergold-600',
      initials: 'AS',
      status: 'Tilgjengelig for chat!',
      isOnline: true
    },
    {
      id: 'contact-2',
      name: 'Maja Jensen',
      avatarColor: 'from-purple-400 to-purple-600',
      initials: 'MJ',
      status: 'På jobb',
      isOnline: true
    },
    {
      id: 'contact-3',
      name: 'Thomas Olsen',
      avatarColor: 'from-blue-400 to-blue-600',
      initials: 'TO',
      status: 'Opptatt - møte',
      isOnline: false
    },
    {
      id: 'contact-4',
      name: 'Lise Hansen',
      avatarColor: 'from-green-400 to-green-600',
      initials: 'LH',
      status: 'Ikke forstyrr',
      isOnline: true
    },
    {
      id: 'contact-5',
      name: 'Erik Pedersen',
      avatarColor: 'from-red-400 to-red-600',
      initials: 'EP',
      status: '',
      isOnline: false
    },
    {
      id: 'contact-6',
      name: 'Kamilla Berg',
      avatarColor: 'from-pink-400 to-pink-600',
      initials: 'KB',
      status: 'På reise - tilbake mandag',
      isOnline: false
    },
    {
      id: 'contact-7',
      name: 'Sindre Nilsen',
      avatarColor: 'from-yellow-400 to-yellow-600',
      initials: 'SN',
      status: '',
      isOnline: true
    }
  ];
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter contacts based on search query
  const filteredContacts = mockContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                <div className={`relative h-10 w-10 rounded-full bg-gradient-to-br ${contact.avatarColor} flex items-center justify-center mr-3`}>
                  <span className="text-black font-bold">{contact.initials}</span>
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