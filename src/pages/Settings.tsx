
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  first_name: string | null;
  last_name: string | null;
  time_zone: string;
}

interface NotificationPreference {
  id: string;
  channel: 'email' | 'whatsapp';
  type: 'daily_practice' | 'weekly_checkin' | 'monthly_summary' | 'goal_reminder';
  enabled: boolean;
  delivery_time: string;
}

const timezoneOptions = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Berlin', label: 'Berlin' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'Asia/Shanghai', label: 'Shanghai' },
  { value: 'Asia/Kolkata', label: 'India' },
];

export const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState<Profile>({
    first_name: '',
    last_name: '',
    time_zone: 'UTC',
  });
  
  const [notifications, setNotifications] = useState<NotificationPreference[]>([]);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Fetch notification preferences
      const { data: notificationData, error: notificationError } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id);

      if (notificationError) throw notificationError;

      setProfile(profileData || { first_name: '', last_name: '', time_zone: 'UTC' });
      setNotifications(notificationData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          time_zone: profile.time_zone,
        })
        .eq('id', user!.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleNotification = async (id: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .update({ enabled })
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, enabled } : notif
        )
      );

      toast({
        title: "Success",
        description: "Notification preference updated!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update notification preference",
        variant: "destructive",
      });
    }
  };

  const formatNotificationType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="md:ml-64 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="First Name"
                    id="firstName"
                    value={profile.first_name || ''}
                    onChange={(value) => setProfile({...profile, first_name: value})}
                    placeholder="Enter your first name"
                  />
                  <FormInput
                    label="Last Name"
                    id="lastName"
                    value={profile.last_name || ''}
                    onChange={(value) => setProfile({...profile, last_name: value})}
                    placeholder="Enter your last name"
                  />
                </div>
                
                <FormSelect
                  label="Time Zone"
                  id="timeZone"
                  value={profile.time_zone}
                  onChange={(value) => setProfile({...profile, time_zone: value})}
                  options={timezoneOptions}
                />

                <Button type="submit" disabled={saving}>
                  {saving ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <div key={notif.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">
                        {formatNotificationType(notif.type)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Channel: {notif.channel} • Delivery time: {notif.delivery_time}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`notification-${notif.id}`}
                        checked={notif.enabled}
                        onCheckedChange={(enabled) => handleToggleNotification(notif.id, enabled)}
                      />
                      <Label htmlFor={`notification-${notif.id}`}>
                        {notif.enabled ? 'Enabled' : 'Disabled'}
                      </Label>
                    </div>
                  </div>
                ))}
                
                {notifications.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No notification preferences found. They should be created automatically when you sign up.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
