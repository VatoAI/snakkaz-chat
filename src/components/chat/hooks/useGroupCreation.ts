import { supabase } from "@/integrations/supabase/client";
import { Group, GroupWritePermission, MessageTTLOption } from "@/types/group";
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
    avatar?: File,
    writePermissions: GroupWritePermission = 'all',
    defaultMessageTtl: MessageTTLOption = 86400,
    memberWritePermissions?: Record<string, boolean>
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

      // Create the group with new fields
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert({
          name,
          creator_id: currentUserId,
          security_level: securityLevel,
          password: password || null,
          // New fields
          write_permissions: writePermissions,
          default_message_ttl: defaultMessageTtl
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

      // Add creator as admin med skrivetillatelse
      await supabase
        .from('group_members')
        .insert({
          user_id: currentUserId,
          group_id: groupData.id,
          role: 'admin',
          can_write: true // Admin kan alltid skrive
        });

      // Add selected members med skrivetillatelser
      if (members.length > 0) {
        const memberInserts = members.map(userId => {
          // Sjekk om medlemmet har spesifikk skrivetillatelse
          // Standard er: 
          // - Ingen skrivetillatelse hvis writePermissions === 'admin' 
          // - Spesifikk skrivetillatelse hvis writePermissions === 'selected'
          // - Alle kan skrive hvis writePermissions === 'all'
          let canWrite = true;
          
          if (writePermissions === 'admin') {
            canWrite = false; // Kun administratorer kan skrive
          } else if (writePermissions === 'selected') {
            canWrite = memberWritePermissions?.[userId] ?? false;
          }
          
          return {
            user_id: userId,
            group_id: groupData.id,
            role: 'member',
            can_write: canWrite
          };
        });

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
            can_write,
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

      // Cast the returned data with proper type assertions
      const newGroup: Group = {
        id: completeGroup.id,
        name: completeGroup.name,
        created_at: completeGroup.created_at,
        creator_id: completeGroup.creator_id,
        security_level: completeGroup.security_level as SecurityLevel,
        write_permissions: (completeGroup.write_permissions || 'all') as GroupWritePermission,
        default_message_ttl: completeGroup.default_message_ttl as MessageTTLOption,
        members: completeGroup.members.map((m: any) => ({
          ...m,
          profile: m.profiles,
          can_write: m.can_write !== false // Default to true if not specified
        })),
        // Add other optional fields
        password: completeGroup.password,
        avatar_url: completeGroup.avatar_url
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
