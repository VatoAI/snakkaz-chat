import React, { createContext, useState } from 'react';
import { DecryptedMessage } from '@/types/message';

interface MessageReplyContextType {
  /** Meldingen som brukeren svarer på */
  replyToMessage: DecryptedMessage | null;
  /** Setter melding å svare på */
  setReplyToMessage: React.Dispatch<React.SetStateAction<DecryptedMessage | null>>;
  /** Fjern svar (nullstiller replyToMessage) */
  clearReply: () => void;
}

const MessageReplyContext = createContext<MessageReplyContextType | undefined>(undefined);

export const MessageReplyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [replyToMessage, setReplyToMessage] = useState<DecryptedMessage | null>(null);

  const clearReply = () => setReplyToMessage(null);

  return (
    <MessageReplyContext.Provider value={{ replyToMessage, setReplyToMessage, clearReply }}>
      {children}
    </MessageReplyContext.Provider>
  );
};

export { MessageReplyContext };