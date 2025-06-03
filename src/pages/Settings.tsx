
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/providers/ThemeProvider';
import { supabaseClient, Profile, NotificationPreference } from '@/lib/supabase-utils';
import { AppLayout } from '@/components/layouts/AppLayout';
import { SectionHeader } from '@/components/ui/section-header';
import { GlassmorphicCard } from '@/components/ui/glassmorphic-card';
import { NeumorphicButton } from '@/components/ui/neumorphic-button';
import { NeumorphicInput } from '@/components/ui/neumorphic-input';
import { NeumorphicToggle } from '@/components/ui/neumorphic-toggle';
import { FormSelect } from '@/components/ui/form-select';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, User, Bell, Palette, Shield } from 'lucide-react';

const timezoneOptions = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
];

export const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Partial<Profile>>({
    first_name: '',
    last_name: '',
    time_zone: 'UTC',
  });
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [darkMode, setDarkMode] = useState(theme === 'dark');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

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

  useEffect(() => {
    setTheme(darkMode ? 'dark' : 'light');
  }, [darkMode, setTheme]);

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
        description: "Profile updated successfully! 🎉",
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

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-8">
        <SectionHeader
          title="Settings"
          subtitle="Customize your experience and preferences"
          icon={SettingsIcon}
        />

        <div className="max-w-4xl space-y-6">
          {/* Profile Settings */}
          <GlassmorphicCard variant="strong" className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold heading-gradient">Profile Information</h2>
            </div>
            
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <NeumorphicInput
                    value={profile.first_name || ''}
                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <NeumorphicInput
                    value={profile.last_name || ''}
                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Zone</label>
                <FormSelect
                  value={profile.time_zone || 'UTC'}
                  onChange={(value) => setProfile({ ...profile, time_zone: value })}
                  options={timezoneOptions}
                  required
                />
              </div>
              
              <NeumorphicButton type="submit" disabled={loading} variant="raised">
                {loading ? "Updating..." : "Update Profile"}
              </NeumorphicButton>
            </form>
          </GlassmorphicCard>

          {/* Appearance Settings */}
          <GlassmorphicCard variant="strong" className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Palette className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold heading-gradient">Appearance</h2>
            </div>
            
            <div className="space-y-6">
              <NeumorphicToggle
                checked={darkMode}
                onCheckedChange={setDarkMode}
                label="Dark Mode"
              />
              
              <NeumorphicToggle
                checked={highContrast}
                onCheckedChange={setHighContrast}
                label="High Contrast"
              />
            </div>
          </GlassmorphicCard>

          {/* Notification Settings */}
          <GlassmorphicCard variant="strong" className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Bell className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold heading-gradient">Notifications</h2>
            </div>
            
            <div className="space-y-6">
              <NeumorphicToggle
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
                label="Email Notifications"
              />
              
              <NeumorphicToggle
                checked={whatsappNotifications}
                onCheckedChange={setWhatsappNotifications}
                label="WhatsApp Reminders"
              />
              
              <div className="text-sm text-muted-foreground">
                Get reminded about your daily practice sessions and weekly goal reviews.
              </div>
            </div>
          </GlassmorphicCard>

          {/* Accessibility Settings */}
          <GlassmorphicCard variant="strong" className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Shield className="h-5 w-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold heading-gradient">Accessibility</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                All interactive elements include keyboard navigation and screen reader support.
                Use Tab to navigate and Enter/Space to activate controls.
              </p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>✓ Keyboard Navigation</span>
                <span>✓ Screen Reader Support</span>
                <span>✓ Focus Indicators</span>
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      </div>
    </AppLayout>
  );
};
