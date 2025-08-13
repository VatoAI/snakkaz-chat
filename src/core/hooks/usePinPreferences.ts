
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PinPreferences {
  requirePinForEdit: boolean;
  requirePinForDelete: boolean; 
  requirePinForSensitive: boolean;
  stayLoggedIn?: boolean;
}

export const usePinPreferences = (userId: string | null) => {
  const [preferences, setPreferences] = useState<PinPreferences>({
    requirePinForEdit: false,
    requirePinForDelete: false,
    requirePinForSensitive: false,
    stayLoggedIn: false
  });
  
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    const fetchPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('pin_preferences')
          .eq('id', userId)
          .single();
          
        if (error) throw error;
        
        if (data && data.pin_preferences) {
          setPreferences({
            ...preferences,
            ...data.pin_preferences,
            stayLoggedIn: data.pin_preferences.stayLoggedIn || false
          });
        }
      } catch (error) {
        console.error('Error fetching pin preferences:', error);
        toast({
          title: "Kunne ikke hente PIN-innstillinger",
          description: "Det oppstod en feil ved henting av innstillinger",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPreferences();
  }, [userId, toast]);
  
  const updatePreferences = async (newPrefs: Partial<PinPreferences>) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Merge with current preferences
      const updatedPreferences = { ...preferences, ...newPrefs };
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          pin_preferences: updatedPreferences 
        })
        .eq('id', userId);
        
      if (error) throw error;
      
      setPreferences(updatedPreferences);
      toast({
        title: "Innstillinger oppdatert",
        description: "PIN-innstillingene dine er nå oppdatert",
      });
    } catch (error) {
      console.error('Error updating pin preferences:', error);
      toast({
        title: "Kunne ikke oppdatere innstillinger",
        description: "Det oppstod en feil ved lagring av innstillinger",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return {
    preferences,
    loading,
    updatePreferences
  };
};
