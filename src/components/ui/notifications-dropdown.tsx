
import React from 'react';
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
import { Bell, Clock, Trophy, Target, CheckCircle } from 'lucide-react';

const mockNotifications = [
  {
    id: '1',
    type: 'reminder',
    title: 'Daily Practice Reminder',
    message: 'Time for your daily coding practice!',
    time: '5 minutes ago',
    read: false,
    icon: Clock,
  },
  {
    id: '2',
    type: 'achievement',
    title: 'New Badge Earned!',
    message: 'You earned the "Problem Solver" badge',
    time: '2 hours ago',
    read: false,
    icon: Trophy,
  },
  {
    id: '3',
    type: 'goal',
    title: 'Weekly Goal Progress',
    message: 'You\'re 80% towards your weekly goal',
    time: '1 day ago',
    read: true,
    icon: Target,
  },
];

export const NotificationsDropdown: React.FC = () => {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    console.log('Mark all notifications as read');
    // TODO: Implement mark all as read functionality
  };

  const handleNotificationClick = (notificationId: string) => {
    console.log('Notification clicked:', notificationId);
    // TODO: Implement notification click handling
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
        
        {mockNotifications.length === 0 ? (
          <DropdownMenuItem disabled className="text-center text-muted-foreground">
            No notifications
          </DropdownMenuItem>
        ) : (
          mockNotifications.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <DropdownMenuItem
                key={notification.id}
                className="flex items-start gap-3 p-3 cursor-pointer"
                onClick={() => handleNotificationClick(notification.id)}
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
        <DropdownMenuItem className="text-center text-sm text-muted-foreground">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
