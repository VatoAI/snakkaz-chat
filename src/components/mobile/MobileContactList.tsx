import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, Plus, User, ArrowLeft } from 'lucide-react';
import { useFriends } from '@/hooks/useFriends';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface MobileContactListProps {
  onContactSelect?: (contactId: string) => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

export const MobileContactList: React.FC<MobileContactListProps> = ({
  onContactSelect,
  onBackClick,
  showBackButton = false
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { friends, loading } = useFriends();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);

  useEffect(() => {
    if (friends && friends.length > 0) {
      setFilteredContacts(
        friends.filter(friend => 
          friend.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          friend.username?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, friends]);

  const handleContactClick = (contactId: string) => {
    if (onContactSelect) {
      onContactSelect(contactId);
    } else {
      navigate(`/chat/${contactId}`);
    }
  };

  const handleNewContact = () => {
    navigate('/add-contact');
  };

  // Hvis ikke mobil, ikke vis komponenten
  if (!isMobile) return null;

  return (
    <div className="flex flex-col h-[100svh] bg-background">
      {/* Header */}
      <div className="flex items-center justify-between py-3 px-4 border-b">
        <div className="flex items-center">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={onBackClick} className="mr-2">
              <ArrowLeft size={20} />
            </Button>
          )}
          <h1 className="text-lg font-medium">Kontakter</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={handleNewContact}>
          <Plus size={20} />
          <span className="sr-only">Legg til ny kontakt</span>
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Søk etter kontakter..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
            <User className="mb-2" size={40} />
            <p className="font-medium">Ingen kontakter funnet</p>
            {searchTerm ? (
              <p className="text-sm">Prøv et annet søkeord</p>
            ) : (
              <Button variant="outline" className="mt-4" onClick={handleNewContact}>
                <Plus size={18} className="mr-2" />
                Legg til kontakt
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center py-3 px-4 cursor-pointer hover:bg-muted/50 active:bg-muted transition-colors"
                onClick={() => handleContactClick(contact.id)}
              >
                <Avatar className="h-12 w-12 mr-4">
                  {contact.avatarUrl ? (
                    <img src={contact.avatarUrl} alt={contact.displayName || contact.username} />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-primary/10 text-primary text-xl">
                      {(contact.displayName || contact.username || 'A').charAt(0).toUpperCase()}
                    </span>
                  )}
                </Avatar>
                <div className="flex flex-col flex-1">
                  <h3 className="font-medium">{contact.displayName || contact.username}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {contact.status || 'Tilgjengelig'}
                  </p>
                </div>
                <div className="w-3 h-3 rounded-full bg-green-500 ml-2"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileContactList;