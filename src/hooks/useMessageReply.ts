import { useContext } from 'react';
import { MessageReplyContext } from '../contexts/MessageReplyContext';

export const useMessageReply = () => {
  const context = useContext(MessageReplyContext);
  
  if (context === undefined) {
    throw new Error('useMessageReply må brukes innenfor en MessageReplyProvider');
  }
  
  return context;
};