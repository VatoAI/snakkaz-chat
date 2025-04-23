
import { DecryptedMessage } from "@/types/message";
import { Friend } from "./types";
import { WebRTCManager } from "@/utils/webrtc";
import { DirectMessageList } from "./DirectMessageList";
import { DirectMessageForm } from "./DirectMessageForm";
import { DirectMessageHeader } from "./DirectMessageHeader";
import { ChatGlassPanel } from "../ChatGlassPanel";

interface DirectMessageProps {
  friend: Friend;
  currentUserId: string;
  webRTCManager: WebRTCManager | null;
  onBack: () => void;
  messages: DecryptedMessage[];
  onNewMessage: (message: DecryptedMessage) => void;
  userProfiles: Record<string, {username: string | null, avatar_url: string | null}>;
}

export const DirectMessage = ({
  friend,
  currentUserId,
  webRTCManager,
  onBack,
  messages,
  onNewMessage,
  userProfiles
}: DirectMessageProps) => {
  // Map to only relevant direct messages
  const directMessages = messages.filter(
    msg =>
      (msg.sender.id === currentUserId && msg.receiver_id === friend.user_id) ||
      (msg.sender.id === friend.user_id && msg.receiver_id === currentUserId)
  );

  // NB! Her skal det ikke legges til ny business logic, kun stilendringer
  return (
    <div className="flex flex-col h-full w-full bg-cyberdark-950">
      <DirectMessageHeader
        friend={friend}
        currentUserId={currentUserId}
        userProfiles={userProfiles}
        onBack={onBack}
      />
      <div className="flex-1 flex flex-col min-h-0">
        <ChatGlassPanel className="flex-1 flex flex-col min-h-0">
          <DirectMessageList
            messages={directMessages}
            currentUserId={currentUserId}
          />
        </ChatGlassPanel>
      </div>
      <div className="w-full">
        <ChatGlassPanel className="rounded-b-2xl rounded-t-none shadow-neon-gold/10" noPadding>
          <DirectMessageForm
            currentUserId={currentUserId}
            friend={friend}
            onSendMessage={onNewMessage}
            webRTCManager={webRTCManager}
          />
        </ChatGlassPanel>
      </div>
    </div>
  );
};
