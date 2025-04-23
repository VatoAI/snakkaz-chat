
import { supabase } from "@/integrations/supabase/client";
import { Group } from "@/types/group";
import { SecurityLevel } from "@/types/security";
import { useToast } from "@/components/ui/use-toast";

export function useGroupCreation(
  currentUserId: string, 
  setGroups: (updater: (prev: Group[]) => Group[]) => void, 
  setSelectedGroup: (group: Group) => void
) {
  const { toast } = useToast();

  const handleCreateGroup = async (
    name: string,
    members: string[],
    securityLevel: SecurityLevel,
    password?: string,
    avatar?: File
  ) => {
    try {
      // Validate members are friends
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select('friend_id, user_id')
        .eq('status', 'accepted')
        .or(`user_id.eq.${currentUserId},friend_id.eq.${currentUserId}`);

      if (friendshipsError) throw friendshipsError;

      const friendIds = friendships.map(f => 
        f.user_id === currentUserId ? f.friend_id : f.user_id
      );

      const invalidMembers = members.filter(m => !friendIds.includes(m));
      if (invalidMembers.length > 0) {
        throw new Error('Some selected users are not in your friends list');
      }

      // Create the group
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert({
          name,
          creator_id: currentUserId,
          security_level: securityLevel,
          password: password || null
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Upload avatar if provided
      let avatarUrl = null;
      if (avatar) {
        const fileExt = avatar.name.split('.').pop();
        const filePath = `${groupData.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('group_avatars')
          .upload(filePath, avatar);

        if (uploadError) throw uploadError;

        avatarUrl = filePath;

        // Update group with avatar URL
        await supabase
          .from('groups')
          .update({ avatar_url: avatarUrl })
          .eq('id', groupData.id);
      }

      // Add creator as admin
      await supabase
        .from('group_members')
        .insert({
          user_id: currentUserId,
          group_id: groupData.id,
          role: 'admin'
        });

      // Add selected members
      if (members.length > 0) {
        const memberInserts = members.map(userId => ({
          user_id: userId,
          group_id: groupData.id,
          role: 'member'
        }));

        await supabase
          .from('group_members')
          .insert(memberInserts);
      }

      // Fetch complete group data with members
      const { data: completeGroup, error: completeError } = await supabase
        .from('groups')
        .select(`
          *,
          members:group_members (
            id,
            user_id,
            role,
            joined_at,
            profiles:user_id (
              id,
              username,
              avatar_url,
              full_name
            )
          )
        `)
        .eq('id', groupData.id)
        .single();

      if (completeError) throw completeError;

      const newGroup: Group = {
        ...completeGroup,
        security_level: completeGroup.security_level as SecurityLevel,
        members: completeGroup.members.map((m: any) => ({
          ...m,
          profile: m.profiles
        }))
      };

      setGroups(prev => [...prev, newGroup]);
      setSelectedGroup(newGroup);

      toast({
        title: "Gruppe opprettet",
        description: `Gruppen "${name}" ble opprettet`,
      });

    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Kunne ikke opprette gruppe",
        description: error instanceof Error ? error.message : "En feil oppstod. Prøv igjen senere.",
        variant: "destructive",
      });
    }
  };

  return { handleCreateGroup };
}
