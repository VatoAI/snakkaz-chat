
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook that checks if the given user id is an admin based on user_roles table
 * Will return:
 * - isAdmin: boolean
 * - loading: boolean (true while checking)
 */
export function useIsAdmin(userId?: string | null) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(!!userId);

  useEffect(() => {
    if (!userId) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle(); // safer to use maybeSingle to avoid errors if no data
      if (!cancelled) {
        setIsAdmin(!!data);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { isAdmin, loading };
}
