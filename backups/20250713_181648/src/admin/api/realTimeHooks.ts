/**
 * Real-time hooks for MCP Admin Dashboard
 * 
 * Provides React hooks for real-time updates and WebSocket integration
 */

import { useState, useEffect, useCallback } from 'react';
import { mcpAdminAPI } from './mcpAdminAPI';

// Hook for real-time system metrics
export const useRealTimeMetrics = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  useEffect(() => {
    // Initial metrics fetch
    const fetchMetrics = async () => {
      const response = await mcpAdminAPI.getSystemMetrics();
      if (response.success) {
        setMetrics(response.data);
      }
    };
    
    fetchMetrics();
    
    // Set up real-time updates
    const handleMetricsUpdate = (data: any) => {
      setMetrics(data);
      setLastUpdate(new Date());
    };
    
    const handleConnect = () => {
      setIsConnected(true);
    };
    
    const handleDisconnect = () => {
      setIsConnected(false);
    };
    
    mcpAdminAPI.onRealTimeUpdate('metrics_update', handleMetricsUpdate);
    mcpAdminAPI.onRealTimeUpdate('connect', handleConnect);
    mcpAdminAPI.onRealTimeUpdate('disconnect', handleDisconnect);
    
    return () => {
      mcpAdminAPI.offRealTimeUpdate('metrics_update', handleMetricsUpdate);
      mcpAdminAPI.offRealTimeUpdate('connect', handleConnect);
      mcpAdminAPI.offRealTimeUpdate('disconnect', handleDisconnect);
    };
  }, []);
  
  return { metrics, isConnected, lastUpdate };
};

// Hook for real-time user activity
export const useRealTimeUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [userActivity, setUserActivity] = useState<any[]>([]);
  
  useEffect(() => {
    // Initial users fetch
    const fetchUsers = async () => {
      const response = await mcpAdminAPI.getUsers();
      if (response.success) {
        setUsers(response.data.users);
      }
    };
    
    fetchUsers();
    
    // Set up real-time updates
    const handleUserUpdate = (data: any) => {
      setUsers(prevUsers => {
        const updatedUsers = [...prevUsers];
        const index = updatedUsers.findIndex(u => u.id === data.id);
        
        if (index >= 0) {
          updatedUsers[index] = { ...updatedUsers[index], ...data };
        } else {
          updatedUsers.push(data);
        }
        
        return updatedUsers;
      });
    };
    
    const handleUserOnline = (userId: string) => {
      setOnlineUsers(prev => [...prev.filter(id => id !== userId), userId]);
    };
    
    const handleUserOffline = (userId: string) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId));
    };
    
    const handleUserActivity = (activity: any) => {
      setUserActivity(prev => [activity, ...prev.slice(0, 99)]); // Keep last 100 activities
    };
    
    mcpAdminAPI.onRealTimeUpdate('user_update', handleUserUpdate);
    mcpAdminAPI.onRealTimeUpdate('user_online', handleUserOnline);
    mcpAdminAPI.onRealTimeUpdate('user_offline', handleUserOffline);
    mcpAdminAPI.onRealTimeUpdate('user_activity', handleUserActivity);
    
    return () => {
      mcpAdminAPI.offRealTimeUpdate('user_update', handleUserUpdate);
      mcpAdminAPI.offRealTimeUpdate('user_online', handleUserOnline);
      mcpAdminAPI.offRealTimeUpdate('user_offline', handleUserOffline);
      mcpAdminAPI.offRealTimeUpdate('user_activity', handleUserActivity);
    };
  }, []);
  
  return { users, onlineUsers, userActivity };
};

// Hook for real-time chat activity
export const useRealTimeChats = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<Record<string, any[]>>({});
  const [activeChats, setActiveChats] = useState<string[]>([]);
  
  useEffect(() => {
    // Initial chats fetch
    const fetchChats = async () => {
      const response = await mcpAdminAPI.getChats();
      if (response.success) {
        setChats(response.data.chats);
      }
    };
    
    fetchChats();
    
    // Set up real-time updates
    const handleChatUpdate = (data: any) => {
      setChats(prevChats => {
        const updatedChats = [...prevChats];
        const index = updatedChats.findIndex(c => c.id === data.id);
        
        if (index >= 0) {
          updatedChats[index] = { ...updatedChats[index], ...data };
        } else {
          updatedChats.push(data);
        }
        
        return updatedChats;
      });
    };
    
    const handleNewMessage = (message: any) => {
      setMessages(prev => ({
        ...prev,
        [message.chatId]: [message, ...(prev[message.chatId] || [])].slice(0, 50)
      }));
    };
    
    const handleChatActivity = (chatId: string) => {
      setActiveChats(prev => {
        const updated = prev.filter(id => id !== chatId);
        return [chatId, ...updated].slice(0, 10);
      });
    };
    
    mcpAdminAPI.onRealTimeUpdate('chat_update', handleChatUpdate);
    mcpAdminAPI.onRealTimeUpdate('new_message', handleNewMessage);
    mcpAdminAPI.onRealTimeUpdate('chat_activity', handleChatActivity);
    
    return () => {
      mcpAdminAPI.offRealTimeUpdate('chat_update', handleChatUpdate);
      mcpAdminAPI.offRealTimeUpdate('new_message', handleNewMessage);
      mcpAdminAPI.offRealTimeUpdate('chat_activity', handleChatActivity);
    };
  }, []);
  
  return { chats, messages, activeChats };
};

