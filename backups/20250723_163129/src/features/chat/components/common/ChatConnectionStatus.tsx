import React from 'react';
import { ShieldAlert, ShieldCheck, AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface ChatConnectionStatusProps {
  connectionState: string;
  dataChannelState: string;
  usingServerFallback: boolean;
  securityLevel: string;
}

export const ChatConnectionStatus: React.FC<ChatConnectionStatusProps> = ({
  connectionState,
  dataChannelState,
  usingServerFallback,
  securityLevel,
}) => {
  // Determine connection status
  const isConnected = 
    connectionState === 'connected' && 
    (dataChannelState === 'open' || usingServerFallback);
  
  // Determine security level icon and text
  const renderSecurityIcon = () => {
    switch (securityLevel) {
      case 'premium':
      case 'e2ee':
        return <ShieldCheck className="h-3.5 w-3.5 text-green-500" />;
      case 'server_e2ee':
        return <ShieldCheck className="h-3.5 w-3.5 text-cybergold-500" />;
      default:
        return <ShieldAlert className="h-3.5 w-3.5 text-red-500" />;
    }
  };

  const getSecurityText = () => {
    switch (securityLevel) {
      case 'premium':
        return 'Premium E2EE';
      case 'e2ee':
        return 'E2EE';
      case 'server_e2ee':
        return 'Server E2EE';
      default:
        return 'Unencrypted';
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-end gap-1.5 px-2 py-1 bg-cyberdark-900/80 rounded-md border border-red-900/30">
        <WifiOff className="h-3.5 w-3.5 text-red-500" />
        <span className="text-xs text-red-500">Disconnected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-1.5 px-2 py-1 bg-cyberdark-900/80 rounded-md border border-cybergold-900/30">
      {usingServerFallback ? (
        <>
          <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />
          <span className="text-xs text-yellow-500">Server Fallback</span>
        </>
      ) : (
        <>
          <Wifi className="h-3.5 w-3.5 text-green-500" />
          <span className="text-xs text-green-500">P2P Connected</span>
        </>
      )}
      <span className="mx-1 text-cybergold-500/30">•</span>
      {renderSecurityIcon()}
      <span className="text-xs text-cybergold-500">{getSecurityText()}</span>
    </div>
  );
};