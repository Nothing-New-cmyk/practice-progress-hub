
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, Trophy, Target, CheckCircle, Calendar, Flame } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabaseClient } from '@/lib/supabase-utils';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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

export const NotificationsDropdown: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
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
        .limit(3);

      userBadges?.forEach(badge => {
        const earnedDate = new Date(badge.earned_at);
        const daysSince = Math.floor((Date.now() - earnedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSince <= 7) {
          notifications.push({
            id: `badge-${badge.id}`,
            type: 'achievement',
            title: 'New Achievement Unlocked!',
            message: `You earned a new badge: ${badge.badge_id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
            time: daysSince === 0 ? 'Today' : `${daysSince} days ago`,
            read: daysSince > 1,
            icon: Trophy,
            actionUrl: '/achievements'
          });
        }
      });

      // Check for streak milestones
      const { data: recentLogs } = await supabaseClient
        .from('daily_logs')
        .select('date, problems_solved')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(7);

      if (recentLogs && recentLogs.length > 0) {
        const hasStreakToday = recentLogs[0] && recentLogs[0].problems_solved > 0;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (!hasStreakToday) {
          notifications.push({
            id: 'daily-reminder',
            type: 'reminder',
            title: 'Daily Practice Reminder',
            message: 'Don\'t break your streak! Log your coding practice for today.',
            time: '2 hours ago',
            read: false,
            icon: Clock,
            actionUrl: '/daily-log'
          });
        }
      }

      // Check for weekly goals progress
      const { data: currentGoals } = await supabaseClient
        .from('weekly_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'in_progress')
        .limit(3);

      currentGoals?.forEach(goal => {
        const progress = (goal.current_value / goal.target_value) * 100;
        if (progress >= 80 && progress < 100) {
          notifications.push({
            id: `goal-${goal.id}`,
            type: 'goal',
            title: 'Goal Almost Complete!',
            message: `You're ${Math.round(progress)}% towards "${goal.goal_description}"`,
            time: '1 day ago',
            read: false,
            icon: Target,
            actionUrl: '/weekly-goals'
          });
        }
      });

      // Add a few system notifications for better UX
      if (notifications.length < 3) {
        notifications.push({
          id: 'welcome',
          type: 'achievement',
          title: 'Welcome to CodeTracker!',
          message: 'Start logging your daily practice to track your progress.',
          time: '3 days ago',
          read: true,
          icon: CheckCircle,
          actionUrl: '/daily-log'
        });
      }

      setNotifications(notifications.slice(0, 10));
    } catch (error) {
      console.error('Error generating notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: "Success",
      description: "All notifications marked as read",
    });
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    
    // Mark as read
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="h-auto p-1 text-xs"
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {loading ? (
          <DropdownMenuItem disabled className="text-center text-muted-foreground">
            Loading notifications...
          </DropdownMenuItem>
        ) : notifications.length === 0 ? (
          <DropdownMenuItem disabled className="text-center text-muted-foreground">
            No notifications
          </DropdownMenuItem>
        ) : (
          notifications.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <DropdownMenuItem
                key={notification.id}
                className="flex items-start gap-3 p-3 cursor-pointer"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex-shrink-0 mt-1">
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {notification.time}
                  </p>
                </div>
              </DropdownMenuItem>
            );
          })
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-center text-sm text-muted-foreground cursor-pointer"
          onClick={() => navigate('/notifications')}
        >
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
