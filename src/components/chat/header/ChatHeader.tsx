
import React from 'react';
import { Phone, Video, MoreVertical } from 'lucide-react';
import { AppHeader } from './AppHeader';
import { UserAvatar } from './UserAvatar';
import { HeaderActionButton } from './HeaderActionButton';

// Define UserStatus as a string literal type
type UserStatus = 'online' | 'away' | 'busy' | 'offline';

interface ChatHeaderProps {
  recipientInfo: {
    name: string;
    avatar?: string;
    isOnline?: boolean;
    status?: UserStatus;
  };
  isDirectMessage: boolean;
  onBackToList?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  recipientInfo,
  isDirectMessage,
  onBackToList
}) => {
  // Function to get status text
  const getStatusText = (status?: UserStatus, isOnline?: boolean): string => {
    if (!isOnline) return 'Offline';
    
    switch (status) {
      case 'online':
        return 'Online nå';
      case 'away':
        return 'Borte';
      case 'busy':
        return 'Opptatt';
      case 'offline':
        return 'Offline';
      default:
        return isOnline ? 'Online nå' : 'Sist sett nylig';
    }
  };

  // Function to get status color
  const getStatusColor = (status?: UserStatus, isOnline?: boolean): string => {
    if (!isOnline) return 'bg-gray-400';
    
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return isOnline ? 'bg-green-500' : 'bg-gray-400';
    }
  };

  // Generate subtitle based on status
  const subtitle = getStatusText(recipientInfo.status, recipientInfo.isOnline);
  
  // Create action buttons based on chat type
  const actionButtons = (
    <>
      {isDirectMessage && (
        <>
          <HeaderActionButton 
            icon={<Phone className="h-5 w-5" />} 
            label="Lydsamtale"
            onClick={() => console.log('Audio call')}
          />
          <HeaderActionButton 
            icon={<Video className="h-5 w-5" />} 
            label="Videosamtale"
            onClick={() => console.log('Video call')}
          />
        </>
      )}
      <HeaderActionButton 
        icon={<MoreVertical className="h-5 w-5" />} 
        label="Flere alternativer"
        onClick={() => console.log('More options')}
      />
    </>
  );

  return (
    <AppHeader
      variant="chat"
      context={isDirectMessage ? "direct-message" : "group-chat"}
      onBackClick={onBackToList}
      title={recipientInfo.name}
      subtitle={subtitle}
      avatar={
        <UserAvatar
          src={recipientInfo.avatar}
          alt={recipientInfo.name}
          isGroup={!isDirectMessage}
          status={getStatusColor(recipientInfo.status, recipientInfo.isOnline)}
        />
      }
      isOnline={recipientInfo.isOnline}
      actions={actionButtons}
    />
  );
};
