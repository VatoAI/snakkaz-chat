
import { useState, useEffect } from "react";
import { MessageSquare, Search, Users, Plus, Mail, Lock, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DirectMessage } from "@/components/chat/friends/DirectMessage";
import { GroupChat } from "@/components/chat/groups/GroupChat";
import { GroupChatCreator } from "@/components/chat/security/GroupChatCreator";
import { GroupPasswordDialog } from "@/components/chat/groups/GroupPasswordDialog";
import { GroupInviteDialog } from "@/components/chat/groups/GroupInviteDialog";
import { Friend } from "@/components/chat/friends/types";
import { Group, GroupInvite } from "@/types/group";
import { DecryptedMessage } from "@/types/message";
import { WebRTCManager } from "@/utils/webrtc";
import { SecurityLevel } from "@/types/security";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

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
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedPasswordGroup, setSelectedPasswordGroup] = useState<Group | null>(null);
  const [groupInvites, setGroupInvites] = useState<GroupInvite[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const { toast } = useToast();
  
  // Fetch groups the user is a member of
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data: memberData, error: memberError } = await supabase
          .from('group_members')
          .select('group_id')
          .eq('user_id', currentUserId);
          
        if (memberError) throw memberError;
        
        if (memberData && memberData.length > 0) {
          const groupIds = memberData.map(m => m.group_id);
          
          const { data: groupsData, error: groupsError } = await supabase
            .from('groups')
            .select('id, name, created_at, creator_id, security_level, password, avatar_url')
            .in('id', groupIds);
            
          if (groupsError) throw groupsError;
          
          // Fetch members for each group
          const groupsWithMembers = await Promise.all(groupsData.map(async (group) => {
            const { data: members, error: membersError } = await supabase
              .from('group_members')
              .select('id, user_id, role, joined_at')
              .eq('group_id', group.id);
              
            if (membersError) throw membersError;
            
            return {
              ...group,
              members: members || []
            } as Group;
          }));
          
          setGroups(groupsWithMembers);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
        toast({
          title: "Kunne ikke hente grupper",
          description: "En feil oppstod. Prøv igjen senere.",
          variant: "destructive",
        });
      }
    };
    
    if (currentUserId) {
      fetchGroups();
    }
  }, [currentUserId, toast]);
  
  // Fetch group invites
  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const { data, error } = await supabase
          .from('group_invites')
          .select(`
            id, 
            group_id, 
            invited_by, 
            created_at, 
            expires_at,
            groups(name)
          `)
          .eq('invited_user_id', currentUserId)
          .lte('expires_at', new Date(Date.now() + 7*24*60*60*1000).toISOString())
          .gte('expires_at', new Date().toISOString());
          
        if (error) throw error;
        
        if (data) {
          const invites: GroupInvite[] = data.map(item => ({
            id: item.id,
            group_id: item.group_id,
            invited_by: item.invited_by,
            invited_user_id: currentUserId,
            created_at: item.created_at,
            expires_at: item.expires_at,
            group_name: item.groups?.name,
            sender_username: userProfiles[item.invited_by]?.username || null
          }));
          
          setGroupInvites(invites);
        }
      } catch (error) {
        console.error("Error fetching group invites:", error);
      }
    };
    
    if (currentUserId) {
      fetchInvites();
      
      // Set up subscription for new invites
      const channel = supabase.channel('group-invites')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'group_invites',
          filter: `invited_user_id=eq.${currentUserId}`
        }, () => {
          fetchInvites();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentUserId, userProfiles]);

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

  const handleCreateGroup = async (
    name: string, 
    members: string[], 
    securityLevel: SecurityLevel,
    password?: string,
    avatar?: File
  ) => {
    try {
      // 1. Insert the group
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert({
          name,
          creator_id: currentUserId,
          security_level: securityLevel,
          password: password || null
        })
        .select('id')
        .single();
        
      if (groupError) throw groupError;
      
      const groupId = groupData.id;
      
      // 2. Upload avatar if provided
      let avatarUrl = null;
      if (avatar) {
        const fileExt = avatar.name.split('.').pop();
        const filePath = `${groupId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('group_avatars')
          .upload(filePath, avatar);
          
        if (uploadError) throw uploadError;
        
        avatarUrl = filePath;
        
        // Update group with avatar URL
        const { error: updateError } = await supabase
          .from('groups')
          .update({ avatar_url: avatarUrl })
          .eq('id', groupId);
          
        if (updateError) throw updateError;
      }
      
      // 3. Add creator as admin member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          user_id: currentUserId,
          group_id: groupId,
          role: 'admin'
        });
        
      if (memberError) throw memberError;
      
      // 4. Add other members
      if (members.length > 0) {
        const memberInserts = members.map(userId => ({
          user_id: userId,
          group_id: groupId,
          role: 'member'
        }));
        
        const { error: membersError } = await supabase
          .from('group_members')
          .insert(memberInserts);
          
        if (membersError) throw membersError;
      }
      
      // 5. Create invites for members
      if (members.length > 0) {
        const invites = members.map(userId => ({
          group_id: groupId,
          invited_by: currentUserId,
          invited_user_id: userId
        }));
        
        const { error: invitesError } = await supabase
          .from('group_invites')
          .insert(invites);
          
        if (invitesError) console.warn("Failed to create invites:", invitesError);
      }
      
      // 6. Fetch the complete group with members
      const { data: completeGroup, error: completeError } = await supabase
        .from('groups')
        .select('id, name, created_at, creator_id, security_level, password, avatar_url')
        .eq('id', groupId)
        .single();
        
      if (completeError) throw completeError;
      
      const { data: groupMembers, error: groupMembersError } = await supabase
        .from('group_members')
        .select('id, user_id, role, joined_at')
        .eq('group_id', groupId);
        
      if (groupMembersError) throw groupMembersError;
      
      // 7. Add to local state and select the group
      const newGroup: Group = {
        ...completeGroup,
        members: groupMembers || []
      };
      
      setGroups(prevGroups => [...prevGroups, newGroup]);
      setSelectedGroup(newGroup);
      
      toast({
        title: "Gruppe opprettet",
        description: `Gruppen "${name}" ble opprettet`,
      });
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Kunne ikke opprette gruppe",
        description: "En feil oppstod. Prøv igjen senere.",
        variant: "destructive",
      });
    }
  };
  
  const handleJoinGroup = async (groupId: string, password?: string) => {
    try {
      // 1. If password provided, verify it
      if (password) {
        const { data: group, error: groupError } = await supabase
          .from('groups')
          .select('password')
          .eq('id', groupId)
          .single();
          
        if (groupError) throw groupError;
        
        if (group.password !== password) {
          return false; // Password doesn't match
        }
      }
      
      // 2. Join the group
      const { error: joinError } = await supabase
        .from('group_members')
        .insert({
          user_id: currentUserId,
          group_id: groupId,
          role: 'member'
        });
        
      if (joinError) throw joinError;
      
      // 3. Refresh groups list
      await refreshGroups();
      
      // 4. Select the joined group
      const joinedGroup = groups.find(g => g.id === groupId);
      if (joinedGroup) {
        setSelectedGroup(joinedGroup);
      }
      
      return true;
    } catch (error) {
      console.error("Error joining group:", error);
      toast({
        title: "Kunne ikke bli med i gruppen",
        description: "En feil oppstod. Prøv igjen senere.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const refreshGroups = async () => {
    try {
      const { data: memberData, error: memberError } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', currentUserId);
        
      if (memberError) throw memberError;
      
      if (memberData && memberData.length > 0) {
        const groupIds = memberData.map(m => m.group_id);
        
        const { data: groupsData, error: groupsError } = await supabase
          .from('groups')
          .select('id, name, created_at, creator_id, security_level, password, avatar_url')
          .in('id', groupIds);
          
        if (groupsError) throw groupsError;
        
        // Fetch members for each group
        const groupsWithMembers = await Promise.all(groupsData.map(async (group) => {
          const { data: members, error: membersError } = await supabase
            .from('group_members')
            .select('id, user_id, role, joined_at')
            .eq('group_id', group.id);
            
          if (membersError) throw membersError;
          
          return {
            ...group,
            members: members || []
          } as Group;
        }));
        
        setGroups(groupsWithMembers);
      }
    } catch (error) {
      console.error("Error refreshing groups:", error);
    }
  };
  
  const handleAcceptInvite = async (invite: GroupInvite) => {
    try {
      // 1. Add user to group members
      const { error: joinError } = await supabase
        .from('group_members')
        .insert({
          user_id: currentUserId,
          group_id: invite.group_id,
          role: 'member'
        });
        
      if (joinError) throw joinError;
      
      // 2. Delete the invite
      const { error: deleteError } = await supabase
        .from('group_invites')
        .delete()
        .eq('id', invite.id);
        
      if (deleteError) throw deleteError;
      
      // 3. Refresh groups and invites
      await refreshGroups();
      setGroupInvites(invites => invites.filter(inv => inv.id !== invite.id));
      
      // 4. Select the joined group
      const joinedGroup = groups.find(g => g.id === invite.group_id);
      if (joinedGroup) {
        setSelectedGroup(joinedGroup);
      }
      
      setIsInviteDialogOpen(false);
    } catch (error) {
      console.error("Error accepting invite:", error);
      throw error;
    }
  };
  
  const handleDeclineInvite = async (invite: GroupInvite) => {
    try {
      const { error } = await supabase
        .from('group_invites')
        .delete()
        .eq('id', invite.id);
        
      if (error) throw error;
      
      // Update local state
      setGroupInvites(invites => invites.filter(inv => inv.id !== invite.id));
    } catch (error) {
      console.error("Error declining invite:", error);
      throw error;
    }
  };
  
  const handlePasswordSubmit = async (password: string) => {
    if (!selectedPasswordGroup) return false;
    return handleJoinGroup(selectedPasswordGroup.id, password);
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
          <div className="flex space-x-2">
            {groupInvites.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="border-cybergold-500/30 text-cybergold-300 hover:bg-cyberdark-800 flex items-center gap-1 relative"
                onClick={() => setIsInviteDialogOpen(true)}
              >
                <Mail className="h-4 w-4" />
                <span>Invitasjoner</span>
                <Badge 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-cybergold-500 text-black"
                >
                  {groupInvites.length}
                </Badge>
              </Button>
            )}
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
                          {group.avatar_url ? (
                            <AvatarImage 
                              src={supabase.storage.from('group_avatars').getPublicUrl(group.avatar_url).data.publicUrl} 
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
                          <p className="text-cybergold-200 font-medium">
                            {group.name}
                          </p>
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
                        {group.members.length} {group.members.length === 1 ? 'medlem' : 'medlemmer'}
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
      
      <GroupPasswordDialog
        isOpen={isPasswordDialogOpen}
        onClose={() => {
          setIsPasswordDialogOpen(false);
          setSelectedPasswordGroup(null);
        }}
        onSubmit={handlePasswordSubmit}
        group={selectedPasswordGroup}
      />
      
      <GroupInviteDialog
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        invites={groupInvites}
        onAccept={handleAcceptInvite}
        onDecline={handleDeclineInvite}
        userProfiles={userProfiles}
      />
    </div>
  );
};
