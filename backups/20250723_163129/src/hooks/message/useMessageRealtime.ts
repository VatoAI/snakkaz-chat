import { useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DecryptedMessage } from "@/types/message";
import { decryptMessage } from "@/utils/encryption";
import { activeCommunicationConfig } from "@/config/communication-config";

/**
 * Hook for å abonnere på sanntidsoppdateringer av meldinger
 * Uavhengig av om meldingene kommer via P2P eller server
 */
export const useMessageRealtime = (
  userId: string | null, 
  setMessages: (updater: React.SetStateAction<DecryptedMessage[]>) => void,
  receiverId?: string,
  groupId?: string
) => {
  const activeChannelRef = useRef<any>(null);
  const isUnmountedRef = useRef(false);
  
  // Opprense ved unmounting
  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
      if (activeChannelRef.current) {
        console.log("Rydder opp sanntidsabonnement ved unmounting");
        supabase.removeChannel(activeChannelRef.current);
        activeChannelRef.current = null;
      }
    };
  }, []);

  const setupRealtimeSubscription = useCallback(() => {
    if (!userId) {
      console.log("Bruker er ikke autentisert");
      return () => {};
    }

    // Rydd opp eksisterende abonnement
    if (activeChannelRef.current) {
      console.log("Rydder opp eksisterende abonnement");
      supabase.removeChannel(activeChannelRef.current);
      activeChannelRef.current = null;
    }

    // Opprett korrekt filter basert på om vi er i en direkte samtale eller en gruppe
    let channelFilter = "*";
    if (receiverId) {
      // For direktemeldinger: bare meldinger mellom disse to brukerne
      channelFilter = `and(or(sender_id.eq.${userId},sender_id.eq.${receiverId}),or(receiver_id.eq.${userId},receiver_id.eq.${receiverId}))`;
    } else if (groupId) {
      // For gruppemeldinger: bare meldinger til denne gruppen
      channelFilter = `group_id.eq.${groupId}`;
    } else {
      // For globale meldinger: bare meldinger uten mottaker og gruppe
      channelFilter = `and(receiver_id.is.null,group_id.is.null)`;
    }

    console.log("Setter opp sanntidsabonnement med filter:", channelFilter);

    // Opprett kanalen og abonner
    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: channelFilter
        },
        async (payload) => {
          if (isUnmountedRef.current) return;
          
          console.log("Sanntids INSERT-hendelse mottatt:", payload);
          const newMessage = payload.new as any;
          
          // Hopp over meldinger sendt av denne brukeren (allerede i UI)
          // Dette gjelder kun når meldinger sendes via server og ikke P2P
          if (activeCommunicationConfig.enableServer && 
              !activeCommunicationConfig.enableP2P && 
              newMessage.sender_id === userId) {
            return;
          }

          try {
            // Hent avsenderinfo
            const { data: senderData, error: senderError } = await supabase
              .from('profiles')
              .select('id, username, full_name, avatar_url')
              .eq('id', newMessage.sender_id)
              .single();

            if (senderError) {
              throw senderError;
            }

            // For private meldinger, bare vis hvis det er for denne brukeren
            if (newMessage.receiver_id && 
                newMessage.receiver_id !== userId && 
                newMessage.sender_id !== userId) {
              return;
            }
            
            // Dekrypter innhold hvis det er kryptert
            let content = newMessage.content || '';
            if (newMessage.encrypted_content) {
              content = await decryptMessage(
                newMessage.encrypted_content,
                newMessage.encryption_key,
                newMessage.iv
              );
            }

            // Opprett dekryptert meldingsrepresentasjon
            const decryptedMessage: DecryptedMessage = {
              id: newMessage.id,
              content,
              sender: senderData,
              created_at: newMessage.created_at,
              encryption_key: newMessage.encryption_key || '',
              iv: newMessage.iv || '',
              ephemeral_ttl: newMessage.ephemeral_ttl,
              media_url: newMessage.media_url,
              media_type: newMessage.media_type,
              is_encrypted: !!newMessage.encrypted_content,
              is_edited: newMessage.is_edited || false,
              edited_at: newMessage.edited_at || null,
              is_deleted: newMessage.is_deleted || false,
              deleted_at: newMessage.deleted_at || null,
              receiver_id: newMessage.receiver_id,
              group_id: newMessage.group_id || null,
              read_at: newMessage.read_at,
              is_delivered: newMessage.is_delivered || false,
              media_encryption_key: newMessage.media_encryption_key,
              media_iv: newMessage.media_iv,
              media_metadata: newMessage.media_metadata,
            };

            // Oppdater meldingsstaten
            if (!isUnmountedRef.current) {
              // Kontroller for duplikater
              setMessages(prevMessages => {
                if (prevMessages.some(msg => msg.id === decryptedMessage.id)) {
                  // Meldingen finnes allerede, ikke legg den til
                  return prevMessages;
                }
                // Meldingen er ny, legg til og sorter etter tid
                return [...prevMessages, decryptedMessage]
                  .sort((a, b) => {
                    const timeA = new Date(a.created_at).getTime();
                    const timeB = new Date(b.created_at).getTime();
                    return timeA - timeB;
                  });
              });
            }
          } catch (error) {
            console.error("Feil ved behandling av sanntidsmelding:", error);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: channelFilter
        },
        async (payload) => {
          if (isUnmountedRef.current) return;
          
          console.log("Sanntids UPDATE-hendelse mottatt:", payload);
          const updatedMessage = payload.new as any;
          
          // Mer effektiv oppdatering uten full re-rendering
          setMessages(prevMessages => 
            prevMessages.map(msg => {
              if (msg.id === updatedMessage.id) {
                // Dekrypter innhold om nødvendig
                const updateMessage = async () => {
                  if (updatedMessage.encrypted_content && updatedMessage.encryption_key && updatedMessage.iv) {
                    try {
                      const content = await decryptMessage(
                        updatedMessage.encrypted_content,
                        updatedMessage.encryption_key,
                        updatedMessage.iv
                      );
                      
                      return {
                        ...msg,
                        content,
                        is_edited: updatedMessage.is_edited || false,
                        edited_at: updatedMessage.edited_at || null,
                        is_deleted: updatedMessage.is_deleted || false,
                        deleted_at: updatedMessage.deleted_at || null,
                        read_at: updatedMessage.read_at,
                        is_delivered: updatedMessage.is_delivered || false
                      };
                    } catch (error) {
                      console.error("Feil ved dekryptering av oppdatert melding:", error);
                      return msg;
                    }
                  }
                  
                  return {
                    ...msg,
                    content: updatedMessage.content || msg.content,
                    is_edited: updatedMessage.is_edited || false,
                    edited_at: updatedMessage.edited_at || null,
                    is_deleted: updatedMessage.is_deleted || false,
                    deleted_at: updatedMessage.deleted_at || null,
                    read_at: updatedMessage.read_at,
                    is_delivered: updatedMessage.is_delivered || false
                  };
                };
                
                // Vi må håndtere Promise på en spesiell måte her
                // For dette eksemplet gjør vi en enkel oppdatering uten å vente
                updateMessage().then(updatedMsg => {
                  if (!isUnmountedRef.current) {
                    setMessages(prev => 
                      prev.map(m => m.id === updatedMsg.id ? updatedMsg : m)
                    );
                  }
                });
                
                // Returnerer den originale meldingen for nå, den vil bli oppdatert senere
                return msg;
              }
              return msg;
            })
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: channelFilter
        },
        async (payload) => {
          if (isUnmountedRef.current) return;
          
          console.log("Sanntids DELETE-hendelse mottatt:", payload);
          const deletedMessage = payload.old as any;
          
          // Fjern slettet melding fra tilstanden
          setMessages(prevMessages => 
            prevMessages.filter(msg => msg.id !== deletedMessage.id)
          );
        }
      )
      .subscribe();

    // Lagre kanalreferansen for opprydding
    activeChannelRef.current = channel;

    console.log("Sanntidsabonnement vellykket oppsatt");

    // Returner en opprydningsfunksjon
    return () => {
      console.log("Rydder opp sanntidsabonnement");
      supabase.removeChannel(channel);
      activeChannelRef.current = null;
    };
  }, [userId, receiverId, groupId, setMessages]);

  return { 
    setupRealtimeSubscription,
    activeChannel: activeChannelRef.current 
  };
};
