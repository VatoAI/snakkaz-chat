
import React from 'react';
import { FriendsList } from './list/FriendsList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DecryptedMessage } from '@/types/message.d';
import { WebRTCManager } from '@/utils/webrtc';

export interface FriendsContainerProps {
  currentUserId: string;
  webRTCManager: WebRTCManager | null;
  directMessages: DecryptedMessage[];
  onNewMessage: (message: DecryptedMessage) => void;
  userProfiles: Record<string, { username: string; avatar_url: string }>;
  onStartChat: (userId: string) => void; // Added this prop
}

export const FriendsContainer: React.FC<FriendsContainerProps> = ({
  currentUserId,
  webRTCManager,
  directMessages,
  onNewMessage,
  userProfiles,
  onStartChat
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-cyberdark-700">
        <h2 className="text-lg font-semibold text-cybergold-300">Friends</h2>
        <Button size="sm" variant="outline" className="text-cybergold-400 hover:text-cybergold-300">
          <Plus className="h-4 w-4 mr-1" />
          Add Friend
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto">
        <FriendsList
          currentUserId={currentUserId}
          webRTCManager={webRTCManager}
          directMessages={directMessages}
          onNewMessage={onNewMessage}
          onStartChat={onStartChat}
          userProfiles={userProfiles}
        />
      </div>
    </div>
  );
};
