
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

  // Generate sparkline data based on real data
  const generateSparklineData = (baseValue: number) => {
    return Array.from({ length: 7 }, (_, i) => ({
      value: Math.max(0, baseValue + Math.floor(Math.random() * 20) - 10)
    }));
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-4 md:p-6 space-y-8">
          <LoadingSkeleton className="h-20 w-full" />
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

  const weeklyProgress = summary.totalGoals > 0 ? (summary.completedGoals / summary.totalGoals) * 100 : 0;
  const problemsSparklineData = generateSparklineData(summary.problemsThisWeek);
  const weeklySparklineData = generateSparklineData(summary.hoursThisWeek);

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
                <div className="w-16 h-5">
                  <SparklineChart data={problemsSparklineData} color="#3B82F6" height={20} />
                </div>
              </div>
            </div>
          </GlassmorphicCard>

          <StatsCard
            title="Study Hours"
            value={summary.hoursThisWeek.toString()}
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
                <ProgressRing progress={weeklyProgress} size={80} />
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{summary.completedGoals}/{summary.totalGoals}</p>
                  <p className="text-xs text-muted-foreground">Goals completed</p>
                  <div className="w-20 h-4">
                    <SparklineChart data={weeklySparklineData} color="#10B981" height={16} />
                  </div>
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
                {summary.totalProblems > 0 ? (
                  <>
                    <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">Dynamic Programming Practice</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">LeetCode</Badge>
                          <Badge variant="secondary" className="text-xs">Medium</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Today</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">Array Manipulation</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">HackerRank</Badge>
                          <Badge variant="default" className="text-xs">Easy</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Yesterday</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No recent activity. Start logging your practice sessions!</p>
                  </div>
                )}
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
                  <span className="text-sm">Total Problems</span>
                  <span className="font-bold">{summary.totalProblems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Contests Joined</span>
                  <span className="font-bold">{summary.totalContests}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Badges Earned</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{summary.badgesEarned}</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </div>
            </EnhancedCard>

            <GlassmorphicCard className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">Progress</h3>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold">{summary.problemsThisWeek}</p>
                  <p className="text-sm text-muted-foreground">Problems This Week</p>
                  <Badge variant="secondary">
                    {summary.hoursThisWeek}h studied
                  </Badge>
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
