
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, MessageSquare, Calendar, Send } from 'lucide-react';

interface ReminderChannel {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  enabled: boolean;
  setupUrl?: string;
}

interface ReminderType {
  id: string;
  name: string;
  description: string;
  defaultTime: string;
  enabled: boolean;
}

export const ReminderSettings = () => {
  const [channels, setChannels] = useState<ReminderChannel[]>([
    {
      id: 'email',
      name: 'Email',
      icon: <Mail className="h-4 w-4" />,
      description: 'Receive reminders via email',
      enabled: true
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <MessageSquare className="h-4 w-4" />,
      description: 'Get reminders on WhatsApp',
      enabled: false,
      setupUrl: 'https://wa.me/your-bot-number'
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: <MessageSquare className="h-4 w-4" />,
      description: 'Discord DM notifications',
      enabled: false,
      setupUrl: 'https://discord.com/oauth2/authorize?client_id=your-bot-id'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: <Send className="h-4 w-4" />,
      description: 'Telegram bot messages',
      enabled: false,
      setupUrl: 'https://t.me/your-bot-name'
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      icon: <Calendar className="h-4 w-4" />,
      description: 'Add reminders to your Google Calendar',
      enabled: false,
      setupUrl: 'https://calendar.google.com'
    }
  ]);

  const [reminderTypes, setReminderTypes] = useState<ReminderType[]>([
    {
      id: 'daily-practice',
      name: 'Daily Practice',
      description: 'Remind me to log my practice session',
      defaultTime: '21:00',
      enabled: true
    },
    {
      id: 'weekly-review',
      name: 'Weekly Review',
      description: 'Weekly goal check-in reminder',
      defaultTime: '08:00',
      enabled: true
    },
    {
      id: 'contest-alert',
      name: 'Contest Alerts',
      description: 'Upcoming contest notifications',
      defaultTime: '18:00',
      enabled: false
    },
    {
      id: 'streak-warning',
      name: 'Streak Warning',
      description: 'Alert when streak is at risk',
      defaultTime: '20:00',
      enabled: true
    }
  ]);

  const toggleChannel = (channelId: string) => {
    setChannels(channels.map(channel => 
      channel.id === channelId 
        ? { ...channel, enabled: !channel.enabled }
        : channel
    ));
  };

  const toggleReminderType = (typeId: string) => {
    setReminderTypes(reminderTypes.map(type => 
      type.id === typeId 
        ? { ...type, enabled: !type.enabled }
        : type
    ));
  };

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-500" />
            Notification Channels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {channels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                    {channel.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{channel.name}</h4>
                      {channel.enabled && <Badge variant="secondary" className="text-xs">Active</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{channel.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {!channel.enabled && channel.setupUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={channel.setupUrl} target="_blank" rel="noopener noreferrer">
                        Setup
                      </a>
                    </Button>
                  )}
                  <Switch
                    checked={channel.enabled}
                    onCheckedChange={() => toggleChannel(channel.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reminder Types */}
      <Card>
        <CardHeader>
          <CardTitle>Reminder Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reminderTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{type.name}</h4>
                    {type.enabled && <Badge variant="secondary" className="text-xs">Enabled</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
                <div className="flex items-center space-x-3">
                  {type.enabled && (
                    <Select defaultValue={type.defaultTime}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, '0');
                          return (
                            <SelectItem key={i} value={`${hour}:00`}>
                              {hour}:00
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                  <Switch
                    checked={type.enabled}
                    onCheckedChange={() => toggleReminderType(type.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Test Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Send test notifications to verify your setup is working correctly.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Test Email
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Test WhatsApp
              </Button>
              <Button variant="outline" size="sm">
                <Send className="h-4 w-4 mr-2" />
                Test All Active
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
