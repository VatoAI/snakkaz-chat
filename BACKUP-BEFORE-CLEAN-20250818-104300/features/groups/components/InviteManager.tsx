/**
 * InviteManager Component
 * 
 * FASE 2: Moderne invite-manager for gruppeinvitasjoner
 * Administrerer alle invitasjoner - både mottatte og sendte
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Check, 
  X, 
  Clock, 
  Mail, 
  Users, 
  Send,
  Inbox,
  Eye,
  UserCheck,
  UserX,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GroupInvite {
  id: string;
  group_id: string;
  invited_user_id?: string;
  invited_by: string;
  invite_code?: string;
  email?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  expires_at?: string;
  created_at: string;
  used_at?: string;
  group?: {
    name: string;
    avatar_url?: string;
    description?: string;
  };
  user?: {
    username: string;
    avatar_url?: string;
  };
  inviter?: {
    username: string;
    avatar_url?: string;
  };
}

interface InviteManagerProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const InviteManager: React.FC<InviteManagerProps> = ({
  isOpen,
  onClose,
  className
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // State
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [receivedInvites, setReceivedInvites] = useState<GroupInvite[]>([]);
  const [sentInvites, setSentInvites] = useState<GroupInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingInvite, setProcessingInvite] = useState<string | null>(null);

  // Fetch received invites
  const fetchReceivedInvites = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('group_invites')
        .select(`
          *,
          group:group_id(name, avatar_url, description),
          inviter:invited_by(username, avatar_url)
        `)
        .eq('invited_user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReceivedInvites(data || []);
    } catch (err) {
      console.error('Error fetching received invites:', err);
      toast({
        title: 'Failed to load invites',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  // Fetch sent invites
  const fetchSentInvites = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('group_invites')
        .select(`
          *,
          group:group_id(name, avatar_url, description),
          user:invited_user_id(username, avatar_url)
        `)
        .eq('invited_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSentInvites(data || []);
    } catch (err) {
      console.error('Error fetching sent invites:', err);
      toast({
        title: 'Failed to load sent invites',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  // Accept invite
  const acceptInvite = async (invite: GroupInvite) => {
    if (!user?.id) return;

    setProcessingInvite(invite.id);
    try {
      const { data, error } = await supabase
        .rpc('accept_group_invite', { invite_id: invite.id });

      if (error) throw error;

      if (data) {
        toast({
          title: 'Invitation accepted',
          description: `You've joined "${invite.group?.name}".`,
        });

        // Remove from received invites
        setReceivedInvites(prev => prev.filter(i => i.id !== invite.id));
      } else {
        throw new Error('Failed to accept invitation');
      }
    } catch (err) {
      console.error('Error accepting invite:', err);
      toast({
        title: 'Failed to accept invite',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setProcessingInvite(null);
    }
  };

  // Decline invite
  const declineInvite = async (invite: GroupInvite) => {
    setProcessingInvite(invite.id);
    try {
      const { error } = await supabase
        .from('group_invites')
        .update({ status: 'rejected' })
        .eq('id', invite.id);

      if (error) throw error;

      toast({
        title: 'Invitation declined',
        description: `You've declined the invitation to "${invite.group?.name}".`,
      });

      // Remove from received invites
      setReceivedInvites(prev => prev.filter(i => i.id !== invite.id));
    } catch (err) {
      console.error('Error declining invite:', err);
      toast({
        title: 'Failed to decline invite',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setProcessingInvite(null);
    }
  };

  // Cancel sent invite
  const cancelInvite = async (invite: GroupInvite) => {
    setProcessingInvite(invite.id);
    try {
      const { error } = await supabase
        .from('group_invites')
        .delete()
        .eq('id', invite.id);

      if (error) throw error;

      toast({
        title: 'Invitation cancelled',
        description: 'The invitation has been cancelled.',
      });

      // Remove from sent invites
      setSentInvites(prev => prev.filter(i => i.id !== invite.id));
    } catch (err) {
      console.error('Error cancelling invite:', err);
      toast({
        title: 'Failed to cancel invite',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setProcessingInvite(null);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-900/30 text-yellow-300 border-yellow-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-600"><Check className="h-3 w-3 mr-1" />Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-900/30 text-red-300 border-red-600"><X className="h-3 w-3 mr-1" />Declined</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-gray-900/30 text-gray-300 border-gray-600"><Calendar className="h-3 w-3 mr-1" />Expired</Badge>;
      default:
        return null;
    }
  };

  // Check if invite is expired
  const isExpired = (invite: GroupInvite) => {
    return invite.expires_at && new Date(invite.expires_at) < new Date();
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Initialize
  useEffect(() => {
    if (isOpen && user?.id) {
      setLoading(true);
      Promise.all([fetchReceivedInvites(), fetchSentInvites()])
        .finally(() => setLoading(false));
    }
  }, [isOpen, user?.id]);

  // Loading state
  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-cyberdark-900 border-cybergold-500/30 max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="h-8 w-8 border-4 border-cybergold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-cybergold-500">Loading invitations...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("bg-cyberdark-900 border-cybergold-500/30 max-w-4xl", className)}>
        <DialogHeader>
          <DialogTitle className="text-cybergold-100 flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Invite Manager
          </DialogTitle>
          <DialogDescription className="text-cybergold-400">
            Manage your group invitations - both received and sent
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-cyberdark-800">
            <TabsTrigger value="received" className="data-[state=active]:bg-cybergold-600 data-[state=active]:text-black">
              <Inbox className="h-4 w-4 mr-2" />
              Received ({receivedInvites.length})
            </TabsTrigger>
            <TabsTrigger value="sent" className="data-[state=active]:bg-cybergold-600 data-[state=active]:text-black">
              <Send className="h-4 w-4 mr-2" />
              Sent ({sentInvites.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="mt-6">
            {receivedInvites.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-cyberdark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Inbox className="h-8 w-8 text-cybergold-500/50" />
                </div>
                <h3 className="text-lg font-medium text-cybergold-300 mb-2">No pending invitations</h3>
                <p className="text-cybergold-500">You don't have any pending group invitations</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {receivedInvites.map((invite) => (
                  <Card key={invite.id} className="bg-cyberdark-850 border-cyberdark-700">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={invite.group?.avatar_url} alt={invite.group?.name} />
                            <AvatarFallback className="bg-cyberdark-700 text-cybergold-400">
                              {invite.group?.name?.substring(0, 2).toUpperCase() || 'GR'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-cybergold-100">
                                {invite.group?.name || 'Unknown Group'}
                              </h4>
                              {isExpired(invite) && (
                                <Badge variant="outline" className="bg-red-900/30 text-red-300 border-red-600 text-xs">
                                  Expired
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-cybergold-400 mb-2">
                              Invited by <span className="text-cybergold-300">{invite.inviter?.username || 'Unknown'}</span>
                            </p>
                            
                            {invite.group?.description && (
                              <p className="text-xs text-cybergold-500 mb-2 line-clamp-2">
                                {invite.group.description}
                              </p>
                            )}
                            
                            <p className="text-xs text-cybergold-500">
                              Received {formatDate(invite.created_at)}
                              {invite.expires_at && (
                                <> • Expires {formatDate(invite.expires_at)}</>
                              )}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => declineInvite(invite)}
                            disabled={processingInvite === invite.id || isExpired(invite)}
                            className="border-red-600/30 text-red-400 hover:bg-red-900/20"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Decline
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => acceptInvite(invite)}
                            disabled={processingInvite === invite.id || isExpired(invite)}
                            className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900"
                          >
                            {processingInvite === invite.id ? (
                              <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                            ) : (
                              <Check className="h-3 w-3 mr-1" />
                            )}
                            Accept
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent" className="mt-6">
            {sentInvites.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-cyberdark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-cybergold-500/50" />
                </div>
                <h3 className="text-lg font-medium text-cybergold-300 mb-2">No sent invitations</h3>
                <p className="text-cybergold-500">You haven't sent any group invitations yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sentInvites.map((invite) => (
                  <Card key={invite.id} className="bg-cyberdark-850 border-cyberdark-700">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={invite.group?.avatar_url} alt={invite.group?.name} />
                            <AvatarFallback className="bg-cyberdark-700 text-cybergold-400">
                              {invite.group?.name?.substring(0, 2).toUpperCase() || 'GR'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-cybergold-100">
                                {invite.group?.name || 'Unknown Group'}
                              </h4>
                              {getStatusBadge(invite.status)}
                            </div>
                            
                            <p className="text-sm text-cybergold-400 mb-2">
                              Sent to {invite.user ? (
                                <span className="text-cybergold-300">{invite.user.username}</span>
                              ) : invite.email ? (
                                <span className="text-cybergold-300">{invite.email}</span>
                              ) : (
                                <span className="text-cybergold-300">Link invite</span>
                              )}
                            </p>
                            
                            <p className="text-xs text-cybergold-500">
                              Sent {formatDate(invite.created_at)}
                              {invite.status === 'accepted' && invite.used_at && (
                                <> • Accepted {formatDate(invite.used_at)}</>
                              )}
                              {invite.expires_at && invite.status === 'pending' && (
                                <> • Expires {formatDate(invite.expires_at)}</>
                              )}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {invite.status === 'pending' && !isExpired(invite) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => cancelInvite(invite)}
                              disabled={processingInvite === invite.id}
                              className="border-red-600/30 text-red-400 hover:bg-red-900/20"
                            >
                              {processingInvite === invite.id ? (
                                <div className="h-3 w-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin mr-1"></div>
                              ) : (
                                <X className="h-3 w-3 mr-1" />
                              )}
                              Cancel
                            </Button>
                          )}
                          
                          {invite.invite_code && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const link = `${window.location.origin}/join-group/${invite.invite_code}`;
                                navigator.clipboard.writeText(link);
                                toast({
                                  title: 'Link copied',
                                  description: 'Invite link copied to clipboard',
                                });
                              }}
                              className="border-cybergold-500/30"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Copy Link
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteManager;
