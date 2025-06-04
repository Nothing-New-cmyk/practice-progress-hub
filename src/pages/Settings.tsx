import { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { SectionHeader } from '@/components/ui/section-header';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { GlassmorphicCard } from '@/components/ui/glassmorphic-card';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { NeumorphicToggle } from '@/components/ui/neumorphic-toggle';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon,
  Bell,
  User,
  Shield,
  Palette,
  Clock,
  Mail,
  Smartphone,
  Save,
  Check
} from 'lucide-react';

export const Settings = () => {
  const [profile, setProfile] = useState({
    displayName: 'Alexandr',
    email: 'alex@example.com',
    timezone: 'UTC'
  });

  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    weeklyCheckIns: false,
    achievements: true,
    reminderTime: '17:00',
    email: true,
    push: false
  });

  const [appearance, setAppearance] = useState({
    theme: 'system',
    highContrast: false,
    animations: true
  });

  const [privacy, setPrivacy] = useState({
    analytics: true,
    publicProfile: false
  });

  const handleSave = () => {
    // Here you would typically save to database
    useToast().toast({
      title: "Settings saved!",
      description: "Your preferences have been updated successfully."
    });
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-8">
        <SectionHeader
          title="Settings"
          subtitle="Manage your account and application preferences"
          icon={SettingsIcon}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <GlassmorphicCard className="p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              Profile Settings
            </h3>
            <div className="space-y-4">
              <FormInput
                label="Display Name"
                id="displayName"
                value={profile.displayName}
                onChange={(value) => setProfile(prev => ({ ...prev, displayName: value }))}
                placeholder="Enter your display name"
                required
              />
              <FormInput
                label="Email"
                id="email"
                type="email"
                value={profile.email}
                onChange={(value) => setProfile(prev => ({ ...prev, email: value }))}
                placeholder="your.email@example.com"
                required
              />
              <FormSelect
                label="Time Zone"
                id="timezone"
                value={profile.timezone}
                onChange={(value) => setProfile(prev => ({ ...prev, timezone: value }))}
                options={[
                  { value: 'UTC', label: 'UTC' },
                  { value: 'America/New_York', label: 'Eastern Time' },
                  { value: 'America/Chicago', label: 'Central Time' },
                  { value: 'America/Denver', label: 'Mountain Time' },
                  { value: 'America/Los_Angeles', label: 'Pacific Time' },
                  { value: 'Europe/London', label: 'London' },
                  { value: 'Europe/Paris', label: 'Paris' },
                  { value: 'Asia/Tokyo', label: 'Tokyo' },
                  { value: 'Asia/Kolkata', label: 'India Standard Time' }
                ]}
                required
              />
            </div>
          </GlassmorphicCard>

          {/* Notification Preferences */}
          <GlassmorphicCard className="p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Bell className="h-5 w-5 text-green-600" />
              </div>
              Notification Preferences
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-sm">Daily Practice Reminders</label>
                  <p className="text-xs text-muted-foreground">Get reminded to log your daily practice</p>
                </div>
                <NeumorphicToggle
                  checked={notifications.dailyReminders}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, dailyReminders: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-sm">Weekly Goal Check-ins</label>
                  <p className="text-xs text-muted-foreground">Weekly progress summaries and goal reviews</p>
                </div>
                <NeumorphicToggle
                  checked={notifications.weeklyCheckIns}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, weeklyCheckIns: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-sm">Achievement Notifications</label>
                  <p className="text-xs text-muted-foreground">Celebrate milestones and badges earned</p>
                </div>
                <NeumorphicToggle
                  checked={notifications.achievements}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, achievements: checked }))
                  }
                />
              </div>

              <div className="pt-4 border-t border-border/50">
                <FormSelect
                  label="Reminder Time"
                  id="reminderTime"
                  value={notifications.reminderTime}
                  onChange={(value) => setNotifications(prev => ({ ...prev, reminderTime: value }))}
                  options={[
                    { value: '08:00', label: '8:00 AM' },
                    { value: '12:00', label: '12:00 PM' },
                    { value: '17:00', label: '5:00 PM' },
                    { value: '20:00', label: '8:00 PM' },
                    { value: '21:00', label: '9:00 PM' }
                  ]}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <NeumorphicToggle
                    checked={notifications.email}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, email: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Push</span>
                  </div>
                  <NeumorphicToggle
                    checked={notifications.push}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, push: checked }))
                    }
                  />
                </div>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Theme & Appearance */}
          <GlassmorphicCard className="p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Palette className="h-5 w-5 text-purple-600" />
              </div>
              Theme & Appearance
            </h3>
            <div className="space-y-4">
              <FormSelect
                label="Theme Mode"
                id="theme"
                value={appearance.theme}
                onChange={(value) => setAppearance(prev => ({ ...prev, theme: value }))}
                options={[
                  { value: 'light', label: 'Light Mode' },
                  { value: 'dark', label: 'Dark Mode' },
                  { value: 'system', label: 'System Default' }
                ]}
                required
              />
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-sm">High Contrast Mode</label>
                  <p className="text-xs text-muted-foreground">Enhance contrast for better visibility</p>
                </div>
                <NeumorphicToggle
                  checked={appearance.highContrast}
                  onCheckedChange={(checked) => 
                    setAppearance(prev => ({ ...prev, highContrast: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-sm">Animations</label>
                  <p className="text-xs text-muted-foreground">Enable smooth transitions and effects</p>
                </div>
                <NeumorphicToggle
                  checked={appearance.animations}
                  onCheckedChange={(checked) => 
                    setAppearance(prev => ({ ...prev, animations: checked }))
                  }
                />
              </div>
            </div>
          </GlassmorphicCard>

          {/* Privacy & Security */}
          <GlassmorphicCard className="p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              Privacy & Security
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-sm">Data Analytics</label>
                  <p className="text-xs text-muted-foreground">Help improve the app with anonymous usage data</p>
                </div>
                <NeumorphicToggle
                  checked={privacy.analytics}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, analytics: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-sm">Public Profile</label>
                  <p className="text-xs text-muted-foreground">Allow others to view your progress statistics</p>
                </div>
                <NeumorphicToggle
                  checked={privacy.publicProfile}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, publicProfile: checked }))
                  }
                />
              </div>
              
              <div className="pt-4">
                <Button variant="destructive" size="sm" className="w-full">
                  Delete Account
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  This action cannot be undone
                </p>
              </div>
            </div>
          </GlassmorphicCard>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg" className="min-w-32">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};
