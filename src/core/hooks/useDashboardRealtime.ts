import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  MessageCountData,
  SecurityStatusData,
  NotificationData,
  RecentActivityData,
} from "../../types/dashboard";

interface DashboardData {
  messageCount: MessageCountData;
  securityStatus: SecurityStatusData;
  notifications: NotificationData;
  recentActivity: RecentActivityData;
}

export const useDashboardRealtime = () => {
  const [data, setData] = useState<DashboardData>({
    messageCount: {
      todayMessages: 0,
      unansweredMessages: 0,
      totalMessages: 0,
      trend: "stable",
    },
    securityStatus: {
      encryption: {
        status: "active",
        type: "E2EE",
      },
      session: {
        timeLeft: 3600, // 1 hour
        canRenew: true,
        expiresAt: new Date(Date.now() + 3600000),
      },
      devices: {
        loggedIn: 1,
        suspicious: 0,
      },
    },
    notifications: {
      unread: 0,
      invitations: 0,
      mentions: 0,
      categories: {
        messages: 0,
        groups: 0,
        system: 0,
      },
    },
    recentActivity: {
      activities: [],
      systemStatus: "healthy",
      lastSync: new Date(),
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // 📊 Fetch real-time dashboard data
  const fetchDashboardData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Ikke pålogget");

      // Generate recent activities (mock for now)
      const mockActivities = [
        {
          id: "1",
          type: "login" as const,
          description: "Du logget inn",
          time: new Date(),
          icon: "🔓",
        },
        {
          id: "2",
          type: "profile_update" as const,
          description: "Profil opprettet - velkommen!",
          time: new Date(Date.now() - 300000), // 5 min ago
          icon: "👤",
        },
      ];

      // Mock notifications data for now (until notifications table is created)
      const notifications: any[] = [];
      const unreadNotifications = notifications?.length || 0;
      const invitations =
        notifications?.filter((n) => n.type === "invitation").length || 0;

      // Fetch message counts from rooms where user is a participant
      const { data: userRooms, error: roomsError } = await supabase
        .from("room_participants")
        .select("room_id")
        .eq("user_id", user.id);

      if (roomsError) throw roomsError;

      const roomIds = userRooms?.map((r) => r.room_id) || [];

      if (roomIds.length > 0) {
        const { data: messages, error: msgError } = await supabase
          .from("messages")
          .select("created_at, sender_id")
          .in("room_id", roomIds);

        if (msgError) throw msgError;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayMessages =
          messages?.filter((msg) => new Date(msg.created_at) >= today).length ||
          0;

        // Messages not from the current user are "unanswered" (simplified logic)
        const unansweredMessages =
          messages?.filter((msg) => msg.sender_id !== user.id).length || 0;

        // Calculate trend (simplified)
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const yesterdayMessages =
          messages?.filter((msg) => {
            const msgDate = new Date(msg.created_at);
            return msgDate >= yesterday && msgDate < today;
          }).length || 0;

        const trend =
          todayMessages > yesterdayMessages
            ? "up"
            : todayMessages < yesterdayMessages
            ? "down"
            : "stable";

        // Update state with real data
        setData((prev) => ({
          ...prev,
          messageCount: {
            todayMessages,
            unansweredMessages,
            totalMessages: messages?.length || 0,
            trend,
          },
          notifications: {
            unread: unreadNotifications,
            invitations,
            mentions: 0, // TODO: Implement mentions
            categories: {
              messages:
                notifications?.filter((n) => n.category === "message").length ||
                0,
              groups:
                notifications?.filter((n) => n.category === "group").length ||
                0,
              system:
                notifications?.filter((n) => n.category === "system").length ||
                0,
            },
          },
          recentActivity: {
            activities: mockActivities,
            systemStatus: "healthy",
            lastSync: new Date(),
          },
        }));
      } else {
        // No rooms joined yet
        setData((prev) => ({
          ...prev,
          messageCount: {
            todayMessages: 0,
            unansweredMessages: 0,
            totalMessages: 0,
            trend: "stable",
          },
          notifications: {
            unread: unreadNotifications,
            invitations,
            mentions: 0,
            categories: {
              messages: 0,
              groups: 0,
              system: 0,
            },
          },
          recentActivity: {
            activities: mockActivities,
            systemStatus: "healthy",
            lastSync: new Date(),
          },
        }));
      }

      setError(null);
    } catch (err) {
      console.error("Feil ved henting av dashboard data:", err);
      setError(err instanceof Error ? err.message : "Ukjent feil");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Setup real-time subscriptions
  useEffect(() => {
    // Initial fetch
    fetchDashboardData();

    // Set up periodic refresh for session timer
    intervalRef.current = setInterval(() => {
      setData((prev) => ({
        ...prev,
        securityStatus: {
          ...prev.securityStatus,
          session: {
            ...prev.securityStatus.session,
            timeLeft: Math.max(0, prev.securityStatus.session.timeLeft - 5),
          },
        },
      }));
    }, 5000); // Update every 5 seconds

    // Subscribe to real-time updates
    const messageChannel = supabase
      .channel("dashboard-messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    const notificationChannel = supabase
      .channel("dashboard-notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(notificationChannel);
    };
  }, []);

  // 🔄 Manual refresh function
  const refresh = () => {
    setLoading(true);
    fetchDashboardData();
  };

  return {
    data,
    loading,
    error,
    refresh,
  };
};
