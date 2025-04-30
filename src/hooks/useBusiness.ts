import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  activeBusinessConfig, 
  updateBusinessConfig, 
  BusinessConfig,
  isBusinessEnabled,
  QuickReply
} from '@/config/business-config';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for å håndtere business-funksjoner i Snakkaz
 * Håndterer lagring og lasting av business-konfigurasjon
 */
export const useBusiness = (userId: string | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>(activeBusinessConfig);
  const { toast } = useToast();

  // Last business-konfigurasjon fra databasen
  const loadBusinessConfig = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // Hvis ingen business-profil finnes, er det ikke en feil
        if (error.code === 'PGRST116') {
          console.log('Ingen business-profil funnet for denne brukeren');
          return;
        }
        throw error;
      }

      if (data) {
        const config: BusinessConfig = {
          enabled: data.enabled || false,
          isPremium: data.is_premium || false,
          businessName: data.business_name || '',
          description: data.description || '',
          logoUrl: data.logo_url || '',
          businessHours: data.business_hours || undefined,
          location: data.location || undefined,
          welcomeMessage: data.welcome_message || undefined,
          awayMessage: data.away_message || undefined,
          quickReplies: data.quick_replies || [],
          chatbotEnabled: data.chatbot_enabled || false,
          chatbotConfig: data.chatbot_config || undefined,
          startPage: data.start_page || undefined
        };

        // Oppdater den aktive konfigurasjonen
        updateBusinessConfig(config);
        setBusinessConfig(config);
      }
    } catch (err: any) {
      console.error('Feil ved lasting av business-konfigurasjon:', err);
      setError('Kunne ikke laste business-konfigurasjon');
      toast({
        title: 'Feil',
        description: 'Kunne ikke laste business-konfigurasjon',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

  // Lagre business-konfigurasjon til databasen
  const saveBusinessConfig = useCallback(async (config: Partial<BusinessConfig>) => {
    if (!userId) return;

    setIsSaving(true);
    setError(null);

    try {
      // Oppdater den aktive konfigurasjonen først
      const updatedConfig = updateBusinessConfig(config);
      setBusinessConfig(updatedConfig);

      // Forbered data for lagring
      const dataToSave = {
        user_id: userId,
        enabled: updatedConfig.enabled,
        is_premium: updatedConfig.isPremium,
        business_name: updatedConfig.businessName,
        description: updatedConfig.description,
        logo_url: updatedConfig.logoUrl,
        business_hours: updatedConfig.businessHours,
        location: updatedConfig.location,
        welcome_message: updatedConfig.welcomeMessage,
        away_message: updatedConfig.awayMessage,
        quick_replies: updatedConfig.quickReplies,
        chatbot_enabled: updatedConfig.chatbotEnabled,
        chatbot_config: updatedConfig.chatbotConfig,
        start_page: updatedConfig.startPage,
        updated_at: new Date().toISOString()
      };

      // Lagre til databasen med upsert (insert hvis ikke finnes, update hvis finnes)
      const { error } = await supabase
        .from('business_profiles')
        .upsert(dataToSave)
        .select();

      if (error) throw error;

      toast({
        title: 'Lagret',
        description: 'Business-konfigurasjonen ble lagret',
      });
    } catch (err: any) {
      console.error('Feil ved lagring av business-konfigurasjon:', err);
      setError('Kunne ikke lagre business-konfigurasjon');
      toast({
        title: 'Feil',
        description: 'Kunne ikke lagre business-konfigurasjon',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  }, [userId, toast]);
  
  // Legg til hurtigsvar
  const addQuickReply = useCallback((quickReply: QuickReply) => {
    const updatedQuickReplies = [
      ...(businessConfig.quickReplies || []),
      quickReply
    ];
    
    saveBusinessConfig({ quickReplies: updatedQuickReplies });
  }, [businessConfig, saveBusinessConfig]);
  
  // Fjern hurtigsvar
  const removeQuickReply = useCallback((quickReplyId: string) => {
    const updatedQuickReplies = (businessConfig.quickReplies || [])
      .filter(reply => reply.id !== quickReplyId);
    
    saveBusinessConfig({ quickReplies: updatedQuickReplies });
  }, [businessConfig, saveBusinessConfig]);
  
  // Sjekk om business-modus er aktivert
  const toggleBusinessMode = useCallback((enabled: boolean, businessName?: string) => {
    const updates: Partial<BusinessConfig> = { enabled };
    
    if (enabled && businessName) {
      updates.businessName = businessName;
    }
    
    saveBusinessConfig(updates);
  }, [saveBusinessConfig]);
  
  // Sjekk om det er innenfor åpningstid
  const isBusinessOpen = useCallback(() => {
    if (!businessConfig.businessHours) return true;
    
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = `${currentHours}:${currentMinutes}`;
    
    const dayHours = businessConfig.businessHours[dayOfWeek as keyof typeof businessConfig.businessHours];
    
    if (!dayHours || dayHours === 'closed') return false;
    
    const { open, close } = dayHours;
    
    // Enkel sjekk om nåværende tid er mellom åpningstidene
    // Dette er en forenklet implementasjon og bør utvides med bedre tidssammenligning
    return currentTime >= open && currentTime <= close;
  }, [businessConfig.businessHours]);
  
  // Last konfigurasjon ved oppstart
  useEffect(() => {
    if (userId) {
      loadBusinessConfig();
    }
  }, [userId, loadBusinessConfig]);
  
  // Lytter til endringer i business-konfigurasjon
  useEffect(() => {
    const handleConfigChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        setBusinessConfig(customEvent.detail);
      }
    };
    
    window.addEventListener('business-config-change', handleConfigChange);
    
    return () => {
      window.removeEventListener('business-config-change', handleConfigChange);
    };
  }, []);

  return {
    businessConfig,
    isLoading,
    isSaving,
    error,
    isBusinessEnabled: isBusinessEnabled(),
    isBusinessOpen,
    saveBusinessConfig,
    loadBusinessConfig,
    addQuickReply,
    removeQuickReply,
    toggleBusinessMode
  };
};