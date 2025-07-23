import React, { useState } from 'react';
import { Wifi, WifiOff, Server, Shield, AlertCircle, Loader } from 'lucide-react';
import { ConnectionType } from '../../hooks/useWebRTCDirectMessaging.new';

interface WebRTCStatusProps {
  connectionStatus?: ConnectionType;
  isEncrypted?: boolean;
  className?: string;
  showText?: boolean;
  showDetails?: boolean;
  latency?: number | null;
  onRetryConnection?: () => void;
}

/**
 * WebRTCStatus - Component that displays WebRTC connection status in SnakkaZ Chat
 * 
 * This component shows if the chat conversation is using P2P (WebRTC), server fallback,
 * or is disconnected, as well as encryption status.
 */
const WebRTCStatus: React.FC<WebRTCStatusProps> = ({
  connectionStatus = 'connecting',
  isEncrypted = false,
  className = '',
  showText = true,
  showDetails = false,
  latency = null,
  onRetryConnection,
}) => {
  const [tooltip, setTooltip] = useState<string>('');
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);
  
  // Generate status message based on connection type
  const getStatusMessage = (): string => {
    switch (connectionStatus) {
      case 'p2p':
        return isEncrypted 
          ? 'Direktetilkobling med ende-til-ende-kryptering' 
          : 'Direktetilkobling';
      case 'server':
        return 'Tilkoblet via server';
      case 'connecting':
        return 'Kobler til...';
      case 'disconnected':
        return 'Frakoblet';
      case 'error':
        return 'Tilkoblingsfeil';
      default:
        return 'Ukjent tilkoblingsstatus';
    }
  };

  // Determine icons based on connection type and encryption
  const renderIcon = () => {
    switch (connectionStatus) {
      case 'p2p':
        return (
          <>
            <Wifi className="text-green-500" />
            {isEncrypted && <Shield className="ml-1 text-blue-400" />}
          </>
        );
      case 'server':
        return <Server className="text-yellow-500" />;
      case 'connecting':
        return <Loader className="animate-spin text-blue-400" />;
      case 'disconnected':
        return <WifiOff className="text-gray-400" />;
      case 'error':
        return <AlertCircle className="text-red-500" />;
      default:
        return <WifiOff className="text-gray-400" />;
    }
  };

  // Handle hover to show tooltip
  const handleMouseEnter = () => {
    const message = getStatusMessage();
    let details = '';
    
    if (connectionStatus === 'p2p') {
      details = `\nDirekte peer-to-peer tilkobling ${
        isEncrypted ? 'med ende-til-ende-kryptering' : 'uten ende-til-ende-kryptering'
      }.${latency ? `\nLatens: ${latency}ms` : ''}`;
    } else if (connectionStatus === 'server') {
      details = `\nTilkobling via server (fallback-modus).${
        latency ? `\nLatens: ${latency}ms` : ''
      }\nMerk: Ende-til-ende-kryptering er ikke tilgjengelig i server-modus.`;
    } else if (connectionStatus === 'error') {
      details = '\nProblemer med tilkoblingen. Klikk for å prøve igjen.';
    }
    
    setTooltip(`${message}${showDetails ? details : ''}`);
    setIsTooltipVisible(true);
  };

  return (
    <div 
      className={`relative flex items-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsTooltipVisible(false)}
      onClick={connectionStatus === 'error' ? onRetryConnection : undefined}
    >
      <div className="flex items-center">
        {renderIcon()}
        {showText && (
          <span className={`ml-1 text-xs ${
            connectionStatus === 'p2p' ? 'text-green-500' : 
            connectionStatus === 'server' ? 'text-yellow-500' : 
            connectionStatus === 'error' ? 'text-red-500' : 
            'text-gray-400'
          }`}>
            {connectionStatus === 'p2p' ? 'P2P' : 
             connectionStatus === 'server' ? 'Server' : 
             connectionStatus === 'connecting' ? 'Kobler til...' : 
             connectionStatus === 'error' ? 'Feil' : 'Frakoblet'}
            {(connectionStatus === 'p2p' || connectionStatus === 'server') && latency && (
              <span className="ml-1">{latency}ms</span>
            )}
          </span>
        )}
      </div>
      
      {/* Tooltip */}
      {isTooltipVisible && (
        <div className="absolute bottom-full left-0 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded shadow-lg whitespace-pre-wrap max-w-xs z-50">
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default WebRTCStatus;
