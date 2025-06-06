
import { AppLayout } from '@/components/layouts/AppLayout';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, Trophy, Target, CheckCircle, Calendar, Flame, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabaseClient } from '@/lib/supabase-utils';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: 'reminder' | 'achievement' | 'goal' | 'streak' | 'contest';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ElementType;
  actionUrl?: string;
}

export const Notifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      generateNotifications();
    }
  }, [user]);

  const generateNotifications = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const notifications: Notification[] = [];

      // Check for recent achievements
      const { data: userBadges } = await supabaseClient
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false })
        .limit(5);

      userBadges?.forEach(badge => {
        const earnedDate = new Date(badge.earned_at);
        const daysSince = Math.floor((Date.now() - earnedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSince <= 30) {
          notifications.push({
            id: `badge-${badge.id}`,
            type: 'achievement',
            title: 'New Achievement Unlocked!',
            message: `You earned a new badge: ${badge.badge_id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
            time: daysSince === 0 ? 'Today' : `${daysSince} days ago`,
            read: daysSince > 3,
            icon: Trophy,
            actionUrl: '/achievements'
          });
        }
      });

      // Add system notifications
      notifications.push(
        {
          id: 'daily-reminder',
          type: 'reminder',
          title: 'Daily Practice Reminder',
          message: 'Don\'t forget to log your coding practice for today!',
          time: '2 hours ago',
          read: false,
          icon: Clock,
          actionUrl: '/daily-log'
        },
        {
          id: 'streak-milestone',
          type: 'streak',
          title: 'Streak Milestone!',
          message: 'You\'ve maintained a 7-day coding streak! Keep it up!',
          time: '1 day ago',
          read: false,
          icon: Flame,
        },
        {
          id: 'welcome',
          type: 'achievement',
          title: 'Welcome to NoobsterDSA!',
          message: 'Start logging your daily practice to track your progress.',
          time: '3 days ago',
          read: true,
          icon: CheckCircle,
          actionUrl: '/daily-log'
        }
      );

      setNotifications(notifications.slice(0, 20));
    } catch (error) {
      console.error('Error generating notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: "Success",
      description: "All notifications marked as read",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: "Success",
      description: "Notification deleted",
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <AppLayout>
        <div className="p-4 md:p-6 space-y-8 max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <SectionHeader
            title="Notifications"
            subtitle={`${unreadCount} unread notifications`}
            icon={Bell}
          />
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              Mark all as read
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <div 
                      key={notification.id} 
                      className={`flex items-start gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors ${
                        !notification.read ? 'bg-blue-50/50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <IconComponent className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium leading-none">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {notification.time}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {notification.type}
                          </Badge>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-auto p-1 text-xs"
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};
