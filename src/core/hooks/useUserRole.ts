
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useUserRole = (userId: string | null) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const checkAdminRole = useCallback(async (uid: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the RPC function for better performance
      const { data, error: rpcError } = await supabase.rpc('has_role', {
        user_id: uid,
        role: 'admin'
      });

      if (rpcError) {
        console.error('Error checking admin role via RPC:', rpcError);
        
        // Fallback to direct query if RPC fails
        const { data: roleData, error: queryError } = await supabase
          .from('user_roles')
          .select('id')
          .eq('user_id', uid)
          .eq('role', 'admin')
          .maybeSingle();
        
        if (queryError) {
          throw queryError;
        }
        
        setIsAdmin(!!roleData);
      } else {
        setIsAdmin(!!data);
      }
    } catch (err) {
      console.error('Error checking admin role:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      // Show toast only in development
      if (process.env.NODE_ENV === 'development') {
        toast({
          title: "Feil ved sjekk av admin-rolle",
          description: "Kunne ikke verifisere admin-status. Se konsollen for detaljer.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!userId) {
      setIsAdmin(false);
      setLoading(false);
      setError(null);
      return;
    }

    checkAdminRole(userId);
    
    // Subscribe to changes in user_roles table
    const channel = supabase
      .channel('user_roles_changes')
      .on(
        'postgres_changes',
        { 
          event: '*',
          schema: 'public',
          table: 'user_roles',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          // Recheck admin role when changes occur
          checkAdminRole(userId);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, checkAdminRole]);

  return { isAdmin, loading, error, refetch: () => userId && checkAdminRole(userId) };
};
