
import React from 'react';
import { DecryptedMessage } from '@/types/message';
import { UserPresence } from '@/types/presence';

interface FriendsListProps {
  friends: any[];
  currentUserId: string;
  webRTCManager: any;
  directMessages: DecryptedMessage[];
  onNewMessage: (message: DecryptedMessage) => void;
  onStartChat: (userId: string) => void;
  userProfiles: Record<string, {username: string | null, avatar_url: string | null}>;
  userPresence?: Record<string, UserPresence>; 
}

export const FriendsList: React.FC<FriendsListProps> = ({
  friends,
  currentUserId,
  webRTCManager,
  directMessages,
  onNewMessage,
  onStartChat,
  userProfiles,
  userPresence = {}
}) => {
  if (!friends || friends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
        <div className="w-20 h-20 rounded-full bg-cyberdark-800 flex items-center justify-center">
          <svg className="w-10 h-10 text-cyberdark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-cybergold-300">Ingen venner ennå</h3>
        <p className="text-center text-sm text-cyberdark-300">
          Du har ikke lagt til noen venner ennå. Når du legger til venner, vil de vises her.
        </p>
        <button 
          className="px-4 py-2 bg-cyberblue-600 text-white rounded hover:bg-cyberblue-700 transition"
        >
          Legg til venner
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      <h3 className="text-lg font-medium text-cybergold-300 px-2 mb-4">Mine venner</h3>
      {friends.map(friend => {
        const friendId = friend.user_id;
        const profile = userProfiles[friendId] || {};
        const isOnline = userPresence && userPresence[friendId]?.status === 'online';
        
        return (
          <div 
            key={friendId}
            onClick={() => onStartChat(friendId)}
            className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-cyberdark-800/50 transition-colors"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-cyberdark-700 overflow-hidden border border-cybergold-500/20">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.username || 'Friend'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-cybergold-300">
                    {(profile.username || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-cyberdark-900 ${isOnline ? 'bg-green-500' : 'bg-cyberdark-400'}`}></div>
            </div>
            <div className="ml-3">
              <div className="font-medium text-cybergold-200">{profile.username || 'Ukjent bruker'}</div>
              <div className="text-xs text-cyberdark-300">
                {isOnline ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
