
import { DecryptedMessage } from "@/types/message";
import { Friend } from "./types";
import { WebRTCManager } from "@/utils/webrtc";
import { DirectMessageList } from "./DirectMessageList";
import { DirectMessageForm } from "./DirectMessageForm";
import { DirectMessageHeader } from "./DirectMessageHeader";
import { ChatGlassPanel } from "../ChatGlassPanel";
import { useState } from "react";
import { FormEvent } from "react";
import { SecurityLevel } from "@/types/security";

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
  // Add necessary state for DirectMessageForm compatibility
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>("p2p_e2ee");
  const [connectionState, setConnectionState] = useState("connected");
  const [dataChannelState, setDataChannelState] = useState("open");
  const [usingServerFallback, setUsingServerFallback] = useState(false);
  
  // Map to only relevant direct messages
  const directMessages = messages.filter(
    msg =>
      (msg.sender.id === currentUserId && msg.receiver_id === friend.user_id) ||
      (msg.sender.id === friend.user_id && msg.receiver_id === currentUserId)
  );

  // Create adapter function to bridge the type differences
  const handleSendMessage = async (e: FormEvent, text: string): Promise<boolean> => {
    e.preventDefault();
    
    // Create a simplified message object to pass to onNewMessage
    const message: DecryptedMessage = {
      id: crypto.randomUUID(),
      content: text,
      sender: {
        id: currentUserId,
        username: userProfiles[currentUserId]?.username || null,
        full_name: null
      },
      receiver_id: friend.user_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      encryption_key: "",
      iv: "",
    };
    
    onNewMessage(message);
    setNewMessage("");
    return Promise.resolve(true);
  };

  // Extract username and avatar from profiles for header
  const username = friend.profile?.username || userProfiles[friend.user_id]?.username || "User";
  const avatarUrl = friend.profile?.avatar_url || userProfiles[friend.user_id]?.avatar_url;

  // NB! Her skal det ikke legges til ny business logic, kun stilendringer
  return (
    <div className="flex flex-col h-full w-full bg-cyberdark-950">
      <DirectMessageHeader
        friend={friend}
        username={username}
        avatarUrl={avatarUrl}
        connectionState={connectionState}
        dataChannelState={dataChannelState}
        usingServerFallback={usingServerFallback}
        connectionAttempts={0}
        onBack={onBack}
        onReconnect={() => {}}
        securityLevel={securityLevel}
        setSecurityLevel={setSecurityLevel}
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
            usingServerFallback={usingServerFallback}
            sendError={null}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            newMessage={newMessage}
            onChangeMessage={setNewMessage}
            connectionState={connectionState}
            dataChannelState={dataChannelState}
            editingMessage={null}
            onCancelEdit={() => {}}
            securityLevel={securityLevel}
          />
        </ChatGlassPanel>
      </div>
    </div>
  );
};
