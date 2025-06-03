
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { SectionHeader } from '@/components/ui/section-header';
import { StatsCard } from '@/components/ui/stats-card';
import { StreakCounter } from '@/components/ui/streak-counter';
import { SummaryCard } from '@/components/ui/summary-card';
import { ProgressRing } from '@/components/ui/progress-ring';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { GlassmorphicCard } from '@/components/ui/glassmorphic-card';
import { SparklineChart } from '@/components/ui/sparkline-chart';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDashboardData } from '@/hooks/useDashboardData';
import { 
  Trophy, 
  Target, 
  Clock, 
  BookOpen, 
  TrendingUp,
  Calendar,
  Code2,
  Award,
  Users,
  Zap
} from 'lucide-react';

export const Dashboard = () => {
  const { summary, loading } = useDashboardData();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Mock data for demonstration - replace with real data from hooks
  const mockSparklineData = [65, 78, 90, 81, 56, 89, 72].map(value => ({ value }));
  const mockWeeklyData = [12, 19, 15, 22, 18, 25, 20].map(value => ({ value }));

  if (loading) {
    return (
      <AppLayout>
        <div className="p-4 md:p-6 space-y-8">
          <LoadingSkeleton className="h-16 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingSkeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingSkeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-8">
        {/* Header */}
        <SectionHeader
          title="Dashboard"
          subtitle="Track your progress and achieve your coding goals"
          icon={Trophy}
        />

        {/* Stats Grid - Asymmetrical Layout */}
        <div className={`asymmetric-grid transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <GlassmorphicCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Problems Solved</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">{summary.totalProblems}</span>
                  <Badge variant="secondary" className="text-xs">
                    +{summary.problemsThisWeek} this week
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Code2 className="h-8 w-8 text-blue-500" />
                <SparklineChart data={mockSparklineData} width={60} height={20} />
              </div>
            </div>
          </GlassmorphicCard>

          <StatsCard
            title="Study Hours"
            value={summary.hoursThisWeek}
            change={15.2}
            changeLabel="from last week"
            icon={Clock}
            trend="up"
          />

          <GlassmorphicCard className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Weekly Progress</h3>
                <Target className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center space-x-4">
                <ProgressRing progress={68} size={80} />
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{summary.problemsThisWeek}/25</p>
                  <p className="text-xs text-muted-foreground">Problems this week</p>
                  <SparklineChart data={mockWeeklyData} width={80} height={16} />
                </div>
              </div>
            </div>
          </GlassmorphicCard>

          <StreakCounter
            currentStreak={summary.currentStreak}
            longestStreak={15}
            lastActivity={new Date()}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <SummaryCard
              title="Recent Activity"
              subtitle="Your latest coding sessions"
              icon={BookOpen}
              badges={[{ label: "Active", variant: "default" }]}
            >
              <div className="space-y-4">
                {[
                  { title: "Dynamic Programming - House Robber", platform: "LeetCode", difficulty: "Medium", time: "45 min" },
                  { title: "Binary Tree - Inorder Traversal", platform: "HackerRank", difficulty: "Easy", time: "20 min" },
                  { title: "Graph - Shortest Path", platform: "Codeforces", difficulty: "Hard", time: "1.2 hrs" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">{activity.platform}</Badge>
                        <Badge 
                          variant={activity.difficulty === 'Easy' ? 'default' : activity.difficulty === 'Medium' ? 'secondary' : 'destructive'} 
                          className="text-xs"
                        >
                          {activity.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SummaryCard>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <EnhancedCard
              title="This Month"
              subtitle="Your achievements"
              icon={Award}
              className="p-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Contest Rank</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">#342</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Problems Solved</span>
                  <span className="font-bold">{summary.totalProblems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Study Days</span>
                  <span className="font-bold">23/31</span>
                </div>
              </div>
            </EnhancedCard>

            <GlassmorphicCard className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">Community</h3>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold">#1,247</p>
                  <p className="text-sm text-muted-foreground">Global Ranking</p>
                  <Badge variant="secondary">Top 15%</Badge>
                </div>
              </div>
            </GlassmorphicCard>

            <EnhancedCard
              title="Quick Actions"
              icon={Zap}
              className="p-6"
            >
              <div className="space-y-3">
                <Button variant="default" className="w-full" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Log Today's Practice
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Trophy className="h-4 w-4 mr-2" />
                  View Contest Schedule
                </Button>
              </div>
            </EnhancedCard>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
