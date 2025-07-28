/**
 * NotificationSystem Component
 * 
 * FASE 2: Oppdatert notifikasjonssystem med lyd, pop-up og sosiale medier støtte
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Bell, 
  User, 
  Users, 
  MessageCircle, 
  Check, 
  Clock, 
  ArrowRight, 
  Smartphone,
  Volume2,
  VolumeX,
  Settings,
  Facebook,
  Instagram,
  Send as TelegramIcon
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  TelegramIcon as TelegramSvgIcon, 
  FacebookIcon, 
  InstagramIcon, 
  SnapchatIcon, 
  TikTokIcon 
} from '@/features/groups/components/SocialIcons';
import { isNotificationMCPEnabled } from '@/config/group-mcp-config';

interface Notification {
  id: string;
  type: 'invite' | 'message' | 'group_join' | 'mention' | 'system' | 'social_invite';
  title: string;
  description: string;
  created_at: string;
  read: boolean;
  image_url?: string;
  action_url?: string;
  sender_id?: string;
  sender?: {
    username: string;
    avatar_url?: string;
  };
  social_platform?: 'telegram' | 'facebook' | 'instagram' | 'snapchat' | 'tiktok';
}

const NotificationSystem: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [settings, setSettings] = useState({
    enableSound: true,
    enablePopup: true,
    enableVibration: true,
    groupNotifications: true,
    mentionNotifications: true,
    messageNotifications: true,
    systemNotifications: true,
    socialInviteNotifications: true,
    selectedSound: 'default'
  });

  // MCP status
  const mcpEnabled = isNotificationMCPEnabled();
  
  // Audio ref for notification sounds
  useEffect(() => {
    audioRef.current = new Audio('/sounds/notification.mp3');
    audioRef.current.volume = 0.5;
  }, []);

  // Mock notifications for demo with social platforms
  useEffect(() => {
    if (!user) return;
    
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'social_invite',
        title: 'Invitasjon sendt til Telegram',
        description: 'Din invitasjon til gruppen "Design System" er delt på Telegram',
        created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 minutes ago
        read: false,
        action_url: '/group/123',
        social_platform: 'telegram',
        sender_id: 'user123',
        sender: {
          username: 'DesignMaster',
          avatar_url: '/assets/design.jpg'
        }
      },
      {
        id: '2',
        type: 'invite',
        title: 'Ny gruppeinvitasjon',
        description: 'Du har blitt invitert til å bli med i gruppen "MCP Utvikling"',
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        read: false,
        action_url: '/invite/accept/123',
        sender_id: 'user123',
        sender: {
          username: 'SnakkaZ Bot',
          avatar_url: '/assets/snakkaz-logo.jpg'
        }
      },
      {
        id: '3',
        type: 'social_invite',
        title: 'Facebook-invite mottatt',
        description: 'Noen ble med i gruppen via din Facebook-invitasjon',
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        read: false,
        action_url: '/group/456',
        social_platform: 'facebook',
        sender_id: 'user456',
        sender: {
          username: 'SocialUser',
          avatar_url: '/assets/social.jpg'
        }
      },
      {
        id: '4',
        type: 'message',
        title: 'Ny melding i Instagram-gruppen',
        description: 'DevTeam: Sjekk ut den nye MCP-integrasjonen! 🚀',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        read: false,
        action_url: '/chat/group/789',
        social_platform: 'instagram',
        sender_id: 'user789',
        sender: {
          username: 'DevTeam',
          avatar_url: '/assets/dev.jpg'
        }
      },
      {
        id: '5',
        type: 'system',
        title: 'SnakkaZ v2.0 lansert!',
        description: 'Sosiale medier-integrasjon, MCP-forbedringer og mobile notifikasjoner er nå live',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        read: true
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, [user]);

  // Play notification sound
  const playNotificationSound = () => {
    if (settings.enableSound && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.warn('Could not play notification sound:', err);
      });
    }
  };

  // Trigger vibration (mobile)
  const triggerVibration = () => {
    if (settings.enableVibration && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  // Show popup notification
  const showPopupNotification = (notification: Notification) => {
    if (!settings.enablePopup) return;
    
    // Use browser's Notification API if available
    if ('Notification' in window && Notification.permission === 'granted') {
      const notif = new Notification(notification.title, {
        body: notification.description,
        icon: notification.sender?.avatar_url || '/assets/snakkaz-logo.jpg',
        tag: notification.id
      });
      
      notif.onclick = () => {
        if (notification.action_url) {
          window.location.href = notification.action_url;
        }
        notif.close();
      };
      
      setTimeout(() => notif.close(), 5000);
    } else {
      // Fallback to toast
      toast({
        title: notification.title,
        description: notification.description,
      });
    }
  };

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Simulate receiving a notification
  const simulateNotification = (type: Notification['type']) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type,
      title: `Test ${type} notifikasjon`,
      description: `Dette er en test-notifikasjon av typen ${type}`,
      created_at: new Date().toISOString(),
      read: false,
      sender: {
        username: 'Test User',
        avatar_url: '/assets/test.jpg'
      }
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Trigger effects based on settings
    playNotificationSound();
    triggerVibration();
    showPopupNotification(newNotification);
  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  // Get notification icon based on type and social platform
  const getNotificationIcon = (notification: Notification) => {
    if (notification.type === 'social_invite' && notification.social_platform) {
      switch (notification.social_platform) {
        case 'telegram':
          return <TelegramSvgIcon className="w-4 h-4 text-blue-500" />;
        case 'facebook':
          return <FacebookIcon className="w-4 h-4 text-blue-600" />;
        case 'instagram':
          return <InstagramIcon className="w-4 h-4 text-pink-600" />;
        case 'snapchat':
          return <SnapchatIcon className="w-4 h-4 text-yellow-400" />;
        case 'tiktok':
          return <TikTokIcon className="w-4 h-4 text-black" />;
        default:
          return <Bell className="w-4 h-4" />;
      }
    }
    
    switch (notification.type) {
      case 'invite':
        return <UserPlus className="w-4 h-4 text-blue-500" />;
      case 'message':
        return <MessageCircle className="w-4 h-4 text-green-500" />;
      case 'group_join':
        return <Users className="w-4 h-4 text-purple-500" />;
      case 'mention':
        return <Bell className="w-4 h-4 text-orange-500" />;
      case 'system':
        return <Settings className="w-4 h-4 text-gray-500" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'akkurat nå';
    if (diffMins < 60) return `${diffMins}m siden`;
    if (diffHours < 24) return `${diffHours}t siden`;
    return (
    <div className="relative">
      {/* MCP Status Badge */}
      {mcpEnabled && (
        <Badge variant="default" className="absolute -top-2 -right-2 bg-green-500">
          MCP
        </Badge>
      )}
      
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {showNotifications && (
        <div className="absolute right-0 top-12 w-80 max-h-96 bg-background border rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Notifikasjoner</h3>
            <div className="flex items-center gap-2">
              {settings.enableSound ? (
                <Volume2 className="h-4 w-4 text-green-500" />
              ) : (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              )}
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Merk alle som lest
              </Button>
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Ingen notifikasjoner</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 border-b hover:bg-muted/50 cursor-pointer transition-colors",
                    !notification.read && "bg-blue-50 border-l-4 border-l-blue-500"
                  )}
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.action_url) {
                      window.location.href = notification.action_url;
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {notification.sender?.avatar_url ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={notification.sender.avatar_url} />
                          <AvatarFallback>
                            {notification.sender.username.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        getNotificationIcon(notification)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.description}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(notification.created_at)}
                        </span>
                        {notification.social_platform && (
                          <Badge variant="outline" className="text-xs">
                            {notification.social_platform}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Test Notification Buttons (Debug Mode) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="p-3 border-t bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">Test notifikasjoner:</p>
              <div className="flex flex-wrap gap-1">
                <Button size="sm" variant="outline" onClick={() => simulateNotification('invite')}>
                  Invite
                </Button>
                <Button size="sm" variant="outline" onClick={() => simulateNotification('message')}>
                  Message
                </Button>
                <Button size="sm" variant="outline" onClick={() => simulateNotification('social_invite')}>
                  Social
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
    if (Notification.permission === "granted") {
      new Notification(`SnakkaZ - ${notification.title}`, {
        body: notification.description,
        icon: "/logo192.png"
      });
    }
    // Otherwise, request permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(`SnakkaZ - ${notification.title}`, {
            body: notification.description,
            icon: "/logo192.png"
          });
        }
      });
    }
  };
  
  // Play notification sound
  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.play().catch(error => console.log('Error playing sound:', error));
  };
  
  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    
    const newUnreadCount = notifications.filter(n => !n.read && n.id !== id).length;
    setUnreadCount(newUnreadCount);
  };
  
  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };
  
  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffMinutes < 1) return 'Nå';
    if (diffMinutes < 60) return `${diffMinutes}m`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}t`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d`;
    
    return date.toLocaleDateString();
  };
  
  // Get icon for notification type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'invite':
        return <Users className="h-4 w-4 text-cyberblue-400" />;
      case 'message':
        return <MessageCircle className="h-4 w-4 text-cybergreen-400" />;
      case 'group_join':
        return <User className="h-4 w-4 text-cybergold-400" />;
      case 'mention':
        return <ArrowRight className="h-4 w-4 text-cyberpink-400" />;
      case 'system':
      default:
        return <Bell className="h-4 w-4 text-cybergold-400" />;
    }
  };

  // Toggle notification settings
  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="relative">
      {/* Bell icon with badge */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-full text-cybergold-400 hover:text-cybergold-100 hover:bg-cyberdark-800/50 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 min-w-4 h-4 p-0 flex items-center justify-center text-[10px] bg-cybergold-500 text-black">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </button>
      
      {/* Notification dropdown */}
      {showNotifications && (
        <div className="absolute z-50 right-0 mt-2 w-80 md:w-96 bg-cyberdark-900 border border-cyberdark-700 rounded-lg shadow-xl shadow-black/30 overflow-hidden">
          <div className="p-3 border-b border-cyberdark-700 flex items-center justify-between">
            <h3 className="font-medium text-cybergold-100">Notifikasjoner</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-8 text-xs text-cybergold-400 hover:text-cybergold-100"
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Marker alle som lest
              </Button>
            )}
          </div>
          
          {/* Tabs for notifications/settings */}
          <div className="max-h-[70vh] overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-cyberdark-800">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-3 flex gap-3 hover:bg-cyberdark-800/50 transition-colors cursor-pointer",
                      !notification.read && "bg-cybergold-900/5"
                    )}
                    onClick={() => {
                      markAsRead(notification.id);
                      if (notification.action_url) {
                        // In a real app, we would navigate to the action URL
                        console.log(`Navigate to: ${notification.action_url}`);
                      }
                    }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {notification.sender ? (
                        <Avatar className="h-9 w-9 border border-cyberdark-700">
                          <AvatarFallback className="bg-cyberdark-800 text-cybergold-400">
                            {notification.sender.username.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-cyberdark-800 flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm text-cybergold-100 line-clamp-1">
                          {notification.title}
                        </p>
                        <span className="text-xs text-cybergold-500 whitespace-nowrap flex-shrink-0">
                          {formatRelativeTime(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-cybergold-400 mt-1 line-clamp-2">
                        {notification.description}
                      </p>
                      
                      {!notification.read && (
                        <div className="mt-1.5 flex justify-end">
                          <Badge variant="outline" className="h-5 px-1.5 text-[10px] border-cybergold-500/50 text-cybergold-400">
                            Ny
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-cyberdark-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="h-6 w-6 text-cybergold-500/50" />
                </div>
                <h4 className="text-cybergold-300 font-medium">Ingen notifikasjoner</h4>
                <p className="text-cybergold-500 text-sm mt-1">
                  Du vil se notifikasjoner når du mottar meldinger eller invitasjoner
                </p>
              </div>
            )}
          </div>
          
          {/* Mobile notification settings */}
          <div className="border-t border-cyberdark-700 p-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-popup" className="text-xs text-cybergold-300 flex items-center">
                <Smartphone className="h-3.5 w-3.5 mr-1.5" />
                Mobilnotifikasjoner
              </Label>
              <Switch
                id="enable-popup"
                checked={settings.enablePopup}
                onCheckedChange={() => toggleSetting('enablePopup')}
                className="scale-75"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
