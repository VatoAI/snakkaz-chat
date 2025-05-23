import React, { useState, useEffect } from 'react';
import { Bell, X, Settings, Check } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: 'message' | 'system' | 'mention' | 'friend' | 'group';
  actionUrl?: string;
}

export interface NotificationCenterProps {
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ className }) => {
  const { settings, updateSettings } = useNotifications();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch notifications from an API or context
    // This is a placeholder for demo purposes
    const demoNotifications: Notification[] = [
      {
        id: '1',
        title: 'New Message',
        message: 'You received a new message from Alex',
        timestamp: Date.now() - 15 * 60 * 1000,
        read: false,
        type: 'message',
        actionUrl: '/chat'
      },
      {
        id: '2',
        title: 'System Update',
        message: 'Snakkaz Chat was updated to version 2.1.0',
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
        read: true,
        type: 'system'
      },
      {
        id: '3',
        title: 'Mention',
        message: 'Sarah mentioned you in #general',
        timestamp: Date.now() - 8 * 60 * 60 * 1000,
        read: false,
        type: 'mention',
        actionUrl: '/chat/groups/general'
      }
    ];

    setNotifications(demoNotifications);
    setUnreadCount(demoNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const removeNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleToggleSounds = (checked: boolean) => {
    updateSettings({
      ...settings,
      soundEnabled: checked
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("relative", className)}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="default" 
              className="absolute -top-1 -right-1 px-1 min-w-[1.125rem] h-4.5 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-medium">Notifications</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={markAllAsRead} title="Mark all as read">
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Settings">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full p-0 h-10 rounded-none border-b">
            <TabsTrigger value="all" className="flex-1 rounded-none">All</TabsTrigger>
            <TabsTrigger value="unread" className="flex-1 rounded-none">Unread</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 rounded-none">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="p-0 m-0">
            {notifications.length > 0 ? (
              <ScrollArea className="h-[300px]">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={cn(
                      "p-3 border-b last:border-b-0 flex items-start justify-between gap-2 cursor-pointer",
                      !notification.read && "bg-primary/5"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">{notification.title}</span>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-primary"></span>
                        )}
                      </div>
                      <p className="text-sm opacity-75">{notification.message}</p>
                      <p className="text-xs opacity-50 mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        removeNotification(notification.id); 
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-sm opacity-70">
                No notifications
              </div>
            )}
          </TabsContent>

          <TabsContent value="unread" className="p-0 m-0">
            <ScrollArea className="h-[300px]">
              {notifications.filter(n => !n.read).length > 0 ? 
                notifications
                  .filter(n => !n.read)
                  .map(notification => (
                    <div 
                      key={notification.id} 
                      className="p-3 border-b last:border-b-0 flex items-start justify-between gap-2 cursor-pointer bg-primary/5"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium">{notification.title}</span>
                          <span className="w-2 h-2 rounded-full bg-primary"></span>
                        </div>
                        <p className="text-sm opacity-75">{notification.message}</p>
                        <p className="text-xs opacity-50 mt-1">
                          {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          removeNotification(notification.id); 
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                : (
                  <div className="h-[200px] flex items-center justify-center text-sm opacity-70">
                    No unread notifications
                  </div>
                )
              }
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="p-3 space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="notification-sounds" className="text-sm">Notification Sounds</label>
              <Switch 
                id="notification-sounds" 
                checked={settings.soundEnabled}
                onCheckedChange={handleToggleSounds}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <label htmlFor="notification-browser" className="text-sm">Browser Notifications</label>
              <Switch id="notification-browser" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <label htmlFor="notification-quiet-hours" className="text-sm">Quiet Hours</label>
              <Switch 
                id="notification-quiet-hours" 
                checked={settings.quietHoursEnabled}
                onCheckedChange={(checked) => updateSettings({...settings, quietHoursEnabled: checked})}
              />
            </div>
            {settings.quietHoursEnabled && (
              <div className="flex items-center gap-2 text-sm">
                <span>From</span>
                <input 
                  type="time" 
                  value={settings.quietHoursStart} 
                  onChange={(e) => updateSettings({...settings, quietHoursStart: e.target.value})}
                  className="border rounded p-1 text-xs w-20 bg-transparent"
                />
                <span>to</span>
                <input 
                  type="time" 
                  value={settings.quietHoursEnd} 
                  onChange={(e) => updateSettings({...settings, quietHoursEnd: e.target.value})}
                  className="border rounded p-1 text-xs w-20 bg-transparent"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;