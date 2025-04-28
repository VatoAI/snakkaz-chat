import { useState } from "react";
import { ChatMessages } from "./ChatMessages";
import { MessageInput } from "@/components/MessageInput";
import { DecryptedMessage } from "@/types/message";
import { UserPresence } from "@/types/presence";
import { GlobalChatHeader } from "./GlobalChatHeader";
import { cn } from "@/lib/utils";

interface GlobalTabProps {
    messages: DecryptedMessage[];
    newMessage: string;
    setNewMessage: (message: string) => void;
    isLoading: boolean;
    ttl: number | null;
    setTtl: (ttl: number) => void;
    onMessageExpired: (messageId: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    currentUserId: string | null;
    editingMessage: DecryptedMessage | null;
    onEditMessage: (message: DecryptedMessage) => void;
    onCancelEdit: () => void;
    onDeleteMessage: (messageId: string) => void;
    userPresence: Record<string, UserPresence>;
    directMessages: any[];

    // Pagination props
    loadMoreMessages?: () => Promise<void>;
    hasMoreMessages?: boolean;
    isLoadingMoreMessages?: boolean;
}

export const GlobalTab = ({
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    ttl,
    setTtl,
    onMessageExpired,
    onSubmit,
    currentUserId,
    editingMessage,
    onEditMessage,
    onCancelEdit,
    onDeleteMessage,
    userPresence,
    directMessages,
    loadMoreMessages,
    hasMoreMessages,
    isLoadingMoreMessages
}: GlobalTabProps) => {
    const [showOnline, setShowOnline] = useState(true);

    return (
        <div className="flex flex-col h-full">
            <GlobalChatHeader
                userPresence={userPresence}
                directMessages={directMessages}
                showOnline={showOnline}
                setShowOnline={setShowOnline}
            />

            <div className={cn("flex-1 overflow-hidden", !showOnline && "pt-4")}>
                <ChatMessages
                    messages={messages}
                    onMessageExpired={onMessageExpired}
                    currentUserId={currentUserId}
                    onEditMessage={onEditMessage}
                    onDeleteMessage={onDeleteMessage}
                    userPresence={userPresence}
                    loadMoreMessages={loadMoreMessages}
                    hasMoreMessages={hasMoreMessages}
                    isLoadingMoreMessages={isLoadingMoreMessages}
                />
            </div>

            <div className="pt-4 pb-6">
                <MessageInput
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    isLoading={isLoading}
                    ttl={ttl}
                    setTtl={setTtl}
                    onSubmit={onSubmit}
                    editingMessage={editingMessage}
                    onCancelEdit={onCancelEdit}
                />
            </div>
        </div>
    );
};