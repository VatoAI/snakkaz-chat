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
      let formattedMessages = await Promise.all(messagesData.map(async (m: any) => {
        const message: GroupMessage = {
          id: m.id,
          groupId: m.group_id,
          senderId: m.sender_id,
          text: m.text,
          mediaUrl: m.media_url,
          mediaType: m.media_type,
          thumbnailUrl: m.thumbnail_url, // Støtte for miniatyrbilder
          replyToId: m.reply_to_id,
          forwardedFrom: m.forwarded_from,
          editedAt: m.edited_at ? new Date(m.edited_at) : undefined,
          createdAt: new Date(m.created_at),
          readBy: m.read_by || [],
          reactions: m.reactions || {},
          isPinned: m.is_pinned,
          isServiceMessage: m.is_service_message,
          ttl: m.ttl,
          pollData: m.poll_data,
          isEncrypted: m.is_encrypted,
          caption: m.caption // Støtte for caption
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
    } catch (err: any) {
      console.error('Feil ved lasting av meldinger:', err);
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
    pollData?: any;
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
    } catch (err: any) {
      console.error('Feil ved sending av melding:', err);
      throw err;
    }
  }, [groupId, user, group, signalProtocol]);

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

  // Ny funksjon for å slette meldinger
  const deleteMessage = useCallback(async (messageId: string) => {
    if (!groupId || !user) return;
    
    try {
      // Hent meldingsinformasjon for å sjekke rettigheter
      const { data: messageData, error: fetchError } = await supabase
        .from('group_messages')
        .select('sender_id')
        .eq('id', messageId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Sjekk om brukeren har rettighet til å slette denne meldingen
      const canDelete = 
        messageData.sender_id === user.id || // Brukerens egen melding
        userRole === GroupRole.OWNER || 
        userRole === GroupRole.ADMIN ||
        (userRole === GroupRole.MODERATOR && group?.members.find(m => m.userId === user.id)?.permissions?.includes(GroupPermission.DELETE_MESSAGES));
        
      if (!canDelete) {
        throw new Error('Du har ikke tillatelse til å slette denne meldingen');
      }
      
      // Slett meldingen
      const { error: deleteError } = await supabase
        .from('group_messages')
        .delete()
        .eq('id', messageId);
        
      if (deleteError) throw deleteError;
      
    } catch (err: any) {
      console.error('Feil ved sletting av melding:', err);
      throw err;
    }
  }, [groupId, user, userRole, group]);
  
  // Ny funksjon for å redigere en melding
  const editMessage = useCallback(async (messageId: string, newText: string) => {
    if (!groupId || !user || !newText.trim()) return;
    
    try {
      // Sjekk at det er brukerens egen melding
      const { data: messageData, error: fetchError } = await supabase
        .from('group_messages')
        .select('sender_id, is_service_message')
        .eq('id', messageId)
        .single();
        
      if (fetchError) throw fetchError;
      
      if (messageData.sender_id !== user.id || messageData.is_service_message) {
        throw new Error('Du kan bare redigere dine egne meldinger');
      }
      
      // Krypter den nye teksten hvis gruppen er kryptert
      let encryptedText = newText;
      if (group?.settings.isEncrypted) {
        encryptedText = await signalProtocol.encryptGroupMessage(
          newText,
          groupId,
          group.members.map(m => m.userId).filter(id => id !== user.id)
        );
      }
      
      // Oppdater meldingen
      const { error: updateError } = await supabase
        .from('group_messages')
        .update({ 
          text: encryptedText,
          edited_at: new Date().toISOString()
        })
        .eq('id', messageId);
        
      if (updateError) throw updateError;
      
    } catch (err: any) {
      console.error('Feil ved redigering av melding:', err);
      throw err;
    }
  }, [groupId, user, group, signalProtocol]);
  
  // Ny funksjon for å svare på en melding
  const replyToMessage = useCallback(async (replyToId: string, text: string, options?: {
    mediaUrl?: string;
    mediaType?: string;
    thumbnailUrl?: string;
    ttl?: number;
  }) => {
    if (!groupId || !user) return;
    
    return sendMessage({
      text,
      replyToId,
      ...options
    });
  }, [groupId, user, sendMessage]);
  
  // Ny funksjon for å hente detaljinformasjon om en enkelt melding (f.eks. for svar)
  const getMessageById = useCallback(async (messageId: string) => {
    if (!groupId || !user || !messageId) return null;
    
    try {
      const { data, error } = await supabase
        .from('group_messages')
        .select('*, user:users(id, display_name, avatar_url)')
        .eq('id', messageId)
        .single();
        
      if (error) throw error;
      
      // Formater og dekrypter meldingen om nødvendig
      let message = {
        id: data.id,
        groupId: data.group_id,
        senderId: data.sender_id,
        text: data.text,
        mediaUrl: data.media_url,
        mediaType: data.media_type,
        thumbnailUrl: data.thumbnail_url,
        replyToId: data.reply_to_id,
        createdAt: new Date(data.created_at),
        caption: data.caption
      };
      
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
      
    } catch (err: any) {
      console.error('Feil ved henting av melding:', err);
      return null;
    }
  }, [groupId, user, group, signalProtocol]);

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
    loadGroup,
    deleteMessage, // Ny funksjon
    editMessage,   // Ny funksjon
    replyToMessage, // Ny funksjon
    getMessageById  // Ny funksjon
  };
};

export default useGroupChat;