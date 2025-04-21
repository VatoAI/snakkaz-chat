
import { User } from "lucide-react";
import { DecryptedMessage } from "@/types/message";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { MessageBubble } from "./MessageBubble";

interface MessageGroupProps {
  messages: DecryptedMessage[];
  isCurrentUser: boolean;
  onMessageExpired: (messageId: string) => void;
  onEdit: (message: DecryptedMessage) => void;
  onDelete: (messageId: string) => void;
  isMobile?: boolean;
}

export const MessageGroup = ({ 
  messages, 
  isCurrentUser,
  onMessageExpired,
  onEdit,
  onDelete,
  isMobile = false
}: MessageGroupProps) => {
  console.log('Rendering MessageGroup:', { 
    messageCount: messages.length, 
    isCurrentUser, 
    firstMessageId: messages[0]?.id 
  });
  
  const firstMessage = messages[0];
  if (!firstMessage) {
    console.warn('MessageGroup received empty messages array');
    return null;
  }
  
  return (
    <div className="animate-fadeIn">
      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`flex items-start gap-x-2 sm:gap-x-3 max-w-[85%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <Avatar className="w-8 h-8 sm:w-10 sm:h-10 mt-1">
            {firstMessage.sender && firstMessage.sender.avatar_url ? (
              <AvatarImage 
                src={supabase.storage.from('avatars').getPublicUrl(firstMessage.sender.avatar_url).data.publicUrl} 
                alt={firstMessage.sender?.username || 'Avatar'} 
              />
            ) : (
              <AvatarFallback>
                <User className="w-4 h-4 text-cybergold-400" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="space-y-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-cybergold-300 mb-1">
              {firstMessage.sender?.full_name || firstMessage.sender?.username || 'Anonym'}
            </p>
            
            {messages.map((message, messageIndex) => (
              <MessageBubble
                key={message.id}
                message={message}
                isCurrentUser={isCurrentUser}
                messageIndex={messageIndex}
                onMessageExpired={onMessageExpired}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
