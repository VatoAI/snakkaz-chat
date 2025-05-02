
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Lock, MessageSquare } from "lucide-react";
import { Group, GroupMember } from "@/types/group";
import { supabase } from "@/integrations/supabase/client";

interface GroupListProps {
  groups: Group[];
  groupConversations: Record<string, any[]>;
  currentUserId: string;
  userProfiles: Record<string, { username: string | null; avatar_url: string | null }>;
  setSelectedGroup: (group: Group) => void;
  searchQuery: string;
}

export const GroupList = ({
  groups,
  groupConversations,
  currentUserId,
  userProfiles,
  setSelectedGroup,
  searchQuery
}: GroupListProps) => {
  const filteredGroups = groups.filter(group =>
    !searchQuery ||
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    filteredGroups.length > 0 ? (
      <div className="mb-4">
        <h3 className="text-sm font-medium text-cybergold-400 mb-2">Grupper</h3>
        <div className="space-y-2">
          {filteredGroups.map(group => {
            const groupMessages = groupConversations[group.id] || [];
            const lastMessage = groupMessages.length > 0 ? groupMessages[groupMessages.length - 1] : null;
            const isRecentMessage = lastMessage && (new Date().getTime() - new Date(lastMessage.created_at).getTime() < 300000); // 5 min

            return (
              <div
                key={group.id}
                className="flex items-center justify-between p-3 bg-cyberdark-800 border border-cybergold-500/30 rounded-md hover:bg-cyberdark-700 transition-colors cursor-pointer"
                onClick={() => setSelectedGroup(group)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10 border-2 border-cybergold-500/20 bg-cyberdark-700">
                      {(group.avatarUrl || group.avatar_url) ? (
                        <AvatarImage
                          src={supabase.storage.from('group_avatars').getPublicUrl(group.avatarUrl || group.avatar_url || '').data.publicUrl}
                          alt={group.name}
                        />
                      ) : (
                        <AvatarFallback className="bg-cybergold-500/20 text-cybergold-300">
                          <Users className="h-5 w-5" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {isRecentMessage && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-cyberdark-800"></span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-cybergold-200 font-medium">{group.name}</p>
                      {group.password && (
                        <Lock className="h-3.5 w-3.5 text-cybergold-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-cybergold-400 truncate max-w-[200px]">
                        {lastMessage ? (
                          <>
                            {lastMessage.sender.id === currentUserId ? 'Du: ' : `${lastMessage.sender.username}: `}
                            {lastMessage.content}
                          </>
                        ) : (
                          'Ingen meldinger ennå'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-cybergold-500 mr-2">
                    {Array.isArray(group.members)
                      ? group.members.length
                      : 0}{" "}
                    {Array.isArray(group.members) && group.members.length === 1
                      ? "medlem"
                      : "medlemmer"}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-600"
                  >
                    <Users className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ) : null
  );
};
