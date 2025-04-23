
import { DecryptedMessage } from "@/types/message";

export function reduceConversations(
  directMessages: DecryptedMessage[],
  currentUserId: string
) {
  return directMessages.reduce((acc, message) => {
    if (message.group_id) return acc;

    const partnerId = message.sender.id === currentUserId ? message.receiver_id : message.sender.id;
    if (!partnerId) return acc;

    if (!acc[partnerId]) {
      acc[partnerId] = [];
    }
    acc[partnerId].push(message);
    return acc;
  }, {} as Record<string, DecryptedMessage[]>);
}

export function reduceGroupConversations(
  directMessages: DecryptedMessage[]
) {
  return directMessages.reduce((acc, message) => {
    if (!message.group_id) return acc;

    const groupId = message.group_id;

    if (typeof groupId !== 'string') return acc;

    if (!acc[groupId]) {
      acc[groupId] = [];
    }
    acc[groupId].push(message);
    return acc;
  }, {} as Record<string, DecryptedMessage[]>);
}
