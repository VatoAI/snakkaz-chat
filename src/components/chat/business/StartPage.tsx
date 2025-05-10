import React from 'react';
import { useBusiness } from '@/hooks/useBusiness';
import { Button } from '@/components/ui/button';

interface StartPageProps {
  userId: string;
  onSendMessage: (message: string) => void;
  isEmptyChat: boolean;
  onCall?: () => void;
  onOpenWebsite?: (url: string) => void;
}

/**
 * Komponent som viser en tilpasset startside for tomme chatter
 * Inspirert av Telegram Business sin Start Page-funksjonalitet
 */
export const StartPage: React.FC<StartPageProps> = ({
  userId,
  onSendMessage,
  isEmptyChat,
  onCall,
  onOpenWebsite
}) => {
  const { businessConfig } = useBusiness(userId);

  // Hvis ikke business-modus, eller tom chat, eller startside ikke er aktivert
  if (!businessConfig?.enabled || 
      !isEmptyChat || 
      !businessConfig?.startPage?.enabled) {
    return null;
  }

  const { startPage } = businessConfig;

  // Håndter knappeklikk basert på konfigurasjon
  const handleButtonClick = () => {
    if (!startPage.buttonAction || !startPage.buttonValue) return;

    switch (startPage.buttonAction) {
      case 'sendMessage':
        onSendMessage(startPage.buttonValue);
        break;
      case 'call':
        if (onCall) onCall();
        break;
      case 'openWebsite':
        if (onOpenWebsite) onOpenWebsite(startPage.buttonValue);
        break;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      {startPage.imageUrl && (
        <div className="mb-6 w-full max-w-[300px]">
          <img 
            src={startPage.imageUrl} 
            alt={startPage.title || 'Velkommen'} 
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}
      
      <h2 className="text-2xl font-bold mb-2">{startPage.title || 'Velkommen'}</h2>
      
      {startPage.description && (
        <p className="text-muted-foreground mb-6 max-w-md">
          {startPage.description}
        </p>
      )}
      
      {startPage.buttonText && (
        <Button onClick={handleButtonClick}>
          {startPage.buttonText}
        </Button>
      )}
    </div>
  );
};

/**
 * Helper-hook for å sjekke om en chat er tom
 */
export const useEmptyChatCheck = (messages: any[]): boolean => {
  return messages.length === 0;
};