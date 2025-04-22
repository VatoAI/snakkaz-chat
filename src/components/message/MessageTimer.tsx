
import { useState, useEffect } from "react";
import { Timer } from "lucide-react";
import { DecryptedMessage } from "@/types/message";

interface MessageTimerProps {
  message: DecryptedMessage;
  onExpired?: (messageId: string) => void;
}

export const MessageTimer = ({ message, onExpired }: MessageTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  
  // Ensure all messages have the 24-hour TTL
  const messageTtl = message.ephemeral_ttl || 86400; // Default to 24 hours in seconds

  useEffect(() => {
    const calculateTimeLeft = () => {
      const createdAt = new Date(message.created_at).getTime();
      const expiresAt = createdAt + (messageTtl * 1000);
      const now = new Date().getTime();
      const difference = expiresAt - now;
      
      return difference > 0 ? Math.ceil(difference / 1000) : 0;
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(timer);
        if (onExpired) {
          onExpired(message.id);
        }
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [message.created_at, messageTtl, onExpired, message.id]);

  if (timeLeft === null) return null;
  if (timeLeft <= 0) return null;

  // Format the display based on time remaining
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  
  let timeString = '';
  
  if (hours > 0) {
    timeString = `${hours}t ${minutes}m`;
  } else if (minutes > 0) {
    timeString = `${minutes}m ${seconds}s`;
  } else {
    timeString = `${seconds}s`;
  }

  return (
    <div className="flex items-center gap-1 text-xs text-cybergold-300">
      <Timer className="w-3 h-3 text-cyberblue-400" />
      <span className="font-medium">{timeString}</span>
    </div>
  );
};
