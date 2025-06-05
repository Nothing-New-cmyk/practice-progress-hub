
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layouts/AppLayout';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReminderSettings } from '@/components/features/ReminderSettings';
import { useToast } from '@/hooks/use-toast';
import { supabaseClient } from '@/lib/supabase-utils';
import { Settings as SettingsIcon, User, Bell, Palette, Shield, Download, AlertCircle } from 'lucide-react';

export const Settings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    timezone: 'UTC'
  });
  const [preferences, setPreferences] = useState({
    darkMode: false,
    compactLayout: false,
    showAnimations: true,
    publicProfile: false,
    analyticsTracking: true,
    showInLeaderboards: false
  });

  useEffect(() => {
    if (user) {
      fetchProfileData();
      loadPreferences();
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          email: user.email || '',
          timezone: data.time_zone || 'UTC'
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const loadPreferences = () => {
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error parsing preferences:', error);
      }
    }
  };

  const savePreferences = (newPreferences: typeof preferences) => {
    localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
    setPreferences(newPreferences);
    
    // Apply theme changes immediately
    if (newPreferences.darkMode !== preferences.darkMode) {
      document.documentElement.classList.toggle('dark', newPreferences.darkMode);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabaseClient
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: profile.firstName,
          last_name: profile.lastName,
          time_zone: profile.timezone,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Fetch all user data
      const [dailyLogs, contestLogs, weeklyGoals] = await Promise.all([
        supabaseClient.from('daily_logs').select('*').eq('user_id', user.id),
        supabaseClient.from('contest_logs').select('*').eq('user_id', user.id),
        supabaseClient.from('weekly_goals').select('*').eq('user_id', user.id)
      ]);

      const exportData = {
        profile,
        dailyLogs: dailyLogs.data || [],
        contestLogs: contestLogs.data || [],
        weeklyGoals: weeklyGoals.data || [],
        exportDate: new Date().toISOString()
      };

      // Create and download JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `coding-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: "Your data has been exported successfully.",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export your data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.prompt(
      'This action cannot be undone. Type "DELETE" to confirm account deletion:'
    );
    
    if (confirmation !== 'DELETE') {
      return;
    }

    if (!user) return;
    setLoading(true);

    try {
      // Delete all user data
      await Promise.all([
        supabaseClient.from('daily_logs').delete().eq('user_id', user.id),
        supabaseClient.from('contest_logs').delete().eq('user_id', user.id),
        supabaseClient.from('weekly_goals').delete().eq('user_id', user.id),
        supabaseClient.from('profiles').delete().eq('id', user.id)
      ]);

      // Sign out and show message
      await signOut();
      
      toast({
        title: "Account Deleted",
        description: "Your account and all data have been permanently deleted.",
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Deletion Failed",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-8 max-w-4xl mx-auto">
        <SectionHeader
          title="Settings"
          subtitle="Manage your account and preferences"
          icon={SettingsIcon}
        />

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Data</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profile.timezone} onValueChange={(value) => setProfile({ ...profile, timezone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Asia/Kolkata">India Standard Time</SelectItem>
                      <SelectItem value="Europe/London">London Time</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo Time</SelectItem>
                      <SelectItem value="Australia/Sydney">Sydney Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveProfile} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <ReminderSettings />
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                  </div>
                  <Switch 
                    checked={preferences.darkMode}
                    onCheckedChange={(checked) => savePreferences({ ...preferences, darkMode: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compact Layout</Label>
                    <p className="text-sm text-muted-foreground">Use a more condensed interface</p>
                  </div>
                  <Switch 
                    checked={preferences.compactLayout}
                    onCheckedChange={(checked) => savePreferences({ ...preferences, compactLayout: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Animations</Label>
                    <p className="text-sm text-muted-foreground">Enable smooth transitions and animations</p>
                  </div>
                  <Switch 
                    checked={preferences.showAnimations}
                    onCheckedChange={(checked) => savePreferences({ ...preferences, showAnimations: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Make Profile Public</Label>
                    <p className="text-sm text-muted-foreground">Allow others to see your progress</p>
                  </div>
                  <Switch 
                    checked={preferences.publicProfile}
                    onCheckedChange={(checked) => savePreferences({ ...preferences, publicProfile: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Analytics Tracking</Label>
                    <p className="text-sm text-muted-foreground">Help improve the app with usage data</p>
                  </div>
                  <Switch 
                    checked={preferences.analyticsTracking}
                    onCheckedChange={(checked) => savePreferences({ ...preferences, analyticsTracking: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show in Leaderboards</Label>
                    <p className="text-sm text-muted-foreground">Display your ranking to other users</p>
                  </div>
                  <Switch 
                    checked={preferences.showInLeaderboards}
                    onCheckedChange={(checked) => savePreferences({ ...preferences, showInLeaderboards: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Export Data</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Download all your practice logs, goals, and progress data as a JSON file
                  </p>
                  <Button variant="outline" onClick={handleExportData} disabled={loading}>
                    <Download className="h-4 w-4 mr-2" />
                    {loading ? 'Exporting...' : 'Export My Data'}
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <Label className="text-red-600 font-semibold">Danger Zone</Label>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleDeleteAccount}
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Delete Account'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};
