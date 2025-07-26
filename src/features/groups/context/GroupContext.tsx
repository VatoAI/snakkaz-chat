import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { MCPClient } from '@/config/mcp';

// Types
export interface GroupMember {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'member';
  joined_at: string;
  user: {
    username: string;
    avatar_url?: string;
    online?: boolean;
  };
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  created_at: string;
  created_by: string;
  is_private: boolean;
  member_count: number;
  members?: GroupMember[];
}

interface GroupInvite {
  id: string;
  group_id: string;
  group?: Group;
  invited_by: string;
  invited_by_user?: {
    username: string;
    avatar_url?: string;
  };
  invited_email?: string;
  invited_user_id?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  expires_at: string;
  invite_token: string;
}

// Context type
interface GroupContextType {
  groups: Group[];
  currentGroup: Group | null;
  invites: GroupInvite[];
  loading: boolean;
  createGroup: (name: string, description?: string, isPrivate?: boolean) => Promise<Group | null>;
  joinGroup: (groupId: string) => Promise<boolean>;
  leaveGroup: (groupId: string) => Promise<boolean>;
  fetchGroup: (groupId: string) => Promise<Group | null>;
  fetchGroupMembers: (groupId: string) => Promise<GroupMember[]>;
  createInvite: (groupId: string, userId?: string, email?: string) => Promise<GroupInvite | null>;
  acceptInvite: (inviteId: string) => Promise<boolean>;
  rejectInvite: (inviteId: string) => Promise<boolean>;
  shareInviteViaSocial: (inviteId: string, platform: string, groupId: string, groupName: string) => Promise<boolean>;
}

// Create context
const GroupContext = createContext<GroupContextType | undefined>(undefined);

