import React from 'react';
import { ArrowLeft, User, Users, MoreVertical, Phone, Video } from 'lucide-react';

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
  return (
    <div className="flex items-center px-4 py-3 bg-background border-b border-border h-14">
      {/* Back button for mobile */}
      {onBackToList && (
        <button
          className="mr-2 p-1.5 rounded-full hover:bg-muted"
          onClick={onBackToList}
          aria-label="Tilbake"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      
      {/* Avatar */}
      <div className="relative h-9 w-9 rounded-full overflow-hidden bg-muted mr-3 flex-shrink-0">
        {recipientInfo.avatar ? (
          <img
            src={recipientInfo.avatar}
            alt={recipientInfo.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-primary/10">
            {isDirectMessage ? (
              <User className="h-5 w-5 text-primary" />
            ) : (
              <Users className="h-5 w-5 text-primary" />
            )}
          </div>
        )}
        
        {/* Online indicator */}
        {recipientInfo.isOnline !== undefined && (
          <div className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background ${
            recipientInfo.isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`} />
        )}
      </div>
      
      {/* Name and status */}
      <div className="flex-grow min-w-0">
        <div className="font-medium text-foreground truncate">
          {recipientInfo.name}
        </div>
        <div className="text-xs text-muted-foreground">
          {recipientInfo.isOnline ? 'Online nå' : 'Sist sett nylig'}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center gap-1">
        {isDirectMessage && (
          <>
            <button
              className="p-2 rounded-full hover:bg-muted"
              aria-label="Lydsamtale"
            >
              <Phone className="h-5 w-5 text-foreground" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-muted"
              aria-label="Videosamtale"
            >
              <Video className="h-5 w-5 text-foreground" />
            </button>
          </>
        )}
        <button
          className="p-2 rounded-full hover:bg-muted"
          aria-label="Flere alternativer"
        >
          <MoreVertical className="h-5 w-5 text-foreground" />
        </button>
      </div>
    </div>
  );
};