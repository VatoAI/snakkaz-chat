
import { MessageList } from '@/components/message-list/MessageList';
import { DecryptedMessage } from "@/types/message";

interface AIMessageListProps {
  messages: DecryptedMessage[];
  currentUserId: string;
}

export const AIMessageList = ({ messages, currentUserId }: AIMessageListProps) => {
  return (
    <MessageList 
      messages={messages}
      currentUserId={currentUserId}
      onMessageExpired={() => {}}
      onEditMessage={() => {}}
      onDeleteMessage={() => {}}
    />
  );
};
