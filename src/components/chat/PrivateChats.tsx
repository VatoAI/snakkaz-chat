
import { useState } from "react";
import { MessageSquare, Search, Users, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DirectMessage } from "@/components/chat/friends/DirectMessage";
import { GroupChat } from "@/components/chat/groups/GroupChat";
import { GroupChatCreator } from "@/components/chat/security/GroupChatCreator";
import { Friend } from "@/components/chat/friends/types";
import { Group } from "@/types/group";
import { DecryptedMessage } from "@/types/message";
import { WebRTCManager } from "@/utils/webrtc";
import { SecurityLevel } from "@/types/security";
import { supabase } from "@/integrations/supabase/client";

interface PrivateChatsProps {
  currentUserId: string;
  webRTCManager: WebRTCManager | null;
  directMessages: DecryptedMessage[];
  onNewMessage: (message: DecryptedMessage) => void;
  onStartChat: (userId: string) => void;
  userProfiles: Record<string, {username: string | null, avatar_url: string | null}>;
  friendsList?: string[];
}

export const PrivateChats = ({
  currentUserId,
  webRTCManager,
  directMessages,
  onNewMessage,
  onStartChat,
  userProfiles,
  friendsList = []
}: PrivateChatsProps) => {
  const [selectedConversation, setSelectedConversation] = useState<Friend | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGroupCreatorOpen, setIsGroupCreatorOpen] = useState(false);
  
  // Mock groups - in a real app, this would come from a database
  const [groups, setGroups] = useState<Group[]>([
    {
      id: "group-1",
      name: "Demo Gruppe",
      created_at: new Date().toISOString(),
      creator_id: currentUserId,
      security_level: 'server_e2ee' as SecurityLevel,
      members: [
        {
          id: "member-1",
          user_id: currentUserId,
          group_id: "group-1",
          role: "admin",
          joined_at: new Date().toISOString()
        }
      ]
    }
  ]);

  // Group messages by conversation partner
  const conversations = directMessages.reduce((acc, message) => {
    // Skip group messages
    if (message.group_id) return acc;
    
    const partnerId = message.sender.id === currentUserId ? message.receiver_id : message.sender.id;
    if (!partnerId) return acc;
    
    if (!acc[partnerId]) {
      acc[partnerId] = [];
    }
    acc[partnerId].push(message);
    return acc;
  }, {} as Record<string, DecryptedMessage[]>);

  // Group messages by group
  const groupConversations = directMessages.reduce((acc, message) => {
    // Skip direct messages
    if (!message.group_id) return acc;
    
    const groupId = message.group_id;
    
    // Make sure groupId is a string before using it as an index
    if (typeof groupId !== 'string') return acc;
    
    if (!acc[groupId]) {
      acc[groupId] = [];
    }
    acc[groupId].push(message);
    return acc;
  }, {} as Record<string, DecryptedMessage[]>);

  // Sort conversations by most recent message
  const sortedConversations = Object.entries(conversations)
    .sort(([, a], [, b]) => {
      const lastA = a[a.length - 1];
      const lastB = b[b.length - 1];
      return new Date(lastB.created_at).getTime() - new Date(lastA.created_at).getTime();
    });
    
  // Sort group conversations
  const sortedGroupConversations = Object.entries(groupConversations)
    .sort(([, a], [, b]) => {
      const lastA = a[a.length - 1];
      const lastB = b[b.length - 1];
      return new Date(lastB.created_at).getTime() - new Date(lastA.created_at).getTime();
    });

  const filteredConversations = sortedConversations.filter(([partnerId]) => {
    const profile = userProfiles[partnerId];
    if (!searchQuery) return true;
    return profile?.username?.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  const filteredGroups = groups.filter(group => {
    if (!searchQuery) return true;
    return group.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleCreateGroup = (name: string, members: string[], securityLevel: SecurityLevel) => {
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name,
      created_at: new Date().toISOString(),
      creator_id: currentUserId,
      security_level: securityLevel,
      members: [
        {
          id: `member-${currentUserId}`,
          user_id: currentUserId,
          group_id: `group-${Date.now()}`,
          role: "admin",
          joined_at: new Date().toISOString()
        },
        ...members.map(memberId => ({
          id: `member-${memberId}`,
          user_id: memberId,
          group_id: `group-${Date.now()}`,
          role: "member" as 'member' | 'admin',
          joined_at: new Date().toISOString()
        }))
      ]
    };
    
    setGroups([...groups, newGroup]);
    setSelectedGroup(newGroup);
  };

  if (selectedConversation) {
    return (
      <DirectMessage
        friend={selectedConversation}
        currentUserId={currentUserId}
        webRTCManager={webRTCManager}
        onBack={() => setSelectedConversation(null)}
        messages={directMessages}
        onNewMessage={onNewMessage}
        userProfiles={userProfiles}
      />
    );
  }
  
  if (selectedGroup) {
    return (
      <GroupChat
        group={selectedGroup}
        currentUserId={currentUserId}
        webRTCManager={webRTCManager}
        onBack={() => setSelectedGroup(null)}
        messages={directMessages}
        onNewMessage={onNewMessage}
        userProfiles={userProfiles}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-cybergold-500/30">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-cybergold-300">Private samtaler</h2>
          <Button
            variant="outline"
            size="sm"
            className="border-cybergold-500/30 text-cybergold-300 hover:bg-cyberdark-800 flex items-center gap-1"
            onClick={() => setIsGroupCreatorOpen(true)}
          >
            <Users className="h-4 w-4" />
            <span>Ny gruppe</span>
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyberdark-400" />
          <input
            type="text"
            placeholder="Søk i samtaler..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-cyberdark-800 border border-cybergold-500/30 rounded-md text-cybergold-200 placeholder:text-cyberdark-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {filteredGroups.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-cybergold-400 mb-2">Grupper</h3>
            <div className="space-y-2">
              {filteredGroups.map(group => {
                const groupMessages = groupConversations[group.id] || [];
                const lastMessage = groupMessages.length > 0 ? groupMessages[groupMessages.length - 1] : null;
                const isRecentMessage = lastMessage && (new Date().getTime() - new Date(lastMessage.created_at).getTime() < 300000); // 5 minutes
                
                return (
                  <div
                    key={group.id}
                    className="flex items-center justify-between p-3 bg-cyberdark-800 border border-cybergold-500/30 rounded-md hover:bg-cyberdark-700 transition-colors cursor-pointer"
                    onClick={() => setSelectedGroup(group)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10 border-2 border-cybergold-500/20 bg-cyberdark-700">
                          <AvatarFallback className="bg-cybergold-500/20 text-cybergold-300">
                            <Users className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        {isRecentMessage && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-cyberdark-800"></span>
                        )}
                      </div>
                      <div>
                        <p className="text-cybergold-200 font-medium flex items-center">
                          {group.name}
                        </p>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-600"
                    >
                      <Users className="w-5 h-5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {filteredConversations.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-cybergold-400 mb-2">Direkte meldinger</h3>
            <div className="space-y-2">
              {filteredConversations.map(([partnerId, messages]) => {
                const profile = userProfiles[partnerId];
                const lastMessage = messages[messages.length - 1];
                const isRecentMessage = new Date().getTime() - new Date(lastMessage.created_at).getTime() < 300000; // 5 minutes

                return (
                  <div
                    key={partnerId}
                    className="flex items-center justify-between p-3 bg-cyberdark-800 border border-cybergold-500/30 rounded-md hover:bg-cyberdark-700 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedConversation({
                        id: '',
                        user_id: partnerId,
                        friend_id: currentUserId,
                        status: 'accepted',
                        created_at: '',
                        profile: profile ? {
                          id: partnerId,
                          username: profile.username,
                          avatar_url: profile.avatar_url,
                          full_name: null
                        } : undefined
                      });
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10 border-2 border-cybergold-500/20">
                          {profile?.avatar_url ? (
                            <AvatarImage 
                              src={supabase.storage.from('avatars').getPublicUrl(profile.avatar_url).data.publicUrl} 
                              alt={profile.username || 'User'}
                            />
                          ) : (
                            <AvatarFallback className="bg-cybergold-500/20 text-cybergold-300">
                              {(profile?.username || 'U')[0].toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        {isRecentMessage && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-cyberdark-800"></span>
                        )}
                      </div>
                      <div>
                        <p className="text-cybergold-200 font-medium">
                          {profile?.username || 'Ukjent bruker'}
                        </p>
                        <p className="text-xs text-cybergold-400 truncate max-w-[200px]">
                          {lastMessage.sender.id === currentUserId ? 'Du: ' : ''}
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
        )}

        {filteredConversations.length === 0 && filteredGroups.length === 0 && (
          <div className="text-center text-cybergold-500 py-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-cybergold-400/50" />
            <p className="text-lg font-medium">Ingen samtaler ennå</p>
            <p className="text-sm mt-1">Gå til Venner-fanen for å starte en ny chat</p>
          </div>
        )}
      </div>
      
      <GroupChatCreator
        isOpen={isGroupCreatorOpen}
        onClose={() => setIsGroupCreatorOpen(false)}
        onCreateGroup={handleCreateGroup}
        currentUserId={currentUserId}
        userProfiles={userProfiles}
        friendsList={friendsList}
      />
    </div>
  );
};
