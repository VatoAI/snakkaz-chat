import React from 'react';
import { Phone, Video, MoreVertical, Pin } from 'lucide-react';
import { AppHeader } from './AppHeader';
import { UserAvatar } from './UserAvatar';
import { HeaderActionButton } from './HeaderActionButton';
import { UserStatus } from '@/types/presence';

interface ChatHeaderProps {
  recipientInfo: {
    name: string;
    avatar?: string;
    isOnline?: boolean;
    status?: UserStatus;
  };
  isDirectMessage: boolean;
  onBackToList?: () => void;
  pinnedCount?: number;
  onTogglePinnedMessages?: () => void;
  showPinnedBadge?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  recipientInfo,
  isDirectMessage,
  onBackToList,
  pinnedCount = 0,
  onTogglePinnedMessages,
  showPinnedBadge = false
}) => {
  // Function to get status text
  const getStatusText = (status?: UserStatus, isOnline?: boolean): string => {
    if (!isOnline) return 'Offline';
    
    switch (status) {
      case UserStatus.ONLINE:
        return 'Online nå';
      case UserStatus.AWAY:
        return 'Borte';
      case UserStatus.BUSY:
        return 'Opptatt';
      case UserStatus.OFFLINE:
        return 'Offline';
      default:
        return isOnline ? 'Online nå' : 'Sist sett nylig';
    }
  };

  // Function to get status color
  const getStatusColor = (status?: UserStatus, isOnline?: boolean): string => {
    if (!isOnline) return 'bg-gray-400';
    
    switch (status) {
      case UserStatus.ONLINE:
        return 'bg-green-500';
      case UserStatus.AWAY:
        return 'bg-yellow-500';
      case UserStatus.BUSY:
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
      {/* Pinned messages toggle */}
      {showPinnedBadge && onTogglePinnedMessages && (
        <div className="relative">
          <HeaderActionButton 
            icon={<Pin className="h-5 w-5" />} 
            label={`Festede meldinger (${pinnedCount})`}
            onClick={onTogglePinnedMessages}
          />
          {pinnedCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-cybergold-500 text-cyberdark-900 text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {pinnedCount > 9 ? '9+' : pinnedCount}
            </div>
          )}
        </div>
      )}
      
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
      actions={actionButtons}
    />
  );
};
