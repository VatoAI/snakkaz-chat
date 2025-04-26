import { supabase } from "@/integrations/supabase/client";
import { Group, GroupWritePermission, MessageTTLOption } from "@/types/group";
import { SecurityLevel } from "@/types/security";
import { useToast } from "@/components/ui/use-toast";
import { useCallback, useState } from "react";

export function useGroupCreation(
  currentUserId: string, 
  setGroups: (updater: (prev: Group[]) => Group[]) => void, 
  setSelectedGroup: (group: Group) => void
) {
  const { toast } = useToast();
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const handleCreateGroup = useCallback(async (
    name: string,
    members: string[],
    securityLevel: SecurityLevel,
    password?: string,
    avatar?: File,
    writePermissions: GroupWritePermission = 'all',
    defaultMessageTtl: MessageTTLOption = 86400,
    memberWritePermissions?: Record<string, boolean>
  ) => {
    // Prevent multiple simultaneous attempts
    if (isCreatingGroup) {
      toast({
        title: "Oppretter allerede gruppe",
        description: "Vennligst vent til den nåværende operasjonen er fullført",
      });
      return;
    }
    
    setIsCreatingGroup(true);
    let createdGroupId: string | null = null;
    
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
      
      // Check network connectivity
      if (!navigator.onLine) {
        toast({
          title: "Ingen nettverkstilkobling",
          description: "Du er ikke tilkoblet internett. Koble til og prøv igjen.",
          variant: "destructive"
        });
        return;
      }

      // Show progress toast
      const progressToast = toast({
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

      // Filter out invalid members but continue with valid ones
      const validMembers = members.filter(m => friendIds.includes(m));
      
      if (validMembers.length < members.length) {
        console.warn(`${members.length - validMembers.length} invalid members were filtered out`);
        // We'll show a warning toast later if we need to
      }

      // Create the group with retry logic
      let groupData;
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          const { data, error } = await supabase
            .from('groups')
            .insert({
              name: name.trim(),
              creator_id: currentUserId,
              security_level: securityLevel,
              password: password && password.trim() !== "" ? password : null,
              write_permissions: writePermissions || 'all',
              default_message_ttl: defaultMessageTtl || null
            })
            .select()
            .single();
          
          if (error) throw error;
          groupData = data;
          createdGroupId = data.id;
          break;
        } catch (error) {
          console.error(`Attempt ${retryCount + 1} failed:`, error);
          retryCount++;
          
          if (retryCount > maxRetries) {
            throw new Error('Kunne ikke opprette gruppe. Sjekk nettverkstilkobling og prøv igjen.');
          }
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (!groupData) {
        throw new Error('Kunne ikke opprette gruppe. Sjekk nettverkstilkobling og prøv igjen.');
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
        try {
          // Validate file type and size
          if (!avatar.type.startsWith('image/')) {
            throw new Error('Ugyldig filtype. Kun bildefiler er tillatt.');
          }

          if (avatar.size > 5 * 1024 * 1024) { // 5MB max
            throw new Error('Bildet er for stort. Maksimal størrelse er 5MB.');
          }
          
          const fileExt = avatar.name.split('.').pop() || 'png';
          const filePath = `${groupData.id}/${Date.now()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('group_avatars')
            .upload(filePath, avatar);

          if (uploadError) {
            throw uploadError;
          }
          
          avatarUrl = filePath;

          // Update group with avatar URL
          await supabase
            .from('groups')
            .update({ avatar_url: avatarUrl })
            .eq('id', groupData.id);
        } catch (error) {
          console.error("Error uploading avatar:", error);
          // Continue without avatar if upload fails
          toast({
            title: "Kunne ikke laste opp bilde",
            description: "Gruppen ble opprettet, men profilbildet kunne ikke lastes opp.",
            variant: "warning"
          });
        }
      }

      // Add creator as admin with write permission (retry if needed)
      let creatorMemberAdded = false;
      retryCount = 0;
      
      while (retryCount <= maxRetries && !creatorMemberAdded) {
        try {
          const { error } = await supabase
            .from('group_members')
            .insert({
              user_id: currentUserId,
              group_id: groupData.id,
              role: 'admin',
              can_write: true // Admin can always write
            });
            
          if (error) throw error;
          creatorMemberAdded = true;
        } catch (error) {
          console.error(`Attempt ${retryCount + 1} to add creator as admin failed:`, error);
          retryCount++;
          
          if (retryCount > maxRetries) {
            // If we can't add the creator as admin, we have a problem but the group exists
            // Let's warn the user but continue
            toast({
              title: "Advarsel",
              description: "Du ble ikke lagt til som administrator. Du kan måtte slette og opprette gruppen på nytt.",
              variant: "warning"
            });
            break;
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Add selected members with write permissions
      let failedMembersCount = 0;
      
      if (validMembers.length > 0) {
        const memberInserts = validMembers.map(userId => {
          let canWrite = true;
          
          if (writePermissions === 'admin') {
            canWrite = false; // Only admins can write
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

        try {
          const { error: membersError } = await supabase
            .from('group_members')
            .insert(memberInserts);
            
          if (membersError) {
            console.error("Error adding members:", membersError);
            failedMembersCount = validMembers.length;
            throw membersError;
          }
        } catch (error) {
          // Try adding members one by one instead
          console.error("Batch insert of members failed, trying individually:", error);
          
          for (const member of memberInserts) {
            try {
              const { error } = await supabase
                .from('group_members')
                .insert(member);
                
              if (error) {
                console.error(`Failed to add member ${member.user_id}:`, error);
                failedMembersCount++;
              }
            } catch (memberError) {
              console.error(`Error adding member ${member.user_id}:`, memberError);
              failedMembersCount++;
            }
          }
        }
        
        if (failedMembersCount > 0) {
          toast({
            title: "Advarsel",
            description: `${failedMembersCount} medlemmer kunne ikke legges til i gruppen. De kan inviteres senere.`,
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
        // Group exists but we couldn't fetch complete data
        // We can still try to show a basic version
        const basicGroup: Group = {
          id: groupData.id,
          name: name,
          created_at: groupData.created_at,
          creator_id: currentUserId,
          security_level: securityLevel,
          password: password || null,
          avatar_url: avatarUrl,
          write_permissions: writePermissions || 'all',
          default_message_ttl: defaultMessageTtl || null,
          members: [
            {
              id: `temp-${Date.now()}`,
              user_id: currentUserId,
              group_id: groupData.id,
              role: 'admin',
              joined_at: new Date().toISOString(),
              can_write: true,
              profile: {
                id: currentUserId,
                username: 'You',
                avatar_url: null,
                full_name: null
              }
            }
          ]
        };
        
        setGroups(prev => [...prev, basicGroup]);
        setSelectedGroup(basicGroup);
        
        toast({
          title: "Gruppe delvis opprettet",
          description: `Gruppen "${name}" ble opprettet, men noen data mangler. Oppdater siden for å se alle detaljer.`,
          variant: "warning"
        });
        
        return;
      }

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

      // Clear the progress toast
      toast({
        title: "Gruppe opprettet",
        description: `Gruppen "${name}" ble opprettet${failedMembersCount > 0 ? ', men noen medlemmer kunne ikke legges til' : ''}.`,
      });

    } catch (error) {
      console.error("Error creating group:", error);
      
      // If the group was partly created but something failed, try to clean up
      if (createdGroupId) {
        try {
          // Try to delete the partially created group
          await supabase.from('groups').delete().eq('id', createdGroupId);
        } catch (cleanupError) {
          console.error("Failed to clean up partially created group:", cleanupError);
        }
      }
      
      toast({
        title: "Kunne ikke opprette gruppe",
        description: error instanceof Error ? error.message : "En feil oppstod. Prøv igjen senere.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingGroup(false);
    }
  }, [currentUserId, toast, setGroups, setSelectedGroup, isCreatingGroup]);

  return { handleCreateGroup, isCreatingGroup };
}
