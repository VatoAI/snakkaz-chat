import { useState } from "react";
import { GroupMember } from "@/types/groups";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Crown, 
  ShieldCheck, 
  User, 
  UserMinus, 
  MoreHorizontal, 
  MessageSquare, 
  Ban, 
  AlertCircle, 
  Check, 
  Clock,
  UserCog,
  Shield,
  FileArchive,
  Star
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { UserPresence } from "@/types/presence";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GroupMembersListProps {
  members: GroupMember[];
  userProfiles: Record<string, {username: string | null, avatar_url: string | null}>;
  currentUserId: string;
  isAdmin: boolean;
  isPremiumMember: boolean;
  groupId: string;
  onRefresh: () => Promise<void>;
  onStartDirectMessage?: (userId: string) => void;
  userPresence?: Record<string, UserPresence>;
}

interface GroupRoleOption {
  value: string;
  label: string;
  icon: JSX.Element;
  premiumOnly?: boolean;
  adminOnly?: boolean;
}

export function GroupMembersList({
  members,
  userProfiles,
  currentUserId,
  isAdmin,
  isPremiumMember,
  groupId,
  onRefresh,
  onStartDirectMessage,
  userPresence = {}
}: GroupMembersListProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    userId?: string;
    action?: 'remove' | 'ban' | 'admin' | 'premium';
    title: string;
    description: string;
  }>({
    isOpen: false,
    title: '',
    description: ''
  });
  const [expandedDetails, setExpandedDetails] = useState<string | null>(null);

  const handleRemoveMember = async (userId: string) => {
    if (isProcessing[userId]) return;
    
    setIsProcessing(prev => ({ ...prev, [userId]: true }));
    
    try {
      const { data: messages, error: messagesError } = await supabase
        .from('group_messages')
        .select('id')
        .eq('group_id', groupId)
        .eq('sender_id', userId)
        .limit(1);

      if (messagesError) throw messagesError;

      if (messages && messages.length > 0) {
        const { error: updateError } = await supabase
          .from('group_messages')
          .update({
            sender_deleted: true
          })
          .eq('group_id', groupId)
          .eq('sender_id', userId);
        
        if (updateError) throw updateError;
      }

      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId);

      if (error) throw error;
      
      toast({
        title: "Bruker fjernet",
        description: "Brukeren er fjernet fra gruppen",
      });
      
      await onRefresh();
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke fjerne brukeren fra gruppen",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  const handleBanMember = async (userId: string) => {
    if (isProcessing[userId]) return;
    
    setIsProcessing(prev => ({ ...prev, [userId]: true }));
    
    try {
      await handleRemoveMember(userId);
      
      const { error } = await supabase
        .from('group_bans')
        .insert({
          group_id: groupId,
          user_id: userId,
          banned_by: currentUserId
        });

      if (error) throw error;
      
      toast({
        title: "Bruker utestengt",
        description: "Brukeren er utestengt fra gruppen",
      });
      
      await onRefresh();
    } catch (error) {
      console.error('Error banning member:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke utestenge brukeren fra gruppen",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  const handleChangeRole = async (userId: string, newRole: string) => {
    if (isProcessing[userId]) return;
    
    setIsProcessing(prev => ({ ...prev, [userId]: true }));
    
    try {
      if (!isAdmin && newRole === 'admin') {
        throw new Error("Du har ikke tillatelse til å gjøre denne brukeren til admin");
      }
      
      if ((newRole === 'premium' || newRole === 'mod') && !isPremiumMember && !isAdmin) {
        throw new Error("Du må være premiummedlem for å gi denne rollen");
      }
      
      const { error } = await supabase
        .from('group_members')
        .update({ role: newRole })
        .eq('group_id', groupId)
        .eq('user_id', userId);

      if (error) throw error;
      
      toast({
        title: "Rolle oppdatert",
        description: `Brukerens rolle er endret til ${getRoleName(newRole)}`,
      });
      
      await onRefresh();
    } catch (error: unknown) {
      console.error('Error changing role:', error);
      toast({
        title: "Feil",
        description: error instanceof Error ? error.message : "Kunne ikke endre brukerens rolle",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  const handleStartDirectMessage = (userId: string) => {
    if (onStartDirectMessage) {
      onStartDirectMessage(userId);
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'premium': return 'Premium';
      case 'mod': return 'Moderator';
      case 'member': return 'Medlem';
      default: return role;
    }
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-cyberred-600/30 border border-cyberred-500/30 text-cyberred-300">Admin</Badge>;
      case 'premium':
        return <Badge className="bg-cybergold-600/30 border border-cybergold-500/30 text-cybergold-300">Premium</Badge>;
      case 'mod':
        return <Badge className="bg-cyberblue-600/30 border border-cyberblue-500/30 text-cyberblue-300">Moderator</Badge>;
      case 'member':
      default:
        return <Badge className="bg-cyberdark-700 border border-cyberdark-600 text-gray-300">Medlem</Badge>;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-3 w-3 text-cyberred-400 mr-1" />;
      case 'premium':
        return <Star className="h-3 w-3 text-cybergold-400 mr-1" />;
      case 'mod':
        return <ShieldCheck className="h-3 w-3 text-cyberblue-400 mr-1" />;
      case 'member':
      default:
        return <User className="h-3 w-3 text-gray-400 mr-1" />;
    }
  };

  const getOnlineStatusColor = (userId: string) => {
    const status = userPresence[userId]?.status;
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'brb': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const isUserOnline = (userId: string) => {
    const status = userPresence[userId]?.status;
    return status && status !== 'offline';
  };
  
  const getLastSeen = (userId: string) => {
    const presence = userPresence[userId];
    if (!presence || presence.status !== 'offline' || !presence.last_seen) return null;
    
    try {
      return formatDistanceToNow(new Date(presence.last_seen), { 
        addSuffix: true,
        locale: nb
      });
    } catch (e) {
      return null;
    }
  };
  
  const roleOptions: GroupRoleOption[] = [
    {
      value: 'admin',
      label: 'Administrator',
      icon: <Crown className="h-4 w-4 text-cyberred-400 mr-2" />,
      adminOnly: true
    },
    {
      value: 'premium',
      label: 'Premium',
      icon: <Star className="h-4 w-4 text-cybergold-400 mr-2" />,
      premiumOnly: true
    },
    {
      value: 'mod',
      label: 'Moderator',
      icon: <ShieldCheck className="h-4 w-4 text-cyberblue-400 mr-2" />,
      premiumOnly: true
    },
    {
      value: 'member',
      label: 'Medlem',
      icon: <User className="h-4 w-4 text-gray-400 mr-2" />
    }
  ];

  const sortedMembers = [...members].sort((a, b) => {
    const rolePriority: Record<string, number> = { 
      'admin': 0, 
      'premium': 1, 
      'mod': 2, 
      'member': 3 
    };
    const roleA = rolePriority[a.role] || 99;
    const roleB = rolePriority[b.role] || 99;
    if (roleA !== roleB) return roleA - roleB;
    
    const aStatus = userPresence[a.user_id]?.status || 'offline';
    const bStatus = userPresence[b.user_id]?.status || 'offline';
    
    if (aStatus === 'online' && bStatus !== 'online') return -1;
    if (bStatus === 'online' && aStatus !== 'online') return 1;
    if (aStatus === 'brb' && bStatus !== 'online' && bStatus !== 'brb') return -1;
    if (bStatus === 'brb' && aStatus !== 'online' && aStatus !== 'brb') return 1;
    if (aStatus === 'busy' && bStatus === 'offline') return -1;
    if (bStatus === 'busy' && aStatus === 'offline') return 1;
    
    const aName = userProfiles[a.user_id]?.username || a.user_id;
    const bName = userProfiles[b.user_id]?.username || b.user_id;
    return aName.localeCompare(bName);
  });

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
      {sortedMembers.map((member) => {
        const profile = userProfiles[member.user_id] || { username: 'Ukjent bruker', avatar_url: null };
        const isCurrentUser = member.user_id === currentUserId;
        const isMemberPremium = member.role === 'premium' || member.role === 'admin';
        const isPending = isProcessing[member.user_id] || false;
        const memberIsOnline = isUserOnline(member.user_id);
        const lastSeen = getLastSeen(member.user_id);
        const isExpanded = expandedDetails === member.user_id;
        
        return (
          <div 
            key={member.id || member.user_id} 
            className={cn(
              "transition-all duration-300",
              isExpanded ? "mb-3" : "mb-1"
            )}
          >
            <div className={cn(
              "flex items-center justify-between p-3 rounded-md transition-colors",
              isCurrentUser ? 'bg-cyberdark-800/70 border border-cybergold-500/20' : 'bg-cyberdark-800',
              !isCurrentUser && 'hover:bg-cyberdark-750'
            )}>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-cybergold-500/20">
                    {profile.avatar_url ? (
                      <AvatarImage 
                        src={profile.avatar_url.startsWith('avatars/') 
                          ? supabase.storage.from('avatars').getPublicUrl(profile.avatar_url.replace('avatars/', '')).data.publicUrl
                          : profile.avatar_url
                        } 
                        alt={profile.username || 'Bruker'} 
                      />
                    ) : (
                      <AvatarFallback className="bg-cyberdark-700 text-cybergold-400">
                        {(profile.username?.[0] || 'U').toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <span className={cn(
                          "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-cyberdark-800",
                          getOnlineStatusColor(member.user_id)
                        )} />
                      </TooltipTrigger>
                      <TooltipContent className="bg-cyberdark-800 border-cyberdark-700 text-xs py-1 px-2">
                        <p>
                          {memberIsOnline 
                            ? `${userPresence[member.user_id]?.status === 'online' 
                                ? 'Pålogget' 
                                : userPresence[member.user_id]?.status === 'busy'
                                  ? 'Opptatt'
                                  : 'Straks tilbake'}`
                            : lastSeen 
                              ? `Sist sett ${lastSeen}` 
                              : 'Avlogget'
                          }
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {isMemberPremium && (
                    <span className="absolute top-0 left-0 h-3.5 w-3.5 rounded-full bg-cybergold-500 border border-cyberdark-800 flex items-center justify-center">
                      <Crown className="h-2 w-2 text-cyberdark-950" />
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm flex items-center gap-1">
                    {getRoleIcon(member.role)}
                    {profile.username || member.user_id.substring(0, 8)}
                    {isCurrentUser && <span className="text-xs text-cybergold-500/70">(deg)</span>}
                  </p>
                  <div className="flex items-center mt-1">
                    {getRoleBadge(member.role)}
                    
                    {member.storage_quota && (
                      <span className="text-xs text-cybergold-500/70 ml-2">
                        {(member.storage_quota / 1024 / 1024).toFixed(1)}MB lagring
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {!isCurrentUser && !isPending && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0 rounded-full",
                      memberIsOnline ? "text-cyberblue-400 hover:text-cyberblue-300" : "text-gray-500 hover:text-gray-400"
                    )}
                    onClick={() => handleStartDirectMessage(member.user_id)}
                    title="Send melding"
                    disabled={!memberIsOnline}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full text-cybergold-500/70 hover:text-cybergold-400"
                  onClick={() => setExpandedDetails(isExpanded ? null : member.user_id)}
                  title={isExpanded ? "Vis mindre" : "Vis mer"}
                >
                  {isExpanded ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <MoreHorizontal className="h-4 w-4" />
                  )}
                </Button>
                
                {isAdmin && !isCurrentUser && !isPending && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full text-cybergold-500/70 hover:text-cybergold-400"
                      >
                        <UserCog className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-cyberdark-900 border-cybergold-500/30">
                      <DropdownMenuLabel className="text-xs text-cybergold-500/70">
                        Administrer bruker
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-cybergold-500/20" />
                      
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="hover:bg-cyberdark-800 focus:bg-cyberdark-800">
                          <UserCog className="h-4 w-4 mr-2 text-cybergold-400" />
                          <span>Endre rolle</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent className="bg-cyberdark-900 border-cybergold-500/30">
                            {roleOptions.map(option => (
                              <DropdownMenuItem 
                                key={option.value}
                                className={cn(
                                  "hover:bg-cyberdark-800 focus:bg-cyberdark-800",
                                  member.role === option.value && "bg-cyberdark-800",
                                  (option.adminOnly && !isAdmin) && "opacity-50 cursor-not-allowed",
                                  (option.premiumOnly && !isPremiumMember && !isAdmin) && "opacity-50 cursor-not-allowed"
                                )}
                                disabled={
                                  (option.adminOnly && !isAdmin) ||
                                  (option.premiumOnly && !isPremiumMember && !isAdmin) ||
                                  member.role === option.value
                                }
                                onClick={() => {
                                  if (
                                    option.value === 'admin' ||
                                    option.value === 'premium'
                                  ) {
                                    setConfirmDialog({
                                      isOpen: true,
                                      userId: member.user_id,
                                      action: option.value === 'admin' ? 'admin' : 'premium',
                                      title: `Sett bruker som ${option.label}?`,
                                      description: `Er du sikker på at du vil gi ${profile.username || 'denne brukeren'} ${option.label.toLowerCase()}-rettigheter?`
                                    });
                                  } else {
                                    handleChangeRole(member.user_id, option.value);
                                  }
                                }}
                              >
                                {option.icon}
                                <span>{option.label}</span>
                                {member.role === option.value && (
                                  <Check className="h-4 w-4 ml-auto text-cybergold-500" />
                                )}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      
                      <DropdownMenuSeparator className="bg-cybergold-500/20" />
                      
                      <DropdownMenuItem 
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/30 focus:bg-red-950/30"
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            userId: member.user_id,
                            action: 'remove',
                            title: 'Fjern bruker fra gruppen?',
                            description: `Er du sikker på at du vil fjerne ${profile.username || 'denne brukeren'} fra gruppen?`
                          });
                        }}
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        <span>Fjern fra gruppe</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/30 focus:bg-red-950/30"
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            userId: member.user_id,
                            action: 'ban',
                            title: 'Utesteng bruker fra gruppen?',
                            description: `Er du sikker på at du vil utestenge ${profile.username || 'denne brukeren'} fra gruppen? Brukeren vil ikke kunne bli med igjen.`
                          });
                        }}
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        <span>Utesteng fra gruppe</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            
            {isExpanded && (
              <div className="bg-cyberdark-850 p-3 mt-0.5 rounded-md border border-cyberdark-750">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-cybergold-500/70" />
                      <span className="text-xs text-cybergold-400">Medlem siden:</span>
                      <span className="text-xs text-gray-300">
                        {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString('nb-NO') : 'Ukjent'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-cybergold-500/70" />
                      <span className="text-xs text-cybergold-400">Tillatelser:</span>
                      <span className="text-xs text-gray-300">
                        {member.permissions || 'Standard'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <FileArchive className="h-3.5 w-3.5 text-cybergold-500/70" />
                      <span className="text-xs text-cybergold-400">Lagring:</span>
                      <span className="text-xs text-gray-300">
                        {member.storage_quota 
                          ? `${(member.storage_quota / 1024 / 1024).toFixed(1)}MB` 
                          : 'Standard'
                        }
                      </span>
                    </div>
                    
                    {member.lastActive && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-cybergold-500/70" />
                        <span className="text-xs text-cybergold-400">Sist aktiv:</span>
                        <span className="text-xs text-gray-300">
                          {formatDistanceToNow(new Date(member.lastActive), {
                            addSuffix: true,
                            locale: nb
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <Dialog open={confirmDialog.isOpen} onOpenChange={(isOpen) => !isOpen && setConfirmDialog({ ...confirmDialog, isOpen: false })}>
        <DialogContent className="bg-cyberdark-900 border-cybergold-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-cybergold-400">{confirmDialog.title}</DialogTitle>
            <DialogDescription className="text-gray-300">{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="bg-transparent border-cyberdark-700 text-white">
                Avbryt
              </Button>
            </DialogClose>
            <Button
              variant={confirmDialog.action === 'ban' ? 'destructive' : 'default'}
              className={cn(
                confirmDialog.action === 'remove' && "bg-red-800 text-white hover:bg-red-700",
                confirmDialog.action === 'admin' && "bg-cyberred-800 text-white hover:bg-cyberred-700",
                confirmDialog.action === 'premium' && "bg-cybergold-600 text-black hover:bg-cybergold-500",
              )}
              onClick={() => {
                if (confirmDialog.userId) {
                  if (confirmDialog.action === 'remove') {
                    handleRemoveMember(confirmDialog.userId);
                  } else if (confirmDialog.action === 'ban') {
                    handleBanMember(confirmDialog.userId);
                  } else if (confirmDialog.action === 'admin') {
                    handleChangeRole(confirmDialog.userId, 'admin');
                  } else if (confirmDialog.action === 'premium') {
                    handleChangeRole(confirmDialog.userId, 'premium');
                  }
                }
                setConfirmDialog({ ...confirmDialog, isOpen: false });
              }}
            >
              {confirmDialog.action === 'remove' && 'Fjern'}
              {confirmDialog.action === 'ban' && 'Utesteng'}
              {confirmDialog.action === 'admin' && 'Gi admin-rolle'}
              {confirmDialog.action === 'premium' && 'Gi premium-rolle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}