// 📊 SnakkaZ Dashboard Types - Widget System
export interface DashboardWidget {
  id: string;
  title: string;
  priority: "critical" | "important" | "nice-to-have";
  category: "activity" | "security" | "social" | "actions";
  mobileVisible: boolean;
  refreshInterval?: number; // seconds
  data: any;
  lastUpdated: Date;
}

export interface MessageCountData {
  todayMessages: number;
  unansweredMessages: number;
  totalMessages: number;
  trend: "up" | "down" | "stable";
}

export interface SecurityStatusData {
  encryption: {
    status: "active" | "inactive" | "warning";
    type: "E2EE" | "TLS" | "none";
  };
  session: {
    timeLeft: number; // seconds
    canRenew: boolean;
    expiresAt: Date;
  };
  devices: {
    loggedIn: number;
    suspicious: number;
  };
}

export interface GroupOverviewData {
  myGroups: number;
  activeGroups: number;
  totalMembers: number;
  recentActivity: Array<{
    groupId: string;
    groupName: string;
    lastMessage: Date;
    unreadCount: number;
  }>;
}

export interface NotificationData {
  unread: number;
  invitations: number;
  mentions: number;
  categories: {
    messages: number;
    groups: number;
    system: number;
  };
}

export interface UserProgressData {
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
  achievements: string[];
  rank: string;
}

export interface ActivityItem {
  id: string;
  type: "message" | "login" | "group_join" | "profile_update" | "first_time";
  description: string;
  time: Date;
  icon: string;
}

export interface RecentActivityData {
  activities: ActivityItem[];
  systemStatus: "healthy" | "warning" | "error";
  lastSync: Date;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  highlight?: boolean;
}

// Dashboard Layout Types
export interface DashboardLayout {
  mobile: WidgetPosition[];
  tablet: WidgetPosition[];
  desktop: WidgetPosition[];
}

export interface WidgetPosition {
  widgetId: string;
  row: number;
  col: number;
  span: number;
  visible: boolean;
}

// Real-time Update Types
export interface RealtimeUpdate {
  widgetId: string;
  data: any;
  timestamp: Date;
  source: "websocket" | "polling" | "manual";
}
