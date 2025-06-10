import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { aiService, AIProvider, AIMessage as MultiProviderMessage, AIConfig } from '../../../services/ai/multiProviderService';
import { MemoryService, MemoryEntry, MemoryType } from '../../../services/ai/memoryService';

// Interface for Friend Assistant chatmelding
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isProcessing?: boolean;
  memoryContext?: MemoryEntry[]; // Legg til memory context for hver melding
}

// Interface for Friend Assistant chathistorikk
export interface AIChat {
  id: string;
  title: string;
  messages: AIMessage[];
  lastUpdated: string;
}

// Interface for API configuration
export interface APIConfig {
  endpoint: string;
  apiKey: string;
  isEnabled: boolean;
  provider?: AIProvider;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

// Interface for returverdier fra hook'en
interface UseAIChatReturn {
  currentChat: AIChat | null;
  chatHistory: AIChat[];
  isLoading: boolean;
  error: string | null;
  selectedChatId: string | null;
  apiConfig: APIConfig;
  sendMessage: (message: string) => Promise<void>;
  createNewChat: () => void;
  selectChat: (chatId: string) => void;
  deleteChat: (chatId: string) => Promise<void>;
  clearChatHistory: () => Promise<void>;
  setApiConfig: (config: Partial<APIConfig>) => void;
}

// Friend Assistant chat hook for building connections
export function useAIChat(): UseAIChatReturn {
  const { user, supabase } = useAuth();
  
  // Initialize memory service with useMemo to prevent re-creation on every render
  const memoryService = useMemo(() => new MemoryService(), []);
  const [currentChat, setCurrentChat] = useState<AIChat | null>(null);
  const [chatHistory, setChatHistory] = useState<AIChat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [apiConfig, setApiConfigState] = useState<APIConfig>({
    endpoint: '',
    apiKey: '',
    isEnabled: process.env.VITE_AI_ENABLED === 'true',
    provider: (process.env.VITE_AI_DEFAULT_PROVIDER as AIProvider) || 'anthropic',
    model: process.env.VITE_AI_DEFAULT_MODEL || 'claude-3-5-sonnet-20241022',
    maxTokens: parseInt(process.env.VITE_AI_MAX_TOKENS) || 4000,
    temperature: parseFloat(process.env.VITE_AI_TEMPERATURE) || 0.7
  });

  // Load API configuration from localStorage on init
  useEffect(() => {
    if (user) {
      try {
        const savedConfig = localStorage.getItem(`ai_api_config_${user.uid}`);
        if (savedConfig) {
          setApiConfigState(JSON.parse(savedConfig));
        }
      } catch (err) {
        console.error('Failed to load API configuration:', err);
      }
    }
  }, [user]);

  // Function to update API configuration
  const setApiConfig = useCallback((config: Partial<APIConfig>) => {
    setApiConfigState(prev => {
      const newConfig = { ...prev, ...config };
      
      if (user) {
        // Save to localStorage
        try {
          localStorage.setItem(`ai_api_config_${user.uid}`, JSON.stringify(newConfig));
        } catch (err) {
          console.error('Failed to save API configuration:', err);
        }
      }
      
      return newConfig;
    });
  }, [user]);

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
      const formattedChats: AIChat[] = data.map((chat: Record<string, unknown>) => ({
        id: String(chat.id),
        title: String(chat.title || 'Ny samtale'),
        messages: JSON.parse(String(chat.messages || '[]')),
        lastUpdated: String(chat.last_updated)
      }));
      
      setChatHistory(formattedChats);
      
      // Sett gjeldende chat hvis en er valgt
      if (selectedChatId) {
        const selectedChat = formattedChats.find(chat => chat.id === selectedChatId);
        if (selectedChat) {
          setCurrentChat(selectedChat);
        }
      }
    } catch (err: unknown) {
      console.error('Feil ved lasting av AI-chat-historikk:', err);
      setError((err as Error).message || 'Kunne ikke laste chat-historikk');
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase, selectedChatId]);

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

  // Call custom API
  const callCustomAPI = async (message: string, chatHistory: AIMessage[]): Promise<string> => {
    if (!apiConfig.endpoint || !apiConfig.apiKey) {
      throw new Error('API konfigurasjon mangler. Vennligst konfigurer API-endpoint og API-nøkkel.');
    }

    try {
      // Format messages for API call
      const formattedMessages = chatHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Add the new user message
      formattedMessages.push({
        role: 'user',
        content: message
      });

      const response = await fetch(apiConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiConfig.apiKey}`
        },
        body: JSON.stringify({
          messages: formattedMessages,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`API feil (${response.status}): ${errorData?.error || response.statusText}`);
      }

      const data = await response.json();
      // This structure might need to be adjusted based on the actual API response format
      return data.choices?.[0]?.message?.content || data.response || 'Ingen respons fra API';
    } catch (err: unknown) {
      console.error('API feil:', err);
      throw new Error(`API feil: ${(err as Error).message}`);
    }
  };

  // Extract user preferences from messages
  const extractAndSaveUserPreferences = useCallback(async (message: string) => {
    if (!user) return;

    try {
      const lowerMessage = message.toLowerCase();
      
      // Detect language preference
      if (lowerMessage.includes('norsk') || lowerMessage.includes('norwegian')) {
        await memoryService.storeMemory(user.uid, 'user_preference',
          'language_preference', 'norwegian', {
          confidence: 0.9,
          context: `Detected from message: "${message.substring(0, 50)}..."`,
          source: 'ai_chat_extraction'
        });
      } else if (lowerMessage.includes('english') || lowerMessage.includes('engelsk')) {
        await memoryService.storeMemory(user.uid, 'user_preference',
          'language_preference', 'english', {
          confidence: 0.9,
          context: `Detected from message: "${message.substring(0, 50)}..."`,
          source: 'ai_chat_extraction'
        });
      }

      // Detect communication style preferences
      if (lowerMessage.includes('kort') || lowerMessage.includes('brief') || lowerMessage.includes('concise')) {
        await memoryService.storeMemory(user.uid, 'user_preference',
          'communication_style', 'concise', {
          confidence: 0.8,
          context: `Detected from message: "${message.substring(0, 50)}..."`,
          source: 'ai_chat_extraction'
        });
      }

      // Detect topic interests
      if (lowerMessage.includes('krypto') || lowerMessage.includes('crypto') || lowerMessage.includes('blockchain')) {
        await memoryService.storeMemory(user.uid, 'learned_fact',
          'interest_cryptocurrency', 'user_shows_interest_in_cryptocurrency', {
          confidence: 0.7,
          context: `Detected from message: "${message.substring(0, 50)}..."`,
          source: 'ai_chat_extraction'
        });
      }
    } catch (error) {
      console.warn('Memory service not available for user preferences:', error);
      // Continue without memory - this is optional functionality
    }
  }, [user, memoryService]);

  // Save conversation context to memory system
  const saveConversationToMemory = useCallback(async (userMessage: string, aiResponse: string, context: AIMessage[]) => {
    if (!user) return;

    try {
      // Save user message context
      await memoryService.storeMemory(user.uid, 'conversation_context', 
        `user_message_${Date.now()}`, userMessage, {
        confidence: 0.9,
        context: JSON.stringify({
          timestamp: new Date().toISOString(),
          conversation_length: context.length,
          chat_id: currentChat?.id
        }),
        source: 'ai_chat_user'
      });

      // Save AI response context
      await memoryService.storeMemory(user.uid, 'conversation_context',
        `ai_response_${Date.now()}`, aiResponse, {
        confidence: 0.8,
        context: JSON.stringify({
          timestamp: new Date().toISOString(),
          conversation_length: context.length + 1,
          chat_id: currentChat?.id,
          user_message: userMessage.substring(0, 100) // First 100 chars for context
        }),
        source: 'ai_chat_assistant'
      });

      // Extract and save user preferences if detected
      await extractAndSaveUserPreferences(userMessage);
      
    } catch (error) {
      console.warn('Memory service not available for conversation saving:', error);
      // Continue without memory - this is optional functionality
    }
  }, [user, currentChat, memoryService, extractAndSaveUserPreferences]);

  // Get personalized context for AI responses
  const getPersonalizedContext = useCallback(async (message: string): Promise<string> => {
    if (!user) return '';

    try {
      // Search for relevant memories
      const relevantMemories = await memoryService.retrieveMemories(user.uid, message, {
        limit: 5,
        similarityThreshold: 0.6
      });
      
      if (relevantMemories.length === 0) return '';

      // Build context string
      let contextString = 'Previous context about this user:\n';
      
      relevantMemories.forEach(memory => {
        contextString += `- ${memory.memory_type}: ${memory.value} (confidence: ${memory.confidence})\n`;
      });

      return contextString;
    } catch (error) {
      console.warn('Memory service not available for personalized context:', error);
      return ''; // Return empty context if memory service is not available
    }
  }, [user, memoryService]);

  // Helper function to translate responses to English
  const translateToEnglish = (norwegianText: string): string => {
    const translations: Record<string, string> = {
      'Hei! Hvordan kan jeg hjelpe deg i dag?': 'Hello! How can I help you today?',
      'Det går bra med meg. Jeg er her for å hjelpe deg. Hva kan jeg gjøre for deg?': 'I\'m doing well. I\'m here to help you. What can I do for you?',
      'Det er ingenting å takke for. Er det noe annet jeg kan hjelpe deg med?': 'You\'re welcome. Is there anything else I can help you with?',
      'Snakkaz bruker ende-til-ende-kryptering (E2EE) for å beskytte dine samtaler. Ingen kan lese meldingene dine, ikke engang vi.': 'Snakkaz uses end-to-end encryption (E2EE) to protect your conversations. No one can read your messages, not even us.',
      'Snakkaz Premium gir deg utvidede funksjoner som større filoverføringer, lengre meldingshistorikk og prioritert kundesupport.': 'Snakkaz Premium gives you extended features like larger file transfers, longer message history, and priority customer support.',
      'Interessant. Fortell meg gjerne mer om det, så skal jeg prøve å hjelpe deg på best mulig måte.': 'Interesting. Please tell me more about it, and I\'ll try to help you in the best way possible.'
    };
    
    return translations[norwegianText] || norwegianText;
  };

  // Helper function to make responses more concise
  const makeResponseConcise = (text: string): string => {
    return text.split('.')[0] + '.'; // Return only the first sentence
  };

  // Hjelpefunksjon for å simulere AI-respons med memory context
  const simulateAIResponseWithMemory = async (message: string, memoryContext: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let baseResponse = '';
        
        // Generate base response
        if (message.toLowerCase().includes('hei') || message.toLowerCase().includes('hallo')) {
          baseResponse = 'Hei! Hvordan kan jeg hjelpe deg i dag?';
        } else if (message.toLowerCase().includes('hvordan') && message.toLowerCase().includes('går')) {
          baseResponse = 'Det går bra med meg. Jeg er her for å hjelpe deg. Hva kan jeg gjøre for deg?';
        } else if (message.toLowerCase().includes('takk')) {
          baseResponse = 'Det er ingenting å takke for. Er det noe annet jeg kan hjelpe deg med?';
        } else if (message.toLowerCase().includes('krypt') || message.toLowerCase().includes('sikker')) {
          baseResponse = 'Snakkaz bruker ende-til-ende-kryptering (E2EE) for å beskytte dine samtaler. Ingen kan lese meldingene dine, ikke engang vi.';
        } else if (message.toLowerCase().includes('premium')) {
          baseResponse = 'Snakkaz Premium gir deg utvidede funksjoner som større filoverføringer, lengre meldingshistorikk og prioritert kundesupport.';
        } else if (message.toLowerCase().includes('sammenlign') || (message.toLowerCase().includes('vs') && message.toLowerCase().includes('snakkaz'))) {
          baseResponse = `
# Sammenligning av Snakkaz med andre meldingsapper

## 🔒 Sikkerhet

| App | Ende-til-ende kryptering | Helside-kryptering | Selvdestruerende meldinger | Kvantumsikker |
|-----|--------------------------|--------------------|-----------------------------|---------------|
| **Snakkaz** | ✅ Alle chatter | ✅ Premium-grupper | ✅ Konfigurerbare timere | 🔄 Under utvikling |
| Telegram | ❌ Kun "Secret Chats" | ❌ Nei | ✅ Secret Chats | ❌ Nei |
| Signal | ✅ Alle chatter | ❌ Nei | ✅ Begrenset | ✅ SPQR-teknologi |
| Wickr | ✅ Alle chatter | ❌ Nei | ✅ Burn-on-read | ❌ Nei |

## 🌟 Funksjoner

| App | Gruppesamtaler | Mediaopplasting | AI-assistanse | Plattformer |
|-----|---------------|-----------------|--------------|------------|
| **Snakkaz** | ✅ Med rollestyring | ✅ Kryptert, 1GB (Premium) | ✅ Integrert | Web, snart mobilapper |
| Telegram | ✅ Opptil 200K medlemmer | ✅ Opptil 2GB | ❌ Kun bots | Alle plattformer |
| Signal | ✅ Begrenset funksjonalitet | ✅ Kryptert | ❌ Nei | Alle plattformer |
| Wickr | ✅ Enterprise-fokusert | ✅ Kryptert | ❌ Nei | Alle plattformer |

## 🚀 Unike fordeler med Snakkaz

1. **Bedre privatlivskontroll** - Kombinerer det beste fra alle med vårt eget sikkerhetssystem
2. **Smartere kryptering** - Mer strømlinjeformet enn Wickr, mer omfattende enn Telegram
3. **Cyberpunk design** - Unik brukeropplevelse i forhold til de andre appenes standarddesign
4. **AI-integrering** - Intelligent assistent uten å gå på kompromiss med ende-til-ende kryptering
5. **Forbedret batteritid** - Optimaliserte krypteringsoperasjoner for bedre mobile ytelse

Har du spørsmål om noen spesifikke funksjoner?`;
        } else if (message.toLowerCase().includes('telegram') || message.toLowerCase().includes('signal') || message.toLowerCase().includes('wickr')) {
          baseResponse = `
Jeg ser at du spør om andre meldingsapper! Her er hvordan Snakkaz skiller seg ut sammenlignet med disse:

### Sammenlignet med Telegram:
- **Kryptering:** Snakkaz gir ende-til-ende kryptering for alle samtaler, ikke bare "Secret Chats"
- **Sikkerhet:** Vi tilbyr helside-kryptering i premium-grupper, en funksjon Telegram mangler
- **Personvern:** Våre data lagres ikke i sentraliserte skytjenester som kan kompromitteres

### Sammenlignet med Signal:
- **Brukeropplevelse:** Snakkaz har et mer moderne, cyberpunk-inspirert design
- **Gruppesamtaler:** Vi tilbyr mer avansert rollestyring og adminfunksjoner
- **AI-funksjoner:** Snakkaz integrerer AI-assistanse som Signal mangler helt

### Sammenlignet med Wickr:
- **Ytelse:** Snakkaz er optimalisert for lavere batterforbruk på mobile enheter
- **Tilgjengelighet:** Vi fokuserer på både privatbrukere og bedrifter, mens Wickr er primært enterprise-fokusert
- **Brukergrensesnitt:** Vårt design er mer intuitivt for ikke-tekniske brukere

Vil du ha mer detaljert informasjon om noen av disse sammenligningene?`;
        } else {
          baseResponse = 'Interessant. Fortell meg gjerne mer om det, så skal jeg prøve å hjelpe deg på best mulig måte.';
        }

        // Enhance response with memory context if available
        if (memoryContext && memoryContext.length > 0) {
          // Check if we have language preference
          if (memoryContext.includes('language_preference: english')) {
            baseResponse = translateToEnglish(baseResponse);
          }
          
          // Check for communication style
          if (memoryContext.includes('communication_style: concise')) {
            baseResponse = makeResponseConcise(baseResponse);
          }
          
          // Add personalized greeting if we know user interests
          if (memoryContext.includes('interest_cryptocurrency')) {
            baseResponse = '🔐 ' + baseResponse + ' (I see you\'re interested in crypto - feel free to ask about Snakkaz\'s security features!)';
          }
        }

        resolve(baseResponse);
      }, 1000);
    });
  };

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
      
      // Get previous messages for context (excluding the temp assistant message)
      const chatContext = updatedChat.messages.slice(0, -1);
      
      setTimeout(async () => {
        try {
          // Get personalized context from memory before generating response
          const memoryContext = await getPersonalizedContext(message);
          
          // Use custom API if enabled, otherwise use the simulated response
          let aiResponse: string;
          
          if (apiConfig.isEnabled && apiConfig.endpoint && apiConfig.apiKey) {
            // Enhance the message with memory context for personalized responses
            const enhancedMessage = memoryContext 
              ? `${memoryContext}\n\nUser message: ${message}`
              : message;
            aiResponse = await callCustomAPI(enhancedMessage, chatContext);
          } else {
            // Simuler API-kall til AI-tjenesten med memory context
            aiResponse = await simulateAIResponseWithMemory(message, memoryContext);
          }
          
          // Oppdater assistentmeldingen med faktisk innhold
          let memoryContextForMessage: MemoryEntry[] | undefined;
          try {
            memoryContextForMessage = memoryContext ? await memoryService.retrieveMemories(user.uid, message, { limit: 3 }) : undefined;
          } catch (error) {
            console.warn('Failed to retrieve memory context for message:', error);
            memoryContextForMessage = undefined;
          }

          const assistantMessage: AIMessage = {
            ...tempAssistantMessage,
            content: aiResponse,
            isProcessing: false,
            memoryContext: memoryContextForMessage
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

          // Save conversation to memory system
          await saveConversationToMemory(message, aiResponse, chatContext);
          
          // Her ville du normalt lagre til database
          // await saveChat(finalChat);
        } catch (err: unknown) {
          console.error('Friend assistant response error:', err);
          setError(`Kunne ikke få svar fra AI-assistenten: ${(err as Error).message}`);
          
          // Remove the loading assistant message on error
          const errorChat = {
            ...updatedChat,
            messages: updatedChat.messages.slice(0, -1),
            lastUpdated: new Date().toISOString()
          };
          
          setCurrentChat(errorChat);
        }
      }, 1500); // Simuler nettverksforsinkelse
      
    } catch (err: unknown) {
      console.error('Feil ved sending av melding:', err);
      setError((err as Error).message || 'Kunne ikke sende melding');
    }
  }, [user, currentChat, createNewChat, apiConfig, callCustomAPI, getPersonalizedContext, memoryService, saveConversationToMemory, simulateAIResponseWithMemory]);

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
    } catch (err: unknown) {
      console.error('Feil ved sletting av chat:', err);
      setError((err as Error).message || 'Kunne ikke slette chat');
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
    } catch (err: unknown) {
      console.error('Feil ved tømming av chat-historikk:', err);
      setError((err as Error).message || 'Kunne ikke tømme chat-historikk');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    currentChat,
    chatHistory,
    isLoading,
    error,
    selectedChatId,
    apiConfig,
    sendMessage,
    createNewChat,
    selectChat,
    deleteChat,
    clearChatHistory,
    setApiConfig
  };
}