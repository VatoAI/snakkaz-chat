import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Group, GroupMessage, GroupType, GroupRole, GroupPermission, GroupMember } from '@/types/group';
import { useSignalProtocol } from '@/hooks/useSignalProtocol';

/**
 * Enhanced Group Chat Hook for Snakkaz
 * Inspired by Telegram's group architecture with Signal's encryption
 */
export const useGroupChat = (groupId?: string) => {
  const [group, setGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<GroupRole | null>(null);
  const { user } = useAuth();
  const signalProtocol = useSignalProtocol();

  // Funksjon for å laste inn gruppedetaljer
  const loadGroup = useCallback(async () => {
    if (!groupId || !user) return;

    try {
      setLoading(true);
      setError(null);

      // Hent gruppedetaljer
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (groupError) throw groupError;
      
      // Hent medlemmer
      const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select('*, user:users(id, display_name, avatar_url)')
        .eq('group_id', groupId);

      if (membersError) throw membersError;

      // Finn gjeldende brukers rolle
      const currentUserMember = membersData.find(m => m.user_id === user.id);
      if (currentUserMember) {
        setUserRole(currentUserMember.role);
      }

      // Formater gruppedata
      const formattedGroup: Group = {
        id: groupData.id,
        name: groupData.name,
        description: groupData.description,
        avatarUrl: groupData.avatar_url,
        createdAt: new Date(groupData.created_at),
        createdBy: groupData.created_by,
        updatedAt: new Date(groupData.updated_at),
        type: groupData.type,
        memberCount: membersData.length,
        members: membersData.map((m: any) => ({
          userId: m.user_id,
          addedAt: new Date(m.added_at),
          addedBy: m.added_by,
          role: m.role,
          permissions: m.permissions || [],
          status: m.status,
          displayName: m.user?.display_name,
          lastReadMessageId: m.last_read_message_id
        })),
        settings: {
          autoDeleteMessagesAfter: groupData.auto_delete_messages_after,
          allowInviteLinks: groupData.allow_invite_links,
          joinApprovalRequired: groupData.join_approval_required,
          disappearingMessagesEnabled: groupData.disappearing_messages_enabled,
          screenshotNotificationsEnabled: groupData.screenshot_notifications_enabled,
          isEncrypted: groupData.is_encrypted,
          encryptionAlgorithm: groupData.encryption_algorithm,
          maxMembers: groupData.max_members,
          isDiscoverable: groupData.is_discoverable,
          slowMode: groupData.slow_mode
        },
        inviteLink: groupData.invite_link,
        pinnedMessageIds: groupData.pinned_message_ids,
        isVerified: groupData.is_verified,
        reactionAllowed: groupData.reaction_allowed,
        lastActivity: groupData.last_activity ? new Date(groupData.last_activity) : undefined,
        isArchived: groupData.is_archived,
        parentGroupId: groupData.parent_group_id
      };

      setGroup(formattedGroup);
      setMembers(formattedGroup.members);
      setLoading(false);
      
      // Etter at gruppe er lastet, hent meldinger
      await loadMessages();
    } catch (err: any) {
      console.error('Feil ved lasting av gruppedata:', err);
      setError(err.message || 'Kunne ikke laste gruppedata');
      setLoading(false);
    }
  }, [groupId, user]);

  // Henter meldinger med real-time oppdateringer som i Telegram
  const loadMessages = useCallback(async (limit = 50) => {
    if (!groupId || !user) return;

    try {
      // Hent meldinger
      const { data: messagesData, error: messagesError } = await supabase
        .from('group_messages')
        .select('*, user:users(id, display_name, avatar_url)')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (messagesError) throw messagesError;

      // Formater og dekrypter meldinger hvis gruppen er kryptert
      let formattedMessages = await Promise.all(messagesData.map(async (m: any) => {
        const message: GroupMessage = {
          id: m.id,
          groupId: m.group_id,
          senderId: m.sender_id,
          text: m.text,
          mediaUrl: m.media_url,
          mediaType: m.media_type,
          replyToId: m.reply_to_id,
          forwardedFrom: m.forwarded_from,
          editedAt: m.edited_at ? new Date(m.edited_at) : undefined,
          createdAt: new Date(m.created_at),
          readBy: m.read_by || [],
          reactions: m.reactions || {},
          isPinned: m.is_pinned,
          isServiceMessage: m.is_service_message,
          ttl: m.ttl,
          pollData: m.poll_data
        };

        // Dekrypter meldingen hvis gruppen er kryptert (som i Signal)
        if (group?.settings.isEncrypted && message.text) {
          try {
            message.text = await signalProtocol.decryptGroupMessage(
              message.text,
              groupId,
              message.senderId
            );
          } catch (err) {
            console.error('Kunne ikke dekryptere melding:', err);
            message.text = '[Kryptert melding]';
          }
        }

        return message;
      }));

      // Sorter meldinger etter tidspunkt, eldste først
      formattedMessages = formattedMessages.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      setMessages(formattedMessages);
    } catch (err: any) {
      console.error('Feil ved lasting av meldinger:', err);
    }
  }, [groupId, user, group, signalProtocol]);

  // Abonner på realtime oppdateringer for nye meldinger (Telegram-lignende)
  useEffect(() => {
    if (!groupId || !user) return;

    const subscription = supabase
      .channel(`group-${groupId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'group_messages', 
        filter: `group_id=eq.${groupId}` 
      }, async (payload) => {
        const newMessage = payload.new as any;
        
        // Formater og dekrypter om nødvendig
        let message: GroupMessage = {
          id: newMessage.id,
          groupId: newMessage.group_id,
          senderId: newMessage.sender_id,
          text: newMessage.text,
          mediaUrl: newMessage.media_url,
          mediaType: newMessage.media_type,
          replyToId: newMessage.reply_to_id,
          forwardedFrom: newMessage.forwarded_from,
          editedAt: newMessage.edited_at ? new Date(newMessage.edited_at) : undefined,
          createdAt: new Date(newMessage.created_at),
          readBy: newMessage.read_by || [],
          reactions: newMessage.reactions || {},
          isPinned: newMessage.is_pinned,
          isServiceMessage: newMessage.is_service_message,
          ttl: newMessage.ttl,
          pollData: newMessage.poll_data
        };

        // Dekrypter hvis gruppen er kryptert
        if (group?.settings.isEncrypted && message.text) {
          try {
            message.text = await signalProtocol.decryptGroupMessage(
              message.text,
              groupId,
              message.senderId
            );
          } catch (err) {
            console.error('Kunne ikke dekryptere melding:', err);
            message.text = '[Kryptert melding]';
          }
        }

        // Legg til den nye meldingen i listen
        setMessages(prev => [...prev, message]);

        // Marker som lest
        markMessageAsRead(message.id);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'group_messages',
        filter: `group_id=eq.${groupId}`
      }, async (payload) => {
        const updatedMessage = payload.new as any;
        
        setMessages(prev => prev.map(m => 
          m.id === updatedMessage.id ? {
            ...m,
            text: updatedMessage.text,
            editedAt: updatedMessage.edited_at ? new Date(updatedMessage.edited_at) : m.editedAt,
            reactions: updatedMessage.reactions || m.reactions,
            isPinned: updatedMessage.is_pinned
          } : m
        ));
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'group_messages',
        filter: `group_id=eq.${groupId}`
      }, (payload) => {
        const deletedMessageId = payload.old.id;
        setMessages(prev => prev.filter(m => m.id !== deletedMessageId));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [groupId, user, group, signalProtocol]);

  // Send en melding til gruppen
  const sendMessage = useCallback(async ({ text, mediaUrl, mediaType, replyToId, pollData, ttl }: {
    text?: string;
    mediaUrl?: string;
    mediaType?: string;
    replyToId?: string;
    pollData?: any;
    ttl?: number;
  }) => {
    if (!groupId || !user) {
      throw new Error('Bruker må være logget inn for å sende meldinger');
    }

    if (!text && !mediaUrl && !pollData) {
      throw new Error('Melding må inneholde tekst, media eller poll');
    }

    try {
      let encryptedText = text;

      // Krypter meldinger i krypterte grupper (Signal-inspirert)
      if (group?.settings.isEncrypted && text) {
        // Krypter meldingen for hver mottaker i gruppen
        encryptedText = await signalProtocol.encryptGroupMessage(
          text,
          groupId,
          group.members.map(m => m.userId).filter(id => id !== user.id)
        );
      }

      // Bruk TTL fra gruppeinnstillinger hvis ikke annet er angitt
      const messageTimeout = ttl || group?.settings.autoDeleteMessagesAfter;

      // Legg til meldingen i databasen
      const { data, error } = await supabase
        .from('group_messages')
        .insert({
          group_id: groupId,
          sender_id: user.id,
          text: encryptedText,
          media_url: mediaUrl,
          media_type: mediaType,
          reply_to_id: replyToId,
          read_by: [user.id], // Marker som lest av senderen
          is_service_message: false,
          created_at: new Date().toISOString(),
          poll_data: pollData,
          ttl: messageTimeout
        })
        .select()
        .single();

      if (error) throw error;

      // Oppdater aktivitetstidspunktet for gruppen
      await supabase
        .from('groups')
        .update({ last_activity: new Date().toISOString() })
        .eq('id', groupId);

      // Om slow mode er aktivert, legg til en timestamp for brukerens siste melding
      if (group?.settings.slowMode) {
        await supabase
          .from('group_members')
          .update({ last_message_time: new Date().toISOString() })
          .eq('group_id', groupId)
          .eq('user_id', user.id);
      }

      return data;
    } catch (err: any) {
      console.error('Feil ved sending av melding:', err);
      throw err;
    }
  }, [groupId, user, group, signalProtocol]);

  // Mariker en melding som lest
  const markMessageAsRead = useCallback(async (messageId: string) => {
    if (!groupId || !user) return;

    try {
      // Hent eksisterende readBy array først
      const { data: messageData, error: fetchError } = await supabase
        .from('group_messages')
        .select('read_by')
        .eq('id', messageId)
        .single();

      if (fetchError) throw fetchError;

      // Legg til bruker-ID hvis den ikke allerede er i listen
      let readBy = messageData.read_by || [];
      if (!readBy.includes(user.id)) {
        readBy.push(user.id);

        const { error: updateError } = await supabase
          .from('group_messages')
          .update({ read_by: readBy })
          .eq('id', messageId);

        if (updateError) throw updateError;
      }

      // Oppdater også brukerens siste leste melding-ID for gruppen
      await supabase
        .from('group_members')
        .update({ last_read_message_id: messageId })
        .eq('group_id', groupId)
        .eq('user_id', user.id);

    } catch (err: any) {
      console.error('Feil ved markering av melding som lest:', err);
    }
  }, [groupId, user]);

  // Telegram-inspirert reaksjoner på meldinger
  const reactToMessage = useCallback(async (messageId: string, emoji: string) => {
    if (!groupId || !user) return;
    
    try {
      // Hent eksisterende reaksjoner
      const { data: messageData, error: fetchError } = await supabase
        .from('group_messages')
        .select('reactions')
        .eq('id', messageId)
        .single();

      if (fetchError) throw fetchError;

      // Oppdater reaksjoner
      let reactions = { ...(messageData.reactions || {}) };
      
      // Sjekk om brukeren allerede har reagert med denne emoji
      if (reactions[emoji]?.includes(user.id)) {
        // Fjern reaksjon
        reactions[emoji] = reactions[emoji].filter(id => id !== user.id);
        if (reactions[emoji].length === 0) {
          delete reactions[emoji];
        }
      } else {
        // Legg til reaksjon
        reactions[emoji] = [...(reactions[emoji] || []), user.id];
      }

      // Oppdater i databasen
      const { error: updateError } = await supabase
        .from('group_messages')
        .update({ reactions })
        .eq('id', messageId);

      if (updateError) throw updateError;

    } catch (err: any) {
      console.error('Feil ved reaksjon på melding:', err);
    }
  }, [groupId, user]);

  // Legg til en ny bruker i gruppen (Telegram-lignende invitasjonshåndtering)
  const addUserToGroup = useCallback(async (userId: string, role: GroupRole = GroupRole.MEMBER) => {
    if (!groupId || !user) return;
    
    try {
      // Sjekk at brukeren har rettigheter til å legge til medlemmer
      if (
        userRole !== GroupRole.OWNER && 
        userRole !== GroupRole.ADMIN &&
        userRole !== GroupRole.MODERATOR
      ) {
        throw new Error('Du har ikke rettigheter til å legge til medlemmer');
      }

      // Sjekk om brukeren allerede er medlem
      const { data: existingMember, error: checkError } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', groupId)
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingMember) {
        // Hvis de er tidligere bannet eller har forlatt, aktiver dem igjen
        if (
          existingMember.status === GroupMemberStatus.BANNED ||
          existingMember.status === GroupMemberStatus.LEFT ||
          existingMember.status === GroupMemberStatus.KICKED
        ) {
          const { error: updateError } = await supabase
            .from('group_members')
            .update({
              status: GroupMemberStatus.ACTIVE,
              role,
              added_by: user.id,
              added_at: new Date().toISOString()
            })
            .eq('group_id', groupId)
            .eq('user_id', userId);

          if (updateError) throw updateError;
        } else {
          throw new Error('Brukeren er allerede medlem av gruppen');
        }
      } else {
        // Legg til nytt medlem
        const { error: addError } = await supabase
          .from('group_members')
          .insert({
            group_id: groupId,
            user_id: userId,
            role,
            status: GroupMemberStatus.ACTIVE,
            added_by: user.id,
            added_at: new Date().toISOString(),
            permissions: getDefaultPermissions(role)
          });

        if (addError) throw addError;

        // Oppdater medlemsantall
        await supabase
          .from('groups')
          .update({ 
            member_count: group?.memberCount ? group.memberCount + 1 : 1,
            updated_at: new Date().toISOString() 
          })
          .eq('id', groupId);

        // Legg til servicemelding om at brukeren ble lagt til
        await supabase
          .from('group_messages')
          .insert({
            group_id: groupId,
            sender_id: null, // System message
            text: `${user.display_name || user.email} har lagt til en ny bruker i gruppen.`,
            is_service_message: true,
            created_at: new Date().toISOString(),
          });
      }

      // Last inn gruppen på nytt for å få oppdatert medlemsliste
      await loadGroup();

    } catch (err: any) {
      console.error('Feil ved tillegging av bruker til gruppe:', err);
      throw err;
    }
  }, [groupId, user, userRole, group, loadGroup]);

  // Standardrettigheter basert på rolle
  const getDefaultPermissions = (role: GroupRole): GroupPermission[] => {
    switch (role) {
      case GroupRole.OWNER:
      case GroupRole.ADMIN:
        return [
          GroupPermission.SEND_MESSAGES,
          GroupPermission.SEND_MEDIA,
          GroupPermission.INVITE_USERS,
          GroupPermission.PIN_MESSAGES,
          GroupPermission.CHANGE_INFO,
          GroupPermission.DELETE_MESSAGES,
          GroupPermission.BAN_USERS,
          GroupPermission.ADD_ADMINS,
        ];
      case GroupRole.MODERATOR:
        return [
          GroupPermission.SEND_MESSAGES,
          GroupPermission.SEND_MEDIA,
          GroupPermission.INVITE_USERS,
          GroupPermission.PIN_MESSAGES,
          GroupPermission.DELETE_MESSAGES,
        ];
      case GroupRole.MEMBER:
        return [
          GroupPermission.SEND_MESSAGES,
          GroupPermission.SEND_MEDIA,
        ];
      case GroupRole.RESTRICTED:
        return [];
      default:
        return [];
    }
  };

  // Fjern bruker fra gruppe
  const removeUserFromGroup = useCallback(async (userId: string, ban: boolean = false) => {
    if (!groupId || !user) return;
    
    try {
      // Sjekk rettigheter
      if (
        userRole !== GroupRole.OWNER && 
        userRole !== GroupRole.ADMIN &&
        userRole !== GroupRole.MODERATOR
      ) {
        throw new Error('Du har ikke rettigheter til å fjerne medlemmer');
      }

      // Sjekk at brukeren ikke er gruppeeieren
      const { data: memberData, error: memberError } = await supabase
        .from('group_members')
        .select('role')
        .eq('group_id', groupId)
        .eq('user_id', userId)
        .single();

      if (memberError) throw memberError;

      if (memberData.role === GroupRole.OWNER) {
        throw new Error('Gruppeeieren kan ikke fjernes');
      }

      // Sjekk at en admin ikke prøver å fjerne en annen admin
      if (
        userRole === GroupRole.ADMIN && 
        memberData.role === GroupRole.ADMIN
      ) {
        throw new Error('En administrator kan ikke fjerne en annen administrator');
      }

      if (ban) {
        // Ban bruker
        const { error: banError } = await supabase
          .from('group_members')
          .update({
            status: GroupMemberStatus.BANNED,
            updated_at: new Date().toISOString()
          })
          .eq('group_id', groupId)
          .eq('user_id', userId);

        if (banError) throw banError;

        // Legg til servicemelding
        await supabase
          .from('group_messages')
          .insert({
            group_id: groupId,
            sender_id: null, // System message
            text: `${userId} har blitt utestengt fra gruppen.`,
            is_service_message: true,
            created_at: new Date().toISOString(),
          });
      } else {
        // Merk som fjernet
        const { error: kickError } = await supabase
          .from('group_members')
          .update({
            status: GroupMemberStatus.KICKED,
            updated_at: new Date().toISOString()
          })
          .eq('group_id', groupId)
          .eq('user_id', userId);

        if (kickError) throw kickError;

        // Legg til servicemelding
        await supabase
          .from('group_messages')
          .insert({
            group_id: groupId,
            sender_id: null, // System message
            text: `${userId} har blitt fjernet fra gruppen.`,
            is_service_message: true,
            created_at: new Date().toISOString(),
          });
      }

      // Oppdater medlemsantall
      await supabase
        .from('groups')
        .update({ 
          member_count: group?.memberCount ? group.memberCount - 1 : 0,
          updated_at: new Date().toISOString() 
        })
        .eq('id', groupId);

      // Last inn gruppen på nytt
      await loadGroup();

    } catch (err: any) {
      console.error('Feil ved fjerning av bruker fra gruppe:', err);
      throw err;
    }
  }, [groupId, user, userRole, group, loadGroup]);

  // Last inn gruppen når hook initialiseres
  useEffect(() => {
    if (groupId && user) {
      loadGroup();
    }
  }, [groupId, user, loadGroup]);

  return {
    group,
    messages,
    members,
    loading,
    error,
    userRole,
    sendMessage,
    markMessageAsRead,
    reactToMessage,
    addUserToGroup,
    removeUserFromGroup,
    loadMessages,
    loadGroup
  };
};

export default useGroupChat;