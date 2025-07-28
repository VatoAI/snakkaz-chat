import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useGroups, Group } from '@/features/groups/context/GroupContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Search, Plus, UsersRound, Lock, Users, Settings, CircleHelp } from 'lucide-react';

// Create Group Dialog Component
export function CreateGroupDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { createGroup } = useGroups();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState('');
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!name.trim()) {
      setNameError('Gruppenavn er påkrevd');
      return;
    }
    
    if (name.length < 3) {
      setNameError('Gruppenavn må være minst 3 tegn');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const group = await createGroup(name, description, isPrivate);
      
      if (group) {
        toast({
          title: 'Gruppe opprettet',
          description: `Gruppen "${name}" ble opprettet.`,
        });
        
        // Reset form and close dialog
        setName('');
        setDescription('');
        setIsPrivate(false);
        onOpenChange(false);
        
        // Navigate to the new group
        navigate(`/group/${group.id}`);
      } else {
        throw new Error('Kunne ikke opprette gruppe');
      }
    } catch (error) {
      toast({
        title: 'Feil under oppretting',
        description: 'Noe gikk galt under opprettelse av gruppen.',
        variant: 'destructive',
      });
      console.error('Error creating group:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-cyberdark-900 border-cyberdark-700 text-cybergold-100">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-cybergold-100">Opprett ny gruppe</DialogTitle>
            <DialogDescription className="text-cybergold-400">
              Lag din egen gruppe og inviter venner til å bli med.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-cybergold-300">
                Gruppenavn
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError(''); // Clear error on change
                }}
                placeholder="Skriv et gruppenavn..."
                className={cn(
                  "bg-cyberdark-800 border-cyberdark-600 placeholder:text-cyberdark-400 focus-visible:ring-cyberblue-500",
                  nameError && "border-cyberred-500 focus-visible:ring-cyberred-500"
                )}
              />
              {nameError && (
                <p className="text-xs text-cyberred-500">{nameError}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-cybergold-300">
                Beskrivelse (valgfritt)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Skriv en kort beskrivelse av gruppen..."
                className="bg-cyberdark-800 border-cyberdark-600 placeholder:text-cyberdark-400 focus-visible:ring-cyberblue-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label htmlFor="private-group" className="text-cybergold-300">
                  Privat gruppe
                </Label>
                <p className="text-xs text-cybergold-500">
                  Private grupper er kun synlig for inviterte medlemmer.
                </p>
              </div>
              <Switch
                id="private-group"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
                className="data-[state=checked]:bg-cyberblue-600"
              />
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-cyberdark-600 text-cybergold-300 hover:bg-cyberdark-800 hover:text-cybergold-100"
              disabled={isSubmitting}
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-cyberblue-600 to-cyberblue-800 hover:from-cyberblue-700 hover:to-cyberblue-900 text-white"
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Oppretter...</span>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                </>
              ) : (
                'Opprett gruppe'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Group List Component
export function GroupList() {
  const { groups, loading } = useGroups();
  const navigate = useNavigate();
  
  // Create an array of 3 skeleton groups for loading state
  const skeletonGroups = Array.from({ length: 3 }, (_, i) => i);
  
  return (
    <div className="space-y-2 mt-1">
      {loading ? (
        // Loading skeletons
        skeletonGroups.map((_, index) => (
          <div key={index} className="flex items-center gap-3 p-2 rounded-md">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))
      ) : groups.length === 0 ? (
        <div className="text-center p-4 border border-dashed border-cyberdark-700 rounded-md bg-cyberdark-800/30">
          <UsersRound className="h-8 w-8 mx-auto mb-2 text-cybergold-500/50" />
          <p className="text-cybergold-400 text-sm mb-3">
            Du er ikke medlem av noen grupper ennå.
          </p>
          <Button
            onClick={() => navigate('/groups/discover')}
            variant="outline"
            size="sm"
            className="border-cyberdark-600 text-cybergold-300 hover:bg-cyberdark-800 hover:text-cybergold-100"
          >
            <Search className="h-3.5 w-3.5 mr-1.5" />
            Finn grupper
          </Button>
        </div>
      ) : (
        groups.map((group) => (
          <GroupListItem key={group.id} group={group} />
        ))
      )}
    </div>
  );
}

// Group List Item Component
function GroupListItem({ group }: { group: Group }) {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      className="w-full flex items-center gap-3 p-2 rounded-md justify-start hover:bg-cyberdark-800/50 text-left"
      onClick={() => navigate(`/group/${group.id}`)}
    >
      <Avatar className="h-10 w-10 rounded-md border border-cyberdark-700">
        {group.avatar_url ? (
          <AvatarImage src={group.avatar_url} alt={group.name} />
        ) : (
          <AvatarFallback className="rounded-md bg-gradient-to-br from-cyberblue-800 to-cyberblue-950 text-white font-medium">
            {group.name.charAt(0)}
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="font-medium text-sm text-cybergold-100 truncate">
            {group.name}
          </h3>
          {group.is_private && (
            <Lock className="h-3 w-3 text-cybergold-500" />
          )}
        </div>
        <p className="text-xs text-cybergold-400">
          {group.member_count} {group.member_count === 1 ? 'medlem' : 'medlemmer'}
        </p>
      </div>
    </Button>
  );
}

// Groups Section Component for Sidebar
export function GroupsSection({ onCreateGroup }: { onCreateGroup: () => void }) {
  const { groups, loading, invites } = useGroups();
  const navigate = useNavigate();
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-semibold text-cybergold-500 uppercase tracking-wider">
          Grupper
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCreateGroup}
          className="h-5 w-5 rounded text-cybergold-400 hover:text-cybergold-100 hover:bg-cyberdark-800"
          title="Opprett gruppe"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      {invites.length > 0 && (
        <Button
          variant="ghost"
          className="w-full flex items-center gap-3 p-2 rounded-md justify-start mb-1 bg-cybergreen-950/20 hover:bg-cybergreen-950/30 border border-cybergreen-900/20 text-left"
          onClick={() => navigate('/invites')}
        >
          <div className="h-5 w-5 rounded-full bg-cybergreen-900/30 flex items-center justify-center flex-shrink-0">
            <Users className="h-3 w-3 text-cybergreen-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-cybergold-100">
                Gruppeinvitasjoner
              </p>
              <Badge className="h-5 px-1 text-[10px] bg-cybergreen-900/30 text-cybergreen-400 border-cybergreen-900/30">
                {invites.length}
              </Badge>
            </div>
          </div>
        </Button>
      )}
      
      <ScrollArea className="h-auto max-h-56">
        <GroupList />
      </ScrollArea>
      
      <div className="flex justify-between mt-2 px-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/groups/discover')}
          className="text-xs text-cybergold-400 hover:text-cybergold-100 p-1 h-auto"
        >
          <Search className="h-3 w-3 mr-1" />
          Finn flere
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/groups/help')}
          className="text-xs text-cybergold-400 hover:text-cybergold-100 p-1 h-auto"
        >
          <CircleHelp className="h-3 w-3 mr-1" />
          Hjelp
        </Button>
      </div>
    </div>
  );
}

// Groups Dashboard Component for Groups Page
export function GroupsDashboard() {
  const { user } = useAuth();
  const { groups, loading, invites } = useGroups();
  const navigate = useNavigate();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-cybergold-100">Dine grupper</h1>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-gradient-to-r from-cyberblue-600 to-cyberblue-800 hover:from-cyberblue-700 hover:to-cyberblue-900 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Opprett gruppe
        </Button>
      </div>
      
      {/* Invites Section */}
      {invites.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-cybergold-200 mb-3">
            Gruppeinvitasjoner ({invites.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {invites.map((invite) => (
              <div 
                key={invite.id} 
                className="bg-cyberdark-800 border border-cybergreen-900/20 rounded-lg overflow-hidden hover:border-cybergreen-900/40 transition-colors"
              >
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      {invite.group?.avatar_url ? (
                        <AvatarImage src={invite.group.avatar_url} alt={invite.group?.name} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-cyberblue-800 to-cyberblue-950 text-white">
                          {invite.group?.name?.charAt(0) || 'G'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-cybergold-100">
                        {invite.group?.name || 'Ukjent gruppe'}
                      </h3>
                      <p className="text-xs text-cybergold-400">
                        Invitert av {invite.invited_by_user?.username || 'en bruker'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      onClick={() => navigate(`/invites/${invite.id}`)}
                      className="flex-1 py-1 h-8 bg-cybergreen-900/30 text-cybergreen-400 hover:bg-cybergreen-900/50 hover:text-cybergreen-300"
                    >
                      Se invitasjon
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* My Groups Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-cybergold-200 mb-3">
          Mine grupper ({groups.length})
        </h2>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-cyberdark-800 border border-cyberdark-700 rounded-lg overflow-hidden p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full mt-3" />
                <Skeleton className="h-3 w-3/4 mt-2" />
                <Skeleton className="h-8 w-full mt-4" />
              </div>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-cyberdark-800 border border-dashed border-cyberdark-700 rounded-lg p-8 text-center">
            <UsersRound className="h-12 w-12 mx-auto mb-3 text-cybergold-500/50" />
            <h3 className="text-lg font-medium text-cybergold-200 mb-2">Ingen grupper ennå</h3>
            <p className="text-cybergold-400 mb-4 max-w-md mx-auto">
              Du er ikke medlem av noen grupper ennå. Opprett din egen gruppe eller finn en å bli med i.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-gradient-to-r from-cyberblue-600 to-cyberblue-800 hover:from-cyberblue-700 hover:to-cyberblue-900 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Opprett gruppe
              </Button>
              <Button
                onClick={() => navigate('/groups/discover')}
                variant="outline"
                className="border-cyberdark-600 text-cybergold-300 hover:bg-cyberdark-800 hover:text-cybergold-100"
              >
                <Search className="h-4 w-4 mr-2" />
                Finn grupper
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <div 
                key={group.id} 
                className="bg-cyberdark-800 border border-cyberdark-700 rounded-lg overflow-hidden hover:border-cyberdark-600 transition-colors cursor-pointer"
                onClick={() => navigate(`/group/${group.id}`)}
              >
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-12 w-12 rounded-md border border-cyberdark-700">
                      {group.avatar_url ? (
                        <AvatarImage src={group.avatar_url} alt={group.name} />
                      ) : (
                        <AvatarFallback className="rounded-md bg-gradient-to-br from-cyberblue-800 to-cyberblue-950 text-white font-medium">
                          {group.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-medium text-cybergold-100">{group.name}</h3>
                        {group.is_private && (
                          <Badge variant="outline" className="h-5 px-1.5 rounded-sm text-[10px] bg-cyberdark-800 border-cyberdark-600">
                            <Lock className="h-2.5 w-2.5 mr-1" /> 
                            Privat
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-cybergold-400">
                        {group.member_count} {group.member_count === 1 ? 'medlem' : 'medlemmer'}
                      </p>
                    </div>
                  </div>
                  
                  {group.description && (
                    <p className="text-sm text-cybergold-300 line-clamp-2 mt-2">{group.description}</p>
                  )}
                  
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle settings click
                        navigate(`/group/${group.id}/settings`);
                      }}
                      className="h-8 text-cybergold-400 hover:text-cybergold-100"
                    >
                      <Settings className="h-3.5 w-3.5 mr-1.5" />
                      Innstillinger
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Create Group Dialog */}
      <CreateGroupDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </div>
  );
}
