import React, { useState, useEffect } from 'react';
import { MessageInput } from '@/components/MessageInput';
import { GroupMessageList, GroupMessage } from '@/components/chat/GroupMessageList';
import { ArrowLeft, PhoneCall, VideoIcon, InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { WebRTCManager } from '@/utils/webrtc';
import { DecryptedMessage } from '@/types/message.d';
import { GroupMessage } from '@/types/group';
import { getInitials } from '@/utils/user';

interface DirectMessageProps {
  friend: {
    friend_id: string;
    profile?: {
      username?: string | null;
      full_name?: string | null;
      avatar_url?: string | null;
    };
  };
  currentUserId: string;
  webRTCManager: WebRTCManager;
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
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Format messages for GroupMessageList component, but use type assertion to satisfy TypeScript
  const formattedMessages: GroupMessage[] = messages.map(message => ({
    id: message.id,
    content: message.content,
    sender_id: message.sender?.id || message.sender_id, 
    group_id: message.group_id,
    created_at: message.created_at || new Date().toISOString(),
    is_deleted: message.is_deleted,
    is_edited: message.is_edited,
    isPending: message.isPending,
    hasError: message.hasError,
    // Add other fields as needed
  }));
  
  const friendUsername = friend?.profile?.username || userProfiles[friend?.friend_id]?.username || 'Unknown User';
  const friendAvatar = friend?.profile?.avatar_url || userProfiles[friend?.friend_id]?.avatar_url;
  
  const handleSendMessage = async (text: string, attachments?: File[]) => {
    if (!text.trim() && (!attachments || attachments.length === 0)) return;
    
    try {
      setIsSending(true);
      
      // In a real implementation, this would send to an API
      // For now, we'll just add to the local messages list
      const newMsg: DecryptedMessage = {
        id: `temp-${Date.now()}`,
        content: text,
        sender: {
          id: currentUserId,
          username: userProfiles[currentUserId]?.username || 'You',
          full_name: userProfiles[currentUserId]?.full_name || null,
          avatar_url: userProfiles[currentUserId]?.avatar_url || null
        },
        created_at: new Date().toISOString(),
        isPending: true
      };
      
      onNewMessage(newMsg);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-cyberdark-950">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-cyberdark-800 bg-cyberdark-900/80">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mr-2 text-cybergold-400 hover:bg-cyberdark-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-8 w-8 mr-2">
          {friendAvatar ? (
            <AvatarImage src={friendAvatar} alt={friendUsername} />
          ) : (
            <AvatarFallback className="bg-cyberdark-700 text-cybergold-300">
              {getInitials(friendUsername)}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-medium text-cybergold-300">{friendUsername}</h3>
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-cybergold-400 hover:bg-cyberdark-800"
          >
            <PhoneCall className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-cybergold-400 hover:bg-cyberdark-800"
          >
            <VideoIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-cybergold-400 hover:bg-cyberdark-800"
          >
            <InfoIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <GroupMessageList
          messages={formattedMessages}
          isLoading={isLoading}
          userProfiles={userProfiles}
          currentUserId={currentUserId}
        />
      </div>
      
      {/* Input */}
      <div className="p-2 border-t border-cyberdark-800">
        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSendMessage={handleSendMessage}
          isLoading={isSending}
          placeholder={`Melding til ${friendUsername}...`}
        />
      </div>
    </div>
  );
};

export default DirectMessage;
