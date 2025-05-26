import React, { useEffect, useState } from 'react';
import { useBusiness } from '@/hooks/useBusiness';
import { DecryptedMessage } from '@/types/message';

interface AutoMessagesProps {
  userId: string;
  chatId: string;
  isFirstInteraction: boolean;
  onSendMessage: (message: string) => void;
  messages: DecryptedMessage[];
}

/**
 * Komponent for å håndtere automatiske meldinger som velkomstmelding og fraværsmelding
 * Inspirert av Telegram Business' Greeting Messages og Away Messages
 */
export const AutoMessages: React.FC<AutoMessagesProps> = ({
  userId,
  chatId,
  isFirstInteraction,
  onSendMessage,
  messages
}) => {
  const { businessConfig, isBusinessOpen } = useBusiness(userId);
  const [hasProcessed, setHasProcessed] = useState(false);

  // Håndterer automatiske meldinger basert på chat-tilstand
  useEffect(() => {
    // Hvis allerede behandlet, ikke gjør noe
    if (hasProcessed || !businessConfig.enabled) return;

    const processAutomaticMessages = async () => {
      // Sjekk om dette er første interaksjon og om velkomstmelding er aktivert
      if (isFirstInteraction && businessConfig.welcomeMessage?.enabled) {
        // Sjekk om denne chatten er unntatt
        const isExcludedChat = businessConfig.awayMessage?.excludedChats.includes(chatId);
        
        if (!isExcludedChat) {
          console.log('Sending welcome message');
          onSendMessage(businessConfig.welcomeMessage.message);
        }
      } 
      // Sjekk om vi skal sende fraværsmelding
      else if (businessConfig.awayMessage?.enabled && !isFirstInteraction) {
        const isExcludedChat = businessConfig.awayMessage.excludedChats.includes(chatId);
        
        // Ikke send fraværsmelding til unntak
        if (isExcludedChat) {
          setHasProcessed(true);
          return;
        }
        
        const shouldSendAwayMessage = businessConfig.awayMessage.useBusinessHours 
          ? !isBusinessOpen() 
          : true;
        
        // Sjekk datoer for fravær hvis spesifisert
        if (businessConfig.awayMessage.startDate && businessConfig.awayMessage.endDate) {
          const now = new Date();
          const startDate = new Date(businessConfig.awayMessage.startDate);
          const endDate = new Date(businessConfig.awayMessage.endDate);
          
          // Kun send fraværsmelding hvis innenfor fraværsperioden
          if (shouldSendAwayMessage && now >= startDate && now <= endDate) {
            // Sjekk om fraværsmeldingen allerede er sendt i denne chatten nylig
            const recentMessages = messages.slice(-5); // Sjekker de 5 siste meldingene
            const alreadySentAwayMessage = recentMessages.some(
              msg => msg.sender.id === userId && 
                     msg.content === businessConfig.awayMessage?.message
            );
            
            if (!alreadySentAwayMessage) {
              console.log('Sending away message');
              onSendMessage(businessConfig.awayMessage.message);
            }
          }
        } else if (shouldSendAwayMessage) {
          // Hvis ingen datoer er satt, sjekk kun åpningstider
          // Sjekk om fraværsmeldingen allerede er sendt i denne chatten nylig
          const recentMessages = messages.slice(-5); // Sjekker de 5 siste meldingene
          const alreadySentAwayMessage = recentMessages.some(
            msg => msg.sender.id === userId && 
                   msg.content === businessConfig.awayMessage?.message
          );
          
          if (!alreadySentAwayMessage) {
            console.log('Sending away message (outside business hours)');
            onSendMessage(businessConfig.awayMessage.message);
          }
        }
      }
      
      setHasProcessed(true);
    };

    processAutomaticMessages();
  }, [
    userId,
    chatId,
    businessConfig,
    isFirstInteraction,
    isBusinessOpen,
    hasProcessed,
    onSendMessage,
    messages
  ]);

  // Dette er en "usynlig" komponent som bare håndterer logikk
  return null;
};

/**
 * Hook for å sjekke om dette er første interaksjon med en bruker
 */
export const useFirstInteractionCheck = (
  userId: string,
  friendId: string
): boolean => {
  const [isFirstInteraction, setIsFirstInteraction] = useState<boolean>(false);

  useEffect(() => {
    const checkFirstInteraction = async () => {
      try {
        // Her ville du normalt gjøre en database-sjekk for å se om
        // disse to brukerne har interagert tidligere
        // For nå simulerer vi det med en lokal lagring
        const interactionKey = `interaction_${userId}_${friendId}`;
        const hasInteracted = localStorage.getItem(interactionKey);
        
        if (!hasInteracted) {
          setIsFirstInteraction(true);
          // Lagre at de har interagert
          localStorage.setItem(interactionKey, 'true');
        } else {
          setIsFirstInteraction(false);
        }
      } catch (error) {
        console.error('Error checking first interaction:', error);
        setIsFirstInteraction(false);
      }
    };

    checkFirstInteraction();
  }, [userId, friendId]);

  return isFirstInteraction;
};