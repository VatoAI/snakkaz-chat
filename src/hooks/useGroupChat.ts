import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Group, GroupMessage, GroupType, GroupRole, GroupPermission, GroupMember, GroupMemberStatus } from '@/types/group';
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

  // Funksjon for å markere en melding som lest
  const markMessageAsRead = useCallback(async (messageId: string) => {
    if (!groupId || !user || !messageId) return;
    
    try {
      // Hent eksisterende readBy array
      const { data: messageData, error: fetchError } = await supabase
        .from('group_messages')
        .select('read_by')
        .eq('id', messageId)
        .single();

      if (fetchError) throw fetchError;
      
      // Legg til brukeren i readBy array hvis den ikke allerede er der
      const readBy = messageData.read_by || [];
      if (!readBy.includes(user.id)) {
        const updatedReadBy = [...readBy, user.id];
        
        // Oppdater i databasen
        const { error: updateError } = await supabase
          .from('group_messages')
          .update({ read_by: updatedReadBy })
          .eq('id', messageId);

        if (updateError) throw updateError;
        
        // Oppdater også last_read_message_id i group_members
        await supabase
          .from('group_members')
          .update({ last_read_message_id: messageId })
          .eq('group_id', groupId)
          .eq('user_id', user.id);
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Feil ved markering av melding som lest:', error);
    }
  }, [groupId, user]);

  // Funksjon for å legge til en bruker i gruppen
  const addUserToGroup = useCallback(async (userId: string, role: GroupRole = GroupRole.MEMBER) => {
    if (!groupId || !user) return;
    
    try {
      // Sjekk om brukeren har rettigheter til å legge til medlemmer
      if (userRole !== GroupRole.OWNER && userRole !== GroupRole.ADMIN) {
        throw new Error('Du har ikke tillatelse til å legge til medlemmer');
      }
      
      // Sjekk om gruppen har nådd maks antall medlemmer
      if (group?.settings.maxMembers && members.length >= group.settings.maxMembers) {
        throw new Error('Gruppen har nådd maksimalt antall medlemmer');
      }
      
      // Sjekk om brukeren allerede er medlem
      const existingMember = members.find(m => m.userId === userId);
      if (existingMember) {
        throw new Error('Brukeren er allerede medlem av gruppen');
      }
      
      // Legg til brukeren i gruppen
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: userId,
          role: role,
          added_by: user.id,
          status: GroupMemberStatus.ACTIVE
        });
        
      if (error) throw error;
      
      // Oppdater medlemslisten
      await loadGroup();
      
      // Send systemmelding om at brukeren ble lagt til
      await supabase
        .from('group_messages')
        .insert({
          group_id: groupId,
          sender_id: user.id,
          text: `${user.displayName || user.email} la til en ny bruker i gruppen`,
          is_service_message: true,
          read_by: [user.id]
        });
        
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Feil ved tillegging av bruker til gruppe:', error);
      throw error;
    }
  }, [groupId, user, userRole, group, members, loadGroup]);

  // Funksjon for å fjerne en bruker fra gruppen
  const removeUserFromGroup = useCallback(async (userId: string) => {
    if (!groupId || !user) return;
    
    try {
      // Sjekk om brukeren har rettigheter til å fjerne medlemmer
      if (userId !== user.id && // Alltid tillat å forlate gruppen selv
          userRole !== GroupRole.OWNER && 
          userRole !== GroupRole.ADMIN &&
          !(userRole === GroupRole.MODERATOR && 
            group?.members.find(m => m.userId === user.id)?.permissions?.includes(GroupPermission.MANAGE_MEMBERS))) {
        throw new Error('Du har ikke tillatelse til å fjerne medlemmer');
      }
      
      // Sjekk at vi ikke fjerner eieren
      const member = members.find(m => m.userId === userId);
      if (member?.role === GroupRole.OWNER && userId !== user.id) {
        throw new Error('Du kan ikke fjerne gruppens eier');
      }
      
      // Fjern brukeren fra gruppen
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      // Oppdater medlemslisten
      await loadGroup();
      
      // Send systemmelding om at brukeren ble fjernet
      const isLeaving = userId === user.id;
      await supabase
        .from('group_messages')
        .insert({
          group_id: groupId,
          sender_id: user.id,
          text: isLeaving 
            ? `${user.displayName || user.email} har forlatt gruppen` 
            : `${user.displayName || user.email} fjernet et medlem fra gruppen`,
          is_service_message: true,
          read_by: [user.id]
        });
        
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Feil ved fjerning av bruker fra gruppe:', error);
      throw error;
    }
  }, [groupId, user, userRole, group, members, loadGroup]);

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
        members: membersData.map((m: Record<string, unknown>) => ({
          userId: m.user_id as string,
          addedAt: new Date(m.added_at as string),
          addedBy: m.added_by as string,
          role: m.role as GroupRole,
          permissions: (m.permissions as GroupPermission[]) || [],
          status: m.status as GroupMemberStatus,
          displayName: m.user ? (m.user as Record<string, unknown>).display_name as string : undefined,
          lastReadMessageId: m.last_read_message_id as string
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
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Feil ved lasting av gruppedata:', error);
      setError(error.message || 'Kunne ikke laste gruppedata');
      setLoading(false);
    }
  }, [groupId, user]);

  // Forbedret loadMessages funksjon for å dekryptere captions og håndtere miniatyrbilder
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
      let formattedMessages = await Promise.all(messagesData.map(async (m: Record<string, unknown>) => {
        const message: GroupMessage = {
          id: m.id as string,
          groupId: m.group_id as string,
          senderId: m.sender_id as string,
          text: m.text as string,
          mediaUrl: m.media_url as string | undefined,
          mediaType: m.media_type as string | undefined,
          thumbnailUrl: m.thumbnail_url as string | undefined,
          replyToId: m.reply_to_id as string | undefined,
          forwardedFrom: m.forwarded_from as string | undefined,
          editedAt: m.edited_at ? new Date(m.edited_at as string) : undefined,
          createdAt: new Date(m.created_at as string),
          readBy: (m.read_by as string[]) || [],
          reactions: (m.reactions as Record<string, string[]>) || {},
          isPinned: m.is_pinned as boolean,
          isServiceMessage: m.is_service_message as boolean,
          ttl: m.ttl as number | undefined,
          pollData: m.poll_data as Record<string, unknown> | undefined,
          isEncrypted: m.is_encrypted as boolean,
          caption: m.caption as string | undefined
        };

        // Dekrypter meldingen hvis den er kryptert
        const shouldDecrypt = message.isEncrypted || group?.settings.isEncrypted;
        
        if (shouldDecrypt) {
          // Dekrypter meldingstekst
          if (message.text) {
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
          
          // Dekrypter caption
          if (message.caption) {
            try {
              message.caption = await signalProtocol.decryptGroupMessage(
                message.caption,
                groupId,
                message.senderId
              );
            } catch (err) {
              console.error('Kunne ikke dekryptere caption:', err);
              message.caption = '[Kryptert bildetekst]';
            }
          }
        }

        return message;
      }));

      // Sorter meldinger etter tidspunkt, eldste først
      formattedMessages = formattedMessages.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      setMessages(formattedMessages);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Feil ved lasting av meldinger:', error);
    }
  }, [groupId, user, group, signalProtocol]);

  // Oppdatert sendMessage funksjon for å håndtere caption og forbedret mediahåndtering
  const sendMessage = useCallback(async ({ 
    text, 
    mediaUrl, 
    mediaType, 
    replyToId, 
    pollData, 
    ttl,
    thumbnailUrl,  // Ny parameter for miniatyrbilder
    isEncrypted,   // Ny parameter for eksplisitt kryptering
    caption        // Ny parameter for bildetekster
  }: {
    text?: string;
    mediaUrl?: string;
    mediaType?: string;
    replyToId?: string;
    pollData?: Record<string, unknown>;
    ttl?: number;
    thumbnailUrl?: string;
    isEncrypted?: boolean;
    caption?: string;
  }) => {
    if (!groupId || !user) {
      throw new Error('Bruker må være logget inn for å sende meldinger');
    }

    if (!text && !mediaUrl && !pollData) {
      throw new Error('Melding må inneholde tekst, media eller poll');
    }

    try {
      let encryptedText = text;
      let encryptedCaption = caption;

      // Bestem om meldingen skal krypteres
      const shouldEncrypt = isEncrypted || group?.settings.isEncrypted;

      // Krypter meldinger i krypterte grupper (Signal-inspirert)
      if (shouldEncrypt) {
        // Krypter meldingstekst hvis den finnes
        if (text) {
          encryptedText = await signalProtocol.encryptGroupMessage(
            text,
            groupId,
            group?.members.map(m => m.userId).filter(id => id !== user.id) || []
          );
        }
        
        // Krypter også caption hvis den finnes
        if (caption) {
          encryptedCaption = await signalProtocol.encryptGroupMessage(
            caption,
            groupId,
            group?.members.map(m => m.userId).filter(id => id !== user.id) || []
          );
        }
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
          thumbnail_url: thumbnailUrl, // Lagre miniatyrbilde URL
          reply_to_id: replyToId,
          read_by: [user.id], // Marker som lest av senderen
          is_service_message: false,
          created_at: new Date().toISOString(),
          poll_data: pollData,
          ttl: messageTimeout,
          is_encrypted: shouldEncrypt,
          caption: encryptedCaption // Lagre caption separat
        })
        .select()
        .single();

      if (error) throw error;

      // Oppdater aktivitetstidspunktet for gruppen
      await supabase
        .from('groups')
        .update({ 
          last_activity: new Date().toISOString(),
          last_message_preview: mediaUrl ? (caption || '[Media]') : (text?.substring(0, 50) || '')
        })
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
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Feil ved sending av melding:', error);
      throw error;
    }
  }, [groupId, user, group, signalProtocol]);
};