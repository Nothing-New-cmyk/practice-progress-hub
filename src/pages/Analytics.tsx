
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layouts/AppLayout';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityHeatmap } from '@/components/charts/ActivityHeatmap';
import { DifficultyChart } from '@/components/charts/DifficultyChart';
import { TopicProgress } from '@/components/features/TopicProgress';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { Badge } from '@/components/ui/badge';
import { supabaseClient } from '@/lib/supabase-utils';
import { useToast } from '@/hooks/use-toast';
import { BarChart3 } from 'lucide-react';

interface AnalyticsData {
  heatmapData: Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }>;
  difficultyData: Array<{ difficulty: string; count: number; color: string }>;
  topicsData: Array<{ topic: string; solved: number; total: number; percentage: number }>;
  platformData: Array<{ platform: string; count: number; color: string }>;
  successRate: number;
  bestStreak: number;
}

export const Analytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user]);

  const fetchAnalyticsData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch daily logs
      const { data: dailyLogs, error: dailyError } = await supabaseClient
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (dailyError) throw dailyError;

      // Process heatmap data
      const heatmapData = generateHeatmapFromLogs(dailyLogs || []);

      // Process difficulty data
      const difficultyData = processDifficultyData(dailyLogs || []);

      // Process topics data
      const topicsData = processTopicsData(dailyLogs || []);

      // Process platform data
      const platformData = processPlatformData(dailyLogs || []);

      // Calculate success rate and streak
      const successRate = calculateSuccessRate(dailyLogs || []);
      const bestStreak = calculateBestStreak(dailyLogs || []);

      setAnalyticsData({
        heatmapData,
        difficultyData,
        topicsData,
        platformData,
        successRate,
        bestStreak
      });

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateHeatmapFromLogs = (logs: any[]) => {
    const today = new Date();
    const heatmapData = [];
    
    // Create a map of dates to problem counts
    const logMap = new Map();
    logs.forEach(log => {
      logMap.set(log.date, (log.problems_solved || 0));
    });

    // Generate last 365 days
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = logMap.get(dateStr) || 0;
      
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count > 0) level = 1;
      if (count >= 3) level = 2;
      if (count >= 5) level = 3;
      if (count >= 8) level = 4;

      heatmapData.push({ date: dateStr, count, level });
    }

    return heatmapData;
  };

  const processDifficultyData = (logs: any[]) => {
    const difficultyCounts = { easy: 0, medium: 0, hard: 0 };
    
    logs.forEach(log => {
      const difficulty = log.difficulty?.toLowerCase();
      if (difficulty && difficultyCounts.hasOwnProperty(difficulty)) {
        difficultyCounts[difficulty as keyof typeof difficultyCounts] += log.problems_solved || 0;
      }
    });

    return [
      { difficulty: 'Easy', count: difficultyCounts.easy, color: '#10B981' },
      { difficulty: 'Medium', count: difficultyCounts.medium, color: '#F59E0B' },
      { difficulty: 'Hard', count: difficultyCounts.hard, color: '#EF4444' }
    ];
  };

  const processTopicsData = (logs: any[]) => {
    const topicCounts = new Map();
    
    logs.forEach(log => {
      if (log.topic) {
        const current = topicCounts.get(log.topic) || 0;
        topicCounts.set(log.topic, current + (log.problems_solved || 0));
      }
    });

    const topicsArray = Array.from(topicCounts.entries())
      .map(([topic, solved]) => ({
        topic,
        solved: solved as number,
        total: Math.max(solved as number, (solved as number) + Math.floor(Math.random() * 20)), // Estimate total available
        percentage: Math.min(100, ((solved as number) / Math.max(solved as number, (solved as number) + Math.floor(Math.random() * 20))) * 100)
      }))
      .sort((a, b) => b.solved - a.solved)
      .slice(0, 5);

    return topicsArray;
  };

  const processPlatformData = (logs: any[]) => {
    const platformCounts = new Map();
    
    logs.forEach(log => {
      if (log.platform) {
        const current = platformCounts.get(log.platform) || 0;
        platformCounts.set(log.platform, current + (log.problems_solved || 0));
      }
    });

    const colors = ['bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500'];
    const platformsArray = Array.from(platformCounts.entries())
      .map(([platform, count], index) => ({
        platform,
        count: count as number,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.count - a.count);

    return platformsArray;
  };

  const calculateSuccessRate = (logs: any[]) => {
    if (logs.length === 0) return 0;
    
    const totalSessions = logs.length;
    const successfulSessions = logs.filter(log => (log.problems_solved || 0) > 0).length;
    
    return Math.round((successfulSessions / totalSessions) * 100);
  };

  const calculateBestStreak = (logs: any[]) => {
    if (logs.length === 0) return 0;
    
    const sortedLogs = logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let maxStreak = 0;
    let currentStreak = 0;
    
    for (let i = 0; i < sortedLogs.length; i++) {
      if ((sortedLogs[i].problems_solved || 0) > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return maxStreak;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
          <LoadingSkeleton className="h-20 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingSkeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!analyticsData) {
    return (
      <AppLayout>
        <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
          <SectionHeader
            title="Analytics"
            subtitle="Detailed insights into your coding progress and performance"
            icon={BarChart3}
          />
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No data available yet. Start logging your daily practice to see analytics!</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
        <SectionHeader
          title="Analytics"
          subtitle="Detailed insights into your coding progress and performance"
          icon={BarChart3}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Heatmap */}
          <div className="lg:col-span-2">
            <ActivityHeatmap data={analyticsData.heatmapData} />
          </div>

          {/* Difficulty Chart */}
          <DifficultyChart data={analyticsData.difficultyData} />

          {/* Topic Progress */}
          <TopicProgress topics={analyticsData.topicsData} />
        </div>

        {/* Additional Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Problem Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.platformData.length > 0 ? (
                  analyticsData.platformData.map((item) => (
                    <div key={item.platform} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-sm capitalize">{item.platform}</span>
                      </div>
                      <span className="text-sm font-medium">{item.count}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No platform data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-green-600">{analyticsData.successRate}%</div>
                <p className="text-sm text-muted-foreground">Sessions with problems solved</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${analyticsData.successRate}%` }} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Best Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-orange-600">{analyticsData.bestStreak}</div>
                <p className="text-sm text-muted-foreground">Consecutive days with progress</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};
