
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
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className="group relative">
        <div className={`
          max-w-[80%] p-3 rounded-lg border transition-all duration-300
          ${isCurrentUser 
            ? 'bg-gradient-to-r from-cyberblue-900/90 via-cyberblue-800/80 to-cyberblue-900/90 border-cyberblue-500/20 text-cyberblue-100 shadow-neon-blue hover:shadow-neon-dual' 
            : 'bg-gradient-to-r from-cyberdark-800/90 via-cyberdark-700/80 to-cyberdark-800/90 border-cyberred-500/20 text-cybergold-200 shadow-neon-red hover:shadow-neon-dual'
          } 
          ${message.is_deleted ? 'opacity-50 italic' : ''}
          backdrop-blur-sm
        `}>
          <div className="flex items-center gap-2 mb-1">
            {userStatus && (
              <StatusIcon status={userStatus} size={3} />
            )}
            <span className="font-medium">
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
        
        {isCurrentUser && (
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
