
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layouts/AppLayout';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabaseClient } from '@/lib/supabase-utils';
import { User, Trophy, Target, Calendar, Clock, Award } from 'lucide-react';

interface ProfileData {
  first_name?: string;
  last_name?: string;
  time_zone?: string;
  total_problems: number;
  total_time: number;
  contests_participated: number;
  current_streak: number;
  favorite_topics: string[];
}

export const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    time_zone: 'UTC',
    total_problems: 0,
    total_time: 0,
    contests_participated: 0,
    current_streak: 0,
    favorite_topics: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Fetch statistics
      const { data: dailyLogs, error: dailyError } = await supabaseClient
        .from('daily_logs')
        .select('problems_solved, time_spent_minutes, topic')
        .eq('user_id', user.id);

      if (dailyError) throw dailyError;

      const { data: contestLogs, error: contestError } = await supabaseClient
        .from('contest_logs')
        .select('id')
        .eq('user_id', user.id);

      if (contestError) throw contestError;

      // Calculate statistics
      const totalProblems = dailyLogs?.reduce((sum, log) => sum + log.problems_solved, 0) || 0;
      const totalTime = dailyLogs?.reduce((sum, log) => sum + log.time_spent_minutes, 0) || 0;
      const contestsParticipated = contestLogs?.length || 0;

      // Get favorite topics
      const topicCounts = dailyLogs?.reduce((acc: Record<string, number>, log) => {
        acc[log.topic] = (acc[log.topic] || 0) + log.problems_solved;
        return acc;
      }, {}) || {};

      const favoriteTopics = Object.entries(topicCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([topic]) => topic);

      setProfile({
        first_name: profileData?.first_name || '',
        last_name: profileData?.last_name || '',
        time_zone: profileData?.time_zone || 'UTC',
        total_problems: totalProblems,
        total_time: totalTime,
        contests_participated: contestsParticipated,
        current_streak: 0, // TODO: Calculate streak
        favorite_topics: favoriteTopics
      });

    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to fetch profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabaseClient
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          time_zone: profile.time_zone,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const userInitials = `${profile.first_name?.charAt(0) || ''}${profile.last_name?.charAt(0) || ''}`.toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-8 max-w-4xl mx-auto">
        <SectionHeader
          title="My Profile"
          subtitle="Manage your profile and view your coding journey statistics"
          icon={User}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-2xl font-bold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {profile.first_name} {profile.last_name}
                    </h3>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.first_name}
                      onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.last_name}
                      onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="timezone">Time Zone</Label>
                  <Input
                    id="timezone"
                    value={profile.time_zone}
                    onChange={(e) => setProfile({ ...profile, time_zone: e.target.value })}
                    placeholder="UTC"
                  />
                </div>

                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Problems Solved</span>
                  <span className="font-bold text-green-600">{profile.total_problems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Time Spent</span>
                  <span className="font-bold text-blue-600">{Math.floor(profile.total_time / 60)}h {profile.total_time % 60}m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Contests</span>
                  <span className="font-bold text-purple-600">{profile.contests_participated}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Streak</span>
                  <span className="font-bold text-orange-600">{profile.current_streak} days</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Favorite Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.favorite_topics.map((topic, index) => (
                    <Badge key={index} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                  {profile.favorite_topics.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Start solving problems to see your favorite topics!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Account Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Target className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{profile.total_problems}</p>
                <p className="text-sm text-muted-foreground">Total Problems</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Clock className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{Math.floor(profile.total_time / 60)}</p>
                <p className="text-sm text-muted-foreground">Hours Practiced</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Trophy className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">{profile.contests_participated}</p>
                <p className="text-sm text-muted-foreground">Contests Joined</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Award className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold">{profile.current_streak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};
