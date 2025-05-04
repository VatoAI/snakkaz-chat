import React from 'react';
import { Phone, Video, MoreVertical } from 'lucide-react';
import { AppHeader } from './AppHeader';
import { UserAvatar } from './UserAvatar';
import { HeaderActionButton } from './HeaderActionButton';

interface ChatHeaderProps {
  recipientInfo: {
    name: string;
    avatar?: string;
    isOnline?: boolean;
  };
  isDirectMessage: boolean;
  onBackToList?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  recipientInfo,
  isDirectMessage,
  onBackToList
}) => {
  // Generate subtitle based on online status
  const subtitle = recipientInfo.isOnline ? 'Online nå' : 'Sist sett nylig';
  
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
        />
      }
      isOnline={recipientInfo.isOnline}
      actions={actionButtons}
    />
  );
};