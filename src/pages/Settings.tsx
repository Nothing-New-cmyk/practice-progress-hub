import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabaseClient, Profile, NotificationPreference } from '@/lib/supabase-utils';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { useToast } from '@/hooks/use-toast';

const timezoneOptions = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
];

export const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Partial<Profile>>({
    first_name: '',
    last_name: '',
    time_zone: 'UTC',
  });
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabaseClient
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setPreferences(data || []);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchPreferences();
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabaseClient
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          time_zone: profile.time_zone,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceToggle = async (preferenceId: string, enabled: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabaseClient
        .from('notification_preferences')
        .update({ enabled })
        .eq('id', preferenceId)
        .eq('user_id', user.id);

      if (error) throw error;

      setPreferences(preferences.map(pref => 
        pref.id === preferenceId ? { ...pref, enabled } : pref
      ));

      toast({
        title: "Success",
        description: "Notification preference updated!",
      });
    } catch (error) {
      console.error('Error updating preference:', error);
      toast({
        title: "Error",
        description: "Failed to update preference. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="md:ml-64 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>

          <div className="space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="First Name"
                      id="firstName"
                      value={profile.first_name || ''}
                      onChange={(value) => setProfile({ ...profile, first_name: value })}
                      required
                    />
                    <FormInput
                      label="Last Name"
                      id="lastName"
                      value={profile.last_name || ''}
                      onChange={(value) => setProfile({ ...profile, last_name: value })}
                      required
                    />
                  </div>
                  <FormSelect
                    label="Time Zone"
                    id="timeZone"
                    value={profile.time_zone || 'UTC'}
                    onChange={(value) => setProfile({ ...profile, time_zone: value })}
                    options={timezoneOptions}
                    required
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Profile"}
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
                  {preferences.length === 0 ? (
                    <p className="text-gray-500">No notification preferences found.</p>
                  ) : (
                    preferences.map((pref) => (
                      <div key={pref.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h3 className="font-medium capitalize">
                            {pref.type.replace('_', ' ')} - {pref.channel}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Delivery time: {pref.delivery_time}
                          </p>
                        </div>
                        <Button
                          variant={pref.enabled ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePreferenceToggle(pref.id, !pref.enabled)}
                        >
                          {pref.enabled ? "Enabled" : "Disabled"}
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
