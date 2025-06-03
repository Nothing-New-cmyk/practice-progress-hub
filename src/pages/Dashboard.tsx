
import { AppLayout } from '@/components/layouts/AppLayout';
import { SectionHeader } from '@/components/ui/section-header';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { EnhancedProgress } from '@/components/ui/enhanced-progress';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { StreakCounter } from '@/components/ui/streak-counter';
import { DifficultyChart } from '@/components/charts/DifficultyChart';
import { ActivityHeatmap } from '@/components/charts/ActivityHeatmap';
import { ProblemRecommendations } from '@/components/features/ProblemRecommendations';
import { StudyPlan } from '@/components/features/StudyPlan';
import { TopicProgress } from '@/components/features/TopicProgress';
import { StudyTimer } from '@/components/features/StudyTimer';
import { Achievements } from '@/components/features/Achievements';
import { QuickLogger } from '@/components/features/QuickLogger';
import { Button } from '@/components/ui/button';
import { useDashboardData } from '@/hooks/useDashboardData';
import { 
  Target, 
  Clock, 
  Award, 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  Zap, 
  Brain, 
  Trophy,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { summary, loading } = useDashboardData();

  const difficultyData = [
    { difficulty: 'Easy', count: Math.floor(summary.totalProblems * 0.5), color: '#10B981' },
    { difficulty: 'Medium', count: Math.floor(summary.totalProblems * 0.35), color: '#F59E0B' },
    { difficulty: 'Hard', count: Math.floor(summary.totalProblems * 0.15), color: '#EF4444' }
  ];

  const heatmapData = [
    { date: '2024-05-01', count: 3, level: 2 as const },
    { date: '2024-05-02', count: 5, level: 3 as const },
    { date: '2024-05-03', count: 1, level: 1 as const },
  ];

  if (loading) {
    return (
      <AppLayout showFAB={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const weeklyGoalProgress = summary.totalGoals > 0 ? Math.round((summary.completedGoals / summary.totalGoals) * 100) : 0;

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-8">
        {/* Header */}
        <SectionHeader
          title="Dashboard"
          subtitle="Track your DSA progress and achievements"
          icon={BarChart3}
        />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <EnhancedCard
            title="Problems This Week"
            icon={Target}
            iconColor="bg-blue-100 text-blue-600"
            gradient
            hover
          >
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <AnimatedCounter 
                  value={summary.problemsThisWeek} 
                  className="text-3xl font-bold text-blue-600"
                />
                <span className="text-sm text-muted-foreground">problems</span>
              </div>
              <EnhancedProgress
                value={summary.problemsThisWeek}
                max={20}
                variant="default"
                size="sm"
                animated
              />
              <div className="flex items-center gap-2">
                <EnhancedBadge variant="success" size="sm" icon={TrendingUp}>
                  +12%
                </EnhancedBadge>
                <span className="text-xs text-muted-foreground">vs last week</span>
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard
            title="Time This Week"
            icon={Clock}
            iconColor="bg-green-100 text-green-600"
            gradient
            hover
          >
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <AnimatedCounter 
                  value={summary.hoursThisWeek} 
                  className="text-3xl font-bold text-green-600"
                />
                <span className="text-sm text-muted-foreground">hours</span>
              </div>
              <div className="flex items-center gap-2">
                <EnhancedBadge variant="success" size="sm" icon={TrendingUp}>
                  +8%
                </EnhancedBadge>
                <span className="text-xs text-muted-foreground">focused practice</span>
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard
            title="Weekly Goals"
            icon={CheckCircle}
            iconColor="bg-yellow-100 text-yellow-600"
            gradient
            hover
          >
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <AnimatedCounter 
                  value={weeklyGoalProgress} 
                  suffix="%" 
                  className="text-3xl font-bold text-yellow-600"
                />
                <span className="text-sm text-muted-foreground">complete</span>
              </div>
              <EnhancedProgress
                value={weeklyGoalProgress}
                variant="warning"
                size="sm"
                animated
              />
              <span className="text-xs text-muted-foreground">
                {summary.completedGoals}/{summary.totalGoals} goals achieved
              </span>
            </div>
          </EnhancedCard>

          <EnhancedCard
            title="Total Solved"
            icon={Award}
            iconColor="bg-purple-100 text-purple-600"
            gradient
            hover
          >
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <AnimatedCounter 
                  value={summary.totalProblems} 
                  className="text-3xl font-bold text-purple-600"
                />
                <span className="text-sm text-muted-foreground">problems</span>
              </div>
              <div className="flex items-center gap-2">
                <EnhancedBadge variant="success" size="sm" icon={TrendingUp}>
                  +5
                </EnhancedBadge>
                <span className="text-xs text-muted-foreground">all time</span>
              </div>
            </div>
          </EnhancedCard>
        </div>

        {/* First Row - Essential Features */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <StreakCounter 
              currentStreak={summary.currentStreak} 
              longestStreak={15}
            />
            <QuickLogger />
          </div>
          
          <div className="space-y-6">
            <StudyTimer />
            
            <EnhancedCard
              title="Quick Actions"
              icon={Zap}
              iconColor="bg-indigo-100 text-indigo-600"
              gradient
            >
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  asChild 
                  className="h-auto p-4 flex-col gap-2 transition-all duration-300 hover:scale-105"
                >
                  <Link to="/daily-log">
                    <BookOpen className="h-5 w-5" />
                    <span className="text-sm font-medium">Log Practice</span>
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="h-auto p-4 flex-col gap-2 transition-all duration-300 hover:scale-105"
                >
                  <Link to="/contest-log">
                    <Trophy className="h-5 w-5" />
                    <span className="text-sm font-medium">Log Contest</span>
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="h-auto p-4 flex-col gap-2 transition-all duration-300 hover:scale-105"
                >
                  <Link to="/weekly-goals">
                    <Target className="h-5 w-5" />
                    <span className="text-sm font-medium">Set Goals</span>
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="h-auto p-4 flex-col gap-2 transition-all duration-300 hover:scale-105"
                >
                  <Link to="/settings">
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-sm font-medium">Settings</span>
                  </Link>
                </Button>
              </div>
            </EnhancedCard>
          </div>
        </div>

        {/* Second Row - Analytics and Progress */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-6">
            <DifficultyChart data={difficultyData} />
            <TopicProgress />
          </div>
          
          <div className="space-y-6">
            <ProblemRecommendations />
            <Achievements />
          </div>
        </div>

        {/* Third Row - Study Plan and Stats */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <StudyPlan />
          
          <EnhancedCard
            title="Performance Overview"
            icon={Brain}
            iconColor="bg-purple-100 text-purple-600"
            gradient
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
                  <Trophy className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <AnimatedCounter 
                    value={summary.totalContests} 
                    className="text-2xl font-bold text-blue-600"
                  />
                  <div className="text-sm text-blue-600 font-medium">Contests</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200/50">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <AnimatedCounter 
                    value={summary.totalGoals} 
                    className="text-2xl font-bold text-green-600"
                  />
                  <div className="text-sm text-green-600 font-medium">Goals Set</div>
                </div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/50">
                <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <AnimatedCounter 
                  value={summary.badgesEarned} 
                  className="text-2xl font-bold text-purple-600"
                />
                <div className="text-sm text-purple-600 font-medium">Badges Earned</div>
              </div>
            </div>
          </EnhancedCard>
        </div>

        {/* Activity Heatmap */}
        <ActivityHeatmap data={heatmapData} />

        {/* Performance Insights */}
        <EnhancedCard
          title="Performance Insights"
          icon={BarChart3}
          iconColor="bg-indigo-100 text-indigo-600"
          gradient
        >
          {summary.totalProblems === 0 ? (
            <div className="text-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Your Journey</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Begin by logging your first practice session or contest participation to see detailed insights
              </p>
              <div className="flex gap-3 justify-center">
                <Button asChild size="lg">
                  <Link to="/daily-log">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Log Practice Session
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contest-log">
                    <Trophy className="h-4 w-4 mr-2" />
                    Log Contest
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-blue-200/50 rounded-xl bg-gradient-to-br from-blue-50/50 to-transparent">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    This Week's Progress
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Problems Solved</span>
                      <span className="font-semibold">{summary.problemsThisWeek}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Time Practiced</span>
                      <span className="font-semibold">{summary.hoursThisWeek}h</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border border-green-200/50 rounded-xl bg-gradient-to-br from-green-50/50 to-transparent">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Star className="h-4 w-4 text-green-600" />
                    Overall Stats
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Problems</span>
                      <span className="font-semibold">{summary.totalProblems}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Goals Completed</span>
                      <span className="font-semibold">{summary.completedGoals}/{summary.totalGoals}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button asChild>
                  <Link to="/weekly-goals">
                    <Target className="h-4 w-4 mr-2" />
                    Manage Goals
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </EnhancedCard>
      </div>
    </AppLayout>
  );
};
