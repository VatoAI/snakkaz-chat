
import { DecryptedMessage } from "@/types/message";
import { useEffect } from "react";
import { showNotification, playNotificationSound } from "@/utils/sound-manager";
import { useIsMobile } from "@/hooks/use-mobile";

interface MessageContentDisplayProps {
  message: DecryptedMessage;
}

export const MessageContentDisplay = ({ message }: MessageContentDisplayProps) => {
  const isDeleted = message.is_deleted;
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isDeleted && message.created_at) {
      const messageDate = new Date(message.created_at);
      const now = new Date();
      const isNewMessage = now.getTime() - messageDate.getTime() < 1000;

      if (isNewMessage) {
        if (isMobile) {
          playNotificationSound();
        }
        showNotification("New Message", {
          body: isDeleted ? "Denne meldingen er slettet" : message.content,
          icon: "/snakkaz-logo.png"
        });
      }
    }
  }, [message.created_at, message.content, isDeleted, isMobile]);

  return (
    <p className={`
      ${isDeleted ? 'opacity-50 italic' : 'animate-fadeIn'}
      transition-all duration-300
    `}>
      {isDeleted ? "Denne meldingen er slettet" : message.content}
    </p>
  );
};
