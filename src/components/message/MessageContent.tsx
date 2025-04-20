
import { useRef, useEffect } from "react";
import { DecryptedMessage } from "@/types/message";
import { MessageMedia } from "./MessageMedia";
import { MessageTimer } from "./MessageTimer";
import { applyAntiCopyProtection } from "@/utils/security/screenshot-prevention";

interface MessageContentProps {
  message: DecryptedMessage;
  onMessageExpired: (messageId: string) => void;
}

export const MessageContent = ({ message, onMessageExpired }: MessageContentProps) => {
  const contentRef = useRef<HTMLParagraphElement>(null);
  
  // Apply anti-copy protection to sensitive content
  useEffect(() => {
    if (message.media_url && contentRef.current) {
      applyAntiCopyProtection(contentRef.current);
    }
  }, [message.media_url]);

  if (message.is_deleted) {
    return (
      <p className="text-cyberdark-400 italic text-xs sm:text-sm">
        Denne meldingen ble slettet
      </p>
    );
  }

  return (
    <>
      <p ref={contentRef} className="text-cyberblue-100 text-xs sm:text-sm break-words">
        {message.content}
        {message.is_edited && (
          <span className="text-[10px] text-cyberdark-400 ml-1">(redigert)</span>
        )}
      </p>
      <MessageMedia message={message} />
      <div className="flex items-center gap-2 mt-1">
        <p className="text-[10px] sm:text-xs text-cyberdark-400 group-hover:text-cyberdark-300">
          {new Date(message.created_at).toLocaleString()}
        </p>
        <MessageTimer 
          message={message} 
          onExpired={() => onMessageExpired(message.id)} 
        />
      </div>
    </>
  );
};
