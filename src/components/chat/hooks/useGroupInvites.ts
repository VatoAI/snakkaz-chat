
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GroupInvite } from "@/types/group";

interface UseGroupInvitesProps {
  currentUserId: string;
  userProfiles: Record<string, { username: string | null, avatar_url: string | null }>;
}

export function useGroupInvites({ currentUserId, userProfiles }: UseGroupInvitesProps) {
  const [groupInvites, setGroupInvites] = useState<GroupInvite[]>([]);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const { data, error } = await supabase
          .from('group_invites')
          .select(`
            id, 
            group_id, 
            invited_by, 
            created_at, 
            expires_at,
            groups(name)
          `)
          .eq('invited_user_id', currentUserId)
          .lte('expires_at', new Date(Date.now() + 7*24*60*60*1000).toISOString())
          .gte('expires_at', new Date().toISOString());

        if (error) throw error;

        if (data) {
          const invites: GroupInvite[] = data.map(item => ({
            id: item.id,
            group_id: item.group_id,
            invited_by: item.invited_by,
            invited_user_id: currentUserId,
            created_at: item.created_at,
            expires_at: item.expires_at,
            group_name: item.groups?.name,
            sender_username: userProfiles[item.invited_by]?.username || null
          }));

          setGroupInvites(invites);
        }
      } catch (error) {
        console.error("Error fetching group invites:", error);
      }
    };

    if (currentUserId) {
      fetchInvites();

      const channel = supabase.channel('group-invites')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'group_invites',
          filter: `invited_user_id=eq.${currentUserId}`
        }, () => {
          fetchInvites();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentUserId, userProfiles]);

  return {
    groupInvites,
    setGroupInvites,
  };
}
