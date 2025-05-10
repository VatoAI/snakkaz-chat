import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Check, CheckCheck, Shield, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useAuth } from '@/hooks/useAuth';

export interface MessageProps {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: Date;
  isRead?: boolean;
  isDelivered?: boolean;
  securityLevel?: 'p2p_e2ee' | 'server_e2ee' | 'standard';
  onContextMenu?: (e: React.MouseEvent) => void;
}

const MessageBubble: React.FC<MessageProps> = ({
  id,
  content,
  senderId,
  senderName,
  senderAvatar,
  timestamp,
  isRead = false,
  isDelivered = true,
  securityLevel = 'standard',
  onContextMenu
}) => {
  const { user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const { isMobile } = useDeviceDetection();
  
  // Sjekk om meldingen er fra den innloggede brukeren
  const isCurrentUser = user?.id === senderId;
  
  // Formater tidspunkt
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: nb });
  
  // Vis dato hvis meldingen er eldre enn 24 timer
  const showDateInstead = new Date().getTime() - new Date(timestamp).getTime() > 24 * 60 * 60 * 1000;
  
  // Boblen sin stil basert på avsender
  const bubbleStyles = cn(
    'relative p-3 rounded-xl max-w-[80%] break-words shadow-sm',
    isCurrentUser ? 
      'bg-blue-500 text-white rounded-br-none ml-auto' : 
      'bg-gray-600 bg-opacity-40 rounded-bl-none mr-auto'
  );
  
  // Vis eller skjul detaljer ved klikk
  const toggleDetails = () => {
    setShowDetails(prev => !prev);
  };
  
  // Levering-/leste-status-indikator
  const StatusIndicator = () => {
    if (isCurrentUser) {
      if (isRead) {
        return <CheckCheck className="h-4 w-4 text-blue-200" />;
      } else if (isDelivered) {
        return <Check className="h-4 w-4 text-blue-200" />;
      } else {
        return <Clock className="h-4 w-4 text-blue-200" />; 
      }
    }
    return null;
  };
  
  // Sikkerhets-indikator
  const SecurityIcon = () => {
    if (securityLevel === 'p2p_e2ee') {
      return <Shield className="h-3 w-3 text-emerald-300" />;
    } else if (securityLevel === 'server_e2ee') {
      return <Shield className="h-3 w-3 text-blue-300" />;
    }
    return null;
  };
  
  return (
    <div 
      className="flex flex-col mb-2 px-2 w-full"
      onContextMenu={onContextMenu}
    >
      {/* Avsendernavn over boblen for ikke-eier */}
      {!isCurrentUser && (
        <span className="text-xs ml-12 mb-1 opacity-70">
          {senderName}
        </span>
      )}
      
      <div className={`flex items-end gap-2 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar for ikke-eier */}
        {!isCurrentUser && (
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            {senderAvatar ? (
              <img src={senderAvatar} alt={senderName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-500 flex items-center justify-center text-white text-sm">
                {senderName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}
        
        {/* Meldingsboble */}
        <div className={bubbleStyles} onClick={toggleDetails}>
          {/* Meldingsinnhold */}
          <div>{content}</div>
          
          {/* Tid og status */}
          <div className="flex items-center justify-end gap-1 mt-1 -mb-1 opacity-70">
            {/* Sikkerhetsikon */}
            <SecurityIcon />
            
            {/* Tidspunkt */}
            <span className="text-xs">
              {showDateInstead ? formattedDate : formattedTime}
            </span>
            
            {/* Status-indikator */}
            <StatusIndicator />
          </div>
        </div>
      </div>
      
      {/* Detaljert info (vis ved klikk) */}
      {showDetails && (
        <div className={`text-xs opacity-50 mt-1 ${isCurrentUser ? 'text-right mr-2' : 'ml-12'}`}>
          {`Sendt: ${new Date(timestamp).toLocaleString()} · ID: ${id.substring(0, 6)}`}
          {securityLevel !== 'standard' && (
            <> · Kryptering: {securityLevel === 'p2p_e2ee' ? 'P2P E2EE' : 'E2EE'}</>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;