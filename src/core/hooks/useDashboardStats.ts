import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../auth/AuthProvider";

interface DashboardStats {
  totalMessages: number;
  activeUsers: number;
  userLevel: number;
  securityScore: number;
}

export const useDashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    activeUsers: 0,
    userLevel: 1,
    securityScore: 100,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);

        // Get total messages count for current user
        const { count: messageCount, error: messageError } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("author_id", user.id);

        if (messageError) throw messageError;

        // Get active users count (users who sent messages in last 24 hours)
        const oneDayAgo = new Date(
          Date.now() - 24 * 60 * 60 * 1000
        ).toISOString();
        const { count: activeUsersCount, error: usersError } = await supabase
          .from("messages")
          .select("author_id", { count: "exact", head: true })
          .gte("created_at", oneDayAgo);

        if (usersError) throw usersError;

        // Get user profile data for level calculation
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        // Calculate user level based on message count
        const userLevel = Math.min(
          Math.floor((messageCount || 0) / 100) + 1,
          10
        );

        // Calculate security score (based on profile completeness)
        let securityScore = 70; // Base score
        if (profile?.avatar_url) securityScore += 10;
        if (profile?.bio && profile.bio.length > 20) securityScore += 10;
        if (profile?.display_name) securityScore += 10;

        setStats({
          totalMessages: messageCount || 0,
          activeUsers: Math.max(activeUsersCount || 0, 1), // At least show current user
          userLevel,
          securityScore: Math.min(securityScore, 100),
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        // Set fallback stats on error
        setStats({
          totalMessages: 0,
          activeUsers: 1,
          userLevel: 1,
          securityScore: 100,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Set up real-time subscription for new messages
    const messageSubscription = supabase
      .channel("dashboard-stats")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `author_id=eq.${user.id}`,
        },
        () => {
          // Refetch stats when new message is added
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [user]);

  return { stats, loading, error };
};
