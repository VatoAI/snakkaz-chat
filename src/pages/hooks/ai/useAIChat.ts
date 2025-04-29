import { useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Interface for AI-chatmelding
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isProcessing?: boolean;
}

// Interface for AI-chathistorikk
export interface AIChat {
  id: string;
  title: string;
  messages: AIMessage[];
  lastUpdated: string;
}

// Interface for returverdier fra hook'en
interface UseAIChatReturn {
  currentChat: AIChat | null;
  chatHistory: AIChat[];
  isLoading: boolean;
  error: string | null;
  selectedChatId: string | null;
  sendMessage: (message: string) => Promise<void>;
  createNewChat: () => void;
  selectChat: (chatId: string) => void;
  deleteChat: (chatId: string) => Promise<void>;
  clearChatHistory: () => Promise<void>;
}

// AI-chat hook
export function useAIChat(): UseAIChatReturn {
  const { user, supabase } = useAuth();
  const [currentChat, setCurrentChat] = useState<AIChat | null>(null);
  const [chatHistory, setChatHistory] = useState<AIChat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  // Funksjon for å laste chat-historikk fra Supabase
  const loadChatHistory = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('ai_chats')
        .select('*')
        .eq('user_id', user.uid)
        .order('last_updated', { ascending: false });
        
      if (error) throw error;
      
      // Konverter fra databaseformat til lokalt format
      const formattedChats: AIChat[] = data.map((chat: any) => ({
        id: chat.id,
        title: chat.title || 'Ny samtale',
        messages: JSON.parse(chat.messages || '[]'),
        lastUpdated: chat.last_updated
      }));
      
      setChatHistory(formattedChats);
      
      // Sett gjeldende chat hvis en er valgt
      if (selectedChatId) {
        const selectedChat = formattedChats.find(chat => chat.id === selectedChatId);
        if (selectedChat) {
          setCurrentChat(selectedChat);
        }
      }
    } catch (err: any) {
      console.error('Feil ved lasting av AI-chat-historikk:', err);
      setError(err.message || 'Kunne ikke laste chat-historikk');
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase, selectedChatId]);

  // Last chat-historikk ved oppstart
  // Merk: Dette ville vanligvis være i en useEffect, men jeg holder det enkelt her
  // useEffect(() => { loadChatHistory(); }, [loadChatHistory]);

  // Funksjon for å opprette en ny chat
  const createNewChat = useCallback(() => {
    const newChat: AIChat = {
      id: `chat_${Date.now()}`,
      title: 'Ny samtale',
      messages: [],
      lastUpdated: new Date().toISOString()
    };
    
    setCurrentChat(newChat);
    setSelectedChatId(newChat.id);
    setChatHistory(prev => [newChat, ...prev]);
    
    // Lagre til database ville normalt skje her
  }, []);

  // Funksjon for å sende en melding til AI
  const sendMessage = useCallback(async (message: string) => {
    if (!user) {
      setError('Du må være logget inn for å bruke AI-chat');
      return;
    }
    
    if (!currentChat) {
      createNewChat();
    }
    
    try {
      setError(null);
      
      // Legg til brukermelding i chat
      const userMessage: AIMessage = {
        id: `msg_${Date.now()}`,
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };
      
      // Legg til en midlertidig assistentmelding som viser at den prosesserer
      const tempAssistantMessage: AIMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        isProcessing: true
      };
      
      // Oppdater gjeldende chat med brukermelding og prosesserende assistentmelding
      const updatedChat = currentChat ? {
        ...currentChat,
        messages: [...currentChat.messages, userMessage, tempAssistantMessage],
        lastUpdated: new Date().toISOString()
      } : {
        id: `chat_${Date.now()}`,
        title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
        messages: [userMessage, tempAssistantMessage],
        lastUpdated: new Date().toISOString()
      };
      
      setCurrentChat(updatedChat);
      
      // Her ville du normalt kalle en AI-tjeneste API
      // For demo-formål simulerer vi en respons
      setTimeout(async () => {
        try {
          // Simuler API-kall til AI-tjenesten
          const aiResponse = await simulateAIResponse(message);
          
          // Oppdater assistentmeldingen med faktisk innhold
          const assistantMessage: AIMessage = {
            ...tempAssistantMessage,
            content: aiResponse,
            isProcessing: false
          };
          
          // Oppdater chatten med den fullstendige assistentmeldingen
          const finalChat = {
            ...updatedChat,
            messages: [...updatedChat.messages.slice(0, -1), assistantMessage],
            lastUpdated: new Date().toISOString()
          };
          
          setCurrentChat(finalChat);
          
          // Oppdater chat-historikk
          setChatHistory(prev => 
            prev.map(chat => chat.id === finalChat.id ? finalChat : chat)
          );
          
          // Her ville du normalt lagre til database
          // await saveChat(finalChat);
        } catch (err: any) {
          console.error('AI response error:', err);
          setError('Kunne ikke få svar fra AI-assistenten');
        }
      }, 1500); // Simuler nettverksforsinkelse
      
    } catch (err: any) {
      console.error('Feil ved sending av melding:', err);
      setError(err.message || 'Kunne ikke sende melding');
    }
  }, [user, currentChat, createNewChat]);

  // Funksjon for å velge en chat fra historikken
  const selectChat = useCallback((chatId: string) => {
    const selected = chatHistory.find(chat => chat.id === chatId);
    if (selected) {
      setCurrentChat(selected);
      setSelectedChatId(chatId);
      setError(null);
    } else {
      setError('Kunne ikke finne den valgte chatten');
    }
  }, [chatHistory]);

  // Funksjon for å slette en chat
  const deleteChat = useCallback(async (chatId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Her ville du normalt slette fra database
      // await supabase.from('ai_chats').delete().eq('id', chatId).eq('user_id', user.uid);
      
      // Oppdater lokal state
      setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
      
      // Hvis den slettede chatten var den aktive, nullstill gjeldende chat
      if (currentChat?.id === chatId) {
        setCurrentChat(null);
        setSelectedChatId(null);
      }
    } catch (err: any) {
      console.error('Feil ved sletting av chat:', err);
      setError(err.message || 'Kunne ikke slette chat');
    } finally {
      setIsLoading(false);
    }
  }, [user, currentChat]);

  // Funksjon for å tømme chat-historikk
  const clearChatHistory = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Her ville du normalt slette fra database
      // await supabase.from('ai_chats').delete().eq('user_id', user.uid);
      
      // Oppdater lokal state
      setChatHistory([]);
      setCurrentChat(null);
      setSelectedChatId(null);
    } catch (err: any) {
      console.error('Feil ved tømming av chat-historikk:', err);
      setError(err.message || 'Kunne ikke tømme chat-historikk');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Hjelpefunksjon for å simulere AI-respons
  const simulateAIResponse = async (message: string): Promise<string> => {
    // For demo-formål, returnerer vi bare en enkel respons
    // I en reell implementasjon ville dette være et API-kall til en AI-tjeneste
    return new Promise((resolve) => {
      setTimeout(() => {
        if (message.toLowerCase().includes('hei') || message.toLowerCase().includes('hallo')) {
          resolve('Hei! Hvordan kan jeg hjelpe deg i dag?');
        } else if (message.toLowerCase().includes('hvordan') && message.toLowerCase().includes('går')) {
          resolve('Det går bra med meg. Jeg er her for å hjelpe deg. Hva kan jeg gjøre for deg?');
        } else if (message.toLowerCase().includes('takk')) {
          resolve('Det er ingenting å takke for. Er det noe annet jeg kan hjelpe deg med?');
        } else if (message.toLowerCase().includes('krypt') || message.toLowerCase().includes('sikker')) {
          resolve('Snakkaz bruker ende-til-ende-kryptering (E2EE) for å beskytte dine samtaler. Ingen kan lese meldingene dine, ikke engang vi.');
        } else if (message.toLowerCase().includes('premium')) {
          resolve('Snakkaz Premium gir deg utvidede funksjoner som større filoverføringer, lengre meldingshistorikk og prioritert kundesupport.');
        } else {
          resolve('Interessant. Fortell meg gjerne mer om det, så skal jeg prøve å hjelpe deg på best mulig måte.');
        }
      }, 1000);
    });
  };

  return {
    currentChat,
    chatHistory,
    isLoading,
    error,
    selectedChatId,
    sendMessage,
    createNewChat,
    selectChat,
    deleteChat,
    clearChatHistory
  };
}