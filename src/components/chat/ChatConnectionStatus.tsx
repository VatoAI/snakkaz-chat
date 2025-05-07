import React from 'react';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ChatConnectionStatusProps {
  connectionState: string;
  dataChannelState: string;
  usingServerFallback: boolean;
}

export const ChatConnectionStatus: React.FC<ChatConnectionStatusProps> = ({
  connectionState,
  dataChannelState,
  usingServerFallback
}) => {
  let icon = <AlertCircle className="h-4 w-4" />;
  let message = 'Tilkoblingsstatus ukjent';
  let variant: 'default' | 'destructive' | null = 'default';

  if (connectionState === 'checking' || connectionState === 'connecting') {
    message = 'Kobler til...';
  } else if (connectionState === 'failed' || connectionState === 'disconnected') {
    icon = <WifiOff className="h-4 w-4" />;
    message = 'Kunne ikke opprette P2P tilkobling. Bruker server-modus.';
    variant = 'destructive';
  } else if (connectionState === 'connected' && dataChannelState !== 'open') {
    message = 'Tilkoblet, åpner kryptert kanal...';
  } else if (connectionState === 'connected' && dataChannelState === 'open') {
    icon = <Wifi className="h-4 w-4" />;
    message = 'Direkte ende-til-ende-kryptert tilkobling aktiv';
  }

  if (usingServerFallback) {
    message = 'Bruker server-ruting (ende-til-ende kryptert)';
  }

  return (
    <Alert variant={variant} className="mb-4 bg-cyberdark-800/80 border-cybergold-900/50">
      <div className="flex items-center gap-2">
        {icon}
        <AlertDescription>{message}</AlertDescription>
      </div>
    </Alert>
  );
};