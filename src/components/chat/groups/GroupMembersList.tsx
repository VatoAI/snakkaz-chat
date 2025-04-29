import { useState } from "react";
import { GroupMember } from "@/types/groups";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Crown, ShieldCheck, User, ExternalLink, MoreHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface GroupMembersListProps {
  members: GroupMember[];
  userProfiles: Record<string, {username: string | null, avatar_url: string | null}>;
  currentUserId: string;
  isAdmin: boolean;
  isPremiumMember: boolean;
  groupId: string;
  onRefresh: () => Promise<void>;
}

export function GroupMembersList({
  members,
  userProfiles,
  currentUserId,
  isAdmin,
  isPremiumMember,
  groupId,
  onRefresh
}: GroupMembersListProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});

  const handlePromoteToPremium = async (userId: string) => {
    if (!isAdmin) {
      toast({
        title: "Manglende tillatelse",
        description: "Bare gruppeadministratorer kan tildele premium-medlemskap",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(prev => ({ ...prev, [userId]: true }));

    try {
      const { error } = await supabase
        .from('group_members')
        .update({
          role: 'premium',
          storage_quota: 5120, // 5GB i MB
          premium_features: ['enhanced_encryption', 'unlimited_storage', 'file_sharing', 'message_editing']
        })
        .eq('user_id', userId)
        .eq('group_id', groupId);
      
      if (error) throw error;
      
      toast({
        title: "Medlemskap oppdatert",
        description: "Brukeren har nå premium-medlemskap i gruppen",
      });
      
      await onRefresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Feil ved oppdatering av medlemskap",
        description: error.message || "Det oppstod en feil. Prøv igjen senere.",
      });
    } finally {
      setIsProcessing(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handlePromoteToModerator = async (userId: string) => {
    if (!isAdmin) {
      toast({
        title: "Manglende tillatelse",
        description: "Bare gruppeadministratorer kan endre roller",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(prev => ({ ...prev, [userId]: true }));

    try {
      const { error } = await supabase
        .from('group_members')
        .update({
          role: 'moderator',
        })
        .eq('user_id', userId)
        .eq('group_id', groupId);
      
      if (error) throw error;
      
      toast({
        title: "Rolle oppdatert",
        description: "Brukeren er nå moderator i gruppen",
      });
      
      await onRefresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Feil ved oppdatering av rolle",
        description: error.message || "Det oppstod en feil. Prøv igjen senere.",
      });
    } finally {
      setIsProcessing(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!isAdmin) {
      toast({
        title: "Manglende tillatelse",
        description: "Bare gruppeadministratorer kan fjerne medlemmer",
        variant: "destructive"
      });
      return;
    }

    if (userId === currentUserId) {
      toast({
        title: "Kan ikke fjerne deg selv",
        description: "Du kan ikke fjerne deg selv fra gruppen",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(prev => ({ ...prev, [userId]: true }));

    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('user_id', userId)
        .eq('group_id', groupId);
      
      if (error) throw error;
      
      toast({
        title: "Medlem fjernet",
        description: "Brukeren er fjernet fra gruppen",
      });
      
      await onRefresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Feil ved fjerning av medlem",
        description: error.message || "Det oppstod en feil. Prøv igjen senere.",
      });
    } finally {
      setIsProcessing(prev => ({ ...prev, [userId]: false }));
    }
  };

  // Sorterer medlemmer etter rolle
  const sortedMembers = [...members].sort((a, b) => {
    const roleOrder = { admin: 0, premium: 1, moderator: 2, member: 3 };
    return roleOrder[a.role] - roleOrder[b.role];
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-cyberred-600/30 border border-cyberred-500/30 text-cyberred-300">Admin</Badge>;
      case 'premium':
        return <Badge className="bg-cybergold-600/30 border border-cybergold-500/30 text-cybergold-300">Premium</Badge>;
      case 'moderator':
        return <Badge className="bg-cyberblue-600/30 border border-cyberblue-500/30 text-cyberblue-300">Moderator</Badge>;
      default:
        return <Badge className="bg-cyberdark-700 text-cyberdark-300">Medlem</Badge>;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="h-4 w-4 text-cyberred-400" />;
      case 'premium':
        return <Crown className="h-4 w-4 text-cybergold-400" />;
      case 'moderator':
        return <ShieldCheck className="h-4 w-4 text-cyberblue-400" />;
      default:
        return <User className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
      {sortedMembers.map((member) => {
        const profile = userProfiles[member.user_id] || { username: 'Ukjent bruker', avatar_url: null };
        const isCurrentUser = member.user_id === currentUserId;
        const isMemberPremium = member.role === 'premium';
        const isPending = isProcessing[member.user_id] || false;
        
        return (
          <div 
            key={member.id || member.user_id} 
            className={`flex items-center justify-between p-3 rounded-md ${isCurrentUser ? 'bg-cyberdark-800/70 border border-cybergold-500/20' : 'bg-cyberdark-800'}`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-cybergold-500/20">
                  {profile.avatar_url ? (
                    <AvatarImage src={profile.avatar_url} alt={profile.username || 'Bruker'} />
                  ) : (
                    <AvatarFallback className="bg-cyberdark-700 text-cybergold-400">
                      {(profile.username?.[0] || 'U').toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                {isMemberPremium && (
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-cybergold-500 border border-cyberdark-800 flex items-center justify-center">
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
                      {(member.storage_quota / 1024).toFixed(1)}GB lagring
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {isAdmin && !isCurrentUser && !isPending && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Åpne handlingsmeny">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-cyberdark-800 border border-cybergold-500/30">
                  {member.role !== 'premium' && (
                    <DropdownMenuItem
                      onClick={() => handlePromoteToPremium(member.user_id)}
                      className="text-cybergold-400 hover:bg-cyberdark-700 cursor-pointer flex items-center"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Tildel premium-medlemskap
                    </DropdownMenuItem>
                  )}
                  
                  {member.role !== 'moderator' && member.role !== 'admin' && (
                    <DropdownMenuItem
                      onClick={() => handlePromoteToModerator(member.user_id)}
                      className="text-cyberblue-400 hover:bg-cyberdark-700 cursor-pointer flex items-center"
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Gjør til moderator
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator className="bg-cybergold-500/20" />
                  
                  <DropdownMenuItem
                    onClick={() => handleRemoveMember(member.user_id)}
                    className="text-cyberred-400 hover:bg-cyberdark-700 cursor-pointer flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Fjern fra gruppen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {isPending && (
              <div className="h-6 w-6 border-2 border-t-transparent border-cybergold-500/50 rounded-full animate-spin"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}