// Hook for real-time system alerts
export const useRealTimeAlerts = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [criticalAlerts, setCriticalAlerts] = useState<any[]>([]);
  
  useEffect(() => {
    const handleSystemAlert = (alert: any) => {
      setAlerts(prev => [alert, ...prev.slice(0, 49)]); // Keep last 50 alerts
      
      if (alert.level === 'critical') {
        setCriticalAlerts(prev => [alert, ...prev.slice(0, 9)]); // Keep last 10 critical alerts
      }
    };
    
    const handleAlertResolved = (alertId: string) => {
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      ));
      
      setCriticalAlerts(prev => prev.filter(alert => alert.id !== alertId));
    };
    
    mcpAdminAPI.onRealTimeUpdate('system_alert', handleSystemAlert);
    mcpAdminAPI.onRealTimeUpdate('alert_resolved', handleAlertResolved);
    
    return () => {
      mcpAdminAPI.offRealTimeUpdate('system_alert', handleSystemAlert);
      mcpAdminAPI.offRealTimeUpdate('alert_resolved', handleAlertResolved);
    };
  }, []);
  
  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    setCriticalAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);
  
  return { alerts, criticalAlerts, dismissAlert };
};

// Hook for real-time email activity
export const useRealTimeEmail = () => {
  const [emailStats, setEmailStats] = useState<any>(null);
  const [recentEmails, setRecentEmails] = useState<any[]>([]);
  
  useEffect(() => {
    const handleEmailSent = (email: any) => {
      setRecentEmails(prev => [email, ...prev.slice(0, 19)]); // Keep last 20 emails
      
      // Update stats
      setEmailStats((prev: any) => {
        if (!prev) return null;
        
        return {
          ...prev,
          sent: prev.sent + 1,
          pending: prev.pending + 1
        };
      });
    };
    
    const handleEmailDelivered = (emailId: string) => {
      setRecentEmails(prev => prev.map(email => 
        email.id === emailId ? { ...email, status: 'delivered' } : email
      ));
      
      setEmailStats((prev: any) => {
        if (!prev) return null;
        
        return {
          ...prev,
          delivered: prev.delivered + 1,
          pending: Math.max(0, prev.pending - 1)
        };
      });
    };
    
    const handleEmailFailed = (emailId: string) => {
      setRecentEmails(prev => prev.map(email => 
        email.id === emailId ? { ...email, status: 'failed' } : email
      ));
      
      setEmailStats((prev: any) => {
        if (!prev) return null;
        
        return {
          ...prev,
          failed: prev.failed + 1,
          pending: Math.max(0, prev.pending - 1)
        };
      });
    };
    
    mcpAdminAPI.onRealTimeUpdate('email_sent', handleEmailSent);
    mcpAdminAPI.onRealTimeUpdate('email_delivered', handleEmailDelivered);
    mcpAdminAPI.onRealTimeUpdate('email_failed', handleEmailFailed);
    
    return () => {
      mcpAdminAPI.offRealTimeUpdate('email_sent', handleEmailSent);
      mcpAdminAPI.offRealTimeUpdate('email_delivered', handleEmailDelivered);
      mcpAdminAPI.offRealTimeUpdate('email_failed', handleEmailFailed);
    };
  }, []);
  
  return { emailStats, recentEmails };
};

// Hook for notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    const handleNotification = (notification: any) => {
      setNotifications(prev => [notification, ...prev.slice(0, 99)]);
      setUnreadCount(prev => prev + 1);
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/admin/icon.png'
        });
      }
    };
    
    mcpAdminAPI.onRealTimeUpdate('notification', handleNotification);
    
    return () => {
      mcpAdminAPI.offRealTimeUpdate('notification', handleNotification);
    };
  }, []);
  
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);
  
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);
  
  return { notifications, unreadCount, markAsRead, markAllAsRead };
};

// Hook for WebSocket connection status
export const useWebSocketStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      setReconnectAttempts(0);
    };
    
    const handleDisconnect = () => {
      setIsConnected(false);
    };
    
    const handleReconnectAttempt = () => {
      setReconnectAttempts(prev => prev + 1);
    };
    
    mcpAdminAPI.onRealTimeUpdate('connect', handleConnect);
    mcpAdminAPI.onRealTimeUpdate('disconnect', handleDisconnect);
    mcpAdminAPI.onRealTimeUpdate('reconnect_attempt', handleReconnectAttempt);
    
    return () => {
      mcpAdminAPI.offRealTimeUpdate('connect', handleConnect);
      mcpAdminAPI.offRealTimeUpdate('disconnect', handleDisconnect);
      mcpAdminAPI.offRealTimeUpdate('reconnect_attempt', handleReconnectAttempt);
    };
  }, []);
  
  return { isConnected, reconnectAttempts };
};
