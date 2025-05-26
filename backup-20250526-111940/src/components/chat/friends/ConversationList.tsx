
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Friend } from "@/components/chat/friends/types";
import { supabase } from "@/integrations/supabase/client";

interface ConversationListProps {
  conversations: Array<[string, any[]]>;
  userProfiles: Record<string, { username: string | null; avatar_url: string | null }>;
  currentUserId: string;
  setSelectedConversation: (friend: Friend) => void;
  searchQuery: string;
}

export const ConversationList = ({
  conversations,
  userProfiles,
  currentUserId,
  setSelectedConversation,
  searchQuery
}: ConversationListProps) => {
  const filteredConversations = conversations.filter(([partnerId]) => {
    const profile = userProfiles[partnerId];
    if (!searchQuery) return true;
    return profile?.username?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    filteredConversations.length > 0 ? (
      <div>
        <h3 className="text-sm font-medium text-cybergold-400 mb-2">Direkte meldinger</h3>
        <div className="space-y-2">
          {filteredConversations.map(([partnerId, messages]) => {
            const profile = userProfiles[partnerId];
            const lastMessage = messages[messages.length - 1];
            const isRecentMessage =
              new Date().getTime() - new Date(lastMessage.created_at).getTime() < 300000;

            return (
              <div
                key={partnerId}
                className="flex items-center justify-between p-3 bg-cyberdark-800 border border-cybergold-500/30 rounded-md hover:bg-cyberdark-700 transition-colors cursor-pointer"
                onClick={() =>
                  setSelectedConversation({
                    id: "",
                    user_id: partnerId,
                    friend_id: currentUserId,
                    status: "accepted",
                    created_at: "",
                    profile: profile
                      ? {
                          id: partnerId,
                          username: profile.username,
                          avatar_url: profile.avatar_url,
                          full_name: null
                        }
                      : undefined
                  })
                }
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10 border-2 border-cybergold-500/20">
                      {profile?.avatar_url ? (
                        <AvatarImage
                          src={supabase.storage.from("avatars").getPublicUrl(profile.avatar_url).data.publicUrl}
                          alt={profile.username || "User"}
                        />
                      ) : (
                        <AvatarFallback className="bg-cybergold-500/20 text-cybergold-300">
                          {(profile?.username || "U")[0].toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {isRecentMessage && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-cyberdark-800"></span>
                    )}
                  </div>
                  <div>
                    <p className="text-cybergold-200 font-medium">{profile?.username || "Ukjent bruker"}</p>
                    <p className="text-xs text-cybergold-400 truncate max-w-[200px]">
                      {lastMessage.sender.id === currentUserId ? "Du: " : ""}
                      {lastMessage.content}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-600"
                >
                  <MessageSquare className="w-5 h-5" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    ) : null
  );
};
