
import { DecryptedMessage } from "@/types/message";

interface MessageContentDisplayProps {
  message: DecryptedMessage;
}

export const MessageContentDisplay = ({ message }: MessageContentDisplayProps) => {
  const isDeleted = message.is_deleted;

  return (
    <p className={isDeleted ? 'opacity-50 italic' : ''}>
      {isDeleted ? "Denne meldingen er slettet" : message.content}
    </p>
  );
};
