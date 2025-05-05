
import React from 'react';
import { DecryptedMessage } from '@/types/message';
import { WebRTCManager } from '@/utils/webrtc';

interface DirectMessageProps {
  friend: any; // Using any for now to fix the immediate error
  currentUserId: string;
  webRTCManager: WebRTCManager | null;
  onBack: () => void;
  messages: DecryptedMessage[];
  onNewMessage: (message: DecryptedMessage) => void;
  userProfiles?: Record<string, any>;
}

export const DirectMessage: React.FC<DirectMessageProps> = ({
  friend,
  currentUserId,
  webRTCManager,
  onBack,
  messages,
  onNewMessage,
  userProfiles = {}
}) => {
  // This is a stub implementation to fix the TypeScript error
  // Replace with the actual implementation as needed
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-cyberdark-800 flex items-center">
        <button 
          onClick={onBack}
          className="mr-2 text-cybergold-400 hover:text-cybergold-300"
        >
          ← Back
        </button>
        <h2 className="text-lg font-semibold text-cybergold-400">
          {friend?.profile?.username || "Chat"}
        </h2>
      </div>
      <div className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-cybergold-500">Ingen meldinger enda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(message => (
              <div key={message.id} className="p-2">
                {message.content}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
