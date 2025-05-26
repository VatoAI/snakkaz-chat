import { DecryptedMessage } from "@/types/message";
import { useEffect, useState, memo } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlertTriangle } from "lucide-react";

interface MessageContentDisplayProps {
  message: DecryptedMessage;
}

export const MessageContentDisplay = memo(({ message }: MessageContentDisplayProps) => {
  const isMobile = useIsMobile();
  const { notify } = useNotifications();
  const [renderError, setRenderError] = useState<string | null>(null);
  
  // Every useEffect must be called regardless of conditions
  useEffect(() => {
    if (!message) return;
    
    const isDeleted = message.is_deleted;
    
    try {
      if (!isDeleted && message.created_at) {
        const messageDate = new Date(message.created_at);
        const now = new Date();
        const isNewMessage = now.getTime() - messageDate.getTime() < 1000;

        if (isNewMessage) {
          notify("Ny melding", {
            body: isDeleted ? "Denne meldingen ble slettet" : message.content,
            icon: "/snakkaz-logo.png"
          });
        }
      }
    } catch (error) {
      console.error("Error in notification effect:", error);
    }
  }, [message, notify]);

  // Reset error state on message change
  useEffect(() => {
    if (!message) return;
    setRenderError(null);
  }, [message]);
  
  // Handle missing or invalid message gracefully
  if (!message) {
    return <div className="h-4"></div>;
  }

  const isDeleted = message.is_deleted;

  if (renderError) {
    return (
      <div className="text-cyberred-400 flex items-center gap-2 text-sm">
        <AlertTriangle className="h-4 w-4" />
        <span>Kunne ikke vise meldingen</span>
      </div>
    );
  }

  try {
    return (
      <p className={`
        ${isDeleted ? 'opacity-50 italic' : 'animate-fadeIn'}
        transition-all duration-300
      `}>
        {isDeleted ? "Denne meldingen er slettet" : message.content}
      </p>
    );
  } catch (error) {
    console.error("Error rendering message content:", error);
    setRenderError("Render error");
    return (
      <div className="text-cyberred-400 flex items-center gap-2 text-sm">
        <AlertTriangle className="h-4 w-4" />
        <span>Kunne ikke vise meldingen</span>
      </div>
    );
  }
});

MessageContentDisplay.displayName = 'MessageContentDisplay';
