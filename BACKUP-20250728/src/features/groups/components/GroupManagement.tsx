/**
 * GroupManagement Component
 * 
 * FASE 2: Gruppe & Invite System
 * Hovedkomponent for administrering av grupper med moderne design
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Plus, 
  Settings, 
  UserPlus, 
  Crown,
  Shield,
  Clock,
  MoreHorizontal,
  Search,
  Filter,
  Star,
  Lock,
  Globe,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Group {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  creator_id: string;
  is_private: boolean;
  security_level: 'standard' | 'enhanced' | 'premium';
  allow_member_invites: boolean;
  member_count?: number;
  created_at: string;
  updated_at: string;
}

interface GroupMember {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'member';
  display_name?: string;
  joined_at: string;
  profile?: {
    username: string;
    avatar_url?: string;
  };
}

interface GroupManagementProps {
  onSelectGroup?: (group: Group) => void;
  className?: string;
}

const GroupManagement: React.FC<GroupManagementProps> = ({ 
  onSelectGroup,
  className 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'owned' | 'member'>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // Create group form state
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    is_private: true,
    security_level: 'standard' as const,
    allow_member_invites: false
  });
  const [isCreating, setIsCreating] = useState(false);

  // Fetch user's groups
  const fetchGroups = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data: groupsData, error } = await supabase
        .from('group_chats')
        .select(`
          *,
          group_members!inner(role),
          member_count:group_members(count)
        `)
        .eq('group_members.user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setGroups(groupsData.map(group => ({
        ...group,
        member_count: group.member_count?.[0]?.count || 0
      })));
    } catch (err) {
      console.error('Error fetching groups:', err);
      toast({
        title: 'Failed to load groups',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new group
  const createGroup = async () => {
    if (!user?.id || !createForm.name.trim()) return;
    
    setIsCreating(true);
    try {
      const { data: groupData, error: groupError } = await supabase
        .rpc('create_group_with_admin', {
          group_name: createForm.name.trim(),
          group_description: createForm.description.trim() || null,
          is_private: createForm.is_private
        });

      if (groupError) throw groupError;

      // Update group settings
      if (groupData) {
        const { error: updateError } = await supabase
          .from('group_chats')
          .update({
            security_level: createForm.security_level,
            allow_member_invites: createForm.allow_member_invites
          })
          .eq('id', groupData);

        if (updateError) throw updateError;
      }

      toast({
        title: 'Group created',
        description: `"${createForm.name}" has been created successfully.`,
      });

      // Reset form and close dialog
      setCreateForm({
        name: '',
        description: '',
        is_private: true,
        security_level: 'standard',
        allow_member_invites: false
      });
      setShowCreateDialog(false);
      
      // Refresh groups
      await fetchGroups();
    } catch (err) {
      console.error('Error creating group:', err);
      toast({
        title: 'Failed to create group',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Filter groups
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterType === 'all' || 
      (filterType === 'owned' && group.creator_id === user?.id) ||
      (filterType === 'member' && group.creator_id !== user?.id);
    
    return matchesSearch && matchesFilter;
  });

  // Initialize
  useEffect(() => {
    if (user?.id) {
      fetchGroups();
    }
  }, [user?.id]);

  // Security level colors
  const getSecurityBadge = (level: string) => {
    switch (level) {
      case 'premium':
        return <Badge variant="outline" className="bg-gradient-to-r from-cybergold-600 to-cybergold-400 text-black border-cybergold-500"><Star className="h-3 w-3 mr-1" />Premium</Badge>;
      case 'enhanced':
        return <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-600"><Shield className="h-3 w-3 mr-1" />Enhanced</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-800/30 text-gray-300 border-gray-600">Standard</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-cybergold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-cybergold-500">Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cybergold-100">Group Management</h2>
          <p className="text-cybergold-400">Manage your groups and conversations</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyberblue-600 to-cyberblue-800 hover:from-cyberblue-700 hover:to-cyberblue-900">
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-cyberdark-900 border-cybergold-500/30">
            <DialogHeader>
              <DialogTitle className="text-cybergold-100">Create New Group</DialogTitle>
              <DialogDescription className="text-cybergold-400">
                Set up a new group for secure conversations
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-cybergold-300">Group Name</label>
                <Input
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter group name"
                  className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-100"
                  maxLength={50}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-cybergold-300">Description (Optional)</label>
                <Textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your group"
                  className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-100"
                  maxLength={500}
                  rows={3}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-cybergold-300">Private Group</label>
                  <input
                    type="checkbox"
                    checked={createForm.is_private}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, is_private: e.target.checked }))}
                    className="rounded border-cybergold-500/30"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-cybergold-300">Allow Member Invites</label>
                  <input
                    type="checkbox"
                    checked={createForm.allow_member_invites}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, allow_member_invites: e.target.checked }))}
                    className="rounded border-cybergold-500/30"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={createGroup}
                  disabled={isCreating || !createForm.name.trim()}
                  className="bg-gradient-to-r from-cyberblue-600 to-cyberblue-800"
                >
                  {isCreating ? 'Creating...' : 'Create Group'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cybergold-500 h-4 w-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groups..."
            className="pl-10 bg-cyberdark-800 border-cybergold-500/30 text-cybergold-100"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('all')}
            className={filterType === 'all' ? 'bg-cybergold-600 text-black' : ''}
          >
            All
          </Button>
          <Button
            variant={filterType === 'owned' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('owned')}
            className={filterType === 'owned' ? 'bg-cybergold-600 text-black' : ''}
          >
            <Crown className="h-3 w-3 mr-1" />
            Owned
          </Button>
          <Button
            variant={filterType === 'member' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('member')}
            className={filterType === 'member' ? 'bg-cybergold-600 text-black' : ''}
          >
            <Users className="h-3 w-3 mr-1" />
            Member
          </Button>
        </div>
      </div>

      {/* Groups Grid */}
      {filteredGroups.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-cyberdark-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-cybergold-500/50" />
          </div>
          <h3 className="text-lg font-medium text-cybergold-300 mb-2">
            {searchQuery ? 'No groups found' : 'No groups yet'}
          </h3>
          <p className="text-cybergold-500 mb-4">
            {searchQuery 
              ? 'Try adjusting your search or filters' 
              : 'Create your first group to start secure conversations'
            }
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowCreateDialog(true)} className="bg-gradient-to-r from-cyberblue-600 to-cyberblue-800">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Group
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group) => (
            <Card 
              key={group.id} 
              className="bg-cyberdark-850 border-cyberdark-700 hover:border-cybergold-500/50 transition-all cursor-pointer group"
              onClick={() => onSelectGroup?.(group)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={group.avatar_url} alt={group.name} />
                      <AvatarFallback className="bg-cyberdark-700 text-cybergold-400">
                        {group.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-cybergold-100 text-sm truncate">
                        {group.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {group.is_private ? (
                          <Lock className="h-3 w-3 text-cybergold-500" />
                        ) : (
                          <Globe className="h-3 w-3 text-cybergold-500" />
                        )}
                        <span className="text-xs text-cybergold-500">
                          {group.member_count} members
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {group.creator_id === user?.id && (
                      <Crown className="h-4 w-4 text-cybergold-500" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Open group settings
                      }}
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {group.description && (
                  <p className="text-xs text-cybergold-400 mb-3 line-clamp-2">
                    {group.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  {getSecurityBadge(group.security_level)}
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-cybergold-500" />
                    <span className="text-xs text-cybergold-500">
                      {new Date(group.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupManagement;
