import { supabase } from "@/integrations/supabase/client";
import { Group, GroupWritePermission, MessageTTLOption } from "@/types/group";
import { SecurityLevel } from "@/types/security";
import { useToast } from "@/components/ui/use-toast";
import { useCallback } from "react";

export function useGroupCreation(
  currentUserId: string, 
  setGroups: (updater: (prev: Group[]) => Group[]) => void, 
  setSelectedGroup: (group: Group) => void
) {
  const { toast } = useToast();

  const handleCreateGroup = useCallback(async (
    name: string,
    members: string[],
    securityLevel: SecurityLevel,
    password?: string,
    avatar?: File,
    writePermissions: GroupWritePermission = 'all',
    defaultMessageTtl: MessageTTLOption = null,
    memberWritePermissions?: Record<string, boolean>
  ) => {
    try {
      // Validate inputs
      if (!name || name.trim() === '') {
        toast({
          title: "Mangler gruppenavn",
          description: "Vennligst skriv inn et gyldig gruppenavn",
          variant: "destructive"
        });
        return;
      }
      
      if (!currentUserId) {
        toast({
          title: "Ikke pålogget",
          description: "Du må være pålogget for å opprette en gruppe",
          variant: "destructive"
        });
        return;
      }
      
      if (!navigator.onLine) {
        toast({
          title: "Ingen nettverkstilkobling",
          description: "Du er ikke tilkoblet internett. Koble til og prøv igjen.",
          variant: "destructive"
        });
        return;
      }

      // Show progress toast
      toast({
        title: "Oppretter gruppe",
        description: "Vennligst vent mens gruppen opprettes...",
      });

      // Validate members are friends
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select('friend_id, user_id')
        .eq('status', 'accepted')
        .or(`user_id.eq.${currentUserId},friend_id.eq.${currentUserId}`);

      if (friendshipsError) {
        console.error("Error fetching friendships:", friendshipsError);
        throw new Error('Kunne ikke hente vennelisten din. Prøv igjen senere.');
      }

      const friendIds = friendships.map(f => 
        f.user_id === currentUserId ? f.friend_id : f.user_id
      );

      const invalidMembers = members.filter(m => !friendIds.includes(m));
      if (invalidMembers.length > 0) {
        throw new Error('Noen utvalgte brukere er ikke i vennelisten din');
      }

      // Create the group
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert({
          name,
          creator_id: currentUserId,
          security_level: securityLevel,
          password: password || null,
          write_permissions: writePermissions,
          default_message_ttl: defaultMessageTtl
        })
        .select()
        .single();

      if (groupError) {
        console.error("Error creating group:", groupError);
        throw new Error('Kunne ikke opprette gruppe. Sjekk nettverkstilkobling og prøv igjen.');
      }

      // Upload avatar if provided
      let avatarUrl = null;
      if (avatar) {
        // Validate file type and size
        if (!avatar.type.startsWith('image/')) {
          throw new Error('Ugyldig filtype. Kun bildefiler er tillatt.');
        }

        if (avatar.size > 5 * 1024 * 1024) { // 5MB max
          throw new Error('Bildet er for stort. Maksimal størrelse er 5MB.');
        }
        
        const fileExt = avatar.name.split('.').pop();
        const filePath = `${groupData.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('group_avatars')
          .upload(filePath, avatar);

        if (uploadError) {
          console.error("Error uploading avatar:", uploadError);
          // Continue without avatar if upload fails
          toast({
            title: "Kunne ikke laste opp bilde",
            description: "Gruppen ble opprettet, men profilbildet kunne ikke lastes opp.",
            variant: "warning"
          });
        } else {
          avatarUrl = filePath;

          // Update group with avatar URL
          await supabase
            .from('groups')
            .update({ avatar_url: avatarUrl })
            .eq('id', groupData.id);
        }
      }

      // Add creator as admin med skrivetillatelse
      const { error: creatorError } = await supabase
        .from('group_members')
        .insert({
          user_id: currentUserId,
          group_id: groupData.id,
          role: 'admin',
          can_write: true // Admin kan alltid skrive
        });
        
      if (creatorError) {
        console.error("Error adding creator as admin:", creatorError);
        throw new Error('Kunne ikke legge til deg som administrator. Prøv å slette og opprette gruppen på nytt.');
      }

      // Add selected members med skrivetillatelser
      if (members.length > 0) {
        const memberInserts = members.map(userId => {
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

        const { error: membersError } = await supabase
          .from('group_members')
          .insert(memberInserts);
          
        if (membersError) {
          console.error("Error adding members:", membersError);
          // Continue with group creation even if some members couldn't be added
          toast({
            title: "Advarsel",
            description: "Gruppen ble opprettet, men noen medlemmer kunne ikke legges til.",
            variant: "warning"
          });
        }
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

      if (completeError) {
        console.error("Error fetching complete group:", completeError);
        throw new Error('Gruppen ble opprettet, men kunne ikke lastes fullstendig. Oppdater siden.');
      }

      const newGroup: Group = {
        ...completeGroup,
        security_level: completeGroup.security_level as SecurityLevel,
        write_permissions: (completeGroup.write_permissions || 'all') as GroupWritePermission,
        members: completeGroup.members.map((m: any) => ({
          ...m,
          profile: m.profiles,
          can_write: m.can_write !== false // Default til true hvis ikke spesifisert
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
  }, [currentUserId, toast, setGroups, setSelectedGroup]);

  return { handleCreateGroup };
}
