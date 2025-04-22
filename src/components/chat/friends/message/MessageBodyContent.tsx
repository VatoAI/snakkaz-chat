
import { DecryptedMessage } from "@/types/message";
import { MessageContentDisplay } from "@/components/message/message-item/MessageContentDisplay";
import { MessageMetadata } from "@/components/message/message-item/MessageMetadata";
import { MessageMedia } from "@/components/message/MessageMedia";
import { UserStatus } from "@/types/presence";

interface MessageBodyContentProps {
  message: DecryptedMessage;
  isCurrentUser: boolean;
  isMessageRead?: (messageId: string) => boolean;
  usingServerFallback: boolean;
  userStatus?: UserStatus;
  onMessageExpired?: (messageId: string) => void;
}

export const MessageBodyContent = ({
  message,
  isCurrentUser,
  isMessageRead,
  usingServerFallback,
  userStatus,
  onMessageExpired
}: MessageBodyContentProps) => {
  return (
    <div className="space-y-2">
      <MessageContentDisplay message={message} />
      
      {message.media_url && (
        <MessageMedia 
          message={message} 
          onMediaExpired={() => onMessageExpired?.(message.id)} 
        />
      )}
      
      <div className="flex items-center gap-2 mt-1">
        <MessageMetadata 
          message={message}
          isMessageRead={isMessageRead}
          isCurrentUser={isCurrentUser}
          usingServerFallback={usingServerFallback}
          userStatus={userStatus}
        />
      </div>
    </div>
  );
};
