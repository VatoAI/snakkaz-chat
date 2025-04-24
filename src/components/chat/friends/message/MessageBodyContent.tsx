import { DecryptedMessage } from "@/types/message";
import { UserStatus } from "@/types/presence";
import { SecurityLevel } from "@/types/security";
import { MessageMedia } from "@/components/message/MessageMedia";

export interface MessageBodyContentProps {
  message: DecryptedMessage;
  isCurrentUser: boolean;
  isMessageRead?: (messageId: string) => boolean;
  usingServerFallback: boolean;
  userStatus?: UserStatus;
  onMessageExpired?: (messageId: string) => void;
  securityLevel?: SecurityLevel;
}

export const MessageBodyContent = ({
  message,
  isCurrentUser,
  isMessageRead,
  usingServerFallback,
  userStatus,
  onMessageExpired,
  securityLevel = 'server_e2ee'
}: MessageBodyContentProps) => {
  if (message.is_deleted) {
    return (
      <div className="text-gray-400 italic">
        Denne meldingen er slettet
      </div>
    );
  }

  const hasContent = message.content && message.content.trim() !== '';
  const hasMedia = !!message.media_url;

  return (
    <div className="message-content">
      {/* Vis meldingsinnhold hvis det finnes */}
      {hasContent && (
        <div className={`break-words ${hasMedia ? 'mb-2' : ''}`}>
          {message.content}
          {message.is_edited && (
            <span className="text-[10px] text-cyberdark-400 ml-1">(redigert)</span>
          )}
        </div>
      )}
      
      {/* Vis media hvis det finnes */}
      {hasMedia && (
        <div className={`${!hasContent ? 'mt-1' : ''}`}>
          <MessageMedia 
            message={message} 
            onMediaExpired={() => onMessageExpired && onMessageExpired(message.id)} 
          />
        </div>
      )}
      
      {/* Vis tidspunkt og lesebekreftelse */}
      <div className="flex justify-end items-center mt-1 gap-1 text-xs text-gray-400">
        <span>
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
        {isCurrentUser && isMessageRead && isMessageRead(message.id) && (
          <span className="text-green-500">✓</span>
        )}
      </div>
    </div>
  );
};
