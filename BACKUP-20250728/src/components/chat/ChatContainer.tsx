import React, { useState, useEffect } from 'react';
import { useIntegratedChat } from '@/hooks/useIntegratedChat';
import { WebRTCDirectChat } from './WebRTCDirectChat';
import { useUser } from '@supabase/auth-helpers-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  username: string;
  avatar_url?: string | null;
  online?: boolean;
}

interface ChatContainerProps {
  peerId: string;
  onClose?: () => void;
}

/**
 * ChatContainer - Container for integrert direktemeldingsfunksjonalitet
 * 
 * Denne komponenten kombinerer WebRTC-direktemeldinger med tradisjonell
 * server-basert meldingshåndtering, og tilbyr et komplett grensesnitt
 * for meldingsutveksling mellom to brukere.
 */
export const ChatContainer: React.FC<ChatContainerProps> = ({
  peerId,
  onClose
}) => {
  const user = useUser();
  const { toast } = useToast();
  const [peerUser, setPeerUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Koble til den integrerte chaten med ny PeerJS implementasjon
  const {
    messages,
    error,
    sendMessage
  } = useIntegratedChat(user?.id || '', peerId || '');

  // Last inn brukerinformasjon om den andre brukeren
  useEffect(() => {
    const loadPeerUser = async () => {
      if (!peerId) return;

      setIsLoadingUser(true);

      try {
        // Her ville en faktisk implementasjon hente brukerinfo fra API/database
        // Dette er en mock for demonstrasjon
        const mockUserData = {
          id: peerId,
          username: `user_${peerId.substring(0, 5)}`,
          avatar_url: null,
          online: true
        };

        // Simuler nettverksforsinkelse
        await new Promise(resolve => setTimeout(resolve, 800));

        setPeerUser(mockUserData);
      } catch (err) {
        console.error('Error loading peer user:', err);
        toast({
          title: 'Kunne ikke laste brukerinfo',
          description: 'Prøv igjen senere',
          variant: 'destructive'
        });
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadPeerUser();
  }, [peerId, toast]);

  // Håndter sending av melding
  const handleSendMessage = async (messageContent: string, _isP2P: boolean) => {
    if (!user || !messageContent.trim()) return;

    try {
      const result = await sendMessage(messageContent);

      if (!result) {
        toast({
          title: 'Kunne ikke sende melding',
          description: 'Prøv igjen senere',
          variant: 'destructive'
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
      toast({
        title: 'Feil ved sending av melding',
        description: 'Sjekk nettverkstilkobling og prøv igjen',
        variant: 'destructive'
      });
    }
  };

  // Vis lastestatus
  if (isLoadingUser) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24 mt-2" />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="h-16 w-5/6" />
        </div>
      </div>
    );
  }

  // Vis feilmelding
  if (error || !peerUser) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">
          {error || 'Kunne ikke laste brukerinformasjon'}
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-secondary rounded"
        >
          Lukk
        </button>
      </div>
    );
  }

  // Formater meldingene for WebRTCDirectChat-komponenten
  const formattedMessages = messages.map(msg => ({
    id: msg.id,
    senderId: msg.senderId,
    content: msg.content,
    timestamp: msg.timestamp,
    isP2P: msg.isP2P
  }));

  return (
    <div className="h-full flex flex-col">
      <WebRTCDirectChat
        currentUserId={user?.id || ''}
        peerId={peerId}
        peerName={peerUser.username}
        peerAvatar={peerUser.avatar_url || undefined}
        onSendMessage={handleSendMessage}
        messages={formattedMessages}
      />
    </div>
  );
};