// Provider component
export function GroupProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [invites, setInvites] = useState<GroupInvite[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize MCP client
  const mcpClient = new MCPClient();

  // Fetch user groups
  useEffect(() => {
    if (!user?.id) {
      setGroups([]);
      setInvites([]);
      setLoading(false);
      return;
    }

    const fetchUserGroups = async () => {
      try {
        // Fetch all groups that the user is a member of
        const { data: memberships, error: membershipError } = await supabase
          .from('members')
          .select('room_id')
          .eq('user_id', user.id);

        if (membershipError) throw membershipError;

        if (memberships && memberships.length > 0) {
          const roomIds = memberships.map(m => m.room_id);
          
          // Fetch group details
          const { data: groupsData, error: groupsError } = await supabase
            .from('rooms')
            .select(`
              id,
              name,
              description,
              avatar_url,
              created_at,
              created_by,
              is_private,
              member_count:members(count)
            `)
            .in('id', roomIds);

          if (groupsError) throw groupsError;
          setGroups(groupsData || []);
        } else {
          setGroups([]);
        }

        // Fetch invites for the user
        const { data: userInvites, error: invitesError } = await supabase
          .from('invites')
          .select(`
            id,
            group_id,
            group:group_id(name, avatar_url),
            invited_by,
            invited_by_user:invited_by(username, avatar_url),
            invited_email,
            invited_user_id,
            status,
            created_at,
            expires_at,
            invite_token
          `)
          .or(`invited_user_id.eq.${user.id},invited_email.eq.${user.email}`)
          .eq('status', 'pending');

        if (invitesError) throw invitesError;
        setInvites(userInvites || []);
        
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserGroups();
    
    // Set up realtime subscriptions for groups and invites
    const groupsSubscription = supabase
      .channel('groups_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'rooms',
          filter: `created_by=eq.${user.id}`
        },
        () => {
          fetchUserGroups();
        }
      )
      .subscribe();
    
    const invitesSubscription = supabase
      .channel('invites_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'invites',
          filter: `invited_user_id=eq.${user.id}`
        },
        () => {
          fetchUserGroups();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(groupsSubscription);
      supabase.removeChannel(invitesSubscription);
    };
  }, [user?.id, user?.email]);

  // Create a new group
  const createGroup = async (
    name: string, 
    description?: string, 
    isPrivate = false
  ): Promise<Group | null> => {
    if (!user?.id) return null;

    try {
      // Create the group
      const { data: group, error: groupError } = await supabase
        .from('rooms')
        .insert({
          name,
          description,
          is_private: isPrivate,
          created_by: user.id,
          type: 'group'
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from('members')
        .insert({
          room_id: group.id,
          user_id: user.id,
          role: 'admin'
        });

      if (memberError) throw memberError;

      // Add the new group to state
      const groupWithCount = { ...group, member_count: 1 };
      setGroups(prev => [...prev, groupWithCount]);
      return groupWithCount;
    } catch (error) {
      console.error('Error creating group:', error);
      return null;
    }
  };

  // Join a group
  const joinGroup = async (groupId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('members')
        .insert({
          room_id: groupId,
          user_id: user.id,
          role: 'member'
        });

      if (error) throw error;

      // Update groups state
      const { data: groupData } = await supabase
        .from('rooms')
        .select(`
          id,
          name,
          description,
          avatar_url,
          created_at,
          created_by,
          is_private,
          member_count:members(count)
        `)
        .eq('id', groupId)
        .single();

      if (groupData) {
        setGroups(prev => [...prev, groupData]);
      }

      return true;
    } catch (error) {
      console.error('Error joining group:', error);
      return false;
    }
  };

  // Leave a group
  const leaveGroup = async (groupId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('room_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update groups state
      setGroups(prev => prev.filter(g => g.id !== groupId));
      if (currentGroup?.id === groupId) {
        setCurrentGroup(null);
      }

      return true;
    } catch (error) {
      console.error('Error leaving group:', error);
      return false;
    }
  };

  // Fetch a specific group
  const fetchGroup = async (groupId: string): Promise<Group | null> => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          id,
          name,
          description,
          avatar_url,
          created_at,
          created_by,
          is_private,
          member_count:members(count)
        `)
        .eq('id', groupId)
        .single();

      if (error) throw error;

      setCurrentGroup(data);
      return data;
    } catch (error) {
      console.error('Error fetching group:', error);
      return null;
    }
  };

  // Fetch group members
  const fetchGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select(`
          id,
          user_id,
          role,
          joined_at,
          user:user_id(username, avatar_url)
        `)
        .eq('room_id', groupId);

      if (error) throw error;

      // Add mocked online status
      const membersWithStatus = (data || []).map(member => ({
        ...member,
        user: {
          ...member.user,
          online: Math.random() > 0.5 // Random online status for demo
        }
      }));

      // Update current group with members
      if (currentGroup?.id === groupId) {
        setCurrentGroup(prev => prev ? { ...prev, members: membersWithStatus } : null);
      }

      return membersWithStatus;
    } catch (error) {
      console.error('Error fetching group members:', error);
      return [];
    }
  };

  // Create an invite
  const createInvite = async (
    groupId: string, 
    userId?: string, 
    email?: string
  ): Promise<GroupInvite | null> => {
    if (!user?.id) return null;

    try {
      // Check if user is authorized to invite to this group
      const { data: membership } = await supabase
        .from('members')
        .select('role')
        .eq('room_id', groupId)
        .eq('user_id', user.id)
        .single();

      if (!membership || !['admin', 'moderator'].includes(membership.role)) {
        throw new Error('You do not have permission to invite users to this group');
      }

      // Create the invite token
      const inviteToken = generateInviteToken();

      // Set expiration date to 7 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Create invite record
      const { data: invite, error } = await supabase
        .from('invites')
        .insert({
          group_id: groupId,
          invited_by: user.id,
          invited_user_id: userId,
          invited_email: email,
          status: 'pending',
          expires_at: expiresAt.toISOString(),
          invite_token: inviteToken
        })
        .select(`
          id,
          group_id,
          group:group_id(name, avatar_url),
          invited_by,
          invited_by_user:invited_by(username, avatar_url),
          invited_email,
          invited_user_id,
          status,
          created_at,
          expires_at,
          invite_token
        `)
        .single();

      if (error) throw error;

      // If inviting by user ID, create a notification for that user
      if (userId) {
        await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            type: 'group_invite',
            title: 'Ny gruppeinvitasjon',
            message: `${user.username || 'Noen'} har invitert deg til å bli med i gruppen ${invite.group?.name || 'en gruppe'}.`,
            action_url: `/invites/${invite.id}`,
            read: false,
            sender_id: user.id,
            sender_name: user.username
          });
          
        // Also send via MCP for push notifications
        try {
          await mcpClient.sendNotification(
            userId,
            'Ny gruppeinvitasjon',
            `${user.username || 'Noen'} har invitert deg til å bli med i gruppen ${invite.group?.name || 'en gruppe'}.`,
            'group_invite'
          );
        } catch (mcpError) {
          console.error('MCP notification failed:', mcpError);
        }
      }

      return invite;
    } catch (error) {
      console.error('Error creating invite:', error);
      return null;
    }
  };

  // Accept an invite
  const acceptInvite = async (inviteId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      // Get the invite details
      const { data: invite, error: inviteError } = await supabase
        .from('invites')
        .select('group_id, invited_user_id, invited_email, status')
        .eq('id', inviteId)
        .single();

      if (inviteError) throw inviteError;

      // Verify the invite is for this user
      if (invite.status !== 'pending') {
        throw new Error('This invite has already been processed');
      }
      
      if (invite.invited_user_id !== user.id && invite.invited_email !== user.email) {
        throw new Error('This invite is not for you');
      }

      // Join the group
      const joined = await joinGroup(invite.group_id);
      if (!joined) {
        throw new Error('Failed to join group');
      }

      // Update the invite status
      const { error: updateError } = await supabase
        .from('invites')
        .update({ status: 'accepted' })
        .eq('id', inviteId);

      if (updateError) throw updateError;

      // Remove from invites list
      setInvites(prev => prev.filter(i => i.id !== inviteId));

      return true;
    } catch (error) {
      console.error('Error accepting invite:', error);
      return false;
    }
  };

  // Reject an invite
  const rejectInvite = async (inviteId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      // Update the invite status
      const { error } = await supabase
        .from('invites')
        .update({ status: 'rejected' })
        .eq('id', inviteId);

      if (error) throw error;

      // Remove from invites list
      setInvites(prev => prev.filter(i => i.id !== inviteId));

      return true;
    } catch (error) {
      console.error('Error rejecting invite:', error);
      return false;
    }
  };
  
  // Share invite via social media
  const shareInviteViaSocial = async (
    inviteId: string, 
    platform: string, 
    groupId: string,
    groupName: string
  ): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      // Get the invite details
      const { data: invite } = await supabase
        .from('invites')
        .select('invite_token')
        .eq('id', inviteId)
        .single();
      
      if (!invite) return false;
      
      // Create the invite URL
      const inviteUrl = `https://snakkaz.com/join/${invite.invite_token}`;
      
      // Share via MCP
      const result = await mcpClient.shareInvite(platform, {
        inviteId,
        inviteUrl,
        groupId,
        groupName,
        invitedBy: user.username || 'En bruker',
        message: `Bli med i ${groupName} på SnakkaZ!`
      });
      
      return !!result && !result.error;
    } catch (error) {
      console.error(`Error sharing invite via ${platform}:`, error);
      return false;
    }
  };

  // Helper function to generate a random invite token
  const generateInviteToken = (): string => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  // Return context provider
  return (
    <GroupContext.Provider
      value={{
        groups,
        currentGroup,
        invites,
        loading,
        createGroup,
        joinGroup,
        leaveGroup,
        fetchGroup,
        fetchGroupMembers,
        createInvite,
        acceptInvite,
        rejectInvite,
        shareInviteViaSocial
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

// Custom hook to use the GroupContext
export function useGroups() {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroups must be used within a GroupProvider');
  }
  return context;
}
