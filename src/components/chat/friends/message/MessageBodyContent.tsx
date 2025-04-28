import { DecryptedMessage } from "@/types/message";
import { UserStatus } from "@/types/presence";
import { SecurityLevel } from "@/types/security";
import { MessageMedia } from "@/components/message/MessageMedia";
import { cn } from "@/lib/utils";
import { sanitizeHtml, sanitizeText } from "@/utils/sanitize";
import { useEffect, useState } from "react";
import { processTextWithLinks } from "@/utils/textProcessor";

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
  // State for sanitized content
  const [sanitizedContent, setSanitizedContent] = useState<string>("");
  // State for processed content with links
  const [processedContent, setProcessedContent] = useState<React.ReactNode[]>([]);

  // Sanitize message content when the message changes
  useEffect(() => {
    if (message.content) {
      // Bruk sanitizeText for full sikkerhet
      const sanitized = sanitizeText(message.content);
      setSanitizedContent(sanitized);

      // Prosesser sanitert tekst for å konvertere URL-er til sikre lenker
      setProcessedContent(processTextWithLinks(sanitized));
    } else {
      setSanitizedContent("");
      setProcessedContent([]);
    }
  }, [message.content]);

  if (message.is_deleted) {
    return (
      <div className="text-cyberdark-400 italic">
        Denne meldingen er slettet
      </div>
    );
  }

  const hasContent = sanitizedContent && sanitizedContent.trim() !== '';
  const hasMedia = !!message.media_url;

  return (
    <div className="message-content">
      {hasContent && (
        <div className={cn(
          "break-words",
          hasMedia && "mb-2"
        )}>
          {/* Vis prosessert innhold med sikre lenker istedenfor bare tekst */}
          {processedContent}
          {message.is_edited && (
            <span className="text-[10px] text-cyberdark-400 ml-1">(redigert)</span>
          )}
        </div>
      )}

      {hasMedia && (
        <div className={cn(
          "rounded-lg overflow-hidden",
          !hasContent && "mt-1"
        )}>
          <MessageMedia
            message={message}
            onMediaExpired={() => onMessageExpired?.(message.id)}
          />
        </div>
      )}

      <div className="flex justify-end items-center mt-1 gap-1 text-xs text-cyberdark-400">
        <span>
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
        {isCurrentUser && isMessageRead && isMessageRead(message.id) && (
          <span className="text-cyberblue-400">✓</span>
        )}
      </div>
    </div>
  );
};
