import React, { useState, useEffect } from 'react';
import { useWebRTCDirectMessaging } from '@/hooks/useWebRTCDirectMessaging';
import WebRTCStatus from '@/components/chat/WebRTCStatus';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';

interface DirectChatProps {
  currentUserId: string;
  peerId: string;
  peerName: string;
  peerAvatar?: string;
  onSendMessage: (message: string, isP2P: boolean) => void;
  messages: Array<{
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
    isP2P?: boolean;
  }>;
}

/**
 * WebRTCDirectChat - Komponent for direktemeldinger med WebRTC-støtte
 * 
 * Denne komponenten bruker WebRTC for direktemeldinger når tilgjengelig,
 * med automatisk fallback til server når WebRTC ikke er tilgjengelig.
 */
export const WebRTCDirectChat: React.FC<DirectChatProps> = ({
  currentUserId,
  peerId,
  peerName,
  peerAvatar,
  onSendMessage,
  messages
}) => {
  const [messageText, setMessageText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Koble til WebRTC direktemelding-funksjonalitet med ny PeerJS implementasjon
  const {
    connectionState,
    isEncrypted,
    latency,
    connect,
    sendMessage,
    messageQueue,
    statusInfo
  } = useWebRTCDirectMessaging(currentUserId, peerId);

  // Forsøk å etablere WebRTC-tilkobling ved oppstart
  useEffect(() => {
    connect().catch(error => {
      console.error('Failed to establish WebRTC connection:', error);
    });
  }, [connect]);

  // Håndtere sending av melding
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    setIsLoading(true);

    try {
      const isP2P = connectionState === 'p2p';
      const message = messageText.trim();

      // Først prøv å sende via WebRTC hvis tilgjengelig
      if (isP2P) {
        await sendMessage(message);
      }

      // Send alltid via callback-funksjonen
      // Dette sikrer at meldingen blir lagret og sendt via server uansett
      onSendMessage(message, isP2P);

      // Tøm meldingstekstfeltet
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header med tilkoblingsinfo */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center space-x-3">
          <Avatar>
            <img src={peerAvatar || '/default-avatar.png'} alt={peerName} />
          </Avatar>
          <div>
            <h2 className="text-md font-medium">{peerName}</h2>
            <div className="flex items-center text-xs text-gray-500">
              <WebRTCStatus
                connectionStatus={statusInfo().connectionStatus}
                isEncrypted={statusInfo().isEncrypted}
                showText={true}
                showDetails={true}
                onRetryConnection={connect}
              />
              {messageQueue > 0 && (
                <span className="ml-2 text-yellow-500">
                  {messageQueue} meldinger i kø
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Meldingsområde */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg ${message.senderId === currentUserId
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
                }`}
            >
              <div className="text-sm">{message.content}</div>
              <div className="flex items-center justify-end mt-1 text-xs opacity-70">
                <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                {message.isP2P && (
                  <span className="ml-1 flex items-center">
                    • E2E {isEncrypted && <span className="ml-1">🔒</span>}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Meldingsinput */}
      <div className="p-3 border-t">
        <div className="flex space-x-2">
          <Textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Skriv en melding..."
            className="flex-1 min-h-10 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !messageText.trim()}
            className="self-end"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
