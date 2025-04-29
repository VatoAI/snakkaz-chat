
import React from "react";
import { UserPresence } from "@/types/presence";
import { DecryptedMessage } from "@/types/message";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus2, X } from "lucide-react";

interface GlobalChatHeaderProps {
    userPresence: Record<string, UserPresence>;
    directMessages?: DecryptedMessage[];
    showOnline: boolean;
    setShowOnline: (show: boolean) => void;
}

export const GlobalChatHeader = ({
    userPresence,
    directMessages,
    showOnline,
    setShowOnline
}: GlobalChatHeaderProps) => {
    const onlineCount = Object.values(userPresence).filter(p => p.online).length;

    return (
        <div className="flex items-center justify-between mb-2 p-2 border-b border-cyberdark-800">
            <div className="flex items-center gap-2">
                <h2 className="text-md font-medium">Global Chat</h2>
                <Badge variant="outline" className="bg-cybergold-500/20 text-cybergold-300">
                    {onlineCount} online
                </Badge>
            </div>
            <button 
                className="text-cyberdark-300 hover:text-cyberdark-100"
                onClick={() => setShowOnline(!showOnline)}
                aria-label={showOnline ? "Hide online users" : "Show online users"}
            >
                {showOnline ? <X size={18} /> : <Users size={18} />}
            </button>
        </div>
    );
};
