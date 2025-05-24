/**
 * GroupInvitePanel Component
 * 
 * Modal component for managing group invites as part of FASE 2 implementation
 * Allows users to send and manage invitations to group chats
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Loader, X, Check, MailPlus, Users, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface GroupInviteModalProps {
  groupId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface GroupInvite {
  id: string;
  invited_user_id: string;
  invited_by: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  user?: {
    username: string;
    avatar_url: string | null;
  };
  inviter?: {
    username: string;
  };
}

const GroupInvitePanel: React.FC<GroupInviteModalProps> = ({
  groupId,
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('send');
  const [invites, setInvites] = useState<GroupInvite[]>([]);
  
  // New invite state
  const [inviteEmail, setInviteEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  // User search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch invites
  useEffect(() => {
    const fetchInvites = async () => {
      setIsLoading(true);
      try {
        // Fetch pending invites
        const { data: inviteData, error: inviteError } = await supabase
          .from('group_invites')
          .select(`
            id, 
            invited_user_id, 
            invited_by, 
            status, 
            created_at,
            user:invited_user_id(username, avatar_url),
            inviter:invited_by(username)
          `)
          .eq('group_id', groupId)
          .order('created_at', { ascending: false });

        if (inviteError) throw inviteError;

        setInvites(inviteData);
      } catch (error) {
        console.error('Error fetching invites:', error);
        toast({
          title: 'Failed to load invites',
          description: 'Please try again or contact support.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && groupId && user?.id) {
      fetchInvites();
    }
  }, [groupId, isOpen, user?.id, toast]);

  // Search users by email or username
  const searchUsers = async () => {
    if (!searchQuery || searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      let { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, email')
        .or(`username.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
        .limit(5);

      if (error) throw error;

      // Filter out current user and users already in the group
      if (data) {
        // Check existing members
        const { data: members } = await supabase
          .from('group_members')
          .select('user_id')
          .eq('group_id', groupId);
        
        const memberIds = members ? members.map(m => m.user_id) : [];
        
        // Check existing invites
        const { data: existingInvites } = await supabase
          .from('group_invites')
          .select('invited_user_id')
          .eq('group_id', groupId)
          .eq('status', 'pending');
          
        const inviteIds = existingInvites ? existingInvites.map(i => i.invited_user_id) : [];
        
        data = data.filter(p => 
          p.id !== user?.id && 
          !memberIds.includes(p.id) && 
          !inviteIds.includes(p.id)
        );
        
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: 'Search failed',
        description: 'An error occurred while searching for users.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Send invite to user
  const sendInvite = async (userId: string) => {
    if (!user?.id) return;
    
    setIsSending(true);
    try {
      // Create invite
      const { error } = await supabase
        .from('group_invites')
        .insert({
          group_id: groupId,
          invited_user_id: userId,
          invited_by: user.id,
          status: 'pending',
        });

      if (error) throw error;

      // Get user details for display
      const { data: userData } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', userId)
        .single();

      // Add to local state
      const newInvite: GroupInvite = {
        id: 'temp-' + Date.now(),
        invited_user_id: userId,
        invited_by: user.id,
        status: 'pending',
        created_at: new Date().toISOString(),
        user: {
          username: userData?.username || 'User',
          avatar_url: userData?.avatar_url,
        },
        inviter: {
          username: user.username || 'You',
        },
      };

      setInvites([newInvite, ...invites]);
      
      toast({
        title: 'Invitation sent',
        description: `An invitation has been sent to ${userData?.username || 'the user'}.`,
      });

      // Clear search
      setSearchQuery('');
      setSearchResults([]);
      
    } catch (error) {
      console.error('Error sending invite:', error);
      toast({
        title: 'Failed to send invitation',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  // Send invite by email
  const sendEmailInvite = async () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    try {
      // Check if user exists
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('email', inviteEmail)
        .single();

      if (userError) {
        // User not found, create an invitation link instead
        // This would typically send an email, but we'll just show a message
        toast({
          title: 'User not found',
          description: 'An invitation link has been generated. In a real app, this would send an email.',
        });
        setInviteEmail('');
        setIsSending(false);
        return;
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', userData.id)
        .single();

      if (existingMember) {
        toast({
          title: 'Already a member',
          description: 'This user is already a member of the group.',
          variant: 'destructive',
        });
        setInviteEmail('');
        setIsSending(false);
        return;
      }

      // Check for existing invites
      const { data: existingInvite } = await supabase
        .from('group_invites')
        .select('id')
        .eq('group_id', groupId)
        .eq('invited_user_id', userData.id)
        .eq('status', 'pending')
        .single();

      if (existingInvite) {
        toast({
          title: 'Invitation already sent',
          description: 'This user already has a pending invitation.',
          variant: 'destructive',
        });
        setInviteEmail('');
        setIsSending(false);
        return;
      }

      // Create invite
      const { error: inviteError } = await supabase
        .from('group_invites')
        .insert({
          group_id: groupId,
          invited_user_id: userData.id,
          invited_by: user?.id,
          status: 'pending',
        });

      if (inviteError) throw inviteError;

      // Add to local state
      const newInvite: GroupInvite = {
        id: 'temp-' + Date.now(),
        invited_user_id: userData.id,
        invited_by: user?.id || '',
        status: 'pending',
        created_at: new Date().toISOString(),
        user: {
          username: userData.username || 'User',
          avatar_url: userData.avatar_url,
        },
        inviter: {
          username: user?.username || 'You',
        },
      };

      setInvites([newInvite, ...invites]);
      
      toast({
        title: 'Invitation sent',
        description: `An invitation has been sent to ${userData.username || 'the user'}.`,
      });

      // Clear input
      setInviteEmail('');
      
    } catch (error) {
      console.error('Error sending invite:', error);
      toast({
        title: 'Failed to send invitation',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  // Cancel an invite
  const cancelInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from('group_invites')
        .delete()
        .eq('id', inviteId);

      if (error) throw error;

      // Update local state
      setInvites(invites.filter(invite => invite.id !== inviteId));
      
      toast({
        title: 'Invitation cancelled',
        description: 'The invitation has been cancelled.',
      });
      
    } catch (error) {
      console.error('Error cancelling invite:', error);
      toast({
        title: 'Failed to cancel invitation',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-cybergold-400 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Manage Group Invitations
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="send" className="flex-1">Send Invites</TabsTrigger>
            <TabsTrigger value="pending" className="flex-1">Pending ({invites.filter(i => i.status === 'pending').length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="send" className="space-y-4">
            <div>
              <Label htmlFor="email-invite">Invite by Email</Label>
              <div className="flex space-x-2 mt-1">
                <Input 
                  id="email-invite"
                  placeholder="Enter email address" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <Button onClick={sendEmailInvite} disabled={isSending}>
                  {isSending ? <Loader className="h-4 w-4 animate-spin" /> : <MailPlus className="h-4 w-4 mr-1" />}
                  Send
                </Button>
              </div>
            </div>
            
            <div className="mt-6">
              <Label htmlFor="search-users">Search Users</Label>
              <div className="flex space-x-2 mt-1">
                <Input 
                  id="search-users"
                  placeholder="Search by username or email" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
                />
                <Button onClick={searchUsers} disabled={isSearching || searchQuery.length < 3}>
                  {isSearching ? <Loader className="h-4 w-4 animate-spin" /> : 'Search'}
                </Button>
              </div>
            </div>
            
            {searchResults.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Search Results</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div key={result.id} className="flex items-center justify-between border-b border-border pb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={result.avatar_url || undefined} alt={result.username} />
                          <AvatarFallback>{result.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{result.username}</p>
                          <p className="text-xs text-muted-foreground">{result.email}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => sendInvite(result.id)}
                        disabled={isSending}
                      >
                        Invite
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pending">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader className="h-8 w-8 animate-spin text-cybergold-500" />
              </div>
            ) : invites.filter(i => i.status === 'pending').length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No pending invitations</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {invites
                  .filter(i => i.status === 'pending')
                  .map((invite) => (
                    <div key={invite.id} className="flex items-center justify-between border-b border-border pb-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={invite.user?.avatar_url || undefined} alt={invite.user?.username} />
                          <AvatarFallback>{invite.user?.username?.substring(0, 2).toUpperCase() || '??'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{invite.user?.username || 'Unknown User'}</p>
                          <p className="text-xs text-muted-foreground">
                            Invited by {invite.invited_by === user?.id ? 'you' : invite.inviter?.username}
                            {' • '}
                            {new Date(invite.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {(invite.invited_by === user?.id || user?.role === 'admin') && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => cancelInvite(invite.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupInvitePanel;
