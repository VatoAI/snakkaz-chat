
import { DecryptedMessage } from "@/types/message";
import { useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface MessageContentDisplayProps {
  message: DecryptedMessage;
}

export const MessageContentDisplay = ({ message }: MessageContentDisplayProps) => {
  const isDeleted = message.is_deleted;
  const isMobile = useIsMobile();
  const { notify } = useNotifications();

  useEffect(() => {
    if (!isDeleted && message.created_at) {
      const messageDate = new Date(message.created_at);
      const now = new Date();
      const isNewMessage = now.getTime() - messageDate.getTime() < 1000;

      if (isNewMessage) {
        notify("Ny melding", {
          body: isDeleted ? "Denne meldingen er slettet" : message.content,
          icon: "/snakkaz-logo.png"
        });
      }
    }
  }, [message.created_at, message.content, isDeleted, notify]);

  return (
    <p className={`
      ${isDeleted ? 'opacity-50 italic' : 'animate-fadeIn'}
      transition-all duration-300
    `}>
      {isDeleted ? "Denne meldingen er slettet" : message.content}
    </p>
  );
};
