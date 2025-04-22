
import { DecryptedMessage } from "@/types/message";
import { MessageContentDisplay } from "@/components/message/message-item/MessageContentDisplay";
import { MessageMetadata } from "@/components/message/message-item/MessageMetadata";
import { MessageActionsMenu } from "@/components/message/message-item/MessageActionsMenu";
import { UserStatus } from "@/types/presence";
import { StatusIcon } from "@/components/online-users/StatusIcons";

interface MessageItemProps {
  message: DecryptedMessage;
  isCurrentUser: boolean;
  isMessageRead?: (messageId: string) => boolean;
  usingServerFallback: boolean;
  onEditMessage?: (message: DecryptedMessage) => void;
  onDeleteMessage?: (messageId: string) => void;
  userStatus?: UserStatus;
}

export const MessageItem = ({
  message,
  isCurrentUser,
  isMessageRead,
  usingServerFallback,
  onEditMessage,
  onDeleteMessage,
  userStatus
}: MessageItemProps) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} my-2`}>
      <div className="group relative max-w-[85%] sm:max-w-[75%]">
        <div className={`
          p-3 rounded-2xl shadow-lg transition-all duration-300
          ${isCurrentUser 
            ? 'bg-gradient-to-br from-cyberblue-600/90 to-cyberblue-800/90 text-white border border-cyberblue-400/20' 
            : 'bg-gradient-to-br from-cyberdark-800/95 to-cyberdark-900/95 text-cybergold-200 border border-cybergold-500/20'
          } 
          ${message.is_deleted ? 'opacity-50 italic' : ''}
          backdrop-blur-sm hover:shadow-neon-blue/10
        `}>
          <div className="flex items-center gap-2 mb-2">
            {userStatus && (
              <StatusIcon status={userStatus} size={3} className="mt-0.5" />
            )}
            <span className="text-sm font-medium">
              {message.sender.username || message.sender.id.substring(0, 8)}
            </span>
          </div>
          
          <MessageContentDisplay message={message} />
          
          <MessageMetadata 
            message={message}
            isMessageRead={isMessageRead}
            isCurrentUser={isCurrentUser}
            usingServerFallback={usingServerFallback}
          />
        </div>
        
        {isCurrentUser && !message.is_deleted && (
          <MessageActionsMenu 
            message={message}
            onEditMessage={onEditMessage}
            onDeleteMessage={onDeleteMessage}
          />
        )}
      </div>
    </div>
  );
};
